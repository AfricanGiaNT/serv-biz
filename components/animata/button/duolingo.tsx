import Link from "next/link";

interface DuolingoButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export default function DuolingoButton({ 
  children, 
  href, 
  onClick,
  className = "" 
}: DuolingoButtonProps) {
  const baseClasses = "relative box-border inline-block h-9 transform-gpu cursor-pointer touch-manipulation whitespace-nowrap rounded-lg border-b-2 border-solid border-transparent bg-[#DC2626] px-3 py-2 text-center text-xs font-bold uppercase leading-4 tracking-wider text-white outline-none transition-all duration-200 hover:brightness-110 active:border-b-0 active:border-t-2 active:bg-none disabled:cursor-auto";
  
  const shadowClasses = "absolute inset-0 -z-10 rounded-lg border-b-2 border-solid border-transparent bg-[#B91C1C]";
  
  const content = (
    <>
      {children}
      <span className={shadowClasses} />
    </>
  );

  if (href) {
    return (
      <Link href={href} className={`${baseClasses} ${className}`}>
        {content}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${className}`}
      role="button"
    >
      {content}
    </button>
  );
}