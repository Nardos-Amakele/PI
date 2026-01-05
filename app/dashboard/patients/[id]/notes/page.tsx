
import React from 'react'
import PatientsDetailsTabs from '../../../../components/navigation/PatientDetailsTabs';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { IconEdit, IconSearch } from '@tabler/icons-react';
import ProfileCard from '@/app/components/feature/ProfileCard';

const page = () => {
    return (
        <div className="w-full min-h-screen">
            {/* Banner */}
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
            {/* HEADER */}
            <div className="bg-white rounded-md p-4 mb-4">
                <div className="flex justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold">Shevchenko Daniel</h1>
                        <p className="text-sm text-gray-500">
                            Operational hub for PI case intake and scheduling                        </p>
                    </div>

                    <div className="flex ">
                        <button className="px-6 py-3 bg-primary-700 text-white  text-sm ml-4">
                            Edit
                        </button>
                    </div>
                </div>
                <div className='mb-2'>
                    <PatientsDetailsTabs />
                </div>

            </div>
            <div className='flex gap-4'>
                <div className='flex-1'>
                    <ProfileCard name={''}  />
                </div>
                <div className="mb-4 items-center justify-between flex-3 bg-white p-4">
                    <div className='flex justify-between mb-4'>
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-semibold">Notes</h2>
                            <span className="rounded-full bg-[#0F579033] px-2 py-0.5 text-xs font-medium text-primary-700">
                                8 Total
                            </span>
                        </div>

                        <div className="relative w-64">
                            <input
                                placeholder="Search..."
                                className="w-full rounded-full border px-4 py-2 pr-10 text-sm outline-none"
                            />

                            <IconSearch
                                size={18}
                                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 "
                            />
                        </div>
                    </div>

                    <div className="w-full overflow-hidden rounded-lg border">
                        <Table className="w-full table-fixed">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[55%] whitespace-normal wrap-break-word">
                                        Notes
                                    </TableHead>
                                    <TableHead className="w-[20%]">
                                        Uploaded By
                                    </TableHead>
                                    <TableHead className="w-[15%]">
                                        Upload Date
                                    </TableHead>
                                    <TableHead className="w-[10%] text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {[1, 2, 3, 4].map((item) => (
                                    <TableRow key={item}>
                                        <TableCell className="whitespace-normal break-words text-sm text-muted-foreground">
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                            Maecenas vehicula eu lectus porttitor cursus. Ut nisi libero,
                                            sollicitudin eget iaculis eu, facilisis ac nulla.
                                        </TableCell>

                                        <TableCell>
                                            <div className="text-sm font-medium">Azunyan Senpai</div>
                                            <div className="text-xs text-muted-foreground break-words">
                                                azunyan@gmail.com
                                            </div>
                                        </TableCell>

                                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                                            2025/18/16
                                        </TableCell>

                                        <TableCell className="text-right whitespace-nowrap">
                                            <button className="rounded-md p-2 hover:bg-gray-100">
                                                <IconEdit size={20} />
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>



            </div>
        </div>
    )
}

export default page

