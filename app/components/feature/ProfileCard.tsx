import { IconPointFilled } from "@tabler/icons-react";

type ProfileCardProps = {
  name?: string;
  phone?: string;
  address?: string;
  languages?: string[];
};

export default function ProfileCard({ name ="Patient", phone, address, languages }: ProfileCardProps) {
  return (
    <div className="w-[320px] shrink-0 rounded-xl border bg-white p-5 shadow-sm">
      {/* Top row */}
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-full bg-[#3756C233] px-3 py-1 text-xs font-medium text-blue-700 flex">
          <IconPointFilled size={14} />
          Scheduled
        </span>
        <button className="text-gray-400 hover:text-gray-600">⋮</button>
      </div>

      {/* Avatar */}
      <div className="mb-4 flex flex-col items-center text-center">
        <div className="mb-2 h-20 w-20 overflow-hidden rounded-full border">
          <img
            src="/avatar.png"
            alt="Profile"
            className="h-full w-full object-cover"
          />
        </div>
        <h3 className="text-base font-semibold break-words text-center">{name || "Patient"}</h3>
      </div>

      {/* Info */}
      <div className="space-y-2 text-sm">
        {languages && languages.length > 0 && (
          <InfoRow label="Languages" value={languages.join(", ")} />
        )}
        {phone && <InfoRow label="Phone" value={phone} />}
        {address && <InfoRow label="Address" value={address} />}
      </div>

      {/* DOL */}
      <div className="mt-4 text-sm flex gap-2">
        <p className="font-medium w-20">DOL</p>
        <div className="mt-1 flex flex-col text-xs text-gray-500">
          <span>
            Nov 29, 2025 <span className="ml-1 text-green-600 font-semibold">A</span>
          </span>
          <span>
            Nov 12, 2025 <span className="ml-1 text-red-600 font-semibold">C</span>
          </span>
        </div>
      </div>

      {/* Button */}
      <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-primary-700 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600">
        👁 View Claim Info
      </button>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="w-20 text-gray-500">{label}:</span>
      <span className="font-medium text-gray-800">{value}</span>
    </div>
  );
}
