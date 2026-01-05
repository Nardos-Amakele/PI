"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PatientDetailsTabs() {
    const pathname = usePathname();
    const patientId = pathname.split("/")[3] || ""; // expects /dashboard/patients/{id}/...

    const tabs = [
        { href: patientId ? `/dashboard/patients/${patientId}/details` : "#", label: "Profile" },
        { href: patientId ? `/dashboard/patients/${patientId}/documents` : "#", label: "Documents" },
        { href: patientId ? `/dashboard/patients/${patientId}/appointment-type` : "#", label: "Appointments" },
        { href: patientId ? `/dashboard/patients/${patientId}/notes` : "#", label: "Notes" },
    ];

    return (
        <div className=" bg-white h-14 flex  border-b border-gray-200 px-4 rounded-md">
            <div className="flex items-stretch  border max-w-6xl rounded-md shadow-sm">
                {tabs.map((tab, idx) => {
                    const isActive = pathname.startsWith(tab.href);

                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 text-base font-semibold whitespace-nowrap transition h-full text-center 
                                ${idx > 0 ? "border-l border-gray-200" : ""}
                                ${isActive
                                    ? "bg-white text-black"
                                    : "bg-[#555E670D] text-gray-700 hover:bg-white"}
                            `}
                        >
                            {tab.label}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
