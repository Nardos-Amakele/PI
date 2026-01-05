export type TimeSlot = {
  time: string;
  provider: string;
  status: "available" | "booked";
};

export type DayAvailability = {
  date: string; // YYYY-MM-DD
  slots: TimeSlot[];
};

export const availabilityData: DayAvailability[] = [
  {
    date: "2026-02-26",
    slots: [
      { time: "07:00", provider: "Dr. John Moore", status: "available" },
      { time: "07:15", provider: "Dr. John Moore", status: "booked" },
      { time: "07:30", provider: "Dr. John Moore", status: "available" },
      { time: "07:45", provider: "Dr. John Moore", status: "booked" },
      { time: "08:00", provider: "Dr. John Moore", status: "available" },
      { time: "08:15", provider: "Dr. John Moore", status: "booked" },
    ],
  },
  {
    date: "2026-02-24",
    slots: [
      { time: "09:00", provider: "Dr. John Moore", status: "available" },
      { time: "09:30", provider: "Dr. John Moore", status: "available" },
    ],
  },
];
export const FindAvailabilityData = availabilityData;