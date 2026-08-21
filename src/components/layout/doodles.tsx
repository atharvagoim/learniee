export function DoodleStar({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} style={style} aria-hidden>
      <path
        d="M20 2 L23.5 15 L37 17 L25.5 25 L29 38 L20 30 L11 38 L14.5 25 L3 17 L16.5 15 Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function DoodleSparkle({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden>
      <path
        d="M12 2c0 4.4 3.6 8 8 8-4.4 0-8 3.6-8 8 0-4.4-3.6-8-8-8 4.4 0 8-3.6 8-8Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function DoodleSquiggle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 16" fill="none" className={className} aria-hidden>
      <path
        d="M2 12c8-14 16 6 24-6s16 14 24 2 16-12 24 0 16 12 24 0 16-10 24 2"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function DoodleCircleArrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" fill="none" className={className} aria-hidden>
      <path
        d="M8 30c0-12 10-22 22-22 10 0 19 6.5 22 16"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M44 16l8 8-11 3" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function DoodleDotGrid({
  className = "",
  rows = 4,
  cols = 5,
}: {
  className?: string;
  rows?: number;
  cols?: number;
}) {
  const spacing = 14;
  const dots = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      dots.push(<circle key={`${r}-${c}`} cx={c * spacing + 4} cy={r * spacing + 4} r={2} fill="currentColor" />);
    }
  }
  return (
    <svg
      viewBox={`0 0 ${cols * spacing} ${rows * spacing}`}
      className={className}
      aria-hidden
    >
      {dots}
    </svg>
  );
}

export function DoodleCloud({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 36" fill="none" className={className} aria-hidden>
      <path
        d="M15 28a10 10 0 0 1-1-19.9A12 12 0 0 1 36 6a9 9 0 0 1 9 9 8 8 0 0 1-1 15.9H15Z"
        fill="currentColor"
      />
    </svg>
  );
}
