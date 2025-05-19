import React from 'react';
import { ArrowLeft, GithubIcon, LinkedinIcon, MailIcon, PhoneIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
const Contact = () => {
  return <div className="min-h-screen bg-macos-bg dark:bg-zinc-950 flex flex-col p-6 md:p-12">
      {/* Back button */}
      <Link to="/" className="self-start mb-8">
        <Button variant="ghost" size="sm" className="flex items-center gap-2 hover:bg-transparent">
          <ArrowLeft size={16} />
          <span>Back to Budget App</span>
        </Button>
      </Link>
      
      <div className="container mx-auto max-w-5xl">
        <div className="glass-card dark:neo-blur rounded-3xl p-8 md:p-12 flex flex-col lg:flex-row gap-12">
          {/* Left side - Photo and basic info */}
          <div className="flex-1 flex flex-col items-center lg:items-start">
            <div className="relative mb-8 animate-float">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 blur-lg dark:from-macos-pink dark:to-macos-purple dark:opacity-70"></div>
              <img src="uploads/f4515151-d701-4d5d-a99b-5831a528e849.png" alt="Vansh Singla" className="relative w-48 h-48 object-cover rounded-full border-4 border-white dark:border-zinc-800" />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center lg:text-left dark:text-gradient">Vansh Singla</h1>
            <h2 className="text-lg text-macos-blue dark:text-macos-indigo mb-6 text-center lg:text-left">Web Developer & Designer</h2>
            
            <div className="space-y-4 w-full max-w-md">
              <div className="flex items-center gap-3 glass-card dark:bg-zinc-900/50 p-4 rounded-xl hover-card transition-all duration-300">
                <PhoneIcon className="text-macos-blue dark:text-macos-blue" />
                <span>+91 987XX XXXXX</span>
              </div>
              <div className="flex items-center gap-3 glass-card dark:bg-zinc-900/50 p-4 rounded-xl hover-card transition-all duration-300">
                <MailIcon className="text-macos-red dark:text-macos-red" />
                <span>vs.vansh19@gmail.com</span>
              </div>
              <div className="flex items-center gap-3 glass-card dark:bg-zinc-900/50 p-4 rounded-xl hover-card transition-all duration-300">
                <GithubIcon className="text-macos-purple dark:text-macos-purple" />
                <span>github.com/vsvansh</span>
              </div>
              <div className="flex items-center gap-3 glass-card dark:bg-zinc-900/50 p-4 rounded-xl hover-card transition-all duration-300">
                <LinkedinIcon className="text-macos-blue dark:text-macos-blue" />
                <span>linkedin.com/in/vsvansh</span>
              </div>
            </div>
          </div>
          
          {/* Right side - About me and skills */}
          <div className="flex-1">
            <div className="mb-8 fade-in" style={{
            animationDelay: '0.2s'
          }}>
              <h2 className="text-2xl font-bold mb-4 dark:text-gradient">About Me</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Hi, I'm Vansh! I'm a passionate web developer and designer with expertise in creating beautiful, responsive, and functional web applications.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                I love exploring new technologies and frameworks to build innovative solutions. 
                When I'm not coding, you'll find me exploring new places, reading books, or playing guitar.
              </p>
            </div>
            
            <div className="mb-8 fade-in" style={{
            animationDelay: '0.4s'
          }}>
              <h2 className="text-2xl font-bold mb-4 dark:text-gradient">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {["React", "TypeScript", "TailwindCSS", "Node.js", "Next.js", "UI/UX Design", "Figma", "GraphQL", "MongoDB"].map((skill, index) => <div key={index} className="px-3 py-1 rounded-full bg-white/30 dark:bg-zinc-800 text-sm hover-card">
                    {skill}
                  </div>)}
              </div>
            </div>
            
            <div className="fade-in" style={{
            animationDelay: '0.6s'
          }}>
              <h2 className="text-2xl font-bold mb-4 dark:text-gradient">Projects</h2>
              <div className="space-y-4">
                {[{
                name: "TripNest Budget App",
                desc: "A beautiful vacation budget tracking application"
              }, {
                name: "Portfolio Website",
                desc: "Personal portfolio showcasing projects and skills"
              }, {
                name: "E-commerce Platform",
                desc: "Full-stack e-commerce solution with payment integration"
              }].map((project, index) => <div key={index} className="glass-card p-4 rounded-xl dark:bg-zinc-900/50 hover-card">
                    <h3 className="font-semibold mb-1">{project.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{project.desc}</p>
                  </div>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default Contact;