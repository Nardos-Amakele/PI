'use client'
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useMemo, useState } from "react";
import Toggle from "@/app/components/ui/Toggle";
import { IconArrowDown, IconDotsVertical, IconPointFilled, IconSearch, IconFilter2, IconEdit, IconTrash, IconPlus, IconCalendarEvent, IconPhone, IconWorld, IconCircleCheckFilled, IconCircleXFilled } from "@tabler/icons-react";
import FilterBlock from "../components/feature/DashboardFilter";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useGetReferralsQuery } from "../services/referrals/referralsApi";
import DeleteModal from "../components/ui/DeleteModal";
import { Referral } from "../services/referrals/referralsTypes";
import { useCreatePatientMutation } from "../services/patients/patientsApi";

export default function DashboardPage() {
    const [onlyNew, setOnlyNew] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [appliedFilters, setAppliedFilters] = useState<any>(null);
    const [openMenu, setOpenMenu] = useState<any>(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedId, setSelectedId] = useState<any>(null);
    const { data, isLoading, error } = useGetReferralsQuery({ page: 1, limit: 10 });
    const [createPatient, { isLoading: isCreatingPatient }] =
        useCreatePatientMutation();

    const handleApplyFilters = (filters: any) => {
        setAppliedFilters(filters);
        setShowFilters(false);
        console.log("APPLIED FILTERS:", filters);
    };


    // Map API response to table-friendly data
    const filtered = useMemo(() => {
        if (!data?.data?.referrals) return [];

        return data.data.referrals.map((ref: Referral) => ({
            id: ref.id,
            patientName: ref.patientName || "Missing",
            dateOfBirth: ref.dateOfBirth || "Missing",
            dateOfInjury: ref.dateOfInjury || "Missing",
            lawOffice: ref.lawOfficeName || "Missing",
            caseManager: ref.caseManager || "Missing",
            injuredParts: ref.bodyPartInjured || "Missing",
            imageUploaded: ref.attachments?.length > 0 || false,
            phone: ref.phone || "Missing",
            caseManagerPhone: ref.caseManagerPhone || "Missing",
            referral: ref,

        }));
    }, [data]);
    const mapReferralToPatient = (referral: Referral) => {
        return {
            specialtyOrService: referral.specialtyOrService || "General Consultation",

            patientName: referral.patientName || "Unknown Patient",

            dateOfBirth: referral.dateOfBirth || "1990-01-01",

            address: referral.address || "Not provided",

            phone: referral.phone || "0000000000",

            email: referral.email || `patient-${referral.id}@example.com`,

            caseInformation:
                referral.caseInformation ||
                "Auto-created from referral",

            dateOfInjury: referral.dateOfInjury || "2024-01-01",

            // MUST be a STRING
            bodyPartInjured: Array.isArray(referral.bodyPartInjured)
                ? referral.bodyPartInjured[0]
                : referral.bodyPartInjured || "Unknown",

            lawOfficeName: referral.lawOfficeName || "Unknown Law Office",

            lawOfficeAddress: referral.lawOfficeAddress || "Not provided",

            caseManager: referral.caseManager || "Unknown Case Manager",

            caseManagerEmail:
                referral.caseManagerEmail ||
                `casemanager-${referral.id}@example.com`,

            caseManagerPhone:
                referral.caseManagerPhone || "0000000000",
        };
    };


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!openMenu) return;

            const target = event.target as HTMLElement | null;
            if (!target) return;

            const insideMenu = target.closest(`[data-menu="${openMenu}"]`);
            const onButton = target.closest(`[data-menu-button="${openMenu}"]`);

            if (!insideMenu && !onButton) {
                setOpenMenu(null);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [openMenu]);


    return (
        <div>
            {/* Banner */}
            <div className="relative rounded-lg overflow-hidden mb-6">
                <img src="images/Welcome.jpg" alt="banner" className="w-full h-36 object-cover" />
                <div className="absolute inset-0 bg-[#113A5CB2]"></div>
                <div className="absolute inset-0 flex items-center px-6">
                    <div className="flex-1">
                        <h1 className="text-3xl text-white font-bold">Welcome To PI</h1>
                        <p className="text-sm text-white/80 mt-1">
                            Your centralized workspace for referrals, cases, and provider activity
                        </p>
                    </div>
                    <img src="images/LawyerBar.png" alt="banner" className="w-20 h-20 object-cover" />
                </div>
            </div>

            {/* Referrals list header */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
                <div className="flex justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Referrals</h2>
                        <p className="text-sm text-gray-500">Manage incoming patient referrals and convert to active cases</p>
                    </div>

                    <div className="flex items-center gap-3 relative">
                        <button
                            className="px-4 py-2 flex gap-1 border rounded-md bg-white text-sm"
                            onClick={() => setShowFilters(prev => !prev)}
                        >
                            <span><IconFilter2 /></span>Filters
                        </button>

                        {showFilters && (
                            <div className="absolute right-0 top-full mt-2 z-50 w-[700px]">
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

            {/* Table */}
            <div className="w-full bg-white p-6 overflow-x-auto">
                {/* Loading State */}
                {isLoading && (
                    <div className="text-center py-8">
                        <p className="text-gray-500">Loading referrals...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="text-center py-8">
                        <p className="text-red-500">Failed to load referrals. Please try again.</p>
                    </div>
                )}

                {/* Table Content */}
                {!isLoading && !error && (
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
                            {filtered.map((ref: {
                                caseManagerPhone: ReactNode;
                                phone: ReactNode;
                                referral: Referral; id: Key | null | undefined; patientName: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; dateOfBirth: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; dateOfInjury: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; lawOffice: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; caseManager: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; injuredParts: any[]; imageUploaded: any;
                            }) => (
                                <TableRow className="text-table-text" key={ref.id}>
                                    <TableCell className="font-medium text-black">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-medium">{ref.patientName}</span>
                                            <span className="flex items-center gap-1 text-sm text-gray-500 font-bold"><IconCalendarEvent size={14} />{ref.dateOfBirth}</span>
                                            <span className="text-sm text-gray-500 font-medium flex items-center gap-1"><IconWorld size={14} />Spanish</span>
                                            <span className="text-sm text-gray-500 font-bold flex items-center gap-1"><IconPhone size={14} />{ref.phone}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="flex gap-1">{ref.dateOfInjury}<p className="text-green-700"> A</p></span>
                                        <span className="flex gap-1">{ref.dateOfInjury}<p className="text-red-700"> C</p></span >
                                        <span className="flex gap-1">{ref.dateOfInjury}<p className="text-blue-700"> S</p></span >
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            <span className="font-bold">{ref.lawOffice}</span>
                                            <span className="text-sm text-muted-foreground">{ref.caseManager}</span>
                                            <span className="text-sm text-gray-500 font-medium">phone:{ref.caseManagerPhone}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>right leg</TableCell>

                                    {/* <TableCell>
                                    {ref.injuredParts?.length > 0 ? ref.injuredParts.join(", ") : "Missing"}
                                </TableCell> */}
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {ref.injuredParts ? (
                                                <>
                                                    <IconCircleCheckFilled size={20} className="text-green-600" />
                                                </>
                                            ) : (
                                                <>
                                                    <IconCircleXFilled size={20} className="text-red-600" />
                                                </>
                                            )}
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <span
                                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${ref.imageUploaded === "uploaded"
                                                ? "bg-green-100 text-green-700"
                                                : ref.imageUploaded === "pending"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            <span
                                                className={`h-2 w-2 rounded-full ${ref.imageUploaded === "uploaded"
                                                    ? "bg-green-600"
                                                    : ref.imageUploaded === "pending"
                                                        ? "bg-yellow-500"
                                                        : "bg-red-600"
                                                    }`}
                                            />
                                            {ref.imageUploaded === "uploaded"
                                                ? "Uploaded"
                                                : ref.imageUploaded === "pending"
                                                    ? "Pending"
                                                    : "No prior imaging"}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium  ${ref.imageUploaded === "uploaded"
                                                ? "bg-green-100 text-green-700"
                                                : ref.imageUploaded === "pending"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-red-100 text-[#1B1F26B8]"
                                                }`}
                                        >
                                            <span
                                                className={`h-2 w-2 rounded-full ${ref.imageUploaded === "uploaded"
                                                    ? "bg-green-600"
                                                    : ref.imageUploaded === "pending"
                                                        ? "bg-yellow-500"
                                                        : "bg-[#7561613D]"
                                                    }`}
                                            />
                                            {ref.imageUploaded === "uploaded"
                                                ? "Uploaded"
                                                : ref.imageUploaded === "pending"
                                                    ? "Pending"
                                                    : "none"}
                                        </span>
                                    </TableCell>
                                    <TableCell> <p>Initil consult</p><p>scheduled</p></TableCell>
                                    <TableCell>
                                        <button
                                            onClick={() =>
                                                setOpenMenu(openMenu === ref.id ? null : ref.id)
                                            }
                                            className="p-1"
                                            data-menu-button={ref.id}
                                        >
                                            <IconDotsVertical size={18} />
                                        </button>
                                        {openMenu === ref.id && (
                                            <div
                                                className="absolute right-6 top-0 bg-white border rounded-md shadow-md py-2 w-32 z-10"
                                                data-menu={ref.id}
                                            >
                                                <button
                                                    // onClick={async () => {
                                                    //     try {
                                                    //         const patientPayload = mapReferralToPatient(ref.referral);
                                                    //         await createPatient(patientPayload).unwrap();

                                                    //         setOpenMenu(null);

                                                    //         // Optional: success UX
                                                    //         // router.push("/dashboard/patients");
                                                    //         console.log("Patient created from referral:", ref.id);
                                                    //     } catch (err) {
                                                    //         console.error("Failed to create patient", err);
                                                    //     }
                                                    // }}
                                                    className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 w-full"
                                                >
                                                    <IconPlus size={16} />
                                                    Add
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        setSelectedId(ref.id);
                                                        setOpenDelete(true);
                                                    }}
                                                    className="flex refs-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 w-full text-red-600"
                                                >
                                                    <IconTrash size={16} /> Delete
                                                </button>

                                                {/* DELETE MODAL */}
                                                <DeleteModal
                                                    open={openDelete}
                                                    onClose={() => setOpenDelete(false)}
                                                    onConfirm={() => setOpenDelete(false)}
                                                />


                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}

            </div>

            {/* Pagination */}
            <div className="pt-6">
                <div className="flex justify-center">
                    <div className="inline-flex items-center gap-2 bg-white shadow-sm py-2 px-6 rounded-xl">
                        <Toggle label="≪" />
                        <Toggle label="‹" />
                        <Toggle label="1" active />
                        <Toggle label="2" />
                        <Toggle label="3" />
                        <span className="px-2">...</span>
                        <Toggle label="10" />
                        <Toggle label="›" />
                        <Toggle label="≫" />
                    </div>
                </div>
            </div>
        </div>
    );
}
