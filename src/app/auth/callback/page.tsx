"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseClient } from '../../lib/supabaseClient';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = getSupabaseClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      router.replace(session ? '/' : '/login');
    });
  }, [router]);

  return (
    <div className="min-h-screen bg-[#08081a] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-indigo-300/60 text-sm">Giriş yapılıyor...</p>
      </div>
    </div>
  );
}
