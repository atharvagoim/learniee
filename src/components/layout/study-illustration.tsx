export function StudyIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 420 400"
      fill="none"
      className={className}
      role="img"
      aria-label="Illustration of a child studying at a desk with a laptop and books"
    >
      {/* ground shadow */}
      <ellipse cx="210" cy="360" rx="150" ry="14" fill="#FFFFFF" opacity="0.12" />

      {/* floating rings / bokeh */}
      <circle cx="60" cy="70" r="5" fill="#FFFFFF" opacity="0.35" />
      <circle cx="356" cy="60" r="4" fill="#FBBF24" opacity="0.6" />
      <circle cx="374" cy="120" r="7" fill="#FFFFFF" opacity="0.2" />
      <circle cx="40" cy="230" r="6" fill="#38BDF8" opacity="0.4" />

      {/* desk legs */}
      <rect x="90" y="300" width="10" height="55" rx="3" fill="#FFFFFF" opacity="0.55" />
      <rect x="320" y="300" width="10" height="55" rx="3" fill="#FFFFFF" opacity="0.55" />

      {/* desk top */}
      <rect x="60" y="282" width="300" height="20" rx="8" fill="#FFFFFF" opacity="0.92" />
      <rect x="60" y="282" width="300" height="8" rx="4" fill="#FFFFFF" />

      {/* stack of books on desk (left) */}
      <rect x="78" y="256" width="70" height="14" rx="3" fill="#FBBF24" />
      <rect x="82" y="242" width="62" height="14" rx="3" fill="#FB7185" />
      <rect x="86" y="228" width="54" height="14" rx="3" fill="#38BDF8" />

      {/* potted plant (right) */}
      <path
        d="M320 232c0-14 10-24 14-24s14 10 14 24"
        stroke="#34D399"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M334 240c0-18 12-30 12-30M334 240c0-18-12-30-12-30"
        stroke="#34D399"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path d="M316 256h36l-5 26h-26z" fill="#F472B6" />

      {/* desk lamp */}
      <rect x="272" y="270" width="8" height="34" rx="3" fill="#FBBF24" />
      <path d="M240 250l40-8 10 20-46 10z" fill="#FBBF24" />
      <circle cx="276" cy="266" r="6" fill="#FFFFFF" />

      {/* laptop */}
      <path d="M150 258h64l8 26h-80z" fill="#E9E4FF" />
      <rect x="152" y="206" width="60" height="52" rx="4" fill="#FFFFFF" />
      <rect x="158" y="212" width="48" height="34" rx="2" fill="#6D28D9" />
      <rect x="168" y="222" width="6" height="14" rx="1.5" fill="#FBBF24" />
      <rect x="177" y="216" width="6" height="20" rx="1.5" fill="#FFFFFF" />
      <rect x="186" y="226" width="6" height="10" rx="1.5" fill="#38BDF8" />

      {/* mug */}
      <rect x="228" y="264" width="20" height="18" rx="3" fill="#FFFFFF" />
      <path d="M248 268c6 0 6 10 0 10" stroke="#FFFFFF" strokeWidth="3" fill="none" />

      {/* open book in child's hands */}
      <path d="M176 292l30-6 30 6-30 8z" fill="#FFFFFF" />
      <path d="M176 292l30-6v8l-30 6z" fill="#F4F1FF" />

      {/* child seated (simple flat blob figure, original / non-representational) */}
      <ellipse cx="205" cy="352" rx="30" ry="8" fill="#000000" opacity="0.08" />
      {/* legs */}
      <path d="M188 330c-4 10-6 20-4 28" stroke="#1F2937" strokeWidth="10" strokeLinecap="round" />
      <path d="M222 330c4 10 6 20 4 28" stroke="#1F2937" strokeWidth="10" strokeLinecap="round" />
      {/* torso */}
      <path d="M180 300c0-20 12-34 25-34s25 14 25 34-14 30-25 30-25-10-25-30z" fill="#6D28D9" />
      {/* arms holding book */}
      <path d="M186 300c-6 2-10 -2 -8 -8" stroke="#F2B8A0" strokeWidth="8" strokeLinecap="round" />
      <path d="M224 300c6 2 10 -2 8 -8" stroke="#F2B8A0" strokeWidth="8" strokeLinecap="round" />
      {/* head */}
      <circle cx="205" cy="252" r="22" fill="#F2B8A0" />
      {/* hair */}
      <path
        d="M183 250c-2-16 10-28 22-28s24 12 22 28c-6-8-14-4-22-4s-16-4-22 4z"
        fill="#3B2A20"
      />
      {/* simple smiling face */}
      <circle cx="197" cy="253" r="2.4" fill="#1F2937" />
      <circle cx="213" cy="253" r="2.4" fill="#1F2937" />
      <path d="M198 262c4 4 10 4 14 0" stroke="#1F2937" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    </svg>
  );
}
