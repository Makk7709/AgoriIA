/** Type représentant le contenu d'un message */
export type MessageContent = string | { content: string } | ChatResponseContent

/** Type guard pour détecter un contenu d'objet message */
export function isMessageContentObject(content: unknown): content is { content: string } {
  return typeof content === 'object' && content !== null && 'content' in content
}

/** Type guard pour détecter un contenu de réponse structurée */
export function isChatResponseContent(content: unknown): content is ChatResponseContent {
  return (
    typeof content === 'object' &&
    content !== null &&
    'introduction' in content &&
    'analysis' in content &&
    'conclusion' in content
  )
}

/** Interface pour le contenu d'une réponse structurée */
export interface ChatResponseContent {
  introduction: {
    title: string
    content: string
  }
  analysis: {
    title: string
    points: Array<{
      candidate?: string
      content: string
    }>
  }
  conclusion: {
    title: string
    content: string
  }
}

/** Fonction pour extraire proprement le texte à afficher depuis un contenu */
export function getMessageContent(content: MessageContent): string {
  if (typeof content === 'string') return content
  if (isMessageContentObject(content)) return content.content
  if (isChatResponseContent(content)) return content.introduction.content
  return 'Message non disponible'
}

/** Interface pour un message complet */
export interface Message {
  id: string
  content: MessageContent
  role: 'assistant' | 'user'
  timestamp: Date
}

/** Fonction pour générer un data-testid pour un message */
export function getMessageTestId(role: Message['role'], id: string): string {
  return `message-${role}-${id}`
}

/** Fonction pour générer un data-testid pour un message de debug */
export function getDebugMessageTestId(role: Message['role'], id: string): string {
  return `debug-message-${role}-${id}`
} 