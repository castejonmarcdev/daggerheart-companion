interface CharacterData {
  className: string;
  subclassName: string;
  ancestryName: string;
  communityName: string;
  weaponNames?: string[];
  armorName?: string;
}

/**
 * Downloads the class-specific character sheet PDF.
 * The PDF is fetched from the public folder and downloaded to the user's device.
 */
export async function downloadCharacterSheet(character: CharacterData): Promise<void> {
  // Map class name to PDF filename (capitalize first letter)
  const classFileName = character.className.charAt(0).toUpperCase() + character.className.slice(1).toLowerCase();
  const pdfUrl = `/character-sheets/${classFileName}.pdf`;

  try {
    // Fetch the PDF
    const response = await fetch(pdfUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.statusText}`);
    }

    const pdfBytes = await response.arrayBuffer();

    // Create a blob and download
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    // Generate filename with character info
    const filename = `${character.className}_${character.subclassName}_character_sheet.pdf`
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
