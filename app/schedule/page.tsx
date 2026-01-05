"use client";

import { useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { appointments } from "../data/ScheduleData";
import {
  IconDeviceTablet,
  IconCalendarEvent,
  IconHierarchy3,
  IconUser,
  IconChevronDown,
  IconMinus,
  IconPlus,
} from "@tabler/icons-react";
import {FilterSection} from "../components/feature/ScheduleFilter";
import { List } from "lucide-react";
export default function SchedulingPage() {
  const [view, setView] = useState("listWeek");
  const [currentTitle, setCurrentTitle] = useState("");
  const calendarRef = useRef<FullCalendar | null>(null);

  // collapsible sections
  const [openResource, setOpenResource] = useState(true);
  const [openAppointment, setOpenAppointment] = useState(true);
  const [openDepartment, setOpenDepartment] = useState(true);
  const [openProvider, setOpenProvider] = useState(true);

  // dropdown currently open
  const [dropdown, setDropdown] = useState<
    "resource" | "appointment" | "department" | "provider" | null
  >(null);

  // selected values for each dropdown
  const [selected, setSelected] = useState({
    resource: "All",
    appointment: "All",
    department: "All",
    provider: "All",
  });

  // Universal selection handler
  const handleSelect = (type: keyof typeof selected, value: string) => {
    setSelected((prev) => ({ ...prev, [type]: value }));
    setDropdown(null); // close dropdown
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-2">Scheduling</h1>
      <p className="text-gray-500 mb-4">Easily manage and view appointments.</p>

      <div className="flex gap-6">
        {/* FILTERS */}
        <div className="w-72 bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Filters</h2>
            <span className="text-gray-400 text-sm">2</span>
          </div>

          {/* ================================================= */}
          {/* =============== RESOURCE TYPE =================== */}
          {/* ================================================= */}

          <FilterSection
            icon={<IconDeviceTablet size={18} />}
            title="RESOURCE TYPE"
            open={openResource}
            toggle={() => setOpenResource(!openResource)}
            dropdownOpen={dropdown === "resource"}
            toggleDropdown={() =>
              setDropdown(dropdown === "resource" ? null : "resource")
            }
            selectedValue={selected.resource}
            items={["Beds", "Rooms", "Equipment", "Random"]}
            onSelect={(item: string) => handleSelect("resource", item)}
          />

          {/* ================================================= */}
          {/* ============= APPOINTMENT TYPE ================== */}
          {/* ================================================= */}

          <FilterSection
            icon={<IconCalendarEvent size={18} />}
            title="APPOINTMENT TYPE"
            open={openAppointment}
            toggle={() => setOpenAppointment(!openAppointment)}
            dropdownOpen={dropdown === "appointment"}
            toggleDropdown={() =>
              setDropdown(dropdown === "appointment" ? null : "appointment")
            }
            selectedValue={selected.appointment}
            items={["Checkup", "Follow-up", "Cleaning", "Random"]}
            onSelect={(item: string) => handleSelect("appointment", item)}
          />

          {/* ================================================= */}
          {/* ================= DEPARTMENT ==================== */}
          {/* ================================================= */}

          <FilterSection
            icon={<IconHierarchy3 size={18} />}
            title="DEPARTMENT"
            open={openDepartment}
            toggle={() => setOpenDepartment(!openDepartment)}
            dropdownOpen={dropdown === "department"}
            toggleDropdown={() =>
              setDropdown(dropdown === "department" ? null : "department")
            }
            selectedValue={selected.department}
            items={["General", "Dental", "Surgery", "Random"]}
            onSelect={(item: string) => handleSelect("department", item)}
          />

          {/* ================================================= */}
          {/* ================== PROVIDER ===================== */}
          {/* ================================================= */}

          <FilterSection
            icon={<IconUser size={18} />}
            title="PROVIDER"
            open={openProvider}
            toggle={() => setOpenProvider(!openProvider)}
            dropdownOpen={dropdown === "provider"}
            toggleDropdown={() =>
              setDropdown(dropdown === "provider" ? null : "provider")
            }
            selectedValue={selected.provider}
            items={["Dr. Adams", "Dr. Lee", "Nurse Kelly", "Random"]}
            onSelect={(item: string) => handleSelect("provider", item)}
          />

          {/* Buttons */}
          <div className="flex items-center justify-center mx-auto mt-6 w-auto  px-3 py-2">
            <button className="px-4 py-1.5 text-sm rounded-full bg-blue-600 text-white">
              Reset
            </button>
            <button className="px-4 py-1.5 text-sm rounded-full border">
              Done
            </button>
          </div>

        </div>

        {/* CALENDAR */}
        <div className="flex-1 bg-white  p-4">
          {/* Navigation */}
          <div className="flex items-center justify-between w-full mb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => calendarRef.current?.getApi().prev()}
                className="px-3 py-1 border rounded-md text-sm hover:bg-gray-100"
              >
                {"<"}
              </button>

              <span className="text-sm font-medium">{currentTitle}</span>

              <button
                onClick={() => calendarRef.current?.getApi().next()}
                className="px-3 py-1 border rounded-md text-sm hover:bg-gray-100"
              >
                {">"}
              </button>

              <button
                onClick={() => calendarRef.current?.getApi().today()}
                className="px-3 py-1 border rounded-md text-sm ml-2 hover:bg-gray-100"
              >
                Today
              </button>
            </div>

            {/* View buttons */}
            <div className="flex border rounded-full overflow-hidden">
              {[
                { key: "day", label: "Day", view: "timeGridDay" },
                { key: "week", label: "Week", view: "timeGridWeek" },
                { key: "month", label: "Month", view: "dayGridMonth" },
                { key: "list", label: "List", view: "listWeek" },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setView(item.view)}
                  className={`px-5 py-2 text-sm ${view === item.view
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100"
                    }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Calendar */}
          <FullCalendar
            ref={calendarRef}
            key={view}
            plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
            initialView={view}
            headerToolbar={false}
            allDaySlot={false}
            events={appointments}
            height="auto"
            datesSet={(arg) => setCurrentTitle(arg.view.title)}
          />
        </div>
      </div>
    </div>
  );
}

