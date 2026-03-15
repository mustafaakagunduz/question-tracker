"use client"
import React from 'react';
import { HelpButton } from './HelpButton';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const Header = () => {
    const { language, setLanguage, t } = useLanguage();

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