import Image from "next/image";
import { BUY_ME_A_COFFEE_URL } from "@/lib/site";
import { cn } from "@/lib/utils";
import button from "@/public/images/buy-me-a-coffee.png";

/** Buy Me a Coffee button (official artwork, served locally). */
export function BuyMeCoffee({ size = "md", className }: { size?: "sm" | "md"; className?: string }) {
  const width = size === "sm" ? 160 : 217;
  return (
    <a
      href={BUY_ME_A_COFFEE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("inline-block shrink-0 rounded-md transition-opacity hover:opacity-90", className)}
    >
      <Image src={button} alt="Buy Me a Coffee" width={width} height={Math.round((width * 153) / 545)} />
    </a>
  );
}
