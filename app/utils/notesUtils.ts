import sanitize from 'sanitize-html';

export const getNormalizedCharacterCount = (content: string) => {
  const sanitizedContent = sanitize(content, { allowedTags: [] }).trim();
  return sanitizedContent.length;
};