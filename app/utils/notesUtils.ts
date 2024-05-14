import sanitize from 'sanitize-html';

export const MIN_NOTE_CHARACTER_COUNT = 20;
export const MAX_NOTE_CHARACTER_COUNT = 300;

export const getNormalizedCharacterCount = (content: string) => {
  const sanitizedContent = sanitize(content, { allowedTags: [] }).trim();
  return sanitizedContent.length;
};