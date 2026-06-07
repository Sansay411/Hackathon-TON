"use client";

import Image from "next/image";

type WorkPayLogoProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizes = {
  sm: "h-10 w-10",
  md: "h-12 w-12",
  lg: "h-16 w-16"
};

export function WorkPayLogo({ size = "md", className = "" }: WorkPayLogoProps) {
  return (
    <div className={`${sizes[size]} shrink-0 overflow-hidden rounded-full bg-[#00658e] ring-4 ring-white/70 ${className}`}>
      <Image alt="WorkPay" className="h-full w-full object-cover" height={96} priority={size === "lg"} src="/workpay-logo.png" width={96} />
    </div>
  );
}
