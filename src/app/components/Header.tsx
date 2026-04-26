"use client"
import React from 'react';
import { HelpButton } from './HelpButton';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Globe, LogOut } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const Header = () => {
    const { language, setLanguage, t } = useLanguage();
    const { user, signOut } = useAuth();

    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (e) {
            console.error('Sign out error:', e);
        }
    };

    const toggleLanguage = (newLang: 'en' | 'tr') => {
        console.log("Toggling language to:", newLang);
        setLanguage(newLang);

        // Direkt olarak burada localStorage'a da kaydet (çift güvenlik için)
        try {
            localStorage.setItem('language', newLang);
            console.log("Language saved to localStorage from Header component");
        } catch (error) {
            console.error("Error saving language to localStorage:", error);
        }
    };

    return (
        <header className="w-full py-4 bg-slate-950/80 backdrop-blur-lg border-b border-white/[0.08] sticky top-0 z-40">
            <div className="container mx-auto px-4 flex items-center justify-between">
                <div className="flex items-center">
                    <h1 className="text-2xl font-bold text-white">
                        {t('appTitle')}
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    {user && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-2 rounded-full bg-slate-800/60 border border-white/[0.08] px-3 py-1.5 hover:bg-slate-700/60 transition-colors">
                                    <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-xs text-white font-medium">
                                        {(user.user_metadata?.full_name || user.email || '?')[0].toUpperCase()}
                                    </div>
                                    <span className="text-white/70 text-sm hidden md:inline max-w-[140px] truncate">
                                        {user.user_metadata?.full_name || user.email}
                                    </span>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-slate-900/95 text-white border border-white/[0.08] shadow-2xl rounded-xl backdrop-blur-md">
                                <div className="px-3 py-2 border-b border-white/[0.08]">
                                    <p className="text-xs text-indigo-300/50">{user.email}</p>
                                </div>
                                <DropdownMenuItem
                                    onClick={handleSignOut}
                                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20 cursor-pointer flex items-center gap-2 mt-1"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Çıkış Yap
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                className="rounded-full bg-indigo-600 hover:from-indigo-500 hover:to-purple-600 shadow-lg shadow-indigo-900/30 border border-indigo-400/20 hover:shadow-indigo-700/40 flex items-center gap-2"
                                style={{ transform: 'none', transition: 'background 0.2s, filter 0.2s, box-shadow 0.2s' }}
                            >
                                <Globe className="h-5 w-5 text-white" />
                                <span className="text-white hidden md:inline">
                  {language === 'tr' ? 'Türkçe' : 'English'}
                </span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-slate-900/95 text-white border border-white/[0.08] shadow-2xl rounded-xl backdrop-blur-md">
                            <DropdownMenuItem
                                onClick={() => toggleLanguage('tr')}
                                className={`${language === 'tr' ? 'bg-indigo-700/40' : 'hover:bg-indigo-800/30'} text-white cursor-pointer`}
                            >
                                🇹🇷 {t('language.tr')}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => toggleLanguage('en')}
                                className={`${language === 'en' ? 'bg-indigo-700/40' : 'hover:bg-indigo-800/30'} text-white cursor-pointer`}
                            >
                                🇬🇧 {t('language.en')}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <HelpButton />
                </div>
            </div>
        </header>
    );
};

export default Header;