"use client";

import Image from "next/image";
import { useState } from "react";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { useRegisterMutation } from "../../services/auth/authApi";
import { useRouter } from "next/navigation";
import type { AuthError } from "../../services/auth/authTypes";

/* ---------------- PASSWORD VALIDATION ---------------- */
const passwordRules = {
  lowercase: /[a-z]/,
  uppercase: /[A-Z]/,
  special: /[^A-Za-z0-9]/,
  length: /.{8,}/,
};

const validatePassword = (password: string) => {
  const errors: string[] = [];

  if (!passwordRules.length.test(password)) {
    errors.push("Password must be at least 8 characters long");
  }
  if (!passwordRules.lowercase.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  if (!passwordRules.uppercase.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  if (!passwordRules.special.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  return errors;
};
/* ----------------------------------------------------- */

export default function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [register, { isLoading, error }] = useRegisterMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    if (e.target.name === "password") {
      setPasswordErrors(validatePassword(e.target.value));
    }
  };

  const handleSubmit = async () => {
    const errors = validatePassword(form.password);

    if (errors.length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setPasswordErrors([]);

    try {
      await register(form).unwrap();
      router.push(`/verify-email?email=${form.email}`);
    } catch (err) {
      console.error("Registration failed", err);
    }
  };

  /* ---------- Extract backend error message ---------- */
  let backendErrorMessage: string | null = null;

  if (error && "data" in error) {
    const apiError = error.data as AuthError;
    backendErrorMessage = apiError.error.message;
  }
  /* -------------------------------------------------- */

  return (
    <div className="flex flex-col gap-4">
      {/* LOGO */}
      <div className="hidden lg:flex gap-2 items-center mb-4">
        <Image src="/images/clarity.png" alt="clarity" width={47} height={41} />
        <p className="font-semibold text-lg">Clarity</p>
      </div>

      {/* TITLE */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold text-gray-900 text-center lg:text-left">
          Get Started
        </h1>
        <p className="text-sm text-center lg:text-left">
          Already have an account?{" "}
          <a href="/login" className="text-primary-700 font-medium">
            Sign In
          </a>
        </p>
      </div>

      {/* FULL NAME */}
      <div className="flex flex-col gap-1">
        <label className="font-medium">Full Name</label>
        <input
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          type="text"
          placeholder="Enter your full name"
          className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-700 focus:outline-none"
        />
      </div>

      {/* EMAIL */}
      <div className="flex flex-col gap-1">
        <label className="font-medium">Email</label>
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          type="email"
          placeholder="Enter your email"
          className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-700 focus:outline-none"
        />
      </div>

      {/* PASSWORD */}
      <div className="flex flex-col gap-1">
        <label className="font-medium">Password</label>
        <div className="relative">
          <input
            name="password"
            value={form.password}
            onChange={handleChange}
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="border w-full border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-700 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 text-gray-500 p-1"
          >
            {showPassword ? (
              <IconEye className="h-5 w-5" />
            ) : (
              <IconEyeOff className="h-5 w-5" />
            )}
          </button>
        </div>

        {passwordErrors.length > 0 && (
          <ul className="text-sm text-red-600 mt-1 space-y-1">
            {passwordErrors.map((err, i) => (
              <li key={i}>• {err}</li>
            ))}
          </ul>
        )}
      </div>

      {/* BACKEND ERROR */}
      {backendErrorMessage && (
        <p className="text-sm text-red-600">{backendErrorMessage}</p>
      )}

      {/* SUBMIT */}
      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="bg-primary-700 text-white w-full py-3 rounded-lg font-medium mt-2 disabled:opacity-50"
      >
        {isLoading ? "Creating account..." : "Sign up"}
      </button>
    </div>
  );
}
