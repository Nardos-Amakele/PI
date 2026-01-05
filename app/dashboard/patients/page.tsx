"use client";

import { ReactNode, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Toggle from "@/app/components/ui/Toggle";
import {
    IconArrowDown,
    IconCircleCheckFilled,
    IconCircleXFilled,
    IconDotsVertical,
    IconFilter2,
    IconPhone,
    IconPointFilled,
    IconSearch,
    IconWorld,
    IconCalendarEvent,
} from "@tabler/icons-react";
import { useGetPatientsQuery } from "@/app/services/patients/patientsApi";
import { useGetCasesByPatientQuery } from "@/app/services/cases/casesApi";
import FilterBlock from "../../components/feature/DashboardFilter";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function DashboardPage() {
    const router = useRouter();
    const [showFilters, setShowFilters] = useState(false);
    const [appliedFilters, setAppliedFilters] = useState<any>(null);
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data, isLoading, isError } = useGetPatientsQuery({ page, limit });

    const handleApplyFilters = (filters: any) => {
        setAppliedFilters(filters);
        setShowFilters(false);
        console.log("APPLIED FILTERS:", filters);
    };

    // Map backend patients into table rows with removable defaults
    const patients = useMemo(() => {
        const list = data?.data?.patients || [];
        return list.map((patient: {
            id: string;
            firstName?: string | null;
            middleName?: string | null;
            lastName?: string | null;
            dateOfBirth?: string | null;
            createdAt?: string | null;
            referralSource?: string | null;
            initialReferralSpecialty?: string | null;
            languages?: string | string[] | null;
            address?: string | null;
            phone?: string | null;
            caseManagerPhone?: string | null;
        }, idx: number) => {
            const nameParts = [patient.firstName, patient.middleName, patient.lastName].filter(Boolean);
            const fullName = nameParts.length ? nameParts.join(" ") : "Unknown Patient";
            const dob = patient.dateOfBirth || "—";
            const injuryDate = patient.createdAt ? patient.createdAt.split("T")[0] : "—";

            return {
                id: patient.id || String(idx + 1),
                patientName: fullName,
                dateOfBirth: dob,
                dateOfInjury: injuryDate,
                lawOffice: patient.referralSource || "Unknown Law Office",
                caseManager: patient.initialReferralSpecialty || "Unknown Case Manager",
                injuredParts: [] as string[],
                imageUploaded: false,
                phone: patient.phone || "(555) 000-0000",
                caseManagerPhone: patient.caseManagerPhone || "(555) 111-2222",
                address: patient.address || "Address not provided",
                languages: patient.languages || "Spanish",
            };
        });
    }, [data]);

    const totalPages = data?.data?.pagination?.totalPages || 1;

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };


    return (
        <div>
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



            {/* Referrals list header */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
                <div className="flex justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Patients</h2>
                        <p className="text-sm text-gray-500">View PI patinets and manage their schedules.</p>
                    </div>

                    <div className="flex items-center gap-3 relative">
                        {/* Filter Button */}
                        <button
                            className="px-4 py-2 flex gap-1 border rounded-md bg-white text-sm"
                            onClick={() => setShowFilters(prev => !prev)}
                        >
                            <span><IconFilter2 /></span>Filters
                        </button>

                        {/* Wider FilterBlock dropdown BELOW & LEFT-ALIGNED to button */}
                        {showFilters && (
                            <div className="absolute right-0 top-full mt-2 z-999 w-[700px]">
                                <FilterBlock onApply={handleApplyFilters} />
                            </div>
                        )}

                        <button className="px-4 py-2 bg-primary-700 text-white rounded-md">
                            <a href="/dashboard/add-patient">Add Patient</a>
                        </button>
                    </div>


                </div>

                <div className="mt-4 border border-gray-400 rounded-xl p-3 flex items-center gap-3 relative">
                    <input className="flex-1 border-0 outline-none" placeholder="Search" />
                    <div className="text-sm text-gray-400"><IconSearch /></div>

                </div>
            </div>

            {/* Grid of referral cards */}
            <div className="w-full bg-white p-6 overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="h-16">
                            <TableHead>
                                <div className="flex items-center gap-1 text-table-text">
                                    Patient Name <IconArrowDown size={14} />
                                </div>
                            </TableHead>
                            <TableHead>
                                <div className="flex items-center gap-1 text-table-text">
                                    DOL <IconArrowDown size={14} />
                                </div>
                            </TableHead>
                            <TableHead>
                                <div className="flex items-center gap-1 text-table-text">
                                    Law Office & Case Manager <IconArrowDown size={14} />
                                </div>
                            </TableHead>
                            <TableHead>
                                <div className="flex items-center gap-1 text-table-text">
                                    Injured Body Part<IconArrowDown size={14} />
                                </div>
                            </TableHead>
                            <TableHead>
                                <div className="flex items-center gap-1 text-table-text">
                                    Lein <IconArrowDown size={14} />
                                </div>
                            </TableHead>
                            <TableHead>
                                <div className="flex items-center gap-1 text-table-text">
                                    Imaging Status <IconArrowDown size={14} />
                                </div>
                            </TableHead>
                            <TableHead>Outside Records</TableHead>
                            <TableHead>Workflow Status</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={9} className="text-center py-8">
                                    Loading patients...
                                </TableCell>
                            </TableRow>
                        ) : isError ? (
                            <TableRow>
                                <TableCell colSpan={9} className="text-center py-8 text-red-500">
                                    Failed to load patients. Please try again.
                                </TableCell>
                            </TableRow>
                        ) : patients.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={9} className="text-center py-8">
                                    No patients found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            patients.map((patient) => (
                                <PatientRow
                                    key={patient.id}
                                    patient={patient}
                                    onSelect={() => router.push(`/dashboard/patients/${patient.id}/details`)}
                                />
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>



            <div className="pt-6">
                <div className="flex justify-center">
                    <div className="inline-flex items-center gap-2 bg-white shadow-sm py-2 px-6 rounded-xl">
                        <button
                            onClick={() => handlePageChange(1)}
                            disabled={page === 1}
                            className="px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            ≪
                        </button>
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                            className="px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            ‹
                        </button>

                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                                pageNum = i + 1;
                            } else if (page <= 3) {
                                pageNum = i + 1;
                            } else if (page >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                            } else {
                                pageNum = page - 2 + i;
                            }
                            return (
                                <Toggle
                                    key={pageNum}
                                    label={pageNum.toString()}
                                    active={page === pageNum}
                                    onClick={() => handlePageChange(pageNum)}
                                />
                            );
                        })}

                        <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === totalPages}
                            className="px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            ›
                        </button>
                        <button
                            onClick={() => handlePageChange(totalPages)}
                            disabled={page === totalPages}
                            className="px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            ≫
                        </button>
                    </div>
                </div>
            </div>


        </div>
    );
}

