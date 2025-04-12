"use client"
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle, ExternalLink, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import AddQuestionDialog from './AddQuestionDialog';
import EditQuestionDialog from './EditQuestionDialog';
import DeleteConfirmDialog from './DeleteConfirmDialog';

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

// Zorluk seviyelerine göre renk belirleme
const getDifficultyColor = (difficulty: DifficultyLevel): string => {
    switch (difficulty) {
        case 'Çok Kolay':
            return 'bg-gradient-to-r from-green-200 to-green-100 text-green-800 hover:shadow-md hover:from-green-300 hover:to-green-200 font-medium';
        case 'Kolay':
            return 'bg-gradient-to-r from-emerald-200 to-emerald-100 text-emerald-800 hover:shadow-md hover:from-emerald-300 hover:to-emerald-200 font-medium';
        case 'Orta':
            return 'bg-gradient-to-r from-amber-200 to-amber-100 text-amber-800 hover:shadow-md hover:from-amber-300 hover:to-amber-200 font-medium';
        case 'Zor':
            return 'bg-gradient-to-r from-orange-200 to-orange-100 text-orange-800 hover:shadow-md hover:from-orange-300 hover:to-orange-200 font-medium';
        case 'Çok Zor':
            return 'bg-gradient-to-r from-red-200 to-red-100 text-red-800 hover:shadow-md hover:from-red-300 hover:to-red-200 font-medium';
        default:
            return 'bg-gradient-to-r from-gray-200 to-gray-100 text-gray-800 hover:shadow-md hover:from-gray-300 hover:to-gray-200 font-medium';
    }
};

// Örnek veri
const initialQuestions: Question[] = [
    {
        id: 1,
        title: 'İki Sayının Toplamı',
        site: 'LeetCode',
        link: 'https://leetcode.com/problems/two-sum/',
        solvedDate: new Date(2025, 3, 10), // 10 Nisan 2025
        difficulty: 'Kolay',
        reviewDate: new Date(2025, 3, 14), // 4 gün sonra
    },
    {
        id: 2,
        title: 'Geçerli Parantezler',
        site: 'HackerRank',
        link: 'https://www.hackerrank.com/challenges/balanced-brackets/',
        solvedDate: new Date(2025, 3, 8), // 8 Nisan 2025
        difficulty: 'Orta',
        reviewDate: new Date(2025, 3, 11), // 3 gün sonra
    },
    {
        id: 3,
        title: 'En Uzun Artarak Devam Eden Alt Dizi',
        site: 'CodeForces',
        link: 'https://codeforces.com/problemset/problem/300/A',
        solvedDate: new Date(2025, 3, 5), // 5 Nisan 2025
        difficulty: 'Çok Zor',
        reviewDate: new Date(2025, 3, 6), // 1 gün sonra
    },
];

// LocalStorage yardımcı fonksiyonları
const STORAGE_KEY = 'algorithm-questions';

// Soruları localStorage'dan yükleme
const loadQuestionsFromStorage = (): Question[] => {
    if (typeof window === 'undefined') {
        return initialQuestions; // Server-side rendering sırasında
    }

    try {
        const savedQuestionsString = localStorage.getItem(STORAGE_KEY);

        if (!savedQuestionsString) {
            return initialQuestions;
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
        return initialQuestions;
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

export const QuestionTable: React.FC = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

    // Sayfa yüklendiğinde localStorage'dan veri yükleme
    useEffect(() => {
        const savedQuestions = loadQuestionsFromStorage();
        setQuestions(savedQuestions);
    }, []);

    // Sorular değiştiğinde localStorage'a kaydetme
    useEffect(() => {
        if (questions.length > 0) {
            saveQuestionsToStorage(questions);
        }
    }, [questions]);

    // Tarih formatlama fonksiyonu
    const formatDate = (date: Date | null): string => {
        if (!date) return '-';
        return format(date, 'd MMMM yyyy', { locale: tr });
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
        const updatedQuestions = [newQuestion, ...questions];
        setQuestions(updatedQuestions);
    };

    // Soru düzenlendiğinde
    const handleQuestionEdit = (editedQuestion: Question) => {
        const updatedQuestions = questions.map(q =>
            q.id === editedQuestion.id ? editedQuestion : q
        );
        setQuestions(updatedQuestions);
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
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">Çözülmüş Olan Algoritma Soruları</h2>
                    <Button
                        onClick={handleAddQuestion}
                        className="bg-gradient-to-br from-indigo-600 to-purple-700 hover:from-indigo-500 hover:to-purple-600 text-white rounded-full h-12 w-12 p-0 shadow-lg shadow-indigo-900/30 hover:shadow-indigo-700/40 border border-indigo-400/20 transform-none"
                        style={{ transform: 'none', transition: 'background 0.2s, box-shadow 0.2s, filter 0.2s' }}
                    >
                        <PlusCircle className="h-6 w-6" />
                    </Button>
                </div>

                <div className="overflow-hidden">
                    <Table>
                        <TableHeader className="bg-gradient-to-r from-indigo-900/80 to-purple-900/80">
                            <TableRow className="border-b-0">
                                <TableHead className="text-white font-semibold tracking-wide">SORU</TableHead>
                                <TableHead className="text-white font-semibold tracking-wide">SİTE</TableHead>
                                <TableHead className="text-white font-semibold tracking-wide">BAĞLANTI LİNKİ</TableHead>
                                <TableHead className="text-white font-semibold tracking-wide">ÇÖZDÜĞÜM TARİH</TableHead>
                                <TableHead className="text-white font-semibold tracking-wide">ZORLUK SEVİYESİ</TableHead>
                                <TableHead className="text-white font-semibold tracking-wide">TEKRAR EDİLECEK TARİH</TableHead>
                                <TableHead className="text-white font-semibold tracking-wide text-right">İŞLEMLER</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {questions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-12 text-indigo-200/70">
                                        <div className="flex flex-col items-center gap-3">
                                            <PlusCircle className="h-10 w-10 opacity-50" />
                                            <span className="text-lg">Henüz soru eklenmemiş. Yeni bir soru eklemek için sağ üstteki + butonuna tıklayın.</span>
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
                                                <span className="border-b border-blue-300/30 group-hover:border-blue-100">Bağlantı</span>
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