import { PDFDocument } from 'pdf-lib';
import { PDF_FIELD_MAPPING } from './pdfFieldMappings';

interface WeaponData {
  name: string;
  damage: string;
  trait: string;
  range: string;
  feature?: string;
}

interface ArmorData {
  name: string;
  baseScore: number;
  thresholds: {
    major: number;
    severe: number;
  };
}

export interface CharacterExportData {
  characterName: string;
  className: string;
  subclassName: string;
  ancestryName: string;
  communityName: string;
  level?: number;
  weapons: WeaponData[];
  armor: ArmorData | null;
  startingHP: number;
  startingEvasion: number;
  domains: string[];
}

/**
 * Helper to safely fill a text field
 */
function fillTextField(
  form: ReturnType<PDFDocument['getForm']>,
  fieldName: string,
  value: string
): void {
  try {
    const field = form.getTextField(fieldName);
    field.setText(value);
  } catch {
    // Field not found or can't be filled - skip silently
  }
}

/**
 * Downloads the class-specific character sheet PDF filled with character data.
 * Uses pdf-lib to fill form fields before downloading.
 */
export async function downloadCharacterSheet(
  character: CharacterExportData
): Promise<void> {
  // Map class name to PDF filename (capitalize first letter)
  const classFileName =
    character.className.charAt(0).toUpperCase() +
    character.className.slice(1).toLowerCase();
  const pdfUrl = `/character-sheets/${classFileName}.pdf`;

  try {
    // Fetch the PDF
    const response = await fetch(pdfUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.statusText}`);
    }

    const pdfBytes = await response.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const form = pdfDoc.getForm();

    const mapping = PDF_FIELD_MAPPING;

    // Fill header fields
    fillTextField(form, mapping.characterName, character.characterName);
    fillTextField(form, mapping.ancestry, character.ancestryName);
    fillTextField(
      form,
      mapping.levelClass,
      `${character.level || 1} / ${character.className}`
    );
    fillTextField(form, mapping.subclass, character.subclassName);
    fillTextField(form, mapping.community, character.communityName);

    // Fill HP and Evasion
    fillTextField(form, mapping.hp, String(character.startingHP));
    fillTextField(form, mapping.evasion, String(character.startingEvasion));

    // Fill domains
    if (character.domains.length >= 1) {
      fillTextField(form, mapping.domain1, character.domains[0]);
    }
    if (character.domains.length >= 2) {
      fillTextField(form, mapping.domain2, character.domains[1]);
    }

    // Fill primary weapon
    if (character.weapons.length >= 1) {
      const w = character.weapons[0];
      fillTextField(form, mapping.primaryWeaponName, w.name);
      fillTextField(form, mapping.primaryWeaponTrait, w.trait);
      fillTextField(form, mapping.primaryWeaponRange, w.range);
      fillTextField(form, mapping.primaryWeaponDamage, w.damage);
      if (w.feature) {
        fillTextField(form, mapping.primaryWeaponFeature, w.feature);
      }
    }

    // Fill secondary weapon
    if (character.weapons.length >= 2) {
      const w = character.weapons[1];
      fillTextField(form, mapping.secondaryWeaponName, w.name);
      fillTextField(form, mapping.secondaryWeaponTrait, w.trait);
      fillTextField(form, mapping.secondaryWeaponRange, w.range);
      fillTextField(form, mapping.secondaryWeaponDamage, w.damage);
      if (w.feature) {
        fillTextField(form, mapping.secondaryWeaponFeature, w.feature);
      }
    }

    // Fill armor
    if (character.armor) {
      fillTextField(form, mapping.armorName, character.armor.name);
      fillTextField(
        form,
        mapping.armorBaseScore,
        String(character.armor.baseScore)
      );
      fillTextField(
        form,
        mapping.armorThresholdMajor,
        String(character.armor.thresholds.major)
      );
      fillTextField(
        form,
        mapping.armorThresholdSevere,
        String(character.armor.thresholds.severe)
      );
      // Also fill the armor score field with base score
      fillTextField(
        form,
        mapping.armorScore,
        String(character.armor.baseScore)
      );
    }

    // Save the filled PDF
    const filledPdfBytes = await pdfDoc.save();

    // Create a blob and download
    const blob = new Blob([filledPdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    // Generate filename with character info
    const filename = `${character.characterName || character.className}_${character.subclassName}_character_sheet.pdf`
      .toLowerCase()
      .replace(/\s+/g, '_');

    // Create download link and trigger
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading character sheet:', error);
    throw error;
  }
}
