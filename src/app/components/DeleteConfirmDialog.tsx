"use client"
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertTriangle, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface DeleteConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    questionTitle: string;
}

export function DeleteConfirmDialog({
                                        open,
                                        onOpenChange,
                                        onConfirm,
                                        questionTitle
                                    }: DeleteConfirmDialogProps) {
    const { t } = useLanguage();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-indigo-950/95 to-purple-950/95 text-white border border-indigo-300/20 shadow-2xl rounded-xl backdrop-blur-md">
                <DialogHeader className="flex flex-col items-center gap-3">
                    <div className="bg-gradient-to-br from-red-600/30 to-red-800/30 p-4 rounded-full border border-red-500/30 shadow-inner shadow-red-900/20">
                        <AlertTriangle className="h-8 w-8 text-red-400" />
                    </div>
                    <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-300 to-red-100">{t('deleteConfirmDialog.title')}</DialogTitle>
                </DialogHeader>

                <div className="text-center text-indigo-100/90 py-5 space-y-4">
                    <p className="text-lg">
                        <span className="font-bold bg-gradient-to-r from-red-200 to-red-100 bg-clip-text text-transparent">{questionTitle}</span> {t('deleteConfirmDialog.confirmMessage')}?
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-red-300 bg-red-900/20 py-2 px-4 rounded-lg border border-red-500/20 mx-auto max-w-fit">
                        <X className="h-4 w-4" />
                        <span>{t('deleteConfirmDialog.warning')}</span>
                    </div>
                </div>

                <DialogFooter className="flex space-x-3 justify-center pt-2">
                    <Button
                        type="button"
                        onClick={() => onOpenChange(false)}
                        className="bg-indigo-900/40 hover:bg-indigo-800/50 text-white border border-indigo-400/20 px-6 py-2 hover:brightness-110 rounded-lg transform-none"
                        style={{ transform: 'none', transition: 'background 0.2s, filter 0.2s' }}
                    >
                        {t('deleteConfirmDialog.cancel')}
                    </Button>


                    <Button
                        type="submit"
                        onClick={onConfirm}
                        className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white shadow-md px-6 py-2 hover:shadow-lg hover:brightness-110 border border-red-400/20 rounded-lg transform-none"
                        style={{ transform: 'none', transition: 'background 0.2s, filter 0.2s, box-shadow 0.2s' }}
                    >
                        {t('deleteConfirmDialog.confirm')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default DeleteConfirmDialog;