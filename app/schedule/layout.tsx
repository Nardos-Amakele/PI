import Sidebar from "../components/navigation/Sidebar";

export const metadata = {
    title: "Scheduling",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex bg-gray-50">
            <Sidebar />
            <main className="flex-1 p-4  bg-[#4C6FE10D]">{children}</main>
        </div>
    );
}
