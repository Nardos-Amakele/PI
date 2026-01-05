'use client'
import React, { useMemo, useState } from 'react'
import { useParams } from 'next/navigation';
import PatientsDetailsTabs from '../../../../components/navigation/PatientDetailsTabs';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { IconAlertTriangle, IconEdit, IconSearch } from '@tabler/icons-react';
import ProfileCard from '@/app/components/feature/ProfileCard';
import EditAlertModal from '@/app/components/ui/EditAlertModal';
import { useGetPatientAlertsQuery, useGetPatientByIdQuery } from '@/app/services/patients/patientsApi';

const page = () => {
    const params = useParams();
    const patientId = (params?.id as string) || '';
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAlertIndex, setSelectedAlertIndex] = useState<number | null>(null);

    const { data: alertsData, isLoading: isAlertsLoading, isError: isAlertsError } = useGetPatientAlertsQuery(patientId, {
        skip: !patientId,
    });

    const { data: patientData, isLoading: isPatientLoading, isError: isPatientError } = useGetPatientByIdQuery(patientId, {
        skip: !patientId,
    });

    const patient = patientData?.data;
    const addressObj = patient && typeof patient.address === "object" && patient.address !== null ? (patient.address as any) : undefined;
    const languagesArr = patient?.languages && Array.isArray(patient.languages) ? patient.languages : [];

    const alerts = useMemo(() => alertsData?.data?.alerts || [], [alertsData]);
    const notes = useMemo(() => {
        const raw = patientData?.data?.notes;
        if (!raw) return [] as Array<{ text: string; uploadedBy?: string; createdAt?: string; uploadedDate?: string }>;
        if (Array.isArray(raw) && raw.length > 0 && typeof raw[0] === "string") {
            return raw.map((text) => ({
                text,
                uploadedBy: "Unknown",
                createdAt: patientData?.data?.createdAt,
            }));
        }
        return raw as Array<{ text: string; uploadedBy?: string; createdAt?: string; uploadedDate?: string }>;
    }, [patientData]);

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
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-semibold flex gap-1 items-center">
                            {patient ? `${patient.firstName || ""} ${patient.lastName || ""}`.trim() || "Patient" : "Patient"}
                            <IconAlertTriangle size={20} className='text-[#97150D] text-center items-center font-bold' />
                        </h1>
                        <p className="text-sm text-gray-500">Operational hub for PI case intake and scheduling</p>
                    </div>

                    <div className="flex ">
                        <button className="px-10 py-2 bg-primary-700 text-white  text-md ml-4">
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
                    <ProfileCard
                        name={patient ? `${patient.firstName || ""} ${patient.lastName || ""}`.trim() || "Patient" : "Patient"}
                        phone={addressObj?.phoneNumber}
                        address={addressObj?.officeAddress}
                        languages={languagesArr}
                    />
                </div>
                <div className="mb-4 items-center justify-between flex-3 bg-white p-4">
                    <div className='flex justify-between mb-4'>
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-semibold">Alerts</h2>
                            <span className="rounded-full bg-[#F0946F33] px-2 py-0.5 text-xs font-medium text-[#97150D]">
                                {alerts.length} Total
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
                                        Alerts
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
                                {isAlertsLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-6">Loading alerts...</TableCell>
                                    </TableRow>
                                ) : isAlertsError ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-6 text-red-600">Failed to load alerts.</TableCell>
                                    </TableRow>
                                ) : alerts.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">No alerts found.</TableCell>
                                    </TableRow>
                                ) : (
                                    alerts.map((alert, idx) => (
                                        <TableRow key={`${alert.uploadedDate}-${idx}`}>
                                            <TableCell className="whitespace-normal wrap-break-word text-sm font-bold text-[#97150D]">
                                                {alert.text}
                                            </TableCell>

                                            <TableCell>
                                                <div className="text-sm font-medium">{alert.uploadedBy}</div>
                                            </TableCell>

                                            <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                                                {new Date(alert.uploadedDate).toLocaleDateString()}
                                            </TableCell>

                                            <TableCell className="text-right whitespace-nowrap">
                                                <button
                                                    className="rounded-md p-2 hover:bg-gray-100"
                                                    onClick={() => {
                                                        setSelectedAlertIndex(idx);
                                                        setIsModalOpen(true);
                                                    }}
                                                >
                                                    <IconEdit size={20} />
                                                </button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>



            </div>
            <div className="mb-4 items-center justify-between flex-3 bg-white p-4">
                <div className='flex justify-between mb-4'>
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold">Notes</h2>
                        <span className="rounded-full bg-[#0F579033] px-2 py-0.5 text-xs font-medium text-primary-700">
                            {notes.length} Total
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
                            {isPatientLoading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-6">Loading notes...</TableCell>
                                </TableRow>
                            ) : isPatientError ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-6 text-red-600">Failed to load notes.</TableCell>
                                </TableRow>
                            ) : notes.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">No notes found.</TableCell>
                                </TableRow>
                            ) : (
                                notes.map((note, idx) => {
                                    const noteText = typeof note === "string"
                                        ? note
                                        : String((note as any)?.text ?? "");
                                    const noteBy = typeof note === "string" ? "Unknown" : note.uploadedBy || "Unknown";
                                    const dateSource = typeof note === "string"
                                        ? patientData?.data?.createdAt
                                        : note.createdAt || patientData?.data?.createdAt;
                                    const displayDate = dateSource ? new Date(dateSource).toLocaleDateString() : "—";

                                    return (
                                        <TableRow key={`${dateSource || idx}-${idx}`}>
                                            <TableCell className="whitespace-normal wrap-break-word text-sm text-muted-foreground">
                                                {noteText || "No note text"}
                                            </TableCell>

                                            <TableCell>
                                                <div className="text-sm font-medium">{noteBy}</div>
                                            </TableCell>

                                            <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                                                {displayDate}
                                            </TableCell>

                                            <TableCell className="text-right whitespace-nowrap">
                                                <button className="rounded-md p-2 hover:bg-gray-100">
                                                    <IconEdit size={20} />
                                                </button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Alert modal rendered once */}
            <EditAlertModal
                open={isModalOpen}
                patientId={patientId}
                selectedIndex={selectedAlertIndex ?? 0}
                onClose={() => setIsModalOpen(false)}
                onUpdate={() => {
                    console.log("Saved document:");
                    setIsModalOpen(false);
                }}
            />
        </div>
    )
}

export default page