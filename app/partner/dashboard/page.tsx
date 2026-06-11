'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Users, Flame, CheckCircle, Clock, TrendingUp, AlertCircle, Target, ArrowRight, Loader2 } from 'lucide-react';

interface ProProgress {
  id: string;
  name: string;
  email: string;
  goal: string;
  currentStreak: number;
  longestStreak: number;
  todayProgress: {
    completed: number;
    total: number;
    percentage: number;
  };
  tasks: Array<{
    id: string;
    text: string;
    completed: boolean;
    completedAt?: string;
  }>;
  isSlacking: boolean;
}

export default function PartnerDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [pros, setPros] = useState<ProProgress[]>([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      fetchMyPros();
    }
  }, [status]);

  const fetchMyPros = async () => {
    try {
      const response = await fetch('/api/partners/my-pros');
      const data = await response.json();

      if (response.ok) {
        setPros(data.pros || []);
      }
    } catch (error) {
      console.error('Failed to fetch pros:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6 md:p-8">
      
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">Partner Dashboard</h1>
              <p className="text-gray-400">People you're keeping accountable</p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        {pros.length > 0 && (
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-indigo-400" />
                <span className="text-sm text-gray-400">Monitoring</span>
              </div>
              <p className="text-3xl font-bold text-white">{pros.length}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-sm text-gray-400">On Track Today</span>
              </div>
              <p className="text-3xl font-bold text-white">
                {pros.filter(p => p.todayProgress.percentage >= 50).length}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-sm text-gray-400">Slacking</span>
              </div>
              <p className="text-3xl font-bold text-white">
                {pros.filter(p => p.isSlacking).length}
              </p>
            </div>
          </div>
        )}

        {/* Pro Cards */}
        {pros.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-12 border border-white/20 text-center">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Partnerships Yet</h3>
            <p className="text-gray-400 mb-6">
              You're not monitoring anyone yet. Wait for someone to invite you as their accountability partner.
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all"
            >
              Go to My Dashboard
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {pros.map((pro) => (
              <div
                key={pro.id}
                className={`bg-white/10 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border-2 transition-all ${
                  pro.isSlacking
                    ? 'border-red-500/50 bg-red-500/5'
                    : 'border-white/20 hover:border-indigo-500/50'
                }`}
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">{pro.name}</h3>
                    <p className="text-gray-400 text-sm italic">"{pro.goal}"</p>
                  </div>

                  {pro.isSlacking && (
                    <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/50 px-4 py-2 rounded-full">
                      <AlertCircle className="w-5 h-5 text-red-400" />
                      <span className="text-red-300 font-semibold text-sm">Slacking!</span>
                    </div>
                  )}
                </div>

                {/* Progress Stats */}
                <div className="grid sm:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Flame className="w-4 h-4 text-orange-400" />
                      <span className="text-xs text-gray-400">Current Streak</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{pro.currentStreak} days</p>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-purple-400" />
                      <span className="text-xs text-gray-400">Best Streak</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{pro.longestStreak} days</p>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-xs text-gray-400">Today's Progress</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{pro.todayProgress.percentage}%</p>
                    <p className="text-xs text-gray-500">
                      {pro.todayProgress.completed} / {pro.todayProgress.total} tasks
                    </p>
                  </div>
                </div>

                {/* Today's Tasks */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Today's Tasks ({pro.todayProgress.completed}/{pro.todayProgress.total})
                  </h4>

                  <div className="space-y-2">
                    {pro.tasks.map((task) => (
                      <div
                        key={task.id}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                          task.completed
                            ? 'bg-green-500/10 border border-green-500/30'
                            : 'bg-white/5 border border-white/10'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                            task.completed
                              ? 'bg-green-500'
                              : 'bg-white/10 border border-white/20'
                          }`}
                        >
                          {task.completed && <CheckCircle className="w-4 h-4 text-white" />}
                        </div>

                        <div className="flex-1">
                          <p
                            className={`text-sm ${
                              task.completed
                                ? 'text-green-200 line-through'
                                : 'text-gray-300'
                            }`}
                          >
                            {task.text}
                          </p>
                          {task.completed && task.completedAt && (
                            <p className="text-xs text-green-400 mt-1">
                              ✓ Completed {new Date(task.completedAt).toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit',
                              })}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action needed banner */}
                {pro.isSlacking && (
                  <div className="mt-6 bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                    <p className="text-red-200 text-sm">
                      ⚠️ <strong>{pro.name}</strong> needs a push! They've only completed{' '}
                      {pro.todayProgress.percentage}% of their tasks today. Time to reach out and hold them accountable.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Set Your Own Goals CTA */}
        {pros.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-2xl p-6 sm:p-8 text-center">
            <h3 className="text-xl font-bold text-white mb-2">Want to set your own goals?</h3>
            <p className="text-gray-300 mb-4">
              You can be both a partner and a procrastinator. Set your goals and have someone hold YOU accountable too.
            </p>
            <button
              onClick={() => router.push('/onboarding')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all"
            >
              Set My Goals
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}