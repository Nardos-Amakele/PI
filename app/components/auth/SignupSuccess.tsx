"use client";

import { IconCheck } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export default function SignupSuccess() {
    const router = useRouter();

    return (
        <div className="min-h-[60vh] flex items-center justify-center px-6">
            <div className="w-full max-w-xl text-center py-12">
                <div className="mx-auto mb-8 h-24 w-24 rounded-full border-2 border-primary-700 flex items-center justify-center bg-primary-50">
                    <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center">
                        <IconCheck className="h-6 w-6 text-primary-700" />
                    </div>
                </div>

                <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Successful</h2>

                <p className="text-gray-600 mb-8">
                    Congratulations! Your password has been changed. Click continue to login
                </p>

                <div className="mx-auto max-w-xl">
                    <button
                        onClick={() => router.push("/login")} 
                        className="bg-primary-700 hover:bg-primary-800 text-white w-full py-3 rounded-lg font-medium shadow-sm"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
}
