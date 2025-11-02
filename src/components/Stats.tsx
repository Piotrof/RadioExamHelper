import React, { useState, useEffect } from 'react';
import { getStats, getAllProgress, clearAllData } from '@lib/storage';
import type { Stats as StatsType, FlashcardProgress } from '@lib/data';
import { getDueCount, getBoxName, getNextReviewText, sortByDueDate } from '@lib/srs';

export default function Stats() {
  const [stats, setStats] = useState<StatsType>({
    totalReviews: 0,
    correctAnswers: 0,
    studiedToday: 0,
    currentStreak: 0,
  });
  const [progress, setProgress] = useState<FlashcardProgress[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsData, progressData] = await Promise.all([getStats(), getAllProgress()]);
      setStats(statsData);
      setProgress(progressData);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    await clearAllData();
    await loadData();
    setShowConfirm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading statistics...</p>
        </div>
      </div>
    );
  }

  const dueCount = getDueCount(progress);
  const accuracy = stats.totalReviews > 0
    ? Math.round((stats.correctAnswers / stats.totalReviews) * 100)
    : 0;

  const progressByBox: Record<number, number> = progress.reduce(
    (acc: Record<number, number>, p: FlashcardProgress) => {
      acc[p.box] = (acc[p.box] || 0) + 1;
      return acc;
    },
    {} as Record<number, number>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <a
                href="/RadioExamHelper/"
                className="text-purple-600 hover:text-purple-800 font-semibold"
              >
                ← Back
              </a>
              <h1 className="text-2xl font-bold text-gray-900">Your Statistics</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Cards Due */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Due Today</span>
              <span className="text-2xl">📅</span>
            </div>
            <div className="text-4xl font-bold text-blue-600">{dueCount}</div>
            <div className="text-sm text-gray-500 mt-1">
              {dueCount === 0 ? 'All caught up!' : 'cards to review'}
            </div>
          </div>

          {/* Current Streak */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Current Streak</span>
              <span className="text-2xl">🔥</span>
            </div>
            <div className="text-4xl font-bold text-orange-600">{stats.currentStreak}</div>
            <div className="text-sm text-gray-500 mt-1">days in a row</div>
          </div>

          {/* Total Reviews */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Total Reviews</span>
              <span className="text-2xl">📊</span>
            </div>
            <div className="text-4xl font-bold text-green-600">{stats.totalReviews}</div>
            <div className="text-sm text-gray-500 mt-1">all time</div>
          </div>

          {/* Accuracy */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Accuracy</span>
              <span className="text-2xl">🎯</span>
            </div>
            <div className="text-4xl font-bold text-purple-600">{accuracy}%</div>
            <div className="text-sm text-gray-500 mt-1">
              {stats.correctAnswers}/{stats.totalReviews} correct
            </div>
          </div>
        </div>

        {/* Progress by Box */}
        {progress.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Learning Progress</h2>
            <div className="space-y-3">
              {[0, 1, 2, 3, 4].map((box) => {
                const count = progressByBox[box] || 0;
                const percentage = progress.length > 0 ? (count / progress.length) * 100 : 0;

                return (
                  <div key={box}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        {getBoxName(box)} (Box {box})
                      </span>
                      <span className="text-sm text-gray-600">
                        {count} cards ({Math.round(percentage)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-300 ${
                          box === 0
                            ? 'bg-gray-400'
                            : box === 1
                            ? 'bg-yellow-400'
                            : box === 2
                            ? 'bg-blue-400'
                            : box === 3
                            ? 'bg-green-400'
                            : 'bg-purple-400'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recent Progress */}
        {progress.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Card Details</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b-2 border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Q-Code</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Level</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Reviews</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Accuracy</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Next Review</th>
                  </tr>
                </thead>
                <tbody>
                  {sortByDueDate(progress)
                    .slice(0, 20)
                    .map((p) => {
                      const cardAccuracy =
                        p.reviews > 0 ? Math.round((p.correct / p.reviews) * 100) : 0;

                      return (
                        <tr key={p.code} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-mono font-semibold">{p.code}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                p.box === 0
                                  ? 'bg-gray-100 text-gray-700'
                                  : p.box === 1
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : p.box === 2
                                  ? 'bg-blue-100 text-blue-700'
                                  : p.box === 3
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-purple-100 text-purple-700'
                              }`}
                            >
                              {getBoxName(p.box)}
                            </span>
                          </td>
                          <td className="py-3 px-4">{p.reviews}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`font-semibold ${
                                cardAccuracy >= 80
                                  ? 'text-green-600'
                                  : cardAccuracy >= 60
                                  ? 'text-yellow-600'
                                  : 'text-red-600'
                              }`}
                            >
                              {cardAccuracy}%
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {getNextReviewText(p.dueDate)}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
            {progress.length > 20 && (
              <p className="text-sm text-gray-500 mt-4 text-center">
                Showing 20 of {progress.length} cards
              </p>
            )}
          </div>
        )}

        {/* No Data Message */}
        {progress.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No study data yet</h3>
            <p className="text-gray-600 mb-6">
              Start reviewing Q-codes flashcards to see your progress here!
            </p>
            <a
              href="/RadioExamHelper/qcodes"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Start Learning
            </a>
          </div>
        )}

        {/* Reset Button */}
        {progress.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">⚠️ Danger Zone</h3>
            <p className="text-gray-600 mb-4">
              Reset all progress and statistics. This action cannot be undone.
            </p>

            {!showConfirm ? (
              <button
                onClick={() => setShowConfirm(true)}
                className="px-6 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
              >
                Reset All Data
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="px-6 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
                >
                  Yes, Delete Everything
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
