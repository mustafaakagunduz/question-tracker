"use client"
import React, { useState } from 'react';
import { HelpCircle, BookOpen, Settings, RotateCcw, X } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '../contexts/LanguageContext';

export const HelpButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useLanguage();

    // İçerik öğeleri dizisi
    const interfaceItems = [
        t('helpDialog.generalInfo.interfaceItems.item1'),
        t('helpDialog.generalInfo.interfaceItems.item2'),
        t('helpDialog.generalInfo.interfaceItems.item3')
    ];

    // Soru yönetimi öğeleri dizisi
    const questionManagementItems = [
        t('helpDialog.questionManagement.addingItems.item1'),
        t('helpDialog.questionManagement.addingItems.item2'),
        t('helpDialog.questionManagement.addingItems.item3'),
        t('helpDialog.questionManagement.addingItems.item4'),
        t('helpDialog.questionManagement.addingItems.item5')
    ];

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    className="rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 hover:from-indigo-500 hover:to-purple-600 shadow-lg shadow-indigo-900/30 border border-indigo-400/20 hover:shadow-indigo-700/40 flex items-center gap-2"
                    style={{ transform: 'none', transition: 'background 0.2s, filter 0.2s, box-shadow 0.2s' }}
                    aria-label={t('header.help')}
                >
                    <HelpCircle className="h-5 w-5 text-white" />
                    <span className="text-white">{t('header.help')}</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[650px] bg-gradient-to-br from-indigo-950/95 to-purple-950/95 text-white border border-indigo-300/20 shadow-2xl rounded-xl backdrop-blur-md">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">
                        {t('helpDialog.title')}
                    </DialogTitle>
                    <DialogDescription className="text-indigo-200/80">
                        {t('helpDialog.description')}
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="genel" className="mt-6">
                    <TabsList className="bg-indigo-900/50 border border-indigo-300/20 p-1 rounded-full mx-auto flex justify-center">
                        <TabsTrigger
                            value="genel"
                            className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600/90 data-[state=active]:to-indigo-700/90 data-[state=active]:text-white data-[state=active]:shadow-md rounded-full px-4 py-2 flex items-center gap-2"
                            style={{ transform: 'none', transition: 'background 0.2s, filter 0.2s, box-shadow 0.2s' }}
                        >
                            <BookOpen className="h-4 w-4" />
                            <span>{t('helpDialog.tabs.general')}</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="sorular"
                            className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600/90 data-[state=active]:to-indigo-700/90 data-[state=active]:text-white data-[state=active]:shadow-md rounded-full px-4 py-2 transition-all duration-200 flex items-center gap-2"
                        >
                            <Settings className="h-4 w-4" />
                            <span>{t('helpDialog.tabs.questions')}</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="tekrarlar"
                            className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600/90 data-[state=active]:to-indigo-700/90 data-[state=active]:text-white data-[state=active]:shadow-md rounded-full px-4 py-2 transition-all duration-200 flex items-center gap-2"
                        >
                            <RotateCcw className="h-4 w-4" />
                            <span>{t('helpDialog.tabs.reviews')}</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="genel" className="space-y-6 mt-6 text-indigo-100/90 overflow-y-auto max-h-[60vh] pr-2">
                        <div className="bg-indigo-900/20 p-4 rounded-lg border border-indigo-300/10 shadow-inner">
                            <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                                <BookOpen className="h-5 w-5 mr-2 text-blue-300" />
                                {t('helpDialog.generalInfo.aboutTitle')}
                            </h3>
                            <p>
                                {t('helpDialog.generalInfo.aboutText')}
                            </p>
                            <p className="mt-3">
                                {t('helpDialog.generalInfo.interfaceTitle')}
                            </p>
                            <ul className="list-disc pl-6 mt-3 space-y-2">
                                {interfaceItems.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-indigo-900/20 p-4 rounded-lg border border-indigo-300/10 shadow-inner">
                            <h3 className="text-xl font-semibold text-white mb-3">{t('helpDialog.generalInfo.dataStorageTitle')}</h3>
                            <p>
                                {t('helpDialog.generalInfo.dataStorageText')}
                            </p>
                        </div>
                    </TabsContent>

                    <TabsContent value="sorular" className="space-y-6 mt-6 text-indigo-100/90 overflow-y-auto max-h-[60vh] pr-2">
                        <div className="bg-indigo-900/20 p-4 rounded-lg border border-indigo-300/10 shadow-inner">
                            <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                                <span className="flex items-center justify-center bg-indigo-700/60 h-6 w-6 rounded-full mr-2 text-white text-sm">+</span>
                                {t('helpDialog.questionManagement.addingTitle')}
                            </h3>
                            <p>
                                {t('helpDialog.questionManagement.addingText')}
                            </p>
                            <ul className="list-disc pl-6 mt-3 space-y-2">
                                {questionManagementItems.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-indigo-900/20 p-4 rounded-lg border border-indigo-300/10 shadow-inner">
                            <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                                <Settings className="h-5 w-5 mr-2 text-blue-300" />
                                {t('helpDialog.questionManagement.editingTitle')}
                            </h3>
                            <p>
                                {t('helpDialog.questionManagement.editingText')}
                            </p>
                            <p className="mt-3 p-2 bg-red-900/20 rounded border border-red-500/20 text-red-200">
                                <strong>Not:</strong> {t('helpDialog.questionManagement.deleteWarning')}
                            </p>
                        </div>
                    </TabsContent>

                    <TabsContent value="tekrarlar" className="space-y-6 mt-6 text-indigo-100/90 overflow-y-auto max-h-[60vh] pr-2">
                        <div className="bg-indigo-900/20 p-4 rounded-lg border border-indigo-300/10 shadow-inner">
                            <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                                <RotateCcw className="h-5 w-5 mr-2 text-blue-300" />
                                {t('helpDialog.reviewSystem.howItWorksTitle')}
                            </h3>
                            <p>
                                {t('helpDialog.reviewSystem.howItWorksText')}
                            </p>
                            <div className="mt-3 grid grid-cols-1 gap-2">
                                <div className="flex items-center p-2 bg-green-900/20 rounded border border-green-500/20">
                                    <span className="font-medium text-green-300 mr-2">{t('helpDialog.reviewSystem.difficultyInfo.veryEasy')}:</span>
                                    <span>5 {t('helpDialog.reviewSystem.difficultyInfo.days')}</span>
                                </div>
                                <div className="flex items-center p-2 bg-emerald-900/20 rounded border border-emerald-500/20">
                                    <span className="font-medium text-emerald-300 mr-2">{t('helpDialog.reviewSystem.difficultyInfo.easy')}:</span>
                                    <span>4 {t('helpDialog.reviewSystem.difficultyInfo.days')}</span>
                                </div>
                                <div className="flex items-center p-2 bg-amber-900/20 rounded border border-amber-500/20">
                                    <span className="font-medium text-amber-300 mr-2">{t('helpDialog.reviewSystem.difficultyInfo.medium')}:</span>
                                    <span>3 {t('helpDialog.reviewSystem.difficultyInfo.days')}</span>
                                </div>
                                <div className="flex items-center p-2 bg-orange-900/20 rounded border border-orange-500/20">
                                    <span className="font-medium text-orange-300 mr-2">{t('helpDialog.reviewSystem.difficultyInfo.hard')}:</span>
                                    <span>2 {t('helpDialog.reviewSystem.difficultyInfo.days')}</span>
                                </div>
                                <div className="flex items-center p-2 bg-red-900/20 rounded border border-red-500/20">
                                    <span className="font-medium text-red-300 mr-2">{t('helpDialog.reviewSystem.difficultyInfo.veryHard')}:</span>
                                    <span>1 {t('helpDialog.reviewSystem.difficultyInfo.days')}</span>
                                </div>
                            </div>
                            <p className="mt-3">
                                {t('helpDialog.reviewSystem.reviewAppearText')}
                            </p>
                        </div>
                        <div className="bg-indigo-900/20 p-4 rounded-lg border border-indigo-300/10 shadow-inner">
                            <h3 className="text-xl font-semibold text-white mb-3">{t('helpDialog.reviewSystem.markingTitle')}</h3>
                            <p>
                                {t('helpDialog.reviewSystem.markingText')}
                            </p>
                            <p className="mt-3">
                                {t('helpDialog.reviewSystem.accidentalMarkText')}
                            </p>
                            <p className="mt-3 p-2 bg-indigo-800/40 rounded border border-indigo-500/20">
                                <strong>Not:</strong> {t('helpDialog.reviewSystem.dailyResetText')}
                            </p>
                        </div>
                    </TabsContent>
                </Tabs>

                <div className="mt-6 border-t border-indigo-300/10 pt-4 px-2">
                    <p className="text-indigo-200/70 text-sm">
                        {t('helpDialog.footerText')}
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default HelpButton;