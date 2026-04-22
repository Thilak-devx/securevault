/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0B0F19",
        card: "#111827",
        accent: "#FACC15",
        secondary: "#6366F1",
        textPrimary: "#F9FAFB",
        textSecondary: "#9CA3AF",
      },
      boxShadow: {
        glow: "0 24px 80px rgba(250, 204, 21, 0.12)",
      },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(circle at top, rgba(99, 102, 241, 0.16), transparent 28%), radial-gradient(circle at bottom, rgba(250, 204, 21, 0.12), transparent 24%)",
      },
    },
  },
  plugins: [],
};
