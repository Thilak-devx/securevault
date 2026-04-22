import { useState } from "react";

export default function InputField({
  label,
  type = "text",
  placeholder,
  name,
  value,
  onChange,
  autoComplete,
  required = false,
}) {
  const isPasswordField = type === "password";
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const inputType =
    isPasswordField && isPasswordVisible ? "text" : type;

  return (
    <label className="block">
      <span className="mb-2.5 block text-sm font-medium tracking-[0.01em] text-textSecondary">
        {label}
      </span>
      <div className="group relative rounded-2xl transition-all duration-200 ease-in-out">
        <input
          type={inputType}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          required={required}
          className={`w-full rounded-2xl border border-white/10 bg-slate-900/80 py-3.5 text-[15px] text-textPrimary outline-none transition-all duration-200 ease-in-out placeholder:text-gray-400 hover:border-white/20 focus:border-yellow-400 focus:bg-slate-900 focus:ring-2 focus:ring-yellow-400/70 focus:shadow-[0_18px_40px_rgba(250,204,21,0.08)] ${
            isPasswordField ? "pl-4 pr-12" : "px-4"
          }`}
        />
        {isPasswordField ? (
          <button
            type="button"
            onClick={() => setIsPasswordVisible((current) => !current)}
            aria-label={isPasswordVisible ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-textSecondary transition-all duration-200 ease-in-out hover:bg-white/[0.06] hover:text-textPrimary active:scale-95"
          >
            {isPasswordVisible ? (
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path d="M3 3l18 18" />
                <path d="M10.58 10.58A2 2 0 0 0 12 14a2 2 0 0 0 1.42-.58" />
                <path d="M9.88 5.09A9.77 9.77 0 0 1 12 4c5 0 9.27 3.11 11 8a11.8 11.8 0 0 1-2.24 3.91" />
                <path d="M6.61 6.61C4.62 7.88 3.01 9.78 2 12c1.73 4.89 6 8 10 8 1.73 0 3.39-.47 4.83-1.29" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path d="M2 12s3.5-8 10-8 10 8 10 8-3.5 8-10 8S2 12 2 12Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        ) : null}
      </div>
    </label>
  );
}
