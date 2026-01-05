'use client'
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from '@/components/ui/table';
import { IconAdjustmentsHorizontal, IconArrowDown, IconCalendarEventFilled, IconChevronDown, IconCircleFilled, IconClock, IconDotsVertical, IconEdit, IconSearch, IconTrash, IconUserMinus } from '@tabler/icons-react';
import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from "next/navigation";
import { useGetProvidersQuery } from "../../services/providers/providersApi";
import Toggle from '@/app/components/ui/Toggle';
import ProviderBookingPreferences from '@/app/components/ui/ProviderBookingPreferences';
import BlockTimeModal from '@/app/components/ui/BlockTimeModal';
const page = () => {
    const router = useRouter();
    const [onlyNew, setOnlyNew] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [appliedFilters, setAppliedFilters] = useState<any>(null);
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [openBookingPrefs, setOpenBookingPrefs] = useState(false);
    const [openBlockTime, setOpenBlockTime] = useState(false);

    const handleApplyFilters = (filters: any) => {
        setAppliedFilters(filters);
        setShowFilters(false);
        console.log("APPLIED FILTERS:", filters);
    };

    const { data, isLoading, error } = useGetProvidersQuery({
        page: 1,
        limit: 10,
    });

    const filtered = useMemo(() => {
        if (!data?.data.providers) return [];

        return data.data.providers.map((p) => ({
            id: p.id,

            // UI expects these
            Name: `${p.firstName} ${p.lastName}`,
            email: p.email,

            // DEFAULT frontend-only values
            location: "Addis Ababa",
            speciality: "General Practice",
            rules: ["Online Booking", "18+"],

            // UI expects capitalized status
            status: p.status === "active" ? "Active" : "Inactive",
        }));
    }, [data]);


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!openMenu) return;

            const target = event.target as HTMLElement | null;
            if (!target) return;

            const insideMenu = target.closest(`[data-menu="${openMenu}"]`);
            const onButton = target.closest(`[data-menu-button="${openMenu}"]`);

            if (!insideMenu && !onButton) {
                setOpenMenu(null);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [openMenu]);
    return (
        <div className="w-full">
            <div className="bg-white rounded-md my-3 p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold mb-1">Providers Directory</h1>
                        <p className="text-gray-500 text-sm"> Search, filter, and manage provider availability and booking preferences</p>
                    </div>
                    <button className="px-4 py-3 bg-primary-700 text-white rounded-sm">
                        <a href="/admin/add-provider">Add Provider</a>
                    </button>
                </div>

                {/* Search + Filters Row */}
                <div className="flex gap-4">

                    {/* Search Input */}
                    <div className="relative flex-1">
                        <IconSearch size={18} className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search"
                            className="w-full border border-[#949BA9] rounded-md pl-10 pr-4 py-2 text-sm"
                        />
                    </div>

                    {/* Location Filter */}
                    <div className="relative w-48">
                        <select className="border border-[#D9D9D9] rounded-md px-4 py-2 w-full appearance-none text-[#808080] bg-[#FAFAFA]">
                            <option>All Locations</option>
                            <option>New York</option>
                            <option>California</option>
                            <option>Texas</option>
                        </select>

                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <div className="bg-[#EFEFEF] rounded-lg p-1">
                                <IconChevronDown size={20} className="text-gray-400" />
                            </div>
                        </div>
                    </div>

                    {/* Department Filter */}
                    <div className="relative w-48">
                        <select className="border border-[#D9D9D9] rounded-md px-4 py-2 w-full appearance-none text-[#808080] bg-[#FAFAFA]">
                            <option>All Departments</option>
                            <option>Orthopedics</option>
                            <option>Physical Therapy</option>
                            <option>Neurology</option>
                        </select>

                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <div className="bg-[#EFEFEF] rounded-lg p-1">
                                <IconChevronDown size={20} className="text-gray-400" />
                            </div>
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div className="relative w-48">
                        <select className="border border-[#D9D9D9] rounded-md px-4 py-2 w-full appearance-none text-[#808080] bg-[#FAFAFA]">
                            <option>Status</option>
                            <option>New</option>
                            <option>Assigned</option>
                            <option>Closed</option>
                        </select>

                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <div className="bg-[#EFEFEF] rounded-lg p-1">
                                <IconChevronDown size={20} className="text-gray-400" />
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div className="w-full bg-white  p-6 overflow-x-auto">

                {error && (
                    <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                        Failed to load providers. Please retry.
                    </div>
                )}

                <Table>
                    <TableHeader>
                        <TableRow className="h-16">
                            <TableHead></TableHead>

                            <TableHead>
                                <div className="flex items-center gap-1 text-table-text">
                                    Provider <IconArrowDown size={14} />
                                </div>
                            </TableHead>

                            <TableHead>
                                <div className="flex items-center gap-1 text-table-text">
                                    Location <IconArrowDown size={14} />
                                </div>
                            </TableHead>

                            <TableHead>
                                <div className="flex items-center gap-1 text-table-text">
                                    Speciality <IconArrowDown size={14} />
                                </div>
                            </TableHead>

                            <TableHead>
                                <div className="flex items-center gap-1 text-table-text">
                                    Booking Rules <IconArrowDown size={14} />
                                </div>
                            </TableHead>

                            <TableHead>
                                <div className="flex items-center gap-1 text-table-text">
                                    Status  <IconArrowDown size={14} />
                                </div>
                            </TableHead>
                            <TableHead></TableHead>

                        </TableRow>
                    </TableHeader>


                    <TableBody>
                        {isLoading && (
                            <TableRow>
                                <TableCell colSpan={7} className="py-10 text-center text-gray-500">
                                    Loading providers...
                                </TableCell>
                            </TableRow>
                        )}

                        {!isLoading && filtered.length === 0 && !error && (
                            <TableRow>
                                <TableCell colSpan={7} className="py-10 text-center text-gray-500">
                                    No providers found.
                                </TableCell>
                            </TableRow>
                        )}

                        {!isLoading && filtered.map((ref) => (
                            <TableRow
                                className="text-table-text cursor-pointer hover:bg-gray-50"
                                key={ref.id}
                                onClick={() => router.push(`/admin/providers/${ref.id}/provider-detail`)}
                            >

                                {/* Image */}
                                <TableCell>

                                </TableCell>

                                {/* Name + Email */}
                                <TableCell className="font-medium text-black">
                                    <div className="flex flex-col">
                                        <span>{ref.Name}</span>
                                        <span className="text-gray-500 text-sm">{ref.email}</span>
                                    </div>
                                </TableCell>

                                {/* Location */}
                                <TableCell>
                                    <div className='text-black'>
                                        {ref.location}
                                    </div>
                                </TableCell>

                                {/* Speciality */}
                                <TableCell>{ref.speciality}</TableCell>

                                <TableCell>
                                    <div className="flex flex-wrap gap-2">
                                        {ref.rules.map((rule, i) => (
                                            <span
                                                key={i}
                                                className="border border-black px-2 py-1 rounded-md text-xs bg-white text-black "
                                            >
                                                {rule}
                                            </span>
                                        ))}
                                    </div>
                                </TableCell>

                                {/* Status */}
                                <TableCell>
                                    <span
                                        className={`  inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm  ${ref.status === "Active"
                                            ? "bg-[#74E67433] text-[#34C759]"
                                            : "bg-[#F913133D] text-[#FF3B30]"
                                            } `}
                                    >
                                        <IconCircleFilled
                                            size={10}
                                            className={`${ref.status === "Active" ? "text-[#34C759]" : "text-[#FF3B30]"}`}
                                        />

                                        {ref.status}
                                    </span>
                                </TableCell>


                                {/* Menu */}
                                <TableCell className="relative">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setOpenMenu(openMenu === ref.id ? null : ref.id);
                                        }}
                                        className="p-1"
                                        data-menu-button={ref.id}
                                    >
                                        <IconDotsVertical size={18} />
                                    </button>

                                    {openMenu === ref.id && (
                                        <div
                                            className="absolute right-6 top-0 bg-white border rounded-md shadow-md py-2 w-52 z-10"
                                            data-menu={ref.id}
                                        >
                                            <button className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 w-full ">
                                                <IconEdit size={16} /> Edit
                                            </button>
                                            <button
                                                onClick={() => setOpenBlockTime(true)}

                                                className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 w-full">
                                                <IconCalendarEventFilled size={16} /> Block Time
                                            </button>
                                            <button
                                                onClick={() => setOpenBookingPrefs(true)}
                                                className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 w-full " >
                                                <IconAdjustmentsHorizontal size={16} /> Booking Preferences
                                            </button>
                                            <button className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 w-full ">
                                                <IconClock size={16} /> Schedule Builder
                                            </button>

                                            <button className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 w-full ">
                                                <IconUserMinus size={16} /> Set Active
                                            </button>
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>

                </Table>
            </div>
            <div className="pt-6">
                <div className="flex justify-center">
                    <div className="inline-flex items-center gap-2 bg-white shadow-sm py-2 px-6 rounded-xl">
                        <Toggle label="≪" />
                        <Toggle label="‹" />

                        <Toggle label="1" active />
                        <Toggle label="2" />
                        <Toggle label="3" />
                        <span className="px-2">...</span>
                        <Toggle label="10" />

                        <Toggle label="›" />
                        <Toggle label="≫" />
                    </div>
                </div>
            </div>
            {openBookingPrefs && (
                <ProviderBookingPreferences
                    onClose={() => setOpenBookingPrefs(false)}
                    onSave={(prefs: any) => {
                        console.log("Saved preferences:", prefs);
                        setOpenBookingPrefs(false);
                    }}
                />
            )}
            {openBlockTime && (
                <BlockTimeModal
                    open={openBlockTime}
                    onClose={() => setOpenBlockTime(false)}
                />
            )}

        </div>
    )
}

export default page
