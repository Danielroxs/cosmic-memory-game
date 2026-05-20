import { useEffect, useRef } from 'react';

export default function StarField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    let animId;
    let frame = 0;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const makeLayer = (count, speed, size, baseOpacity) =>
      Array.from({ length: count }, () => ({
        x:           Math.random() * window.innerWidth,
        y:           Math.random() * window.innerHeight,
        speed,
        size:        size * (0.6 + Math.random() * 0.8),
        opacity:     baseOpacity * (0.4 + Math.random() * 0.6),
        phase:       Math.random() * Math.PI * 2,
        twinkleFreq: 0.015 + Math.random() * 0.025,
      }));

    const stars = [
      ...makeLayer(90, 0.10, 0.8, 0.55),
      ...makeLayer(45, 0.28, 1.4, 0.78),
      ...makeLayer(18, 0.55, 2.2, 1.00),
    ];

    const shooters = [];
    let nextShooter = 200 + Math.random() * 300;

    function spawnShooter() {
      shooters.push({
        x:     Math.random() * canvas.width * 0.8,
        y:     Math.random() * canvas.height * 0.3,
        vx:    4 + Math.random() * 5,
        vy:    1.5 + Math.random() * 2.5,
        len:   90 + Math.random() * 110,
        alpha: 1,
        fade:  0.012 + Math.random() * 0.008,
      });
      nextShooter = 250 + Math.random() * 350;
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      stars.forEach(s => {
        s.y += s.speed;
        if (s.y > canvas.height) { s.y = 0; s.x = Math.random() * canvas.width; }
        const twinkle = 0.45 + 0.55 * Math.sin(frame * s.twinkleFreq + s.phase);
        ctx.globalAlpha = Math.min(1, s.opacity * twinkle);
        ctx.fillStyle = '#cce8ff';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      });

      if (--nextShooter <= 0) spawnShooter();

      for (let i = shooters.length - 1; i >= 0; i--) {
        const sh = shooters[i];
        sh.x    += sh.vx;
        sh.y    += sh.vy;
        sh.alpha -= sh.fade;
        if (sh.alpha <= 0) { shooters.splice(i, 1); continue; }

        const grad = ctx.createLinearGradient(
          sh.x - sh.vx * (sh.len / sh.vx),
          sh.y - sh.vy * (sh.len / sh.vx),
          sh.x, sh.y,
        );
        grad.addColorStop(0, `rgba(255,255,255,0)`);
        grad.addColorStop(1, `rgba(200,240,255,${sh.alpha})`);

        ctx.globalAlpha = 1;
        ctx.strokeStyle = grad;
        ctx.lineWidth   = 1.8;
        ctx.beginPath();
        ctx.moveTo(sh.x - sh.vx * 20, sh.y - sh.vy * 20);
        ctx.lineTo(sh.x, sh.y);
        ctx.stroke();

        ctx.globalAlpha = sh.alpha;
        ctx.fillStyle   = '#ffffff';
        ctx.beginPath();
        ctx.arc(sh.x, sh.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}