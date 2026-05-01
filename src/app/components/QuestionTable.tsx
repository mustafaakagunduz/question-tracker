"use client"
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PlusCircle, ExternalLink, Edit, Trash2 } from 'lucide-react';
import { format, compareAsc } from 'date-fns';
import { tr, enUS } from 'date-fns/locale';
import AddQuestionDialog from './AddQuestionDialog';
import EditQuestionDialog from './EditQuestionDialog';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import { useLanguage } from '../contexts/LanguageContext';
import { Question } from '../types';
import { createQuestion, fetchQuestions, removeQuestion, updateQuestion } from '../lib/questionsApi';

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
    const [loading, setLoading] = useState(true);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
    const [reviewDateSortAsc, setReviewDateSortAsc] = useState(true);
    const locale = language === 'tr' ? tr : enUS;

    useEffect(() => {
        let active = true;

        const loadQuestions = async () => {
            try {
                const data = await fetchQuestions();
                if (!active) return;
                setQuestions(sortQuestionsBySolvedDate(data));
            } catch (error) {
                console.error('Sorular yüklenirken hata oluştu:', error);
                if (!active) return;
                alert('Questions could not be loaded from Supabase. Check environment values and table setup.');
            } finally {
                if (active) setLoading(false);
            }
        };

        void loadQuestions();

        return () => {
            active = false;
        };
    }, []);

    const formatDate = (date: Date | null): string => {
        if (!date) return '-';
        return format(date, 'd MMMM yyyy', { locale });
    };

    const handleAddQuestion = () => {
        setAddDialogOpen(true);
    };

    const handleEditQuestion = (question: Question) => {
        setSelectedQuestion(question);
        setEditDialogOpen(true);
    };

    const handleDeleteQuestion = (question: Question) => {
        setSelectedQuestion(question);
        setDeleteDialogOpen(true);
    };

    const handleQuestionAdd = async (newQuestion: Omit<Question, 'id'>) => {
        const inserted = await createQuestion(newQuestion);
        setQuestions((current) => sortQuestionsBySolvedDate([inserted, ...current]));
        setAddDialogOpen(false);
    };

    const handleQuestionEdit = async (editedQuestion: Question) => {
        const updated = await updateQuestion(editedQuestion);
        setQuestions((current) => {
            const next = current.map((q) => (q.id === updated.id ? updated : q));
            return sortQuestionsBySolvedDate(next);
        });
        setEditDialogOpen(false);
    };

    const handleQuestionDelete = async () => {
        if (!selectedQuestion) return;

        try {
            await removeQuestion(selectedQuestion.id);
            setQuestions((current) => current.filter((q) => q.id !== selectedQuestion.id));
            setDeleteDialogOpen(false);
            setSelectedQuestion(null);
        } catch (error) {
            console.error('Soru silinirken hata oluştu:', error);
            alert('Question could not be deleted.');
        }
    };

    const displayedQuestions = reviewDateSortAsc
        ? [...questions].sort((a, b) => {
              if (a.reviewDate === null && b.reviewDate === null) return 0;
              if (a.reviewDate === null) return 1;
              if (b.reviewDate === null) return -1;
              return compareAsc(a.reviewDate, b.reviewDate);
          })
        : questions;

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
                        onConfirm={() => {
                            void handleQuestionDelete();
                        }}
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
                                <TableHead
                                    className="text-white font-semibold tracking-wide cursor-pointer select-none"
                                    onClick={() => setReviewDateSortAsc((prev) => !prev)}
                                >
                                    {t('questionTable.columns.reviewDate')}
                                </TableHead>
                                <TableHead className="text-white font-semibold tracking-wide text-right">{t('questionTable.columns.actions')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow className="hover:bg-transparent">
                                    <TableCell colSpan={6} className="text-center py-12 text-indigo-200/70">
                                        Loading...
                                    </TableCell>
                                </TableRow>
                            ) : questions.length === 0 ? (
                                <TableRow className="hover:bg-transparent">
                                    <TableCell colSpan={6} className="text-center py-12 text-indigo-200/70">
                                        <div className="flex flex-col items-center gap-3">
                                            <PlusCircle className="h-10 w-10 opacity-50" />
                                            <span className="text-lg">{t('questionTable.emptyTableMessage')}</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                displayedQuestions.map((question, index) => {
                                    const nextQuestion = displayedQuestions[index + 1];
                                    const isGroupEnd = !nextQuestion || (
                                        question.reviewDate?.toDateString() !== nextQuestion.reviewDate?.toDateString()
                                    );
                                    return (
                                    <TableRow
                                        key={question.id}
                                        className={`border-b ${isGroupEnd ? 'border-yellow-400/60' : 'border-white/[0.06]'}`}
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
                                        <TableCell className="text-indigo-100">{formatDate(question.reviewDate)}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    onClick={() => handleEditQuestion(question)}
                                                    className="bg-transparent text-indigo-400 hover:bg-transparent h-10 w-10 p-0 rounded-lg border-0 shadow-none cursor-pointer opacity-80 hover:opacity-100 hover:text-indigo-200 hover:scale-125 transition-all duration-150"
                                                    title="Düzenle"
                                                >
                                                    <Edit className="h-7 w-7" />
                                                </Button>
                                                <Button
                                                    onClick={() => handleDeleteQuestion(question)}
                                                    className="bg-transparent text-red-400 hover:bg-transparent h-10 w-10 p-0 rounded-lg border-0 shadow-none cursor-pointer opacity-80 hover:opacity-100 hover:text-red-300 hover:scale-125 transition-all duration-150"
                                                    title="Sil"
                                                >
                                                    <Trash2 className="h-7 w-7" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    );
};

export default QuestionTable;
