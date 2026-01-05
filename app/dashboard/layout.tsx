import Sidebar from "../components/navigation/Sidebar";

export const metadata = {
    title: "Dashboard",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-screen flex bg-gray-50 overflow-hidden">
            {/* Sidebar always rendered for responsive overlay */}
            <Sidebar />
            {/* Main content area */}
            <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 bg-[#4C6FE10D] overflow-y-auto">


            {children}</main>
        </div>
    );
}
