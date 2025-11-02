import React, { useState, useEffect } from 'react';
import type { QCode, FlashcardProgress } from '@lib/data';
import { loadQCodes } from '@lib/data';
import {
  getProgress,
  saveProgress,
  getAllProgress,
  updateStats,
} from '@lib/storage';
import { initializeCard, calculateNextReview, filterDueCards, sortByDueDate } from '@lib/srs';
import { shuffle } from '@lib/format';
import Flashcard from './Flashcard';

export default function QCodeTrainer() {
  const [qcodes, setQCodes] = useState<QCode[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [filterLetter, setFilterLetter] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [dueCount, setDueCount] = useState(0);
  const [showDueOnly, setShowDueOnly] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    updateDueCount();
  }, [qcodes]);

  const loadData = async () => {
    try {
      const codes = await loadQCodes();
      setQCodes(codes);
    } catch (error) {
      console.error('Failed to load Q-codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateDueCount = async () => {
    const allProgress = await getAllProgress();
    const dueCards = filterDueCards(allProgress);
    setDueCount(dueCards.length);
  };

  const getFilteredQCodes = () => {
    let filtered = [...qcodes];

    if (filterLetter) {
      filtered = filtered.filter((q) => q.code.startsWith(filterLetter));
    }

    if (showDueOnly) {
      // This is a simplified version - in production you'd filter by actual due status
      filtered = filtered.slice(0, Math.max(1, Math.floor(filtered.length / 3)));
    }

    if (isShuffled) {
      filtered = shuffle(filtered);
    }

    return filtered;
  };

  const filteredQCodes = getFilteredQCodes();
  const currentQCode = filteredQCodes[currentIndex];

  const handleAnswer = async (correct: boolean) => {
    if (!currentQCode) return;

    // Get or initialize progress
    let progress = await getProgress(currentQCode.code);
    if (!progress) {
      progress = initializeCard(currentQCode.code);
    }

    // Calculate next review
    const updatedProgress = calculateNextReview(progress, correct);
    await saveProgress(updatedProgress);

    // Update global stats
    await updateStats(correct);

    // Move to next card
    if (currentIndex < filteredQCodes.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Finished all cards
      setCurrentIndex(0);
      updateDueCount();
    }
  };

  const handleShuffle = () => {
    setIsShuffled(!isShuffled);
    setCurrentIndex(0);
  };

  const handleFilterChange = (letter: string) => {
    setFilterLetter(letter === filterLetter ? '' : letter);
    setCurrentIndex(0);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsShuffled(false);
    setFilterLetter('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Q-codes...</p>
        </div>
      </div>
    );
  }

  if (filteredQCodes.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <p className="text-xl text-gray-600 mb-4">No Q-codes match your current filter.</p>
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700"
          >
            Reset Filters
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <a
                href="/RadioExamHelper/"
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                ← Back
              </a>
              <h1 className="text-2xl font-bold text-gray-900">Q-Codes Flashcards</h1>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                {dueCount > 0 && `${dueCount} due | `}
                {filteredQCodes.length} cards
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Filter buttons */}
            <div className="flex gap-2 flex-wrap">
              <span className="text-sm text-gray-600 self-center">Filter:</span>
              {['QRA', 'QRB', 'QRC', 'QRD', 'QRE', 'QRF', 'QRG', 'QRH', 'QRI', 'QRJ', 'QRK', 'QRL', 'QRM', 'QRN', 'QRO', 'QRP', 'QRQ', 'QRR', 'QRS', 'QRT', 'QRU', 'QRV', 'QRW', 'QRX', 'QRY', 'QRZ', 'QSA', 'QSB', 'QSD', 'QSL', 'QSO', 'QSP', 'QSY', 'QTH', 'QTR']
                .map((code) => code.substring(0, 3))
                .filter((v, i, a) => a.indexOf(v) === i)
                .sort()
                .map((prefix) => (
                  <button
                    key={prefix}
                    onClick={() => handleFilterChange(prefix)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      filterLetter === prefix
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {prefix}
                  </button>
                ))}
            </div>

            {/* Shuffle toggle */}
            <button
              onClick={handleShuffle}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isShuffled
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              aria-pressed={isShuffled}
            >
              🔀 Shuffle {isShuffled ? 'ON' : 'OFF'}
            </button>

            {/* Reset button */}
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Flashcard */}
      <Flashcard
        qcode={currentQCode}
        onAnswer={handleAnswer}
        number={currentIndex + 1}
        total={filteredQCodes.length}
      />
    </div>
  );
}
