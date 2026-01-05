import { useState, useEffect } from "react";
import { IconBrandAirbnb, IconCalendar, IconRepeat, IconRepeatOnce } from "@tabler/icons-react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/style.css";

export default function BlockTimeModal({ open, onClose }: any) {
  if (!open) return null;

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [allDay, setAllDay] = useState(true);
  const [reason, setReason] = useState("");
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("Company Holiday");
  const [blockType, setBlockType] = useState("Single day");
  const [timezone, setTimezone] = useState("Europe/Paris");

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-4xl rounded-2xl p-8 shadow-xl">
        {/* Header */}
        <div className="flex items-center gap-2 text-xl font-semibold mb-6">
          <IconCalendar size={26} /> Block Time
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* LEFT SIDE */}
          <div>
            <p className="text-gray-600 mb-2 font-medium text-sm">Pick a date</p>

            {/* Calendar */}
            <div className="border rounded-lg p-4">
              <style jsx global>{`
                .rdp {
                  --rdp-accent-color: #1e40af;
                  --rdp-background-color: #1e40af;
                  margin: 0;
                }
                .rdp-month {
                  width: 100%;
                }
                .rdp-caption {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  padding: 0 0 1rem 0;
                }
                .rdp-nav {
                  display: flex;
                  gap: 0.5rem;
                }
                .rdp-button {
                  border-radius: 100%;
                  width: 36px;
                  height: 36px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  cursor: pointer;
                  border: none;
                  background: transparent;
                }
                .rdp-button:hover {
                  background-color: #f3f4f6;
                }
                .rdp-day_button {
                  width: 36px;
                  height: 36px;
                  font-size: 0.8125rem;
                }
                .rdp-day_selected .rdp-day_button {
                  background-color: #1e40af;
                  color: white;
                  font-weight: 600;
                }
                .rdp-day_today:not(.rdp-day_selected) .rdp-day_button {
                  font-weight: 600;
                  color: #1e40af;
                }
                .rdp-weekday {
                  font-size: 0.675rem;
                  font-weight: 600;
                  color: #6b7280;
                  text-transform: uppercase;
                }
                .rdp-month_caption {
                  font-size: 0.95rem;
                  font-weight: 600;
                  color: #111827;
                }
                .rdp-dropdowns {
                  display: flex;
                  gap: 0.25rem;
                  position: relative;
                }
                .rdp-dropdown {
                  appearance: none;
                  background-color: transparent;
                  border: none;
                  font-size: 1rem;
                  font-weight: 600;
                  padding: 0.25rem 1.5rem 0.25rem 0.25rem;
                  cursor: pointer;
                  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
                  background-repeat: no-repeat;
                  background-position: right 0.25rem center;
                  background-size: 1rem;
                }
                .rdp-dropdown:hover {
                  background-color: #f3f4f6;
                  border-radius: 0.25rem;
                }
                .rdp-nav_button_previous,
                .rdp-nav_button_next {
                  width: 32px;
                  height: 32px;
                  border-radius: 50%;
                  background-color: #e5e7eb;
                }
                .rdp-nav_button_previous:hover,
                .rdp-nav_button_next:hover {
                  background-color: #d1d5db;
                }
              `}</style>
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                showOutsideDays
                captionLayout="dropdown-months"
                fromYear={2020}
                toYear={2030}
              />
            </div>

            {/* Timezone */}
            <div className="mt-6 flex items-center gap-2">
              <IconCalendar size={18} className="text-gray-600" />
              <label className="text-sm font-medium">Time Zone:</label>
              <select
                className="flex-1 bg-[#0060E614] rounded-md px-2 py-1.5 text-sm focus:outline-none"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
              >
                <option>Europe/Paris</option>
                <option>Africa/Addis_Ababa</option>
                <option>America/New_York</option>
                <option>Asia/Tokyo</option>
                <option>UTC</option>
              </select>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-6">
            {/* Quick Template */}
            <div>
              <p className="font-medium mb-2 text-gray-700 text-sm">Quick Template</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Full Day Off",
                  "Morning Block",
                  "Afternoon Block",
                  "Lunch Break",
                  "Company Holiday",
                ].map((label, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedTemplate(label)}
                    className={`px-4 py-2 text-sm rounded-full border transition-all ${selectedTemplate === label
                      ? "bg-primary-700 text-white border-blue-600"
                      : "border-primary-700 text-gray-700 hover:bg-blue-50 hover:border-blue-300"
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Block Type */}

            <div>
              <p className="font-medium mb-2 text-gray-700 text-sm">Block type</p>
              <div className="flex border rounded-lg overflow-hidden bg-white">
                {[
                  { label: "Recurring", icon: <IconRepeat size={18} /> },
                  { label: "Single day", icon: <IconRepeatOnce size={18} /> },
                  { label: "Holiday", icon: <IconBrandAirbnb size={18} /> },
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={() => setBlockType(item.label)}
                    className={`flex-1 px-4 py-3 text-sm border-r last:border-r-0 transition-all flex items-center justify-center gap-2
          ${blockType === item.label
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Reason */}
            <div>
              <p className="font-medium mb-2 text-gray-700 text-sm">Reason</p>
              <input
                type="text"
                placeholder="Vacation"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            {/* All Day Switch */}
            <div className="flex items-center justify-between">
              <label className="font-medium text-sm">All Day</label>

              <button
                role="switch"
                aria-checked={allDay}
                onClick={() => {
                  const newVal = !allDay;
                  setAllDay(newVal);
                  if (!newVal) {
                    if (!timeStart) setTimeStart("09:00");
                    if (!timeEnd) setTimeEnd("17:00");
                  } else {
                    // optionally clear times when switching back to all day
                    // setTimeStart(""); setTimeEnd("");
                  }
                }}
                className="relative w-12 h-7 rounded-full bg-gray-200 p-1 flex items-center cursor-pointer transition-all"
              >
                {/* Background highlight */}
                <span
                  className={`absolute inset-0 rounded-full transition-colors ${allDay ? "bg-[#25514A]" : "bg-[#42928526]"
                    }`}
                />

                {/* Handle */}
                <span
                  className={`relative z-10 block h-6 w-6 rounded-full bg-white shadow-[0_6px_20px_rgba(0,0,0,0.12)] transition-transform duration-300 ${allDay ? "translate-x-5" : "translate-x-0"
                    }`}
                />
              </button>
            </div>

            {/* TIME INPUTS when allDay is false */}
            {!allDay && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Start Time</label>
                  <input
                    type="time"
                    className="w-full border rounded-md px-2 py-1.5 mt-1 text-sm"
                    value={timeStart}
                    onChange={(e) => setTimeStart(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">End Time</label>
                  <input
                    type="time"
                    className="w-full border rounded-md px-2 py-1.5 mt-1 text-sm"
                    value={timeEnd}
                    onChange={(e) => setTimeEnd(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* time validation message */}
            {!allDay && timeStart && timeEnd && timeStart >= timeEnd && (
              <p className="text-sm text-red-600 mt-2">End time must be after start time.</p>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-4 mt-10">


          <button
            className="px-8 py-3 bg-primary-700 text-white rounded-md transition-colors font-medium"
            onClick={() => {
              console.log({
                selectedDate,
                selectedTemplate,
                blockType,
                reason,
                allDay,
                timeStart,
                timeEnd,
                timezone
              });
              // Handle block logic here
            }}
          >
            Block
          </button>
          <button
            className="px-6 py-3 bg-red-700 text-white rounded-md hover:bg-red-800 transition-colors font-medium"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
