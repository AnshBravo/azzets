import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  onClick,
  hoverEffect = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-raised border-2 border-edge p-6 shadow-glow transition-all duration-150 ${onClick ? "cursor-pointer select-none" : ""}
        ${hoverEffect ? "hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#000000] active:translate-x-0 active:translate-y-0 active:shadow-glow" : ""}
        ${className}`}
    >
      {children}
    </div>
  );
};
