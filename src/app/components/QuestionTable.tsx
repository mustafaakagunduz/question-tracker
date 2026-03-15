"use client"
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle, ExternalLink, Edit, Trash2 } from 'lucide-react';
import { format, compareAsc } from 'date-fns';
import { tr, enUS } from 'date-fns/locale';
import AddQuestionDialog from './AddQuestionDialog';
import EditQuestionDialog from './EditQuestionDialog';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import { useLanguage } from '../contexts/LanguageContext';
import { Question } from '../types';

// Zorluk seviyelerine göre renk belirleme
const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
        case 'Çok Kolay':
        case 'Very Easy':
            return 'bg-green-500/15 text-green-300 hover:shadow-md hover:from-green-300 hover:to-green-200 font-medium border border-green-500/20';
        case 'Kolay':
        case 'Easy':
            return 'bg-emerald-500/15 text-emerald-300 hover:shadow-md hover:from-emerald-300 hover:to-emerald-200 font-medium border border-emerald-500/20';
        case 'Orta':
        case 'Medium':
            return 'bg-amber-500/15 text-amber-300 hover:shadow-md hover:from-amber-300 hover:to-amber-200 font-medium border border-amber-500/20';
        case 'Zor':
        case 'Hard':
            return 'bg-orange-500/15 text-orange-300 hover:shadow-md hover:from-orange-300 hover:to-orange-200 font-medium border border-orange-500/20';
        case 'Çok Zor':
        case 'Very Hard':
            return 'bg-red-500/15 text-red-300 hover:shadow-md hover:from-red-300 hover:to-red-200 font-medium border border-red-500/20';
        default:
            return 'bg-slate-500/15 text-slate-300 hover:shadow-md hover:from-gray-300 hover:to-gray-200 font-medium border border-slate-500/20';
    }
};

// Boş başlangıç verisi
const initialQuestions: Question[] = [];

// LocalStorage yardımcı fonksiyonları
const STORAGE_KEY = 'algorithm-questions';

// Soruları localStorage'dan yükleme
const loadQuestionsFromStorage = (): Question[] => {
    if (typeof window === 'undefined') {
        return []; // Server-side rendering sırasında boş dizi dön
    }

    try {
        const savedQuestionsString = localStorage.getItem(STORAGE_KEY);

        if (!savedQuestionsString) {
            return []; // Veri yoksa boş dizi dön
        }

        const savedQuestions = JSON.parse(savedQuestionsString);

        // Date nesnelerini düzeltelim
        return savedQuestions.map((q: any) => ({
            ...q,
            solvedDate: q.solvedDate ? new Date(q.solvedDate) : null,
            reviewDate: q.reviewDate ? new Date(q.reviewDate) : null
        }));
    } catch (error) {
        console.error('Sorular yüklenirken hata oluştu:', error);
        return []; // Hata durumunda boş dizi dön
    }
};

// Soruları localStorage'a kaydetme
const saveQuestionsToStorage = (questions: Question[]) => {
    if (typeof window === 'undefined') return;

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
    } catch (error) {
        console.error('Sorular kaydedilirken hata oluştu:', error);
    }
};

// Soruları "Çözüldüğü Tarih"e göre sıralama (en son eklenen en üstte)
const sortQuestionsBySolvedDate = (questions: Question[]): Question[] => {
    return [...questions].sort((a, b) => {
        if (a.solvedDate === null && b.solvedDate === null) return 0;
        if (a.solvedDate === null) return 1;
        if (b.solvedDate === null) return -1;
        return compareAsc(b.solvedDate, a.solvedDate);
    });
};

