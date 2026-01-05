"use client";

import { IconX, IconAlertTriangle } from "@tabler/icons-react";

type DeleteModalProps = {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
};

export default function DeleteModal({ open, onClose, onConfirm }: DeleteModalProps) {
    
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[2000] p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6 relative">

                {/* HEADER — Alert Icon + Close Icon */}
                <div className="flex items-center justify-between mb-6">
                    <IconAlertTriangle size={28} className="text-red-500" />

                    <button onClick={onClose} className="text-gray-400 hover:text-black">
                        <IconX size={24} />
                    </button>
                </div>

                {/* TITLE */}
                <h2 className="text-xl font-semibold mb-2">
                    Are you sure you want to delete?
                </h2>

                {/* DESCRIPTION */}
                <p className="text-gray-600 mb-8">
                    This action cannot be undone. Deleting this item will permanently 
                    remove it from the system.
                </p>

                {/* BUTTONS */}
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        className="px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}
