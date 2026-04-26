"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { user, loading, updatePassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError('Şifreler eşleşmiyor.');
      return;
    }
    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalı.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await updatePassword(password);
      setSuccess(true);
      setTimeout(() => router.replace('/'), 2000);
    } catch (e: any) {
      setError(e.message ?? 'Şifre güncellenemedi.');
    } finally {
      setBusy(false);
    }
  };

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-[#08081a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">Algoritma Soru Takibi</h1>
        </div>

        <div className="bg-slate-900/70 border border-white/[0.08] rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
          {success ? (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-7 h-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white">Şifren güncellendi</h2>
              <p className="text-indigo-300/60 text-sm">Ana sayfaya yönlendiriliyorsun...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <h2 className="text-xl font-semibold text-white">Yeni şifre belirle</h2>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-indigo-200/80 text-sm">Yeni şifre</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="En az 6 karakter"
                  required
                  className="bg-slate-800/80 border-white/10 text-white placeholder:text-white/30 focus:border-indigo-500 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-indigo-200/80 text-sm">Şifre tekrar</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="••••••••"
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
                {busy ? 'Güncelleniyor...' : 'Şifremi Güncelle'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
