"use client";
import { useEffect, useState } from 'react'
import ProvidersDetailsTabs from '../../../../components/navigation/ProviderDetailsTabs'
import { IconMinus, IconPlus } from '@tabler/icons-react';
import { useGetServiceTypesQuery } from '@/app/services/services/serviceApi';
import { useCreateBookingPreferenceMutation, useGetBookingPreferencesQuery, useUpdateBookingPreferenceMutation } from '@/app/services/scheduling/schedulingApi';
import { useGetProviderByIdQuery, useUpdateProviderCapacitySettingMutation } from '@/app/services/providers/providersApi';
import { useParams } from 'next/navigation';
const Page = () => {
    const params = useParams();
    const providerId = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";
    const { data: serviceTypesData, isLoading: serviceTypesLoading, isError: serviceTypesError } = useGetServiceTypesQuery();
    const [createInjectionPreference, { isLoading: savingInjection }] = useCreateBookingPreferenceMutation();
    const [createConsultPreference, { isLoading: savingConsult }] = useCreateBookingPreferenceMutation();
    const [updateBookingPreference, { isLoading: updatingPreference }] = useUpdateBookingPreferenceMutation();
    const { data: bookingPrefsData } = useGetBookingPreferencesQuery(providerId ? { providerId } : undefined, { skip: !providerId });
    const { data: providerData } = useGetProviderByIdQuery(providerId, { skip: !providerId });
    const [updateCapacity, { isLoading: savingCapacity }] = useUpdateProviderCapacitySettingMutation();
    const [selectedServiceTypes, setSelectedServiceTypes] = useState<string[]>([]);
    // Separate state for each section's start/end time
    const [patientsStartTime, setPatientsStartTime] = useState("10:00");
    const [patientsEndTime, setPatientsEndTime] = useState("18:00");
    const [consultsStartTime, setConsultsStartTime] = useState("10:00");
    const [consultsEndTime, setConsultsEndTime] = useState("18:00");
    const [injCapacityDay, setInjCapacityDay] = useState("");
    const [injCapacityHour, setInjCapacityHour] = useState("");
    const [injMorningCapacity, setInjMorningCapacity] = useState("");
    const [injAfternoonCapacity, setInjAfternoonCapacity] = useState("");
    const [consultCapacityDay, setConsultCapacityDay] = useState("");
    const [consultMorningCapacity, setConsultMorningCapacity] = useState("");
    const [consultAfternoonCapacity, setConsultAfternoonCapacity] = useState("");
    const [fullDayCapacity, setFullDayCapacity] = useState("");
    const [morningCapacity, setMorningCapacity] = useState("");
    const [afternoonCapacity, setAfternoonCapacity] = useState("");
    // Separate state for each section's freeze reasons
    const [patientsFreezeReasons, setPatientsFreezeReasons] = useState(["", "", "", ""]);
    const [consultsFreezeReasons, setConsultsFreezeReasons] = useState(["", "", "", ""]);
    // Separate state for each section's selected days
    const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const [patientsSelectedDays, setPatientsSelectedDays] = useState<string[]>([]);
    const [consultsSelectedDays, setConsultsSelectedDays] = useState<string[]>([]);
    const [consultPreferenceId, setConsultPreferenceId] = useState<string | null>(null);
    const [injectionPreferenceId, setInjectionPreferenceId] = useState<string | null>(null);
    // Separate toggles for each section
    const [patientsToggles, setPatientsToggles] = useState({
        pediatrics: false,
        painManagement: false,
    });
    const [consultsToggles, setConsultsToggles] = useState({
        pediatrics: false,
        painManagement: false,
    });
    type CheckItem = {
        id: string;
        label: string;
        value: string;
    };

    const items: CheckItem[] = (serviceTypesData?.data || [])
        .filter((svc) => !!svc?.id)
        .map((svc) => ({
            id: svc.id || "",
            label: svc.title || "Untitled",
            value: svc.id || "",
        }));

    const injectionServiceId = items.find((i) => i.label.toLowerCase().includes("injection"))?.value;
    const consultServiceId = items.find((i) => i.label.toLowerCase() === "office visit")?.value;
    const injectionEnabled = injectionServiceId ? selectedServiceTypes.includes(injectionServiceId) : false;
    const consultEnabled = consultServiceId ? selectedServiceTypes.includes(consultServiceId) : false;
    const injectionNoDoubleDisabled = patientsToggles.painManagement;
    const consultNoDoubleDisabled = consultsToggles.painManagement;

    const toInputString = (v: unknown) => (v === null || v === undefined ? "" : String(v));

    useEffect(() => {
        const capacity = providerData?.data?.provider?.capacitySetting ?? providerData?.data?.capacitySetting;
        if (!capacity) return;
        setFullDayCapacity(toInputString(capacity.fullDayCapacity));
        setMorningCapacity(toInputString(capacity.morningCapacity));
        setAfternoonCapacity(toInputString(capacity.afternoonCapacity));
    }, [providerData]);

    useEffect(() => {
        if (!providerId) return;
        const prefs = bookingPrefsData?.data?.bookingPreferences || [];

        const prefByServiceId: Record<string, typeof prefs[number]> = {};
        prefs.forEach((p) => {
            if (p?.serviceTypeId) prefByServiceId[p.serviceTypeId] = p;
        });

        if (injectionServiceId && prefByServiceId[injectionServiceId]) {
            const p = prefByServiceId[injectionServiceId];
            ensureSelectedService(injectionServiceId);
            setInjectionPreferenceId(p.id);
            setPatientsStartTime(isoToTime(p.startTime));
            setPatientsEndTime(isoToTime(p.endTime));
            setInjCapacityDay(toInputString(p.capacityPerDay));
            setInjCapacityHour(toInputString(p.capacityPerHour));
            setInjMorningCapacity(toInputString(p.morningCapacity));
            setInjAfternoonCapacity(toInputString(p.afternoonCapacity));
            setPatientsSelectedDays(p.daysOfWeek.map((d) => dayNumberToName[d]).filter(Boolean));
            setPatientsToggles({ pediatrics: !!p.doubleBooking, painManagement: !!p.allowOverlapping });
        } else {
            setInjectionPreferenceId(null);
        }

        if (consultServiceId && prefByServiceId[consultServiceId]) {
            const p = prefByServiceId[consultServiceId];
            ensureSelectedService(consultServiceId);
            setConsultPreferenceId(p.id);
            setConsultsStartTime(isoToTime(p.startTime));
            setConsultsEndTime(isoToTime(p.endTime));
            setConsultCapacityDay(toInputString(p.capacityPerDay));
            setConsultMorningCapacity(toInputString(p.morningCapacity));
            setConsultAfternoonCapacity(toInputString(p.afternoonCapacity));
            setConsultsSelectedDays(p.daysOfWeek.map((d) => dayNumberToName[d]).filter(Boolean));
            setConsultsToggles({ pediatrics: !!p.doubleBooking, painManagement: !!p.allowOverlapping });
        } else {
            setConsultPreferenceId(null);
        }
    }, [bookingPrefsData, providerId, injectionServiceId, consultServiceId]);

    const dayNumberMap: Record<string, number> = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 };
    const dayNumberToName: Record<number, string> = { 1: "Mon", 2: "Tue", 3: "Wed", 4: "Thu", 5: "Fri", 6: "Sat", 7: "Sun" };

    const timeToIso = (time: string) => {
        const [h, m] = time.split(":").map(Number);
        const d = new Date();
        d.setUTCHours(h || 0, m || 0, 0, 0);
        return d.toISOString();
    };

    const isoToTime = (iso?: string | null) => {
        if (!iso) return "";
        const d = new Date(iso);
        const hh = String(d.getUTCHours()).padStart(2, "0");
        const mm = String(d.getUTCMinutes()).padStart(2, "0");
        return `${hh}:${mm}`;
    };

    const buildPayload = ({
        serviceTypeId,
        startTime,
        endTime,
        capacityPerDay,
        morningCapacity,
        afternoonCapacity,
        capacityPerHour,
        days,
        doubleBooking,
        allowOverlapping,
    }: {
        serviceTypeId?: string;
        startTime: string;
        endTime: string;
        capacityPerDay?: number;
        morningCapacity?: number;
        afternoonCapacity?: number;
        capacityPerHour?: number;
        days: string[];
        doubleBooking: boolean;
        allowOverlapping: boolean;
    }) => {
        if (!providerId || !serviceTypeId) return null;
        const daysOfWeek = days
            .map((d) => dayNumberMap[d])
            .filter((n): n is number => !!n);

        const payload: any = {
            providerId,
            serviceTypeId,
            startTime: timeToIso(startTime),
            endTime: timeToIso(endTime),
            capacityPerDay: capacityPerDay ?? 0,
            morningCapacity: morningCapacity ?? 0,
            afternoonCapacity: afternoonCapacity ?? 0,
            daysOfWeek,
            weekFrequency: [],
            doubleBooking,
            allowOverlapping,
            validFrom: timeToIso(startTime),
            validUntil: timeToIso(endTime),
        };

        if (capacityPerHour !== undefined) {
            payload.capacityPerHour = capacityPerHour;
        }

        return payload;
    };

    const buildUpdateBody = ({
        startTime,
        endTime,
        capacityPerDay,
        morningCapacity,
        afternoonCapacity,
        capacityPerHour,
        days,
        doubleBooking,
        allowOverlapping,
    }: {
        startTime: string;
        endTime: string;
        capacityPerDay?: number;
        morningCapacity?: number;
        afternoonCapacity?: number;
        capacityPerHour?: number;
        days: string[];
        doubleBooking: boolean;
        allowOverlapping: boolean;
    }) => {
        const daysOfWeek = days
            .map((d) => dayNumberMap[d])
            .filter((n): n is number => !!n);

        const body: any = {
            startTime: timeToIso(startTime),
            endTime: timeToIso(endTime),
            capacityPerDay: capacityPerDay ?? 0,
            morningCapacity: morningCapacity ?? 0,
            afternoonCapacity: afternoonCapacity ?? 0,
            daysOfWeek,
            doubleBooking,
            allowOverlapping,
        };

        if (capacityPerHour !== undefined) {
            body.capacityPerHour = capacityPerHour;
        }

        return body;
    };
    // Toggle handlers for each section
    const handlePatientsToggle = (key: keyof typeof patientsToggles) => {
        setPatientsToggles((prev) => {
            if (key === "painManagement") {
                const next = !prev.painManagement;
                return { pediatrics: next ? false : prev.pediatrics, painManagement: next };
            }
            if (prev.painManagement) return prev; // disable no-double-booking when overlapping is on
            return { ...prev, [key]: !prev[key] };
        });
    };
    const handleConsultsToggle = (key: keyof typeof consultsToggles) => {
        setConsultsToggles((prev) => {
            if (key === "painManagement") {
                const next = !prev.painManagement;
                return { pediatrics: next ? false : prev.pediatrics, painManagement: next };
            }
            if (prev.painManagement) return prev; // disable no-double-booking when overlapping is on
            return { ...prev, [key]: !prev[key] };
        });
    };
    const handleClasses = (active: boolean) =>
        `relative z-10 block h-7 w-7 rounded-full bg-white shadow-[0_6px_20px_rgba(0,0,0,0.12)] transition-transform duration-300 ${active ? "translate-x-8" : "translate-x-0"
        }`;
    const toggleClasses = (active: boolean) =>
        `absolute inset-0 rounded-full transition-colors ${active ? "bg-[#25514A]" : "bg-[#42928526]"}`;

    const toggleCheck = (value?: string) => {
        if (!value) return;
        setSelectedServiceTypes((prev) =>
            prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
        );
    };

    const ensureSelectedService = (value?: string) => {
        if (!value) return;
        setSelectedServiceTypes((prev) => (prev.includes(value) ? prev : [...prev, value]));
    };
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
    return (
        <div>
            <div className='bg-white mb-6'>
                <div className="flex items-center justify-between mb-6 mt-6 p-6 bg-white max-w-7xl mx-auto">
                    <div>
                        <h1 className="text-2xl font-semibold mb-1">Booking Parameters</h1>
                        <p className="text-gray-500 text-sm">Default operating hours for scheduling</p>
                    </div>
                    <button className="px-4 py-3 bg-primary-700 text-white rounded-sm">
                        <a href="/admin/add-provider">Save</a>
                    </button>
                </div>
                <div className='pb-4'>
                    <ProvidersDetailsTabs />
                </div>
            </div>
            <div className='flex w-full gap-2'>
                <div className='bg-white p-6 w-1/2'>
                    <div className='mb-6'>
                        <p className="font-semibold mb-1">General Settings</p>
                        <p className="text-gray-500 text-sm"> Default operating hours for scheduling</p>
                    </div>
                    <div>
                        <p className="font-semibold mb-3">Services Provided</p>
                        <div className="flex flex-col gap-2">
                            {serviceTypesLoading && <span className="text-sm text-gray-500">Loading services…</span>}
                            {serviceTypesError && <span className="text-sm text-red-600">Failed to load services.</span>}
                            {!serviceTypesLoading && !serviceTypesError && items.map((item) => (
                                <label
                                    key={item.id}
                                    className="relative flex items-center cursor-pointer rounded-sm px-1 py-1 select-none"
                                    style={{ userSelect: "none" }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedServiceTypes.includes(item.value)}
                                        onChange={() => toggleCheck(item.value)}
                                        className="peer appearance-none w-6 h-6 border border-primary-700 rounded-sm checked:bg-primary-700 checked:border-primary-700 transition-colors duration-150 cursor-pointer"
                                    />

                                    <span className="absolute left-1 top-1 w-6 h-6 flex items-center justify-center pointer-events-none">
                                        {selectedServiceTypes.includes(item.value) && (
                                            <svg
                                                className="w-4 h-4 text-white"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        )}
                                    </span>

                                    <span className="ml-3 text-gray-700 text-base">
                                        {item.label}
                                    </span>
                                </label>
                            ))}
                        </div>

                    </div>

                </div>
                <div className='bg-white p-6 w-1/2'>
                    <div className='mb-6'>
                        <p className="font-semibold mb-1">Capacity Setting</p>
                        <p className="text-gray-500 text-sm"> Set maximum patient capacity for different time periods</p>
                    </div>
                    <div className='flex gap-6 mb-4'>
                        <div className="w-48">
                            <label className="text-sm font-medium">Full day capacity</label>
                            <input
                                type="number"
                                className="w-full border rounded-md px-3 py-2 mt-1 text-sm bg-[#FAFAFA]"
                                value={fullDayCapacity ?? ""}
                                onChange={(e) => setFullDayCapacity(e.target.value)}
                                placeholder="Enter Full day capacity"
                            />
                        </div>
                        <div className="w-48">
                            <label className="text-sm font-medium">Morining Capacity</label>
                            <input
                                type="number"
                                className="w-full border rounded-md px-3 py-2 mt-1 text-sm bg-[#FAFAFA]"
                                value={morningCapacity ?? ""}
                                onChange={(e) => setMorningCapacity(e.target.value)}
                                placeholder="Enter morning capacity"
                            />
                        </div>
                    </div>
                    <div className="w-48">
                        <label className="text-sm font-medium">Afternoon Capacity</label>
                        <input
                            type="number"
                            className="w-full border rounded-md px-3 py-2 mt-1 text-sm bg-[#FAFAFA]"
                            value={afternoonCapacity ?? ""}
                            onChange={(e) => setAfternoonCapacity(e.target.value)}
                            placeholder="Enter Afternoon Capacity"
                        />
                    </div>
                    <button
                        type="button"
                        className="mt-4 bg-primary-700 text-white px-4 py-2 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={savingCapacity || !providerId}
                        onClick={async () => {
                            if (!providerId) {
                                alert("Missing provider. Cannot save capacity settings.");
                                return;
                            }
                            try {
                                await updateCapacity({
                                    providerId,
                                    body: {
                                        fullDayCapacity: fullDayCapacity ? Number(fullDayCapacity) : 0,
                                        morningCapacity: morningCapacity ? Number(morningCapacity) : 0,
                                        afternoonCapacity: afternoonCapacity ? Number(afternoonCapacity) : 0,
                                    },
                                }).unwrap();
                                alert("Capacity settings saved");
                            } catch (err) {
                                console.error("Failed to save capacity settings", err);
                                alert("Failed to save capacity settings");
                            }
                        }}
                    >
                        {savingCapacity ? "Saving..." : "Save Capacity"}
                    </button>
                </div>
            </div>
            <div className='flex w-full gap-2 py-4'>
                <div className='w-1/2'>
                    <CollapsibleSection title="Injection Settings">
                        <hr />
                        {!injectionEnabled && (
                            <div className="px-6 pt-4 text-sm text-gray-500">Select the Injection service in Services Provided to enable this section.</div>
                        )}
                        <div className={`bg-white p-6 ${!injectionEnabled ? "opacity-50 pointer-events-none" : ""}`}>
                            <div className='flex gap-6 mb-4'>
                                <div>
                                    <label className="text-sm font-medium text-[#808080]">Start Time</label>
                                    <input
                                        type="time"
                                        className="w-full border rounded-md px-2 py-1.5 mt-1 text-sm  bg-[#FAFAFA]"
                                        value={patientsStartTime}
                                        onChange={(e) => setPatientsStartTime(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-[#808080]">End Time</label>
                                    <input
                                        type="time"
                                        className="w-full border rounded-md px-2 py-1.5 mt-1 text-sm  bg-[#FAFAFA]"
                                        value={patientsEndTime}
                                        onChange={(e) => setPatientsEndTime(e.target.value)}
                                    />
                                </div>
                            </div>
                            {/* Capacity Full day */}
                            <div className='flex gap-6 mb-4'>
                                <div className="w-48">
                                    <label className="text-sm font-medium">Capacity Full day</label>
                                    <input
                                        type="number"
                                        className="w-full border rounded-md px-3 py-2 mt-1 text-sm bg-[#FAFAFA]"
                                        value={injCapacityDay}
                                        onChange={(e) => setInjCapacityDay(e.target.value)}
                                        placeholder="Enter capacity"
                                    />
                                </div>
                                <div className="w-48">
                                    <label className="text-sm font-medium">Ideal Per Hour</label>
                                    <input
                                        type="number"
                                        className="w-full border rounded-md px-3 py-2 mt-1 text-sm bg-[#FAFAFA]"
                                        value={injCapacityHour}
                                        onChange={(e) => setInjCapacityHour(e.target.value)}
                                        placeholder="Enter ideal per hour"
                                    />
                                </div>
                            </div>
                            <div className='flex gap-6 mb-4'>
                                <div className="w-48">
                                    <label className="text-sm font-medium">Morning Capacity</label>
                                    <input
                                        type="number"
                                        className="w-full border rounded-md px-3 py-2 mt-1 text-sm bg-[#FAFAFA]"
                                        value={injMorningCapacity}
                                        onChange={(e) => setInjMorningCapacity(e.target.value)}
                                        placeholder="Enter morning capacity"
                                    />
                                </div>
                                <div className="w-48">
                                    <label className="text-sm font-medium">Afternoon Capacity</label>
                                    <input
                                        type="number"
                                        className="w-full border rounded-md px-3 py-2 mt-1 text-sm bg-[#FAFAFA]"
                                        value={injAfternoonCapacity}
                                        onChange={(e) => setInjAfternoonCapacity(e.target.value)}
                                        placeholder="Enter afternoon capacity"
                                    />
                                </div>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm mb-4"> Consult days</p>
                                <div className="flex justify-between gap-1">
                                    {weekdays.map((day) => {
                                        const isSelected = patientsSelectedDays.includes(day);
                                        return (
                                            <div
                                                key={day}
                                                onClick={() => {
                                                    setPatientsSelectedDays((prev) =>
                                                        isSelected
                                                            ? prev.filter((d) => d !== day)
                                                            : [...prev, day]
                                                    );
                                                }}
                                                className={`flex-1 text-center text-sm py-1 px-2 rounded-lg border cursor-pointer ${isSelected ? "bg-[#0F57909E] text-white" : "bg-white text-gray-700"}  transition-colors duration-200 `}
                                            >
                                                {day}
                                            </div>
                                        );
                                    })}
                                </div>
                                <p className="text-gray-500 text-sm mb-4 mt-4"> Schedule Rules</p>
                                <div className="flex gap-4 mb-4 ">
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-md font-bold">No Double Booking</span>
                                            <span className="text-gray-500 text-sm">Prevent multiple patients at the same time</span>
                                        </div>
                                        <button
                                            role="switch"
                                            aria-checked={patientsToggles.pediatrics}
                                            onClick={() => handlePatientsToggle("pediatrics")}
                                            disabled={injectionNoDoubleDisabled}
                                            className={`relative w-16 h-8 rounded-full p-1 flex items-center transition-all ${injectionNoDoubleDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                                        >
                                            <span className={toggleClasses(patientsToggles.pediatrics)} />
                                            <span className={handleClasses(patientsToggles.pediatrics)} />
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-md font-bold">Allow Overlapping</span>
                                            <span className="text-gray-500 text-sm">Appointments can overlap in time</span>
                                        </div>
                                        <button
                                            role="switch"
                                            aria-checked={patientsToggles.painManagement}
                                            onClick={() => handlePatientsToggle("painManagement")}
                                            className="relative w-16 h-8 rounded-full p-1 flex items-center cursor-pointer transition-all"
                                        >
                                            <span className={toggleClasses(patientsToggles.painManagement)} />
                                            <span className={handleClasses(patientsToggles.painManagement)} />
                                        </button>
                                    </div>
                                </div>
                                {injectionPreferenceId ? (
                                    <button
                                        type="button"
                                        className="mt-4 bg-emerald-700 text-white px-4 py-2 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={updatingPreference || !injectionEnabled}
                                        onClick={async () => {
                                            if (!injectionPreferenceId) {
                                                alert("Missing provider or service type. Please select a service to update.");
                                                return;
                                            }
                                            try {
                                                const body = buildUpdateBody({
                                                    startTime: patientsStartTime,
                                                    endTime: patientsEndTime,
                                                    capacityPerDay: injCapacityDay ? Number(injCapacityDay) : 0,
                                                    morningCapacity: injMorningCapacity ? Number(injMorningCapacity) : 0,
                                                    afternoonCapacity: injAfternoonCapacity ? Number(injAfternoonCapacity) : 0,
                                                    capacityPerHour: injCapacityHour ? Number(injCapacityHour) : undefined,
                                                    days: patientsSelectedDays,
                                                    doubleBooking: patientsToggles.pediatrics,
                                                    allowOverlapping: patientsToggles.painManagement,
                                                });
                                                await updateBookingPreference({ id: injectionPreferenceId, body }).unwrap();
                                                alert("Injection preferences updated");
                                            } catch (err) {
                                                console.error("Failed to update injection preferences", err);
                                                alert("Failed to update injection preferences");
                                            }
                                        }}
                                    >
                                        {updatingPreference ? "Updating..." : "Update Injection"}
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        className="mt-4 bg-primary-700 text-white px-4 py-2 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={savingInjection || !injectionEnabled}
                                        onClick={async () => {
                                            const payload = buildPayload({
                                                serviceTypeId: injectionServiceId,
                                                startTime: patientsStartTime,
                                                endTime: patientsEndTime,
                                                capacityPerDay: injCapacityDay ? Number(injCapacityDay) : 0,
                                                morningCapacity: injMorningCapacity ? Number(injMorningCapacity) : 0,
                                                afternoonCapacity: injAfternoonCapacity ? Number(injAfternoonCapacity) : 0,
                                                capacityPerHour: injCapacityHour ? Number(injCapacityHour) : undefined,
                                                days: patientsSelectedDays,
                                                doubleBooking: patientsToggles.pediatrics,
                                                allowOverlapping: patientsToggles.painManagement,
                                            });
                                            if (!payload) {
                                                alert("Missing provider or service type. Please select a service to save.");
                                                return;
                                            }
                                            try {
                                                await createInjectionPreference(payload).unwrap();
                                                alert("Injection preferences saved");
                                            } catch (err) {
                                                console.error("Failed to save injection preferences", err);
                                                alert("Failed to save injection preferences");
                                            }
                                        }}
                                    >
                                        {savingInjection ? "Saving..." : "Save Injection"}
                                    </button>
                                )}
                            </div>
                        </div>
                    </CollapsibleSection>
                </div>
                <div className='w-1/2'>
                    <CollapsibleSection title="Consults (office visits)">
                        <hr />
                        {!consultEnabled && (
                            <div className="px-6 pt-4 text-sm text-gray-500">Select Initial Consultation 3 in Services Provided to enable this section.</div>
                        )}
                        <div className={`bg-white p-6 ${!consultEnabled ? "opacity-50 pointer-events-none" : ""}`}>
                            <div className='flex gap-6 mb-4'>
                                <div>
                                    <label className="text-sm font-medium text-[#808080]">Start Time</label>
                                    <input
                                        type="time"
                                        className="w-full border rounded-md px-2 py-1.5 mt-1 text-sm  bg-[#FAFAFA]"
                                        value={consultsStartTime}
                                        onChange={(e) => setConsultsStartTime(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-[#808080]">End Time</label>
                                    <input
                                        type="time"
                                        className="w-full border rounded-md px-2 py-1.5 mt-1 text-sm  bg-[#FAFAFA]"
                                        value={consultsEndTime}
                                        onChange={(e) => setConsultsEndTime(e.target.value)}
                                    />
                                </div>
                            </div>
                            {/* Freeze Reasons */}
                            <div className='flex gap-6 mb-4'>
                                <div className="w-48">
                                    <label className="text-sm font-medium">Capacity full day</label>
                                    <input
                                        type="number"
                                        className="w-full border rounded-md px-3 py-2 mt-1 text-sm bg-[#FAFAFA]"
                                        value={consultCapacityDay}
                                        onChange={(e) => setConsultCapacityDay(e.target.value)}
                                        placeholder="Enter Capacity full day"
                                    />
                                </div>

                            </div>
                            <div className='flex gap-6 mb-4'>
                                <div className="w-48">
                                    <label className="text-sm font-medium">Morning Capacity</label>
                                    <input
                                        type="number"
                                        className="w-full border rounded-md px-3 py-2 mt-1 text-sm bg-[#FAFAFA]"
                                        value={consultMorningCapacity}
                                        onChange={(e) => setConsultMorningCapacity(e.target.value)}
                                        placeholder="Enter Morning Capacity"
                                    />
                                </div>
                                <div className="w-48">
                                    <label className="text-sm font-medium">Afternoon Capacity</label>
                                    <input
                                        type="number"
                                        className="w-full border rounded-md px-3 py-2 mt-1 text-sm bg-[#FAFAFA]"
                                        value={consultAfternoonCapacity}
                                        onChange={(e) => setConsultAfternoonCapacity(e.target.value)}
                                        placeholder="Enter Afternoon Capacity"
                                    />
                                </div>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm mb-4"> Consult days</p>
                                <div className="flex justify-between gap-1">
                                    {weekdays.map((day) => {
                                        const isSelected = consultsSelectedDays.includes(day);
                                        return (
                                            <div
                                                key={day}
                                                onClick={() => {
                                                    setConsultsSelectedDays((prev) =>
                                                        isSelected
                                                            ? prev.filter((d) => d !== day)
                                                            : [...prev, day]
                                                    );
                                                }}
                                                className={`flex-1 text-center text-sm py-1 px-2 rounded-lg border cursor-pointer ${isSelected ? "bg-[#0F57909E] text-white" : "bg-white text-gray-700"}  transition-colors duration-200 `}
                                            >
                                                {day}
                                            </div>
                                        );
                                    })}
                                </div>
                                <p className="text-gray-500 text-sm mb-4 mt-4"> Schedule Rules</p>
                                <div className="flex gap-4 mb-4 ">
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-md font-bold">No Double Booking</span>
                                            <span className="text-gray-500 text-sm">Prevent multiple patients at the same time</span>
                                        </div>
                                        <button
                                            role="switch"
                                            aria-checked={consultsToggles.pediatrics}
                                            onClick={() => handleConsultsToggle("pediatrics")}
                                            disabled={consultNoDoubleDisabled}
                                            className={`relative w-16 h-8 rounded-full p-1 flex items-center transition-all ${consultNoDoubleDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                                        >
                                            <span className={toggleClasses(consultsToggles.pediatrics)} />
                                            <span className={handleClasses(consultsToggles.pediatrics)} />
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-md font-bold">Allow Overlapping</span>
                                            <span className="text-gray-500 text-sm">Appointments can overlap in time</span>
                                        </div>
                                        <button
                                            role="switch"
                                            aria-checked={consultsToggles.painManagement}
                                            onClick={() => handleConsultsToggle("painManagement")}
                                            className="relative w-16 h-8 rounded-full p-1 flex items-center cursor-pointer transition-all"
                                        >
                                            <span className={toggleClasses(consultsToggles.painManagement)} />
                                            <span className={handleClasses(consultsToggles.painManagement)} />
                                        </button>
                                    </div>
                                </div>
                                {consultPreferenceId ? (
                                    <button
                                        type="button"
                                        className="mt-4 bg-emerald-700 text-white px-4 py-2 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={updatingPreference || !consultEnabled}
                                        onClick={async () => {
                                            if (!consultPreferenceId) {
                                                alert("Missing provider or service type. Please select a service to update.");
                                                return;
                                            }
                                            try {
                                                const body = buildUpdateBody({
                                                    startTime: consultsStartTime,
                                                    endTime: consultsEndTime,
                                                    capacityPerDay: consultCapacityDay ? Number(consultCapacityDay) : 0,
                                                    morningCapacity: consultMorningCapacity ? Number(consultMorningCapacity) : 0,
                                                    afternoonCapacity: consultAfternoonCapacity ? Number(consultAfternoonCapacity) : 0,
                                                    capacityPerHour: undefined,
                                                    days: consultsSelectedDays,
                                                    doubleBooking: consultsToggles.pediatrics,
                                                    allowOverlapping: consultsToggles.painManagement,
                                                });
                                                await updateBookingPreference({ id: consultPreferenceId, body }).unwrap();
                                                alert("Office visit preferences updated");
                                            } catch (err) {
                                                console.error("Failed to update office visit preferences", err);
                                                alert("Failed to update office visit preferences");
                                            }
                                        }}
                                    >
                                        {updatingPreference ? "Updating..." : "Update Office Visits"}
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        className="mt-4 bg-primary-700 text-white px-4 py-2 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={savingConsult || !consultEnabled}
                                        onClick={async () => {
                                            const payload = buildPayload({
                                                serviceTypeId: consultServiceId,
                                                startTime: consultsStartTime,
                                                endTime: consultsEndTime,
                                                capacityPerDay: consultCapacityDay ? Number(consultCapacityDay) : 0,
                                                morningCapacity: consultMorningCapacity ? Number(consultMorningCapacity) : 0,
                                                afternoonCapacity: consultAfternoonCapacity ? Number(consultAfternoonCapacity) : 0,
                                                capacityPerHour: undefined,
                                                days: consultsSelectedDays,
                                                doubleBooking: consultsToggles.pediatrics,
                                                allowOverlapping: consultsToggles.painManagement,
                                            });
                                            if (!payload) {
                                                alert("Missing provider or service type. Please select a service to save.");
                                                return;
                                            }
                                            try {
                                                await createConsultPreference(payload).unwrap();
                                                alert("Office visit preferences saved");
                                            } catch (err) {
                                                console.error("Failed to save office visit preferences", err);
                                                alert("Failed to save office visit preferences");
                                            }
                                        }}
                                    >
                                        {savingConsult ? "Saving..." : "Save Office Visits"}
                                    </button>
                                )}
                            </div>
                        </div>
                    </CollapsibleSection>
                </div>
            </div>
        </div>
    )
}

export default Page
