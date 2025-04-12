import DateDisplay from "@/app/components/DateDisplay";
import QuestionTable from "@/app/components/QuestionTable";
import TodayReviewQuestions from "@/app/components/TodayReviewQuestion";
import HelpButton from "@/app/components/HelpButton";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center p-8 bg-gradient-to-br from-indigo-950 to-purple-950 bg-fixed">
            <div className="w-full max-w-6xl space-y-8">
                <h1 className="text-4xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">
                    ALGORİTMA SORU TAKİBİ
                </h1>
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

            {/* Yardım butonu eklendi.. */}
            <HelpButton />

            {/* Footer alanı */}
            <footer className="mt-16 mb-2 text-center text-indigo-300/50 text-sm">
                © {new Date().getFullYear()} Algoritma Soru Takibi - Tüm veriler tarayıcınızda saklanır
            </footer>
        </main>
    );
}