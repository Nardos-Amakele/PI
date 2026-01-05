"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    IconSearch,
    IconDotsVertical,
    IconEdit,
    IconTrash,
    IconArrowDown,
} from "@tabler/icons-react";
import { useState, useEffect } from "react";
import AddFreezeReasonModal from "../../components/ui/AddFreezeReason";
import DeleteModal from "@/app/components/ui/DeleteModal";

import { useGetBlockReasonsQuery, useToggleBlockReasonStatusMutation, useDeleteBlockReasonMutation } from "./../../services/blockReasons/reasonsApi";

export default function AppointmentTypesPage() {
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const { data, isLoading, error } = useGetBlockReasonsQuery();

    const [toggleStatus] = useToggleBlockReasonStatusMutation();

    // Toggle active status
    const handleToggle = async (id: string) => {
        try {
            await toggleStatus(id).unwrap();
        } catch (err) {
            console.error("Failed to toggle status:", err);
        }
    };
    const [deleteBlockReason] = useDeleteBlockReasonMutation(); 
    const handleDelete = async (id: string) => {
        try {
            await deleteBlockReason(id).unwrap();
        } catch (err) {
            console.error("Failed to delete:", err);
        }
    };

    // Close the edit/delete menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!openMenu) return;
            const target = event.target as HTMLElement | null;
            if (!target) return;
            const insideMenu = target.closest(`[data-menu="${openMenu}"]`);
            const onButton = target.closest(`[data-menu-button="${openMenu}"]`);
            if (!insideMenu && !onButton) setOpenMenu(null);
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [openMenu]);

    if (isLoading) return <div className="p-6">Loading block reasons...</div>;
    if (error) return <div className="p-6 text-red-500">Failed to load block reasons</div>;

    const items = data?.data.blockReasons || [];

    return (
        <div className="w-full">
            <div className="bg-white rounded-md my-3 p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold mb-1">Block/Freeze Reasons</h1>
                        <p className="text-gray-500 text-sm">{items.length} active reasons</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            className="px-6 py-3 bg-primary-700 text-white shadow-sm text-sm"
                            onClick={() => setOpenModal(true)}
                        >
                            Add Reason
                        </button>

                        <AddFreezeReasonModal
                            open={openModal}
                            onClose={() => setOpenModal(false)}
                            onSubmit={() => {
                                console.log("Block reason added successfully!");
                            }}
                        />
                    </div>
                </div>

                {/* Search box */}
                <div className="relative">
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
                <Table>
                    <TableHeader>
                        <TableRow className="h-16 bg-[#FCFCFD]">
                            <TableHead>
                                <div className="flex items-center gap-1 text-table-text">
                                    Name <IconArrowDown size={14} />
                                </div>
                            </TableHead>
                            <TableHead>
                                <div className="flex items-center gap-1 text-table-text">
                                    Description <IconArrowDown size={14} />
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
                        {items.map((item) => (
                            <TableRow key={item.id} className="text-sm hover:bg-gray-50 border-t">
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="w-4 h-4 rounded-full"
                                            style={{ backgroundColor: item.color || "#ccc" }}
                                        />
                                        {item.title || "Missing"}
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">{item.description || "Missing"}</TableCell>

                                {/* ACTIVE Toggle */}
                                <TableCell>
                                    <button
                                        role="switch"
                                        aria-checked={item.status}
                                        onClick={() => handleToggle(item.id)}
                                        className="relative w-14 h-8 rounded-full bg-gray-200 p-1 flex items-center cursor-pointer transition-all"
                                    >
                                        <span
                                            className={`absolute inset-0 rounded-full transition-colors ${item.status ? "bg-[#25514A]" : "bg-[#42928526]"
                                                }`}
                                        />
                                        <span
                                            className={`relative z-10 block h-7 w-7 rounded-full bg-white shadow-[0_6px_20px_rgba(0,0,0,0.12)] transition-transform duration-300 ${item.status ? "translate-x-6" : "translate-x-0"
                                                } `}
                                        />
                                    </button>
                                </TableCell>

                                <TableCell className="relative">
                                    <button
                                        onClick={() => setOpenMenu(openMenu === item.id ? null : item.id)}
                                        className="p-1"
                                        data-menu-button={item.id}
                                    >
                                        <IconDotsVertical size={18} />
                                    </button>

                                    {openMenu === item.id && (
                                        <div className="absolute right-6 top-0 bg-white border rounded-md shadow-md py-2 w-32 z-10" data-menu={item.id}>
                                            <button className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 w-full">
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
        </div>
    );
}
function deleteBlockReason(id: string) {
    throw new Error("Function not implemented.");
}

