import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const AnimatedBackground = () => {
  const canvasRef = useRef(null);
  const { isDark } = useTheme();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const drawMandala = (x, y, size, rotation, color, opacity) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.globalAlpha = opacity;

      // Draw mandala pattern
      const segments = 12;
      for (let i = 0; i < segments; i++) {
        const angle = (i * Math.PI * 2) / segments;
        const x1 = Math.cos(angle) * size * 0.3;
        const y1 = Math.sin(angle) * size * 0.3;
        const x2 = Math.cos(angle) * size;
        const y2 = Math.sin(angle) * size;

        // Draw petal shapes
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(x1, y1, x2, y2);
        ctx.quadraticCurveTo(x1 * 0.8, y1 * 0.8, 0, 0);
        ctx.fillStyle = color;
        ctx.fill();

        // Draw inner details
        ctx.beginPath();
        ctx.arc(x1 * 0.5, y1 * 0.5, size * 0.1, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? '#ffffff' : '#000000';
        ctx.fill();
      }

      // Draw center pattern
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.2, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      ctx.restore();
    };

    const drawFloatingElements = () => {
      const colors = isDark 
        ? ['#ec4899', '#06b6d4', '#f59e0b', '#8b5cf6', '#10b981']
        : ['#f472b6', '#22d3ee', '#fbbf24', '#a78bfa', '#34d399'];

      // Draw multiple mandalas with different sizes and rotations
      for (let i = 0; i < 8; i++) {
        const x = (Math.sin(time * 0.001 + i) * 200) + canvas.width / 2;
        const y = (Math.cos(time * 0.001 + i * 0.7) * 150) + canvas.height / 2;
        const size = 30 + Math.sin(time * 0.002 + i) * 20;
        const rotation = time * 0.0005 + i * 0.5;
        const color = colors[i % colors.length];
        const opacity = 0.3 + Math.sin(time * 0.003 + i) * 0.2;

        drawMandala(x, y, size, rotation, color, opacity);
      }

      // Draw interactive mandala at mouse position
      if (isHovered) {
        const size = 60 + Math.sin(time * 0.01) * 20;
        const rotation = time * 0.005;
        const color = isDark ? '#f472b6' : '#ec4899';
        drawMandala(mousePos.x, mousePos.y, size, rotation, color, 0.6);
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw gradient background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
      );
      
      if (isDark) {
        gradient.addColorStop(0, '#0f172a');
        gradient.addColorStop(0.5, '#1e293b');
        gradient.addColorStop(1, '#334155');
      } else {
        gradient.addColorStop(0, '#f8fafc');
        gradient.addColorStop(0.5, '#e2e8f0');
        gradient.addColorStop(1, '#cbd5e1');
      }
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawFloatingElements();
      
      time += 16; // 60fps
      animationId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [isDark, mousePos, isHovered]);

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  );
};

export default AnimatedBackground;
