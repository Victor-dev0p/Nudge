"use client"
import React, { useState, useEffect } from 'react';
import { Send, Target, Calendar, Zap } from 'lucide-react';

interface ClarifyingQuestion {
  id: string;
  question: string;
  answer: string;
}

const GoalInputForm: React.FC = () => {
  const [goal, setGoal] = useState<string>('');
  const [stage, setStage] = useState<'input' | 'clarifying' | 'breakdown'>('input');
  const [questions, setQuestions] = useState<ClarifyingQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [dailyActions, setDailyActions] = useState<string[]>([]);
  const [arrowFlying, setArrowFlying] = useState(false);

  const generateQuestions = (userGoal: string): ClarifyingQuestion[] => {
    return [
      {
        id: '1',
        question: `What does "${userGoal}" mean specifically to you? What would success look like in 30 days?`,
        answer: ''
      },
      {
        id: '2',
        question: 'What\'s your current level or starting point with this goal?',
        answer: ''
      },
      {
        id: '3',
        question: 'What\'s your biggest obstacle or what usually stops you from achieving this?',
        answer: ''
      },
      {
        id: '4',
        question: 'How much time can you realistically dedicate to this DAILY? (Be honest)',
        answer: ''
      }
    ];
  };

  const generateDailyActions = (userGoal: string, answers: ClarifyingQuestion[]): string[] => {
    return [
      `Spend 15 minutes on ${userGoal.toLowerCase()} fundamentals`,
      'Track your progress in writing',
      'Share one small win with your accountability partner',
      'Review what worked and what didn\'t before bed'
    ];
  };

  const handleGoalSubmit = () => {
    if (goal.trim()) {
      const generatedQuestions = generateQuestions(goal);
      setQuestions(generatedQuestions);
      setStage('clarifying');
    }
  };

  const handleAnswerSubmit = () => {
    const updatedQuestions = [...questions];
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      const actions = generateDailyActions(goal, questions);
      setDailyActions(actions);
      setStage('breakdown');
      setArrowFlying(true);
    }
  };

  const handleAnswerChange = (value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex].answer = value;
    setQuestions(updatedQuestions);
  };

  const handleStartJourney = () => {
    alert('Goal saved! Your journey begins NOW. 🔥');
  };

  // Archer SVG Component - Stage 1: Drawing Bow
  const ArcherDrawing = () => (
    <svg viewBox="0 0 800 600" className="w-full h-full opacity-20">
      {/* Archer body */}
      <circle cx="200" cy="250" r="30" fill="#94a3b8" className="animate-pulse" />
      <line x1="200" y1="280" x2="200" y2="380" stroke="#94a3b8" strokeWidth="8" />
      <line x1="200" y1="320" x2="150" y2="360" stroke="#94a3b8" strokeWidth="6" className="origin-center" style={{animation: 'sway 2s ease-in-out infinite'}} />
      <line x1="200" y1="380" x2="170" y2="450" stroke="#94a3b8" strokeWidth="6" />
      <line x1="200" y1="380" x2="230" y2="450" stroke="#94a3b8" strokeWidth="6" />
      
      {/* Bow */}
      <path d="M 240 280 Q 280 300 240 380" stroke="#7c3aed" strokeWidth="6" fill="none" className="animate-pulse" />
      <line x1="240" y1="280" x2="240" y2="380" stroke="#7c3aed" strokeWidth="2" opacity="0.5" />
      
      {/* Arrow being pulled back */}
      <line x1="200" y1="320" x2="170" y2="330" stroke="#f59e0b" strokeWidth="4" className="origin-center" style={{animation: 'pullBack 2s ease-in-out infinite'}} />
      <polygon points="165,330 170,327 170,333" fill="#f59e0b" />
      
      {/* Shaking tension lines */}
      <line x1="170" y1="330" x2="150" y2="330" stroke="#fbbf24" strokeWidth="1" opacity="0.3" className="animate-pulse" />
      <line x1="170" y1="330" x2="155" y2="325" stroke="#fbbf24" strokeWidth="1" opacity="0.3" className="animate-pulse" style={{animationDelay: '0.5s'}} />
      <line x1="170" y1="330" x2="155" y2="335" stroke="#fbbf24" strokeWidth="1" opacity="0.3" className="animate-pulse" style={{animationDelay: '1s'}} />
    </svg>
  );

  // Archer SVG Component - Stage 2: Holding Steady
  const ArcherSteady = () => (
    <svg viewBox="0 0 800 600" className="w-full h-full opacity-25">
      {/* Archer body - more stable */}
      <circle cx="200" cy="250" r="30" fill="#818cf8" />
      <line x1="200" y1="280" x2="200" y2="380" stroke="#818cf8" strokeWidth="8" />
      <line x1="200" y1="320" x2="150" y2="360" stroke="#818cf8" strokeWidth="6" />
      <line x1="200" y1="380" x2="170" y2="450" stroke="#818cf8" strokeWidth="6" />
      <line x1="200" y1="380" x2="230" y2="450" stroke="#818cf8" strokeWidth="6" />
      
      {/* Bow - fully drawn */}
      <path d="M 250 280 Q 290 300 250 380" stroke="#8b5cf6" strokeWidth="6" fill="none" />
      <line x1="250" y1="280" x2="250" y2="380" stroke="#8b5cf6" strokeWidth="2" opacity="0.5" className="animate-pulse" style={{animationDuration: '3s'}} />
      
      {/* Arrow fully pulled back */}
      <line x1="200" y1="320" x2="140" y2="330" stroke="#f59e0b" strokeWidth="4" />
      <polygon points="135,330 140,327 140,333" fill="#f59e0b" />
      <polygon points="250,320 245,318 245,322" fill="#f59e0b" opacity="0.5" />
      
      {/* Focus beam */}
      <line x1="200" y1="250" x2="600" y2="300" stroke="#60a5fa" strokeWidth="2" opacity="0.3" strokeDasharray="5,5" className="animate-pulse" />
      
      {/* Breath indicator */}
      <circle cx="200" cy="250" r="40" fill="none" stroke="#a5f3fc" strokeWidth="1" opacity="0.5" className="animate-ping" style={{animationDuration: '3s'}} />
    </svg>
  );

  // Archer SVG Component - Stage 3: Arrow Released & Hit
  const ArcherRelease = () => (
    <svg viewBox="0 0 800 600" className="w-full h-full opacity-30">
      {/* Archer body - post-release */}
      <circle cx="200" cy="250" r="30" fill="#10b981" />
      <line x1="200" y1="280" x2="200" y2="380" stroke="#10b981" strokeWidth="8" />
      <line x1="200" y1="320" x2="180" y2="340" stroke="#10b981" strokeWidth="6" />
      <line x1="200" y1="380" x2="170" y2="450" stroke="#10b981" strokeWidth="6" />
      <line x1="200" y1="380" x2="230" y2="450" stroke="#10b981" strokeWidth="6" />
      
      {/* Bow - released */}
      <path d="M 250 280 Q 270 300 250 380" stroke="#059669" strokeWidth="6" fill="none" className="animate-pulse" />
      <line x1="250" y1="280" x2="250" y2="380" stroke="#059669" strokeWidth="2" opacity="0.5" />
      
      {/* Arrow flying (animated) */}
      {arrowFlying && (
        <>
          <line x1="250" y1="320" x2="300" y2="315" stroke="#f59e0b" strokeWidth="4" className={arrowFlying ? 'arrow-flight' : ''} />
          <polygon points="305,315 300,313 300,317" fill="#f59e0b" className={arrowFlying ? 'arrow-flight' : ''} />
          
          {/* Motion blur trail */}
          <line x1="240" y1="320" x2="250" y2="320" stroke="#fbbf24" strokeWidth="2" opacity="0.3" className={arrowFlying ? 'arrow-flight' : ''} />
          <line x1="230" y1="320" x2="240" y2="320" stroke="#fbbf24" strokeWidth="2" opacity="0.2" className={arrowFlying ? 'arrow-flight' : ''} />
        </>
      )}
    </svg>
  );

  // Target SVG Component
  const TargetVisual = ({ stage }: { stage: string }) => {
    const opacity = stage === 'input' ? 0.1 : stage === 'clarifying' ? 0.2 : 0.35;
    const scale = stage === 'input' ? 0.8 : stage === 'clarifying' ? 0.9 : 1;
    
    return (
      <svg viewBox="0 0 400 400" className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 transition-all duration-1000" style={{ opacity, transform: `scale(${scale})` }}>
        {/* Target rings */}
        <circle cx="200" cy="200" r="180" fill="none" stroke="#ffffff" strokeWidth="8" className={stage === 'breakdown' ? 'animate-ping' : ''} style={{animationDuration: '2s'}} />
        <circle cx="200" cy="200" r="135" fill="none" stroke="#ef4444" strokeWidth="8" className={stage === 'breakdown' ? 'animate-ping' : ''} style={{animationDuration: '2.2s', animationDelay: '0.1s'}} />
        <circle cx="200" cy="200" r="90" fill="none" stroke="#3b82f6" strokeWidth="8" className={stage === 'breakdown' ? 'animate-ping' : ''} style={{animationDuration: '2.4s', animationDelay: '0.2s'}} />
        <circle cx="200" cy="200" r="45" fill="none" stroke="#fbbf24" strokeWidth="8" className={stage === 'breakdown' ? 'animate-ping' : ''} style={{animationDuration: '2.6s', animationDelay: '0.3s'}} />
        <circle cx="200" cy="200" r="20" fill={stage === 'breakdown' ? '#ef4444' : '#dc2626'} className={stage === 'breakdown' ? 'animate-pulse' : ''} />
        
        {/* Arrow in bullseye - only show on breakdown */}
        {stage === 'breakdown' && arrowFlying && (
          <>
            <line x1="200" y1="200" x2="240" y2="195" stroke="#92400e" strokeWidth="3" className="arrow-stick" />
            <polygon points="245,195 240,193 240,197" fill="#92400e" className="arrow-stick" />
            <line x1="200" y1="200" x2="190" y2="201" stroke="#fbbf24" strokeWidth="2" className="arrow-stick" />
            
            {/* Impact shockwave */}
            <circle cx="200" cy="200" r="25" fill="none" stroke="#fbbf24" strokeWidth="3" opacity="0.7" className="animate-ping" style={{animationDuration: '1s'}} />
            <circle cx="200" cy="200" r="40" fill="none" stroke="#f59e0b" strokeWidth="2" opacity="0.5" className="animate-ping" style={{animationDuration: '1.5s', animationDelay: '0.2s'}} />
          </>
        )}
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden transition-all duration-1000">
      
      <style>{`
        @keyframes sway {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }
        @keyframes pullBack {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-5px); }
        }
        @keyframes arrow-flight {
          0% { transform: translateX(0) translateY(0); opacity: 1; }
          100% { transform: translateX(400px) translateY(-10px); opacity: 0; }
        }
        .arrow-flight {
          animation: arrow-flight 1.5s ease-out forwards;
        }
        @keyframes arrow-stick {
          0% { opacity: 0; transform: scale(0); }
          50% { opacity: 0; }
          100% { opacity: 1; transform: scale(1); }
        }
        .arrow-stick {
          animation: arrow-stick 2s ease-out forwards;
        }
      `}</style>
      
      {/* Archer Visual - Left Side */}
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1/3 h-96 pointer-events-none hidden md:block">
        {stage === 'input' && <ArcherDrawing />}
        {stage === 'clarifying' && <ArcherSteady />}
        {stage === 'breakdown' && <ArcherRelease />}
      </div>
      
      {/* Target Visual - Right Side */}
      <div className="absolute right-10 sm:right-20 top-1/2 transform -translate-y-1/2 pointer-events-none hidden md:block">
        <TargetVisual stage={stage} />
      </div>
      
      {/* Distractions - Only Stage 1 */}
      {stage === 'input' && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 sm:right-20 animate-bounce opacity-30" style={{animationDuration: '2s'}}>
            <div className="text-5xl sm:text-7xl">📱</div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold animate-ping">99+</div>
          </div>
          
          <div className="absolute top-40 left-10 sm:left-20 animate-bounce opacity-30" style={{animationDuration: '2.5s', animationDelay: '0.5s'}}>
            <div className="text-4xl sm:text-6xl">🎮</div>
          </div>

          <div className="absolute bottom-32 right-16 sm:right-32 animate-bounce opacity-30" style={{animationDuration: '3s', animationDelay: '1s'}}>
            <div className="text-4xl sm:text-6xl">📺</div>
          </div>

          <div className="absolute top-1/3 left-1/4 animate-bounce opacity-30" style={{animationDuration: '2.2s', animationDelay: '0.3s'}}>
            <div className="text-3xl sm:text-5xl">💬</div>
          </div>

          <div className="absolute bottom-1/4 left-1/3 animate-bounce opacity-30" style={{animationDuration: '2.8s', animationDelay: '0.7s'}}>
            <div className="text-3xl sm:text-5xl">🍕</div>
          </div>
        </div>
      )}
      
      {/* Stage 2 - Focus elements */}
      {stage === 'clarifying' && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-indigo-400/20 to-transparent animate-pulse"></div>
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-400/20 to-transparent animate-pulse" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute top-3/4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-indigo-400/20 to-transparent animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
      )}
      
      {/* Stage 3 - Victory effects */}
      {stage === 'breakdown' && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 text-6xl animate-bounce opacity-40" style={{animationDuration: '1s'}}>🔥</div>
          <div className="absolute top-32 left-20 text-5xl animate-bounce opacity-40" style={{animationDuration: '1.2s', animationDelay: '0.2s'}}>🔥</div>
          <div className="absolute bottom-32 right-32 text-6xl animate-bounce opacity-40" style={{animationDuration: '1.1s', animationDelay: '0.4s'}}>🔥</div>
          <div className="absolute top-1/4 left-1/4 text-4xl animate-pulse opacity-50">⭐</div>
          <div className="absolute top-1/4 right-1/4 text-4xl animate-pulse opacity-50" style={{animationDelay: '0.3s'}}>⭐</div>
        </div>
      )}
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent pointer-events-none"></div>
      
      {/* Main Content */}
      <div className="w-full max-w-2xl relative z-10">
        <div className="text-center mb-6 sm:mb-8 md:mb-10 px-4">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full mb-3 sm:mb-4 shadow-lg shadow-indigo-500/50 animate-pulse">
            <Target className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-3">
            {stage === 'input' && 'What do you want to achieve?'}
            {stage === 'clarifying' && 'Let\'s get specific'}
            {stage === 'breakdown' && 'Your daily battle plan'}
          </h1>
          <p className="text-gray-300 text-sm sm:text-base md:text-lg">
            {stage === 'input' && 'Draw your bow. Aim at your target. Ignore the noise.'}
            {stage === 'clarifying' && 'Steady your breath. Focus your mind. Find your balance.'}
            {stage === 'breakdown' && 'Bullseye. Now repeat. Every. Single. Day.'}
          </p>
        </div>

        {stage === 'input' && (
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 border border-white/20 transform transition-all duration-500 hover:scale-[1.02]">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-200 mb-2 sm:mb-3">
                Your 30-day target
              </label>
              <textarea
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="Example: Become a better coder, lose 10 pounds, build my side project..."
                className="w-full px-4 py-3 sm:py-4 bg-white/5 border border-white/20 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-white placeholder-gray-400 text-sm sm:text-base transition-all"
                rows={4}
              />
            </div>
            
            <button
              onClick={handleGoalSubmit}
              disabled={!goal.trim()}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 sm:py-4 px-6 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base hover:from-indigo-700 hover:to-purple-700 transition-all disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-indigo-500/50 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Draw the bow <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        )}

        {stage === 'clarifying' && (
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 border border-white/20 transform transition-all duration-500">
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
                <span className="text-xs sm:text-sm font-medium text-indigo-300">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <div className="flex gap-1 sm:gap-2">
                  {questions.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-2 w-full sm:w-12 rounded-full transition-all duration-500 ${
                        idx <= currentQuestionIndex ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-white/20'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6 leading-tight">
                {questions[currentQuestionIndex]?.question}
              </h3>

              <textarea
                value={questions[currentQuestionIndex]?.answer || ''}
                onChange={(e) => handleAnswerChange(e.target.value)}
                placeholder="Be honest with yourself..."
                className="w-full px-4 py-3 sm:py-4 bg-white/5 border border-white/20 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-white placeholder-gray-400 text-sm sm:text-base transition-all"
                rows={4}
              />
            </div>

            <button
              onClick={handleAnswerSubmit}
              disabled={!questions[currentQuestionIndex]?.answer.trim()}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 sm:py-4 px-6 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base hover:from-indigo-700 hover:to-purple-700 transition-all disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-indigo-500/50 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {currentQuestionIndex < questions.length - 1 ? 'Steady your aim' : 'Release the arrow'}
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        )}

        {stage === 'breakdown' && (
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 border border-white/20 transform transition-all duration-500">
            <div className="text-center mb-6 sm:mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full mb-3 shadow-lg shadow-green-500/50 animate-pulse">
                <Zap className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">Bullseye Hit 🎯</h3>
              <p className="text-gray-300 text-sm sm:text-base">Now repeat. Every. Single. Day.</p>
            </div>

            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              {dailyActions.map((action, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-green-500/30 hover:border-green-500/50 transition-all transform hover:scale-[1.02]"
                >
                  <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-green-600 to-emerald-600 text-white rounded-full text-sm sm:text-base font-bold flex-shrink-0 mt-0.5 shadow-lg">
                    {idx + 1}
                  </div>
                  <p className="text-gray-200 flex-1 text-sm sm:text-base leading-relaxed">{action}</p>
                </div>
              ))}
            </div>

            <div className="bg-yellow-500/10 backdrop-blur-sm border border-yellow-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-5 mb-6 sm:mb-8">
              <div className="flex items-start gap-3 sm:gap-4">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm sm:text-base font-semibold text-yellow-300 mb-1 sm:mb-2">The Archer's Oath:</p>
                  <p className="text-xs sm:text-sm text-yellow-200 leading-relaxed">
                    Miss a day? Your accountability partner gets notified. 
                    The app disrupts your flow until you shoot your shot. No mercy.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleStartJourney}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 sm:py-5 px-6 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-xl hover:shadow-green-500/50 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Lock in my target 🔥
            </button>
          </div>
        )}

                <p className="text-center text-xs sm:text-sm text-gray-400 mt-6">
          Built for people who are tired of starting over.
        </p>
      </div>
    </div>
  );
};

export default GoalInputForm;