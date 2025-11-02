import React, { useState, useEffect } from 'react';
import type { AlphabetType } from '@data/alphabets';
import { getAlphabet, getSampleWords } from '@data/alphabets';
import { spellWord, checkPhoneticSpelling, randomItem } from '@lib/format';

export default function PhoneticTrainer() {
  const [alphabetType, setAlphabetType] = useState<AlphabetType>('NATO');
  const [currentWord, setCurrentWord] = useState('');
  const [customWord, setCustomWord] = useState('');
  const [isRevealed, setIsRevealed] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [showUserInput, setShowUserInput] = useState(false);
  const [feedback, setFeedback] = useState<{
    correct: boolean;
    expected: string[];
    provided: string[];
  } | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  useEffect(() => {
    generateRandomWord();
  }, []);

  const generateRandomWord = () => {
    const words = getSampleWords(alphabetType === 'POLISH' ? 'PL' : 'EN');
    const word = randomItem(words);
    setCurrentWord(word);
    reset();
  };

  const handleCustomWord = () => {
    if (customWord.trim()) {
      setCurrentWord(customWord.trim().toUpperCase());
      reset();
    }
  };

  const reset = () => {
    setIsRevealed(false);
    setUserAnswer('');
    setFeedback(null);
    setShowUserInput(false);
  };

  const handleReveal = () => {
    setIsRevealed(true);
  };

  const handleCheckAnswer = () => {
    const alphabet = getAlphabet(alphabetType);
    const result = checkPhoneticSpelling(userAnswer, currentWord, alphabet);
    setFeedback(result);

    setScore((prev: { correct: number; total: number }) => ({
      correct: prev.correct + (result.correct ? 1 : 0),
      total: prev.total + 1,
    }));
  };

  const handleNext = () => {
    generateRandomWord();
    setCustomWord('');
  };

  const alphabet = getAlphabet(alphabetType);
  const spelling = spellWord(currentWord, alphabet);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <a
                href="/RadioExamHelper/"
                className="text-green-600 hover:text-green-800 font-semibold"
              >
                ← Back
              </a>
              <h1 className="text-2xl font-bold text-gray-900">Phonetic Alphabets Trainer</h1>
            </div>

            <div className="flex items-center gap-3">
              {score.total > 0 && (
                <span className="text-sm text-gray-600">
                  Score: {score.correct}/{score.total} (
                  {Math.round((score.correct / score.total) * 100)}%)
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Alphabet Selection */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Alphabet:</span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setAlphabetType('NATO');
                  generateRandomWord();
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  alphabetType === 'NATO'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-pressed={alphabetType === 'NATO'}
              >
                🌐 NATO
              </button>
              <button
                onClick={() => {
                  setAlphabetType('POLISH');
                  generateRandomWord();
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  alphabetType === 'POLISH'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-pressed={alphabetType === 'POLISH'}
              >
                🇵🇱 Polish
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Current Word Display */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-6">
          <div className="text-center mb-8">
            <div className="text-sm text-gray-500 mb-2">Spell this word:</div>
            <div className="text-6xl md:text-8xl font-bold text-gray-900 mb-6 font-mono tracking-wider">
              {currentWord}
            </div>

            {!isRevealed && !showUserInput && (
              <div className="flex gap-4 justify-center flex-wrap">
                <button
                  onClick={handleReveal}
                  className="px-8 py-4 bg-green-600 text-white rounded-xl text-lg font-semibold hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
                >
                  🔍 Show Spelling
                </button>
                <button
                  onClick={() => setShowUserInput(true)}
                  className="px-8 py-4 bg-blue-600 text-white rounded-xl text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                >
                  ✍️ Try Spelling
                </button>
              </div>
            )}
          </div>

          {/* Revealed Spelling */}
          {isRevealed && (
            <div className="animate-fade-in">
              <div className="text-center mb-6">
                <div className="text-sm text-gray-500 mb-3">
                  {alphabetType} Phonetic Spelling:
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                  {spelling.map((item, index) => (
                    <div
                      key={index}
                      className={`px-4 py-3 rounded-lg ${
                        item.found
                          ? 'bg-green-100 border-2 border-green-400'
                          : 'bg-red-100 border-2 border-red-400'
                      }`}
                    >
                      <div className="text-sm font-mono text-gray-600">{item.letter}</div>
                      <div className="text-lg font-bold text-gray-900">{item.code}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
                >
                  Next Word →
                </button>
              </div>
            </div>
          )}

          {/* User Input Mode */}
          {showUserInput && !feedback && (
            <div className="animate-fade-in">
              <div className="mb-6">
                <label htmlFor="userAnswer" className="block text-sm font-medium text-gray-700 mb-2">
                  Type the phonetic spelling (space-separated code words):
                </label>
                <input
                  id="userAnswer"
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors text-lg"
                  placeholder="e.g., Alfa Bravo Charlie"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCheckAnswer();
                    }
                  }}
                />
              </div>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleCheckAnswer}
                  disabled={!userAnswer.trim()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Check Answer
                </button>
                <button
                  onClick={() => setShowUserInput(false)}
                  className="px-6 py-3 bg-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Feedback */}
          {feedback && (
            <div className="animate-fade-in">
              <div
                className={`text-center p-6 rounded-xl mb-6 ${
                  feedback.correct ? 'bg-green-100 border-2 border-green-400' : 'bg-red-100 border-2 border-red-400'
                }`}
              >
                <div className="text-3xl mb-2">{feedback.correct ? '✅' : '❌'}</div>
                <div className="text-xl font-bold text-gray-900 mb-2">
                  {feedback.correct ? 'Correct!' : 'Not quite right'}
                </div>
                {!feedback.correct && (
                  <div className="text-sm text-gray-600 space-y-2">
                    <div>
                      <strong>Expected:</strong> {feedback.expected.join(' ')}
                    </div>
                    <div>
                      <strong>You typed:</strong> {feedback.provided.join(' ') || '(nothing)'}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
                >
                  Next Word →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Custom Word Input */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Practice Your Own Word</h3>
          <div className="flex gap-3">
            <input
              type="text"
              value={customWord}
              onChange={(e) => setCustomWord(e.target.value.toUpperCase())}
              placeholder="Enter a word..."
              className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCustomWord();
                }
              }}
            />
            <button
              onClick={handleCustomWord}
              disabled={!customWord.trim()}
              className="px-6 py-2 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Practice
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Enter any word and we'll show you how to spell it using the selected phonetic alphabet.
          </p>
        </div>
      </div>
    </div>
  );
}
