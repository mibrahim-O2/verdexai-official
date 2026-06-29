"use client";

import { useState } from "react";
import Eye from "../icons/Eye";
import EyeOff from "../icons/EyeOff";

export default function PasswordField({
  id,
  name,
  value,
  onChange,
  placeholder = "Enter your password",
  required = true,
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-3 py-2.5 pr-11 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
      >
        {visible ? <EyeOff /> : <Eye />}
      </button>
    </div>
  );
}