import React, { useEffect, useRef } from 'react';

export default function BackgroundCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let animationFrameId;
    let nodes = [];
    const mouse = { x: -1000, y: -1000, active: false };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initNodes();
    };

    class CloudNode {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.baseRadius = Math.random() * 2 + 1.4;
        this.radius = this.baseRadius;
        this.color = Math.random() > 0.4 ? 'rgba(56, 189, 248, ' : 'rgba(99, 102, 241, ';
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        if (mouse.active) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            this.radius = this.baseRadius * 1.8;
            this.x -= (dx / dist) * 0.5;
            this.y -= (dy / dist) * 0.5;
          } else {
            this.radius = this.baseRadius;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color + '0.7)';
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color + '0.5)';
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    function initNodes() {
      nodes = [];
      const count = Math.min(Math.floor((width * height) / 22000), 55);
      for (let i = 0; i < count; i++) {
        nodes.push(new CloudNode());
      }
    }

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    function animate() {
      ctx.clearRect(0, 0, width, height);

      // Connect nodes within proximity
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 135) {
            const alpha = (1 - dist / 135) * 0.18;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      nodes.forEach((node) => {
        node.update();
        node.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    }

    initNodes();
    animate();

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none -z-10" />
      <div
        className="fixed inset-0 pointer-events-none -z-20 overflow-hidden max-w-full"
        style={{ contain: 'paint', width: '100vw', height: '100vh' }}
      >
        <div className="absolute -top-[15%] left-1/2 -translate-x-1/2 w-[90vw] max-w-[900px] h-[600px] bg-gradient-to-br from-cyan-600/18 via-indigo-600/15 to-transparent rounded-full blur-[140px] animate-blob" />
        <div
          className="absolute top-[35%] -left-[15%] w-[60vw] max-w-[600px] h-[600px] bg-sky-600/12 rounded-full blur-[150px] animate-blob"
          style={{ animationDelay: '4s' }}
        />
        <div
          className="absolute top-[70%] -right-[15%] w-[70vw] max-w-[700px] h-[700px] bg-indigo-500/15 rounded-full blur-[160px] animate-blob"
          style={{ animationDelay: '8s' }}
        />
        <div className="absolute inset-0 bg-cyber-grid pointer-events-none opacity-40" />
      </div>
    </>
  );
}
