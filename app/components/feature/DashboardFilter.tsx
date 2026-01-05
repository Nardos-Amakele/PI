"use client";

import { useState } from "react";
import { IconChevronDown, IconCalendar } from "@tabler/icons-react";

export default function FilterBlock({ onApply }: { onApply?: (filters: any) => void }) {
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const [status, setStatus] = useState<string | null>(null);

    const [specialty, setSpecialty] = useState<string | null>("Orthopedic");
    const [openSpecialty, setOpenSpecialty] = useState(false);
    const [Lawoffice, setLawoffice] = useState<string | null>("Orthopedic");
    const [openLawoffice, setOpenLawoffice] = useState(false);

    // Status options
    const statusOptions = ["New", "Incomplete", "Ready"];

    const specialtyOptions = ["Orthopedic", "Neurology", "Cardiology", "General", "Pediatrics"];
    const LawofficeOptions = ["Orthopedic", "Neurology", "Cardiology", "General", "Pediatrics"];

    // Count active filters
    const activeCount =
        (fromDate ? 1 : 0) +
        (toDate ? 1 : 0) +
        (status ? 1 : 0) +
        (specialty ? 1 : 0);

    // Reset functions
    const resetDate = () => {
        setFromDate("");
        setToDate("");
    };

    const resetStatus = () => setStatus(null);

    const resetSpecialty = () => setSpecialty(null);
    const resetLawoffice = () => setLawoffice(null);

    const resetAll = () => {
        resetDate();
        resetStatus();
        resetSpecialty();
        resetLawoffice();
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm w-full max-w-lg mx-auto">
            <p className="text-lg font-semibold mb-6">Filter by:</p>

            {/* DATE RANGE */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Date Range</h3>
                    <button onClick={resetDate} className="text-primary-700 text-sm font-medium">
                        Reset
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* From */}
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-500 mb-1">From</label>
                        <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
                            <input
                                type="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                                className="flex-1 bg-transparent outline-none"
                            />
                            <IconCalendar className="h-5 w-5 text-gray-400" />
                        </div>
                    </div>

                    {/* To */}
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-500 mb-1">To</label>
                        <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
                            <input
                                type="date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                                className="flex-1 bg-transparent outline-none"
                            />
                            <IconCalendar className="h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* STATUS */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Status</h3>
                    <button onClick={resetStatus} className="text-primary-700 text-sm font-medium">
                        Reset
                    </button>
                </div>

                <div className="flex gap-3">
                    {statusOptions.map((s) => (
                        <button
                            key={s}
                            onClick={() => setStatus(s)}
                            className={`px-4 py-2 rounded-lg border transition ${status === s
                                    ? "bg-primary-700 text-white"
                                    : "bg-white border-gray-300 text-gray-600"
                                }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* SPECIALTY */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Speciality</h3>
                    <button onClick={resetSpecialty} className="text-primary-700 text-sm font-medium">
                        Reset
                    </button>
                </div>

                {/* Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setOpenSpecialty((prev) => !prev)}
                        className="w-full border rounded-lg px-4 py-3 flex justify-between items-center"
                    >
                        <div className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full bg-green-500"></span>
                            {specialty || "Select specialty"}
                        </div>
                        <IconChevronDown className="h-5 w-5 text-gray-500" />
                    </button>

                    {openSpecialty && (
                        <div className="absolute left-0 right-0 bg-white border rounded-lg mt-1 shadow-lg z-10">
                            {specialtyOptions.map((sp) => (
                                <button
                                    key={sp}
                                    onClick={() => {
                                        setSpecialty(sp);
                                        setOpenSpecialty(false);
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                >
                                    {sp}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {/* LAW OFFICE */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Law Office</h3>
                    <button onClick={resetLawoffice} className="text-primary-700 text-sm font-medium">
                        Reset
                    </button>
                </div>
                {/* Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setOpenLawoffice((prev) => !prev)}
                        className="w-full border rounded-lg px-4 py-3 flex justify-between items-center"
                    >
                        <div className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full bg-green-500"></span>
                            {Lawoffice || "Select Lawoffice"}
                        </div>
                        <IconChevronDown className="h-5 w-5 text-gray-500" />
                    </button>
                    {openLawoffice && (
                        <div className="absolute left-0 right-0 bg-white border rounded-lg mt-1 shadow-lg z-10">
                            {LawofficeOptions.map((lo) => (
                                <button
                                    key={lo}
                                    onClick={() => {
                                        setLawoffice(lo);
                                        setOpenLawoffice(false);
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                >
                                    {lo}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {/* BUTTONS */}
            <div className="flex items-center gap-4 mt-6">
                <button
                    onClick={resetAll}
                    className="flex-1 bg-[#F3F0FF] text-primary-700 py-3 rounded-lg font-medium"
                >
                    Reset All
                </button>

                <button
                    onClick={() =>
                        onApply?.({
                            fromDate,
                            toDate,
                            status,
                            specialty,
                            Lawoffice,
                        })
                    }
                    className="flex-1 bg-primary-700 text-white py-3 rounded-lg font-medium"
                >
                    Apply Filters ({activeCount})
                </button>
            </div>
        </div>
    );
}
