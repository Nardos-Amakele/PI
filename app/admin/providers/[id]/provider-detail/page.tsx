import React from 'react'
import ProvidersDetailsTabs from '../../../../components/navigation/ProviderDetailsTabs';
import { IconEdit, IconFilter, IconInfoCircle, IconPhone, IconPointFilled, IconSearch, IconSelector, IconUser } from '@tabler/icons-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Image from 'next/image';
function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex gap-2 items-center text-center justify-center">
            <span className=" text-gray-500">{label}:</span>
            <span className="font-medium text-gray-800">{value}</span>
        </div>
    );
}
const page = () => {
    return (
        <div>
            <div className='bg-white'>
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
            <div className='bg-white flex gap-4'>
                <div className='flex-[2.1]'>
                    <div className='border-2 rounded-md border-gray-200 p-4 bg-white '>
                        {/* Top row */}
                        <div className='flex justify-between'>
                            <div className="mb-4 flex items-center justify-between">
                                <span className="rounded-full bg-[#3756C233] px-3 py-1 text-xs font-medium text-blue-700 flex">
                                    <IconPointFilled size={14} />
                                    Scheduled
                                </span>
                                <button className="text-gray-400 hover:text-gray-600">⋮</button>
                            </div>
                            <div><IconEdit size={24} /></div>
                        </div>
                        <div className='flex gap-6 '>
                            <div className="w-[320px] shrink-0 rounded-xl border bg-white p-5 shadow-sm">


                                {/* Avatar */}
                                <div className="mb-4 flex flex-col items-center text-center">
                                    <div className="mb-2 h-20 w-20 overflow-hidden rounded-full border">
                                        <img
                                            src="/avatar.png"
                                            alt="Profile"
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <h3 className="text-base font-semibold">Dr. Emily Smith</h3>
                                </div>

                                {/* Info */}
                                <div className="space-y-2 text-sm">
                                    <InfoRow label="npi" value="11/18/1975" />
                                    <InfoRow label="taxonomy" value="424-224-2759" />
                                    <InfoRow label="email" value="829 Morris PL, Montbello CA" />
                                    <InfoRow label="specialty" value="Orthopedics" />
                                </div>
                                <div className="flex justify-center">
                                    <IconPhone size={48} className="mt-4 mr-2 p-4 text-gray-500 border rounded-full" />
                                    <IconInfoCircle size={48} className="mt-4 mr-2 p-4 text-gray-500 border rounded-full" />
                                    <IconUser size={48} className="mt-4 mr-2 p-4 text-gray-500 border rounded-full" />
                                </div>

                            </div>
                            <div className='justify-center items-center text-center mt-6'>
                                <p className='text-lg font-semibold justify-center mb-6 '>CLINICAL AND SURGICAL LOCATION</p>
                                <div className='flex space-y-2 gap-8'>
                                    <div>
                                        <div className="flex items-start mb-4">
                                            <div className="w-2 bg-primary-700  mr-2 h-14 rounded-r-2xl mr-2"></div> {/* vertical line */}
                                            <p className="text-primary-700 bg-[#E2D4FF4D] p-4 w-45">
                                                Clinical
                                            </p>
                                        </div>


                                        <div className='flex flex-col gap-4'>
                                            <p> Location 1</p>
                                            <p> Location 2</p>
                                            <p>Location 3</p>
                                        </div>

                                    </div>
                                    <div className="w-1 bg-gray-50  mr-2 h-50"></div> {/* vertical line */}

                                    <div>
                                        <div className="flex items-start mb-4">
                                            <div className="w-2 bg-primary-700  mr-2 h-14 rounded-r-2xl mr-2"></div> {/* vertical line */}
                                            <p className="text-primary-700 bg-[#E2D4FF4D] p-4 w-45">
                                                Surgical
                                            </p>
                                        </div>


                                        <div className='flex flex-col gap-4'>
                                            <p> Location 1</p>
                                            <p> Location 2</p>
                                            <p>Location 3</p>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className=" shadow-sm border rounded-xl p-6">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <h2 className="text-lg font-semibold text-[#1E293B]">
                                    Upcoming Appointment
                                </h2>
                                <span className="text-sm px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                                    81 Total
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                {/* Search Button */}
                                <button
                                    type="button"
                                    className="h-10 w-10 flex items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-gray-100 transition"
                                >
                                    <IconSearch size={18} />
                                </button>

                                {/* Filter Button */}
                                <button
                                    type="button"
                                    className="h-10 px-4 flex items-center gap-2 rounded-full bg-primary-700 text-white hover:bg-primary-700/90 transition"
                                >
                                    <IconFilter size={18} />
                                    Filter
                                </button>
                            </div>
                        </div>


                        {/* Table */}
                        <div className=" rounded-lg overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="">
                                        {[
                                            "Patient Name",
                                            "Appointment Time",
                                            "Appointment Date",
                                            "Appointment Type",
                                        ].map((head) => (
                                            <TableHead key={head} className="text-[#334155] font-medium">
                                                <div className="flex items-center gap-1">
                                                    {head}
                                                    <IconSelector size={14} />
                                                </div>
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {[
                                        {
                                            name: "Max Steele",
                                            time: "10:00 AM",
                                            duration: "15 Min",
                                            date: "2024/01/20",
                                            type: "Pain Management",
                                        },
                                        {
                                            name: "Ryan Chase",
                                            time: "10:15 AM",
                                            duration: "30 Min",
                                            date: "2024/02/14",
                                            type: "Injection",
                                        },
                                        {
                                            name: "Kira Moon",
                                            time: "10:45 AM",
                                            duration: "45 Min",
                                            date: "2024/03/01",
                                            type: "Any 15",
                                        },
                                    ].map((row, i) => (
                                        <TableRow key={i} className="border-b border-[#D1D5DB]">
                                            {/* Patient */}
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Image
                                                        src="/avatar.png"
                                                        alt="avatar"
                                                        width={36}
                                                        height={36}
                                                        className="rounded-full"
                                                    />
                                                    <div>
                                                        <p className="font-medium text-[#1E293B]">{row.name}</p>
                                                        <p className="text-sm text-[#64748B]">#20354</p>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            {/* Time */}
                                            <TableCell>
                                                <p className="text-[#1E293B]">{row.time}</p>
                                                <p className="text-sm text-[#64748B]">{row.duration}</p>
                                            </TableCell>

                                            {/* Date */}
                                            <TableCell className="text-[#334155]">
                                                {row.date}
                                            </TableCell>

                                            {/* Type */}
                                            <TableCell className="text-[#334155]">
                                                {row.type}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
                <div className=" rounded-xl p-6 space-y-6 flex-2">
                    {/* Section Header */}
                    <hr className='border' />

                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-base font-semibold text-[#1E293B]">Signature</h2>
                            <p className="text-sm text-[#64748B]">
                                Add any files or notes if necessary
                            </p>
                        </div>

                        <button
                            type="button"
                            className="w-8 h-8 flex items-center justify-center rounded-md bg-[#0F3D68] text-white"
                        >
                            −
                        </button>
                    </div>

                    {/* Signature Uploaded */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-[#1E293B]">Signature</span>
                            <button className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>

                        <div className="border border-dashed border-blue-300 rounded-lg p-4 bg-white">
                            <img
                                src="/mock-signature.png" // mock image
                                alt="Signature"
                                className="max-h-32 mx-auto object-contain"
                            />
                        </div>
                    </div>

                    {/* Header Not Uploaded */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-[#1E293B]">Header</span>
                            <button className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>

                        <div className="border border-dashed border-blue-300 rounded-lg p-6 bg-[#EAF1F8] text-center">
                            <div className="flex flex-col items-center gap-2">
                                <svg
                                    width="40"
                                    height="40"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    className="text-blue-500"
                                >
                                    <path
                                        d="M12 16V8M8 12l4-4 4 4"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M4 16a4 4 0 014-4h.4A6 6 0 1120 14"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                </svg>

                                <p className="font-semibold text-[#1E293B]">Not Uploaded</p>
                                <button className="text-blue-600 text-sm font-medium">
                                    Upload Header
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Footer Not Uploaded */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-[#1E293B]">Footer</span>
                            <button className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>

                        <div className="border border-dashed border-blue-300 rounded-lg p-6 bg-[#EAF1F8] text-center">
                            <div className="flex flex-col items-center gap-2">
                                <svg
                                    width="40"
                                    height="40"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    className="text-blue-500"
                                >
                                    <path
                                        d="M12 16V8M8 12l4-4 4 4"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M4 16a4 4 0 014-4h.4A6 6 0 1120 14"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                </svg>

                                <p className="font-semibold text-[#1E293B]">Not Uploaded</p>
                                <button className="text-blue-600 text-sm font-medium">
                                    Upload Footer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default page
