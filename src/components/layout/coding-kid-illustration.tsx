export function CodingKidIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 560 520"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Illustration of a boy coding on a laptop at a desk"
    >
      <defs>
        <linearGradient id="hoodie" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FB923C" />
          <stop offset="55%" stopColor="#F97066" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
        <linearGradient id="hair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B33F2E" />
          <stop offset="100%" stopColor="#5C2418" />
        </linearGradient>
        <linearGradient id="deskTop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B5652C" />
          <stop offset="100%" stopColor="#8A481E" />
        </linearGradient>
        <linearGradient id="screenGlow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1E2A47" />
          <stop offset="100%" stopColor="#0D1424" />
        </linearGradient>
      </defs>

      {/* Chair */}
      <rect x="330" y="230" width="150" height="230" rx="26" fill="#0F0B29" opacity="0.9" />

      {/* Desk legs */}
      <rect x="150" y="400" width="14" height="90" rx="4" fill="#6B3A18" />
      <rect x="430" y="400" width="14" height="90" rx="4" fill="#6B3A18" />

      {/* Desk top */}
      <rect x="130" y="370" width="330" height="26" rx="8" fill="url(#deskTop)" />
      <rect x="130" y="370" width="330" height="8" rx="4" fill="#C97B3D" opacity="0.6" />

      {/* Books stack */}
      <g>
        <rect x="160" y="332" width="88" height="20" rx="4" fill="#1F9D6B" transform="rotate(-2 160 332)" />
        <rect x="163" y="313" width="82" height="20" rx="4" fill="#E0574A" transform="rotate(2 163 313)" />
        <rect x="158" y="294" width="86" height="20" rx="4" fill="#3B6FE0" transform="rotate(-1 158 294)" />
      </g>

      {/* Pen */}
      <rect x="270" y="360" width="52" height="6" rx="3" fill="#1F2937" transform="rotate(-8 270 360)" />

      {/* Laptop keyboard base */}
      <path d="M270 356 L430 356 L444 372 L256 372 Z" fill="#D8DCE6" />
      <path d="M270 356 L430 356 L444 372 L256 372 Z" fill="#B7BEcc" opacity="0.4" />

      {/* Laptop screen */}
      <g>
        <path d="M278 220 L422 220 L432 356 L268 356 Z" fill="#111827" />
        <path d="M286 230 L414 230 L422 348 L278 348 Z" fill="url(#screenGlow)" />
        {/* code lines */}
        <rect x="296" y="246" width="46" height="5" rx="2.5" fill="#5EEAD4" opacity="0.85" />
        <rect x="296" y="258" width="80" height="5" rx="2.5" fill="#F472B6" opacity="0.8" />
        <rect x="308" y="270" width="64" height="5" rx="2.5" fill="#FDE68A" opacity="0.85" />
        <rect x="308" y="282" width="40" height="5" rx="2.5" fill="#93C5FD" opacity="0.8" />
        <rect x="296" y="294" width="70" height="5" rx="2.5" fill="#5EEAD4" opacity="0.7" />
        <rect x="296" y="306" width="52" height="5" rx="2.5" fill="#C4B5FD" opacity="0.8" />
        <rect x="308" y="318" width="34" height="5" rx="2.5" fill="#FDE68A" opacity="0.7" />
      </g>

      {/* ===== Boy ===== */}
      {/* Legs / pants */}
      <path d="M372 372 C372 372 400 400 402 440 C404 468 392 480 370 480 L346 480 C338 480 334 470 340 460 C352 438 350 400 360 376 Z" fill="#22284A" />

      {/* Hoodie body */}
      <path
        d="M330 240 C330 210 356 188 392 188 C432 188 458 216 460 254 C462 292 452 330 452 366 C452 384 438 396 418 396 L360 396 C346 396 336 384 336 368 C336 336 330 274 330 240 Z"
        fill="url(#hoodie)"
      />

      {/* Hoodie pocket detail */}
      <path d="M368 330 C368 322 376 316 388 316 C400 316 408 322 408 330 L408 356 C408 364 400 368 388 368 C376 368 368 364 368 356 Z" fill="#ffffff" opacity="0.12" />

      {/* Arm reaching to keyboard */}
      <path
        d="M358 260 C336 268 316 288 300 320 C292 336 296 348 310 350 C324 352 336 342 348 322 C360 302 372 282 372 268 Z"
        fill="url(#hoodie)"
      />
      {/* Hand */}
      <ellipse cx="300" cy="348" rx="16" ry="11" fill="#E9A876" />

      {/* Hood collar */}
      <path d="M352 210 C356 226 370 236 392 236 C412 236 426 226 430 212 C424 226 408 234 392 234 C374 234 358 226 352 210 Z" fill="#FDBA74" opacity="0.7" />

      {/* Neck */}
      <path d="M392 200 C392 214 392 224 396 232 L412 232 C414 222 412 210 408 198 Z" fill="#E9A876" />

      {/* Head */}
      <ellipse cx="404" cy="176" rx="46" ry="48" fill="#F0B583" />

      {/* Ear */}
      <ellipse cx="440" cy="182" rx="8" ry="11" fill="#E9A876" />

      {/* Nose bump (side profile facing left) */}
      <path d="M358 176 C352 180 350 186 354 192 C358 196 364 194 366 188 Z" fill="#F0B583" />

      {/* Blush */}
      <ellipse cx="374" cy="196" rx="9" ry="6" fill="#F4877A" opacity="0.45" />

      {/* Eye */}
      <ellipse cx="378" cy="168" rx="6" ry="7.5" fill="#241C1C" />
      <circle cx="380" cy="165" r="1.8" fill="#ffffff" />

      {/* Eyebrow */}
      <path d="M368 154 C372 150 380 149 386 152" stroke="#5C2418" strokeWidth="3.5" strokeLinecap="round" fill="none" />

      {/* Mouth */}
      <path d="M362 194 C366 198 372 199 377 197" stroke="#B4694F" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* Hair - spiky, layered */}
      <g fill="url(#hair)">
        <path d="M366 146 C346 132 340 104 352 82 C356 96 364 104 372 108 C368 90 374 68 392 56 C388 76 392 92 400 100 C404 78 420 62 442 58 C430 76 428 94 434 108 C444 92 462 84 480 88 C464 100 456 114 456 128 C456 128 456 128 456 128 C438 116 412 116 396 128 C384 122 372 130 366 146 Z" />
        <path d="M362 150 C356 140 356 128 364 120 C368 132 378 138 388 138 C378 144 368 148 362 150 Z" opacity="0.9" />
      </g>
      <g fill="#7A3323" opacity="0.55">
        <path d="M400 100 C404 90 412 82 422 78 C416 88 414 98 416 106 C410 104 404 102 400 100 Z" />
        <path d="M432 96 C440 90 450 88 460 90 C450 96 444 104 442 112 C438 106 434 100 432 96 Z" />
      </g>

      {/* Decorative floating dots near screen (subtle sparkle) */}
      <circle cx="470" cy="200" r="3" fill="#F5D0FE" opacity="0.7" />
      <circle cx="486" cy="222" r="2" fill="#BAE6FD" opacity="0.6" />
    </svg>
  );
}
