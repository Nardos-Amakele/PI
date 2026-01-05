"use client";
import Image from "next/image";
import { useState } from "react";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

export default function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <div className="flex flex-col gap-4">
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
                    Set a new password
                </h1>
                <p className=" text-sm text-center lg:text-left">
                    Create a new password. Ensure it differs from previous ones for security
                </p>
            </div>

            {/* PASSWORD */}
            <div className="flex flex-col gap-1">
                <label className="font-medium ">Password</label>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="border w-full border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-700 focus:outline-none"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-gray-500 p-1"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        title={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? (
                            <IconEye className="h-5 w-5" />
                        ) : (
                            <IconEyeOff className="h-5 w-5" />
                        )}
                    </button>
                </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="flex flex-col gap-1">
                <label className="font-medium ">Confirm Password</label>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="border w-full border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-700 focus:outline-none"
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-2.5 text-gray-500 p-1"
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        title={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                        {showConfirmPassword ? (
                            <IconEye className="h-5 w-5" />
                        ) : (
                            <IconEyeOff className="h-5 w-5" />
                        )}
                    </button>
                </div>
            </div>
            {/* SIGN IN BUTTON */}
            <button className="bg-primary-700 hover:bg-primary-700 text-white w-full py-3 rounded-lg font-medium mt-2">
                Update Password
            </button>

        
        </div>
    );
}
