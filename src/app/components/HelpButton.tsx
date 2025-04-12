"use client"
import React, { useState } from 'react';
import { HelpCircle, BookOpen, Settings, RotateCcw } from 'lucide-react';
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

const HelpButton = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed top-6 right-6 z-50">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button
                        className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 hover:from-indigo-500 hover:to-purple-600 shadow-lg shadow-indigo-900/30 border border-indigo-400/20 hover:shadow-indigo-700/40"
                        style={{ transform: 'none', transition: 'background 0.2s, filter 0.2s, box-shadow 0.2s' }}
                        aria-label="Yardım"
                    >
                        <HelpCircle className="h-7 w-7 text-white" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[650px] bg-gradient-to-br from-indigo-950/95 to-purple-950/95 text-white border border-indigo-300/20 shadow-2xl rounded-xl backdrop-blur-md">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">
                            Algoritma Soru Takibi - Yardım
                        </DialogTitle>
                        <DialogDescription className="text-indigo-200/80">
                            Bu uygulama, algoritma sorularınızı takip etmenize ve düzenli tekrarlarla öğrenmenizi pekiştirmenize yardımcı olur.
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
                                <span>Genel Bilgi</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="sorular"
                                className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600/90 data-[state=active]:to-indigo-700/90 data-[state=active]:text-white data-[state=active]:shadow-md rounded-full px-4 py-2 transition-all duration-200 flex items-center gap-2"
                            >
                                <Settings className="h-4 w-4" />
                                <span>Soru Yönetimi</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="tekrarlar"
                                className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600/90 data-[state=active]:to-indigo-700/90 data-[state=active]:text-white data-[state=active]:shadow-md rounded-full px-4 py-2 transition-all duration-200 flex items-center gap-2"
                            >
                                <RotateCcw className="h-4 w-4" />
                                <span>Tekrar Sistemi</span>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="genel" className="space-y-6 mt-6 text-indigo-100/90 overflow-y-auto max-h-[60vh] pr-2">
                            <div className="bg-indigo-900/20 p-4 rounded-lg border border-indigo-300/10 shadow-inner">
                                <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                                    <BookOpen className="h-5 w-5 mr-2 text-blue-300" />
                                    Uygulama Hakkında
                                </h3>
                                <p>
                                    Bu uygulama, algoritma sorularını çözdükçe takip eden ve
                                    zorluk seviyesine göre akıllı bir tekrar sistemi uygulayan bir araçtır.
                                </p>
                                <p className="mt-3">
                                    Arayüz üç ana bölümden oluşur:
                                </p>
                                <ul className="list-disc pl-6 mt-3 space-y-2">
                                    <li>Bugünün tarihi</li>
                                    <li>Bugün tekrar edilecek sorular listesi</li>
                                    <li>Tüm soruların bulunduğu ana tablo</li>
                                </ul>
                            </div>
                            <div className="bg-indigo-900/20 p-4 rounded-lg border border-indigo-300/10 shadow-inner">
                                <h3 className="text-xl font-semibold text-white mb-3">Veriler Nerede Saklanır?</h3>
                                <p>
                                    Tüm verileriniz tarayıcınızın localStorage'ında saklanır.
                                    Bu, verilerin sadece kullandığınız cihazda kalacağı anlamına gelir.
                                    Farklı bir cihaz veya tarayıcıya geçerseniz, verileriniz orada
                                    görünmeyecektir.
                                </p>
                            </div>
                        </TabsContent>

                        <TabsContent value="sorular" className="space-y-6 mt-6 text-indigo-100/90 overflow-y-auto max-h-[60vh] pr-2">
                            <div className="bg-indigo-900/20 p-4 rounded-lg border border-indigo-300/10 shadow-inner">
                                <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                                    <span className="flex items-center justify-center bg-indigo-700/60 h-6 w-6 rounded-full mr-2 text-white text-sm">+</span>
                                    Soru Ekleme
                                </h3>
                                <p>
                                    Sağ üstteki + butonuna tıklayarak yeni bir soru ekleyebilirsiniz.
                                    Her soru için aşağıdaki bilgileri girmelisiniz:
                                </p>
                                <ul className="list-disc pl-6 mt-3 space-y-2">
                                    <li>Soru başlığı</li>
                                    <li>Platform (LeetCode, HackerRank vb.)</li>
                                    <li>Bağlantı linki</li>
                                    <li>Çözdüğünüz tarih</li>
                                    <li>Zorluk seviyesi</li>
                                </ul>
                            </div>
                            <div className="bg-indigo-900/20 p-4 rounded-lg border border-indigo-300/10 shadow-inner">
                                <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                                    <Settings className="h-5 w-5 mr-2 text-blue-300" />
                                    Soru Düzenleme ve Silme
                                </h3>
                                <p>
                                    Her sorunun sağ tarafındaki düzenleme ve silme butonlarını
                                    kullanarak soruları güncelleyebilir veya kaldırabilirsiniz.
                                </p>
                                <p className="mt-3 p-2 bg-red-900/20 rounded border border-red-500/20 text-red-200">
                                    <strong>Not:</strong> Silme işlemi geri alınamaz.
                                </p>
                            </div>
                        </TabsContent>

                        <TabsContent value="tekrarlar" className="space-y-6 mt-6 text-indigo-100/90 overflow-y-auto max-h-[60vh] pr-2">
                            <div className="bg-indigo-900/20 p-4 rounded-lg border border-indigo-300/10 shadow-inner">
                                <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                                    <RotateCcw className="h-5 w-5 mr-2 text-blue-300" />
                                    Tekrar Sistemi Nasıl Çalışır?
                                </h3>
                                <p>
                                    Uygulama, aralıklı tekrar (spaced repetition) mantığı ile çalışır.
                                    Zorluk seviyesine göre tekrar tarihleri otomatik olarak belirlenir:
                                </p>
                                <div className="mt-3 grid grid-cols-1 gap-2">
                                    <div className="flex items-center p-2 bg-green-900/20 rounded border border-green-500/20">
                                        <span className="font-medium text-green-300 mr-2">Çok Kolay:</span>
                                        <span>5 gün sonra</span>
                                    </div>
                                    <div className="flex items-center p-2 bg-emerald-900/20 rounded border border-emerald-500/20">
                                        <span className="font-medium text-emerald-300 mr-2">Kolay:</span>
                                        <span>4 gün sonra</span>
                                    </div>
                                    <div className="flex items-center p-2 bg-amber-900/20 rounded border border-amber-500/20">
                                        <span className="font-medium text-amber-300 mr-2">Orta:</span>
                                        <span>3 gün sonra</span>
                                    </div>
                                    <div className="flex items-center p-2 bg-orange-900/20 rounded border border-orange-500/20">
                                        <span className="font-medium text-orange-300 mr-2">Zor:</span>
                                        <span>2 gün sonra</span>
                                    </div>
                                    <div className="flex items-center p-2 bg-red-900/20 rounded border border-red-500/20">
                                        <span className="font-medium text-red-300 mr-2">Çok Zor:</span>
                                        <span>1 gün sonra</span>
                                    </div>
                                </div>
                                <p className="mt-3">
                                    Tekrar edilmesi gereken tarih geldiğinde, soru "Bugün Tekrar Edilecek Sorular"
                                    listesinde görünür.
                                </p>
                            </div>
                            <div className="bg-indigo-900/20 p-4 rounded-lg border border-indigo-300/10 shadow-inner">
                                <h3 className="text-xl font-semibold text-white mb-3">Tekrar İşaretleme</h3>
                                <p>
                                    Bir soruyu tekrar ettiğinizde, yanındaki onay kutusunu işaretleyin.
                                    İşaretli sorular, tekrar edildiğini belirtmek için yeşil arka plan ile gösterilir.
                                </p>
                                <p className="mt-3">
                                    Eğer yanlışlıkla işaretlerseniz, tekrar tıklayarak işareti kaldırabilirsiniz.
                                </p>
                                <p className="mt-3 p-2 bg-indigo-800/40 rounded border border-indigo-500/20">
                                    <strong>Not:</strong> Tekrar durumları sadece o gün için geçerlidir ve
                                    gün sonunda sıfırlanır.
                                </p>
                            </div>
                        </TabsContent>
                    </Tabs>

                    <div className="mt-6 border-t border-indigo-300/10 pt-4 px-2">
                        <p className="text-indigo-200/70 text-sm">
                            Bu uygulama, algoritma çalışmalarınızı daha sistematik hale getirmenize
                            yardımcı olmak amacıyla tasarlanmıştır. Düzenli tekrarlar, öğrenme
                            sürecinizin etkinliğini artıracaktır.
                        </p>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default HelpButton;