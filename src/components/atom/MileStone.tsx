"use client";

import { useEffect, useRef, useState } from "react";

const milestones = [
  { value: 5, suffix: "+", label: "Courses" },
  { value: 10, suffix: "+", label: "Successful Programs" },
  { value: 500, suffix: "+", label: "Trained Professionals" },
  { value: 400, suffix: "+", label: "Graduates" },
];

function useCountUp(target: number, started: boolean, duration = 1800) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) return;

    let startTime: number | null = null;
    let raf = 0;

    const step = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));

      if (progress < 1) {
        raf = requestAnimationFrame(step);
      }
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, started]);

  return count;
}

function MilestoneStat({
  value,
  suffix,
  label,
  started,
}: {
  value: number;
  suffix: string;
  label: string;
  started: boolean;
}) {
  const count = useCountUp(value, started);

  return (
    <div className='text-center relative'>
      <span className='md:text-[48px] font-bold tabular-nums'>
        {count}
        {suffix}
      </span>
      <p className='text-sm mt-1 md:text-[18px]'>{label}</p>
    </div>
  );
}

export const MileStone = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className='py-20 my-16 bg-[#27156F] bg-cover bg-center relative animate-bg-move '
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/dcgghkk7q/image/upload/c_crop,w_1200/v1741252922/Milestone_fill_pebo8m.png')",
      }}
    >
      <div className='bg-ellipse top-48 h-[125px] w-[90%] rounded-[100%] left-30 max-sm:hidden' />
      <div className='relative max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 divide-x-4 justify-between items-stretch text-white '>
        {milestones.map((item) => (
          <MilestoneStat
            key={item.label}
            value={item.value}
            suffix={item.suffix}
            label={item.label}
            started={started}
          />
        ))}
      </div>
    </section>
  );
};
