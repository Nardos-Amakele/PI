"use client";
import { useState } from "react";
import { IconChevronDown, IconChevronUp, IconMinus, IconPlus, IconUpload } from "@tabler/icons-react";
import { useCreatePatientMutation } from "@/app/services/patients/patientsApi";
import AddDocumentModal from "@/app/components/ui/AddDocumentModal";
import React from "react";
import { useGetProvidersQuery } from "@/app/services/providers/providersApi";
import { useCreateCaseMutation } from "@/app/services/cases/casesApi";
import { useUploadDocumentMutation } from "@/app/services/documents/documentsApi";

function CollapsibleSection({ title, children, defaultOpen = true }: { title: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean }) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="mb-6 bg-white rounded-lg">
            <button
                type="button"
                className="w-full flex justify-between items-center px-6 py-4 text-lg font-semibold text-gray-900 focus:outline-none"
                onClick={() => setOpen((o) => !o)}
            >
                {title}

                {open ? (
                    <IconMinus
                        className="w-8 h-8 text-white bg-primary-700 rounded-lg p-2"
                        strokeWidth={2}
                    />
                ) : (
                    <IconPlus
                        className="w-8 h-8 text-white bg-primary-700 rounded-lg p-2"
                        strokeWidth={2}
                    />
                )}
            </button>

            {open && <div className="px-6 pb-6">{children}</div>}
        </div>

    );
}
type Claim = {
    dateOfLoss: string;
    bodyParts: string;
};

type UploadedDocument = {
    id: string;
    category: string;
    categoryLabel: string;
    type: string;
    typeLabel: string;
    subType: string;
    subTypeLabel: string;
    name: string;
    date: string;
    files: File[];
};

