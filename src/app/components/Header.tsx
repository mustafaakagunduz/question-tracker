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
        setLanguage(newLang);
    };

    return (
        <header className="w-full py-4 bg-gradient-to-r from-indigo-900/40 to-purple-900/40 backdrop-blur-lg border-b border-indigo-300/20 sticky top-0 z-40">
            <div className="container mx-auto px-4 flex items-center justify-between">
                <div className="flex items-center">
                    <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">
                        {t('appTitle')}
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                className="rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 hover:from-indigo-500 hover:to-purple-600 shadow-lg shadow-indigo-900/30 border border-indigo-400/20 hover:shadow-indigo-700/40 flex items-center gap-2"
                                style={{ transform: 'none', transition: 'background 0.2s, filter 0.2s, box-shadow 0.2s' }}
                            >
                                <Globe className="h-5 w-5 text-white" />
                                <span className="text-white hidden md:inline">
                  {language === 'tr' ? 'Türkçe' : 'English'}
                </span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-gradient-to-br from-indigo-950/95 to-purple-950/95 text-white border border-indigo-300/20 shadow-2xl rounded-xl backdrop-blur-md">
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