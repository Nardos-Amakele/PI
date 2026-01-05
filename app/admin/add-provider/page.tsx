"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { IconUpload, IconPlus, IconMinus, IconCirclePlus, IconX } from "@tabler/icons-react";
import AddDocumentModal from "@/app/components/ui/AddDocumentModal";
import { TextEditor } from "@/app/components/feature/TextEditor";
import { useGetLocationsQuery } from "@/app/services/locations/locationsApi";
import { useCreateProviderMutation } from "@/app/services/providers/providersApi";
import { useCreateProviderTemplateMutation } from "@/app/services/providerTemplates/providerTemplatesApi";
import type { CreateProviderRequest, ProviderLicense, AgeRestriction } from "@/app/services/providers/providersTypes";
import type { CreateProviderTemplateRequest } from "@/app/services/providerTemplates/providerTemplatesTypes";

type SelectedLocation = { id: string; label: string };
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
export default function AddPatientPage() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [npi, setNpi] = useState("");
    const [taxonomy, setTaxonomy] = useState("");
    const [licenseState, setLicenseState] = useState("");
    const [deaNumber, setDeaNumber] = useState("");
    const [licenseNumber, setLicenseNumber] = useState("");
    const [licenseIssueDate, setLicenseIssueDate] = useState("");
    const [licenseExpirationDate, setLicenseExpirationDate] = useState("");
    const [ageOption, setAgeOption] = useState<string>("all");
    const [customMinAge, setCustomMinAge] = useState<string>("");
    const [customMaxAge, setCustomMaxAge] = useState<string>("");
    const [files, setFiles] = useState<string[]>([]);
    const [toggles, setToggles] = useState({
        pediatrics: false,
        painManagement: false,
        orthoSpine: false,
        orthoExtremities: false,
    });
    const [clinicLocations, setClinicLocations] = useState<SelectedLocation[]>([]);
    const [surgicalLocations, setSurgicalLocations] = useState<SelectedLocation[]>([]);
    const [selectedClinicOption, setSelectedClinicOption] = useState<string>("");
    const [selectedSurgicalOption, setSelectedSurgicalOption] = useState<string>("");
    const [specialties, setSpecialties] = useState<
        { id: string; value: string }[]
    >([{ id: crypto.randomUUID(), value: "" }]);
    const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
    const [signatureFile, setSignatureFile] = useState<File | null>(null);
    const [signatureRequired] = useState<boolean>(true);
    const signatureUploadRef = useRef<HTMLInputElement>(null);
    const signatureCameraRef = useRef<HTMLInputElement>(null);
    const [noteContent, setNoteContent] = useState("");
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
    const [npiLookupMessage, setNpiLookupMessage] = useState<string | null>(null);
    const [npiLookupLoading, setNpiLookupLoading] = useState(false);

    const [createProvider, { isLoading: isCreating }] = useCreateProviderMutation();
    const [createProviderTemplate, { isLoading: isCreatingTemplate }] = useCreateProviderTemplateMutation();


    const handleToggle = (key: keyof typeof toggles) => {
        setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const toggleClasses = (active: boolean) =>
        `absolute inset-0 rounded-full transition-colors ${active ? "bg-[#25514A]" : "bg-[#42928526]"}`;

    const handleClasses = (active: boolean) =>
        `relative z-10 block h-7 w-7 rounded-full bg-white shadow-[0_6px_20px_rgba(0,0,0,0.12)] transition-transform duration-300 ${active ? "translate-x-8" : "translate-x-0"
        }`;

    const handleSpecialtyChange = (id: string, value: string) => {
        setSpecialties(prev =>
            prev.map(s => (s.id === id ? { ...s, value } : s))
        );
    };

    const addSpecialtyField = () => {
        setSpecialties(prev => [
            ...prev,
            { id: crypto.randomUUID(), value: "" },
        ]);
    };



    function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
        const newFiles = Array.from(e.target.files || []).map(f => f.name);
        setFiles(newFiles.slice(0, 3));
    }

    function handleSignatureChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setSignatureFile(file);
        const reader = new FileReader();
        reader.onload = () => setSignaturePreview(reader.result as string);
        reader.readAsDataURL(file);
    }

    function clearSignaturePreview() {
        setSignaturePreview(null);
        setSignatureFile(null);
        if (signatureUploadRef.current) signatureUploadRef.current.value = "";
        if (signatureCameraRef.current) signatureCameraRef.current.value = "";
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setSubmitError(null);
        setSubmitSuccess(null);

        if (!signatureFile) {
            setSubmitError("Signature file is required before saving.");
            return;
        }

        const trimmedName = fullName.trim();
        const [firstName, ...restName] = trimmedName.split(/\s+/);
        const lastName = restName.join(" ");

        if (!firstName || !lastName) {
            setSubmitError("Enter first and last name separated by a space.");
            return;
        }

        const locationIds = Array.from(
            new Set([...clinicLocations, ...surgicalLocations].map((loc) => loc.id))
        );

        const licenseEntries: Partial<ProviderLicense>[] = [];
        if (licenseNumber || licenseState || licenseIssueDate || licenseExpirationDate) {
            licenseEntries.push({
                licenseNumber: licenseNumber.trim(),
                state: licenseState.trim(),
                issueDate: licenseIssueDate || undefined,
                expirationDate: licenseExpirationDate || undefined,
            });
        }

        const ageRestrictions: Array<Partial<AgeRestriction>> = [];
        if (ageOption === "custom" && customMinAge !== "" && customMaxAge !== "") {
            ageRestrictions.push({ min: Number(customMinAge), max: Number(customMaxAge), requiresConfirmation: false });
        } else if (ageOption === "adult") {
            ageRestrictions.push({ min: 18, requiresConfirmation: false });
        } else if (ageOption === "pediatric") {
            ageRestrictions.push({ min: 0, max: 17, requiresConfirmation: true });
        }

        const toggleSpecialities: string[] = [];
        if (toggles.painManagement) toggleSpecialities.push("painmanagement");
        if (toggles.orthoSpine) toggleSpecialities.push("orthospine");
        if (toggles.orthoExtremities) toggleSpecialities.push("orthoextremities");

        const payload: CreateProviderRequest = {
            first_name: firstName,
            last_name: lastName,
            email: email.trim(),
            phone: phone.trim(),
            npi: npi.trim(),
            specialities: toggleSpecialities,
            location_ids: locationIds,
            preferences: []
        };

        if (licenseEntries.length) payload.licenses = licenseEntries;
        if (ageRestrictions.length) payload.age_restrictions = ageRestrictions;
        console.log("Payload for creating provider:", payload);
        try {
            const providerResp = await createProvider(payload).unwrap();
            const providerId = providerResp?.data?.provider?.id;

            if (!providerId) {
                setSubmitError("Provider created but no provider ID returned.");
                return;
            }

            const templatePayload: CreateProviderTemplateRequest = {
                providerId,
                signatureFile,
                signatureRequired,
            };

            try {
                await createProviderTemplate(templatePayload).unwrap();
                setSubmitSuccess("Provider and signature saved successfully.");
            } catch (templateError: any) {
                const message =
                    templateError?.data?.message ||
                    templateError?.message ||
                    "Unable to save signature. Please try again.";
                setSubmitError(message);
            }
        } catch (error: any) {
            const message =
                error?.data?.message ||
                error?.message ||
                "Unable to save provider. Please try again.";
            setSubmitError(message);
        }
    }

    const { data: locationsData, isLoading: locationsLoading } = useGetLocationsQuery({ status: "active", limit: 200 });

    useEffect(() => {
        const trimmedNpi = npi.trim();
        if (!/^\d{10}$/.test(trimmedNpi)) {
            setNpiLookupMessage(null);
            return;
        }

        let aborted = false;

        const showTempMessage = (message: string) => {
            setNpiLookupMessage(message);
            setTimeout(() => {
                if (!aborted) setNpiLookupMessage(null);
            }, 2000);
        };

        const fetchNpi = async () => {
            setNpiLookupLoading(true);
            setNpiLookupMessage(null);
            try {
                const response = await fetch(`/api/npi?npi=${trimmedNpi}`);
                if (!response.ok) {
                    throw new Error("NPI lookup failed");
                }
                const data = await response.json();
                const result = data?.results?.[0];

                if (!result) {
                    if (!aborted) showTempMessage("No provider found for this NPI.");
                    return;
                }

                if (aborted) return;

                const basic = result.basic || {};
                const nameFromNpi = [basic.first_name, basic.last_name].filter(Boolean).join(" ").trim();
                if (nameFromNpi) setFullName(nameFromNpi);

                const taxonomies = result.taxonomies || [];
                const primaryTaxonomy = taxonomies.find((item: any) => item.primary === true) || taxonomies[0];
                if (primaryTaxonomy?.code) {
                    setTaxonomy(primaryTaxonomy.code);
                }

                const addresses = result.addresses || [];
                const addressForPhone =
                    addresses.find((addr: any) => addr.address_purpose === "LOCATION") ||
                    addresses.find((addr: any) => addr.address_purpose === "MAILING") ||
                    addresses[0];
                if (addressForPhone?.telephone) setPhone(addressForPhone.telephone);

                showTempMessage("Details auto-filled from NPI registry.");
            } catch (error) {
                if (!aborted) showTempMessage("Unable to look up NPI right now.");
            } finally {
                if (!aborted) setNpiLookupLoading(false);
            }
        };

        fetchNpi();

        return () => {
            aborted = true;
        };
    }, [npi]);

    const clinicLocationOptions = useMemo(() => {
        const locations = locationsData?.data?.locations || [];
        return locations
            .filter((loc) => loc.serviceCode === 2 || loc.serviceCode === 11)
            .map((loc) => ({ id: loc.id, label: loc.name || "Unnamed location" }));
    }, [locationsData]);

    const surgicalLocationOptions = useMemo(() => {
        const locations = locationsData?.data?.locations || [];
        return locations
            .filter((loc) => [21, 22, 23, 24].includes(Number(loc.serviceCode)))
            .map((loc) => ({ id: loc.id, label: loc.name || "Unnamed location" }));
    }, [locationsData]);
    return (
        <form onSubmit={handleSubmit}>
            <div className="flex items-center justify-between mb-6 mt-6 p-6 bg-white max-w-7xl mx-auto">
                <div>
                    <h1 className="text-2xl font-semibold mb-1">Providers Directory</h1>
                    <p className="text-gray-500 text-sm"> Search, filter, and manage provider availability and booking preferences</p>
                </div>
                <button className="px-4 py-3 bg-primary-700 text-white rounded-sm">
                    <a href="/admin/add-provider">Add Provider</a>
                </button>
            </div>
            {(submitError || submitSuccess) && (
                <div className="max-w-7xl mx-auto px-6">
                    {submitError && <div className="text-red-600 text-sm mb-2">{submitError}</div>}
                    {submitSuccess && <div className="text-green-700 text-sm mb-2">{submitSuccess}</div>}
                </div>
            )}
            <div className="max-w-7xl mx-auto p-6 bg-white flex flex-col md:flex-row gap-3">
                <div className="w-full md:flex-[1.8]">
                    <h1 className="text-2xl font-bold mb-2">Provider Demographic</h1>
                    <p className="text-sm text-gray-500 mb-6">Name and address of the Patient</p>

                    <CollapsibleSection title="Patients Demographic">
                        <p className="text-sm -mt-3 mb-4 text-[#00000080]">Name and address of the Patient</p>
                        <hr className="mb-4" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            {/* First Name */}
                            <div>
                                <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                                    <label className="text-sm font-medium w-26">Name</label>
                                    <input
                                        name="fullName"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="border rounded-md px-3 py-2 w-full flex-1 bg-input-bg"
                                    />
                                </div>

                            </div>

                            {/* Last Name */}
                            <div>
                                <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                                    <label className="text-sm font-medium w-26">Npi Number</label>
                                    <input
                                        name="npi"
                                        value={npi}
                                        onChange={(e) => setNpi(e.target.value)}
                                        className="border rounded-md px-3 py-2 w-full flex-1 bg-input-bg"
                                    />
                                    <div className="text-xs text-gray-500 mt-1 h-4">
                                        {npiLookupLoading ? "Looking up NPI..." : npiLookupMessage}
                                    </div>
                                </div>

                            </div>

                            {/* Middle Name */}
                            <div>
                                <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                                    <label className="text-sm font-medium w-26">Email</label>
                                    <input
                                        name="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="border border-gray-300 rounded-md px-3 py-2 w-full flex-1 bg-input-bg"
                                    />
                                </div>
                            </div>

                            {/* DOB */}
                            <div>
                                <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                                    <label className="text-sm font-medium w-26">Phone</label>
                                    <input
                                        name="phone"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="border border-gray-300 rounded-md px-3 py-2 w-full flex-1 bg-input-bg"
                                    />
                                </div>

                            </div>

                            {/* Address */}
                            <div>
                                <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                                    <label className="text-sm font-medium w-26">Taxonomy</label>
                                    <input
                                        name="taxonomy"
                                        value={taxonomy}
                                        onChange={(e) => setTaxonomy(e.target.value)}
                                        className="border border-gray-300 rounded-md px-3 py-2 w-full flex-1 bg-input-bg"
                                    />
                                </div>
                            </div>

                            {/* City */}
                            <div className="flex flex-col md:flex-row md:items-start md:gap-2">
                                <label className="text-sm font-medium pt-2">Specialty</label>
                                <div className="flex-1 space-y-2">
                                    {specialties.map((item, index) => {
                                        const isLast = index === specialties.length - 1;

                                        return (
                                            <div key={item.id} className="flex items-center gap-2">
                                                <input
                                                    value={item.value}
                                                    onChange={(e) =>
                                                        handleSpecialtyChange(item.id, e.target.value)
                                                    }
                                                    placeholder="Enter specialty"
                                                    className="w-full bg-input-bg border border-gray-300 rounded-md px-3 py-2"
                                                />

                                                {isLast && (
                                                    <button
                                                        type="button"
                                                        onClick={addSpecialtyField}
                                                        className="rounded-md text-primary-700"
                                                    >
                                                        <IconCirclePlus size={24} />
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}

                                </div>
                            </div>

                            <div className="mt-5">
                                <div>
                                    <label className="text-lg font-medium w-full flex items-center gap-2 mb-2">
                                        Add Clinic Location  <IconPlus />

                                    </label>
                                    <div className="flex gap-2">
                                        <select
                                            name="clinicAddress"
                                            value={selectedClinicOption}
                                            onChange={e => setSelectedClinicOption(e.target.value)}
                                            className="border border-gray-300 rounded-md px-3 py-2 w-full flex-1 bg-input-bg"
                                            disabled={locationsLoading}
                                        >
                                            <option value="">Select clinic location</option>
                                            {clinicLocationOptions.map((opt) => (
                                                <option key={opt.id} value={opt.id}>
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const selected = clinicLocationOptions.find((opt) => opt.id === selectedClinicOption);
                                                if (selected && !clinicLocations.find((loc) => loc.id === selected.id)) {
                                                    setClinicLocations(prev => [...prev, selected]);
                                                    setSelectedClinicOption("");
                                                }
                                            }}
                                            className="ml-2 py-2 rounded-md"
                                        >
                                            <IconCirclePlus size={24} />
                                        </button>
                                    </div>
                                    {/* Show added clinic locations */}
                                    {clinicLocations.length > 0 && (
                                        <ul className="mt-2 space-y-1">
                                            {clinicLocations.map((loc) => (
                                                <li key={loc.id} className="text-sm text-gray-700 bg-gray-100 rounded px-2 py-1">{loc.label}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                            <div className="mt-5">
                                <div className="">
                                    <label className="text-lg font-medium w-full flex items-center gap-2 mb-2">
                                        Add Surgical Location <IconPlus />
                                    </label>
                                    <div className="flex gap-2">
                                        <select
                                            name="surgicalAddress"
                                            value={selectedSurgicalOption}
                                            onChange={e => setSelectedSurgicalOption(e.target.value)}
                                            className="border border-gray-300 rounded-md px-3 py-2 w-full flex-1 bg-input-bg"
                                            disabled={locationsLoading}
                                        >
                                            <option value="">Select surgical location</option>
                                            {surgicalLocationOptions.map((opt) => (
                                                <option key={opt.id} value={opt.id}>
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const selected = surgicalLocationOptions.find((opt) => opt.id === selectedSurgicalOption);
                                                if (selected && !surgicalLocations.find((loc) => loc.id === selected.id)) {
                                                    setSurgicalLocations(prev => [...prev, selected]);
                                                    setSelectedSurgicalOption("");
                                                }
                                            }}
                                            className="ml-2 py-2 rounded-md"
                                        >
                                            <IconCirclePlus size={24} />

                                        </button>
                                    </div>
                                    {/* Show added surgical locations */}
                                    {surgicalLocations.length > 0 && (
                                        <ul className="mt-2 space-y-1">
                                            {surgicalLocations.map((loc) => (
                                                <li key={loc.id} className="text-sm text-gray-700 bg-gray-100 rounded px-2 py-1">{loc.label}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>

                        </div>

                    </CollapsibleSection>
                    <CollapsibleSection title="Licenses">
                        <p className="text-sm -mt-3 mb-4 text-[#00000080]">DEA and License Number</p>
                        <hr className="mb-4" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            {/* State */}
                            <div>
                                <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                                    <label className="text-sm font-medium w-26">State</label>
                                    <input
                                        name="licenseState"
                                        value={licenseState}
                                        onChange={(e) => setLicenseState(e.target.value)}
                                        className="border rounded-md px-3 py-2 w-full flex-1 bg-input-bg"
                                    />
                                </div>

                            </div>

                            {/* DEA Number */}
                            <div>
                                <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                                    <label className="text-sm font-medium w-26">DEA Number</label>
                                    <input
                                        name="deaNumber"
                                        value={deaNumber}
                                        onChange={(e) => setDeaNumber(e.target.value)}
                                        className="border rounded-md px-3 py-2 w-full flex-1 bg-input-bg"
                                    />
                                </div>

                            </div>

                            {/* License Number */}
                            <div>
                                <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                                    <label className="text-sm font-medium w-26">License Number</label>
                                    <input
                                        name="licenseNumber"
                                        value={licenseNumber}
                                        onChange={(e) => setLicenseNumber(e.target.value)}
                                        className="border border-gray-300 rounded-md px-3 py-2 w-full flex-1 bg-input-bg"
                                    />
                                </div>
                            </div>

                            {/* Date of Issue */}
                            <div>
                                <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                                    <label className="text-sm font-medium w-26">Date of Issue</label>
                                    <input
                                        type="date"
                                        name="issueDate"
                                        value={licenseIssueDate}
                                        onChange={(e) => setLicenseIssueDate(e.target.value)}
                                        className="border border-gray-300 rounded-md px-3 py-2 w-full flex-1 bg-input-bg"
                                    />
                                </div>

                            </div>

                            {/* Expiration Date */}
                            <div>
                                <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                                    <label className="text-sm font-medium w-26">Expiration Date</label>
                                    <input
                                        type="date"
                                        name="expirationDate"
                                        value={licenseExpirationDate}
                                        onChange={(e) => setLicenseExpirationDate(e.target.value)}
                                        className="border border-gray-300 rounded-md px-3 py-2 w-full flex-1 bg-input-bg"
                                    />
                                </div>
                            </div>
                            {/* Expiration Date */}
                            <div>
                                <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                                    <label className="text-sm font-medium w-26">Expiration Date</label>
                                    <input
                                        name="address"
                                        // value={form.address}
                                        // onChange={handleChange}
                                        className="border border-gray-300 rounded-md px-3 py-2 w-full flex-1 bg-input-bg"
                                    />
                                </div>
                            </div>



                        </div>

                    </CollapsibleSection>
                    <div className="px-5 py-2">
                        <p className="text-gray-500 mb-6">Patient age restrictions</p>
                        <div className="flex flex-wrap gap-6 text-base font-medium">
                            {[
                                { label: "All ages", value: "all" },
                                { label: "Adult only (18+)", value: "adult" },
                                { label: "Pediatric only (0–17)", value: "pediatric" },
                                { label: "Custom Range", value: "custom" },
                            ].map((opt) => (
                                <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="age"
                                        value={opt.value}
                                        checked={ageOption === opt.value}
                                        onChange={() => setAgeOption(opt.value)}
                                        className="accent-blue-600 w-4 h-4"
                                    />
                                    {opt.label}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* CUSTOM RANGE INPUTS */}
                    {ageOption === "custom" && (
                        <div className="flex gap-4 ml-6">
                            <div className="flex flex-col">
                                <label className="text-sm text-gray-600 mb-1">Minimnum Age</label>
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={customMinAge}
                                    onChange={(e) => setCustomMinAge(e.target.value)}
                                    className="w-28 px-6 bg-[#FAFAFA] shadow-sm py-3 border rounded-md"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-sm text-gray-600 mb-1">Maximum Age</label>
                                <input
                                    type="number"
                                    placeholder="99"
                                    value={customMaxAge}
                                    onChange={(e) => setCustomMaxAge(e.target.value)}
                                    className="w-28 px-6 bg-[#FAFAFA] shadow-sm py-3 border rounded-md"
                                />
                            </div>
                        </div>
                    )}

                    <div className="p-5">
                        <p className="text-gray-500 mb-6">Toggle based on providers preferences</p>

                        <div className="flex gap-4 mb-8">
                            {/* <div className="flex items-center gap-4">
                                <div className="flex flex-col">
                                    <span className="text-lg">Pediatrics</span>
                                    <span className="text-gray-500 text-sm">toggle if they see pediatric patients</span>
                                </div>
                                <button
                                    role="switch"
                                    aria-checked={toggles.pediatrics}
                                    onClick={() => handleToggle("pediatrics")}
                                    className="relative w-16 h-8 rounded-full p-1 flex items-center cursor-pointer transition-all"
                                >
                                    <span className={toggleClasses(toggles.pediatrics)} />
                                    <span className={handleClasses(toggles.pediatrics)} />
                                </button>
                            </div> */}

                            <div className="flex items-center gap-4">
                                <div className="flex flex-col">
                                    <span className="text-lg">Pain Management</span>
                                    <span className="text-gray-500 text-sm">toggle if they see pain management</span>
                                </div>
                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={toggles.painManagement}
                                    onClick={() => handleToggle("painManagement")}
                                    className="relative w-16 h-8 rounded-full p-1 flex items-center cursor-pointer transition-all"
                                >
                                    <span className={toggleClasses(toggles.painManagement)} />
                                    <span className={handleClasses(toggles.painManagement)} />
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex items-center gap-4">
                                <div className="flex flex-col">
                                    <span className="text-lg">Ortho/Spine</span>
                                    <span className="text-gray-500 text-sm">toggle if they see ortho spine</span>
                                </div>
                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={toggles.orthoSpine}
                                    onClick={() => handleToggle("orthoSpine")}
                                    className="relative w-16 h-8 rounded-full p-1 flex items-center cursor-pointer transition-all"
                                >
                                    <span className={toggleClasses(toggles.orthoSpine)} />
                                    <span className={handleClasses(toggles.orthoSpine)} />
                                </button>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex flex-col">
                                    <span className="text-lg">Ortho/Extremities</span>
                                    <span className="text-gray-500 text-sm">toggle if they see ortho Extremities</span>
                                </div>
                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={toggles.orthoExtremities}
                                    onClick={() => handleToggle("orthoExtremities")}
                                    className="relative w-16 h-8 rounded-full p-1 flex items-center cursor-pointer transition-all"
                                >
                                    <span className={toggleClasses(toggles.orthoExtremities)} />
                                    <span className={handleClasses(toggles.orthoExtremities)} />
                                </button>
                            </div>
                        </div>
                    </div>


                </div>
                <div className="w-full md:flex-[1.8] ">

                    <hr />

                    <CollapsibleSection title="File attachment and Notes">
                        <p className="text-sm -mt-3 mb-6 text-[#00000080]">Doctor Assigned And Schedule</p>

                        <div className="bg-[#EEF6FF] border border-[#2774CF4D] border-dashed rounded-lg py-8 px-6 flex flex-col items-center justify-center mb-4">
                            <IconUpload className="w-10 h-10 text-[#4C95EB] mb-3" />
                            <div className="font-semibold text-lg mb-1">Add Signature</div>
                            <div className="text-xs text-gray-500 mb-4 text-center">Upload an image or take a picture of the signature.</div>

                            <div className="flex gap-3 flex-wrap justify-center">
                                <button
                                    type="button"
                                    className="px-4 py-2 text-sm font-medium bg-white border border-[#2774CF4D] rounded-md hover:border-primary-700"
                                    onClick={() => signatureUploadRef.current?.click()}
                                >
                                    Upload file
                                </button>
                                <button
                                    type="button"
                                    className="px-4 py-2 text-sm font-medium bg-white border border-[#2774CF4D] rounded-md hover:border-primary-700"
                                    onClick={() => signatureCameraRef.current?.click()}
                                >
                                    Take picture
                                </button>
                            </div>

                            <input
                                ref={signatureUploadRef}
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={handleSignatureChange}
                                className="hidden"
                            />
                            <input
                                ref={signatureCameraRef}
                                type="file"
                                accept="image/*"
                                capture="environment"
                                onChange={handleSignatureChange}
                                className="hidden"
                            />
                        </div>

                        {signaturePreview && (
                            <div className="mb-4">
                                <div className="text-sm font-medium mb-2">Signature preview</div>
                                <div className="relative border rounded-md p-3 bg-white">
                                    <button
                                        type="button"
                                        aria-label="Remove signature"
                                        className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
                                        onClick={clearSignaturePreview}
                                    >
                                        <IconX size={18} />
                                    </button>
                                    <img src={signaturePreview} alt="Signature preview" className="max-h-48 object-contain mx-auto" />
                                </div>
                            </div>
                        )}


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
                    </CollapsibleSection>

                    <div className="px-4">
                        {/* WORD-LIKE EDITOR */}
                        <div>
                            <label className="text-sm font-medium mb-2 block">Header</label>
                            <TextEditor
                                value={noteContent}
                                onChange={setNoteContent}
                            />
                        </div>
                    </div>
                    <div className="px-4">
                        {/* WORD-LIKE EDITOR */}
                        <div>
                            <label className="text-sm font-medium mb-2 block">Footer</label>
                            <TextEditor
                                value={noteContent}
                                onChange={setNoteContent}
                            />
                        </div>
                    </div>


                </div>

            </div>
            <div className="flex justify-end mb-7 py-2 px-6 bg-white w-full pb-4 ">
                <button
                    type="submit"
                    disabled={isCreating || isCreatingTemplate}
                    className="bg-primary-700 hover:bg-primary-800 rounded-sm text-white px-6 py-3 font-medium text-lg ml-4 disabled:opacity-50 disabled:cursor-not-allowed"
                > {(isCreating || isCreatingTemplate) ? "Saving..." : "Save"}
                </button>
                <button
                    type="button"
                    className="bg-[#8D1F1B] text-white px-6 py-3 rounded-sm shadow-sm ml-4"
                >
                    <a href="/admin/providers">Cancel</a>
                </button>
            </div>
        </form>
    );
}
