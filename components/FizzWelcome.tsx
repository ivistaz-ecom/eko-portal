'use client';
import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import '@/app/login/login.css';

/** The approved "fizzy" sign-in transition, played when the user lands back from Microsoft. */
export default function FizzWelcome({ firstName }: { firstName: string }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const play = params.get('welcome') === '1';

  useEffect(() => {
    if (!play) return;
    const tidy = () => router.replace(pathname, { scroll: false }); // drop ?welcome=1
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) { tidy(); return; }

    const W = window.innerWidth, H = window.innerHeight;
    const x = W / 2, y = H / 2;
    const R = Math.hypot(Math.max(x, W - x), Math.max(y, H - y)) + 40;
    const rnd = (a: number, b: number) => a + Math.random() * (b - a);

    const ov = document.createElement('div');
    ov.className = 'fzt';
    ov.setAttribute('aria-hidden', 'true');
    ov.innerHTML = '<div class="glow"></div><div class="c"><div class="w">eKO<b></b></div><div class="s"></div></div>';
    (ov.querySelector('.s') as HTMLElement).textContent = `Welcome back, ${firstName}`;
    document.body.appendChild(ov);

    for (let i = 0; i < 70; i++) {
      const b = document.createElement('i');
      const sz = rnd(5, 26);
      b.style.cssText = `left:${rnd(0, 100)}%;width:${sz}px;height:${sz}px`;
      ov.appendChild(b);
      b.animate(
        [{ transform: 'translate(0,0) scale(.6)', opacity: 0 }, { opacity: 1, offset: 0.15 }, { transform: `translate(${rnd(-60, 60)}px,${-(H + 120)}px) scale(1)`, opacity: 0.9 }],
        { duration: rnd(900, 1900), delay: rnd(0, 900), easing: 'cubic-bezier(.3,.1,.3,1)', fill: 'both' },
      );
    }
    ov.animate([{ clipPath: `circle(0px at ${x}px ${y}px)` }, { clipPath: `circle(${R}px at ${x}px ${y}px)` }], { duration: 680, easing: 'cubic-bezier(.65,0,.25,1)', fill: 'forwards' });
    const c = ov.querySelector('.c') as HTMLElement;
    c.animate([{ transform: 'scale(.55) translateY(20px)', opacity: 0 }, { transform: 'scale(1.06)', opacity: 1, offset: 0.7 }, { transform: 'scale(1)', opacity: 1 }], { duration: 620, delay: 360, easing: 'cubic-bezier(.2,.8,.2,1.2)', fill: 'both' });

    const t = window.setTimeout(() => {
      c.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-40px) scale(.96)' }], { duration: 380, easing: 'ease-in', fill: 'forwards' });
      const a = ov.animate([{ transform: 'translateY(0)', borderRadius: '0 0 0 0 / 0 0 0 0' }, { transform: 'translateY(-112%)', borderRadius: '0 0 50% 50% / 0 0 180px 180px' }], { duration: 820, delay: 120, easing: 'cubic-bezier(.75,0,.25,1)', fill: 'forwards' });
      a.onfinish = () => { ov.remove(); tidy(); };
    }, 1500);
    return () => { window.clearTimeout(t); ov.remove(); };
    // Run once on arrival; the URL tidy-up must not cancel the animation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
