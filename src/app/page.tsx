"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DateDisplay from "@/app/components/DateDisplay";
import QuestionTable from "@/app/components/QuestionTable";
import TodayReviewQuestions from "@/app/components/TodayReviewQuestion";
import Header from "@/app/components/Header";
import { useLanguage } from "./contexts/LanguageContext";
import { useAuth } from "./contexts/AuthContext";

export default function Home() {
    const { t } = useLanguage();
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) router.replace('/login');
    }, [user, loading, router]);

    if (loading || !user) return (
        <div className="min-h-screen bg-[#08081a] flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <>
            <Header />
            <main className="flex min-h-screen flex-col items-center p-8 bg-[#08081a] pt-24">
                <div className="w-full max-w-6xl space-y-8">
                    <div className="flex flex-col space-y-8 pb-6">
                        {/* Burada bir flex row container kullanarak yan yana yerleştiriyoruz */}
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="md:w-1/3 flex">
                                <DateDisplay />
                            </div>
                            <div className="md:w-2/3 flex">
                                <TodayReviewQuestions />
                            </div>
                        </div>
                        <QuestionTable />
                    </div>
                </div>

                {/* Footer alanı */}
                <footer className="mt-16 mb-2 text-center text-indigo-300/50 text-sm">
                    © {new Date().getFullYear()} {t('footer.copyright')}
                </footer>
            </main>
        </>
    );
}