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
    language: 'en',
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

    // Çevirileri yükle
    useEffect(() => {
        const loadTranslations = async () => {
            try {
                const response = await fetch(`/locales/${language}.json`);
                const data = await response.json();
                setTranslations(data);
            } catch (error) {
                console.error('Çeviriler yüklenirken hata oluştu:', error);
            }
        };

        loadTranslations();
    }, [language]);

    // Kullanıcı dil tercihini kaydet
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('language', language);
        }
    }, [language]);

    // Sayfa yüklendiğinde kaydedilmiş dil tercihini al
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedLanguage = localStorage.getItem('language') as Language;
            if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'tr')) {
                setLanguage(savedLanguage);
            } else {
                // Tarayıcı diline göre varsayılan dil seç
                const browserLang = navigator.language.startsWith('tr') ? 'tr' : 'en';
                setLanguage(browserLang);
            }
        }
    }, []);

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