import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User, ArrowRight, ShieldAlert, KeyRound } from 'lucide-react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

interface AdminLoginProps {
  onLoginSuccess: (isLocalFallback: boolean) => void;
  onCancel: () => void;
}

export default function AdminLogin({ onLoginSuccess, onCancel }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const email = username.trim();

    try {
      // 1. Attempt to sign in with Firebase Auth
      await signInWithEmailAndPassword(auth, email, password);
      onLoginSuccess(false);
    } catch (err: any) {
      console.log('Login failed, checking fallback...', err);
      
      // 2. If credentials match default and user doesn't exist yet, try to auto-create in Firebase Auth
      if (
        (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/invalid-login-credentials') &&
        email === 'baker@tarabrownies.com' &&
        password === 'baker123'
      ) {
        try {
          await createUserWithEmailAndPassword(auth, email, password);
          onLoginSuccess(false);
          return;
        } catch (signupErr: any) {
          console.error('Auto signup failed:', signupErr);
        }
      }

      // 3. Robust Local Fallback: If credentials match the demo credentials, let them in anyway!
      if (email === 'baker@tarabrownies.com' && password === 'baker123') {
        console.log('Logging in via local fallback (Demo mode)');
        onLoginSuccess(true);
        return;
      }

      // Map Firebase errors to user friendly messages
      let errMsg = 'Maaf, email atau password yang Anda masukkan salah.';
      if (err.code === 'auth/invalid-email') {
        errMsg = 'Format email yang dimasukkan tidak valid.';
      } else if (err.code === 'auth/too-many-requests') {
        errMsg = 'Terlalu banyak percobaan masuk salah. Silakan coba beberapa saat lagi.';
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 relative">
      {/* Dynamic blurred glow ambient backing circles */}
      <div className="absolute top-10 left-10 w-48 h-48 rounded-full bg-surface-container-high blur-3xl opacity-40 pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-64 h-64 rounded-full bg-secondary-fixed blur-3xl opacity-30 pointer-events-none" />

      <div className="w-full max-w-[420px] z-10 space-y-6">
        
        {/* Main form card */}
        <div className="bg-white/90 backdrop-blur-md rounded-[32px] p-8 border border-border-line looms-shadow text-center space-y-6">
          <div className="space-y-1">
            <h2 className="font-display text-2xl md:text-3xl text-primary leading-tight">Admin Portal</h2>
            <p className="text-on-surface-variant text-sm">Welcome back, Head Baker!</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 text-xs font-bold p-3 rounded-xl border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
            {/* Username field */}
            <div className="space-y-1.5">
              <label className="block font-label-bold text-xs text-on-surface-variant uppercase tracking-wider pl-4" htmlFor="username">
                Username or Email
              </label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/60 group-focus-within:text-secondary transition-colors">
                  <User className="w-4 h-4" />
                </span>
                <input 
                  type="text"
                  id="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="baker@tarabrownies.com"
                  className="w-full pl-11 pr-4 py-3 rounded-full border-2 border-primary bg-surface-container-lowest focus:ring-0 focus:border-secondary transition-all outline-none text-sm font-sans"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <label className="block font-label-bold text-xs text-on-surface-variant uppercase tracking-wider pl-4" htmlFor="password">
                Password
              </label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/60 group-focus-within:text-secondary transition-colors">
                  <Lock className="w-4 h-4" />
                </span>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 rounded-full border-2 border-primary bg-surface-container-lowest focus:ring-0 focus:border-secondary transition-all outline-none text-sm font-sans"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/60 hover:text-secondary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember & forgot passwords help rows */}
            <div className="flex items-center justify-between text-xs font-bold px-2 pt-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox"
                  className="rounded border-border-line text-secondary focus:ring-secondary cursor-pointer"
                />
                <span className="text-on-surface-variant group-hover:text-on-surface transition-colors">Remember me</span>
              </label>
              <button 
                type="button"
                onClick={() => alert('Fitur pemulihan kata sandi dinonaktifkan dalam mode demonstrasi.')}
                className="text-secondary hover:underline transition-all"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Action Block */}
            <div className="pt-4 flex gap-2">
              <button 
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="w-1/3 py-3 border border-border-line hover:bg-surface-container rounded-full font-display text-xs tracking-wider uppercase text-primary transition-all disabled:opacity-50"
              >
                Kembali
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="tactile-button flex-grow py-3 bg-butter-yellow border-2 border-primary rounded-full font-display text-xs tracking-wider text-primary flex items-center justify-center gap-1.5 hover:brightness-105 active:translate-y-1 disabled:opacity-75 disabled:pointer-events-none"
              >
                {loading ? 'Logging in...' : 'Login to Dashboard'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </form>

          {/* Secure authorization message warning box */}
          <div className="p-4 bg-surface-container-low rounded-2xl border border-border-line flex gap-3 text-left">
            <ShieldAlert className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
            <p className="text-xs leading-normal text-on-surface-variant">
              Sistem Portal Admin Terenkripsi. Akses dibatasi hanya untuk staf TaraBrownies yang memiliki otorisasi penuh.
            </p>
          </div>

        </div>

        {/* Brand credit */}
        <p className="text-center text-xs text-on-surface-variant opacity-75">
          © 2026 TaraBrownies Artisanal Bakery. All rights reserved.
        </p>

      </div>
    </div>
  );
}
