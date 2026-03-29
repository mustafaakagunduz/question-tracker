"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ExternalLink, CheckCircle, Clock, CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { tr, enUS } from 'date-fns/locale';
import { useLanguage } from '../contexts/LanguageContext';
import { Question, ReviewStatus } from '../types';
import {
    fetchQuestions,
    fetchReviewStatusForDate,
    setReviewStatusForDate,
    updateQuestionNextReviewDate,
} from '../lib/questionsApi';

const toDateOnly = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const TodayReviewQuestions: React.FC = () => {
    const { t, language } = useLanguage();
    const locale = language === 'tr' ? tr : enUS;

    const [todayQuestions, setTodayQuestions] = useState<Question[]>([]);
    const [reviewStatus, setReviewStatus] = useState<ReviewStatus>({});
    const [loading, setLoading] = useState(true);
    const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
    const [nextReviewDate, setNextReviewDate] = useState<Date>(new Date());
    const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);
    const [savingReschedule, setSavingReschedule] = useState(false);
    const [datePickerOpen, setDatePickerOpen] = useState(false);

    const loadReviewQueue = useCallback(async () => {
        setLoading(true);

        try {
            const questions = await fetchQuestions();
            const todayStr = toDateOnly(new Date());

            const dueQuestions = questions.filter((q) => {
                if (!q.reviewDate) return false;
                return toDateOnly(q.reviewDate) <= todayStr;
            });

            const groupedByDueDate = dueQuestions.reduce<Record<string, number[]>>((acc, q) => {
                if (!q.reviewDate) return acc;

                const dueDate = toDateOnly(q.reviewDate);
                if (!acc[dueDate]) acc[dueDate] = [];
                acc[dueDate].push(q.id);

                return acc;
            }, {});

            const mergedStatus: ReviewStatus = {};
            for (const [dueDate, ids] of Object.entries(groupedByDueDate)) {
                const status = await fetchReviewStatusForDate(ids, dueDate);
                Object.assign(mergedStatus, status);
            }

            setTodayQuestions(dueQuestions);
            setReviewStatus(mergedStatus);
        } catch (error) {
            console.error('Tekrar kuyruğu yüklenirken hata oluştu:', error);
            alert('Review queue could not be loaded from Supabase.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadReviewQueue();
    }, [loadReviewQueue]);

    const openRescheduleDialog = (question: Question) => {
        setSelectedQuestion(question);
        setNextReviewDate(new Date());
        setDatePickerOpen(false);
        setRescheduleDialogOpen(true);
    };

    const handleRescheduleSubmit = async () => {
        if (!selectedQuestion || !selectedQuestion.reviewDate) return;

        const previousDueDate = toDateOnly(selectedQuestion.reviewDate);
        const nextDueDate = toDateOnly(nextReviewDate);

        setSavingReschedule(true);

        try {
            // Mevcut due date için "tekrar edildi" olarak işaretle
            await setReviewStatusForDate(selectedQuestion.id, previousDueDate, true);

            // Sorunun bir sonraki tekrar tarihini güncelle
            await updateQuestionNextReviewDate(selectedQuestion.id, nextDueDate);

            // Yeni tarihte başlangıç durumu tekrar edilmedi olsun
            await setReviewStatusForDate(selectedQuestion.id, nextDueDate, false);

            setRescheduleDialogOpen(false);
            setSelectedQuestion(null);
            await loadReviewQueue();
        } catch (error) {
            console.error('Yeni tekrar tarihi kaydedilirken hata oluştu:', error);
            alert('Next review date could not be saved.');
        } finally {
            setSavingReschedule(false);
        }
    };

    const allReviewed = todayQuestions.length > 0 &&
        todayQuestions.every((q) => reviewStatus[q.id] === true);

    const completedCount = todayQuestions.filter((q) => reviewStatus[q.id]).length;

    return (
        <>
            <Dialog open={rescheduleDialogOpen} onOpenChange={setRescheduleDialogOpen}>
                <DialogContent className="sm:max-w-[420px] bg-slate-900/95 text-white border border-white/[0.08]">
                    <DialogHeader>
                        <DialogTitle>Sonraki Tekrar Tarihini Seç</DialogTitle>
                    </DialogHeader>

                    <div className="py-2">
                        <p className="text-sm text-indigo-200/80 mb-3">
                            {selectedQuestion ? `Soru: ${selectedQuestion.title}` : ''}
                        </p>
                        <div className="grid gap-2">
                            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start text-left font-normal bg-indigo-900/40 border-indigo-300/20 text-white hover:bg-indigo-800/50 hover:border-indigo-300/30"
                                        style={{ transform: 'none', transition: 'background 0.2s, border-color 0.2s' }}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4 text-indigo-300" />
                                        {format(nextReviewDate, 'PPP', { locale })}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="z-[200] w-auto p-0 bg-slate-900 border-white/[0.08] shadow-xl">
                                    <Calendar
                                        mode="single"
                                        selected={nextReviewDate}
                                        onSelect={(date) => {
                                            if (date) {
                                                setNextReviewDate(date);
                                                setDatePickerOpen(false);
                                            }
                                        }}
                                        defaultMonth={nextReviewDate}
                                        className="bg-transparent text-white"
                                        locale={locale}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            onClick={() => setRescheduleDialogOpen(false)}
                            className="bg-indigo-900/40 hover:bg-indigo-800/50 text-white border border-indigo-400/20"
                        >
                            Vazgeç
                        </Button>
                        <Button
                            type="button"
                            onClick={() => {
                                void handleRescheduleSubmit();
                            }}
                            disabled={savingReschedule}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-400/20"
                        >
                            {savingReschedule ? 'Kaydediliyor...' : 'Kaydet'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="w-full h-full rounded-xl overflow-hidden border border-white/[0.08] shadow-2xl bg-slate-900/50 backdrop-blur-md">
                <div className="flex items-center justify-between p-6 border-b border-white/[0.08]">
                    <h2 className="text-2xl font-bold text-white">{t('todayReviewQuestions.title')}</h2>
                    {allReviewed && todayQuestions.length > 0 ? (
                        <div className="flex items-center bg-emerald-800/30 text-green-300 px-4 py-2 rounded-full border border-green-500/20 shadow-inner shadow-green-900/20">
                            <CheckCircle className="h-5 w-5 mr-2" />
                            <span className="text-sm font-medium">{t('todayReviewQuestions.allCompleted')}</span>
                        </div>
                    ) : todayQuestions.length > 0 ? (
                        <div className="flex items-center bg-amber-800/30 text-amber-300 px-4 py-2 rounded-full border border-amber-500/20 shadow-inner shadow-amber-900/20">
                            <Clock className="h-5 w-5 mr-2" />
                            <span className="text-sm font-medium">{completedCount} / {todayQuestions.length} {t('todayReviewQuestions.completed')}</span>
                        </div>
                    ) : null}
                </div>

                <div className="overflow-hidden h-full flex flex-col">
                    <Table>
                        <TableHeader className="bg-indigo-950/60">
                            <TableRow className="border-b-0 hover:bg-transparent">
                                <TableHead className="text-white font-semibold tracking-wide w-1/3">{t('questionTable.columns.question')}</TableHead>
                                <TableHead className="text-white font-semibold tracking-wide w-1/3">{t('questionTable.columns.link')}</TableHead>
                                <TableHead className="text-white font-semibold tracking-wide w-1/3 text-center">{t('todayReviewQuestions.reviewStatus')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow className="hover:bg-transparent">
                                    <TableCell colSpan={3} className="text-center py-12 text-indigo-200/70">
                                        Loading...
                                    </TableCell>
                                </TableRow>
                            ) : todayQuestions.length === 0 ? (
                                <TableRow className="hover:bg-transparent">
                                    <TableCell colSpan={3} className="text-center py-12 text-indigo-200/70">
                                        <div className="flex flex-col items-center justify-center h-full min-h-[120px]">
                                            <CheckCircle className="h-10 w-10 opacity-50 mb-3" />
                                            <span className="text-lg">{t('todayReviewQuestions.noQuestionsToday')}</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                todayQuestions.map((question) => (
                                    <TableRow
                                        key={question.id}
                                        className={`border-b border-white/[0.06] ${
                                            reviewStatus[question.id]
                                                ? 'bg-green-900/10 hover:from-green-900/20 hover:to-emerald-900/10'
                                                : 'hover:bg-white/10'
                                        }`}
                                    >
                                        <TableCell className="font-medium text-white w-1/3">{question.title}</TableCell>
                                        <TableCell className="w-1/3">
                                            <a
                                                href={question.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 text-blue-300 hover:text-blue-100 transition-colors duration-200 group"
                                            >
                                                <span className="border-b border-blue-300/30 group-hover:border-blue-100">{t('todayReviewQuestions.link')}</span>
                                                <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                            </a>
                                        </TableCell>
                                        <TableCell className="w-1/3 text-center">
                                            <div className="flex items-center justify-center">
                                                <button
                                                    onClick={() => {
                                                        if (reviewStatus[question.id]) return;
                                                        openRescheduleDialog(question);
                                                    }}
                                                    className={`h-6 w-6 rounded-full cursor-pointer relative
                                                        ${reviewStatus[question.id]
                                                        ? 'bg-green-500 shadow-md shadow-green-400/30'
                                                        : 'bg-red-500 shadow-md shadow-red-400/30'}`}
                                                    style={{ transform: 'none', transition: 'background-color 0.2s' }}
                                                    aria-label={reviewStatus[question.id] ? "Tekrar Edildi" : "Tekrar Et"}
                                                >
                                                    {reviewStatus[question.id] && (
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <CheckCircle className="h-4 w-4 text-white" />
                                                        </div>
                                                    )}
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    );
};

export default TodayReviewQuestions;
