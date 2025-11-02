import { z } from 'zod';

// Q-Code schema
export const QCodeSchema = z.object({
  code: z.string().regex(/^Q[A-Z]{2,4}$/),
  meaning: z.string().min(1),
});

export type QCode = z.infer<typeof QCodeSchema>;

export const QCodesArraySchema = z.array(QCodeSchema);

// Flashcard progress schema
export const FlashcardProgressSchema = z.object({
  code: z.string(),
  box: z.number().int().min(0).max(4), // Leitner boxes: 0-4
  dueDate: z.string().datetime(),
  lastReviewed: z.string().datetime().optional(),
  reviews: z.number().int().min(0).default(0),
  correct: z.number().int().min(0).default(0),
});

export type FlashcardProgress = z.infer<typeof FlashcardProgressSchema>;

// Stats schema
export const StatsSchema = z.object({
  totalReviews: z.number().int().min(0).default(0),
  correctAnswers: z.number().int().min(0).default(0),
  studiedToday: z.number().int().min(0).default(0),
  currentStreak: z.number().int().min(0).default(0),
  lastStudyDate: z.string().datetime().optional(),
});

export type Stats = z.infer<typeof StatsSchema>;

// Load and validate Q-codes from JSON
export async function loadQCodes(): Promise<QCode[]> {
  try {
    // Try to load from public directory first
    const response = await fetch('/RadioExamHelper/qcodes.json');
    if (response.ok) {
      const data = await response.json();
      return QCodesArraySchema.parse(data);
    }
  } catch (error) {
    console.warn('Could not load qcodes.json, falling back to seed data', error);
  }

  // Fallback to seed data - use fetch for JSON
  try {
    const response = await fetch('/RadioExamHelper/qcodes.json');
    const data = await response.json();
    return QCodesArraySchema.parse(data);
  } catch {
    // Return empty array if all else fails
    return [];
  }
}

// Validate data at build time
export function validateQCodes(data: unknown): QCode[] {
  return QCodesArraySchema.parse(data);
}
