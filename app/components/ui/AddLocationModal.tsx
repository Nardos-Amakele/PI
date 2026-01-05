"use client";

import React, { useEffect, useState } from "react";
import {
  IconX,
} from "@tabler/icons-react";
import { useCreateLocationMutation, useGetLocationByIdQuery, useUpdateLocationMutation } from "@/app/services/locations/locationsApi";

type Props = {
  open: boolean;
  onClose: () => void;
  locationId?: string | null;
};

const emptyForm = {
  npi: "",
  name: "",
  officeAddress: "",
  placeOfService: "",
  phone: "",
  city: "",
  state: "",
  fax: "",
  zip: "",
  status: "active" as "active" | "inactive",
};

export default function AddLocationModal({ open, onClose, locationId }: Props) {
  const isEdit = Boolean(locationId);
  const [createLocation, { isLoading: isCreating }] = useCreateLocationMutation();
  const [updateLocation, { isLoading: isUpdating }] = useUpdateLocationMutation();
  const { data: locationResponse, isFetching: isFetchingLocation } = useGetLocationByIdQuery(locationId ?? "", {
    skip: !open || !locationId,
  });
  const [formData, setFormData] = useState(emptyForm);

  // Reset when opening for create
  useEffect(() => {
    if (open && !isEdit) {
      setFormData(emptyForm);
    }
  }, [open, isEdit]);

  // Clear before fetching edit data to avoid showing stale values
  useEffect(() => {
    if (open && isEdit) {
      setFormData(emptyForm);
    }
  }, [open, isEdit, locationId]);

  // Prefill when editing
  useEffect(() => {
    if (!isEdit || !locationResponse?.data?.location) return;
    const loc = locationResponse.data.location;
    setFormData({
      npi: loc.npiNumber ?? "",
      name: loc.name ?? "",
      officeAddress: loc.address?.office_address ?? "",
      placeOfService: loc.serviceCode != null ? String(loc.serviceCode) : "",
      phone: loc.address?.phone_number ?? "",
      city: loc.address?.city ?? "",
      state: loc.address?.state ?? "",
      fax: loc.address?.fax ?? "",
      zip: loc.address?.postal_code ?? "",
      status: loc.status,
    });
  }, [isEdit, locationResponse]);

  const handleChange = (key: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.officeAddress) return;

    const payload = {
      name: formData.name,
      address: {
        office_address: formData.officeAddress,
        city: formData.city || undefined,
        state: formData.state || undefined,
        fax: formData.fax || undefined,
        postal_code: formData.zip || undefined,
        phone_number: formData.phone || undefined,
      },
      npiNumber: formData.npi || undefined,
      serviceCode: formData.placeOfService ? Number(formData.placeOfService) : undefined,
      status: formData.status,
    };

    try {
      if (isEdit && locationId) {
        await updateLocation({ id: locationId, body: payload }).unwrap();
      } else {
        await createLocation(payload).unwrap();
      }
      onClose();
    } catch (err) {
      // TODO: replace with toast once available
      console.error("Failed to save location", err);
    }
  };

  if (!open) return null;

  const saving = isCreating || isUpdating;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      {/* Modal */}
      <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-lg p-8">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <IconX size={20} />
        </button>

        {/* Header */}
        <h2 className="text-2xl font-semibold mb-1">
          {isEdit ? "Edit Location" : "Add A New Location"}
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          {isEdit ? "Update location details" : "Configure the location details"}
        </p>
        {isEdit && isFetchingLocation && (
          <p className="text-sm text-gray-500 mb-4">Loading location…</p>
        )}

        {/* Form Grid */}
        <div className="grid grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-4">
            {/* NPI */}
            <div>
              <label className="text-sm font-medium flex items-center gap-2">
                NPI Number
              </label>
              <input
                value={formData.npi}
                onChange={handleChange("npi")}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            {/* Name */}
            <Input
              label="Name"
              placeholder="Eg. John Clinic"
              value={formData.name}
              onChange={handleChange("name")}
            />

            {/* Office Address */}
            <Input
              label="Office Address"
              placeholder="Eg. Main Street"
              value={formData.officeAddress}
              onChange={handleChange("officeAddress")}
            />

            {/* Place of Service */}
            <Input
              label="Place Of Service Code"
              placeholder="Eg. 11"
              value={formData.placeOfService}
              onChange={handleChange("placeOfService")}
            />

            {/* Phone */}
            <Input
              label="Phone"
              placeholder="Eg. +251 9xxxxxxx"
              value={formData.phone}
              onChange={handleChange("phone")}
            />
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <Input
              label="City"
              placeholder="Eg. Addis Ababa"
              value={formData.city}
              onChange={handleChange("city")}
            />
            <Input
              label="State"
              placeholder="Eg. Addis"
              value={formData.state}
              onChange={handleChange("state")}
            />
            <Input
              label="Fax"
              placeholder="Eg. 011xxxxxx"
              value={formData.fax}
              onChange={handleChange("fax")}
            />
            <Input
              label="Zip"
              placeholder="Eg. 1000"
              value={formData.zip}
              onChange={handleChange("zip")}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-6 py-3 rounded-md bg-primary-700 text-white text-sm disabled:opacity-60"
          >
            {saving ? "Saving..." : isEdit ? "Update" : "Add"}
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-md bg-red-700 text-white text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* Reusable Input */
function Input({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
      />
    </div>
  );
}
