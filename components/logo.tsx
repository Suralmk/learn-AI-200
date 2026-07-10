import { Space_Grotesk } from "next/font/google";
import { cn } from "@/lib/utils";

const logoFont = Space_Grotesk({
  subsets: ["latin"],
  weight: ["600", "700"],
});

const AZURE_BLUE = "#2596be";

export function Logo({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md";
}) {
  const isSm = size === "sm";

  return (
    <div
      className={cn(
        logoFont.className,
        "leading-none select-none",
        className
      )}
    >
      <div
        className={cn(
          "font-bold tracking-tight",
          isSm ? "text-base" : "text-lg"
        )}
      >
        <span className="text-foreground">AI</span>
        <span style={{ color: AZURE_BLUE }}>-200</span>
      </div>
      <div
        className={cn(
          "font-semibold uppercase tracking-widest",
          isSm ? "mt-0.5 text-[9px]" : "mt-1 text-[10px]"
        )}
        style={{ color: AZURE_BLUE }}
      >
        Azure
      </div>
    </div>
  );
}

export function LogoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-8 shrink-0", className)}
      aria-hidden
    >
      <rect width="32" height="32" rx="7" fill={AZURE_BLUE} />
      <text
        x="16"
        y="21"
        textAnchor="middle"
        fill="white"
        fontFamily="system-ui, sans-serif"
        fontWeight="700"
        fontSize="11"
      >
        A2
      </text>
    </svg>
  );
}
