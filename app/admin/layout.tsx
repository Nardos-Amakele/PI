import Sidebar from "../components/navigation/Sidebar";
import AdminTabs from "../components/navigation/AdminTabs";
import Image from "next/image";
export const metadata = {
    title: "Scheduling",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-screen flex bg-gray-50 overflow-hidden">
            <Sidebar />
            <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 bg-[#4C6FE10D] overflow-y-auto">
                {/* Banner */}
                <div className="relative rounded-lg overflow-hidden mb-6">
                    {/* Image */}
                    <img
                        src="/images/Welcome.jpg"
                        alt="banner"
                        className="w-full h-36 object-cover"
                    />

                    {/* Color overlay */}
                    <div className="absolute inset-0 bg-[#113A5CB2]"></div>

                    {/* Text content */}
                    <div className="absolute inset-0 flex items-center px-6">
                        <div className="flex-1">
                            <h1 className="text-3xl text-white font-bold">Welcome To PI</h1>
                            <p className="text-sm text-white/80 mt-1">
                                Your centralized workspace for referrals, cases, and provider activity
                            </p>
                        </div>
                        <img
                            src="/images/LawyerBar.png"
                            alt="banner"
                            className="w-20 h-20 object-cover"
                        />
                    </div>
                </div>

                <AdminTabs />
                {children}
            </main>
        </div>
    );
}
