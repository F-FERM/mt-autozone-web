"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import dustyCar from "../../../public/images/defender.png";
import halfCleanCar from "../../../public/images/haldfclean.png";
import cleanCar from "../../../public/images/cleancar.png";

export default function AboutSection() {
  const barRef = useRef<HTMLDivElement>(null);

  const [handlePosition, setHandlePosition] = useState(100);
  const [isDragging, setIsDragging] = useState(false);
  const [isHoveringCar, setIsHoveringCar] = useState(false);

  const updatePositionFromClientX = useCallback((clientX: number) => {
    const rect = barRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = clientX - rect.left;
    const pct = Math.min(100, Math.max(0, (x / rect.width) * 100));
    setHandlePosition(pct);
  }, []);

  const handleBarMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    updatePositionFromClientX(e.clientX);
  };

  useEffect(() => {
    if (!isDragging) return;
    const onMouseMove = (e: MouseEvent) => updatePositionFromClientX(e.clientX);
    const onMouseUp = () => setIsDragging(false);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging, updatePositionFromClientX]);

  const handleBarTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
    updatePositionFromClientX(e.touches[0].clientX);
  };

  useEffect(() => {
    if (!isDragging) return;
    const onTouchMove = (e: TouchEvent) =>
      updatePositionFromClientX(e.touches[0].clientX);
    const onTouchEnd = () => setIsDragging(false);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [isDragging, updatePositionFromClientX]);

  const revealProgress = 100 - handlePosition;
  const halfCleanReveal = Math.min(revealProgress * 2, 100);
  const cleanReveal = Math.max(0, (revealProgress - 50) * 2);

  return (
    <section className="relative mx-auto w-full max-w-[1920px] overflow-hidden py-10">
      <div
        className={`pointer-events-none absolute inset-y-[-15%] left-0 right-0 z-0 transition-opacity duration-700 ease-out ${
          isHoveringCar ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background:
            "linear-gradient(90deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.08) 45%, rgba(255,255,255,0) 75%)",
          clipPath: "polygon(100% 30%, 0% 0%, 0% 100%, 100% 70%)",
          mixBlendMode: "screen",
        }}
      />

      <div className="relative z-10 mx-auto flex max-w-[1464px] flex-col items-center gap-10 px-4 sm:px-6 lg:flex-row lg:items-center lg:gap-16">
        <div className="flex w-full max-w-[631px] flex-col gap-3.5 text-center lg:text-left">
          <p className="font-poppins text-base font-normal leading-none text-[#E40000]">
            About Us
          </p>
          <h2 className="font-poppins text-[26px] font-semibold leading-tight text-white sm:text-[30px] lg:text-[36px] lg:leading-[100%]">
            About MT Auto Zone
          </h2>
          <p className="font-poppins text-base font-normal leading-[150%] text-[#cfcfcf]">
            <span className="text-[#E40000]">MT Auto Zone</span> is a
            professional car care and detailing service provider based in
            Dubai, dedicated to improving the appearance, cleanliness and
            protection of the cars. Over the years of experience, we have
            been providing high quality services to our clients in the field
            of exterior and interior car care. Services provided by us
            include detailing, cleaning, body polishing, paint protection
            film, window tinting, interior cleaning, fabric protection,
            headlight restoration, rustproofing, glass cleaning and washing.
            We focus on professional workmanship, quality products, and
            attention to detail, ensuring every vehicle receives a clean,
            polished, and well-protected finish. At M.T. Autozone, we are
            committed to making every drive feel fresh and every vehicle
            looks its best.
          </p>

          <button
            className="
              group
              mx-auto mt-4 flex w-fit items-center gap-2
              rounded-[19px] border border-[#E400002B] bg-[#FFFFFF24]
              px-6 py-3
              font-poppins text-sm font-medium text-white
              shadow-[0_3px_4px_rgba(0,0,0,0.35)]
              transition-[background,box-shadow]
              duration-300 ease-out
              hover:bg-[linear-gradient(135deg,#4A2929_0%,#572C2C_25%,#8B2525_55%,#C91A1A_78%,#E00000_100%)]
              hover:shadow-[0_7px_6px_rgba(0,0,0,0.55)]
              lg:mx-0
            "
          >
            View More
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className="transition-transform duration-300 ease-out group-hover:rotate-[45deg]"
            >
              <path
                d="M7 17L17 7M17 7H8M17 7V16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="w-full max-w-[940px]">
          <div
            onMouseEnter={() => setIsHoveringCar(true)}
            onMouseLeave={() => setIsHoveringCar(false)}
            className="relative aspect-[940/520] w-full select-none bg-black"
          >
            <Image
              src={dustyCar}
              alt="MT Auto Zone — before detailing"
              fill
              priority
              className="object-contain object-center"
              draggable={false}
            />

            <div
              className="absolute inset-0 transition-[clip-path] duration-75 ease-out"
              style={{ clipPath: `inset(0 ${100 - halfCleanReveal}% 0 0)` }}
            >
              <Image
                src={halfCleanCar}
                alt="MT Auto Zone — halfway detailed"
                fill
                className="object-contain object-center"
                draggable={false}
              />
            </div>

            <div
              className="absolute inset-0 transition-[clip-path] duration-75 ease-out"
              style={{ clipPath: `inset(0 ${100 - cleanReveal}% 0 0)` }}
            >
              <Image
                src={cleanCar}
                alt="MT Auto Zone — after detailing"
                fill
                className="object-contain object-center"
                draggable={false}
              />
            </div>
          </div>

          <div
            ref={barRef}
            onMouseDown={handleBarMouseDown}
            onTouchStart={handleBarTouchStart}
            className="relative mt-6 h-[3px] w-full cursor-pointer rounded-full bg-white/15 py-3"
          >
            <div className="absolute left-0 top-1/2 h-[3px] w-full -translate-y-1/2 rounded-full bg-white/15" />
            <div
              className="absolute left-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-white/70 transition-[width] duration-75 ease-out"
              style={{ width: `${revealProgress}%` }}
            />
            <div
              className="absolute top-1/2 flex h-6 w-9 -translate-y-1/2 cursor-grab items-center justify-center rounded-full bg-[#E40000] text-white shadow-[0_0_12px_rgba(228,0,0,0.6)] transition-[left] duration-75 ease-out active:cursor-grabbing"
              style={{
                left: `clamp(0px, calc(${handlePosition}% - 18px), calc(100% - 36px))`,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M11 17l-5-5 5-5M18 17l-5-5 5-5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}