'use client';

import React, { useState, useEffect } from 'react';
import { X, Flame, AlertTriangle, Target, Clock } from 'lucide-react';

interface DisruptionModalProps {
  isOpen: boolean;
  completedTasks: number;
  totalTasks: number;
  currentStreak: number;
  partnerName: string;
  onClose: () => void;
}

export default function DisruptionModal({
  isOpen,
  completedTasks,
  totalTasks,
  currentStreak,
  partnerName,
  onClose,
}: DisruptionModalProps) {
  const [canClose, setCanClose] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [intensity, setIntensity] = useState<'gentle' | 'medium' | 'harsh'>('gentle');

  const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const currentHour = new Date().getHours();

  // Determine intensity based on time and completion
  useEffect(() => {
    if (currentHour >= 20 && percentage < 25) {
      setIntensity('harsh'); // After 8pm and barely done
    } else if (currentHour >= 18 && percentage < 50) {
      setIntensity('medium'); // After 6pm and less than half done
    } else {
      setIntensity('gentle'); // Early in day or making progress
    }
  }, [currentHour, percentage]);

  // Countdown before allowing close
  useEffect(() => {
    if (!isOpen) return;

    setCanClose(false);
    setCountdown(10);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanClose(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const getMessage = () => {
    if (intensity === 'harsh') {
      return {
        title: "STOP EVERYTHING.",
        subtitle: "You're failing yourself right now.",
        body: `It's ${new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} and you've only completed ${percentage}% of your tasks. Your ${currentStreak}-day streak is about to die. ${partnerName} is watching.`,
        color: 'red',
      };
    } else if (intensity === 'medium') {
      return {
        title: "You're Slacking.",
        subtitle: "Time to get back on track.",
        body: `${partnerName} will be notified if you don't complete your tasks by midnight. You've done ${completedTasks} out of ${totalTasks}. Don't break your ${currentStreak}-day streak now.`,
        color: 'orange',
      };
    } else {
      return {
        title: "Quick Check-In",
        subtitle: "How are you doing today?",
        body: `You've completed ${completedTasks} out of ${totalTasks} tasks. Keep going! ${partnerName} believes in you.`,
        color: 'indigo',
      };
    }
  };

  const message = getMessage();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      
      {/* Backdrop - can't click through */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      ></div>

      {/* Modal */}
      <div 
        className={`relative w-full max-w-lg bg-gradient-to-br ${
          message.color === 'red' 
            ? 'from-red-900 via-red-800 to-red-900' 
            : message.color === 'orange'
            ? 'from-orange-900 via-orange-800 to-orange-900'
            : 'from-indigo-900 via-indigo-800 to-indigo-900'
        } rounded-2xl shadow-2xl border-2 ${
          message.color === 'red'
            ? 'border-red-500'
            : message.color === 'orange'
            ? 'border-orange-500'
            : 'border-indigo-500'
        } overflow-hidden animate-scale-in`}
      >
        
        {/* Pulsing border effect */}
        <div className={`absolute inset-0 ${
          message.color === 'red'
            ? 'bg-red-500'
            : message.color === 'orange'
            ? 'bg-orange-500'
            : 'bg-indigo-500'
        } opacity-20 animate-pulse`}></div>

        {/* Close button (only after countdown) */}
        {canClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-all"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        )}

        {/* Content */}
        <div className="relative p-8 sm:p-10">
          
          {/* Icon */}
          <div className="flex justify-center mb-6">
            {message.color === 'red' ? (
              <div className="w-20 h-20 bg-red-500/30 rounded-full flex items-center justify-center animate-pulse">
                <AlertTriangle className="w-10 h-10 text-red-300" />
              </div>
            ) : message.color === 'orange' ? (
              <div className="w-20 h-20 bg-orange-500/30 rounded-full flex items-center justify-center animate-pulse">
                <Clock className="w-10 h-10 text-orange-300" />
              </div>
            ) : (
              <div className="w-20 h-20 bg-indigo-500/30 rounded-full flex items-center justify-center animate-pulse">
                <Target className="w-10 h-10 text-indigo-300" />
              </div>
            )}
          </div>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl font-black text-white text-center mb-2">
            {message.title}
          </h2>
          <p className={`text-lg sm:text-xl text-center mb-6 ${
            message.color === 'red'
              ? 'text-red-200'
              : message.color === 'orange'
              ? 'text-orange-200'
              : 'text-indigo-200'
          }`}>
            {message.subtitle}
          </p>

          {/* Body */}
          <p className="text-white/90 text-center mb-8 leading-relaxed">
            {message.body}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 bg-black/20 rounded-lg">
              <p className="text-white/60 text-xs mb-1">Completed</p>
              <p className="text-2xl font-bold text-white">{completedTasks}/{totalTasks}</p>
            </div>
            <div className="text-center p-4 bg-black/20 rounded-lg">
              <p className="text-white/60 text-xs mb-1">Progress</p>
              <p className="text-2xl font-bold text-white">{percentage}%</p>
            </div>
            <div className="text-center p-4 bg-black/20 rounded-lg">
              <p className="text-white/60 text-xs mb-1">Streak</p>
              <p className="text-2xl font-bold text-white flex items-center justify-center gap-1">
                <Flame className="w-5 h-5 text-orange-400" />
                {currentStreak}
              </p>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={() => window.location.href = '/dashboard'}
            className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all ${
              message.color === 'red'
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : message.color === 'orange'
                ? 'bg-orange-600 hover:bg-orange-700 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            } transform hover:scale-105 active:scale-95`}
          >
            Go Complete Your Tasks
          </button>

          {/* Countdown warning */}
          {!canClose && (
            <p className="text-center text-white/60 text-sm mt-4">
              You can close this in {countdown} seconds...
            </p>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { 
            opacity: 0;
            transform: scale(0.9);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </div>
  );
}