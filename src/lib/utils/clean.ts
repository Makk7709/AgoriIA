/**
 * Nettoie le contenu d'une position politique en :
 * - Supprimant les balises HTML
 * - Normalisant les caractères spéciaux
 * - Gérant les cas d'erreur
 */

export function sanitizePositionContent(content: string | null | undefined): string {
  if (!content) {
    console.warn('Contenu manquant ou null dans sanitizePositionContent');
    return 'Contenu indisponible';
  }

  try {
    return content
      // Supprime les balises HTML
      .replace(/<[^>]*>/g, '')
      // Supprime les caractères invisibles et les espaces en début/fin
      .replace(/[\u200B-\u200D\uFEFF]/g, '')
      .trim()
      // Normalise les apostrophes et guillemets
      .replace(/['']/g, "'")
      .replace(/[""]/g, '"')
      // Normalise les tirets
      .replace(/[–—]/g, '-')
      // Supprime les espaces multiples
      .replace(/\s+/g, ' ')
      // Normalise les retours à la ligne
      .replace(/\n+/g, '\n');
  } catch (error) {
    console.error('Erreur lors du nettoyage du contenu:', error);
    return 'Erreur de traitement du contenu';
  }
}

/**
 * Vérifie si le contenu est valide pour le scoring
 */
export function isValidContent(content: string): boolean {
  return (
    typeof content === 'string' &&
    content.length > 0 &&
    content !== 'Contenu indisponible' &&
    content !== 'Erreur de traitement du contenu'
  );
}

/**
 * Log les informations de débogage sur le contenu
 */
export function logContentDebug(content: string, source: string): void {
  console.debug(`[${source}] Longueur: ${content.length}`);
  console.debug(`[${source}] Type: ${typeof content}`);
  console.debug(`[${source}] Contient des balises HTML: ${/<[^>]*>/.test(content)}`);
  console.debug(`[${source}] Contient des caractères spéciaux: ${/[\u200B-\u200D\uFEFF]/.test(content)}`);
} 