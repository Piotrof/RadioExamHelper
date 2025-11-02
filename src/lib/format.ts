// Text normalization utilities

/**
 * Normalize text by removing diacritics/accents
 */
export function removeDiacritics(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ł/g, 'l')
    .replace(/Ł/g, 'L');
}

/**
 * Normalize whitespace and trim
 */
export function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * Convert text to uppercase and normalize
 */
export function normalizeForComparison(text: string): string {
  return normalizeWhitespace(removeDiacritics(text.toUpperCase()));
}

/**
 * Tokenize a string into words
 */
export function tokenize(text: string): string[] {
  return normalizeWhitespace(text)
    .split(/\s+/)
    .filter((token) => token.length > 0);
}

/**
 * Compare two strings for equality (case-insensitive, diacritics-insensitive)
 */
export function compareTexts(text1: string, text2: string): boolean {
  return normalizeForComparison(text1) === normalizeForComparison(text2);
}

/**
 * Compare two arrays of tokens
 */
export function compareTokenArrays(tokens1: string[], tokens2: string[]): boolean {
  if (tokens1.length !== tokens2.length) return false;

  for (let i = 0; i < tokens1.length; i++) {
    if (!compareTexts(tokens1[i], tokens2[i])) {
      return false;
    }
  }

  return true;
}

/**
 * Spell a word using phonetic alphabet
 */
export function spellWord(
  word: string,
  alphabet: Record<string, string>
): { letter: string; code: string; found: boolean }[] {
  return word
    .toUpperCase()
    .split('')
    .filter((char) => char.trim().length > 0)
    .map((letter) => ({
      letter,
      code: alphabet[letter] || '?',
      found: !!alphabet[letter],
    }));
}

/**
 * Get phonetic spelling as a string
 */
export function getPhoneticSpelling(word: string, alphabet: Record<string, string>): string {
  const spelling = spellWord(word, alphabet);
  return spelling.map((s) => s.code).join(' ');
}

/**
 * Extract only valid letters that exist in the alphabet
 */
export function getValidLetters(word: string, alphabet: Record<string, string>): string {
  return word
    .toUpperCase()
    .split('')
    .filter((char) => alphabet[char])
    .join('');
}

/**
 * Check if user's phonetic spelling matches the expected spelling
 */
export function checkPhoneticSpelling(
  userInput: string,
  expectedWord: string,
  alphabet: Record<string, string>
): {
  correct: boolean;
  expected: string[];
  provided: string[];
  errors: number;
} {
  const expectedTokens = getPhoneticSpelling(expectedWord, alphabet).split(' ');
  const providedTokens = tokenize(userInput);

  const correct = compareTokenArrays(expectedTokens, providedTokens);
  const errors = calculateErrors(expectedTokens, providedTokens);

  return {
    correct,
    expected: expectedTokens,
    provided: providedTokens,
    errors,
  };
}

/**
 * Calculate number of errors (simple difference count)
 */
function calculateErrors(expected: string[], provided: string[]): number {
  let errors = Math.abs(expected.length - provided.length);

  const minLength = Math.min(expected.length, provided.length);
  for (let i = 0; i < minLength; i++) {
    if (!compareTexts(expected[i], provided[i])) {
      errors++;
    }
  }

  return errors;
}

/**
 * Shuffle an array (Fisher-Yates algorithm)
 */
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get random item from array
 */
export function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}
