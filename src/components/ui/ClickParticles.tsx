'use client';

import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  size: number;
  color: string;
}

const PARTICLE_COLORS = ['var(--accent)', 'var(--accent-light)', 'var(--info)'];
const PARTICLE_COUNT = 7;
const PARTICLE_LIFETIME = 1100;

export default function ClickParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    let nextId = 0;

    const handlePointerDown = (event: PointerEvent) => {
      if (event.button !== 0 || event.pointerType === 'pen') return;

      const created = Array.from({ length: PARTICLE_COUNT }, (_, index) => {
        const angle = (Math.PI * 2 * index) / PARTICLE_COUNT + Math.random() * 0.32;
        const distance = 18 + Math.random() * 26;

        return {
          id: nextId++,
          x: event.clientX,
          y: event.clientY,
          dx: Math.cos(angle) * distance,
          dy: Math.sin(angle) * distance,
          size: 4 + Math.random() * 4,
          color: PARTICLE_COLORS[index % PARTICLE_COLORS.length],
        };
      });

      setParticles((current) => [...current, ...created]);

      window.setTimeout(() => {
        const createdIds = new Set(created.map((particle) => particle.id));
        setParticles((current) => current.filter((particle) => !createdIds.has(particle.id)));
      }, PARTICLE_LIFETIME);
    };

    window.addEventListener('pointerdown', handlePointerDown, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, []);

  if (particles.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden" aria-hidden="true">
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="click-particle"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            ['--particle-x' as string]: `${particle.dx}px`,
            ['--particle-y' as string]: `${particle.dy}px`,
          }}
        />
      ))}
    </div>
  );
}
