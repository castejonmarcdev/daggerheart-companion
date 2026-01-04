/**
 * Fill multiple test values to identify fields visually
 */

const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

const CHARACTER_SHEETS_DIR = path.join(__dirname, '../public/character-sheets');

async function fillTestValues(pdfName = 'Bard.pdf') {
  const pdfPath = path.join(CHARACTER_SHEETS_DIR, pdfName);
  console.log(`Loading: ${pdfPath}\n`);

  const pdfBytes = fs.readFileSync(pdfPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const form = pdfDoc.getForm();
  const fields = form.getFields();

  // Get all text fields
  const textFields = fields
    .filter(f => f.constructor.name === 'PDFTextField')
    .map(f => f.getName());

  console.log(`Found ${textFields.length} text fields\n`);

  // Fill the first 20 fields with their field names as values
  // This helps identify them visually in the PDF
  console.log('Filling first 20 text fields with their names:');
  for (let i = 0; i < Math.min(20, textFields.length); i++) {
    const fieldName = textFields[i];
    try {
      const field = form.getTextField(fieldName);
      // Use a short identifier
      field.setText(`F${i + 1}`);
      console.log(`  ${i + 1}. ${fieldName} = "F${i + 1}"`);
    } catch (e) {
      console.log(`  ${i + 1}. ${fieldName} - ERROR: ${e.message}`);
    }
  }

  const outputPath = pdfPath.replace('.pdf', '_test_filled.pdf');
  const filledBytes = await pdfDoc.save();
  fs.writeFileSync(outputPath, filledBytes);
  console.log(`\nSaved to: ${outputPath}`);
  console.log('\nOpen this PDF and note which field shows which value (F1, F2, etc.)');
  console.log('Then create the mapping based on your observations.');
}

fillTestValues(process.argv[2] || 'Bard.pdf').catch(console.error);
