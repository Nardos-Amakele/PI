
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import { useGetLocationsQuery } from "../../../../services/locations/locationsApi";

import {
    IconChevronDown,
    IconChevronLeft,
    IconChevronRight,
    IconEye,
    IconPlus,
} from "@tabler/icons-react";
import { HexColorPicker } from "react-colorful";
import ProvidersDetailsTabs from "../../../../components/navigation/ProviderDetailsTabs";
import { useGetAppointmentTypesQuery } from "../../../../services/appointmentTypes/appointmentTypesApi";
import { useCreateScheduleTemplateMutation } from "@/app/services/scheduling/schedulingApi";
import type { EventClickArg, EventDropArg } from "@fullcalendar/core";
import type { EventReceiveArg, EventResizeDoneArg } from "@fullcalendar/interaction";


export default function ScheduleTemplatePage() {
    const params = useParams();
    const providerId = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";
    // Independent states for each input/select/switch
    const [templateName, setTemplateName] = useState("");
    const [templateDescription, setTemplateDescription] = useState("");
    const [location, setLocation] = useState("");
    const [preCalculatedDate, setPreCalculatedDate] = useState("");
    const [dateStart, setDateStart] = useState("");
    const [dateEnd, setDateEnd] = useState("");
    const [scheduleOnHolidays, setScheduleOnHolidays] = useState(false);
    const [neverExpires, setNeverExpires] = useState(true);
    const [color, setColor] = useState("#9E1616");
    const [showColorPicker, setShowColorPicker] = useState(false);
    // Independent start/end time states for each section
    const [mainStartTime, setMainStartTime] = useState("");
    const [mainEndTime, setMainEndTime] = useState("");
    type TypeBlock = {
        id: string;
        appointmentType: string;
        start: string;
        end: string;
        ranges: { id: string; start: string; end: string }[];
    };
    const [typeBlocks, setTypeBlocks] = useState<TypeBlock[]>([{
        id: crypto.randomUUID(),
        appointmentType: "",
        start: "",
        end: "",
        ranges: [],
    }]);
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [dragDropType, setDragDropType] = useState("");
    const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
    const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const calendarRef = useRef<FullCalendar>(null);
    const externalEventsRef = useRef<HTMLDivElement>(null);
    const [rangeTitle, setRangeTitle] = useState("");
    const [repeatInterval, setRepeatInterval] = useState("");
    const [repeatEvery, setRepeatEvery] = useState("");
    const weekOptions = [
        { value: 1, label: "1st" },
        { value: 2, label: "2nd" },
        { value: 3, label: "3rd" },
        { value: 4, label: "4th" },
        { value: 5, label: "5th" },
    ];
    const [weeksOfMonth, setWeeksOfMonth] = useState<number[]>([]);
    const [showWeekDropdown, setShowWeekDropdown] = useState(false);
    const { data: locationsData, isLoading: locationsLoading, error: locationsError } = useGetLocationsQuery({ page: 1, limit: 100 });
    const {
        data: appointmentTypesData,
        isLoading: appointmentTypesLoading,
        isError: appointmentTypesError,
        refetch: refetchAppointmentTypes,
    } = useGetAppointmentTypesQuery({ page: 1, limit: 100 });
    const [createScheduleTemplate, { isLoading: isSaving }] = useCreateScheduleTemplateMutation();
    const appointmentTypeOptions = appointmentTypesData?.data?.appointmentTypes ?? [];
    const filteredDragTypes = useMemo(
        () => (dragDropType ? appointmentTypeOptions.filter((type) => type.id === dragDropType) : appointmentTypeOptions),
        [appointmentTypeOptions, dragDropType],
    );

    const appointmentTypeColorMap = useMemo(() => {
        const palette = ["#0ea5e9", "#22c55e", "#f97316", "#a855f7", "#14b8a6", "#f43f5e", "#475569"];
        const map: Record<string, string> = {};
        appointmentTypeOptions.forEach((type, index) => {
            map[type.id] = type.color || palette[index % palette.length];
        });
        return map;
    }, [appointmentTypeOptions]);

    const timeToMinutes = (time: string) => {
        if (!time) return 0;
        const [h, m] = time.split(":").map(Number);
        return (h || 0) * 60 + (m || 0);
    };

    const isEndBeforeStart = (start: string, end: string) => {
        if (!start || !end) return false;
        return timeToMinutes(end) < timeToMinutes(start);
    };

    const addMinutes = (date: Date, minutes: number) => new Date(date.getTime() + minutes * 60000);

    useEffect(() => {
        if (!externalEventsRef.current) return;

        const draggable = new Draggable(externalEventsRef.current, {
            itemSelector: "[data-appointment-type-id]",
            eventData: (el) => {
                const typeId = el.getAttribute("data-appointment-type-id");
                if (!typeId) return false;
                const type = appointmentTypeOptions.find((t) => t.id === typeId);
                if (!type) return false;
                return {
                    id: crypto.randomUUID(),
                    title: type.title,
                    extendedProps: {
                        appointmentTypeId: type.id,
                        durationMinutes: type.duration || 30,
                    },
                };
            },
        });

        return () => draggable.destroy();
    }, [appointmentTypeOptions]);

    const upsertEventFromApi = (event: EventReceiveArg["event"] | EventDropArg["event"] | EventResizeDoneArg["event"]) => {
        const start = event.start ?? new Date();
        const durationMinutes = Number(event.extendedProps.durationMinutes) || 30;
        const end = event.end ?? addMinutes(start, durationMinutes);
        const appointmentTypeId = event.extendedProps.appointmentTypeId as string | undefined;
        const colorForType = appointmentTypeId ? appointmentTypeColorMap[appointmentTypeId] : "#1f2937";
        const calculatedDuration = Math.max(1, Math.round((end.getTime() - start.getTime()) / 60000));

        event.setEnd(end);
        event.setProp("backgroundColor", colorForType);
        event.setProp("borderColor", colorForType);
        event.setExtendedProp("durationMinutes", calculatedDuration);

        setCalendarEvents((prev) => [
            ...prev.filter((ev) => ev.id !== event.id),
            {
                id: event.id,
                title: event.title,
                start: start.toISOString(),
                end: end.toISOString(),
                backgroundColor: colorForType,
                borderColor: colorForType,
                extendedProps: { ...event.extendedProps, durationMinutes: calculatedDuration },
            },
        ]);
    };

    const handleEventReceive = (info: EventReceiveArg) => {
        const appointmentTypeId = info.event.extendedProps.appointmentTypeId as string | undefined;
        const selectedType = appointmentTypeOptions.find((type) => type.id === appointmentTypeId);
        if (selectedType) {
            info.event.setProp("title", selectedType.title);
        }
        upsertEventFromApi(info.event);
    };

    const handleEventDrop = (info: EventDropArg) => {
        upsertEventFromApi(info.event);
    };

    const handleEventResize = (info: EventResizeDoneArg) => {
        upsertEventFromApi(info.event);
    };

    const handleEventClick = (info: EventClickArg) => {
        info.jsEvent.preventDefault();
        const confirmed = window.confirm("Remove this slot?");
        if (!confirmed) return;
        info.event.remove();
        setCalendarEvents((prev) => prev.filter((ev) => ev.id !== info.event.id));
    };


    return (
        <div >
            <div className='bg-white mb-6'>
                <div className="flex items-center justify-between  mt-6 py-6 bg-white max-w-7xl mx-auto">
                    <div>
                        <h1 className="text-2xl font-semibold mb-1">Schedule Builder</h1>
                        <p className="text-gray-500 text-sm"> Dr. Margaret, Orthopedics</p>
                    </div>
                </div>
                <div className='pb-4'>
                    <ProvidersDetailsTabs />
                </div>
            </div>

            <div className="flex">
                {/* LEFT PANEL */}
                <div className="w-[360px] bg-white border-r p-4">
                    <h2 className="text-sm font-semibold text-gray-600 text-center mb-4">Update schedule template</h2>
                    <h1 className="text-gray-600 font-bold text-lg mb-4">Template Name</h1>
                    {/* Template Name */}
                    <div className="mb-4">
                        <label className="text-sm font-medium">Name</label>
                        <div className="flex items-center gap-2 mt-1 relative">
                            <input
                                type="text"
                                className="flex-1 border rounded-md px-3 py-2 text-sm bg-[#FAFAFA]"
                                placeholder="name placeholder"
                                value={templateName}
                                onChange={e => setTemplateName(e.target.value)}
                            />
                            <button
                                type="button"
                                className="inline-block w-12 h-9 rounded-sm border border-gray-200"
                                style={{ backgroundColor: color }}
                                aria-label="Choose color"
                                onClick={() => setShowColorPicker((open) => !open)}
                            />
                            {showColorPicker && (
                                <div className="absolute right-0 top-12 z-20 bg-white border rounded-md shadow-lg p-3 w-64">
                                    <HexColorPicker color={color} onChange={setColor} />
                                    <div className="flex items-center gap-2 mt-3">
                                        <input
                                            type="text"
                                            value={color}
                                            onChange={(e) => setColor(e.target.value)}
                                            className="w-24 border rounded-md px-2 py-1 text-sm"
                                        />

                                        <button
                                            type="button"
                                            className="text-xs px-3 py-1 border rounded-md border-primary-700"
                                            onClick={() => setShowColorPicker(false)}
                                        >
                                            Done
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Description */}
                    <div className="mb-4">
                        <label className="text-sm font-medium">Description</label>
                        <input
                            type="text"
                            className="w-full border rounded-md px-3 py-2 mt-1 text-sm bg-[#FAFAFA]"
                            placeholder="description placeholder"
                            value={templateDescription}
                            onChange={e => setTemplateDescription(e.target.value)}
                        />
                    </div>
                    <h1 className="text-gray-600 font-bold text-lg mb-4">Apply to</h1>


                    {/* Apply To */}
                    <div className="mb-4">
                        <p className="text-sm font-medium mb-1">Location</p>
                        <div className="relative w-full">
                            <select
                                name="location"
                                value={location}
                                onChange={e => setLocation(e.target.value)}
                                className="appearance-none w-full bg-[#FAFAFA] border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                disabled={locationsLoading || !!locationsError}
                            >
                                <option value="">All</option>
                                {(locationsData?.data?.locations || []).map((loc) => {
                                    const label = loc.name || (loc as any).title || loc.address?.office_address || "Untitled location";
                                    return (
                                        <option key={loc.id} value={loc.id}>
                                            {label}
                                        </option>
                                    );
                                })}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <div className="bg-white rounded-lg p-1">
                                    <IconChevronDown size={20} className="text-gray-400" />
                                </div>
                            </div>
                        </div>

                    </div>


                    <h1 className="text-gray-600 font-bold text-lg mb-4">Apply on</h1>
                    {/* Apply On */}
                    <div className="mb-4">
                        <p className="text-sm font-medium mb-1">Pre Calculated Date</p>
                        <div className="relative w-full">
                            <select
                                name="preCalculatedDate"
                                value={preCalculatedDate}
                                onChange={e => setPreCalculatedDate(e.target.value)}
                                className="appearance-none w-full bg-[#FAFAFA] border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Next Month</option>
                                <option value="Ortho">Next Week</option>
                                <option value="Neuro">Today</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <div className="bg-white rounded-lg p-1">
                                    <IconChevronDown size={20} className="text-gray-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Dates */}
                    <div className="flex gap-4 mb-4">
                        <input
                            type="date"
                            className="border border-[#D9D9D9] w-1/2 rounded-md px-3 py-2 text-sm text-[#808080] bg-[#FAFAFA]"
                            value={dateStart}
                            onChange={e => setDateStart(e.target.value)}
                        />
                        {!neverExpires && (
                            <input
                                type="date"
                                className="border border-[#D9D9D9] w-1/2 rounded-md px-3 py-2 text-sm text-[#808080] bg-[#FAFAFA]"
                                value={dateEnd}
                                onChange={e => setDateEnd(e.target.value)}
                            />
                        )}
                    </div>
                    <div className="flex gap-4 mb-4">
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-700">Schedule on holidays</span>
                            <button
                                onClick={() => setScheduleOnHolidays(!scheduleOnHolidays)}
                                className={`w-10 h-5 rounded-full relative transition ${scheduleOnHolidays ? "bg-primary-700" : "bg-gray-300"}`}
                            >
                                <span
                                    className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition ${scheduleOnHolidays ? "right-0.5" : "left-0.5"}`}
                                />
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-700">Never Expires</span>
                            <button
                                onClick={() => setNeverExpires(!neverExpires)}
                                className={`w-10 h-5 rounded-full relative transition ${neverExpires ? "bg-primary-700" : "bg-gray-300"}`}
                            >
                                <span
                                    className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition ${neverExpires ? "right-0.5" : "left-0.5"}`}
                                />
                            </button>
                        </div>
                    </div>
                    {/* Repeat settings */}
                    <div className="flex gap-4 mb-4">
                        {/* Dropdown with label */}
                        <div className="w-full">
                            <label className="text-sm font-medium mb-1 block">Frequency</label>

                            <div className="relative w-full">
                                <select
                                    value={repeatInterval}
                                    onChange={(e) => setRepeatInterval(e.target.value)}
                                    className="appearance-none w-full bg-[#FAFAFA] border border-gray-300 rounded-md px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Select</option>
                                    <option value="monthly">Monthly</option>
                                    <option value="yearly">Yearly</option>
                                </select>

                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                    <div className="bg-white rounded-lg p-1">
                                        <IconChevronDown size={20} className="text-gray-400" />
                                    </div>
                                </div>
                            </div>
                        </div>



                        {/* Every X month */}
                        <div className="flex-1">
                            <label className="text-sm font-medium mb-1 block">&nbsp;</label>
                            <div className="flex items-center gap-2 rounded-md px-3 py-2">
                                <span className="text-sm text-gray-500">Every</span>
                                <input
                                    type="number"
                                    min={1}
                                    value={repeatEvery}
                                    onChange={(e) => setRepeatEvery(e.target.value)}
                                    className="w-12  text-center border rounded-md text-sm bg-[#FAFAFA]"
                                />
                                <span className="text-sm text-gray-500">month</span>
                            </div>
                        </div>
                    </div>

                    {/* Week of Month */}
                    <div className="mb-4">
                        <label className="text-sm font-medium mb-1 block">On The</label>
                        <div className="relative w-full" onMouseLeave={() => setShowWeekDropdown(false)}>
                            <button
                                type="button"
                                onClick={() => setShowWeekDropdown((open) => !open)}
                                className="w-full bg-[#FAFAFA] border border-gray-300 rounded-md px-3 py-2 pr-10 text-sm text-left focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between"
                            >
                                <span className="text-gray-700">
                                    {weeksOfMonth.length
                                        ? weekOptions
                                            .filter((opt) => weeksOfMonth.includes(opt.value))
                                            .map((opt) => opt.label)
                                            .join(", ")
                                        : "Select week(s)"}
                                </span>
                                <IconChevronDown size={20} className={`text-gray-400 transition-transform ${showWeekDropdown ? "rotate-180" : ""}`} />
                            </button>

                            {showWeekDropdown && (
                                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-md">
                                    {weekOptions.map((opt) => {
                                        const isSelected = weeksOfMonth.includes(opt.value);
                                        return (
                                            <button
                                                type="button"
                                                key={opt.value}
                                                className={`flex items-center justify-between w-full px-3 py-2 text-sm hover:bg-gray-50 ${isSelected ? "text-primary-700" : "text-gray-700"}`}
                                                onClick={() =>
                                                    setWeeksOfMonth((prev) =>
                                                        prev.includes(opt.value)
                                                            ? prev.filter((v) => v !== opt.value)
                                                            : [...prev, opt.value]
                                                    )
                                                }
                                            >
                                                <span>{opt.label}</span>
                                                {isSelected && <span className="text-xs font-semibold">Selected</span>}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>



                    {/* Weekdays */}
                    <div className="mb-4">
                        <label className="text-xs text-gray-600 block mb-1">Weekdays</label>
                        <div className="flex justify-between gap-1">
                            {weekdays.map((day) => {
                                const isSelected = selectedDays.includes(day);
                                return (
                                    <div
                                        key={day}
                                        onClick={() => {
                                            setSelectedDays((prev) =>
                                                isSelected
                                                    ? prev.filter((d) => d !== day)
                                                    : [...prev, day]
                                            );
                                        }}
                                        className={`flex-1 text-center text-sm py-1 px-2 rounded-lg border cursor-pointer ${isSelected ? "bg-[#0F57909E] text-white" : "bg-white text-gray-700"} transition-colors duration-200`}
                                    >
                                        {day}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <button
                        type="button"
                        className="bg-primary-700 text-white px-6 py-1 rounded-sm items-center justify-center shadow-sm mx-auto flex gap-2 mb-4"
                    >
                        <IconEye size={18} className="ml-auto" />
                        <span>Preview</span>
                    </button>
                    <h1 className="text-gray-600 font-bold text-lg mb-4">Type and Select</h1>

                    {typeBlocks.map((block, blockIdx) => (
                        <div key={block.id} className="mb-6 border border-gray-200 rounded-md p-3">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-semibold text-gray-700">Type {blockIdx + 1}</p>
                                {typeBlocks.length > 1 && (
                                    <button
                                        type="button"
                                        className="text-xs text-red-600 hover:text-red-700"
                                        onClick={() => setTypeBlocks((prev) => prev.filter((b) => b.id !== block.id))}
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                            <div className="mb-4">
                                <p className="text-sm font-medium mb-1">Select Appointment Type</p>
                                <div className="relative w-full">
                                    <select
                                        name="appointmentType"
                                        value={block.appointmentType}
                                        onChange={e =>
                                            setTypeBlocks((prev) =>
                                                prev.map((b) =>
                                                    b.id === block.id ? { ...b, appointmentType: e.target.value } : b
                                                )
                                            )
                                        }
                                        className="appearance-none w-full bg-[#FAFAFA] border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        disabled={appointmentTypesLoading || appointmentTypesError}
                                    >
                                        <option value="">{appointmentTypesLoading ? "Loading..." : "All"}</option>
                                        {appointmentTypeOptions.map((type) => (
                                            <option key={type.id} value={type.id}>
                                                {type.title}
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
                            <div className="flex gap-4 mb-4">
                                <div className="flex-1">
                                    <label className="text-sm font-medium text-[#808080]">Start Time</label>
                                    <input
                                        type="time"
                                        className="w-full border rounded-md px-2 py-1.5 mt-1 text-sm bg-[#FAFAFA]"
                                        value={block.start}
                                        onChange={e =>
                                            setTypeBlocks((prev) => prev.map((b) => b.id === block.id ? { ...b, start: e.target.value } : b))
                                        }
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="text-sm font-medium text-[#808080]">End Time</label>
                                    <input
                                        type="time"
                                        className="w-full border rounded-md px-2 py-1.5 mt-1 text-sm bg-[#FAFAFA]"
                                        value={block.end}
                                        onChange={e => {
                                            const next = e.target.value;
                                            if (isEndBeforeStart(block.start, next)) return;
                                            setTypeBlocks((prev) => prev.map((b) => b.id === block.id ? { ...b, end: next } : b));
                                        }}
                                    />
                                </div>
                            </div>

                            {block.ranges.map((range) => (
                                <div className="flex gap-4 mb-3" key={range.id}>
                                    <div className="flex-1">
                                        <label className="text-sm font-medium text-[#808080]">Start Time</label>
                                        <input
                                            type="time"
                                            className="w-full border rounded-md px-2 py-1.5 mt-1 text-sm bg-[#FAFAFA]"
                                            value={range.start}
                                            onChange={(e) =>
                                                setTypeBlocks((prev) =>
                                                    prev.map((b) => b.id === block.id
                                                        ? {
                                                            ...b,
                                                            ranges: b.ranges.map((r) => r.id === range.id ? { ...r, start: e.target.value } : r),
                                                        }
                                                        : b
                                                    )
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-sm font-medium text-[#808080]">End Time</label>
                                        <input
                                            type="time"
                                            className="w-full border rounded-md px-2 py-1.5 mt-1 text-sm bg-[#FAFAFA]"
                                            value={range.end}
                                            onChange={(e) => {
                                                const next = e.target.value;
                                                if (isEndBeforeStart(range.start, next)) return;
                                                setTypeBlocks((prev) =>
                                                    prev.map((b) => b.id === block.id
                                                        ? {
                                                            ...b,
                                                            ranges: b.ranges.map((r) => r.id === range.id ? { ...r, end: next } : r),
                                                        }
                                                        : b
                                                    )
                                                );
                                            }}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        className="self-end text-xs text-red-600 hover:text-red-700"
                                        onClick={() =>
                                            setTypeBlocks((prev) =>
                                                prev.map((b) => b.id === block.id
                                                    ? { ...b, ranges: b.ranges.filter((r) => r.id !== range.id) }
                                                    : b
                                                )
                                            )
                                        }
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}

                            <button
                                type="button"
                                className="flex mx-auto items-center gap-1 text-xs mt-2"
                                onClick={() =>
                                    setTypeBlocks((prev) =>
                                        prev.map((b) => b.id === block.id
                                            ? {
                                                ...b,
                                                ranges: [...b.ranges, { id: crypto.randomUUID(), start: "", end: "" }],
                                            }
                                            : b
                                        )
                                    )
                                }
                            >
                                <IconPlus size={14} />
                                Add time range
                            </button>
                        </div>
                    ))}

                    <hr />
                    <button
                        className="flex text-xs items-center justify-center my-2"
                        type="button"
                        onClick={() =>
                            setTypeBlocks((prev) => [
                                ...prev,
                                { id: crypto.randomUUID(), appointmentType: "", start: "", end: "", ranges: [] },
                            ])
                        }
                    >
                        <IconPlus size={14} />
                        Add Appointment Type
                    </button>
                    <hr />

                    <h1 className="text-gray-600 font-bold text-lg mb-4">Drag and Drop</h1>
                    <div className="mb-4">
                        <p className="text-sm font-medium mb-1">Select Appointment Type</p>
                        <div className="relative w-full">
                            <select
                                name="dragDropType"
                                value={dragDropType}
                                onChange={e => setDragDropType(e.target.value)}
                                className="appearance-none w-full bg-[#FAFAFA] border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                disabled={appointmentTypesLoading || appointmentTypesError}
                            >
                                <option value="">{appointmentTypesLoading ? "Loading..." : "All"}</option>
                                {appointmentTypeOptions.map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {type.title}
                                    </option>
                                ))}
                            </select>


                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <div className="bg-white rounded-lg p-1">
                                    <IconChevronDown size={20} className="text-gray-400" />
                                </div>
                            </div>
                            {appointmentTypesError && (
                                <div className="mt-2 text-xs text-red-600 flex items-center justify-between">
                                    <span>Failed to load appointment types.</span>
                                    <button
                                        type="button"
                                        className="underline"
                                        onClick={() => refetchAppointmentTypes()}
                                    >
                                        Retry
                                    </button>
                                </div>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            Drag a type below onto the calendar, then drag its edges in the calendar to expand or shrink the time range.
                        </p>
                        <div
                            ref={externalEventsRef}
                            className="mt-3 space-y-2"
                            aria-label="Draggable appointment types"
                        >
                            {filteredDragTypes.length === 0 && !appointmentTypesLoading && (
                                <div className="text-xs text-gray-500">No appointment types found.</div>
                            )}
                            {filteredDragTypes.map((type) => {
                                const colorForType = appointmentTypeColorMap[type.id];
                                return (
                                    <div
                                        key={type.id}
                                        data-appointment-type-id={type.id}
                                        className="flex items-center justify-between rounded-md border px-3 py-2 bg-white shadow-sm cursor-move"
                                        style={{ borderColor: colorForType, boxShadow: `inset 0 0 0 1px ${colorForType}` }}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span
                                                aria-hidden
                                                className="h-3 w-3 rounded-full"
                                                style={{ backgroundColor: colorForType }}
                                            />
                                            <span className="text-sm font-medium text-gray-800">{type.title}</span>
                                        </div>
                                        <span className="text-xs text-gray-600">{type.duration || 30}m</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>


                    {/* Footer Buttons */}
                    <div className="flex justify-end gap-4 py-2 bg-white pb-4 mt-8 mb-7">
                        <button
                            type="submit"
                            className="bg-primary-700 hover:bg-primary-800 rounded-sm text-white px-6 py-1 font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSaving}
                        >
                            Draft
                        </button>
                        <button
                            type="button"
                            className="bg-primary-700 text-white px-6 py-1 rounded-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSaving || !providerId}
                            onClick={async () => {
                                if (!providerId) return;

                                const dayNumberMap: Record<string, number> = {
                                    Mon: 1,
                                    Tue: 2,
                                    Wed: 3,
                                    Thu: 4,
                                    Fri: 5,
                                    Sat: 6,
                                    Sun: 7,
                                };

                                const daysOfWeek = selectedDays
                                    .map((d) => dayNumberMap[d])
                                    .filter((d): d is number => !!d);

                                const appointmentTypes = typeBlocks.flatMap((block) => {
                                    if (!block.appointmentType) return [];
                                    const entries: { appointmentTypeId: string; startTime: string; endTime: string }[] = [];

                                    if (block.start && block.end) {
                                        entries.push({
                                            appointmentTypeId: block.appointmentType,
                                            startTime: `${block.start}:00`,
                                            endTime: `${block.end}:00`,
                                        });
                                    }

                                    block.ranges.forEach((range) => {
                                        if (range.start && range.end) {
                                            entries.push({
                                                appointmentTypeId: block.appointmentType,
                                                startTime: `${range.start}:00`,
                                                endTime: `${range.end}:00`,
                                            });
                                        }
                                    });

                                    return entries;
                                });

                                const payload = {
                                    providerId,
                                    locationId: location,
                                    name: templateName,
                                    description: templateDescription || undefined,
                                    color,
                                    appointmentTypes,
                                    validFrom: dateStart ? new Date(dateStart).toISOString() : new Date().toISOString(),
                                    validUntil: dateEnd
                                        ? new Date(dateEnd).toISOString()
                                        : neverExpires
                                            ? new Date(dateStart || new Date()).toISOString()
                                            : new Date().toISOString(),
                                    daysOfWeek,
                                    weekFrequency: weeksOfMonth,
                                };
                                console.log("Schedule Template Payload:", payload);


                                try {
                                    await createScheduleTemplate(payload).unwrap();
                                    alert("Schedule template saved.");
                                } catch (err) {
                                    console.error("Failed to save schedule template", err);
                                    alert("Failed to save schedule template. Please try again.");
                                }
                            }}
                        >
                            <span>{isSaving ? "Saving..." : "Save"}</span>
                        </button>
                    </div>
                </div>

                {/* RIGHT CALENDAR */}
                <div className="flex-1 p-4">
                    <div className="w-full">
                        {/* Custom Header */}
                        <div className="flex items-center mb-4 bg-white p-4 rounded-lg">
                            <IconChevronLeft
                                className="cursor-pointer"
                                size={24}
                                onClick={() => calendarRef.current?.getApi().prev()}
                            />

                            <span className="font-medium text-md">
                                {rangeTitle}
                            </span>

                            <IconChevronRight
                                className="cursor-pointer"
                                size={24}
                                onClick={() => calendarRef.current?.getApi().next()}
                            />
                        </div>

                        <FullCalendar
                            ref={calendarRef}
                            plugins={[timeGridPlugin, interactionPlugin]}
                            initialView="timeGridWeek"
                            headerToolbar={false}
                            allDaySlot={false}
                            droppable
                            editable
                            eventDurationEditable
                            eventResizableFromStart
                            eventOverlap
                            slotEventOverlap
                            events={calendarEvents}
                            eventReceive={handleEventReceive}
                            eventDrop={handleEventDrop}
                            eventResize={handleEventResize}
                            eventClick={handleEventClick}
                            height="auto"
                            slotDuration="00:15:00"
                            datesSet={(arg) => {
                                const start = arg.start;
                                const end = new Date(arg.end);
                                end.setDate(end.getDate() - 1); // FullCalendar end is exclusive

                                const options: Intl.DateTimeFormatOptions = {
                                    month: "short",
                                    day: "2-digit",
                                };

                                const startText = start.toLocaleDateString("en-US", options);
                                const endText = end.toLocaleDateString("en-US", options);

                                setRangeTitle(`${startText} – ${endText}`);
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>

    );
}

