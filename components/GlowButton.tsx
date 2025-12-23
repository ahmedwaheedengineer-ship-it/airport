
import React from 'react';

interface GlowButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'blue' | 'red';
  className?: string;
  type?: "button" | "submit";
}

export const GlowButton: React.FC<GlowButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'blue', 
  className = "",
  type = "button"
}) => {
  const variantClass = variant === 'red' ? 'glow-button-red' : 'glow-button-blue';
  return (
    <button 
      type={type}
      onClick={onClick} 
      className={`glow-button ${variantClass} ${className}`}
    >
      {children}
    </button>
  );
};
