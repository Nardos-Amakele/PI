"use client";

import React, { useEffect, useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import {
  IconSearch,
  IconChevronDown,
  IconCalendarMinus,
  IconClearAll,
  IconUsers,
  IconChevronLeft,
  IconChevronRight,
  IconX,
  IconPointFilled,
} from "@tabler/icons-react";

import { AvailabilityData } from "../data/AvailabilityData";

const Page = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [eventDetails, setEventDetails] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDay, setActiveDay] = useState<any>(null);

  const [currentMonth, setCurrentMonth] = useState("September, 2025");

  const calendarRef = useRef<any>(null);

  useEffect(() => {
  }, []);


  const updateCurrentMonth = (api: any) => {
    const d = api.getDate();
    setCurrentMonth(
      `${d.toLocaleString("default", { month: "long" })}, ${d.getFullYear()}`
    );
  };
  const getAvailabilityForDate = (dateStr: string) => {
    return AvailabilityData.find((d) => d.date === dateStr);
  };
  const handleDateClick = (arg: any) => {
    const dateStr = arg.date.toISOString().split("T")[0];
    const dayData = getAvailabilityForDate(dateStr);

    setActiveDay({
      date: dateStr,
      ...dayData,
    });
    setIsModalOpen(true);
  };


  return (
    <div className="w-full py-6">
      {/* HEADER */}
      <div className="bg-white rounded-md p-4 mb-4">
        <div className="flex justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Provider Availability</h1>
            <p className="text-sm text-gray-500">
              Manage blocked times, holidays, and recurring schedules
            </p>
          </div>

          <div className="flex ">
            <button className="px-6 py-3 flex bg-white shadow  text-sm">
              <IconCalendarMinus size={18} /> Calendar
            </button>
            <button className="px-6 py-3 flex bg-[#555E670D] shadow  text-sm">
              <IconClearAll size={18} /> List
            </button>
            <button className="px-6 py-3 bg-primary-700 text-white  text-sm ml-4">
              Block Time
            </button>
          </div>
        </div>

        <div className="relative">
          <IconSearch size={18} className="absolute left-3 top-3 text-gray-400" />
          <input
            placeholder="Search"
            className="w-full border rounded-md pl-10 py-2 text-sm"
          />
        </div>
        <div className="flex mt-4 gap-6 ">
          <p className="flex items-center gap-2 text-[#919191]">
            <IconPointFilled size={14} className="text-green-500" />
            All Available
          </p>

          <p className="flex items-center gap-2 text-[#919191]">
            <IconPointFilled size={14} className="text-yellow-500" />
            Partially Available
          </p>

          <p className="flex items-center gap-2 text-[#919191]">
            <IconPointFilled size={14} className="text-red-500" />
            Blocked
          </p>
        </div>

      </div>

      {/* CALENDAR */}
      <div className="bg-white rounded-md p-4">
        {/* NAV */}
        <div className="flex justify-between mb-4">
          <div className="flex items-center gap-2">
            <button onClick={() => { const api = calendarRef.current.getApi(); api.prev(); updateCurrentMonth(api); }}>
              <IconChevronLeft />
            </button>
            <h2 className="text-lg font-semibold w-[180px]">{currentMonth}</h2>
            <button onClick={() => { const api = calendarRef.current.getApi(); api.next(); updateCurrentMonth(api); }}>
              <IconChevronRight />
            </button>
            <button
              onClick={() => { const api = calendarRef.current.getApi(); api.today(); updateCurrentMonth(api); }}
              className="ml-2 px-3 py-1 border rounded text-sm"
            >
              Today
            </button>
          </div>

          <div className="flex gap-2">
            {["All Locations", "All Departments"].map((label) => (
              <div key={label} className="relative">
                <select className="appearance-none border rounded px-4 py-2 pr-8 text-sm">
                  <option>{label}</option>
                </select>
                <IconChevronDown size={16} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            ))}
          </div>
        </div>

        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          initialDate="2025-09-01"
          headerToolbar={false}
          fixedWeekCount={false}
          height="auto"
          dateClick={handleDateClick}
          dayCellClassNames={(arg) => {
            const dateStr = arg.date.toISOString().split("T")[0];
            const dayData = getAvailabilityForDate(dateStr);
            if (dayData?.status === "available") return ["bg-[#087F000D]"];
            if (dayData?.status === "blocked") return ["bg-[#C43D1333]"];
            if (dayData?.status === "partially-available") return ["bg-[#FDF5A333]"];
            return ["bg-[#087F000D]"];
          }}
          dayCellContent={(arg) => {
            const dateStr = arg.date.toISOString().split("T")[0];
            const dayData = getAvailabilityForDate(dateStr);
            // Background is set on the cell via dayCellClassNames so don't set it here

            return (
              <div className="relative h-full w-full p-2 flex flex-col items-center justify-center text-center">
                {/* Date number */}
                <div className="text-sm font-medium text-gray-700 mb-1">
                  {arg.date.getDate()}
                </div>

                {/* Status content */}
                {dayData?.status === "blocked" && (
                  <span className="text-xs font-semibold text-white bg-[#C43D13] px-2">
                    {dayData.description}
                  </span>
                )}

                {dayData?.status === "partially-available" && (
                  <span className="text-sm flex gap-8  bg-[#FEE6C940] p-2">
                    <IconUsers size={20} />
                    {dayData.slots} / 162
                  </span>
                )}

              </div>

            );
          }}
        />
        {/* MODAL BODY */}

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white  w-[420px] max-w-full p-6 relative">

              {/* Close button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              >
                <IconX size={18} />
              </button>

              {/* Date */}
              <h3 className="text-lg font-semibold mb-4">
                {activeDay?.date && new Date(activeDay.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </h3>

              {/* BLOCKED */}
              {activeDay?.status === "blocked" && (
                <div className=" text-[#00000080] font-medium ">
                  {activeDay.description}
                </div>
              )}

              {/* PARTIALLY AVAILABLE */}
              {activeDay?.status === "partially-available" && (
                <div className="space-y-3">
                  {activeDay.providers?.map((p: any, index: number) => (
                    <div
                      key={index}
                      className="grid grid-cols-2 gap-2 border rounded-md bg-input-bg p-3 text-sm"
                    >
                      <div className="font-medium">{p.providerName}</div>
                      <div className="text-gray-500">{p.location}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* EVERYTHING ELSE */}
              {activeDay?.status !== "blocked" &&
                activeDay?.status !== "partially-available" && (
                  <div className="text-[#00000080] ">
                    No token found
                  </div>
                )}
            </div>
          </div>
        )}



      </div>

    </div>
  );
};

export default Page;
