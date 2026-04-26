"use client"
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type View = 'login' | 'register' | 'otp' | 'forgot' | 'forgot-sent';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, signInWithGoogle, signUpWithEmail, verifyOtp, signInWithPassword, sendPasswordReset, resendOtp } = useAuth();

  const [view, setView] = useState<View>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!loading && user) router.replace('/');
  }, [user, loading, router]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  if (loading || user) return null;

  const clearError = () => setError('');

  const handleGoogleSignIn = async () => {
    setBusy(true);
    clearError();
    try {
      await signInWithGoogle();
    } catch (e: any) {
      setError(e.message ?? 'Google ile giriş başarısız.');
      setBusy(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    clearError();
    try {
      await signInWithPassword(email, password);
      router.replace('/');
    } catch (e: any) {
      setError(e.message?.includes('Invalid login') ? 'E-posta veya şifre hatalı.' : (e.message ?? 'Giriş başarısız.'));
    } finally {
      setBusy(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor.');
      return;
    }
    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalı.');
      return;
    }
    setBusy(true);
    clearError();
    try {
      await signUpWithEmail(email, password);
      setOtpDigits(['', '', '', '', '', '']);
      setView('otp');
      setResendCooldown(60);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (e: any) {
      if (e.message?.includes('already registered')) {
        setError('Bu e-posta zaten kayıtlı. Giriş yapmayı deneyin.');
      } else {
        setError(e.message ?? 'Kayıt başarısız.');
      }
    } finally {
      setBusy(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(-1);
    const next = [...otpDigits];
    next[index] = cleaned;
    setOtpDigits(next);
    if (cleaned && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtpDigits(pasted.split(''));
      otpRefs.current[5]?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = otpDigits.join('');
    if (token.length !== 6) {
      setError('6 haneli kodu eksiksiz girin.');
      return;
    }
    setBusy(true);
    clearError();
    try {
      await verifyOtp(email, token);
      router.replace('/');
    } catch (e: any) {
      setError(e.message?.includes('Token has expired') ? 'Kod süresi doldu. Yeni kod isteyin.' : (e.message ?? 'Kod hatalı.'));
    } finally {
      setBusy(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setBusy(true);
    clearError();
    try {
      await resendOtp(email);
      setResendCooldown(60);
    } catch (e: any) {
      setError(e.message ?? 'Kod gönderilemedi.');
    } finally {
      setBusy(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    clearError();
    try {
      await sendPasswordReset(email);
      setView('forgot-sent');
    } catch (e: any) {
      setError(e.message ?? 'Sıfırlama e-postası gönderilemedi.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08081a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo / Başlık */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">Algoritma Soru Takibi</h1>
          <p className="text-indigo-300/60 mt-2 text-sm">Sorularını takip et, düzenli tekrar et</p>
        </div>

        <div className="bg-slate-900/70 border border-white/[0.08] rounded-2xl p-8 shadow-2xl backdrop-blur-sm">

          {/* OTP Doğrulama */}
          {view === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-white">E-postanı doğrula</h2>
                <p className="text-indigo-300/70 text-sm mt-2">
                  <span className="text-indigo-300 font-medium">{email}</span> adresine gönderilen 6 haneli kodu gir
                </p>
              </div>

              <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
                {otpDigits.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => { otpRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(i, e)}
                    className="w-11 h-14 text-center text-xl font-bold bg-slate-800/80 border border-white/10 rounded-xl text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 outline-none transition-all"
                  />
                ))}
              </div>

              {error && <p className="text-red-400 text-sm text-center">{error}</p>}

              <Button
                type="submit"
                disabled={busy || otpDigits.join('').length !== 6}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-xl transition-colors disabled:opacity-50"
              >
                {busy ? 'Doğrulanıyor...' : 'Doğrula'}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0 || busy}
                  className="text-sm text-indigo-400 hover:text-indigo-300 disabled:text-indigo-400/40 transition-colors"
                >
                  {resendCooldown > 0 ? `Tekrar gönder (${resendCooldown}s)` : 'Kodu tekrar gönder'}
                </button>
              </div>
            </form>
          )}

          {/* Şifremi Unuttum */}
          {view === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-5">
              <div>
                <h2 className="text-xl font-semibold text-white">Şifreni sıfırla</h2>
                <p className="text-indigo-300/60 text-sm mt-1">E-posta adresine sıfırlama linki göndereceğiz</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="forgot-email" className="text-indigo-200/80 text-sm">E-posta</Label>
                <Input
                  id="forgot-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="ornek@gmail.com"
                  required
                  className="bg-slate-800/80 border-white/10 text-white placeholder:text-white/30 focus:border-indigo-500 rounded-xl"
                />
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <Button
                type="submit"
                disabled={busy}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-xl transition-colors disabled:opacity-50"
              >
                {busy ? 'Gönderiliyor...' : 'Sıfırlama linki gönder'}
              </Button>

              <button
                type="button"
                onClick={() => { setView('login'); clearError(); }}
                className="w-full text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                ← Giriş yap
              </button>
            </form>
          )}

          {/* Şifre Sıfırlama Gönderildi */}
          {view === 'forgot-sent' && (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-7 h-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white">E-posta gönderildi</h2>
              <p className="text-indigo-300/70 text-sm">
                <span className="text-indigo-300 font-medium">{email}</span> adresine şifre sıfırlama linki gönderildi. Gelen kutunu ve spam klasörünü kontrol et.
              </p>
              <button
                onClick={() => { setView('login'); clearError(); }}
                className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                ← Giriş yap
              </button>
            </div>
          )}

          {/* Login / Register */}
          {(view === 'login' || view === 'register') && (
            <>
              {/* Sekme Başlıkları */}
              <div className="flex mb-6 bg-slate-800/50 rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => { setView('login'); clearError(); }}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${view === 'login' ? 'bg-indigo-600 text-white shadow-lg' : 'text-indigo-300/60 hover:text-indigo-200'}`}
                >
                  Giriş Yap
                </button>
                <button
                  type="button"
                  onClick={() => { setView('register'); clearError(); }}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${view === 'register' ? 'bg-indigo-600 text-white shadow-lg' : 'text-indigo-300/60 hover:text-indigo-200'}`}
                >
                  Kayıt Ol
                </button>
              </div>

              {/* Google Butonu */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={busy}
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 font-medium py-2.5 rounded-xl border border-gray-200 transition-colors disabled:opacity-50 mb-5"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google ile {view === 'login' ? 'giriş yap' : 'kayıt ol'}
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-white/[0.08]" />
                <span className="text-indigo-300/40 text-xs">veya</span>
                <div className="flex-1 h-px bg-white/[0.08]" />
              </div>

              {/* Login Formu */}
              {view === 'login' && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-indigo-200/80 text-sm">E-posta</Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={email}
                      onChange={e => { setEmail(e.target.value); clearError(); }}
                      placeholder="ornek@gmail.com"
                      required
                      className="bg-slate-800/80 border-white/10 text-white placeholder:text-white/30 focus:border-indigo-500 rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-password" className="text-indigo-200/80 text-sm">Şifre</Label>
                      <button
                        type="button"
                        onClick={() => { setView('forgot'); clearError(); }}
                        className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        Şifremi unuttum
                      </button>
                    </div>
                    <Input
                      id="login-password"
                      type="password"
                      value={password}
                      onChange={e => { setPassword(e.target.value); clearError(); }}
                      placeholder="••••••••"
                      required
                      className="bg-slate-800/80 border-white/10 text-white placeholder:text-white/30 focus:border-indigo-500 rounded-xl"
                    />
                  </div>

                  {error && <p className="text-red-400 text-sm">{error}</p>}

                  <Button
                    type="submit"
                    disabled={busy}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-xl transition-colors disabled:opacity-50 mt-1"
                  >
                    {busy ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                  </Button>
                </form>
              )}

              {/* Register Formu */}
              {view === 'register' && (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reg-email" className="text-indigo-200/80 text-sm">E-posta</Label>
                    <Input
                      id="reg-email"
                      type="email"
                      value={email}
                      onChange={e => { setEmail(e.target.value); clearError(); }}
                      placeholder="ornek@gmail.com"
                      required
                      className="bg-slate-800/80 border-white/10 text-white placeholder:text-white/30 focus:border-indigo-500 rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-password" className="text-indigo-200/80 text-sm">Şifre</Label>
                    <Input
                      id="reg-password"
                      type="password"
                      value={password}
                      onChange={e => { setPassword(e.target.value); clearError(); }}
                      placeholder="En az 6 karakter"
                      required
                      className="bg-slate-800/80 border-white/10 text-white placeholder:text-white/30 focus:border-indigo-500 rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-confirm" className="text-indigo-200/80 text-sm">Şifre tekrar</Label>
                    <Input
                      id="reg-confirm"
                      type="password"
                      value={confirmPassword}
                      onChange={e => { setConfirmPassword(e.target.value); clearError(); }}
                      placeholder="••••••••"
                      required
                      className="bg-slate-800/80 border-white/10 text-white placeholder:text-white/30 focus:border-indigo-500 rounded-xl"
                    />
                  </div>

                  {error && <p className="text-red-400 text-sm">{error}</p>}

                  <Button
                    type="submit"
                    disabled={busy}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-xl transition-colors disabled:opacity-50 mt-1"
                  >
                    {busy ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
                  </Button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
