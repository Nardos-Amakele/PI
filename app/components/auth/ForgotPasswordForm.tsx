"use client";
import Image from "next/image";
import { useState } from "react";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

export default function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="flex flex-col gap-4 lg:mt-10">
            <div className="hidden lg:flex gap-2 items-center mb-4">
                <Image
                    src="/images/clarity.png"
                    alt="clarity"
                    width={47}
                    height={41}
                />
                <p className="font-semibold text-lg">Clarity</p>
            </div>
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-semibold text-gray-900 text-center lg:text-left">
                    Forgot Password
                </h1>
                <p className=" text-sm text-center lg:text-left">
                    Please enter your email we’ll send you a reset code
                </p>
            </div>


            {/* EMAIL */}
            <div className="flex flex-col gap-1">
                <label className="font-medium ">Email</label>
                <input
                    type="email"
                    placeholder="Enter your email"
                    className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-700 focus:outline-none"
                />
            </div>


            {/* REMEMBER + FORGOT */}
            <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        className="accent-primary-700 h-4 w-4 rounded-sm border border-gray-300 focus:ring-2 focus:ring-primary-700  "
                        aria-label="Remember me"
                    />
                    <span>Remember me for 30 days</span>
                </label>
            </div>

            {/* SIGN IN BUTTON */}
            <button className="bg-primary-700 hover:bg-primary-700 text-white w-full py-3 rounded-lg font-medium mt-2">
                Send Code
            </button>
        </div>
    );
}
