export type MessageContent = string | { content: string }

/**
 * Extracts the content from a message, handling both string and object formats
 * @param content - The message content, either as a string or an object with a content property
 * @returns The extracted content as a string
 */
export function getMessageContent(content: MessageContent): string {
  if (typeof content === 'string') return content
  if (typeof content === 'object' && content !== null && 'content' in content)
    return content.content
  return 'Message non disponible'
}

/**
 * Type guard to check if a value is a valid message content object
 * @param value - The value to check
 * @returns True if the value is a valid message content object
 */
export function isMessageContentObject(value: unknown): value is { content: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'content' in value &&
    typeof (value as { content: unknown }).content === 'string'
  )
} 