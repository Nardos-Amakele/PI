"use client";

import { useState, useRef, useMemo } from "react";
import { IconChevronDown, IconCloudUpload } from "@tabler/icons-react";
import { useGetDocumentClassificationQuery } from "@/app/services/documents/documentsApi";
import type { DocumentCategory, DocumentType, DocumentSubType } from "@/app/services/documents/documentsTypes";

type AddDocumentModalProps = {
    open: boolean;
    onClose: () => void;
    onSave: (data: {
        category: string;
        categoryLabel: string;
        type: string;
        typeLabel: string;
        subType: string;
        subTypeLabel: string;
        name: string;
        date: string;
        files: File[];
    }) => void;
};

export default function AddDocumentModal({ open, onClose, onSave }: AddDocumentModalProps) {
    const [category, setCategory] = useState<string>("");
    const [type, setType] = useState<string>("");
    const [subType, setSubType] = useState<string>("");
    const [name, setName] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [files, setFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data: classificationData, isLoading: isLoadingClassification } = useGetDocumentClassificationQuery();

    const categories: DocumentCategory[] = classificationData?.data || [];

    const typesForCategory: DocumentType[] = useMemo(() => {
        const selected = categories.find((c) => c.id === category);
        return selected?.DocumentTypes || [];
    }, [categories, category]);

    const subTypesForType: DocumentSubType[] = useMemo(() => {
        const selected = typesForCategory.find((t) => t.id === type);
        return selected?.DocumentSubTypes || [];
    }, [typesForCategory, type]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!category) return; // Prevent upload if no category
        const newFiles = Array.from(e.target.files || []);
        setFiles(newFiles.slice(0, 3)); // limit to 3 files
    };

    const handleCategoryChange = (value: string) => {
        setCategory(value);
        setType("");
        setSubType("");
    };

    const handleTypeChange = (value: string) => {
        setType(value);
        setSubType("");
    };

    const handleSave = () => {
        const categoryLabel = categories.find((c) => c.id === category)?.name || "";
        const typeLabel = typesForCategory.find((t) => t.id === type)?.name || "";
        const subTypeLabel = subTypesForType.find((st) => st.id === subType)?.name || "";

        onSave({ category, categoryLabel, type, typeLabel, subType, subTypeLabel, name, date, files });
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg w-full max-w-4xl p-6 relative">
                {/* Modal Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <span>📄</span> Add A Document
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 font-bold">
                        &times;
                    </button>
                </div>

                {/* Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="flex flex-col gap-4">
                        <hr />

                        <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                            <label className="text-lg font-bold w-60 flex flex-col">Document Catagory *<span className="font-light text-gray-500 text-sm">Add the catagory of the document</span></label>
                            <div className="relative w-full flex-1">
                                <select
                                    name="documentCategory"
                                    value={category}
                                    onChange={(e) => handleCategoryChange(e.target.value)}
                                    disabled={isLoadingClassification}
                                    className="appearance-none w-full bg-input-bg border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                                >
                                    <option value="">Select category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
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
                        <hr />

                        <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                            <label className="text-lg font-bold w-60 flex flex-col">Document Type <span className="font-light text-gray-500 text-sm">Imaging→ MRI, X-Ray, CT, Ultrasound</span></label>
                            <div className="relative w-full flex-1">
                                <select
                                    name="documentType"
                                    value={type}
                                    onChange={(e) => handleTypeChange(e.target.value)}
                                    disabled={!category || isLoadingClassification || !typesForCategory.length}
                                    className="appearance-none w-full bg-input-bg border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                                >
                                    <option value="">{category ? "Select type" : "Select category first"}</option>
                                    {typesForCategory.map((t) => (
                                        <option key={t.id} value={t.id}>
                                            {t.name}
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
                        <hr />

                        <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                            <label className="text-lg font-bold w-60 flex flex-col">Sub-Type(conditional)<span className="font-light text-gray-500 text-sm">Imaging→ MRI, X-Ray, CT, Ultrasound</span></label>
                            <div className="relative w-full flex-1">
                                <select
                                    name="documentSubType"
                                    value={subType}
                                    onChange={(e) => setSubType(e.target.value)}
                                    disabled={!type || isLoadingClassification || !subTypesForType.length}
                                    className="appearance-none w-full bg-input-bg border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                                >
                                    <option value="">{type ? "Select sub-type" : "Select type first"}</option>
                                    {subTypesForType.map((st) => (
                                        <option key={st.id} value={st.id}>
                                            {st.name}
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
                        <hr />

                        <div>
                            <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                                <label className="text-lg font-bold w-60 flex flex-col">Document Name<span className="font-light text-gray-500 text-sm">Add the type of the document</span></label>
                                <input
                                    name="city"
                                    // value={form.city}
                                    onChange={(e) => setName(e.target.value)}
                                    className="border border-gray-300 rounded-md px-3 py-2 w-full flex-1 bg-input-bg"
                                />
                            </div>
                        </div>
                        <hr />

                        <div>
                            <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                                <label className="text-lg font-bold w-60 flex flex-col ">Document Date *<span className="font-light text-gray-500 text-sm">Imaging→ MRI, X-Ray, CT, Ultrasound</span></label>
                                <input
                                    name="dateOfLoss"
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="border border-gray-300 rounded-md px-3 py-2 w-full flex-1 bg-input-bg"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col gap-4">
                        {!category && (
                            <p className="text-[#852221] text-sm">
                                Please Choose the document category first to upload a file
                            </p>
                        )}
                        <label
                            htmlFor="file-upload"
                            className={`relative cursor-pointer border-2 border-dashed border-blue-200 rounded-lg flex flex-col items-center justify-center py-16 px-4 bg-blue-50 text-center ${!category ? 'opacity-50 pointer-events-none' : ''}`}
                            onClick={e => {
                                if (!category) {
                                    e.preventDefault();
                                    return;
                                }
                                if (fileInputRef.current) fileInputRef.current.click();
                            }}
                        >
                            <IconCloudUpload size={36} className="text-blue-400 mb-4" />
                            <p className="font-semibold text-black">
                                Drag and Drop or click to add Document
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                Supported formats: JPEG, PNG, GIF, MP4, PDF, PSD, AI, Word
                            </p>
                            <input
                                id="file-upload"
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                onChange={handleFileChange}
                                className="hidden"
                                disabled={!category}
                            />
                        </label>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-4 mt-6">
                    <button
                        onClick={handleSave}
                        className="bg-primary-700 hover:bg-primary-600 text-white px-6 py-2 rounded"
                    >
                        Upload
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-red-700 hover:bg-red-800 text-white px-6 py-2 rounded"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

