"use client";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";

const tabs = [
    { slug: "provider-detail", label: "Profile" },
    { slug: "appointment-detail", label: "Appointments" },
    { slug: "schedule-builder", label: "Schedule Builder" },
    { slug: "booking-parameters", label: "Booking Parameters" },
];

export default function AdminTabs() {
    const pathname = usePathname();
    const params = useParams();
    const id = params?.id as string | undefined;

    const base = id ? `/admin/providers/${id}` : "/admin/providers";

    return (
        <div className=" bg-white h-14 flex  border-b border-gray-200 px-4 rounded-md">
            <div className="flex items-stretch  border max-w-6xl rounded-md shadow-sm">
                {tabs.map((tab, idx) => {
                    const href = tab.slug ? `${base}/${tab.slug}` : base;
                    const isActive = pathname === href || pathname.startsWith(`${href}/`);

                    return (
                        <Link
                            key={href}
                            href={href}
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
