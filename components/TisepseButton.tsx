
import React from 'react';

interface TisepseButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
}

export const TisepseButton: React.FC<TisepseButtonProps> = ({ 
  children, 
  onClick, 
  className = "",
  type = "button"
}) => {
  return (
    <button 
      type={type}
      onClick={onClick} 
      className={`tisepse-button ${className}`}
    >
      <div className="tisepse-button-inner">
        <span>{children}</span>
      </div>
    </button>
  );
};
