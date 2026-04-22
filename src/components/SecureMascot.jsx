export default function SecureMascot({ className = "" }) {
  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      aria-hidden="true"
    >
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(250,204,21,0.22),transparent_58%)] blur-3xl" />
      <svg
        viewBox="0 0 240 240"
        className="relative h-full w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="shieldFill" x1="120" y1="30" x2="120" y2="196" gradientUnits="userSpaceOnUse">
            <stop stopColor="rgba(250,204,21,0.16)" />
            <stop offset="1" stopColor="rgba(99,102,241,0.08)" />
          </linearGradient>
          <linearGradient id="hoodFill" x1="120" y1="64" x2="120" y2="196" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1F2937" />
            <stop offset="1" stopColor="#111827" />
          </linearGradient>
          <radialGradient id="coreGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(120 144) rotate(90) scale(34)">
            <stop stopColor="#FACC15" stopOpacity="0.45" />
            <stop offset="1" stopColor="#FACC15" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="120" cy="120" r="102" fill="rgba(255,255,255,0.03)" />
        <circle cx="120" cy="120" r="101.5" stroke="rgba(255,255,255,0.08)" />

        <path
          d="M120 32L182 56V108C182 148.3 156.6 183.5 120 196C83.4 183.5 58 148.3 58 108V56L120 32Z"
          fill="url(#shieldFill)"
          stroke="rgba(250,204,21,0.22)"
          strokeWidth="2"
        />

        <ellipse cx="120" cy="150" rx="54" ry="58" fill="url(#hoodFill)" />
        <path
          d="M82 101C82 76.7 99.7 58 120 58C140.3 58 158 76.7 158 101V119H82V101Z"
          fill="url(#hoodFill)"
        />
        <path
          d="M92 107C92 86.6 104.5 72 120 72C135.5 72 148 86.6 148 107V119H92V107Z"
          fill="#0F172A"
          fillOpacity="0.86"
        />

        <path
          d="M96 118C101.8 111.6 109.8 108 120 108C130.2 108 138.2 111.6 144 118V140C144 154.4 133.3 166 120 166C106.7 166 96 154.4 96 140V118Z"
          fill="#18212F"
        />

        <path
          d="M104 129.5C108.5 127 114 125.8 120 125.8C126 125.8 131.5 127 136 129.5"
          stroke="rgba(255,255,255,0.16)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M106 119C109.2 117.1 113.5 116 120 116C126.5 116 130.8 117.1 134 119"
          stroke="#FACC15"
          strokeOpacity="0.18"
          strokeWidth="2"
          strokeLinecap="round"
        />

        <path d="M105 132H116" stroke="#F9FAFB" strokeOpacity="0.78" strokeWidth="4" strokeLinecap="round" />
        <path d="M124 132H135" stroke="#F9FAFB" strokeOpacity="0.78" strokeWidth="4" strokeLinecap="round" />
        <path d="M111 146C114.1 148.2 116.8 149 120 149C123.2 149 125.9 148.2 129 146" stroke="#F9FAFB" strokeOpacity="0.55" strokeWidth="3" strokeLinecap="round" />

        <path
          d="M82 191C84.8 170.7 98.7 158 120 158C141.3 158 155.2 170.7 158 191"
          fill="#111827"
        />
        <path
          d="M94 188C96.1 173.1 105.5 164 120 164C134.5 164 143.9 173.1 146 188"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="2"
        />

        <ellipse cx="120" cy="144" rx="36" ry="32" fill="url(#coreGlow)" />
        <path
          d="M105 137C105 128.7 111.7 122 120 122C128.3 122 135 128.7 135 137V142H129V137C129 132 125 128 120 128C115 128 111 132 111 137V142H105V137Z"
          fill="#FACC15"
        />
        <rect
          x="101"
          y="139"
          width="38"
          height="28"
          rx="10"
          fill="#0F172A"
          stroke="rgba(250,204,21,0.45)"
          strokeWidth="2"
        />
        <path
          d="M120 149C123.314 149 126 146.314 126 143C126 139.686 123.314 137 120 137C116.686 137 114 139.686 114 143C114 146.314 116.686 149 120 149Z"
          fill="#FACC15"
        />
        <path d="M120 149V156" stroke="#FACC15" strokeWidth="4.5" strokeLinecap="round" />

        <path d="M95 86L88 98" stroke="#FACC15" strokeOpacity="0.35" strokeWidth="3" strokeLinecap="round" />
        <path d="M145 86L152 98" stroke="#FACC15" strokeOpacity="0.35" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  );
}
