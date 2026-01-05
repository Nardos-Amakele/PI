// import React from "react";
// import Image from "next/image";
// import "../globals.css";

// export default function AuthLayout({ children }: { children: React.ReactNode }) {
//     return (
//         <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2">

//             {/* TOP IMAGE FOR TABLET/MEDIUM */}
//             <div className="hidden md:flex lg:hidden w-full justify-center ">
//                 <Image
//                     src="/images/tablet-image.png"
//                     alt="clarity"
//                     width={500}
//                     height={500}
//                     className="object-cover w-full"
//                 />
//             </div>
//             {/* TOP IMAGE FOR MOBILE */}
//             <div className="flex md:hidden w-full gap-2 items-center justify-center mt-6 -mb-2 ">
//                 <Image
//                     src="/images/clarity.png"
//                     alt="clarity"
//                     width={47}
//                     height={41}
//                     className="object-cover"
//                 />
//                 <p className="font-semibold text-lg"> Clarity</p>
//             </div>
//             {/* LEFT — FORM AREA */}
//             <div className="flex flex-col p-6 lg:p-12 gap-6 lg:ml-6 lg:mt-6">
//                 {/* LOGO — Only visible on large screens */}
//                 <div className="hidden lg:flex gap-2 items-center">
//                     <Image
//                         src="/images/clarity.png"
//                         alt="clarity"
//                         width={47}
//                         height={41}
//                         className="object-cover"
//                     />
//                     <p className="font-semibold text-lg"> Clarity</p>
//                 </div>

//                 {/* FORM CONTENT */}
//                 <div className="w-full max-w-full md:p-10 lg:p-0">
//                     {children}
//                 </div>
//             </div>

//             {/* RIGHT — FULL IMAGE AREA (DESKTOP ONLY) */}
//             <div className="hidden lg:flex items-center justify-center bg-[#0A2342]">
//                 <Image
//                     src="/images/auth-image.png"
//                     alt="auth"
//                     width={700}
//                     height={700}
//                     className="object-cover"
//                 />
//             </div>
//         </div>
//     );
// }
"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import "../globals.css";

export default function AuthLayout({ children }: { children: React.ReactNode }) {

    useEffect(() => {
        const el = document.getElementById("scale-wrapper");
        if (!el) return;

        const resize = () => {
            const parent = el.parentElement;
            if (!parent) return;

            const scale = Math.min(parent.clientHeight / el.scrollHeight, 1);
            el.style.setProperty("--scale-factor", scale.toString());
        };

        resize();
        window.addEventListener("resize", resize);

        return () => window.removeEventListener("resize", resize);
    }, []);

    return (
        <div className="h-screen w-full grid grid-cols-1 lg:grid-cols-2 overflow-hidden">

            {/* TABLET IMAGE */}
            <div className="hidden md:flex lg:hidden w-full justify-center">
                <Image
                    src="/images/tablet-image.png"
                    alt="tablet"
                    width={500}
                    height={500}
                    className="object-cover w-full max-h-[300px]"
                />
            </div>

            {/* MOBILE LOGO */}
            <div className="flex md:hidden w-full gap-2 items-center justify-center mt-6 -mb-2">
                <Image
                    src="/images/clarity.png"
                    alt="clarity"
                    width={47}
                    height={41}
                />
                <p className="font-semibold text-lg"> Clarity</p>
            </div>

            {/* LEFT — FORM AREA WITH AUTO SCALE */}
            <div className="flex flex-col items-start justify-start p-6 lg:p-12 gap-6 lg:ml-6 lg:mt-6 relative">

                {/* SCALE WRAPPER */}
                <div
                    className="origin-top max-h-full w-full"
                    style={{
                        transform: "scale(var(--scale-factor, 1))",
                        transition: "transform 0.2s ease"
                    }}
                    id="scale-wrapper"
                >

                    {/* FORM CONTENT */}
                    <div className="w-full max-w-full">
                        {children}
                    </div>
                </div>
            </div>

            {/* RIGHT — IMAGE FULL HEIGHT */}
            <div className="hidden lg:flex items-center justify-center bg-[#0A2342] h-screen w-full relative">
                <Image
                    src="/images/auth-image.png"
                    alt="auth"
                    fill
                    className="object-cover"
                />
            </div>
             {/* <div className="hidden lg:flex items-start justify-center bg-[#0A2342] h-screen w-full overflow-hidden">
                <Image
                    src="/images/auth-image.png"
                    alt="auth"
                    width={900}
                    height={1600}
                    className="h-screen w-auto object-contain object-top"
                />
            </div> */}
        </div>
    );
}
