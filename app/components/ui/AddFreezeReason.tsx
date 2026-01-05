"use client";

import { HexColorPicker } from "react-colorful";
import { useState } from "react";
import { IconX } from "@tabler/icons-react";

// ✅ Import the RTK mutation
import { useCreateBlockReasonMutation } from "../../services/blockReasons/reasonsApi";

type AddFreezeReasonModalProps = {
    open: boolean;
    onClose: () => void;
    onSubmit?: () => void; // optional callback after success
};

export default function AddFreezeReasonModal({ open, onClose, onSubmit }: AddFreezeReasonModalProps) {
    const [color, setColor] = useState("#1708FF");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    // ✅ RTK mutation hook
    const [createBlockReason, { isLoading, error }] = useCreateBlockReasonMutation();

    if (!open) return null;

    const handleSubmit = async () => {
        try {
            await createBlockReason({
                title: name,
                description,
                color,
                status: true,
                id: undefined
            }).unwrap();

            // Clear fields
            setName("");
            setDescription("");
            setColor("#1708FF");

            // Close modal
            onClose();

            // Call optional callback (e.g., refresh list)
            if (onSubmit) onSubmit();
        } catch (err) {
            console.error("Failed to create block reason:", err);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[2000] p-4">
            <div className="bg-white w-full max-w-4xl rounded-2xl shadow-lg p-8 relative">
                {/* Close Icon */}
                <button
                    onClick={onClose}
                    className="absolute right-6 top-6 text-gray-400 hover:text-black"
                >
                    <IconX size={22} />
                </button>

                <h1 className="text-3xl font-semibold mb-1">Add Freeze Reason</h1>
                <p className="text-gray-500 mb-8">Configure the blocking/freezing reason</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* LEFT — Color Picker */}
                    <div className="border rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-medium mb-4">Choose a Color</h2>
                        <HexColorPicker color={color} onChange={setColor} />
                        <div className="mt-4 flex items-center gap-3">
                            <div className="w-7 h-7 rounded-md border" style={{ backgroundColor: color }} />
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

                        {/* Description */}
                        <div className="flex flex-col">
                            <label className="font-medium mb-1">Description</label>
                            <input
                                type="text"
                                placeholder="Eg. INIT"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="border-2 border-gray-200 rounded-md px-4 py-2"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4 mt-6">
                            <button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="bg-[#1D5CA8] text-white px-8 py-3 rounded-md shadow-sm disabled:opacity-50"
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

                        {error && (
                            <p className="text-red-600 mt-2">
                                Failed to create block reason. Please try again.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
