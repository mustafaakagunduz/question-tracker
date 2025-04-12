"use client"
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ExternalLink, CheckCircle, Clock } from 'lucide-react';
import { isToday } from 'date-fns';

// Zorluk seviyesi türleri
type DifficultyLevel = 'Çok Kolay' | 'Kolay' | 'Orta' | 'Zor' | 'Çok Zor';

// Soru verisi için tip tanımı
interface Question {
    id: number;
    title: string;
    site: string;
    link: string;
    solvedDate: Date | null;
    difficulty: DifficultyLevel;
    reviewDate: Date | null;
}

// Review durumu için interface
interface ReviewStatus {
    [key: number]: boolean; // soru id'si -> review durumu
}

// LocalStorage anahtarları
const QUESTIONS_STORAGE_KEY = 'algorithm-questions';
const REVIEW_STATUS_STORAGE_KEY = 'today-review-status';

export const TodayReviewQuestions: React.FC = () => {
    const [todayQuestions, setTodayQuestions] = useState<Question[]>([]);
    const [reviewStatus, setReviewStatus] = useState<ReviewStatus>({});

    // localStorage'dan bugünkü soruları yükle
    useEffect(() => {
        loadTodayQuestions();
        loadReviewStatus();
    }, []);

    // Review durumunu localStorage'dan yükle
    const loadReviewStatus = (): void => {
        if (typeof window === 'undefined') return;

        try {
            const savedStatus = localStorage.getItem(REVIEW_STATUS_STORAGE_KEY);
            if (savedStatus) {
                setReviewStatus(JSON.parse(savedStatus));
            }
        } catch (error) {
            console.error('Review durumu yüklenirken hata oluştu:', error);
        }
    };

    // Review durumunu localStorage'a kaydet
    const saveReviewStatus = (newStatus: ReviewStatus): void => {
        if (typeof window === 'undefined') return;

        try {
            localStorage.setItem(REVIEW_STATUS_STORAGE_KEY, JSON.stringify(newStatus));
        } catch (error) {
            console.error('Review durumu kaydedilirken hata oluştu:', error);
        }
    };

    // Bugün tekrar edilmesi gereken soruları yükle
    const loadTodayQuestions = (): void => {
        if (typeof window === 'undefined') return;

        try {
            const savedQuestionsString = localStorage.getItem(QUESTIONS_STORAGE_KEY);
            if (!savedQuestionsString) return;

            const parsedQuestions = JSON.parse(savedQuestionsString);

            // Date nesnelerini düzelt
            const questions = parsedQuestions.map((q: any) => ({
                ...q,
                solvedDate: q.solvedDate ? new Date(q.solvedDate) : null,
                reviewDate: q.reviewDate ? new Date(q.reviewDate) : null
            }));

            // Bugün tekrar edilmesi gereken soruları filtrele
            const today = new Date();
            const questionsForToday = questions.filter((q: Question) =>
                q.reviewDate && isToday(new Date(q.reviewDate))
            );

            setTodayQuestions(questionsForToday);
        } catch (error) {
            console.error('Bugünkü sorular yüklenirken hata oluştu:', error);
        }
    };

    // Review durumunu değiştir
    const handleReviewStatusChange = (questionId: number, status: boolean): void => {
        const newStatus = {
            ...reviewStatus,
            [questionId]: status
        };

        setReviewStatus(newStatus);
        saveReviewStatus(newStatus);
    };

    // Tüm soruların review edilip edilmediğini kontrol et
    const allReviewed = todayQuestions.length > 0 &&
        todayQuestions.every(q => reviewStatus[q.id] === true);

    // Tamamlanan soru sayısı
    const completedCount = todayQuestions.filter(q => reviewStatus[q.id]).length;

    return (
        <div className="w-full h-full rounded-xl overflow-hidden border border-indigo-300/20 shadow-2xl bg-gradient-to-br from-indigo-950/80 to-purple-900/70 backdrop-blur-md">
            <div className="flex items-center justify-between p-6 border-b border-indigo-300/20">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">Bugün Tekrar Edilecek Sorular</h2>
                {allReviewed && todayQuestions.length > 0 ? (
                    <div className="flex items-center bg-gradient-to-r from-emerald-800/30 to-green-800/30 text-green-300 px-4 py-2 rounded-full border border-green-500/20 shadow-inner shadow-green-900/20">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        <span className="text-sm font-medium">Tüm tekrarlar tamamlandı</span>
                    </div>
                ) : todayQuestions.length > 0 ? (
                    <div className="flex items-center bg-gradient-to-r from-amber-800/30 to-orange-800/30 text-amber-300 px-4 py-2 rounded-full border border-amber-500/20 shadow-inner shadow-amber-900/20">
                        <Clock className="h-5 w-5 mr-2" />
                        <span className="text-sm font-medium">{completedCount} / {todayQuestions.length} tamamlandı</span>
                    </div>
                ) : null}
            </div>

            <div className="overflow-hidden h-full flex flex-col">
                <Table>
                    <TableHeader className="bg-gradient-to-r from-indigo-900/80 to-purple-900/80">
                        <TableRow className="border-b-0">
                            <TableHead className="text-white font-semibold tracking-wide w-1/3">SORU</TableHead>
                            <TableHead className="text-white font-semibold tracking-wide w-1/3">BAĞLANTI LİNKİ</TableHead>
                            <TableHead className="text-white font-semibold tracking-wide w-1/3 text-center">TEKRAR DURUMU</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {todayQuestions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center py-12 text-indigo-200/70">
                                    <div className="flex flex-col items-center justify-center h-full min-h-[120px]">
                                        <CheckCircle className="h-10 w-10 opacity-50 mb-3" />
                                        <span className="text-lg">Bugün için tekrar edilecek soru bulunmuyor.</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            todayQuestions.map((question) => (
                                <TableRow
                                    key={question.id}
                                    className={`border-b border-indigo-300/10 ${
                                        reviewStatus[question.id]
                                            ? 'bg-gradient-to-r from-green-900/10 to-emerald-900/5 hover:from-green-900/20 hover:to-emerald-900/10'
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
                                            <span className="border-b border-blue-300/30 group-hover:border-blue-100">Bağlantı</span>
                                            <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </a>
                                    </TableCell>
                                    <TableCell className="w-1/3 text-center">
                                        <div className="flex items-center justify-center">
                                            <button
                                                onClick={() => handleReviewStatusChange(question.id, !reviewStatus[question.id])}
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