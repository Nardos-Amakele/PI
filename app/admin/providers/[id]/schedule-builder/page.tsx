
"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Toggle from "../../../../components/ui/Toggle";
import {
    IconSearch,
    IconDotsVertical,
    IconEdit,
    IconTrash,
    IconArrowDown,
} from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AddAppointmentType from "../../../../components/ui/AddAppointmentModal";
import DeleteModal from "@/app/components/ui/DeleteModal";
import ProvidersDetailsTabs from "@/app/components/navigation/ProviderDetailsTabs";
import { useDeleteScheduleTemplateMutation, useGetScheduleTemplatesQuery } from "@/app/services/scheduling/schedulingApi";
interface AppointmentTypeItem {
    id: string;
    templateName: string;
    startDate: Date;
    endDate: Date;
    createdOn: Date;
    utilization: string;
    color: string;
    active: boolean;
    Location?: {
        id: string;
        name: string;
    };

}

export default function AppointmentTypesPage() {
    const router = useRouter();
    const params = useParams();
    const providerId = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";
    const [page, setPage] = useState(1);
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const { data, isLoading, isError } = useGetScheduleTemplatesQuery({ providerId });
    const [deleteScheduleTemplate, { isLoading: isDeleting }] = useDeleteScheduleTemplateMutation();
    const [items, setItems] = useState<AppointmentTypeItem[]>([]);

    useEffect(() => {
        if (!data?.data?.scheduleTemplates) return;
        const mapped = data.data.scheduleTemplates.map((template: any) => ({
            id: template.id,
            templateName: template.name,
            Location: template?.Location
                ? {
                    id: template.Location.id,
                    name: template.Location.name || template.locationId || "—",
                }
                : template.locationId
                    ? { id: template.locationId, name: template.locationId }
                    : undefined,
            startDate: new Date(template.validFrom),
            endDate: new Date(template.validUntil),
            createdOn: new Date(template.createdAt ?? template.validFrom),
            utilization: "-",
            color: template.color || "#4F46E5",
            active: true,
        }));
        setItems(mapped);
    }, [data]);

    const pagination = {
        page,
        limit: 10,
        totalItems: items.length,
        totalPages: Math.max(1, Math.ceil(items.length / 10)),
    };

    const toggleActive = (id: string) => {
        setItems((prev) => prev.map((item) => item.id === id ? { ...item, active: !item.active } : item));
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteScheduleTemplate(id).unwrap();
            setItems((prev) => prev.filter((item) => item.id !== id));
        } catch (err) {
            console.error("Failed to delete schedule template", err);
            alert("Failed to delete schedule template. Please try again.");
        }
    };

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
            <div className='bg-white mb-6 px-4 rounded-xl'>
                <div className="flex items-center justify-between  mt-6 py-6 bg-white max-w-7xl mx-auto">
                    <div>
                        <h1 className="text-2xl font-semibold mb-1">Schedule Builder</h1>
                        <p className="text-gray-500 text-sm"> Dr. Margaret, Orthopedics</p>
                    </div>
                    <button
                        className="px-4 py-3 bg-primary-700 text-white rounded-sm"
                        onClick={() => {
                            if (!providerId) return;
                            router.push(`/admin/providers/${providerId}/add-schedule-template`);
                        }}
                    >
                        Add Template
                    </button>
                </div>
                <div className='pb-4'>
                    <ProvidersDetailsTabs />
                </div>
            </div>


            {/* Table */}
            <div className="border rounded-xl bg-white shadow-sm overflow-hidden p-2">
                {/* Loading State */}
                {isLoading && (
                    <div className="text-center py-8">
                        <p className="text-gray-500">Loading schedule templates...</p>
                    </div>
                )}

                {/* Error State */}
                {isError && (
                    <div className="text-center py-8">
                        <p className="text-red-500">Failed to load schedule templates. Please try again.</p>
                    </div>
                )}

                {/* Table Content */}
                {!isLoading && !isError && (
                    <div className=" bg-whit overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="h-16 bg-[#FCFCFD]">
                                    <TableHead>
                                        <div className="flex items-center gap-1 text-table-text">
                                            Template Name <IconArrowDown size={14} />
                                        </div>
                                    </TableHead>

                                    <TableHead>
                                        <div className="flex items-center gap-1 text-table-text">
                                            Location <IconArrowDown size={14} />
                                        </div>
                                    </TableHead>

                                    <TableHead>
                                        <div className="flex items-center gap-1 text-table-text">
                                            Start Date <IconArrowDown size={14} />
                                        </div>
                                    </TableHead>

                                    <TableHead>
                                        <div className="flex items-center gap-1 text-table-text">
                                            End Date <IconArrowDown size={14} />
                                        </div>
                                    </TableHead>

                                    <TableHead>
                                        <div className="flex items-center gap-1 text-table-text">
                                            Created On <IconArrowDown size={14} />
                                        </div>
                                    </TableHead>

                                    <TableHead>
                                        <div className="flex items-center gap-1 text-table-text">
                                            Utilization <IconArrowDown size={14} />
                                        </div>
                                    </TableHead>

                                    <TableHead>
                                        <div className="flex items-center gap-1 text-table-text">
                                            Active <IconArrowDown size={14} />
                                        </div>
                                    </TableHead>

                                    <TableHead></TableHead>

                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {items.map((item: AppointmentTypeItem) => (
                                    <TableRow
                                        key={item.id}
                                        className="text-sm hover:bg-gray-50 border-t"
                                    >
                                        {/* Name w/ Color Dot */}
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className="w-4 h-4 rounded-full"
                                                    style={{ backgroundColor: item.color }}
                                                />
                                                {item.templateName}
                                            </div>
                                        </TableCell>

                                        {/* Location */}
                                        <TableCell className="font-medium">
                                            {item.Location?.name ?? "—"}
                                        </TableCell>

                                        {/* Start Date */}
                                        <TableCell>
                                            {item.startDate.toLocaleDateString()}
                                        </TableCell>

                                        {/* End Date */}
                                        <TableCell>
                                            {item.endDate.toLocaleDateString()}
                                        </TableCell>

                                        {/* Created On */}
                                        <TableCell>
                                            {item.createdOn.toLocaleDateString()}
                                        </TableCell>

                                        {/* Utilization */}
                                        <TableCell className="font-medium">
                                            {item.utilization}
                                        </TableCell>

                                        {/* ACTIVE (iPhone-style toggle icon) */}
                                        <TableCell>
                                            <button
                                                role="switch"
                                                aria-checked={item.active}
                                                onClick={() => toggleActive(item.id)}
                                                className="relative w-14 h-8 rounded-full bg-gray-200 p-1 flex items-center cursor-pointer transition-all"
                                            >
                                                {/* Background highlight */}
                                                <span
                                                    className={`absolute inset-0 rounded-full transition-colors ${item.active ? "bg-[#25514A]" : "bg-[#42928526]"}`}
                                                />

                                                {/* Handle */}
                                                <span
                                                    className={`relative z-10 block h-7 w-7 rounded-full bg-white shadow-[0_6px_20px_rgba(0,0,0,0.12)] transition-transform duration-300 ${item.active ? "translate-x-6" : "translate-x-0"} `}
                                                />
                                            </button>
                                        </TableCell>



                                        {/* Menu */}
                                        <TableCell className="relative">
                                            <button
                                                onClick={() =>
                                                    setOpenMenu(openMenu === item.id ? null : item.id)
                                                }
                                                className="p-1"
                                                data-menu-button={item.id}
                                            >
                                                <IconDotsVertical size={18} />
                                            </button>

                                            {openMenu === item.id && (
                                                <div
                                                    className="absolute right-6 top-0 bg-white border rounded-md shadow-md py-2 w-32 z-10"
                                                    data-menu={item.id}
                                                >
                                                    <button
                                                        className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 w-full"
                                                        onClick={() => {
                                                            if (!providerId) return;
                                                            router.push(`/admin/providers/${providerId}/schedule-builder/${item.id}`);
                                                        }}
                                                    >
                                                        <IconEdit size={16} /> Edit
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedId(item.id);
                                                            setOpenDelete(true);
                                                        }}
                                                        className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 w-full text-red-600"
                                                    >
                                                        <IconTrash size={16} /> Delete
                                                    </button>

                                                    {/* DELETE MODAL */}
                                                    <DeleteModal
                                                        open={openDelete && selectedId === item.id}
                                                        onClose={() => setOpenDelete(false)}
                                                        onConfirm={async () => {
                                                            if (selectedId) await handleDelete(selectedId);
                                                            setOpenDelete(false);
                                                        }}
                                                    />

                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}

            </div>
            <div className="pt-6">
                <div className="flex justify-center">
                    <div className="inline-flex items-center gap-2 bg-white shadow-sm py-2 px-6 rounded-xl">
                        <Toggle
                            label="≪"
                            onClick={() => setPage(1)}
                        />
                        <Toggle
                            label="‹"
                            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                        />

                        {/* Generate page numbers */}
                        {Array.from({ length: Math.min(3, pagination.totalPages) }, (_, i) => {
                            const pageNum = Math.max(1, Math.min(pagination.page - 1, pagination.totalPages - 2)) + i;
                            if (pageNum <= pagination.totalPages) {
                                return (
                                    <Toggle
                                        key={pageNum}
                                        label={String(pageNum)}
                                        active={pageNum === pagination.page}
                                        onClick={() => setPage(pageNum)}
                                    />
                                );
                            }
                            return null;
                        })}

                        {pagination.totalPages > 3 && pagination.page < pagination.totalPages - 1 && (
                            <span className="px-2">...</span>
                        )}

                        {pagination.totalPages > 3 && (
                            <Toggle
                                label={String(pagination.totalPages)}
                                active={pagination.page === pagination.totalPages}
                                onClick={() => setPage(pagination.totalPages)}
                            />
                        )}

                        <Toggle
                            label="›"
                            onClick={() => setPage((prev) => Math.min(pagination.totalPages, prev + 1))}
                        />
                        <Toggle
                            label="≫"
                            onClick={() => setPage(pagination.totalPages)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}