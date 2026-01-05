export type DayStatus =
  | "available"
  | "partially-available"
  | "blocked";

export interface ProviderSlot {
  providerName: string;
  time: string;
  location: string;
}

export interface AvailabilityDay {
  id: string;
  date: string; // YYYY-MM-DD
  slots: number;
  status: DayStatus;
  description?: string;
  providers?: ProviderSlot[];
}

export const septemberAvailabilityMock: AvailabilityDay[] = [
  {
    id: "sep-01",
    date: "2025-09-01",
    slots: 0,
    status: "blocked",
    description: "Public Holiday",
  },
  {
    id: "sep-02",
    date: "2025-09-02",
    slots: 6,
    status: "available",
    providers: [
      {
        providerName: "Dr. Mary Lee",
        time: "09:00 – 12:00",
        location: "Main Clinic",
      },
      {
        providerName: "Dr. John Smith",
        time: "13:00 – 16:00",
        location: "Main Clinic",
      },
    ],
  },
  {
    id: "sep-03",
    date: "2025-09-03",
    slots: 3,
    status: "partially-available",
    providers: [
      {
        providerName: "Dr. Sarah Kim",
        time: "10:00 – 13:00",
        location: "West Wing",
      },
    ],
  },
  {
    id: "sep-04",
    date: "2025-09-04",
    slots: 0,
    status: "blocked",
    description: "Staff Training",
  },
  {
    id: "sep-05",
    date: "2025-09-05",
    slots: 8,
    status: "available",
    providers: [
      {
        providerName: "Dr. John Smith",
        time: "08:30 – 12:30",
        location: "East Clinic",
      },
      {
        providerName: "Dr. Mary Lee",
        time: "13:30 – 17:30",
        location: "Main Clinic",
      },
    ],
  },
  {
    id: "sep-06",
    date: "2025-09-06",
    slots: 2,
    status: "partially-available",
    providers: [
      {
        providerName: "Dr. Mary Lee",
        time: "09:00 – 11:00",
        location: "Main Clinic",
      },
    ],
  },
  {
    id: "sep-07",
    date: "2025-09-07",
    slots: 0,
    status: "blocked",
    description: "Weekly Maintenance",
  },

  // ──────────────── Week 2 ────────────────

  {
    id: "sep-08",
    date: "2025-09-08",
    slots: 7,
    status: "available",
    providers: [
      {
        providerName: "Dr. Sarah Kim",
        time: "09:00 – 12:00",
        location: "Main Clinic",
      },
      {
        providerName: "Dr. John Smith",
        time: "13:00 – 17:00",
        location: "Main Clinic",
      },
    ],
  },
  {
    id: "sep-09",
    date: "2025-09-09",
    slots: 4,
    status: "partially-available",
    providers: [
      {
        providerName: "Dr. Sarah Kim",
        time: "10:00 – 14:00",
        location: "West Wing",
      },
    ],
  },
  {
    id: "sep-10",
    date: "2025-09-10",
    slots: 0,
    status: "blocked",
    description: "System Upgrade",
  },
  {
    id: "sep-11",
    date: "2025-09-11",
    slots: 6,
    status: "available",
    providers: [
      {
        providerName: "Dr. Mary Lee",
        time: "09:00 – 13:00",
        location: "Main Clinic",
      },
      {
        providerName: "Dr. John Smith",
        time: "14:00 – 17:00",
        location: "East Clinic",
      },
    ],
  },
  {
    id: "sep-12",
    date: "2025-09-12",
    slots: 3,
    status: "partially-available",
    providers: [
      {
        providerName: "Dr. Sarah Kim",
        time: "11:00 – 14:00",
        location: "Main Clinic",
      },
    ],
  },
  {
    id: "sep-13",
    date: "2025-09-13",
    slots: 0,
    status: "blocked",
    description: "Clinic Closed",
  },
  {
    id: "sep-14",
    date: "2025-09-14",
    slots: 0,
    status: "blocked",
    description: "Weekend Closure",
  },

  // ──────────────── Week 3 ────────────────

  {
    id: "sep-15",
    date: "2025-09-15",
    slots: 9,
    status: "available",
    providers: [
      {
        providerName: "Dr. Mary Lee",
        time: "08:00 – 12:00",
        location: "Main Clinic",
      },
      {
        providerName: "Dr. John Smith",
        time: "13:00 – 18:00",
        location: "Main Clinic",
      },
    ],
  },
  {
    id: "sep-16",
    date: "2025-09-16",
    slots: 4,
    status: "partially-available",
    providers: [
      {
        providerName: "Dr. Sarah Kim",
        time: "09:30 – 13:30",
        location: "West Wing",
      },
    ],
  },
  {
    id: "sep-17",
    date: "2025-09-17",
    slots: 0,
    status: "blocked",
    description: "Team Offsite",
  },
  {
    id: "sep-18",
    date: "2025-09-18",
    slots: 6,
    status: "available",
    providers: [
      {
        providerName: "Dr. John Smith",
        time: "09:00 – 13:00",
        location: "East Clinic",
      },
      {
        providerName: "Dr. Mary Lee",
        time: "14:00 – 17:00",
        location: "Main Clinic",
      },
    ],
  },
  {
    id: "sep-19",
    date: "2025-09-19",
    slots: 3,
    status: "partially-available",
    providers: [
      {
        providerName: "Dr. Sarah Kim",
        time: "10:00 – 13:00",
        location: "Main Clinic",
      },
    ],
  },
  {
    id: "sep-20",
    date: "2025-09-20",
    slots: 0,
    status: "blocked",
    description: "Weekend Closure",
  },
  {
    id: "sep-21",
    date: "2025-09-21",
    slots: 0,
    status: "blocked",
    description: "Weekend Closure",
  },
];
export const AvailabilityData = septemberAvailabilityMock;
