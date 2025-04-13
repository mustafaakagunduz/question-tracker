// Zorluk seviyesi türleri
export type DifficultyLevel = string;

// Soru verisi için tip tanımı
export interface Question {
    id: number;
    title: string;
    site: string;
    link: string;
    solvedDate: Date | null;
    difficulty: DifficultyLevel;
    reviewDate: Date | null;
}

// Review durumu için interface
export interface ReviewStatus {
    [key: number]: boolean; // soru id'si -> review durumu
}