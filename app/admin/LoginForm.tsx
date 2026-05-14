'use client';

import React, { useState } from 'react';
import { loginAdmin } from './actions';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await loginAdmin(email, password);
      if (result.success) {
        window.location.reload();
      } else {
        setError(result.error || 'Unauthorized');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 py-12 text-slate-100">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-sm">
        
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-sky-950/50 border border-sky-900/50 text-sky-500">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="mt-6 text-2xl font-extrabold tracking-tight text-white">Vega Admin Access</h2>
          <p className="mt-2 text-sm text-slate-400">
            Authorized agency personnel only.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="relative block w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 placeholder-slate-500 shadow-inner focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm transition-all"
                placeholder="Admin Email"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Admin Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="relative block w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 placeholder-slate-500 shadow-inner focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm transition-all"
                placeholder="Password"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-950/40 border border-red-900/30 p-3 text-center text-xs font-medium text-red-400">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                'Unlock Terminal'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
