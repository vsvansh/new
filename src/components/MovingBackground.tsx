
import React, { useEffect, useRef } from 'react';

const MovingBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Initialize canvas size
    resizeCanvas();
    
    // Handle window resize
    window.addEventListener('resize', resizeCanvas);

    // Check if dark mode is enabled
    const isDarkMode = document.documentElement.classList.contains('dark');

    // Create gradient blobs with colors based on theme
    const blobs = Array.from({ length: 6 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 400 + 200,
      xSpeed: (Math.random() - 0.5) * 0.7,
      ySpeed: (Math.random() - 0.5) * 0.7,
      hue: Math.random() * 360,
      saturation: isDarkMode ? 70 : 80,
      lightness: isDarkMode ? 40 : 70,
      alpha: isDarkMode ? 0.4 : 0.2,
    }));

    // Animation function
    const animate = () => {
      // Semi-transparent layer for trail effect
      ctx.fillStyle = isDarkMode 
        ? 'rgba(10, 10, 20, 0.03)' 
        : 'rgba(245, 245, 247, 0.03)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw each blob
      blobs.forEach((blob) => {
        // Move blob
        blob.x += blob.xSpeed;
        blob.y += blob.ySpeed;

        // Bounce off edges
        if (blob.x < -100 || blob.x > canvas.width + 100) blob.xSpeed *= -1;
        if (blob.y < -100 || blob.y > canvas.height + 100) blob.ySpeed *= -1;

        // Create gradient
        const gradient = ctx.createRadialGradient(
          blob.x, blob.y, 0,
          blob.x, blob.y, blob.radius
        );

        // Set colors based on dark/light mode
        if (isDarkMode) {
          // Neon colors for dark mode
          gradient.addColorStop(0, `hsla(${blob.hue}, ${blob.saturation}%, ${blob.lightness}%, ${blob.alpha})`);
          gradient.addColorStop(1, `hsla(${blob.hue}, ${blob.saturation}%, ${blob.lightness}%, 0)`);
        } else {
          // Softer colors for light mode
          gradient.addColorStop(0, `hsla(${blob.hue}, ${blob.saturation}%, ${blob.lightness}%, ${blob.alpha * 0.8})`);
          gradient.addColorStop(1, `hsla(${blob.hue}, ${blob.saturation}%, ${blob.lightness}%, 0)`);
        }

        // Draw blob
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
        ctx.fill();

        // Slowly change hue for color cycling effect
        blob.hue = (blob.hue + 0.2) % 360;
      });

      requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full -z-10"
      aria-hidden="true"
    />
  );
};

export default MovingBackground;