export const QuestionTable: React.FC = () => {
    const { language, t } = useLanguage();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
    const locale = language === 'tr' ? tr : enUS;

    // Sayfa yüklendiğinde localStorage'dan veri yükleme
    useEffect(() => {
        const savedQuestions = loadQuestionsFromStorage();
        setQuestions(sortQuestionsBySolvedDate(savedQuestions));
    }, []);

    // Sorular değiştiğinde localStorage'a kaydetme
    useEffect(() => {
        saveQuestionsToStorage(questions);
    }, [questions]);

    // Tarih formatlama fonksiyonu
    const formatDate = (date: Date | null): string => {
        if (!date) return '-';
        return format(date, 'd MMMM yyyy', { locale });
    };

    // Yeni soru ekleme dialog'unu aç
    const handleAddQuestion = () => {
        setAddDialogOpen(true);
    };

    // Soru düzenleme dialog'unu aç
    const handleEditQuestion = (question: Question) => {
        setSelectedQuestion(question);
        setEditDialogOpen(true);
    };

    // Soru silme dialog'unu aç
    const handleDeleteQuestion = (question: Question) => {
        setSelectedQuestion(question);
        setDeleteDialogOpen(true);
    };

    // Yeni soru eklendiğinde
    const handleQuestionAdd = (newQuestion: Question) => {
        const updatedQuestions = sortQuestionsBySolvedDate([newQuestion, ...questions]);
        setQuestions(updatedQuestions);
    };

    // Soru düzenlendiğinde
    const handleQuestionEdit = (editedQuestion: Question) => {
        const updatedQuestions = questions.map(q =>
            q.id === editedQuestion.id ? editedQuestion : q
        );
        setQuestions(sortQuestionsBySolvedDate(updatedQuestions));
    };

    // Soru silindiğinde
    const handleQuestionDelete = () => {
        if (selectedQuestion) {
            const updatedQuestions = questions.filter(q => q.id !== selectedQuestion.id);
            setQuestions(updatedQuestions);
        }
        setDeleteDialogOpen(false);
    };

    return (
        <>
            <AddQuestionDialog
                open={addDialogOpen}
                onOpenChange={setAddDialogOpen}
                onQuestionAdd={handleQuestionAdd}
            />

            {selectedQuestion && (
                <>
                    <EditQuestionDialog
                        open={editDialogOpen}
                        onOpenChange={setEditDialogOpen}
                        onQuestionEdit={handleQuestionEdit}
                        question={selectedQuestion}
                    />

                    <DeleteConfirmDialog
                        open={deleteDialogOpen}
                        onOpenChange={setDeleteDialogOpen}
                        onConfirm={handleQuestionDelete}
                        questionTitle={selectedQuestion.title}
                    />
                </>
            )}

            <div className="w-full rounded-xl overflow-hidden border border-white/[0.08] shadow-2xl bg-slate-900/50 backdrop-blur-md">
                <div className="flex items-center justify-between p-6 border-b border-white/[0.08]">
                    <h2 className="text-2xl font-bold text-white">{t('questionTable.title')}</h2>
                    <Button
                        onClick={handleAddQuestion}
                        className="flex items-center gap-2 bg-indigo-800/70 hover:bg-indigo-700 text-indigo-200 hover:text-white rounded-lg px-4 py-2 shadow-md hover:shadow-lg border border-indigo-400/20 transition-all duration-200"
                    >
                        <PlusCircle className="h-5 w-5 opacity-80" />
                        <span>{t('questionTable.addQuestion')}</span>
                    </Button>
                </div>

                <div className="overflow-hidden">
                    <Table>
                        <TableHeader className="bg-indigo-950/60">
                            <TableRow className="border-b-0 hover:bg-transparent">
                                <TableHead className="text-white font-semibold tracking-wide">{t('questionTable.columns.question')}</TableHead>
                                <TableHead className="text-white font-semibold tracking-wide">{t('questionTable.columns.site')}</TableHead>
                                <TableHead className="text-white font-semibold tracking-wide">{t('questionTable.columns.link')}</TableHead>
                                <TableHead className="text-white font-semibold tracking-wide">{t('questionTable.columns.solvedDate')}</TableHead>
                                <TableHead className="text-white font-semibold tracking-wide">{t('questionTable.columns.difficulty')}</TableHead>
                                <TableHead className="text-white font-semibold tracking-wide">{t('questionTable.columns.reviewDate')}</TableHead>
                                <TableHead className="text-white font-semibold tracking-wide text-right">{t('questionTable.columns.actions')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {questions.length === 0 ? (
                                <TableRow className="hover:bg-transparent">
                                    <TableCell colSpan={7} className="text-center py-12 text-indigo-200/70">
                                        <div className="flex flex-col items-center gap-3">
                                            <PlusCircle className="h-10 w-10 opacity-50" />
                                            <span className="text-lg">{t('questionTable.emptyTableMessage')}</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                questions.map((question) => (
                                    <TableRow
                                        key={question.id}
                                        className="border-b border-white/[0.06] hover:bg-white/10 transition-all duration-200"
                                    >
                                        <TableCell className="font-medium text-white">{question.title}</TableCell>
                                        <TableCell className="text-indigo-100">{question.site}</TableCell>
                                        <TableCell>
                                            <a
                                                href={question.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 text-blue-300 hover:text-blue-100 transition-colors duration-200 group"
                                            >
                                                <span className="border-b border-blue-300/30 group-hover:border-blue-100">{t('questionTable.link')}</span>
                                                <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                            </a>
                                        </TableCell>
                                        <TableCell className="text-indigo-100">{formatDate(question.solvedDate)}</TableCell>
                                        <TableCell>
                                            <Badge
                                                className={`${getDifficultyColor(question.difficulty)} px-3 py-1 shadow-sm rounded-full`}
                                                style={{ transform: 'none', transition: 'background-color 0.2s, box-shadow 0.2s' }}
                                            >
                                                {question.difficulty}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-indigo-100">{formatDate(question.reviewDate)}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    onClick={() => handleEditQuestion(question)}
                                                    className="bg-transparent text-indigo-300 hover:from-indigo-500 hover:to-indigo-400 hover:bg-transparent h-9 w-9 p-0 rounded-lg border-0 shadow-none cursor-pointer opacity-60 hover:opacity-100 hover:scale-125 transition-all duration-150"
                                                    style={{  }}
                                                    title="Düzenle"
                                                >
                                                    <Edit className="h-6 w-6" />
                                                </Button>
                                                <Button
                                                    onClick={() => handleDeleteQuestion(question)}
                                                    className="bg-transparent text-red-400 hover:from-red-500 hover:to-red-400 hover:bg-transparent h-9 w-9 p-0 rounded-lg border-0 shadow-none cursor-pointer opacity-60 hover:opacity-100 hover:scale-125 transition-all duration-150"
                                                    style={{  }}
                                                    title="Sil"
                                                >
                                                    <Trash2 className="h-6 w-6" />
                                                </Button>
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

export default QuestionTable;