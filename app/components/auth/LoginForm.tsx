"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { useLoginMutation } from "../../services/auth/authApi";
import type { AuthError } from "../../services/auth/authTypes";

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter();
    const [login, { isLoading, isSuccess, error }] = useLoginMutation();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await login({ email, password }).unwrap();

            if (res.success) {
                // cookies are already set (credentials: include)
                router.push("/dashboard/patients");
            }
        } catch (err: any) {
            console.error("Login failed", err);
        }
    };

    /* ---------- Extract backend error message ---------- */
    let backendErrorMessage: string | null = null;

    if (error && "data" in error) {
        const apiError = error.data as AuthError;
        backendErrorMessage = apiError?.error?.message ?? "Invalid email or password";
    } else if (error && "error" in error && typeof error.error === "string") {
        backendErrorMessage = error.error;
    }
    /* -------------------------------------------------- */

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                    Welcome Back
                </h1>
                <p className=" text-sm text-center lg:text-left">
                    New to clarity?{" "}
                    <a href="/register" className="text-primary-700 font-medium">
                        Create an account
                    </a>
                </p>
            </div>


            {/* EMAIL */}
            <div className="flex flex-col gap-1">
                <label className="font-medium ">Email</label>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-700 focus:outline-none"
                />
            </div>

            {/* PASSWORD */}
            <div className="flex flex-col gap-1">
                <label className="font-medium ">Password</label>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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

                <a href="/forgot-password" >
                    Forgot Password
                </a>
            </div>

            {/* BACKEND ERROR */}
            {backendErrorMessage && (
                <p className="text-sm text-red-600">{backendErrorMessage}</p>
            )}

            {/* SIGN IN BUTTON */}
            <button
                type="submit"
                disabled={isLoading}
                className="bg-primary-700 hover:bg-primary-600 text-white w-full py-3 rounded-lg font-medium mt-2 disabled:opacity-50"
            >
                {isLoading ? "Signing in..." : "Sign in"}
            </button>


            {/* SOCIAL LOGINS */}
            <div className="flex flex-col gap-1 -mt-2 ">
                <button className="flex items-center justify-center gap-3 border-gray-300 border rounded-lg py-3">
                    <Image src="/images/google-id.png" width={20} height={20} alt="" />
                    Sign in with Google
                </button>

                <button className="flex items-center justify-center gap-3 border-gray-300 border rounded-lg py-3">
                    <Image src="/images/apple-id.png" width={20} height={20} alt="" />
                    Sign in with Apple ID
                </button>
            </div>
        </form>
    );
}
