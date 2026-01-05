

import { IconMinus, IconPlus, IconChevronDown } from "@tabler/icons-react";

export function FilterSection({
  icon,
  title,
  open,
  toggle,
  dropdownOpen,
  toggleDropdown,
  selectedValue,
  items,
  onSelect,
}: any) {
  return (
    <div className="mb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2 font-medium text-gray-700">
          {icon}
          {title}
        </div>

        <button onClick={toggle} className="text-gray-500 hover:text-gray-700">
          {open ? <IconMinus size={18} /> : <IconPlus size={18} />}
        </button>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="relative">
          <button
            className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 border rounded-lg"
            onClick={toggleDropdown}
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              {selectedValue}
            </div>
            <IconChevronDown size={18} className="text-gray-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute w-full bg-white border rounded-lg shadow-md mt-1 z-10">
              {items.map((item: string) => (
                <div
                  key={item}
                  onClick={() => onSelect(item)}
                  className="px-3 py-2 cursor-pointer text-sm hover:bg-gray-100"
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
