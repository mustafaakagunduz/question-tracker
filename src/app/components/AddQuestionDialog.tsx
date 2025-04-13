"use client"
import React, { useState } from 'react';
import { format, addDays } from 'date-fns';
import { tr, enUS } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, PlusCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Question } from '../types';

interface AddQuestionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onQuestionAdd: (question: Question) => void;
}

export const difficultyLevels = [
    { value: 5, label: 'difficultyLevels.veryEasy', days: 5, color: 'from-green-200 to-green-100 text-green-800 border-green-200' },
    { value: 4, label: 'difficultyLevels.easy', days: 4, color: 'from-emerald-200 to-emerald-100 text-emerald-800 border-emerald-200' },
    { value: 3, label: 'difficultyLevels.medium', days: 3, color: 'from-amber-200 to-amber-100 text-amber-800 border-amber-200' },
    { value: 2, label: 'difficultyLevels.hard', days: 2, color: 'from-orange-200 to-orange-100 text-orange-800 border-orange-200' },
    { value: 1, label: 'difficultyLevels.veryHard', days: 1, color: 'from-red-200 to-red-100 text-red-800 border-red-200' },
];

export function AddQuestionDialog({ open, onOpenChange, onQuestionAdd }: AddQuestionDialogProps) {
    const { language, t } = useLanguage();
    const locale = language === 'tr' ? tr : enUS;

    const [title, setTitle] = useState('');
    const [site, setSite] = useState('');
    const [link, setLink] = useState('');
    const [solvedDate, setSolvedDate] = useState<Date>(new Date());
    const [difficultyLevel, setDifficultyLevel] = useState<number>(3); // Default: Orta
    const [datePickerOpen, setDatePickerOpen] = useState(false);

    // Zorluk seviyesine göre tekrar edilecek tarihi hesapla
    const getReviewDate = (date: Date, difficultyValue: number): Date => {
        const difficulty = difficultyLevels.find(d => d.value === difficultyValue) || difficultyLevels[2];
        return addDays(date, difficulty.days);
    };

    const reviewDate = getReviewDate(solvedDate, difficultyLevel);
    const selectedDifficulty = difficultyLevels.find(d => d.value === difficultyLevel) || difficultyLevels[2];

    const handleSubmit = () => {
        if (!title || !site || !link) {
            alert(t('addQuestionDialog.validation'));
            return;
        }

        // Dile göre zorluk seviyesi etiketini belirle
        const difficultyLabelKey = difficultyLevels.find(d => d.value === difficultyLevel)?.label || 'difficultyLevels.medium';
        const difficultyLabel = t(difficultyLabelKey);

        // Yeni soru objesi oluştur
        const newQuestion: Question = {
            id: Date.now(), // Basit bir ID oluşturma yöntemi
            title,
            site,
            link,
            solvedDate,
            difficulty: difficultyLabel,
            reviewDate: getReviewDate(solvedDate, difficultyLevel),
        };

        // Ana bileşene yeni soruyu gönder
        onQuestionAdd(newQuestion);

        // Formu sıfırla
        setTitle('');
        setSite('');
        setLink('');
        setSolvedDate(new Date());
        setDifficultyLevel(3);

        // Dialog'u kapat
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-indigo-950/95 to-purple-950/95 text-white border border-indigo-300/20 shadow-2xl rounded-xl backdrop-blur-md">
                <DialogHeader className="mb-2">
                    <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200 flex items-center">
                        <PlusCircle className="h-6 w-6 mr-2 text-blue-300" />
                        {t('addQuestionDialog.title')}
                    </DialogTitle>
                </DialogHeader>

                <div className="grid gap-5 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title" className="text-indigo-200 font-medium">{t('addQuestionDialog.questionTitle')}</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="bg-indigo-900/40 border-indigo-300/20 text-white focus:border-indigo-300/50 focus:ring-1 focus:ring-indigo-400/30 transition-all duration-200"
                            placeholder={t('addQuestionDialog.titlePlaceholder')}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="site" className="text-indigo-200 font-medium">{t('addQuestionDialog.platform')}</Label>
                        <Input
                            id="site"
                            value={site}
                            onChange={(e) => setSite(e.target.value)}
                            className="bg-indigo-900/40 border-indigo-300/20 text-white focus:border-indigo-300/50 focus:ring-1 focus:ring-indigo-400/30 transition-all duration-200"
                            placeholder={t('addQuestionDialog.platformPlaceholder')}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="link" className="text-indigo-200 font-medium">{t('addQuestionDialog.link')}</Label>
                        <Input
                            id="link"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            className="bg-indigo-900/40 border-indigo-300/20 text-white focus:border-indigo-300/50 focus:ring-1 focus:ring-indigo-400/30 transition-all duration-200"
                            placeholder={t('addQuestionDialog.linkPlaceholder')}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label className="text-indigo-200 font-medium">{t('addQuestionDialog.solvedDate')}</Label>
                        <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start text-left font-normal bg-indigo-900/40 border-indigo-300/20 text-white hover:bg-indigo-800/50 hover:border-indigo-300/30"
                                    style={{ transform: 'none', transition: 'background 0.2s, border-color 0.2s' }}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4 text-indigo-300" />
                                    {format(solvedDate, 'PPP', { locale })}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="z-50 w-auto p-0 bg-gradient-to-br from-indigo-900 to-indigo-950 border-indigo-300/20 shadow-xl">
                                <Calendar
                                    mode="single"
                                    selected={solvedDate}
                                    onSelect={(date) => {
                                        if (date) {
                                            setSolvedDate(date);
                                            setDatePickerOpen(false);
                                        }
                                    }}
                                    defaultMonth={solvedDate}
                                    className="bg-transparent text-white"
                                    locale={locale}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="grid gap-3">
                        <Label className="text-indigo-200 font-medium">{t('addQuestionDialog.difficultyLevel')}</Label>
                        <RadioGroup
                            value={difficultyLevel.toString()}
                            onValueChange={(value) => setDifficultyLevel(parseInt(value))}
                            className="grid grid-cols-1 gap-2"
                        >
                            {difficultyLevels.map((level) => (
                                <div
                                    key={level.value}
                                    className={`flex items-center space-x-2 p-2 rounded-lg border ${level.value === difficultyLevel
                                        ? `bg-gradient-to-r ${level.color} border-opacity-50`
                                        : 'bg-indigo-900/20 hover:bg-indigo-800/30 border-indigo-300/10'}`}
                                    style={{transform: 'none', transition: 'background 0.2s, border-color 0.2s'}}
                                >
                                    <RadioGroupItem
                                        value={level.value.toString()}
                                        id={`difficulty-${level.value}`}
                                        className="border-indigo-300/30 text-indigo-500 ring-offset-indigo-950 focus:ring-indigo-400/30 data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500"
                                    />
                                    <Label
                                        htmlFor={`difficulty-${level.value}`}
                                        className={`${level.value === difficultyLevel ? 'font-medium' : 'text-indigo-100'} cursor-pointer`}
                                    >
                                        <span className="flex flex-wrap items-center gap-2">
                                            <span>{t(level.label)}</span>
                                            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                                                {level.days} {t('addQuestionDialog.daysLater')}
                                            </span>
                                        </span>
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>

                    <div className="grid gap-2">
                        <Label className="text-indigo-200 font-medium">{t('addQuestionDialog.reviewDate')}</Label>
                        <div
                            className={`p-3 rounded-lg bg-gradient-to-r ${selectedDifficulty.color} bg-opacity-10 border border-opacity-20 text-center font-medium`}>
                            {format(reviewDate, 'PPP', { locale })}
                        </div>
                        <p className="text-xs text-indigo-200/70">
                            {t('addQuestionDialog.reviewDateInfo')}
                        </p>
                    </div>
                </div>

                <DialogFooter className="mt-2 space-x-3">
                    <Button
                        type="button"
                        onClick={() => onOpenChange(false)}
                        className="bg-indigo-900/40 hover:bg-indigo-800/50 text-white border border-indigo-400/20 px-6 py-2 rounded-lg"
                        style={{ transform: 'none', transition: 'background 0.2s, filter 0.2s' }}
                    >
                        {t('addQuestionDialog.cancel')}
                    </Button>

                    <Button
                        type="submit"
                        onClick={handleSubmit}
                        className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-md hover:shadow-lg border border-indigo-400/20 px-6 py-2 rounded-lg"
                        style={{ transform: 'none', transition: 'background 0.2s, filter 0.2s, box-shadow 0.2s' }}
                    >
                        {t('addQuestionDialog.save')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default AddQuestionDialog;