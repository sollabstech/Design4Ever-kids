"use client";

import { useState } from "react";
import { inputCls } from "@/components/ui";

export default function PasswordInput(props: React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  const [show, setShow] = useState(false);
  const { invalid, className, ...rest } = props;
  return (
    <div className="relative">
      <input {...rest} type={show ? "text" : "password"} className={`${inputCls} pr-16 ${invalid ? "border-red-300" : ""} ${className ?? ""}`} />
      <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-[#e91e8c]">
        {show ? "Hide" : "Show"}
      </button>
    </div>
  );
}
