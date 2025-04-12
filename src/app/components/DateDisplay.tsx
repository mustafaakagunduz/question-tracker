import React from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarIcon } from 'lucide-react';

export const DateDisplay = () => {
    const today = new Date();

    // Tarih formatları
    const fullDate = format(today, 'PPP', { locale: tr });
    const dayName = format(today, 'EEEE', { locale: tr });
    const dayNumber = format(today, 'd');

    return (
        <Card className="w-full h-full bg-gradient-to-br from-indigo-950/80 to-purple-900/70 backdrop-blur-md border border-indigo-300/20 shadow-2xl rounded-xl overflow-hidden">
            <CardContent className="p-6 flex flex-col justify-center h-full">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                            {fullDate}
                        </h2>
                        <p className="text-lg font-medium text-indigo-200 opacity-80">
                            {dayName}
                        </p>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-600/80 to-purple-700/70 p-4 rounded-full border border-indigo-300/40 shadow-lg shadow-indigo-900/30 backdrop-blur-sm hover:shadow-indigo-700/40"
                         style={{ transform: 'none', transition: 'background 0.2s, box-shadow 0.2s' }}>
                        <CalendarIcon className="h-8 w-8 text-white" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default DateDisplay;