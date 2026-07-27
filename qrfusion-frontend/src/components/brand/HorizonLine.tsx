interface HorizonLineProps {
  className?: string;
  flip?: boolean;
}

export function HorizonLine({ className = '', flip = false }: HorizonLineProps) {
  return (
    <div className={`w-full overflow-hidden leading-none pointer-events-none select-none ${className}`}>
      <svg
        viewBox="0 0 1440 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-auto ${flip ? 'rotate-180' : ''}`}
      >
        <path
          d="M0 80 C 480 10, 960 10, 1440 80"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-primary opacity-[0.12] dark:opacity-[0.15]"
        />
      </svg>
    </div>
  );
}
