"use client";

import { useState } from "react";
import { IconCalendar } from "@tabler/icons-react";

export default function ProviderBookingPreferences({ onClose, onSave }: any) {
  const [ageOption, setAgeOption] = useState("all");
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [capacity, setCapacity] = useState("12");
  const [per, setPer] = useState("Week");

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[2000] p-4" onClick={onClose}>
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-lg p-8" onClick={(e) => e.stopPropagation()}>

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <IconCalendar size={28} className="text-gray-700" />
          <h1 className="text-2xl font-semibold">Provider Booking Preferences</h1>
        </div>

        {/* AGE RESTRICTIONS */}
        <h2 className="font-medium mb-4">Patient Age Restrictions</h2>

        <div className="flex flex-col gap-4">

          {/* OPTION — All Ages */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              name="age"
              checked={ageOption === "all"}
              onChange={() => setAgeOption("all")}
              className="mt-1"
            />
            <div>
              <p className="font-medium">All ages</p>
              <p className="text-sm text-gray-500">Works with any age</p>
            </div>
          </label>

          {/* OPTION — Adult */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              name="age"
              checked={ageOption === "adult"}
              onChange={() => setAgeOption("adult")}
              className="mt-1"
            />
            <div>
              <p className="font-medium">Adult only (18+)</p>
              <p className="text-sm text-gray-500">Works with adults only</p>
            </div>
          </label>

          {/* OPTION — Pediatric */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              name="age"
              checked={ageOption === "pediatric"}
              onChange={() => setAgeOption("pediatric")}
              className="mt-1"
            />
            <div>
              <p className="font-medium">Pediatric only (0–17)</p>
              <p className="text-sm text-gray-500">Works with kids</p>
            </div>
          </label>

          {/* OPTION — Custom Range */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              name="age"
              checked={ageOption === "custom"}
              onChange={() => setAgeOption("custom")}
              className="mt-1"
            />
            <div>
              <p className="font-medium">Custom Range</p>
            </div>
          </label>

          {/* CUSTOM RANGE INPUTS */}
          {ageOption === "custom" && (
            <div className="flex gap-4 pl-7">
              <div className="flex flex-col w-1/2">
                <label className="text-sm font-medium mb-1">Minimum Age</label>
                <input
                  type="number"
                  className="border rounded-md px-3 py-2 bg-[#FAFAFA] shadow-sm"
                  placeholder="0"
                  value={minAge}
                  onChange={(e) => setMinAge(e.target.value)}
                />
              </div>

              <div className="flex flex-col w-1/2">
                <label className="text-sm font-medium mb-1">Maximum Age</label>
                <input
                  type="number"
                  className="border rounded-md px-3 py-2 bg-[#FAFAFA] shadow-sm"
                  placeholder="99"
                  value={maxAge}
                  onChange={(e) => setMaxAge(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* CAPACITY CAP */}
        <h2 className="font-medium mt-10 mb-3 ">Capacity Cap</h2>

        <div className="flex gap-4 ">
          <input
            type="number"
            className="border rounded-md px-4 py-2 w-24 bg-[#FAFAFA] shadow-sm"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
          />
          <div className="flex items-center">patients per</div>

          <select
            className="border rounded-md px-4 py-2 flex-1 bg-[#FAFAFA] shadow-sm"
            value={per}
            onChange={(e) => setPer(e.target.value)}
          >
            <option>Week</option>
            <option>Month</option>
            <option>Day</option>
          </select>
          

        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-4 mt-10">
          <button
            onClick={onClose}
            className="bg-[#A22323] text-white px-6 py-2 rounded-md"
          >
            Cancel
          </button>

          <button
            onClick={() =>
              onSave({ ageOption, minAge, maxAge, capacity, per })
            }
            className="bg-[#155FA1] text-white px-6 py-2 rounded-md"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
