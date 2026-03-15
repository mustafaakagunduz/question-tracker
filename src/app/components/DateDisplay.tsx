"use client"
import React from 'react';
import { format } from 'date-fns';
import { tr, enUS } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';

import { useLanguage } from '../contexts/LanguageContext';

export const DateDisplay = () => {
    const { language, t } = useLanguage();
    const today = new Date();
    const locale = language === 'tr' ? tr : enUS;

    // Tarih formatları
    const fullDate = format(today, 'PPP', { locale });
    const dayName = format(today, 'EEEE', { locale });
    const dayNumber = format(today, 'd');

    return (
        <Card className="w-full h-full bg-slate-900/50 backdrop-blur-md border border-white/[0.08] shadow-2xl rounded-xl overflow-hidden">
            <CardContent className="p-6 flex flex-col items-center justify-center h-full">
                <div className="space-y-2 text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-white">
                        {fullDate}
                    </h2>
                    <p className="text-lg font-medium text-indigo-200 opacity-80">
                        {dayName}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default DateDisplay;