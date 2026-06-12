// app/partner/accept/PartnerAcceptClient.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { Users, Mail, Lock, User, Loader2, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

interface PartnershipDetails {
  inviterName: string;
  inviterGoal: string;
  partnerEmail: string;
  isRegistered: boolean;
}

export default function PartnerAcceptClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [partnershipDetails, setPartnershipDetails] = useState<PartnershipDetails | null>(null);
  const [error, setError] = useState('');
  const [accepting, setAccepting] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (!token) {
      setError('Invalid invitation link');
      setLoading(false);
      return;
    }
    fetchPartnershipDetails();
  }, [token]);

  const fetchPartnershipDetails = async () => {
    try {
      const response = await fetch(`/api/partners/details?token=${token}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Invalid or expired invitation');
        setLoading(false);
        return;
      }

      setPartnershipDetails(data);
      setSignupData((prev) => ({ ...prev, email: data.partnerEmail }));
      setLoading(false);
    } catch (err) {
      setError('Failed to load invitation details');
      setLoading(false);
    }
  };

  const handleSignupAndAccept = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (signupData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setAccepting(true);

    try {
      const signupResponse = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signupData.name,
          email: signupData.email,
          password: signupData.password,
        }),
      });

      if (!signupResponse.ok) {
        const data = await signupResponse.json();
        setError(data.error || 'Signup failed');
        setAccepting(false);
        return;
      }

      const signInResult = await signIn('credentials', {
        email: signupData.email,
        password: signupData.password,
        redirect: false,
      });

      if (!signInResult?.ok) {
        setError('Account created but login failed. Please login manually.');
        setAccepting(false);
        return;
      }

      await acceptPartnership();
    } catch (err) {
      setError('An unexpected error occurred');
      setAccepting(false);
    }
  };

  const acceptPartnership = async () => {
    try {
      const response = await fetch('/api/partners/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to accept partnership');
        setAccepting(false);
        return;
      }

      setAccepted(true);
      setTimeout(() => {
        router.push('/partner/dashboard');
      }, 2000);
    } catch (err) {
      setError('Failed to accept partnership');
      setAccepting(false);
    }
  };

  const handleAcceptExisting = async () => {
    setAccepting(true);
    await acceptPartnership();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading invitation...</p>
        </div>
      </div>
    );
  }

  if (error && !partnershipDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-red-500/10 border border-red-500/50 rounded-2xl p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Invalid Invitation</h2>
          <p className="text-red-200 mb-6">{error}</p>
          <Link
            href="/login"
            className="inline-block px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (accepted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-xl border border-green-500/50 rounded-2xl p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Partnership Accepted! 🎯</h2>
          <p className="text-gray-300 mb-4">
            You're now {partnershipDetails?.inviterName}'s accountability partner.
          </p>
          <p className="text-sm text-gray-400">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full mb-4 shadow-lg shadow-purple-500/50">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Accountability Partnership</h1>
          <p className="text-gray-400">
            {partnershipDetails?.inviterName} wants you to help them achieve their goals
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 mb-6">
          <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4 mb-6">
            <p className="text-indigo-200 text-sm mb-2">
              <strong className="text-indigo-100">{partnershipDetails?.inviterName}</strong> is working on:
            </p>
            <p className="text-white font-semibold italic">"{partnershipDetails?.inviterGoal}"</p>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
            <p className="text-yellow-200 text-sm mb-2">
              <strong>As their accountability partner:</strong>
            </p>
            <ul className="text-yellow-100 text-sm space-y-1 list-disc list-inside">
              <li>You'll see their daily progress</li>
              <li>You'll get notified when they're slacking</li>
              <li>You can encourage or call them out</li>
              <li>They can't hide from you</li>
            </ul>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          {status === 'authenticated' ? (
            <button
              onClick={handleAcceptExisting}
              disabled={accepting}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {accepting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Accepting...
                </>
              ) : (
                <>
                  Accept Partnership
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          ) : partnershipDetails?.isRegistered ? (
            <div>
              <p className="text-gray-300 text-sm mb-4">
                You already have an account. Please login to accept this partnership.
              </p>
              <Link
                href={`/login?callbackUrl=/partner/accept?token=${token}`}
                className="block w-full text-center bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                Login to Accept
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSignupAndAccept} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Your Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={signupData.name}
                    onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={signupData.email}
                    readOnly
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-gray-400 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={signupData.confirmPassword}
                    onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={accepting}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {accepting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account & Accept
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-gray-500">
          You can set your own goals later, or just monitor {partnershipDetails?.inviterName}
        </p>
      </div>
    </div>
  );
}