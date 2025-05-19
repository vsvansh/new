
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  Home, 
  PieChart, 
  Calendar, 
  BarChart, 
  Settings, 
  CreditCard,
  Users,
  LineChart,
  Moon,
  Sun,
  Phone,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface DockItemProps {
  icon: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  label: string;
  disabled?: boolean;
}

const DockItem = ({ icon, isActive = false, onClick, label, disabled = false }: DockItemProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={cn(
        "dock-item group transition-all", 
        isActive ? "active scale-110" : "",
        isHovered ? "scale-125" : "",
        disabled ? "opacity-50 hover:cursor-not-allowed" : "hover:cursor-pointer"
      )}
      onClick={disabled ? undefined : onClick}
      title={disabled ? `${label} (Join first to access)` : label}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={cn(
        "relative p-2 rounded-xl bg-gradient-to-b from-white/20 to-black/5 dark:from-white/10 dark:to-black/20 border border-white/30 shadow-lg transition-all duration-300",
        isActive && "dark:shadow-[var(--glow-primary)] dark:border-macos-accent/50",
        isHovered && "dark:shadow-[var(--glow-blue)] dark:border-white/50 translate-y-[-5px]"
      )}>
        {icon}
        <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black/80 dark:bg-white/80 text-white dark:text-black text-xs py-1 px-2 rounded transition-opacity whitespace-nowrap">
          {disabled ? `${label} (Join first)` : label}
        </div>
      </div>
      {isActive && <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-macos-accent dark:shadow-[var(--glow-primary)]" />}
    </div>
  );
};

interface MacosDockProps {
  activeView: string;
  setActiveView: (view: string) => void;
  hasJoined: boolean;
}

const MacosDock = ({ activeView, setActiveView, hasJoined }: MacosDockProps) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const navigate = useNavigate();
  
  useEffect(() => {
    if (localStorage.theme === 'dark' || 
        (!('theme' in localStorage) && 
         window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.theme = newTheme;
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const navigateToContact = () => {
    navigate('/contact');
  };

  const dockItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={24} className="text-macos-accent dark:text-white" /> },
    { id: 'expenses', label: 'Expenses', icon: <CreditCard size={24} className="text-macos-accent dark:text-white" /> },
    { id: 'categories', label: 'Categories', icon: <PieChart size={24} className="text-macos-accent dark:text-white" /> },
    { id: 'planning', label: 'Trip Planning', icon: <Calendar size={24} className="text-macos-accent dark:text-white" /> },
    { id: 'reports', label: 'Reports', icon: <LineChart size={24} className="text-macos-accent dark:text-white" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart size={24} className="text-macos-accent dark:text-white" /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={24} className="text-macos-accent dark:text-white" /> },
    { id: 'collaborate', label: 'Collaborate', icon: <Users size={24} className="text-macos-accent dark:text-white" /> },
    { id: 'contact', label: 'Contact', icon: <Phone size={24} className="text-macos-accent dark:text-neon-pink" />, onClick: navigateToContact },
  ];

  return (
    <div className="macos-dock py-2 px-2 flex items-center backdrop-blur-2xl bg-white/20 dark:bg-black/40 border border-white/30 dark:border-white/20 dark:shadow-[0_0_15px_rgba(255,255,255,0.1)] rounded-2xl">
      {dockItems.map((item) => (
        <DockItem
          key={item.id}
          icon={item.icon}
          isActive={hasJoined && activeView === item.id}
          onClick={item.onClick || (() => setActiveView(item.id))}
          label={item.label}
          disabled={!hasJoined && item.id !== 'contact'}
        />
      ))}
      <div className="mx-2 h-8 w-[1px] bg-white/20 dark:bg-white/30"></div>
      <DockItem
        icon={theme === 'light' 
          ? <Moon size={24} className="text-macos-accent dark:text-white" /> 
          : <Sun size={24} className="text-white animate-pulse" />}
        onClick={toggleTheme}
        label={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
      />
    </div>
  );
};

export default MacosDock;
