"use client";

import { useState } from "react";

type ToggleProps = {
  active?: boolean;
  onChange?: (value: boolean) => void;
  onClick?: () => void;
  ariaLabel?: string;
  label?: string | number;
};

export default function Toggle({
  active: activeProp,
  onChange,
  onClick,
  ariaLabel = "toggle",
  label,
}: ToggleProps) {
  const [internal, setInternal] = useState(false);

  const isControlled = typeof activeProp !== "undefined";
  const active = isControlled ? activeProp! : internal;

  const toggle = () => {
    const next = !active;

    // fire click handler if provided
    onClick?.();

    // handle controlled vs uncontrolled
    if (isControlled) {
      onChange?.(next);
    } else {
      setInternal(next);
      onChange?.(next);
    }
  };

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={toggle}
      className={`
        px-4 h-9 flex items-center justify-center
        rounded-xl font-medium text-sm
        transition-all border
        ${
          active
            ? "bg-primary-700 text-white border-primary-700"
            : "bg-white text-gray-700 border-gray-200"
        }
      `}
    >
      {label ?? ""}
    </button>
  );
}
