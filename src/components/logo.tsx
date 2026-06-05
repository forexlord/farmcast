type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  return (
    <svg
      width="200"
      height="50"
      viewBox="0 0 200 50"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="FarmCast"
      role="img"
    >
      <path
        d="M10 25C10 15 18 10 25 10C32 10 40 15 40 25C40 35 32 40 25 40C18 40 10 35 10 25Z"
        fill="var(--color-primary-container)"
      />
      <path
        d="M25 10C25 10 28 15 28 25C28 35 25 40 25 40"
        stroke="var(--color-surface-container-lowest)"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M25 18C30 18 34 21 34 25"
        stroke="var(--color-surface-container-lowest)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <text
        x="50"
        y="33"
        fontFamily="var(--font-sans)"
        fontWeight="700"
        fontSize="24"
        fill="var(--color-on-surface)"
      >
        FarmCast
      </text>
    </svg>
  );
}
