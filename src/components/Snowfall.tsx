import { useEffect, useRef } from 'react';

type Flake = {
  x: number;
  y: number;
  r: number;
  vy: number;
  vx: number;
  o: number;
  phase: number;
};

export default function Snowfall() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let t = 0;
    let flakes: Flake[] = [];

    const spawn = (anyY: boolean): Flake => ({
      x: Math.random() * canvas.width,
      y: anyY ? Math.random() * canvas.height : -8,
      r: 0.8 + Math.random() * 2.2,
      vy: 0.3 + Math.random() * 0.9,
      vx: -0.2 + Math.random() * 0.4,
      o: 0.2 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
    });

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const count = Math.min(140, Math.floor(canvas.width / 12));
      flakes = Array.from({ length: count }, () => spawn(true));
    };

    const tick = () => {
      t += 0.008;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < flakes.length; i++) {
        const f = flakes[i];
        f.y += f.vy;
        f.x += f.vx + Math.sin(t * 2 + f.phase) * 0.25;
        if (f.y > canvas.height + 10) flakes[i] = spawn(false);
        if (f.x < -12) f.x = canvas.width + 10;
        if (f.x > canvas.width + 12) f.x = -10;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(210, 235, 255, ${f.o})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener('resize', resize);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={ref} className="snowfall" aria-hidden="true" />;
}
