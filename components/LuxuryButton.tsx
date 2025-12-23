
import React from 'react';

interface LuxuryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
}

export const LuxuryButton: React.FC<LuxuryButtonProps> = ({ 
  children, 
  onClick, 
  type = "button", 
  className = "",
  disabled = false 
}) => {
  return (
    <button 
      type={type} 
      onClick={onClick} 
      disabled={disabled}
      className={`luxury-button ${className}`}
    >
      <div className="luxury-button-inner">
        <span>{children}</span>
      </div>
    </button>
  );
};
