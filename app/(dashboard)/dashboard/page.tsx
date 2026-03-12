"use client"
import React, { useState, useEffect } from 'react';
import { Target, Flame, Users, Check, AlertCircle, TrendingUp, Clock } from 'lucide-react';

interface DailyTask {
  id: string;
  text: string;
  completed: boolean;
  completedAt?: Date;
}

const DailyStreakDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<DailyTask[]>([
    { id: '1', text: 'Spend 15 minutes on coding fundamentals', completed: false },
    { id: '2', text: 'Track your progress in writing', completed: false },
    { id: '3', text: 'Share one small win with your accountability partner', completed: false },
    { id: '4', text: 'Review what worked and what didn\'t before bed', completed: false }
  ]);

  const [streak, setStreak] = useState<number>(7);
  const [currentTime] = useState(new Date());
  const [showSlackingWarning, setShowSlackingWarning] = useState(false);

  const completedCount = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const progressPercent = (completedCount / totalTasks) * 100;
  const allCompleted = completedCount === totalTasks;

  // Check if user is slacking (after 6pm and less than 50% done)
  useEffect(() => {
    const hour = currentTime.getHours();
    if (hour >= 18 && progressPercent < 50) {
      setShowSlackingWarning(true);
    }
  }, [currentTime, progressPercent]);

  const handleTaskToggle = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed, completedAt: !task.completed ? new Date() : undefined }
        : task
    ));
  };

  // Format date
  const formatDate = (date: Date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6 md:p-8">
      
      {/* Streak Fire Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {allCompleted && (
          <>
            <div className="absolute top-20 right-20 text-6xl animate-bounce opacity-30">🔥</div>
            <div className="absolute top-40 left-20 text-5xl animate-bounce opacity-30" style={{animationDelay: '0.2s'}}>🔥</div>
            <div className="absolute bottom-32 right-32 text-6xl animate-bounce opacity-30" style={{animationDelay: '0.4s'}}>🔥</div>
          </>
        )}
        
        {/* Target in background */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-5">
          <svg viewBox="0 0 400 400" className="w-96 h-96">
            <circle cx="200" cy="200" r="180" fill="none" stroke="#ffffff" strokeWidth="8" />
            <circle cx="200" cy="200" r="135" fill="none" stroke="#ef4444" strokeWidth="8" />
            <circle cx="200" cy="200" r="90" fill="none" stroke="#3b82f6" strokeWidth="8" />
            <circle cx="200" cy="200" r="45" fill="none" stroke="#fbbf24" strokeWidth="8" />
            <circle cx="200" cy="200" r="20" fill="#dc2626" />
          </svg>
        </div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full mb-4 shadow-lg shadow-indigo-500/50">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            {formatDate(currentTime)}
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            {allCompleted ? 'Bullseye! All arrows hit their mark.' : 'Load your arrows. Take your shots.'}
          </p>
        </div>

        {/* Streak Counter */}
        <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 mb-6 shadow-2xl border border-orange-500/50 transform hover:scale-[1.02] transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Flame className="w-8 h-8 sm:w-10 sm:h-10 text-white animate-pulse" />
              </div>
              <div>
                <div className="text-5xl sm:text-6xl font-black text-white">{streak}</div>
                <div className="text-white/90 text-sm sm:text-base font-medium">Day Streak</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white/80 text-xs sm:text-sm mb-1">Best Streak</div>
              <div className="text-2xl sm:text-3xl font-bold text-white">12</div>
            </div>
          </div>
          
          {!allCompleted && (
            <div className="mt-4 pt-4 border-t border-white/20">
              <p className="text-white/90 text-xs sm:text-sm">
                🎯 Complete today's tasks to keep the fire burning
              </p>
            </div>
          )}
        </div>

        {/* Slacking Warning */}
        {showSlackingWarning && !allCompleted && (
          <div className="bg-red-500/10 backdrop-blur-sm border-2 border-red-500/50 rounded-xl sm:rounded-2xl p-4 sm:p-5 mb-6 animate-pulse">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-red-300 font-bold text-sm sm:text-base mb-1">⚠️ You're Slacking</h3>
                <p className="text-red-200/90 text-xs sm:text-sm">
                  It's after 6pm and you've only completed {completedCount} of {totalTasks} tasks. 
                  Your accountability partner has been notified.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Progress Ring */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 mb-6 border border-white/20 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
            
            {/* Circular Progress */}
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0">
              <svg className="transform -rotate-90 w-full h-full">
                {/* Background circle */}
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="8"
                  fill="none"
                />
                {/* Progress circle */}
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${progressPercent * 2.83} 283`}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-black text-white">{Math.round(progressPercent)}%</div>
                  <div className="text-xs text-gray-400">Complete</div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex-1 w-full">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-gray-400">Completed</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{completedCount}</div>
                </div>
                
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span className="text-xs text-gray-400">Remaining</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{totalTasks - completedCount}</div>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-purple-400" />
                    <span className="text-xs text-gray-400">This Week</span>
                  </div>
                  <div className="text-2xl font-bold text-white">5/7</div>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs text-gray-400">Partner</span>
                  </div>
                  <div className="text-sm font-bold text-white truncate">Alex M.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Tasks */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <span>Today's Arrows</span>
              <span className="text-sm font-normal text-gray-400">({completedCount}/{totalTasks})</span>
            </h2>
            
            {allCompleted && (
              <div className="flex items-center gap-2 bg-green-500/20 px-4 py-2 rounded-full border border-green-500/50">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-green-300 font-semibold text-sm">All Done!</span>
              </div>
            )}
          </div>

          <div className="space-y-3 sm:space-y-4">
            {tasks.map((task, index) => (
              <div
                key={task.id}
                className={`group relative overflow-hidden rounded-xl sm:rounded-2xl transition-all duration-300 ${
                  task.completed 
                    ? 'bg-green-500/10 border-2 border-green-500/50' 
                    : 'bg-white/5 border-2 border-white/20 hover:border-indigo-500/50'
                }`}
              >
                <div className="flex items-center gap-4 p-4 sm:p-5">
                  
                  {/* Checkbox */}
                  <button
                    onClick={() => handleTaskToggle(task.id)}
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      task.completed
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/50'
                        : 'bg-white/10 border-2 border-white/30 hover:border-indigo-500 hover:bg-indigo-500/20'
                    }`}
                  >
                    {task.completed && (
                      <Check className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-scale-in" />
                    )}
                  </button>

                  {/* Task Text */}
                  <div className="flex-1">
                    <p className={`text-sm sm:text-base leading-relaxed transition-all duration-300 ${
                      task.completed 
                        ? 'text-green-200 line-through' 
                        : 'text-gray-200'
                    }`}>
                      {task.text}
                    </p>
                    
                    {task.completed && task.completedAt && (
                      <p className="text-xs text-green-400/70 mt-1">
                        ✓ Completed {task.completedAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      </p>
                    )}
                  </div>

                  {/* Arrow Icon */}
                  <div className={`text-2xl sm:text-3xl transition-all duration-300 ${
                    task.completed ? 'opacity-100' : 'opacity-20 group-hover:opacity-40'
                  }`}>
                    {task.completed ? '🎯' : '🏹'}
                  </div>
                </div>

                {/* Completion animation overlay */}
                {task.completed && (
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/20 to-green-500/0 animate-shine"></div>
                )}
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          {!allCompleted && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-center text-sm text-gray-400">
                Complete all tasks before midnight to keep your streak alive
              </p>
            </div>
          )}
          
          {allCompleted && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="text-center">
                <p className="text-green-300 font-semibold mb-3">
                  🔥 Day {streak} complete! You're unstoppable.
                </p>
                <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-green-500/50 transform hover:scale-[1.02]">
                  See Tomorrow's Challenge
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Accountability Partner Card */}
        <div className="mt-6 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                AM
              </div>
              <div>
                <div className="text-white font-semibold text-sm sm:text-base">Alex Martinez</div>
                <div className="text-gray-400 text-xs sm:text-sm">Your Accountability Partner</div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center gap-1 text-green-400 text-xs sm:text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Active</span>
              </div>
              <div className="text-gray-400 text-xs mt-1">6 day streak</div>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes scale-in {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shine {
          animation: shine 1s ease-out;
        }
      `}</style>
    </div>
  );
};

export default DailyStreakDashboard;