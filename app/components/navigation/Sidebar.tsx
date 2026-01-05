"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

import {
    IconChevronLeft,
    IconChevronRight,
    IconHome,
    IconCalendar,
    IconInbox,
    IconUsers,
    IconScale,
    IconClipboardList,
    IconFileInvoice,
    IconUser,
    IconSettings,
    IconSun,
    IconMoon,
    IconDotsVertical,
    IconChartBarPopular,
    IconClipboardText,
} from "@tabler/icons-react";

import Image from "next/image";

import { useEffect } from "react";
export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const [overlay, setOverlay] = useState(false);
    const [openPatients, setOpenPatients] = useState(true);
    const [hovered, setHovered] = useState<string | null>(null);
    const [theme, setTheme] = useState<"light" | "dark">("light");

    const pathname = usePathname();

    const mainItems = [
        { id: "dashboard", label: "Dashboard", Icon: IconHome },
        { id: "schedules", label: "Schedules", Icon: IconCalendar },
        { id: "inbox", label: "Inbox", Icon: IconClipboardText },

        {
            id: "patients",
            label: "Patients",
            Icon: IconChartBarPopular,
            sub: [
                { id: "personal-injuries", label: "Personal Injuries", href: "/dashboard/patients" },
                { id: "admin-panel", label: "Admin Panel", href: "/admin" },
                { id: "workers-comp", label: "Workers Comp", },
            ],
        },

        { id: "lawyers", label: "Lawyers", href: "/lawyers", Icon: IconScale },
        { id: "orders", label: "Orders", Icon: IconClipboardList },
        { id: "billings", label: "Billings", Icon: IconFileInvoice },
    ];

    const settingsItems = [
        { id: "profile", label: "Profile", href: "/", Icon: IconUser },
        { id: "settings", label: "Settings", Icon: IconSettings },
    ];

    // Responsive: overlay on expand for md/sm
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 1024);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);
    useEffect(() => {
        if (isMobile) setCollapsed(true);
        else setCollapsed(false);
        // eslint-disable-next-line
    }, [isMobile]);
    const showOverlay = overlay && !collapsed && isMobile;
    // Collapsed: static sidebar on mobile/tablet, overlay only when expanded
    const sidebarClass = [
        "h-screen bg-white border-r border-gray-200 transition-all duration-200 flex flex-col overflow-x-hidden",
        collapsed ? "w-20" : "w-64",
        showOverlay ? "fixed top-0 left-0 z-[9999] shadow-2xl" : "",
        !showOverlay && isMobile ? "fixed top-0 left-0 z-[20]" : "",
        // When collapsed on mobile, sidebar is static (not overlay)
        collapsed && isMobile && !showOverlay ? "!relative !z-0" : ""
    ].join(" ");
    return (
        <>
            {showOverlay && (
                <div
                    className="fixed inset-0 z-9998 bg-black/30 lg:hidden"
                    onClick={() => { setCollapsed(true); setOverlay(false); }}
                />
            )}
            <aside className={sidebarClass}>
                {/* Logo Section */}
                <div className="flex items-center justify-between px-4 py-2">
                    <div className={`flex items-center gap-3 mt-4 ml-2${collapsed ? " justify-center w-full" : ""}`}>
                        <Image
                            src="/images/clarity.png"
                            alt="clarity"
                            width={35}
                            height={35}
                        />

                        {!collapsed && <span className="font-semibold text-gray-900">Clarity</span>}
                    </div>

                    <button>
                        <IconDotsVertical
                            className={`h-4 w-4 mt-4 text-gray-500 ${collapsed ? "hidden" : ""}`}
                        />
                    </button>

                </div>

                {/* Divider + Collapse Button */}
                <div className="relative px-4">
                    <hr className="border border-gray-200 my-4" />
                    <button
                        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                        onClick={() => {
                            if (collapsed && isMobile) {
                                setCollapsed(false);
                                setOverlay(true);
                            } else if (!collapsed && isMobile) {
                                setCollapsed(true);
                                setOverlay(false);
                            } else {
                                setCollapsed(!collapsed);
                            }
                        }}
                        className="absolute -top-1 -right-2 h-8 w-8 flex items-center justify-center rounded-full border border-gray-200 bg-white hover:bg-gray-50"
                    >
                        {collapsed ? (
                            <IconChevronRight className="h-4 w-4 text-gray-600" />
                        ) : (
                            <IconChevronLeft className="h-4 w-4 text-gray-600" />
                        )}
                    </button>
                </div>

                {/* MAIN SECTION TITLE */}
                {!collapsed && (
                    <div className="px-8 py-3 text-xs text-black uppercase tracking-wide">
                        Main
                    </div>
                )}

                {/* MAIN NAVIGATION */}
                {/* Keep overflow visible so collapsed popovers aren't clipped by the nav container */}
                <nav className="flex-1 px-4 pb-6 min-h-0 overflow-y-auto sidebar-scroll">
                    <ul className="space-y-1">
                        {mainItems.map((item) => (
                            <li key={item.id} className="relative"
                                onMouseEnter={() => collapsed && item.sub ? setHovered(item.id) : undefined}
                                onMouseLeave={() => collapsed && item.sub ? setHovered(null) : undefined}
                            >
                                {/* Main Item */}
                                <a
                                    href={item.href ?? "#"}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-50 ${collapsed ? "justify-center" : ""
                                        } ${pathname === item.href ? "bg-primary-100 text-primary-700" : ""}`}
                                >
                                    <item.Icon className="h-5 w-5" />

                                    {!collapsed && (
                                        <span className="text-sm font-medium">{item.label}</span>
                                    )}

                                    {/* Caret for submenus */}
                                    {!collapsed && item.sub && (
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setOpenPatients(!openPatients);
                                            }}
                                            className="ml-auto text-gray-400 hover:text-gray-600"
                                        >
                                            {openPatients ? (
                                                <IconChevronLeft className="h-4 w-4 rotate-90" />
                                            ) : (
                                                <IconChevronLeft className="h-4 w-4 -rotate-90" />
                                            )}
                                        </button>
                                    )}
                                </a>

                                {/* Submenus */}
                                {item.sub && !collapsed && openPatients && (
                                    <div className="relative pl-12 mt-2">
                                        {/* Vertical line */}
                                        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[#D9D9D9]"></div>

                                        <ul className="space-y-1">
                                            {item.sub.map((s) => (
                                                <li key={s.id}>
                                                    <a
                                                        href={s.href}
                                                        className={`block px-3 py-2 rounded-md text-sm ${s.href && pathname?.startsWith(s.href)
                                                            ? "bg-[#0F579099] text-white font-medium"
                                                            : "text-gray-700 hover:bg-gray-50"
                                                            }`}
                                                    >
                                                        {s.label}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* collapsed hover popup: render sub-menu on hover when collapsed */}
                                {item.sub && collapsed && hovered === item.id && (
                                    // make popover very high z so it sits above any other UI
                                    <div className="absolute left-full top-0 ml-3 w-56 z-9999 pointer-events-auto">
                                        <div className="bg-white border border-gray-100 rounded-md shadow-lg py-2">
                                            <ul className="space-y-1">
                                                {item.sub.map((s) => (
                                                    <li key={s.id}>
                                                        <a
                                                            href={s.href ?? '#'}
                                                            className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                                                        >
                                                            {s.label}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}

                            </li>
                        ))}
                    </ul>

                    {/* SETTINGS SECTION */}
                    {!collapsed && (
                        <div className="mt-6 px-4 text-xs uppercase tracking-wide">
                            Settings
                        </div>
                    )}

                    <ul className="mt-2 space-y-1">
                        {settingsItems.map((s) => (
                            <li key={s.id}>
                                <a
                                    href={s.href}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-50 ${collapsed ? "justify-center" : ""
                                        } ${pathname === s.href ? "bg-primary-100 text-primary-700" : ""}`}
                                >
                                    <s.Icon className="h-5 w-5" />
                                    {!collapsed && <span className="text-sm">{s.label}</span>}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* FOOTER: THEME SWITCH */}
                <div className="px-4 py-4 border-t border-gray-100">
                    <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
                        <div className="flex items-center gap-2  rounded-md p-1">
                            {!collapsed ? (
                                // expanded: keep the two labeled buttons
                                <>
                                    <div className="bg-[#4C6FE133] flex items-center gap-2  rounded-md p-1">
                                        <button
                                            className={`flex items-center gap-2 px-3 py-2 rounded-md ${theme === "light" ? "ring-1 ring-[#4C6FE1] bg-white" : ""
                                                }`}
                                            onClick={() => setTheme("light")}
                                        >
                                            <IconSun className="h-4 w-4" />
                                            <span className="text-sm">Light</span>
                                        </button>

                                        <button
                                            className={`flex items-center gap-2 px-3 py-2 rounded-md ${theme === "dark" ? "ring-1 ring-[#4C6FE1] bg-white" : ""
                                                }`}
                                            onClick={() => setTheme("dark")}
                                        >
                                            <IconMoon className="h-4 w-4" />
                                            <span className="text-sm">Dark</span>
                                        </button>
                                    </div>
                                </>
                            ) : (
                                // collapsed: render compact toggle styled like the provided image
                                <button
                                    role="switch"
                                    aria-checked={theme === "dark"}
                                    title={theme === "dark" ? "Dark" : "Light"}
                                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                    className="relative w-14 h-8 rounded-full bg-gray-200 p-1 flex items-center cursor-pointer"
                                >
                                    <span className={`absolute inset-0 rounded-full ${theme === "dark" ? "bg-[#4C6FE1]/20" : "bg-gray-100"}`}></span>
                                    <span
                                        className={`relative z-10 block h-7 w-7 rounded-full bg-white shadow-[0_6px_20px_rgba(0,0,0,0.12)] transform transition-transform ${theme === "dark" ? "translate-x-6" : "translate-x-0"}`}
                                    />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
