"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

import { FindAvailabilityData as availabilityData, DayAvailability } from "../../data/FindAvailabilityData";
import { IconCircleCheck, IconChevronDown, IconClock, IconPointFilled, IconUser, IconX } from "@tabler/icons-react";

export default function Page() {
    const [startTime, setStartTime] = useState("10:00");
    const [endTime, setEndTime] = useState("18:00");
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date("2026-02-26"));
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    const selectedDateStr = selectedDate ? selectedDate.toISOString().split("T")[0] : null;
    const dayAvailability: DayAvailability | undefined = availabilityData.find((d) => d.date === selectedDateStr);

    // Only show available dates within the selected range
    const availableDates = availabilityData
        .filter((d) => {
            if (!startDate || !endDate) return true;
            return d.date >= startDate && d.date <= endDate;
        })
        .map((d) => new Date(d.date));

    return (
        <div className="min-h-screen">
             <div className="relative rounded-lg overflow-hidden mb-6">
                    {/* Image */}
                    <img
                        src="/images/Welcome.jpg"
                        alt="banner"
                        className="w-full h-36 object-cover"
                    />

                    {/* Color overlay */}
                    <div className="absolute inset-0 bg-[#113A5CB2]"></div>

                    {/* Text content */}
                    <div className="absolute inset-0 flex items-center px-6">
                        <div className="flex-1">
                            <h1 className="text-3xl text-white font-bold">Welcome To PI</h1>
                            <p className="text-sm text-white/80 mt-1">
                                Your centralized workspace for referrals, cases, and provider activity
                            </p>
                        </div>
                        <img
                            src="/images/LawyerBar.png"
                            alt="banner"
                            className="w-20 h-20 object-cover"
                        />
                    </div>
                </div>
            <div className=" space-y-6">

                {/* HEADER */}
                <div className="bg-white rounded-md p-6">
                    <h1 className="text-lg font-semibold text-center">
                        Find Available Time Slot
                    </h1>
                    <p className="text-sm text-gray-500 text-center">
                        Scheduling for: Maria Garcia
                    </p>
                </div>
                <div className="flex flex-col items-center gap-4  bg-white py-6">

                    {/* ROW 1 – Filters */}
                    <div className="flex gap-4 justify-center">

                        {[
                            { label: "Location", options: ["All Locations", "New York", "California", "Texas"] },
                            { label: "Department", options: ["All Departments", "Orthopedics", "Physical Therapy", "Neurology"] },
                            { label: "Provider", options: ["All Providers", "Dr. John Moore", "Dr. Jane Smith", "Dr. Emily Davis"] },].map((item, idx) => (
                                <div key={idx} className="flex flex-col gap-1 w-48">
                                    <label className="text-xs text-[#808080] font-medium">
                                        {item.label}
                                    </label>

                                    <div className="relative">
                                        <select className="border border-[#D9D9D9] rounded-md px-4 py-2 w-full appearance-none text-[#808080] bg-[#FAFAFA]">
                                            {item.options.map((opt) => (
                                                <option key={opt}>{opt}</option>
                                            ))}
                                        </select>

                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                            <div className="bg-[#EFEFEF] rounded-lg p-1">
                                                <IconChevronDown size={18} className="text-gray-400" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>

                    {/* ROW 2 – Date Range */}
                    <div className="flex gap-4 justify-center">


                        <div className="flex flex-col gap-1 w-48">
                            <label className="text-xs text-[#808080] font-medium">
                                Start Date
                            </label>
                            <input
                                type="date"
                                className="border border-[#D9D9D9] rounded-md px-3 py-2 text-sm text-[#808080] bg-[#FAFAFA]"
                                value={startDate}
                                onChange={e => setStartDate(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-1 w-48">
                            <label className="text-xs text-[#808080] font-medium">
                                End Date
                            </label>
                            <input
                                type="date"
                                className="border border-[#D9D9D9] rounded-md px-3 py-2 text-sm text-[#808080] bg-[#FAFAFA]"
                                value={endDate}
                                onChange={e => setEndDate(e.target.value)}
                                min={startDate}
                            />
                        </div>

                    </div>

                    {/* ROW 3 – Time Range */}
                    <div className="flex gap-4 justify-center">

                        <div className="flex flex-col gap-1 w-48">
                            <label className="text-xs text-[#808080] font-medium">
                                Start Time
                            </label>
                            <input
                                type="time"
                                className="border border-[#D9D9D9] rounded-md px-3 py-2 text-sm text-[#808080] bg-[#FAFAFA]"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-1 w-48">
                            <label className="text-xs text-[#808080] font-medium">
                                End Time
                            </label>
                            <input
                                type="time"
                                className="border border-[#D9D9D9] rounded-md px-3 py-2 text-sm text-[#808080] bg-[#FAFAFA]"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                            />
                        </div>

                    </div>

                </div>


                {/* DATE PICKER: only show if both start and end date are set */}
                {startDate && endDate && (
                    <div className="bg-white rounded-md p-6">
                        <h2 className="text-sm font-medium mb-4">Select a Date</h2>
                        <div className="flex flex-wrap gap-4">
                            {(() => {
                                const start = new Date(startDate);
                                const end = new Date(endDate);
                                start.setDate(1);
                                end.setDate(1);
                                const months = [];
                                let d = new Date(start);
                                while (d <= end) {
                                    months.push(new Date(d));
                                    d.setMonth(d.getMonth() + 1);
                                }
                                return months.map((month, idx) => (
                                    <DayPicker
                                        key={month.toISOString()}
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={setSelectedDate}
                                        month={month}
                                        fromDate={new Date(startDate)}
                                        toDate={new Date(endDate)}
                                        modifiers={{
                                            available: availableDates,
                                        }}
                                        modifiersClassNames={{
                                            available:
                                                "bg-green-50 text-green-700 border border-green-300 rounded-md",
                                        }}
                                        className="mx-auto"
                                        showOutsideDays={false}
                                    />
                                ));
                            })()}
                        </div>
                    </div>
                )}

                {/* TIME SLOTS */}
                <div className="bg-white rounded-md p-6">
                    <h3 className="text-sm font-medium mb-4">
                        Available Time Slots for{" "}
                        <span className="font-semibold">
                            {selectedDate?.toDateString()}
                        </span>
                    </h3>

                    {!dayAvailability && (
                        <div className="text-gray-500 text-sm">
                            No available slots for this date.
                        </div>
                    )}

                    <div className="space-y-2">
                        {dayAvailability?.slots.map((slot, index) => (
                            <div
                                key={index}
                                className={`flex items-center justify-between rounded-md p-3 text-sm ${slot.status === "available"
                                        ? "bg-green-50 border border-green-200"
                                        : "bg-red-50 border border-red-200"
                                    } `}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="font-medium flex items-center gap-2"><IconClock size={16} />{slot.time}</span>
                                    <span className="text-gray-600 flex items-center gap-2"><IconPointFilled size={20} className="text-orange-500" /><IconUser size={16} />{slot.provider}</span>
                                </div>

                                <span
                                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${slot.status === "available"
                                            ? "bg-green-600 text-white"
                                            : "bg-red-600 text-white"
                                        }`}
                                >
                                    {slot.status === "available" ? (
                                        <IconCircleCheck size={14} className="bg-white/20 rounded-full " />
                                    ) : (
                                        <IconX size={14} className="bg-white/20 rounded-full " />
                                    )}
                                    {slot.status === "available" ? "Available" : "Booked"}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
