
import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from './ui/button';

interface SaveButtonProps {
  onClick?: () => void;
  className?: string;
}

const SaveButton = ({ onClick, className }: SaveButtonProps) => {
  const [isSaved, setIsSaved] = useState(false);
  
  const handleClick = () => {
    if (onClick) onClick();
    
    setIsSaved(true);
    
    // Reset back to "Save Changes" after 3 seconds
    setTimeout(() => {
      setIsSaved(false);
    }, 3000);
  };
  
  return (
    <Button 
      onClick={handleClick}
      className={`transition-all duration-300 ${isSaved ? 'bg-green-500 hover:bg-green-600 dark:shadow-[var(--neon-green)]' : ''} ${className || ''}`}
    >
      {isSaved ? (
        <span className="flex items-center">
          <Check className="mr-2 h-4 w-4" /> Changes Saved
        </span>
      ) : (
        "Save Changes"
      )}
    </Button>
  );
};

export default SaveButton;
