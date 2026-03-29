"use client"
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ExternalLink, CheckCircle, Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Question, ReviewStatus } from '../types';
import { fetchQuestions, fetchReviewStatusForDate, setReviewStatusForDate } from '../lib/questionsApi';

const toDateOnly = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const TodayReviewQuestions: React.FC = () => {
    const { t } = useLanguage();
    const [todayQuestions, setTodayQuestions] = useState<Question[]>([]);
    const [reviewStatus, setReviewStatus] = useState<ReviewStatus>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;

        const loadTodayData = async () => {
            try {
                const questions = await fetchQuestions();
                if (!active) return;

                const todayStr = toDateOnly(new Date());
                const questionsForToday = questions.filter((q) => {
                    if (!q.reviewDate) return false;
                    return toDateOnly(q.reviewDate) === todayStr;
                });

                setTodayQuestions(questionsForToday);

                const status = await fetchReviewStatusForDate(
                    questionsForToday.map((q) => q.id),
                    todayStr
                );

                if (!active) return;
                setReviewStatus(status);
            } catch (error) {
                console.error('Bugünkü sorular yüklenirken hata oluştu:', error);
                if (!active) return;
                alert('Today review data could not be loaded from Supabase.');
            } finally {
                if (active) setLoading(false);
            }
        };

        void loadTodayData();

        return () => {
            active = false;
        };
    }, []);

    const handleReviewStatusChange = async (questionId: number, status: boolean): Promise<void> => {
        const todayStr = toDateOnly(new Date());

        setReviewStatus((current) => ({
            ...current,
            [questionId]: status,
        }));

        try {
            await setReviewStatusForDate(questionId, todayStr, status);
        } catch (error) {
            console.error('Review durumu kaydedilirken hata oluştu:', error);
            setReviewStatus((current) => ({
                ...current,
                [questionId]: !status,
            }));
            alert('Review status could not be saved.');
        }
    };

    const allReviewed = todayQuestions.length > 0 &&
        todayQuestions.every((q) => reviewStatus[q.id] === true);

    const completedCount = todayQuestions.filter((q) => reviewStatus[q.id]).length;

    return (
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
                                                    void handleReviewStatusChange(question.id, !reviewStatus[question.id]);
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
    );
};

export default TodayReviewQuestions;
