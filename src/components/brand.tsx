import Image from "next/image";
import Link from "next/link";

type BrandProps = {
  compact?: boolean;
  tone?: "light" | "dark";
  className?: string;
};

export function Brand({
  compact = false,
  tone = "light",
  className = "",
}: BrandProps) {
  const titleClass = tone === "dark" ? "text-white" : "text-[#242131]";
  const subtitleClass = tone === "dark" ? "text-white/45" : "text-[#868291]";

  return (
    <Link
      href="/"
      className={`focus-ring inline-flex items-center gap-3 rounded-xl ${className}`}
      aria-label="VIVA home"
    >
      <Image
        src="/viva-mark.svg"
        alt=""
        width={42}
        height={42}
        priority
        className="drop-shadow-[0_8px_16px_rgba(96,70,222,0.18)]"
      />
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className={`text-[1.08rem] font-black tracking-[0.24em] ${titleClass}`}>
            VIVA
          </span>
          <span
            className={`mt-1 whitespace-nowrap text-[0.48rem] font-bold tracking-[0.09em] ${subtitleClass}`}
          >
            VIRTUAL INTELLIGENT VITALITY ASSISTANT
          </span>
        </span>
      )}
    </Link>
  );
}
