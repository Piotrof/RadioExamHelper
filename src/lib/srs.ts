import type { FlashcardProgress } from './data';

// Simple Leitner system with 5 boxes (0-4)
// Box 0: New cards (review immediately)
// Box 1: 1 day interval
// Box 2: 3 days interval
// Box 3: 7 days interval
// Box 4: 14 days interval

const BOX_INTERVALS_DAYS = [0, 1, 3, 7, 14];

export function initializeCard(code: string): FlashcardProgress {
  return {
    code,
    box: 0,
    dueDate: new Date().toISOString(),
    reviews: 0,
    correct: 0,
  };
}

export function calculateNextReview(
  currentProgress: FlashcardProgress,
  wasCorrect: boolean
): FlashcardProgress {
  const now = new Date();
  let newBox = currentProgress.box;

  if (wasCorrect) {
    // Move to next box (max box 4)
    newBox = Math.min(currentProgress.box + 1, BOX_INTERVALS_DAYS.length - 1);
  } else {
    // Move back to box 0 (start over)
    newBox = 0;
  }

  const intervalDays = BOX_INTERVALS_DAYS[newBox];
  const dueDate = new Date(now);
  dueDate.setDate(dueDate.getDate() + intervalDays);

  return {
    ...currentProgress,
    box: newBox,
    dueDate: dueDate.toISOString(),
    lastReviewed: now.toISOString(),
    reviews: currentProgress.reviews + 1,
    correct: currentProgress.correct + (wasCorrect ? 1 : 0),
  };
}

export function isDue(progress: FlashcardProgress): boolean {
  const now = new Date();
  const dueDate = new Date(progress.dueDate);
  return now >= dueDate;
}

export function getDueCount(progressList: FlashcardProgress[]): number {
  return progressList.filter(isDue).length;
}

export function sortByDueDate(progressList: FlashcardProgress[]): FlashcardProgress[] {
  return [...progressList].sort((a, b) => {
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });
}

export function filterDueCards(progressList: FlashcardProgress[]): FlashcardProgress[] {
  return progressList.filter(isDue);
}

export function getAccuracy(progress: FlashcardProgress): number {
  if (progress.reviews === 0) return 0;
  return Math.round((progress.correct / progress.reviews) * 100);
}

export function getBoxName(box: number): string {
  const names = ['New', 'Learning', 'Review', 'Mastered', 'Completed'];
  return names[box] || 'Unknown';
}

export function getNextReviewText(dueDate: string): string {
  const now = new Date();
  const due = new Date(dueDate);
  const diffMs = due.getTime() - now.getTime();

  if (diffMs <= 0) {
    return 'Due now';
  }

  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return 'Tomorrow';
  } else if (diffDays < 7) {
    return `In ${diffDays} days`;
  } else {
    const weeks = Math.floor(diffDays / 7);
    return `In ${weeks} week${weeks > 1 ? 's' : ''}`;
  }
}
