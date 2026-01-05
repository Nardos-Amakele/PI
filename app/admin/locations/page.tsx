"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    IconSearch,
    IconDotsVertical,
    IconEdit,
    IconTrash,
    IconArrowDown,
} from "@tabler/icons-react";
import { useState, useEffect, useMemo } from "react";
import DeleteModal from "@/app/components/ui/DeleteModal";
import AddLocationModal from "@/app/components/ui/AddLocationModal";
import { useDeleteLocationMutation, useGetLocationsQuery, useToggleLocationStatusMutation } from "@/app/services/locations/locationsApi";
import { Location } from "@/app/services/locations/locationsTypes";

export default function AppointmentTypesPage() {
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [openLocationModal, setOpenLocationModal] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const { data, isLoading, isError, refetch } = useGetLocationsQuery({ page: 1, limit: 50 });
    const [deleteLocation, { isLoading: isDeleting }] = useDeleteLocationMutation();
    const [toggleLocationStatus, { isLoading: isToggling }] = useToggleLocationStatusMutation();
    const [items, setItems] = useState<Location[]>([]);

    useEffect(() => {
        if (data?.data?.locations) {
            setItems(data.data.locations);
        }
    }, [data]);

    const totalLocations = data?.data?.pagination?.total ?? items.length;
    const activeCount = useMemo(
        () => items.filter((item) => item.status === "active").length,
        [items]
    );

    const handleToggle = async (id: string) => {
        // optimistic flip
        setItems((prev) =>
            prev.map((item) =>
                item.id === id
                    ? { ...item, status: item.status === "active" ? "inactive" : "active" }
                    : item
            )
        );
        try {
            await toggleLocationStatus(id).unwrap();
        } catch (err) {
            console.error("Failed to toggle status", err);
            // revert on failure
            setItems((prev) =>
                prev.map((item) =>
                    item.id === id
                        ? { ...item, status: item.status === "active" ? "inactive" : "active" }
                        : item
                )
            );
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteLocation(id).unwrap();
            setItems((prev) => prev.filter((item) => item.id !== id));
        } catch (err) {
            // TODO: surface toast/error state
            console.error("Failed to delete location", err);
        }
    };

    /* Close menu when clicking outside */
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!openMenu) return;
            const target = event.target as HTMLElement | null;
            if (!target) return;
            const insideMenu = target.closest(`[data-menu="${openMenu}"]`);
            const onButton = target.closest(
                `[data-menu-button="${openMenu}"]`
            );
            if (!insideMenu && !onButton) setOpenMenu(null);
        };
        document.addEventListener("click", handleClickOutside);
        return () =>
            document.removeEventListener("click", handleClickOutside);
    }, [openMenu]);

    return (
        <div className="w-full">
            <div className="bg-white rounded-md my-3 p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold mb-1">
                            Locations
                        </h1>
                        <p className="text-gray-500 text-sm">
                            {activeCount} active locations
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            className="px-6 py-3 bg-primary-700 text-white shadow-sm text-sm"
                            onClick={() => {
                                setEditingId(null);
                                setOpenLocationModal(true);
                            }}
                        >
                            Add a new location
                        </button>

                        <AddLocationModal
                            open={openLocationModal}
                            locationId={editingId}
                            onClose={() => {
                                setOpenLocationModal(false);
                                setEditingId(null);
                            }}
                        />
                    </div>
                </div>

                {/* Search */}
                <div className="relative">
                    <IconSearch
                        size={18}
                        className="absolute left-3 top-3 text-gray-400"
                    />
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full border border-[#949BA9] rounded-md pl-10 pr-4 py-2 text-sm"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="border rounded-xl bg-white shadow-sm overflow-hidden p-2">
                {isError && (
                    <div className="px-4 py-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md mb-3">
                        Could not load locations. <button className="underline" onClick={() => refetch()}>Retry</button>
                    </div>
                )}
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
                                    NPI Number{" "}
                                    <IconArrowDown size={14} />
                                </div>
                            </TableHead>
                            <TableHead>
                                <div className="flex items-center gap-1 text-table-text">
                                    Address{" "}
                                    <IconArrowDown size={14} />
                                </div>
                            </TableHead>
                            <TableHead>
                                <div className="flex items-center gap-1 text-table-text">
                                    Place of Service Code{" "}
                                    <IconArrowDown size={14} />
                                </div>
                            </TableHead>
                            <TableHead>
                                <div className="flex items-center gap-1 text-table-text">
                                    Active <IconArrowDown size={14} />
                                </div>
                            </TableHead>
                            <TableHead />
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {isLoading && (
                            <TableRow className="text-sm">
                                <TableCell colSpan={6} className="py-8 text-center text-gray-500">
                                    Loading locations...
                                </TableCell>
                            </TableRow>
                        )}

                        {!isLoading && items.length === 0 && (
                            <TableRow className="text-sm">
                                <TableCell colSpan={6} className="py-8 text-center text-gray-500">
                                    No locations found.
                                </TableCell>
                            </TableRow>
                        )}

                        {items.map((item) => (
                            <TableRow
                                key={item.id}
                                className="text-sm hover:bg-gray-50 border-t"
                            >
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {item.name}
                                    </div>
                                </TableCell>

                                <TableCell className="font-medium">
                                    {item.npiNumber ?? "—"}
                                </TableCell>
                                <TableCell className="font-medium">
                                    {item.address?.office_address ?? "—"}
                                </TableCell>
                                <TableCell className="font-medium justify-center">
                                    {item.serviceCode ?? "—"}
                                </TableCell>

                                {/* Active toggle */}
                                <TableCell>
                                    <button
                                        role="switch"
                                        aria-checked={item.status === "active"}
                                        onClick={() =>
                                            handleToggle(item.id)
                                        }
                                        className="relative w-14 h-8 rounded-full bg-gray-200 p-1 flex items-center cursor-pointer transition-all"
                                    >
                                        <span
                                            className={`absolute inset-0 rounded-full transition-colors ${item.status === "active"
                                                ? "bg-[#25514A]"
                                                : "bg-[#42928526]"
                                                }`}
                                        />
                                        <span
                                            className={`relative z-10 block h-7 w-7 rounded-full bg-white shadow-[0_6px_20px_rgba(0,0,0,0.12)] transition-transform duration-300 ${item.status === "active"
                                                ? "translate-x-6"
                                                : "translate-x-0"
                                                }`}
                                        />
                                    </button>
                                </TableCell>

                                {/* Actions */}
                                <TableCell className="relative">
                                    <button
                                        onClick={() =>
                                            setOpenMenu(
                                                openMenu === item.id
                                                    ? null
                                                    : item.id
                                            )
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
                                                    setEditingId(item.id);
                                                    setOpenLocationModal(true);
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

                                            <DeleteModal
                                                open={
                                                    openDelete &&
                                                    selectedId === item.id
                                                }
                                                onClose={() =>
                                                    setOpenDelete(false)
                                                }
                                                onConfirm={async () => {
                                                    if (selectedId) {
                                                        await handleDelete(selectedId);
                                                    }
                                                    setOpenDelete(false);
                                                    setSelectedId(null);
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
