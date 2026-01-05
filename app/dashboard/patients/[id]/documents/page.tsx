"use client";
import React, { useMemo } from 'react'
import { useParams } from 'next/navigation';
import PatientsDetailsTabs from '../../../../components/navigation/PatientDetailsTabs';
import {
    IconSearch,
    IconFilter,
    IconChartFunnelFilled,
    IconEye,
    IconTrash,
    IconFileTypePdf,
} from "@tabler/icons-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useGetDocumentClassificationQuery, useGetDocumentsByPatientQuery } from '@/app/services/documents/documentsApi';
const page = () => {
    const params = useParams();
    const patientId = (params?.id as string) || '';

    const { data, isLoading, isError } = useGetDocumentsByPatientQuery(patientId, {
        skip: !patientId,
    });

    const { data: classificationData } = useGetDocumentClassificationQuery();

    const documents = useMemo(() => data?.data?.documents || [], [data]);

    const categoryNameById = useMemo(() => {
        const map = new Map<string, string>();
        (classificationData?.data || []).forEach((cat) => {
            map.set(cat.id, cat.name);
        });
        return map;
    }, [classificationData]);

    const typeNameById = useMemo(() => {
        const map = new Map<string, string>();
        (classificationData?.data || []).forEach((cat) => {
            (cat.DocumentTypes || []).forEach((type) => {
                map.set(type.id, type.name);
            });
        });
        return map;
    }, [classificationData]);

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
                            Add Document                        </button>
                    </div>
                </div>
                <div className='mb-2'>
                    <PatientsDetailsTabs />
                </div>

            </div>
            <div className='bg-white p-6'>
                <div className="mb-4 flex items-center justify-between">
                    {/* Left */}
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-semibold">Attached Files</h2>
                            <span className="rounded-full bg-[#6FB7F033] px-2 py-0.5 text-xs font-medium text-primary-700">
                                {documents.length} Total
                            </span>
                        </div>
                        <p className="text-xs text-gray-500">
                            Here you can explore Patients Uploaded Document
                        </p>
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-2">
                        {/* Search */}
                        <div className="relative w-56">
                            <input
                                placeholder="Search..."
                                className="w-full rounded-full border px-4 py-2 pr-9 text-sm outline-none"
                            />
                            <IconSearch
                                size={16}
                                className="absolute right-3 top-1/2 -translate-y-1/2 font-bold"
                            />
                        </div>

                        {/* Sort */}
                        <button className="flex items-center gap-1 rounded-full border px-4 py-2 text-sm">
                            <IconChartFunnelFilled size={14} />
                            Newest First
                        </button>

                        {/* Filter */}
                        <button className="flex items-center gap-1 rounded-full bg-primary-700 px-4 py-2 text-sm text-white">
                            <IconFilter size={16} />
                            Filter
                        </button>
                    </div>
                </div>


                <div className="w-full overflow-hidden rounded-lg border bg-white">
                    <Table className="w-full table-fixed text-sm">
                        <TableHeader>
                            <TableRow className="bg-gray-50">
                                <TableHead className="w-[22%]">Document Name</TableHead>
                                <TableHead className="w-[14%]">Document Category</TableHead>
                                <TableHead className="w-[12%]">Document Type</TableHead>
                                <TableHead className="w-[12%]">Document Date</TableHead>
                                <TableHead className="w-[12%]">Upload Date</TableHead>
                                <TableHead className="w-[18%]">Uploaded By</TableHead>
                                <TableHead className="w-[10%] text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-6">Loading documents...</TableCell>
                                </TableRow>
                            ) : isError ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-6 text-red-600">Failed to load documents.</TableCell>
                                </TableRow>
                            ) : documents.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">No documents found.</TableCell>
                                </TableRow>
                            ) : (
                                documents.map((doc) => {
                                    const docDate = doc.dateOfStudy ? new Date(doc.dateOfStudy).toLocaleDateString() : "—";
                                    const uploadDate = doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : "—";
                                    return (
                                        <TableRow key={doc.id}>
                                            {/* Document Name */}
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100">
                                                        <IconFileTypePdf size={18} className="text-red-600" />
                                                    </div>
                                                    <div className="leading-tight">
                                                        <p className="font-medium break-words">{doc.originalName || doc.storedName || "Document"}</p>
                                                        <p className="text-xs text-gray-500 break-words">{doc.mimeType || ""}</p>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            {/* Category */}
                                            <TableCell className="text-gray-600 break-words">
                                                {categoryNameById.get(doc.categoryId) || doc.categoryId || "—"}
                                            </TableCell>

                                            {/* Type */}
                                            <TableCell className="text-gray-600 break-words">
                                                {typeNameById.get(doc.typeId) || doc.typeId || "—"}
                                            </TableCell>

                                            {/* Document Date */}
                                            <TableCell className="text-gray-600 whitespace-nowrap">
                                                {docDate}
                                            </TableCell>

                                            {/* Upload Date */}
                                            <TableCell className="text-gray-600 whitespace-nowrap">
                                                {uploadDate}
                                            </TableCell>

                                            {/* Uploaded By */}
                                            <TableCell className="break-words">
                                                <p className="font-medium">{doc.uploadedBy || "Unknown"}</p>
                                                <p className="text-xs text-gray-500 break-words">
                                                    {doc.notes || ""}
                                                </p>
                                            </TableCell>

                                            {/* Actions */}
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button className="rounded-md p-2 hover:bg-gray-100">
                                                        <IconEye size={18} />
                                                    </button>
                                                    <button className="rounded-md p-2 hover:bg-gray-100">
                                                        <IconTrash size={18} />
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>


                </div>
            </div>
        </div>
    )
}

export default page
