

"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Toggle from "../../components/ui/Toggle";
import {
    IconSearch,
    IconDotsVertical,
    IconEdit,
    IconTrash,
    IconArrowDown,
} from "@tabler/icons-react";
import { useState, useEffect } from "react";
import AddAppointmentModal from "../../components/ui/AddAppointmentModal";
import EditAppointmentModal from "../../components/ui/EditAppointmentModal";
import DeleteModal from "@/app/components/ui/DeleteModal";
import { useGetAppointmentTypesQuery, useDeleteAppointmentTypeMutation } from "@/app/services/appointmentTypes/appointmentTypesApi";
import { AppointmentType } from "@/app/services/appointmentTypes/appointmentTypesTypes";

interface AppointmentTypeItem {
    id: string;
    name: string;
    shortName: string;
    duration: string;
    class: string;
    order: number;
    active: boolean;
    color: string;
}

export default function AppointmentTypesPage() {
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);


    // Fetch service types from API
    const { data, isLoading, isError } = useGetAppointmentTypesQuery({ page, limit });

    // Transform API data to match table structure
    const items: AppointmentTypeItem[] = data?.data?.appointmentTypes?.map((appt: AppointmentType, index: number) => ({
        id: appt.id,
        name: appt.title,
        shortName: appt.shortTitle ?? "",
        duration: `${appt.duration} MIN`,
        class: appt.ServiceType?.title || appt.serviceTypeId || "—",
        order: index + 1,
        active: true,
        color: appt.color || "#2196F3",
    })) || [];

    // Pagination data from API
    const pagination = data?.data?.pagination ?? {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1,
    };
    const totalCount = pagination.total ?? (pagination as any).totalItems ?? items.length;

    const toggleActive = (id: string) => {
        // TODO: Implement API call to update service type active status
        console.log("Toggle active for ID:", id);
    };
    const [deleteAppointmentType] = useDeleteAppointmentTypeMutation();
    const handleDelete = async (id: string) => {
        try {
            await deleteAppointmentType(id).unwrap();
        } catch (err) {
            console.error("Failed to delete:", err);
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
            <div className="bg-white rounded-md my-3 p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold mb-1">Appointment Types</h1>
                        <p className="text-gray-500 text-sm">
                            {isLoading ? "Loading..." : `${totalCount} types configured`}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="px-6 py-3 border  bg-white shadow-md text-sm">Export csv</button>
                        <button
                            className="px-6 py-3 bg-primary-700 text-white shadow-sm text-sm"
                            onClick={() => setOpenModal(true)}
                        >
                            Add Appointment Type
                        </button>
                    </div>
                    <AddAppointmentModal
                        open={openModal}
                        onClose={() => setOpenModal(false)}
                        onSubmit={(data) => {
                            console.log("NEW APPOINTMENT TYPE:", data);
                            setOpenModal(false);
                        }}
                    />
                    <EditAppointmentModal
                        open={openEditModal}
                        appointmentTypeId={selectedId || undefined}
                        onClose={() => {
                            setOpenEditModal(false);
                            setSelectedId(null);
                        }}
                        onSubmit={(data) => {
                            console.log("EDIT APPOINTMENT TYPE:", { id: selectedId, data });
                            setOpenEditModal(false);
                            setSelectedId(null);
                        }}
                    />
                </div>

                {/* Search box */}
                <div className="relative ">
                    <IconSearch size={18} className="absolute left-3 top-3 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full border border-[#949BA9] rounded-md pl-10 pr-4 py-2 text-sm"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="border rounded-xl bg-white shadow-sm overflow-hidden p-2">
                {/* Loading State */}
                {isLoading && (
                    <div className="text-center py-8">
                        <p className="text-gray-500">Loading appointment types...</p>
                    </div>
                )}

                {/* Error State */}
                {isError && (
                    <div className="text-center py-8">
                        <p className="text-red-500">Failed to load appointment types. Please try again.</p>
                    </div>
                )}

                {/* Table Content */}
                {!isLoading && !isError && (
                    <div className=" bg-whit overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="h-16 bg-[#FCFCFD]">
                                    <TableHead>  <div className="flex items-center gap-1 text-table-text">
                                        Name <IconArrowDown size={14} />
                                    </div></TableHead>

                                    <TableHead>
                                        <div className="flex items-center gap-1 text-table-text">
                                            Short Name <IconArrowDown size={14} />
                                        </div>
                                    </TableHead>

                                    <TableHead>
                                        <div className="flex items-center gap-1 text-table-text">
                                            Duration <IconArrowDown size={14} />
                                        </div>
                                    </TableHead>

                                    <TableHead>
                                        <div className="flex items-center gap-1 text-table-text">
                                            Class <IconArrowDown size={14} />
                                        </div>
                                    </TableHead>

                                    <TableHead>
                                        <div className="flex items-center gap-1 text-table-text">
                                            Order <IconArrowDown size={14} />
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
                                                {item.name}
                                            </div>
                                        </TableCell>

                                        {/* Short Name */}
                                        <TableCell className="font-medium">
                                            {item.shortName}
                                        </TableCell>

                                        {/* Duration */}
                                        <TableCell>{item.duration}</TableCell>

                                        {/* Class */}
                                        <TableCell>{item.class}</TableCell>

                                        {/* Order */}
                                        <TableCell className="font-medium">
                                            {item.order}
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
                                                            setSelectedId(item.id);
                                                            setOpenEditModal(true);
                                                            setOpenMenu(null);
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