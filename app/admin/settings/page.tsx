"use client";

import { useState } from "react";
import { IconClock } from "@tabler/icons-react";

export default function SystemSettingsPage() {
    // Business Hours State
    const [startTime, setStartTime] = useState("10:00");
    const [endTime, setEndTime] = useState("18:00");
    const [breakStart, setBreakStart] = useState("12:00");
    const [breakEnd, setBreakEnd] = useState("13:00");

    // Appointment Defaults State
    const [defaultDuration, setDefaultDuration] = useState("30");
    const [timeSlotInterval, setTimeSlotInterval] = useState("15");
    const [timezone, setTimezone] = useState("America/Los_Angeles");

    return (
        <div className="pt-3 bg-[#F6F8FC] min-h-screen">

            {/* Page Header */}
            <div className="bg-white rounded-xl p-4 text-center shadow-sm mb-6">
                <h1 className="text-3xl font-semibold">System Settings</h1>
                <p className="text-gray-500 mt-1">
                    Configure EMR wide scheduling defaults
                </p>
            </div>

            {/* GRID LAYOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                {/* -------- BUSINESS HOURS -------- */}
                <div className="bg-white p-8 rounded-xl shadow-sm">
                    <h2 className="text-xl font-semibold mb-1">Business Hours</h2>
                    <p className="text-gray-500 mb-6">
                        Default operating hours for scheduling
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium">Start Time</label>
                            <input
                                type="time"
                                className="w-full border rounded-md px-2 py-1.5 mt-1 text-sm"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">End Time</label>
                            <input
                                type="time"
                                className="w-full border rounded-md px-2 py-1.5 mt-1 text-sm"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">Break Start</label>
                            <input
                                type="time"
                                className="w-full border rounded-md px-2 py-1.5 mt-1 text-sm"
                                value={breakStart}
                                onChange={(e) => setBreakStart(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">Break End</label>
                            <input
                                type="time"
                                className="w-full border rounded-md px-2 py-1.5 mt-1 text-sm"
                                value={breakEnd}
                                onChange={(e) => setBreakEnd(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* -------- APPOINTMENT DEFAULTS -------- */}
                <div className="bg-white p-8 rounded-xl shadow-sm">
                    <h2 className="text-xl font-semibold mb-1">Appointment Defaults</h2>
                    <p className="text-gray-500 mb-6">
                        Default settings for new appointments
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium">Default Duration</label>
                            <select
                                className="w-full border rounded-md px-2 py-1.5 mt-1 text-sm"
                                value={defaultDuration}
                                onChange={(e) => setDefaultDuration(e.target.value)}
                            >
                                <option value="15">15 Min</option>
                                <option value="30">30 Min</option>
                                <option value="45">45 Min</option>
                                <option value="60">60 Min</option>
                                <option value="90">90 Min</option>
                                <option value="120">120 Min</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-medium">Time slot intervals</label>
                            <select
                                className="w-full border rounded-md px-2 py-1.5 mt-1 text-sm"
                                value={timeSlotInterval}
                                onChange={(e) => setTimeSlotInterval(e.target.value)}
                            >
                                <option value="5">5 Min</option>
                                <option value="10">10 Min</option>
                                <option value="15">15 Min</option>
                                <option value="20">20 Min</option>
                                <option value="30">30 Min</option>
                            </select>
                        </div>

                        <div className="col-span-2">
                            <label className="text-sm font-medium">Default Time Zone</label>
                            <select
                                className="w-full border rounded-md px-2 py-1.5 mt-1 text-sm"
                                value={timezone}
                                onChange={(e) => setTimezone(e.target.value)}
                            >
                                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                                <option value="America/Denver">Mountain Time (MT)</option>
                                <option value="America/Chicago">Central Time (CT)</option>
                                <option value="America/New_York">Eastern Time (ET)</option>
                                <option value="Europe/London">London (GMT)</option>
                                <option value="Europe/Paris">Central European Time (CET)</option>
                                <option value="Asia/Tokyo">Japan Time (JST)</option>
                                <option value="UTC">UTC</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* -------- BOOKING OPTIONS -------- */}
                <div className="bg-white p-8 rounded-xl shadow-sm lg:col-span-2">
                    <h2 className="text-xl font-semibold mb-1">Booking Options</h2>
                    <p className="text-gray-500">Control Scheduling Behavior</p>

                    <div className="mt-6 h-40 rounded-xl border border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                        {/* Placeholder */}
                        (Options coming soon)
                    </div>
                </div>

            </div>
        </div>
    );
}
