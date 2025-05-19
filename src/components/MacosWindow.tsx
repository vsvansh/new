
import React, { ReactNode, useState, useCallback, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Check, Maximize, Minimize } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MacosWindowProps {
  children: ReactNode;
  title?: string;
  className?: string;
  showControls?: boolean;
  onClose?: () => void;
}

const MacosWindow = ({ 
  children, 
  title = '', 
  className = '',
  showControls = true,
  onClose
}: MacosWindowProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Handle fullscreen change events from browser
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Properly handle close button (red button) to return to landing page
  const handleClose = useCallback(() => {
    if (onClose) {
      // Add animation class before closing
      document.querySelector('.macos-window')?.classList.add('animate-fade-out');
      // Allow animation to play before calling onClose
      setTimeout(() => {
        onClose();
      }, 300);
    } else {
      // Return to landing page by setting hasJoined to false in localStorage
      localStorage.removeItem('tripnest-joined');
      // Navigate to root with reload to show landing page
      navigate('/', { replace: true });
      window.location.reload();
    }
  }, [onClose, navigate]);

  // Handle fullscreen toggle (green button)
  const toggleFullscreen = useCallback(() => {
    const elem = document.documentElement;
    
    if (!document.fullscreenElement) {
      elem.requestFullscreen().then(() => {
        setIsFullscreen(true);
        
        // Make sure content covers the entire screen in fullscreen
        setTimeout(() => {
          const appContent = document.querySelector('.window-content');
          if (appContent) {
            appContent.classList.add('fullscreen-content');
          }
        }, 100);
      }).catch(err => {
        console.error('Could not enter fullscreen mode:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
        
        // Remove fullscreen specific styling
        const appContent = document.querySelector('.window-content');
        if (appContent) {
          appContent.classList.remove('fullscreen-content');
        }
      }).catch(err => {
        console.error('Could not exit fullscreen mode:', err);
      });
    }
  }, []);

  // Toggle dock visibility with proper animation (yellow button)
  const toggleDock = useCallback(() => {
    const dockElement = document.querySelector('.dock-container');
    
    if (dockElement) {
      if (dockElement.classList.contains('hidden')) {
        // Show dock with animation
        dockElement.classList.remove('hidden');
        dockElement.classList.add('animate-fade-in');
        dockElement.classList.remove('animate-fade-out');
        localStorage.setItem('dock-visible', 'true');
      } else {
        // Hide dock with animation
        dockElement.classList.add('animate-fade-out');
        dockElement.classList.remove('animate-fade-in');
        // Wait for animation to complete before hiding
        setTimeout(() => {
          dockElement.classList.add('hidden');
        }, 300);
        localStorage.setItem('dock-visible', 'false');
      }
    }
  }, []);

  return (
    <div className={cn(
      "macos-window overflow-hidden flex flex-col animate-fade-in", 
      isFullscreen ? "fixed inset-0 z-50 rounded-none" : "",
      className
    )}>
      <div className="window-titlebar px-4 py-2 flex items-center border-b border-gray-200/20">
        {showControls && (
          <div className="window-controls flex space-x-2">
            <button 
              className="macos-btn close hover:opacity-80 transition-opacity hover:shadow-[var(--glow-danger)]" 
              onClick={handleClose}
              aria-label="Close window"
            />
            <button 
              className="macos-btn minimize hover:opacity-80 transition-opacity hover:shadow-[var(--glow-success)]" 
              onClick={toggleDock}
              aria-label="Toggle dock"
            >
              {isFullscreen && <Minimize className="w-2 h-2 text-black/50" />}
            </button>
            <button 
              className="macos-btn expand hover:opacity-80 transition-opacity hover:shadow-[var(--glow-primary)]" 
              onClick={toggleFullscreen}
              aria-label="Toggle fullscreen"
            >
              {isFullscreen && <Maximize className="w-2 h-2 text-black/50" />}
            </button>
          </div>
        )}
        {title && (
          <div className="window-title flex-1 text-center text-sm font-medium">
            {title}
          </div>
        )}
        {!title && <div className="flex-1" />}
      </div>
      <div className={cn(
        "window-content flex-1 overflow-auto",
        isFullscreen ? "fullscreen-content" : ""
      )} ref={contentRef}>
        {children}
      </div>
    </div>
  );
};

export default MacosWindow;
