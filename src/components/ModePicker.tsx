import React from 'react';

export default function ModePicker() {
  const handleSelectMode = (mode: 'qcodes' | 'phonetic' | 'stats') => {
    if (mode === 'qcodes') {
      window.location.href = '/RadioExamHelper/qcodes';
    } else if (mode === 'phonetic') {
      window.location.href = '/RadioExamHelper/phonetic';
    } else if (mode === 'stats') {
      window.location.href = '/RadioExamHelper/stats';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">📻 Radio Exam Helper</h1>
          <p className="text-xl text-gray-600">
            Study for your Polish amateur radio exam
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <button
            onClick={() => handleSelectMode('qcodes')}
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 text-left border-2 border-transparent hover:border-blue-500"
            aria-label="Start Q-codes flashcards"
          >
            <div className="text-5xl mb-4">🔤</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600">
              Q-Codes Flashcards
            </h2>
            <p className="text-gray-600">
              Master the Q-codes used in amateur radio communication with spaced repetition
              flashcards.
            </p>
            <div className="mt-4 text-blue-600 font-semibold flex items-center">
              Start Learning
              <svg
                className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </button>

          <button
            onClick={() => handleSelectMode('phonetic')}
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 text-left border-2 border-transparent hover:border-green-500"
            aria-label="Start phonetic alphabets trainer"
          >
            <div className="text-5xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-green-600">
              Phonetic Alphabets
            </h2>
            <p className="text-gray-600">
              Practice spelling words using NATO and Polish phonetic alphabets. Perfect for clear
              communication.
            </p>
            <div className="mt-4 text-green-600 font-semibold flex items-center">
              Start Training
              <svg
                className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </button>
        </div>

        <div className="text-center">
          <button
            onClick={() => handleSelectMode('stats')}
            className="inline-flex items-center px-6 py-3 bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300 text-gray-700 hover:text-blue-600 font-medium border border-gray-200 hover:border-blue-300"
            aria-label="View your statistics"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            View Statistics
          </button>
        </div>
      </div>
    </div>
  );
}
