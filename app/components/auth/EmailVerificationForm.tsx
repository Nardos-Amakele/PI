"use client";

import Image from "next/image";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useVerifyEmailMutation,
  useResendVerificationMutation,
} from "../../services/auth/authApi";

export default function EmailVerificationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [code, setCode] = useState(["", "", "", "", "", ""]);

  const [verifyEmail, { isLoading, error }] = useVerifyEmailMutation();
  const [resendVerification, { isLoading: resendLoading }] =
    useResendVerificationMutation();

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      document.getElementById(`code-${index + 1}`)?.focus();
    }
  };

  const handleVerify = async () => {
    const token = code.join("");

    if (token.length !== 6 || !email) return;

    try {
      await verifyEmail({ email, code: token }).unwrap();
      router.push("/success");
    } catch (err) {
      console.error("Verification failed", err);
    }
  };

  const handleResend = async () => {
    if (!email) return;

    try {
      await resendVerification({ email }).unwrap();
      alert("Verification email resent");
    } catch (err) {
      console.error("Resend failed", err);
    }
  };

  return (
    <div className="flex flex-col px-4 w-full max-w-xl mx-auto mt-10">
      <div className="hidden lg:flex gap-2 items-center mb-4">
        <Image src="/images/clarity.png" alt="clarity" width={47} height={41} />
        <p className="font-semibold text-lg">Clarity</p>
      </div>

      {/* TITLE */}
      <h1 className="text-3xl font-bold text-[#0A2342] mb-2">
        Check your email
      </h1>

      {/* SUBTEXT */}
      <p className="text-gray-600 max-w-md mb-8">
        We sent a verification code to{" "}
        <span className="font-semibold">{email}</span>.
        Enter the 5 digit code from the email.
      </p>

      {/* CODE INPUTS */}
      <div className="flex gap-4 mb-8">
        {code.map((digit, index) => (
          <input
            key={index}
            id={`code-${index}`}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target.value, index)}
            className="w-16 h-16 border rounded-xl border-[#648DDB] text-center text-xl outline-none focus:border-[#0A2342]"
          />
        ))}
      </div>

      {/* ERROR */}
      {error && (
        <p className="text-red-600 text-sm mb-4">
          Verification failed. Please check the code.
        </p>
      )}

      {/* BUTTON */}
      <button
        onClick={handleVerify}
        disabled={isLoading}
        className="w-full bg-[#0F57907A] text-white py-3 rounded-lg text-lg font-medium hover:opacity-90 transition mb-6 disabled:opacity-50"
      >
        {isLoading ? "Verifying..." : "Verify Code"}
      </button>

      {/* RESEND */}
      <p className="text-gray-600">
        Haven’t got the email yet?{" "}
        <span
          onClick={handleResend}
          className="text-primary-700 font-semibold cursor-pointer hover:underline"
        >
          {resendLoading ? "Resending..." : "Resend email"}
        </span>
      </p>
    </div>
  );
}
