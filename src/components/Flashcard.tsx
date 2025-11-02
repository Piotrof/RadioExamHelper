import React, { useState } from 'react';
import type { QCode } from '@lib/data';

interface FlashcardProps {
  qcode: QCode;
  onAnswer: (correct: boolean) => void;
  onSkip?: () => void;
  number: number;
  total: number;
}

export default function Flashcard({ qcode, onAnswer, onSkip, number, total }: FlashcardProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const handleReveal = () => {
    setIsRevealed(true);
    setFeedbackMessage('Answer revealed');
  };

  const handleAnswer = (correct: boolean) => {
    setFeedbackMessage(correct ? 'Correct! Moving forward' : 'Keep practicing!');
    setTimeout(() => {
      setIsRevealed(false);
      setFeedbackMessage('');
      onAnswer(correct);
    }, 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' && !isRevealed) {
      e.preventDefault();
      handleReveal();
    } else if (isRevealed) {
      if (e.key === '1' || e.key === 'ArrowLeft') {
        e.preventDefault();
        handleAnswer(false);
      } else if (e.key === '2' || e.key === 'ArrowRight') {
        e.preventDefault();
        handleAnswer(true);
      }
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[60vh] p-4"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Flashcard"
    >
      {/* Progress indicator */}
      <div className="w-full max-w-2xl mb-6">
        <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
          <span>
            Card {number} of {total}
          </span>
          <span>{Math.round((number / total) * 100)}% complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(number / total) * 100}%` }}
            role="progressbar"
            aria-valuenow={number}
            aria-valuemin={0}
            aria-valuemax={total}
          />
        </div>
      </div>

      {/* Main card */}
      <div className="w-full max-w-2xl">
        <div
          className={`bg-white rounded-3xl shadow-2xl p-8 md:p-12 min-h-[300px] flex flex-col justify-center items-center transition-all duration-300 ${
            isRevealed ? 'ring-4 ring-blue-400' : ''
          }`}
        >
          {/* Q-Code */}
          <div className="text-center mb-8">
            <div className="text-6xl md:text-8xl font-bold text-gray-900 mb-4 font-mono">
              {qcode.code}
            </div>
            <div className="text-xl text-gray-500">
              {isRevealed ? 'Meaning:' : 'What does this mean?'}
            </div>
          </div>

          {/* Meaning (revealed) */}
          {isRevealed && (
            <div
              className="text-center text-2xl text-gray-700 mb-8 animate-fade-in"
              aria-live="polite"
            >
              {qcode.meaning}
            </div>
          )}

          {/* Actions */}
          {!isRevealed ? (
            <button
              onClick={handleReveal}
              className="px-8 py-4 bg-blue-600 text-white rounded-xl text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300"
              autoFocus
            >
              Reveal Answer (Space)
            </button>
          ) : (
            <div className="flex gap-4 flex-wrap justify-center">
              <button
                onClick={() => handleAnswer(false)}
                className="px-6 py-3 bg-red-500 text-white rounded-xl text-lg font-semibold hover:bg-red-600 transition-colors shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-red-300"
              >
                ❌ Again (1 / ←)
              </button>
              <button
                onClick={() => handleAnswer(true)}
                className="px-6 py-3 bg-green-500 text-white rounded-xl text-lg font-semibold hover:bg-green-600 transition-colors shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-green-300"
              >
                ✅ Got It (2 / →)
              </button>
            </div>
          )}
        </div>

        {/* Keyboard shortcuts hint */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>Keyboard shortcuts: Space to reveal, 1 or ← for Again, 2 or → for Got It</p>
        </div>

        {/* Skip button */}
        {onSkip && (
          <div className="text-center mt-4">
            <button
              onClick={onSkip}
              className="text-gray-500 hover:text-gray-700 underline text-sm"
            >
              Skip this card
            </button>
          </div>
        )}
      </div>

      {/* Live region for screen readers */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {feedbackMessage}
      </div>
    </div>
  );
}
