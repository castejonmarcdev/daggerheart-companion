/**
 * PDF Field Analysis Script
 *
 * This script helps identify form field names in the character sheet PDFs.
 * The field names are obfuscated (e.g., text_1ndka) so we need to map them
 * to their actual purposes.
 *
 * Usage:
 *   node scripts/analyzePdfFields.cjs [pdfPath] [--fill fieldName=value]
 *
 * Examples:
 *   node scripts/analyzePdfFields.cjs                    # Analyze Bard.pdf
 *   node scripts/analyzePdfFields.cjs Wizard.pdf         # Analyze Wizard.pdf
 *   node scripts/analyzePdfFields.cjs --fill text_1ndka=TEST  # Fill a field to test
 */

const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

const CHARACTER_SHEETS_DIR = path.join(__dirname, '../public/character-sheets');

async function analyzePdf(pdfPath, fillData = null) {
  console.log(`\nAnalyzing: ${pdfPath}\n`);

  const pdfBytes = fs.readFileSync(pdfPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const form = pdfDoc.getForm();
  const fields = form.getFields();

  console.log(`Total fields: ${fields.length}\n`);

  // Categorize fields
  const textFields = [];
  const checkboxFields = [];
  const radioGroups = [];
  const otherFields = [];

  fields.forEach(field => {
    const name = field.getName();
    const type = field.constructor.name;

    if (type === 'PDFTextField') {
      textFields.push(name);
    } else if (type === 'PDFCheckBox') {
      checkboxFields.push(name);
    } else if (type === 'PDFRadioGroup') {
      radioGroups.push(name);
    } else {
      otherFields.push({ name, type });
    }
  });

  // Print summary
  console.log('=== FIELD SUMMARY ===');
  console.log(`Text fields: ${textFields.length}`);
  console.log(`Checkboxes: ${checkboxFields.length}`);
  console.log(`Radio groups: ${radioGroups.length}`);
  console.log(`Other: ${otherFields.length}`);
  console.log('');

  // Print first 50 text fields (most useful for character data)
  console.log('=== FIRST 50 TEXT FIELDS ===');
  textFields.slice(0, 50).forEach((name, i) => {
    console.log(`${i + 1}. ${name}`);
  });

  // If fill data provided, fill the field and save
  if (fillData) {
    const [fieldName, value] = fillData.split('=');
    console.log(`\nFilling field "${fieldName}" with value "${value}"...`);

    try {
      const field = form.getTextField(fieldName);
      field.setText(value);

      const outputPath = pdfPath.replace('.pdf', '_filled.pdf');
      const filledBytes = await pdfDoc.save();
      fs.writeFileSync(outputPath, filledBytes);
      console.log(`Saved to: ${outputPath}`);
    } catch (e) {
      console.error(`Error: Could not fill field "${fieldName}": ${e.message}`);
    }
  }

  // Look for fields that might match common character sheet fields
  console.log('\n=== POTENTIAL FIELD MATCHES ===');
  console.log('(First few text fields - likely header fields like name, ancestry, etc.)');

  textFields.slice(0, 20).forEach((name, i) => {
    console.log(`Field ${i + 1}: ${name}`);
  });

  return { textFields, checkboxFields, radioGroups };
}

async function findFieldWithValue(pdfPath, searchValue) {
  const pdfBytes = fs.readFileSync(pdfPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const form = pdfDoc.getForm();
  const fields = form.getFields();

  console.log(`\nSearching for value "${searchValue}" in ${pdfPath}...\n`);

  fields.forEach(field => {
    const name = field.getName();
    const type = field.constructor.name;

    if (type === 'PDFTextField') {
      try {
        const text = field.getText();
        if (text && text.includes(searchValue)) {
          console.log(`FOUND in field: ${name}`);
          console.log(`  Value: ${text}`);
        }
      } catch (e) {
        // Skip fields that can't be read
      }
    }
  });
}

// Main
async function main() {
  const args = process.argv.slice(2);

  let pdfName = 'Bard.pdf';
  let fillData = null;
  let searchValue = null;

  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--fill' && args[i + 1]) {
      fillData = args[i + 1];
      i++;
    } else if (args[i] === '--search' && args[i + 1]) {
      searchValue = args[i + 1];
      i++;
    } else if (!args[i].startsWith('--')) {
      pdfName = args[i];
    }
  }

  const pdfPath = path.join(CHARACTER_SHEETS_DIR, pdfName);

  if (!fs.existsSync(pdfPath)) {
    console.error(`PDF not found: ${pdfPath}`);
    console.log('\nAvailable PDFs:');
    fs.readdirSync(CHARACTER_SHEETS_DIR)
      .filter(f => f.endsWith('.pdf'))
      .forEach(f => console.log(`  - ${f}`));
    process.exit(1);
  }

  if (searchValue) {
    await findFieldWithValue(pdfPath, searchValue);
  } else {
    await analyzePdf(pdfPath, fillData);
  }
}

main().catch(console.error);