export default function AddPatientPage() {
    const [createPatient, { isLoading, isSuccess, isError, error }] = useCreatePatientMutation();
    const [claims, setClaims] = useState<Claim[]>([
        { dateOfLoss: "", bodyParts: "" },
    ]);
    const [addMode, setAddMode] = useState(false);
    const [claimType, setClaimType] = useState<"separated" | "combined">("separated");
    const [activeTab, setActiveTab] = useState(0);
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        middleName: "",
        dob: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        phone: "",
        email: "",
        referralSource: "",
        specialty: "",
        provider: "",
        language: "",
        dateOfLoss: "",
        bodyParts: "",
        lawOfficeName: "",
        lawOfficeAddress: "",
        lawOfficePhone: "",
        caseManagerName: "",
        caseManagerAddress: "",
        caseManagerPhone: "",
        caseManagerEmail: "",
        notes: "",
        remember: false,
    });
    const [files, setFiles] = useState<string[]>([]);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [submitted, setSubmitted] = useState(false);
    const [showAddDocumentModal, setShowAddDocumentModal] = useState(false);
    const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);
    const { data: providersData, isLoading: providersLoading } = useGetProvidersQuery({ page: 1, limit: 200 });
    const [createCase, { isLoading: isCreatingCase }] = useCreateCaseMutation();
    const [uploadDocument, { isLoading: isUploadingDocument }] = useUploadDocumentMutation();

    const providerOptions = providersData?.data?.providers || [];

    function validate() {
        const errs: { [key: string]: string } = {};
        if (!form.firstName) errs.firstName = "First name is required";
        if (!form.lastName) errs.lastName = "Last name is required";
        if (!form.dob) errs.dob = "DOB is required";
        if (!form.phone) errs.phone = "Phone is required";
        if (!form.email) errs.email = "Email is required";
        return errs;
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
        const { name, value, type } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" && e.target instanceof HTMLInputElement ? e.target.checked : value,
        }));
    }

    function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
        const newFiles = Array.from(e.target.files || []).map(f => f.name);
        setFiles(newFiles.slice(0, 3));
    }
    const handleClaimChange = (index: number, field: keyof Claim, value: string) => {
        const updated = [...claims];
        updated[index][field] = value;
        setClaims(updated);
    };


    const addClaim = () => {
        setClaims([...claims, { dateOfLoss: "", bodyParts: "" }]);
        setActiveTab(claims.length); // switch to new tab
    };

    const handleDocumentSave = (doc: Omit<UploadedDocument, "id">) => {
        setUploadedDocuments((prev) => [...prev, { ...doc, id: crypto.randomUUID() }]);
        setShowAddDocumentModal(false);
    };
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitted(true);
        const errs = validate();
        setErrors(errs);
        if (Object.keys(errs).length !== 0) return;

        const languages = form.language
            ? form.language.split(",").map((l) => l.trim()).filter(Boolean)
            : [];

        const assignedDoctors = form.provider ? [form.provider] : [];
        const notesArray = form.notes ? [form.notes] : [];

        const patientPayload: any = {
            firstName: form.firstName,
            lastName: form.lastName,
            middleName: form.middleName || undefined,
            dateOfBirth: form.dob,
            email: form.email,
            languages,
            address: {
                officeAddress: form.address,
                city: form.city,
                state: form.state,
                postalCode: form.zip,
                phoneNumber: form.phone,
            },
            initialReferralSpecialty: form.specialty || undefined,
            assignedDoctors,
        };

        if (notesArray.length) patientPayload.notes = notesArray;

        try {
            const patientResp = await createPatient(patientPayload).unwrap();
            const patientId = (patientResp as any)?.data?.id || (patientResp as any)?.id;

            if (!patientId) {
                alert("Patient created but no ID returned. Case not created.");
                return;
            }

            const lawOfficePayload = {
                name: form.lawOfficeName || "",
                address: form.lawOfficeAddress || "",
                phone: form.lawOfficePhone || "",
            };

            const caseManagerPayload = {
                name: form.caseManagerName || "",
                address: form.caseManagerAddress || "",
                phone: form.caseManagerPhone || "",
                email: form.caseManagerEmail || "",
            };

            const claimsToSubmit = (claims.length ? claims : [{ dateOfLoss: form.dateOfLoss, bodyParts: form.bodyParts }]).map((claim) => {
                const parts = (claim.bodyParts || form.bodyParts)
                    ? (claim.bodyParts || form.bodyParts)
                        .split(",")
                        .map((p) => p.trim())
                        .filter(Boolean)
                    : [];

                return {
                    patientId,
                    dateOfLoss: claim.dateOfLoss || form.dateOfLoss || "",
                    bodyPartsInjured: parts,
                    lawOffice: lawOfficePayload,
                    caseManager: caseManagerPayload,
                    status: "active" as const,
                };
            });

            await Promise.all(claimsToSubmit.map((payload) => createCase(payload).unwrap()));

            if (uploadedDocuments.length > 0) {
                await Promise.all(
                    uploadedDocuments.map((doc) =>
                        uploadDocument({
                            patientId,
                            categoryId: doc.category,
                            typeId: doc.type,
                            subTypeId: doc.subType || undefined,
                            originalName: doc.name || doc.files?.[0]?.name || undefined,
                            dateOfStudy: doc.date || undefined,
                            files: doc.files,
                        }).unwrap(),
                    ),
                );
            }

            alert("Patient, case, and documents added successfully!");
            setForm({
                firstName: "",
                lastName: "",
                middleName: "",
                dob: "",
                address: "",
                city: "",
                state: "",
                zip: "",
                phone: "",
                email: "",
                referralSource: "",
                specialty: "",
                provider: "",
                language: "",
                dateOfLoss: "",
                bodyParts: "",
                lawOfficeName: "",
                lawOfficeAddress: "",
                lawOfficePhone: "",
                caseManagerName: "",
                caseManagerAddress: "",
                caseManagerPhone: "",
                caseManagerEmail: "",
                notes: "",
                remember: false,
            });
            setFiles([]);
            setUploadedDocuments([]);
            setSubmitted(false);
        } catch (err) {
            console.error("Failed to create patient:", err);
            alert("Failed to add patient/case. Please try again.");
        }
    }
    // console.log('React version:', React.version);

    return (
        <form className="max-w-8xl mx-auto py-8 px-4 bg-white" onSubmit={handleSubmit}>
            <div className="flex py-2 px-6">
                <div>
                    <h1 className="text-2xl font-bold mb-1 text-gray-900">Add a patient</h1>
                    <p className="text-sm text-gray-500 mb-6">Start a new patient file and provide required details</p>
                </div>
            </div>
            <div className="flex flex-col md:flex-row gap-3">

                {/* LEFT column - now md:w-2/3 */}
                <div className="w-full md:flex-[2.3]">


                    {/* ===================== PATIENT DEMOGRAPHIC ===================== */}
                    <CollapsibleSection title="Patients Demographic">
                        <p className="text-sm -mt-3 mb-4 text-[#00000080]">Name and address of the Patient</p>
                        <hr className="mb-4" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            {/* First Name */}
                            <div>
                                <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                                    <label className="text-sm font-medium w-26">First Name</label>
                                    <input
                                        name="firstName"
                                        value={form.firstName}
                                        onChange={handleChange}
                                        className={`border rounded-md px-3 py-2 w-full flex-1 bg-input-bg ${submitted && errors.firstName ? "border-red-500" : "border-gray-300"
                                            }`}
                                    />
                                </div>
                                {submitted && errors.firstName && (
                                    <div className="text-red-500 text-xs mt-1">{errors.firstName}</div>
                                )}
                            </div>

                            {/* Last Name */}
                            <div>
                                <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                                    <label className="text-sm font-medium w-26">Last Name</label>
                                    <input
                                        name="lastName"
                                        value={form.lastName}
                                        onChange={handleChange}
                                        className={`border rounded-md px-3 py-2 w-full flex-1 bg-input-bg ${submitted && errors.lastName ? "border-red-500" : "border-gray-300"
                                            }`}
                                    />
                                </div>
                                {submitted && errors.lastName && (
                                    <div className="text-red-500 text-xs mt-1">{errors.lastName}</div>
                                )}
                            </div>

                            {/* Middle Name */}
                            <div>
                                <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                                    <label className="text-sm font-medium w-26">Middle Name</label>
                                    <input
                                        name="middleName"
                                        value={form.middleName}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded-md px-3 py-2 w-full flex-1 bg-input-bg"
                                    />
                                </div>
                            </div>

                            {/* DOB */}
                            <div>
                                <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                                    <label className="text-sm font-medium w-26">DOB</label>
                                    <input
                                        name="dob"
                                        type="date"
                                        value={form.dob}
                                        onChange={handleChange}
                                        className={`border rounded-md px-3 py-2 w-full flex-1 bg-input-bg ${submitted && errors.dob ? "border-red-500" : "border-gray-300"
                                            }`}
                                    />
                                </div>
                                {submitted && errors.dob && (
                                    <div className="text-red-500 text-xs mt-1">{errors.dob}</div>
                                )}
                            </div>

                            {/* Address */}
                            <div>
                                <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                                    <label className="text-sm font-medium w-26">Address</label>
                                    <input
                                        name="address"
                                        value={form.address}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded-md px-3 py-2 w-full flex-1 bg-input-bg"
                                    />
                                </div>
                            </div>

                            {/* City */}
                            <div>
                                <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                                    <label className="text-sm font-medium w-26">City</label>
                                    <input
                                        name="city"
                                        value={form.city}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded-md px-3 py-2 w-full flex-1 bg-input-bg"
                                    />
                                </div>
                            </div>

                            {/* State */}
                            <div>
                                <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                                    <label className="text-sm font-medium w-26">State</label>
                                    <input
                                        name="state"
                                        value={form.state}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded-md px-3 py-2 w-full flex-1 bg-input-bg"
                                    />
                                </div>
                            </div>

                            {/* ZIP */}
                            <div>
                                <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                                    <label className="text-sm font-medium w-26">ZIP</label>
                                    <input
                                        name="zip"
                                        value={form.zip}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded-md px-3 py-2 w-full flex-1 bg-input-bg"
                                    />
                                </div>
                            </div>

                            {/* Phone */}
                            <div>
                                <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                                    <label className="text-sm font-medium w-26">Phone</label>
                                    <input
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        className={`border rounded-md px-3 py-2 w-full flex-1 bg-input-bg ${submitted && errors.phone ? "border-red-500" : "border-gray-300"
                                            }`}
                                    />
                                </div>
                                {submitted && errors.phone && (
                                    <div className="text-red-500 text-xs mt-1">{errors.phone}</div>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                                    <label className="text-sm font-medium w-26">Email</label>
                                    <input
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        className={`border rounded-md px-3 py-2 w-full flex-1 bg-input-bg ${submitted && errors.email ? "border-red-500" : "border-gray-300"
                                            }`}
                                    />
                                </div>
                                {submitted && errors.email && (
                                    <div className="text-red-500 text-xs mt-1">{errors.email}</div>
                                )}
                            </div>
                            <div>
                                <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                                    <label className="text-sm font-medium w-26">language</label>
                                    <input
                                        name="language"
                                        value={form.language}
                                        onChange={handleChange}
                                        className={`border rounded-md px-3 py-2 w-full flex-1 bg-input-bg ${submitted && errors.language ? "border-red-500" : "border-gray-300"
                                            }`}
                                    />
                                </div>
                                {submitted && errors.language && (
                                    <div className="text-red-500 text-xs mt-1">{errors.language}</div>
                                )}
                            </div>

                        </div>

                    </CollapsibleSection>

                    {/* REFERRAL SOURCE */}

                    <CollapsibleSection title="Referral Source">
                        <p className="text-sm -mt-3 mb-4 text-[#00000080]">
                            Detail for referral source
                        </p>
                        <hr className="mb-4" />
                        <div className="relative w-full">
                            <select
                                name="referralSource"
                                value={form.referralSource}
                                onChange={handleChange}
                                className="appearance-none w-full bg-input-bg border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Select</option>
                                <option value="Direct">Direct</option>
                                <option value="Other">Other</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <div className="bg-white rounded-lg p-1">
                                    <IconChevronDown size={20} className="text-gray-400" />
                                </div>
                            </div>
                        </div>
                    </CollapsibleSection>

                    {/* DOCTOR & SCHEDULE */}
                    <CollapsibleSection title="Doctor And Schedule Information">
                        <p className="text-sm -mt-3 mb-4 text-[#00000080]">Doctor Assigned And Schedule</p>
                        <hr className="mb-4" />
                        <div className="grid  gap-4">

                            <div>
                                <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                                    <label className="text-sm font-medium w-40">Initial referral specialty</label>
                                    <div className="relative w-full flex-1">
                                        <select
                                            name="specialty"
                                            value={form.specialty}
                                            onChange={handleChange}
                                            className="appearance-none w-full bg-input-bg border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">Specialty</option>
                                            <option value="Ortho">Ortho</option>
                                            <option value="Neuro">Neuro</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                            <div className="bg-white rounded-lg p-1">
                                                <IconChevronDown size={20} className="text-gray-400" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>

                                <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                                    <label className="text-sm font-medium w-40">Assigned Providers</label>
                                    <div className="relative w-full flex-1">
                                        <select
                                            name="provider"
                                            value={form.provider}
                                            onChange={handleChange}
                                            disabled={providersLoading}
                                            className="appearance-none w-full bg-input-bg border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                                        >
                                            <option value="">{providersLoading ? "Loading..." : "Select provider"}</option>
                                            {providerOptions.map((prov) => (
                                                <option key={prov.id} value={prov.id}>
                                                    {prov.firstName} {prov.lastName}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                            <div className="bg-white rounded-lg p-1">
                                                <IconChevronDown size={20} className="text-gray-400" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CollapsibleSection>

                    {/* CASE INFORMATION */}
                    <CollapsibleSection
                        title={
                            <div className="flex items-center gap-2">
                                <span>Case Information</span>
                                <div
                                    className="relative group cursor-pointer inline-block"
                                    onClick={e => {
                                        e.stopPropagation();
                                        setAddMode(true);
                                    }}
                                >
                                    <IconPlus size={24} />
                                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-700 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        Add another case information
                                    </span>
                                </div>

                            </div>
                        }
                    >
                        <p className="text-sm -mt-3 mb-4 text-[#00000080]">Patient case information</p>
                        <hr className="mb-4" />

                        {/* RADIO SELECTION WHEN ADDING */}
                        {addMode && (
                            <div className="flex gap-4 mb-4 text-sm">
                                {["separated", "combined"].map((type) => (
                                    <label key={type} className="flex items-center gap-1">
                                        <input
                                            type="radio"
                                            name="claimType"
                                            value={type}
                                            className="accent-blue-600"
                                            onChange={() => {
                                                setClaimType(type as "separated" | "combined");
                                                setClaims([...claims, { dateOfLoss: "", bodyParts: "" }]); // only now add claim
                                                setActiveTab(claims.length); // switch to new tab
                                                setAddMode(false);
                                            }}
                                        />
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </label>
                                ))}
                            </div>
                        )}


                        {/* TABS */}
                        {claims.length > 0 && (
                            <>
                                <div className="flex border-b mb-4">
                                    {claims.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setActiveTab(index)}
                                            className={`px-6 py-1 -mb-px border-b-2 ${activeTab === index
                                                ? " text-white rounded-t-sm font-medium bg-primary-700"
                                                : "border-transparent text-gray-500"
                                                }`}
                                        >
                                            Claim {index + 1}
                                        </button>
                                    ))}
                                </div>

                                {/* TAB CONTENT */}
                                {claims.map((claim, index) => (
                                    <div
                                        key={index}
                                        className={`${activeTab === index ? "block" : "hidden"} grid grid-cols gap-4`}
                                    >
                                        {/* Date of Loss */}
                                        <div>
                                            <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                                                <label className="text-sm font-medium w-40">Date of loss</label>
                                                <input
                                                    name="dateOfLoss"
                                                    type="date"
                                                    value={claim.dateOfLoss}
                                                    onChange={(e) =>
                                                        handleClaimChange(index, "dateOfLoss", e.target.value)
                                                    }
                                                    className="border border-gray-300 rounded-md px-3 py-2 w-full flex-1 bg-input-bg"
                                                />
                                            </div>
                                        </div>

                                        {/* Body Parts Injured */}
                                        <div>
                                            <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                                                <label className="text-sm font-medium w-40">Body Parts injured</label>
                                                <div className="relative w-full flex-1">
                                                    <select
                                                        name="bodyParts"
                                                        value={claim.bodyParts}
                                                        onChange={(e) =>
                                                            handleClaimChange(index, "bodyParts", e.target.value)
                                                        }
                                                        className="appearance-none w-full bg-input-bg border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                    >
                                                        <option value="">Select</option>
                                                        <option value="Back">Back</option>
                                                        <option value="Neck">Neck</option>
                                                    </select>
                                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                        <div className="bg-white rounded-lg p-1">
                                                            <IconChevronDown size={20} className="text-gray-400" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </CollapsibleSection>



                    {/* LAW OFFICE + CASE MANAGER */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-4 rounded-md">

                        {/* Law Office */}
                        <div>
                            <p className="text-sm font-semibold mb-3">Law Office Information</p>

                            {/* Name */}
                            <div className="flex flex-col lg:flex-row lg:items-center gap-2 mb-3">
                                <label className="text-sm font-medium lg:w-26">Name</label>
                                <input
                                    name="lawOfficeName"
                                    value={form.lawOfficeName}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded-md px-3 py-2 w-full bg-input-bg"
                                />
                            </div>

                            {/* Address */}
                            <div className="flex flex-col lg:flex-row lg:items-center gap-2 mb-3">
                                <label className="text-sm font-medium lg:w-26">Address</label>
                                <input
                                    name="lawOfficeAddress"
                                    value={form.lawOfficeAddress}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded-md px-3 py-2 w-full bg-input-bg"
                                />
                            </div>

                            {/* Phone */}
                            <div className="flex flex-col lg:flex-row lg:items-center gap-2">
                                <label className="text-sm font-medium lg:w-26">Phone</label>
                                <input
                                    name="lawOfficePhone"
                                    value={form.lawOfficePhone}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded-md px-3 py-2 w-full bg-input-bg"
                                />
                            </div>
                        </div>

                        {/* Case Manager */}
                        <div>
                            <p className="text-sm font-semibold mb-3">Case Manager Information</p>

                            {/* Name */}
                            <div className="flex flex-col lg:flex-row lg:items-center gap-2 mb-3">
                                <label className="text-sm font-medium lg:w-26">Name</label>
                                <input
                                    name="caseManagerName"
                                    value={form.caseManagerName}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded-md px-3 py-2 w-full bg-input-bg"
                                />
                            </div>

                            {/* Address */}
                            <div className="flex flex-col lg:flex-row lg:items-center gap-2 mb-3">
                                <label className="text-sm font-medium lg:w-26">Address</label>
                                <input
                                    name="caseManagerAddress"
                                    value={form.caseManagerAddress}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded-md px-3 py-2 w-full bg-input-bg"
                                />
                            </div>

                            {/* Phone */}
                            <div className="flex flex-col lg:flex-row lg:items-center gap-2 mb-3">
                                <label className="text-sm font-medium lg:w-26">Phone</label>
                                <input
                                    name="caseManagerPhone"
                                    value={form.caseManagerPhone}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded-md px-3 py-2 w-full bg-input-bg"
                                />
                            </div>

                            {/* Email */}
                            <div className="flex flex-col lg:flex-row lg:items-center gap-2">
                                <label className="text-sm font-medium lg:w-26">Email</label>
                                <input
                                    name="caseManagerEmail"
                                    value={form.caseManagerEmail}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded-md px-3 py-2 w-full bg-input-bg"
                                />
                            </div>
                        </div>

                    </div>


                </div>

                {/* RIGHT column - now md:w-1/3 */}
                <div className="w-full md:flex-[1.8] ">

                    <hr />


                    <CollapsibleSection title="File attachment and Notes">
                        <p className="text-sm -mt-3 mb-6 text-[#00000080]">Doctor Assigned And Schedule</p>

                        <label
                            htmlFor="file-upload"
                            className="bg-[#EEF6FF] border border-[#2774CF4D] border-dashed  rounded-lg py-12  px-6 flex flex-col items-center justify-center mb-4 cursor-pointer "
                            onClick={e => { e.preventDefault(); setShowAddDocumentModal(true); }}
                        >
                            <IconUpload className="w-10 h-10 text-[#4C95EB] mb-4" />

                            <div className="font-semibold text-lg mb-1">
                                Add File{" "}
                                <span className="text-[#4C95EB] underline">Browse</span>
                            </div>

                            <div className="text-xs text-gray-500 mb-2 r">
                                Supported formats: JPEG, PNG, GIF, MP4, PDF, PSD, AI, Word
                            </div>

                            <input
                                type="file"
                                multiple
                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                onChange={handleFile}
                                className="hidden"
                                id="file-upload"
                            />
                        </label>


                        <div className="mb-4">
                            <div className="text-xs text-gray-500 mb-1">Uploading - {files.length}/3 files</div>
                            {files.map((f, i) => (
                                <div key={i} className="flex items-center gap-2 mb-2">
                                    <div className="flex-1 text-sm bg-gray-100 rounded px-2 py-1">{f}</div>
                                    <div className="w-26 h-2 bg-primary-100 rounded-full overflow-hidden">
                                        <div className="h-2 bg-primary-700" style={{ width: "100%" }}></div>
                                    </div>
                                    <button
                                        type="button"
                                        className="text-gray-400 hover:text-red-500"
                                        onClick={() => setFiles(files.filter((_, idx) => idx !== i))}
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>

                        {uploadedDocuments.length > 0 && (
                            <div className="mb-4">
                                <div className="text-sm font-semibold mb-2">Uploaded documents</div>
                                <ul className="space-y-2">
                                    {uploadedDocuments.map((doc) => (
                                        <li key={doc.id} className="border border-gray-200 rounded-md p-3 bg-gray-50">
                                            <div className="text-sm font-medium text-gray-900">{doc.name || "Untitled"}</div>
                                            <div className="text-xs text-gray-600">
                                                {doc.categoryLabel || "Category"}
                                                {doc.typeLabel ? ` • ${doc.typeLabel}` : ""}
                                                {doc.subTypeLabel ? ` • ${doc.subTypeLabel}` : ""}
                                                {doc.date ? ` • ${doc.date}` : ""}
                                            </div>
                                            {doc.files.length > 0 && (
                                                <div className="text-xs text-gray-500 mt-1">
                                                    Files: {doc.files.map((f) => f.name).join(", ")}
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <textarea
                            name="notes"
                            value={form.notes}
                            onChange={handleChange}
                            rows={4}
                            className="border border-[#2774CF4D] border-dashed rounded-md px-3 py-2 w-full bg-[#EEF6FF] resize-none"
                            placeholder="Add notes here..."
                        />

                        {showAddDocumentModal && (
                            <AddDocumentModal
                                open={showAddDocumentModal}
                                onClose={() => setShowAddDocumentModal(false)}
                                onSave={handleDocumentSave}
                            />
                        )}
                    </CollapsibleSection>

                </div>

            </div>
            <div className="flex justify-end mb-7 py-2 px-6 ">
                <button
                    type="submit"
                    disabled={isLoading || isCreatingCase || isUploadingDocument}
                    className="bg-primary-700 hover:bg-primary-800 rounded-sm text-white px-6 py-3 font-medium text-lg ml-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {(isLoading || isCreatingCase || isUploadingDocument) ? "Saving..." : "Save"}
                </button>
                <button
                    type="submit"
                    disabled={isLoading || isCreatingCase || isUploadingDocument}
                    className="bg-primary-700 hover:bg-primary-800 rounded-sm text-white px-6 py-3  font-medium text-lg ml-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <a href="/dashboard/find-availability">{(isLoading || isCreatingCase || isUploadingDocument) ? "Saving..." : "Save and schedule"}</a>
                </button>
                <button
                    type="button"
                    className="bg-[#8D1F1B] text-white px-6 py-3 rounded-sm shadow-sm ml-4"
                >
                    <a href="/dashboard">Cancel</a>
                </button>
            </div>
        </form>
    );
}
