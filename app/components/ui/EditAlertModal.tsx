"use client";

import { useGetPatientAlertsQuery } from "@/app/services/patients/patientsApi";


type EditAlertModalProps = {
    open: boolean;
    patientId: string;
    selectedIndex?: number;
    onClose: () => void;
    onUpdate: () => void;
};

export default function EditAlertModal({
    open,
    patientId,
    selectedIndex = 0,
    onClose,
    onUpdate,
}: EditAlertModalProps) {
    const { data, isLoading, isError } = useGetPatientAlertsQuery(patientId, {
        skip: !open || !patientId,
    });

    const alertText = data?.data?.alerts?.[selectedIndex]?.text;

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            {/* Modal */}
            <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-lg">
                {/* Header */}
                <h2 className="text-lg font-semibold text-gray-900 flex gap-1">
                    <span>📄</span> Edit Alert
                </h2>

                {/* Divider */}
                <div className="my-4 h-px w-full bg-gray-200" />

                {/* Alert Box */}
                <div className="whitespace-normal wrap-break-words text-left text-sm font-bold text-[#97150D] bg-input-bg p-6 min-h-[72px] flex items-center">
                    {isLoading ? (
                        <p className="text-sm text-gray-500">Loading alert...</p>
                    ) : isError ? (
                        <p className="text-sm text-red-600">Failed to load alert.</p>
                    ) : alertText ? (
                        <p className="text-sm text-[#97150D] font-bold">{alertText}</p>
                    ) : (
                        <p className="text-sm text-gray-500">No alerts found.</p>
                    )}
                </div>


                {/* Actions */}
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onUpdate}
                        className="rounded-md bg-primary-700 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600"
                    >
                        Update
                    </button>
                    <button
                        onClick={onClose}
                        className="rounded-md border px-4 py-2 text-sm font-medium text-white bg-[#8D1F1B]"
                    >
                        Cancel
                    </button>


                </div>
            </div>
        </div>
    );
}