type PatientRowData = {
    id: string;
    patientName: string;
    dateOfBirth: string;
    dateOfInjury: string;
    lawOffice: string;
    caseManager: string;
    injuredParts: string[];
    imageUploaded: boolean;
    phone?: string;
    caseManagerPhone?: string;
    languages?: string | string[];
};

function PatientRow({ patient, onSelect }: { patient: PatientRowData; onSelect: () => void; }) {
    const { data: caseData, isLoading: caseLoading } = useGetCasesByPatientQuery(patient.id, {
        skip: !patient.id,
    });

    const cases = caseData?.data?.cases || [];
    const firstCase = cases[0];
    const lawOffice = firstCase?.lawOffice?.name || patient.lawOffice;
    const caseManagerName = firstCase?.caseManager?.name || patient.caseManager;
    const caseManagerPhone = firstCase?.caseManager?.phone || patient.caseManagerPhone || "(555) 111-2222";
    const injuredPartsFromCases = cases.flatMap((c) => c.bodyPartsInjured || []);
    const injuredParts = injuredPartsFromCases.length ? injuredPartsFromCases : patient.injuredParts;
    const dateOfInjury = firstCase?.dateOfLoss || patient.dateOfInjury;

    return (
        <TableRow
            className="text-table-text cursor-pointer hover:bg-gray-50"
            onClick={() => onSelect()}
        >
            <TableCell className="font-medium text-black">
                <div className="flex flex-col gap-1">
                    <span className="font-medium">{patient.patientName}</span>
                    <span className="flex items-center gap-1 text-sm text-gray-500 font-bold"><IconCalendarEvent size={14} />{patient.dateOfBirth}</span>
                    <span className="text-sm text-gray-500 font-medium flex items-center gap-1"><IconWorld size={14} />{patient.languages}</span>
                    <span className="text-sm text-gray-500 font-bold flex items-center gap-1"><IconPhone size={14} />{patient.phone}</span>
                </div>
            </TableCell>
            <TableCell>
                <span className="flex gap-1">{dateOfInjury}<p className="text-green-700"> A</p></span>
                <span className="flex gap-1">{dateOfInjury}<p className="text-red-700"> C</p></span>
                <span className="flex gap-1">{dateOfInjury}<p className="text-blue-700"> S</p></span>
            </TableCell>
            <TableCell>
                <div className="flex flex-col gap-1">
                    <span className="font-bold">{lawOffice}</span>
                    <span className="text-sm text-muted-foreground">{caseManagerName}</span>
                    <span className="text-sm text-gray-500 font-medium">phone:{caseManagerPhone}</span>
                </div>
            </TableCell>
            <TableCell>{caseLoading ? "Loading..." : injuredParts?.length > 0 ? injuredParts.join(", ") : "Not provided"}</TableCell>
            <TableCell>
                <div className="flex items-center gap-2">
                    {injuredParts && injuredParts.length > 0 ? (
                        <IconCircleCheckFilled size={20} className="text-green-600" />
                    ) : (
                        <IconCircleXFilled size={20} className="text-red-600" />
                    )}
                </div>
            </TableCell>
            <TableCell>
                <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${patient.imageUploaded
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                        }`}
                >
                    <span
                        className={`h-2 w-2 rounded-full ${patient.imageUploaded ? "bg-green-600" : "bg-red-600"}`}
                    />
                    {patient.imageUploaded ? "Uploaded" : "No prior imaging"}
                </span>
            </TableCell>
            <TableCell>
                <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium  ${patient.imageUploaded
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-[#1B1F26B8]"
                        }`}
                >
                    <span
                        className={`h-2 w-2 rounded-full ${patient.imageUploaded ? "bg-green-600" : "bg-[#7561613D]"}`}
                    />
                    {patient.imageUploaded ? "Uploaded" : "none"}
                </span>
            </TableCell>
            <TableCell><p>Initial consult</p><p>scheduled</p></TableCell>
            <TableCell>
                <button className="p-1">
                    <IconDotsVertical size={18} />
                </button>
            </TableCell>
        </TableRow>
    );
}
