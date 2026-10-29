'use client';
import { useEffect, useRef } from 'react';

const R = (a: number, b: number) => a + Math.random() * (b - a);

/** Rising bubbles, created after mount so server and client HTML match. */
export function useFizz(count: number, make: (i: number) => string) {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    const made: HTMLElement[] = [];
    for (let i = 0; i < count; i++) {
      const el = document.createElement('i');
      el.style.cssText = make(i);
      host.appendChild(el);
      made.push(el);
    }
    return () => made.forEach((el) => el.remove());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);
  return ref;
}

export const artBubble = () => {
  const sz = R(4, 14), dur = R(6, 13);
  return `left:${R(8, 98)}%;width:${sz}px;height:${sz}px;--dx:${R(-30, 30)}px;animation-duration:${dur}s;animation-delay:${-R(0, dur)}s`;
};

export const buttonBubble = () => {
  const sz = R(3, 9), dur = R(1.6, 3.6);
  return `left:${R(0, 100)}%;width:${sz}px;height:${sz}px;animation-duration:${dur}s;animation-delay:${-R(0, dur)}s`;
};

export function FizzArt() {
  const ref = useFizz(28, artBubble);
  return (
    <section className="fz-art" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="fz-hero" alt="" src="/images/login-hero.webp" />
      <div className="fizz" ref={ref as React.RefObject<HTMLDivElement>} />
    </section>
  );
}
