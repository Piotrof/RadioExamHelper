import localforage from 'localforage';
import type { FlashcardProgress, Stats } from './data';

// Initialize localForage instances
const progressStore = localforage.createInstance({
  name: 'RadioExamHelper',
  storeName: 'flashcard_progress',
});

const statsStore = localforage.createInstance({
  name: 'RadioExamHelper',
  storeName: 'stats',
});

const settingsStore = localforage.createInstance({
  name: 'RadioExamHelper',
  storeName: 'settings',
});

// Flashcard Progress Operations
export async function getProgress(code: string): Promise<FlashcardProgress | null> {
  try {
    return await progressStore.getItem<FlashcardProgress>(code);
  } catch (error) {
    console.error('Error getting progress:', error);
    return null;
  }
}

export async function saveProgress(progress: FlashcardProgress): Promise<void> {
  try {
    await progressStore.setItem(progress.code, progress);
  } catch (error) {
    console.error('Error saving progress:', error);
  }
}

export async function getAllProgress(): Promise<FlashcardProgress[]> {
  try {
    const keys = await progressStore.keys();
    const progressArray: FlashcardProgress[] = [];

    for (const key of keys) {
      const progress = await progressStore.getItem<FlashcardProgress>(key);
      if (progress) {
        progressArray.push(progress);
      }
    }

    return progressArray;
  } catch (error) {
    console.error('Error getting all progress:', error);
    return [];
  }
}

export async function deleteProgress(code: string): Promise<void> {
  try {
    await progressStore.removeItem(code);
  } catch (error) {
    console.error('Error deleting progress:', error);
  }
}

// Stats Operations
export async function getStats(): Promise<Stats> {
  try {
    const stats = await statsStore.getItem<Stats>('global');
    return (
      stats || {
        totalReviews: 0,
        correctAnswers: 0,
        studiedToday: 0,
        currentStreak: 0,
      }
    );
  } catch (error) {
    console.error('Error getting stats:', error);
    return {
      totalReviews: 0,
      correctAnswers: 0,
      studiedToday: 0,
      currentStreak: 0,
    };
  }
}

export async function saveStats(stats: Stats): Promise<void> {
  try {
    await statsStore.setItem('global', stats);
  } catch (error) {
    console.error('Error saving stats:', error);
  }
}

export async function updateStats(
  correct: boolean,
  studyDate: string = new Date().toISOString()
): Promise<void> {
  const stats = await getStats();

  stats.totalReviews++;
  if (correct) {
    stats.correctAnswers++;
  }

  // Check if studying today
  const today = new Date().toDateString();
  const lastStudy = stats.lastStudyDate ? new Date(stats.lastStudyDate).toDateString() : null;

  if (lastStudy === today) {
    stats.studiedToday++;
  } else {
    // New day
    stats.studiedToday = 1;

    // Update streak
    if (lastStudy) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();

      if (lastStudy === yesterdayStr) {
        stats.currentStreak++;
      } else {
        stats.currentStreak = 1;
      }
    } else {
      stats.currentStreak = 1;
    }
  }

  stats.lastStudyDate = studyDate;
  await saveStats(stats);
}

// Settings Operations
export async function getSetting<T>(key: string, defaultValue: T): Promise<T> {
  try {
    const value = await settingsStore.getItem<T>(key);
    return value !== null ? value : defaultValue;
  } catch (error) {
    console.error('Error getting setting:', error);
    return defaultValue;
  }
}

export async function saveSetting<T>(key: string, value: T): Promise<void> {
  try {
    await settingsStore.setItem(key, value);
  } catch (error) {
    console.error('Error saving setting:', error);
  }
}

// Clear all data
export async function clearAllData(): Promise<void> {
  try {
    await progressStore.clear();
    await statsStore.clear();
    await settingsStore.clear();
  } catch (error) {
    console.error('Error clearing data:', error);
  }
}
