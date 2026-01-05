'use client';
import { useState } from 'react'
import ProvidersDetailsTabs from '../../../../components/navigation/ProviderDetailsTabs';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { IconFileTypePdf, IconEye, IconTrash } from '@tabler/icons-react';

type Appointment = {
    id: number;
    name: string;
    code: string;
    time: string;
    duration: string;
    date: string;
    type: string;
    location: string;
    status: string;
    note?: string;
};
const page = () => {
    const [startTime, setStartTime] = useState("10:00");
    const [endTime, setEndTime] = useState("18:00");
    const [defaultDuration, setDefaultDuration] = useState("30");
    const [defaultAppointmentType, setAppointmentType] = useState("30");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    // Multiple weekday selection
    const [selectedDays, setSelectedDays] = useState<string[]>([]);

    const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    // Only one can be checked at a time
    const [checkedItem, setCheckedItem] = useState<number | null>(null);

    type CheckItem = {
        id: number;
        label: string;
    };

    const items: CheckItem[] = [
        { id: 1, label: "Freeze" },
        { id: 2, label: "Un Freeze" },
    ];

    const toggleCheck = (id: number) => {
        setCheckedItem((prev) => (prev === id ? null : id));
    };

    return (
        <div>
            <div className='bg-white mb-6'>
                <div className="flex items-center justify-between mb-6 mt-6 p-6 bg-white max-w-7xl mx-auto">
                    <div>
                        <h1 className="text-2xl font-semibold mb-1">Providers Directory</h1>
                        <p className="text-gray-500 text-sm"> Search, filter, and manage provider availability and booking preferences</p>
                    </div>
                    <button className="px-4 py-3 bg-primary-700 text-white rounded-sm">
                        <a href="/admin/add-provider">Add Provider</a>
                    </button>
                </div>
                <div className='pb-4'>
                    <ProvidersDetailsTabs />
                </div>
            </div>
            <div className=' bg-white'>
                <div className='  w-full p-6 gap-10 mx-auto mb-10'>
                    <div className='flex gap-10 '>
                        <div>
                            <label className="text-sm font-medium">Location</label>
                            <select
                                className="w-full border rounded-md px-2 py-1.5 mt-1 text-sm  bg-[#FAFAFA]"
                                value={defaultDuration}
                                onChange={(e) => setDefaultDuration(e.target.value)}
                            >
                                <option value="LA">LA</option>
                                <option value="Cali">Cali</option>
                                <option value="Ohio">Ohio</option>
                                <option value="Beverly Hills">Beverly Hills</option>

                            </select>
                        </div>
                        <div className="flex flex-col gap-1 w-48 mt-2">
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

                        <div className="flex flex-col gap-1 w-48 mt-2">
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
                        <div>
                            <label className="text-sm font-medium text-[#808080]">Start Time</label>
                            <input
                                type="time"
                                className="w-full border rounded-md px-2 py-1.5 mt-1 text-sm  bg-[#FAFAFA]"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-[#808080]">End Time</label>
                            <input
                                type="time"
                                className="w-full border rounded-md px-2 py-1.5 mt-1 text-sm  bg-[#FAFAFA]"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className='flex mt-4 gap-6'>
                        <div>
                            <label className="text-sm font-medium">Location</label>
                            <select
                                className="w-full border rounded-md px-2 py-1.5 mt-1 text-sm  bg-[#FAFAFA]"
                                value={defaultAppointmentType}
                                onChange={(e) => setAppointmentType(e.target.value)}
                            >
                                <option value="LA">Next Month</option>
                                <option value="Cali">Cali</option>
                                <option value="Ohio">Ohio</option>
                                <option value="Beverly Hills">Beverly Hills</option>

                            </select>
                        </div>
                        <div className=" mt-2">
                            {/* Label */}
                            <p className="text-xs text-gray-500 mb-2">Weekdays</p>

                            {/* Weekday buttons */}
                            <div className="flex justify-between gap-1">
                                {weekdays.map((day) => {
                                    const isSelected = selectedDays.includes(day);
                                    return (
                                        <div
                                            key={day}
                                            onClick={() => {
                                                setSelectedDays((prev) =>
                                                    isSelected
                                                        ? prev.filter((d) => d !== day)
                                                        : [...prev, day]
                                                );
                                            }}
                                            className={`flex-1 text-center text-sm py-1 px-2 rounded-lg border cursor-pointer ${isSelected ? "bg-[#0F57909E] text-white" : "bg-white text-gray-700"}  transition-colors duration-200 `}
                                        >
                                            {day}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full overflow-hidden rounded-lg border bg-white p-6 shadow-sm ">
                    <Table className="w-full table-fixed text-sm">
                        <TableHeader>
                            <TableRow className="bg-gray-50">
                                <TableHead >Patient Name</TableHead>
                                <TableHead >Appointment Time</TableHead>
                                <TableHead >Appointment Time</TableHead>
                                <TableHead >Appointment Type</TableHead>
                                <TableHead >Location</TableHead>
                                <TableHead >Status</TableHead>
                                <TableHead >Notes</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                                <TableRow key={item}>
                                    {/* Document Name */}
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="leading-tight">
                                                <p className="font-medium">Maz Steele</p>
                                                <p className="text-xs text-gray-500">#3B54G</p>
                                            </div>
                                        </div>
                                    </TableCell>

                                    {/* Category */}
                                    <TableCell >
                                        <div>
                                            <p className="text-gray-600">10:00 AM</p>
                                            <p >15 min</p>
                                        </div>
                                    </TableCell>

                                    {/* Type */}
                                    <TableCell className="text-gray-600">
                                        2024/01/20
                                    </TableCell>

                                    {/* Document Date */}
                                    <TableCell className="text-gray-600 whitespace-nowrap">
                                        Pain Management
                                    </TableCell>

                                    {/* Upload Date */}
                                    <TableCell className="text-gray-600 whitespace-nowrap">
                                        Location 1
                                    </TableCell>

                                    {/* Uploaded By */}
                                    <TableCell className='text-red-600'>
                                        Frozen
                                    </TableCell>

                                    {/* Actions */}
                                    <TableCell className="text-gray-600 whitespace-pre-line max-w-[180px] overflow-auto wrap-break-words" style={{ maxHeight: '3.5em' }}>
                                        Frozen: Doctor in surgery
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>


                </div>
                <div className="flex gap-10 mt-4 p-6">
                    <div className="flex gap-3">
                        <p className='mt-5'>Freeze Slots</p>
                        {items.map((item) => (
                            <label
                                key={item.id}
                                className="relative flex items-center  cursor-pointer rounded-sm px-1 py-1 select-none"
                                style={{ userSelect: 'none' }}
                            >
                                <input
                                    type="checkbox"
                                    checked={checkedItem === item.id}
                                    onChange={() => toggleCheck(item.id)}
                                    className="peer appearance-none w-6 h-6 border border-primary-700 rounded-sm checked:bg-primary-700 checked:border-primary-700 transition-colors duration-150 cursor-pointer"
                                    style={{ minWidth: '1.5rem', minHeight: '1.5rem' }}
                                />
                                <span className="absolute left-0 top-0 w-6 h-6 flex items-center justify-center pointer-events-none">
                                    {checkedItem === item.id && (
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </span>
                                <span className="ml-6 text-gray-700 text-base">{item.label}</span>
                            </label>
                        ))}
                    </div>
                    <div className="w-48">
                        <label className="text-sm font-medium">Freeze Reason</label>
                        <input
                            type="text"
                            className="w-full border rounded-md px-3 py-2 mt-1 text-sm bg-[#FAFAFA]"
                            // value={defaultAppointmentType}
                            // onChange={(e) => setAppointmentType(e.target.value)}
                            placeholder="Enter freeze reason"
                        />
                    </div>
                    <div className="w-48">
                        <label className="text-sm font-medium">Change Appointment Type</label>
                        <select
                            className="w-full border rounded-md px-3 py-2 mt-1 text-sm  bg-[#FAFAFA]"
                            value={defaultAppointmentType}
                            onChange={(e) => setAppointmentType(e.target.value)}
                        >
                            <option value="LA">Next Month</option>
                            <option value="Cali">Cali</option>
                            <option value="Ohio">Ohio</option>
                            <option value="Beverly Hills">Beverly Hills</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="flex justify-end mb-7 py-2 px-6 bg-white w-full pb-4 ">
                <button
                    type="submit"
                    // disabled={isLoading}
                    className="bg-primary-700 hover:bg-primary-800 rounded-sm text-white px-6 py-3 font-medium text-lg ml-4 disabled:opacity-50 disabled:cursor-not-allowed"
                > Change
                    {/* {isLoading ? "Saving..." : "Save"} */}
                </button>
                <button
                    type="button"
                    className="bg-[#8D1F1B] text-white px-6 py-3 rounded-sm shadow-sm ml-4"
                >
                    <a href="/admin/providers">Cancel</a>
                </button>
            </div>
        </div>
    )
}

export default page
