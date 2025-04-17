"use client"
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Dil seçenekleri
export type Language = 'tr' | 'en';

// Bağlam için tip tanımı
interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

// Varsayılan bağlam değeri
const defaultContext: LanguageContextType = {
    language: 'tr',
    setLanguage: () => {},
    t: () => '',
};

// Bağlam oluşturma
const LanguageContext = createContext<LanguageContextType>(defaultContext);

// Çevirileri içeren tip
interface Translations {
    [key: string]: any;
}

// Props için tip tanımı
interface LanguageProviderProps {
    children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
    // Dil durumu ve çeviriler
    const [language, setLanguage] = useState<Language>('tr');
    const [translations, setTranslations] = useState<Translations>({});
    const [initialized, setInitialized] = useState(false);

    // İlk yükleme: localStorage'dan dil tercihini al
    useEffect(() => {
        if (typeof window !== 'undefined' && !initialized) {
            try {
                console.log("Initializing language from localStorage");
                const savedLanguage = localStorage.getItem('language');
                console.log("Saved language from localStorage:", savedLanguage);

                if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'tr')) {
                    console.log("Setting language to:", savedLanguage);
                    setLanguage(savedLanguage as Language);
                } else {
                    // Tarayıcı diline göre varsayılan dil seç
                    const browserLang = navigator.language.startsWith('tr') ? 'tr' : 'en';
                    console.log("Browser language detected:", browserLang);
                    console.log("Setting default language to:", browserLang);
                    setLanguage(browserLang);
                    localStorage.setItem('language', browserLang);
                }
                setInitialized(true);
            } catch (error) {
                console.error("Error initializing language:", error);
            }
        }
    }, [initialized]);

    // Çevirileri yükle
    useEffect(() => {
        const loadTranslations = async () => {
            if (!initialized && language === 'tr') return; // İlk yükleme tamamlanmadan çevirileri yükleme

            try {
                console.log("Loading translations for language:", language);
                const response = await fetch(`/locales/${language}.json`);
                const data = await response.json();
                console.log("Translations loaded successfully");
                setTranslations(data);
            } catch (error) {
                console.error('Çeviriler yüklenirken hata oluştu:', error);
            }
        };

        loadTranslations();
    }, [language, initialized]);

    // Kullanıcı dil tercihini kaydet (dil değiştiğinde)
    useEffect(() => {
        if (typeof window !== 'undefined' && initialized) {
            console.log("Saving language to localStorage:", language);
            localStorage.setItem('language', language);
        }
    }, [language, initialized]);

    // Çeviri fonksiyonu
    const t = (key: string): string => {
        // Nokta ile ayrılmış anahtarları ayrıştır (örn: "common.button.submit")
        const keys = key.split('.');
        let value: any = translations;

        // Her anahtar seviyesini dolaş
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                // Çeviri bulunamadıysa anahtarı döndür
                return key;
            }
        }

        // String olmayan değerleri kontrol et
        if (typeof value !== 'string') {
            return key;
        }

        return value;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

// Kullanım kolaylığı için hook
export const useLanguage = () => useContext(LanguageContext);

export default LanguageContext;