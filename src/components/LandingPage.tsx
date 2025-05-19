
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart2, Calendar, CreditCard, PieChart, Shield, Star } from 'lucide-react';
import { toast } from 'sonner';

interface LandingPageProps {
  onJoin: () => void;
}

const LandingPage = ({ onJoin }: LandingPageProps) => {
  const handleJoinNow = () => {
    toast.success('Welcome to TripNest Budget! Start managing your travel expenses now.');
    onJoin();
  };

  return (
    <div className="flex flex-col min-h-[80vh] p-6 overflow-y-auto">
      {/* Hero Section with enhanced animations */}
      <div className="hero-gradient rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center mb-12 animate-float">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 fade-in text-gradient-primary dark:text-gradient" style={{animationDelay: '0.2s'}}>
            Travel Smart, <br />
            <span className="bg-gradient-to-r from-macos-blue to-macos-indigo bg-clip-text text-transparent animate-text-flow">
              Budget Brilliantly
            </span>
          </h1>
          <p className="text-lg opacity-80 mb-6 max-w-md fade-in" style={{animationDelay: '0.4s'}}>
            Plan, track, and enjoy your trips without the financial stress. 
            Your all-in-one vacation budget companion.
          </p>
          <div className="fade-in" style={{animationDelay: '0.6s'}}>
            <Button 
              onClick={handleJoinNow} 
              className="primary-button dark:neon-button"
              size="lg"
            >
              Join Now <ArrowRight className="ml-2" size={18} />
            </Button>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center fade-in" style={{animationDelay: '0.8s'}}>
          <div className="w-full max-w-md p-6 glass-card rotate-3 transform hover:rotate-0 hover:scale-105 transition-all duration-500 dark:neo-blur dark:hover:shadow-[var(--neon-blue)]">
            <div className="flex justify-between mb-4">
              <div>
                <h3 className="text-sm opacity-70">Trip Budget</h3>
                <h2 className="text-2xl font-bold dark:text-gradient">Hawaii 2023</h2>
              </div>
              <div className="bg-green-500/20 rounded-full p-2 text-green-600 dark:text-green-400">
                <BarChart2 size={24} />
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-white/20 dark:bg-white/5 p-3 rounded-lg flex justify-between hover-card transition-all duration-300">
                <span>Total Budget</span>
                <span className="font-medium">$3,500</span>
              </div>
              <div className="bg-white/20 dark:bg-white/5 p-3 rounded-lg flex justify-between hover-card transition-all duration-300">
                <span>Spent</span>
                <span className="font-medium">$2,180</span>
              </div>
              <div className="bg-white/20 dark:bg-white/5 p-3 rounded-lg flex justify-between hover-card transition-all duration-300">
                <span>Remaining</span>
                <span className="font-medium text-green-600 dark:text-green-400">$1,320</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex justify-between items-center">
                <span className="text-sm opacity-70">Trip Progress</span>
                <span className="text-sm font-medium">75%</span>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full mt-2">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1.5 rounded-full w-3/4 dark:shadow-[0_0_5px_rgba(131,131,255,0.5)]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section with improved cards */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-10 text-center dark:text-gradient">Why TripNest Budget?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              icon: <CreditCard className="w-10 h-10 text-blue-500 dark:text-macos-blue" />, 
              title: "Expense Tracking", 
              description: "Easily log and categorize all your travel expenses in one place." 
            },
            { 
              icon: <Calendar className="w-10 h-10 text-purple-500 dark:text-macos-purple" />, 
              title: "Trip Planning", 
              description: "Set budgets and plan your trips in advance to stay financially organized." 
            },
            { 
              icon: <PieChart className="w-10 h-10 text-indigo-500 dark:text-macos-indigo" />, 
              title: "Visual Analytics", 
              description: "Get insightful reports and charts to understand your spending habits." 
            },
          ].map((feature, index) => (
            <div 
              key={index} 
              className="glass-card p-6 transition-all duration-300 hover:-translate-y-3 fade-in hover-card dark:hover:shadow-[var(--neon-blue)]"
              style={{animationDelay: `${0.2 + (index * 0.2)}s`}}
            >
              <div className="mb-4 bg-white/20 dark:bg-white/10 rounded-full w-16 h-16 flex items-center justify-center">
                {feature.icon}
              </div>
              <h3 className="text-xl font-medium mb-2 dark:text-white">{feature.title}</h3>
              <p className="opacity-70">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonial Section with improved styling */}
      <div className="glass-card p-6 md:p-8 mb-12 fade-in dark:neo-blur hover:transform hover:-translate-y-3 transition-all duration-300 dark:hover:shadow-[var(--neon-purple)]" style={{animationDelay: '1.4s'}}>
        <div className="flex items-center justify-center mb-6">
          <Shield className="text-indigo-500 dark:text-macos-indigo mr-2" />
          <h2 className="text-2xl font-bold dark:text-gradient">Trusted by Travelers</h2>
        </div>
        <div className="flex flex-col items-center text-center">
          <p className="text-lg italic opacity-80 mb-4 max-w-2xl">
            "TripNest Budget completely changed how we plan our family vacations. 
            We used to overspend every time, but now we stay on budget without sacrificing the fun!"
          </p>
          <div className="flex items-center">
            <Star className="text-yellow-500 w-5 h-5" />
            <Star className="text-yellow-500 w-5 h-5" />
            <Star className="text-yellow-500 w-5 h-5" />
            <Star className="text-yellow-500 w-5 h-5" />
            <Star className="text-yellow-500 w-5 h-5" />
          </div>
          <p className="font-medium mt-2">- Sarah J., Family Traveler</p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center mt-auto pt-6 fade-in glass-card p-8 dark:hover:shadow-[var(--neon-green)] hover:transform hover:-translate-y-3 transition-all duration-300" style={{animationDelay: '1.6s'}}>
        <h2 className="text-2xl font-bold mb-4 dark:text-gradient">Ready to make your trips stress-free?</h2>
        <Button 
          onClick={handleJoinNow} 
          className="primary-button dark:neon-button"
          size="lg"
        >
          Get Started Today <ArrowRight className="ml-2" size={18} />
        </Button>
      </div>
    </div>
  );
};

export default LandingPage;
