"use client";

import { HexColorPicker } from "react-colorful";
import { useState } from "react";
import { IconChevronDown, IconX } from "@tabler/icons-react";
import { useGetServiceTypesQuery } from "../../services/services/serviceApi";
import { useCreateAppointmentTypeMutation } from "@/app/services/appointmentTypes/appointmentTypesApi";

type AddAppointmentTypeModalProps = {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: { name: string; shortTitle: string; color: string; serviceTypeId: string; duration: number }) => void;
};

export default function AddAppointmentTypeModal({
    open,
    onClose,
    onSubmit,
}: AddAppointmentTypeModalProps) {
    const [color, setColor] = useState("#1708FF");
    const [name, setName] = useState("");
    const [shortTitle, setShortTitle] = useState("");
    const [serviceTypeId, setServiceTypeId] = useState("");
    const [duration, setDuration] = useState(30);

    const [createAppointmentType, { isLoading }] =
        useCreateAppointmentTypeMutation();
    const { data: serviceTypesData, isLoading: isLoadingServiceTypes } = useGetServiceTypesQuery();

    if (!open) return null;

    const handleAdd = async () => {
        try {
            if (!name.trim()) {
                alert("Name is required");
                return;
            }
            if (!serviceTypeId) {
                alert("Please select a service type");
                return;
            }
            if (!color) {
                alert("Color is required");
                return;
            }
            const safeDuration = duration > 0 ? duration : 30;
            const safeShortTitle = shortTitle.trim() || name.trim();
            await createAppointmentType({
                title: name,
                shortTitle: safeShortTitle,
                duration: safeDuration,
                color,
                serviceTypeId,
            }).unwrap();

            onSubmit({ name, shortTitle: safeShortTitle, color, serviceTypeId, duration: safeDuration });

            onClose();
        } catch (error) {
            console.error("Create service type failed:", error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[2000] p-4">
            <div className="bg-white w-full max-w-5xl rounded-2xl shadow-lg p-8 relative">

                {/* Close Icon */}
                <button
                    onClick={onClose}
                    className="absolute right-6 top-6 text-gray-400 hover:text-black"
                >
                    <IconX size={22} />
                </button>

                <h1 className="text-3xl font-semibold mb-1">Add Appointment Type</h1>
                <p className="text-gray-500 mb-8">Configure the appointment type details</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                    {/* LEFT — Color Picker */}
                    <div className="border rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-medium mb-4">Choose a Color</h2>

                        <HexColorPicker color={color} onChange={setColor} />

                        <div className="mt-4 flex items-center gap-3">
                            <div
                                className="w-7 h-7 rounded-md border"
                                style={{ backgroundColor: color }}
                            />

                            <input
                                type="text"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                className="border rounded-md px-3 py-2 w-32 text-sm"
                            />

                            <button
                                onClick={() => navigator.clipboard.writeText(color)}
                                className="px-3 py-2 border rounded-md text-sm hover:bg-gray-100"
                            >
                                Copy
                            </button>
                        </div>
                    </div>


                    {/* RIGHT — Form Fields */}
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col  relative">
                            <label className="font-medium mb-1">Appointment Class</label>
                            <div className="relative">
                                <select
                                    className="border-2 border-gray-200 rounded-md px-4 py-2 w-full appearance-none text-[#808080] bg-[#FAFAFA]"
                                    value={serviceTypeId}
                                    onChange={(e) => setServiceTypeId(e.target.value)}
                                    disabled={isLoadingServiceTypes}
                                >
                                    <option value="">Select service type</option>
                                    {(serviceTypesData?.data || []).map((svc) => (
                                        <option key={svc.id} value={svc.id}>
                                            {svc.title}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                    <div className="bg-[#EFEFEF] rounded-lg p-1">
                                        <IconChevronDown size={20} className="text-gray-400" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Name */}
                        <div className="flex flex-col">
                            <label className="font-medium mb-1">Name</label>
                            <input
                                type="text"
                                placeholder="Eg. Initial Evaluation"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="border-2 border-gray-200 rounded-md px-4 py-2"
                            />
                        </div>

                        {/* Short Name */}
                        <div className="flex flex-col">
                            <label className="font-medium mb-1">Short Name</label>
                            <input
                                type="text"
                                placeholder="Eg. INIT"
                                value={shortTitle}
                                onChange={(e) => setShortTitle(e.target.value)}
                                className="border-2 border-gray-200 rounded-md px-4 py-2"
                            />
                        </div>

                        {/* Duration + Appointment Class (UNCHANGED, UNUSED) */}

                        <div className="flex flex-col  relative">
                            <label className="font-medium mb-1">Duration</label>
                            <div className="relative">
                                <select
                                    className="border-2 border-gray-200 rounded-md px-4 py-2 w-full appearance-none text-[#808080] bg-[#FAFAFA]"
                                    value={duration}
                                    onChange={(e) => setDuration(Number(e.target.value) || 30)}
                                >
                                    {[15, 20, 30, 45, 60].map((opt) => (
                                        <option key={opt} value={opt}>{opt} min</option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                    <div className="bg-[#EFEFEF] rounded-lg p-1">
                                        <IconChevronDown size={20} className="text-gray-400" />
                                    </div>
                                </div>
                            </div>
                        </div>



                        {/* Buttons */}
                        <div className="flex gap-4 mt-6">
                            <button
                                onClick={handleAdd}
                                disabled={isLoading}
                                className="bg-primary-700 text-white px-8 py-3 rounded-md shadow-sm disabled:opacity-60"
                            >
                                {isLoading ? "Adding..." : "Add"}
                            </button>

                            <button
                                onClick={onClose}
                                className="bg-[#8D1F1B] text-white px-8 py-3 rounded-md shadow-sm"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
