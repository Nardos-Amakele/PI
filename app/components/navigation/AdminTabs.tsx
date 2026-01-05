"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    IconClock,
    IconStethoscope,
    IconFile,
    IconForbid2,
    IconSettings,
} from "@tabler/icons-react";

const tabs = [
    { href: "/admin", label: "Availability", icon: IconClock },
    { href: "/admin/providers", label: "Providers", icon: IconStethoscope },
    { href: "/admin/appointment-type", label: "Appointment Type", icon: IconFile },
    { href: "/admin/reasons", label: "Reasons", icon: IconForbid2 },
    { href: "/admin/settings", label: "Settings", icon: IconSettings },
    { href: "/admin/locations", label: "Locations", icon: IconSettings },

];

export default function AdminTabs() {
    const pathname = usePathname();

    return (
        <div className="w-full bg-white h-16 flex items-center justify-center border-b border-gray-200 px-4 rounded-md">
            <div className="flex items-stretch w-full border max-w-6xl rounded-md shadow-sm">
                {tabs.map((tab, idx) => {
                    const Icon = tab.icon;

                    const isActive = pathname === tab.href;

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
                            <Icon size={18} />
                            {tab.label}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
