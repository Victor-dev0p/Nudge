'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Target, Flame, Users, Zap, TrendingUp, Clock, CheckCircle, ArrowRight, Menu, X } from 'lucide-react';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-xl border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">StreakArcher</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6">
              <Link href="/login" className="text-gray-300 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link 
                href="/signup" 
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-indigo-500/50"
              >
                Start Free
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-3">
              <Link href="/login" className="block text-gray-300 hover:text-white transition-colors py-2">
                Sign In
              </Link>
              <Link 
                href="/signup" 
                className="block text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold"
              >
                Start Free
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Target rings in background */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-5">
            <svg viewBox="0 0 600 600" className="w-[800px] h-[800px]">
              <circle cx="300" cy="300" r="280" fill="none" stroke="#ffffff" strokeWidth="12" className="animate-pulse" style={{animationDuration: '4s'}} />
              <circle cx="300" cy="300" r="210" fill="none" stroke="#ef4444" strokeWidth="12" className="animate-pulse" style={{animationDuration: '4.5s'}} />
              <circle cx="300" cy="300" r="140" fill="none" stroke="#3b82f6" strokeWidth="12" className="animate-pulse" style={{animationDuration: '5s'}} />
              <circle cx="300" cy="300" r="70" fill="none" stroke="#fbbf24" strokeWidth="12" className="animate-pulse" style={{animationDuration: '5.5s'}} />
            </svg>
          </div>

          {/* Floating distractions */}
          <div className="absolute top-20 right-20 text-6xl opacity-10 animate-bounce" style={{animationDuration: '3s'}}>📱</div>
          <div className="absolute bottom-40 left-20 text-5xl opacity-10 animate-bounce" style={{animationDuration: '4s'}}>🎮</div>
          <div className="absolute top-1/3 left-1/4 text-4xl opacity-10 animate-bounce" style={{animationDuration: '3.5s'}}>📺</div>
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full px-4 py-2 mb-6">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-sm text-indigo-300 font-semibold">Built by procrastinators, for procrastinators</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
            Stop Missing Your{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Targets
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Every goal is a bullseye. Every day is an arrow. Miss too many and your streak dies. 
            <span className="block mt-2 text-white font-semibold">We make sure you don't miss.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link 
              href="/signup"
              className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-2xl hover:shadow-indigo-500/50 transform hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              Start Your Streak <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#how-it-works"
              className="w-full sm:w-auto border border-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/5 transition-all flex items-center justify-center gap-2"
            >
              See How It Works
            </Link>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center gap-8 text-gray-400 text-sm">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-400" />
              <span>7-day avg streak</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              <span>Active accountability partners</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span>89% completion rate</span>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50 border-y border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            You're Not Lazy. You're Just{' '}
            <span className="text-red-400">Unaccountable.</span>
          </h2>
          
          <p className="text-xl text-gray-300 mb-12">
            Goals die in the silence. When no one's watching, you scroll. You delay. You convince yourself "tomorrow." 
            <span className="block mt-4 text-white font-semibold">Tomorrow never comes.</span>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white/5 backdrop-blur-sm border border-red-500/30 rounded-xl p-6">
              <div className="text-4xl mb-3">😴</div>
              <h3 className="text-lg font-semibold text-white mb-2">Endless "I'll Start Monday"</h3>
              <p className="text-gray-400 text-sm">You've started a hundred times. Finished zero.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-red-500/30 rounded-xl p-6">
              <div className="text-4xl mb-3">📱</div>
              <h3 className="text-lg font-semibold text-white mb-2">Distraction Wins Every Time</h3>
              <p className="text-gray-400 text-sm">Netflix, games, scrolling—anything but the work.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-red-500/30 rounded-xl p-6">
              <div className="text-4xl mb-3">🤷</div>
              <h3 className="text-lg font-semibold text-white mb-2">No One Knows You Failed</h3>
              <p className="text-gray-400 text-sm">Silent failure. No consequences. No change.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              The Archer's Path
            </h2>
            <p className="text-xl text-gray-300">
              Three steps. Daily practice. Unstoppable momentum.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Step 1 */}
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:border-indigo-500/50 transition-all transform hover:scale-[1.02]">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 text-center">1. Set Your Target</h3>
                <p className="text-gray-300 text-center mb-6">
                  Tell us your goal. We break it into daily arrows you can actually shoot.
                </p>
                <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4">
                  <p className="text-sm text-indigo-300 italic">"Become a better coder" → 15min daily practice</p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:border-purple-500/50 transition-all transform hover:scale-[1.02]">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 text-center">2. Get a Spotter</h3>
                <p className="text-gray-300 text-center mb-6">
                  Choose someone who'll call you out. Friend, mentor, or we match you with another archer.
                </p>
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="text-sm text-purple-300 italic">"Alex will know if you slack"</p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:border-green-500/50 transition-all transform hover:scale-[1.02]">
                <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Flame className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 text-center">3. Keep the Fire Alive</h3>
                <p className="text-gray-300 text-center mb-6">
                  Hit your daily targets or the app disrupts you. Your partner gets notified. Shame is a powerful motivator.
                </p>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="text-sm text-green-300 italic">🔥 12-day streak and counting</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              We Don't Let You Quit
            </h2>
            <p className="text-xl text-gray-300">
              Accountability that actually works.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <Zap className="w-8 h-8 text-yellow-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Daily Disruption</h3>
              <p className="text-gray-400 text-sm">Skip a task? The app blocks distractions until you complete it.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <Users className="w-8 h-8 text-purple-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Public Accountability</h3>
              <p className="text-gray-400 text-sm">Your partner sees when you slack. No hiding.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <Flame className="w-8 h-8 text-orange-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Streak Tracking</h3>
              <p className="text-gray-400 text-sm">Watch your fire grow. Break it and feel the pain.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <Target className="w-8 h-8 text-indigo-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Personalized Targets</h3>
              <p className="text-gray-400 text-sm">AI breaks your goal into bite-sized daily actions.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <Clock className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Time-Based Pressure</h3>
              <p className="text-gray-400 text-sm">Complete by midnight or lose your streak.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <CheckCircle className="w-8 h-8 text-green-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Progress Visualization</h3>
              <p className="text-gray-400 text-sm">See your arrows fill the target. Satisfying completion.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-12 border border-white/10 shadow-2xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Hit Your Targets?
            </h2>
            <p className="text-xl text-indigo-100 mb-8">
              Join the archers who stopped making excuses and started making progress.
            </p>
            <Link 
              href="/signup"
              className="inline-flex items-center gap-3 bg-white text-indigo-600 px-10 py-5 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-xl transform hover:scale-[1.02]"
            >
              Start Free Today <ArrowRight className="w-6 h-6" />
            </Link>
            <p className="text-indigo-200 text-sm mt-4">No credit card required. Cancel anytime.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center text-gray-400 text-sm">
          <p>© 2026 StreakArcher. Built with discipline, not distractions.</p>
        </div>
      </footer>

    </div>
  );
}