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
            return 'bg-gradient-to-r from-green-200 to-green-100 text-green-800 hover:shadow-md hover:from-green-300 hover:to-green-200 font-medium';
        case 'Kolay':
        case 'Easy':
            return 'bg-gradient-to-r from-emerald-200 to-emerald-100 text-emerald-800 hover:shadow-md hover:from-emerald-300 hover:to-emerald-200 font-medium';
        case 'Orta':
        case 'Medium':
            return 'bg-gradient-to-r from-amber-200 to-amber-100 text-amber-800 hover:shadow-md hover:from-amber-300 hover:to-amber-200 font-medium';
        case 'Zor':
        case 'Hard':
            return 'bg-gradient-to-r from-orange-200 to-orange-100 text-orange-800 hover:shadow-md hover:from-orange-300 hover:to-orange-200 font-medium';
        case 'Çok Zor':
        case 'Very Hard':
            return 'bg-gradient-to-r from-red-200 to-red-100 text-red-800 hover:shadow-md hover:from-red-300 hover:to-red-200 font-medium';
        default:
            return 'bg-gradient-to-r from-gray-200 to-gray-100 text-gray-800 hover:shadow-md hover:from-gray-300 hover:to-gray-200 font-medium';
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

// Soruları "Tekrar Edilecek Tarih"e göre sıralama
const sortQuestionsByReviewDate = (questions: Question[]): Question[] => {
    return [...questions].sort((a, b) => {
        // Null tarihler en sona yerleştirilir
        if (a.reviewDate === null && b.reviewDate === null) return 0;
        if (a.reviewDate === null) return 1;
        if (b.reviewDate === null) return -1;

        // Tarihler var ise, tarihe göre sıralama (en yakın tarih önce)
        return compareAsc(a.reviewDate, b.reviewDate);
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
        setQuestions(sortQuestionsByReviewDate(savedQuestions));
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
        const updatedQuestions = sortQuestionsByReviewDate([newQuestion, ...questions]);
        setQuestions(updatedQuestions);
    };

    // Soru düzenlendiğinde
    const handleQuestionEdit = (editedQuestion: Question) => {
        const updatedQuestions = questions.map(q =>
            q.id === editedQuestion.id ? editedQuestion : q
        );
        setQuestions(sortQuestionsByReviewDate(updatedQuestions));
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

            <div className="w-full rounded-xl overflow-hidden border border-indigo-300/20 shadow-2xl bg-gradient-to-br from-indigo-950/80 to-purple-900/70 backdrop-blur-md">
                <div className="flex items-center justify-between p-6 border-b border-indigo-300/20">
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">{t('questionTable.title')}</h2>
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
                        <TableHeader className="bg-gradient-to-r from-indigo-900/80 to-purple-900/80">
                            <TableRow className="border-b-0">
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
                                <TableRow>
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
                                        className="border-b border-indigo-300/10 hover:bg-white/10 transition-all duration-200"
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
                                            <Badge className={`${getDifficultyColor(question.difficulty)} px-3 py-1 transition-all duration-200 shadow-sm rounded-full`}>
                                                {question.difficulty}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-indigo-100">{formatDate(question.reviewDate)}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    onClick={() => handleEditQuestion(question)}
                                                    className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white h-9 w-9 p-0 rounded-lg shadow-md hover:shadow-lg hover:brightness-110 border border-indigo-400/20 transform-none"
                                                    style={{ transform: 'none', transition: 'background 0.2s, filter 0.2s, box-shadow 0.2s' }}
                                                    title="Düzenle"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    onClick={() => handleDeleteQuestion(question)}
                                                    className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white h-9 w-9 p-0 rounded-lg shadow-md hover:shadow-lg hover:brightness-110 border border-red-400/20 transform-none"
                                                    style={{ transform: 'none', transition: 'background 0.2s, filter 0.2s, box-shadow 0.2s' }}
                                                    title="Sil"
                                                >
                                                    <Trash2 className="h-4 w-4" />
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