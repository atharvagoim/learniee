export function WaveDivider({
  color = "var(--color-bg)",
  flip = false,
  className = "",
}: {
  color?: string;
  flip?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 ${flip ? "top-0 -scale-y-100" : "bottom-0"} ${className}`}
    >
      <svg
        viewBox="0 0 1440 90"
        preserveAspectRatio="none"
        className="h-[46px] w-full sm:h-[70px]"
      >
        <path
          d="M0,32 C240,80 480,0 720,24 C960,48 1200,88 1440,40 L1440,90 L0,90 Z"
          fill={color}
        />
      </svg>
    </div>
  );
}
