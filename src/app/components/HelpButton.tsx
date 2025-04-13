"use client"
import React, { useState } from 'react';
import { HelpCircle, RotateCcw } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLanguage } from '../contexts/LanguageContext';

export const HelpButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useLanguage();

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
            <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-indigo-950/95 to-purple-950/95 text-white border border-indigo-300/20 shadow-2xl rounded-xl backdrop-blur-md">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">
                        {t('helpDialog.title')}
                    </DialogTitle>
                    <DialogDescription className="text-indigo-200/80">
                        {t('helpDialog.description')}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 mt-6 text-indigo-100/90">
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
                </div>

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