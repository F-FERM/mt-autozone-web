"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import carImg from "../../../public/images/homemaincar.png";
import card1Bg from "../../../public/images/card1car.jpg";
import checkIcon from "../../../public/images/qlementine-icons_certified-16.png";
import dropIcon from "../../../public/images/ri_paint-line.png";
import carIcon from "../../../public/images/carbon_car.png";
import gridIcon from "../../../public/images/fluent_glance-horizontal-sparkles-24-regular.png";



const features = [
  { icon: checkIcon, label: "Complete Car Detailing & Cleaning" },
  { icon: dropIcon, label: "Advanced Paint Protection & Polishing" },
  { icon: carIcon, label: "Premium Interior & Exterior Care" },
  { icon: gridIcon, label: "Professional Vehicle Appearance Solutions" },
];



const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 900;

function useCanvasScale(designWidth: number, designHeight: number) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const width = el.clientWidth;
      if (width > 0) setScale(width / designWidth);
    };

    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, [designWidth]);

  const safeScale = scale > 0 && Number.isFinite(scale) ? scale : 1;

  return { containerRef, scale: safeScale, height: safeScale * designHeight };
}



type ConnectorType = "satisfaction" | "experience" | "cars";

function Connector({ type }: { type: ConnectorType }) {
  if (type === "satisfaction") {
    return (
      <svg
        className="pointer-events-none absolute left-[106px] top-[-21px] z-[1] h-[119px] w-[189px] overflow-visible"
        viewBox="0 0 190 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 0 90 C 24 90, 45 90, 61 73 C 77 56, 76 29, 99 17 C 117 7, 143 8, 184 8"
          stroke="rgba(255,255,255,0.62)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle cx="0" cy="90" r="4" fill="#111111" stroke="rgba(255,255,255,0.9)" strokeWidth="1.3" />
      </svg>
    );
  }

  if (type === "experience") {
    return (
      <svg
        className="pointer-events-none absolute right-[7px] top-[65px] z-[-1] h-[138px] w-[133px] overflow-visible"
        viewBox="0 0 220 145"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 212 5 C 175 5, 150 7, 132 25 C 110 47, 111 78, 91 101 C 75 119, 48 128, 5 128"
          stroke="rgba(255,255,255,0.60)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle cx="212" cy="5" r="4" fill="#111111" stroke="rgba(255,255,255,0.9)" strokeWidth="1.3" />
      </svg>
    );
  }

  if (type === "cars") {
    return (
      <svg
        className="pointer-events-none absolute left-[-10px] top-[-70px] z-[1] h-[75px] w-[160px] overflow-visible"
        viewBox="0 0 160 75"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 10 8 C 30 4, 50 4, 66 12 C 80 19, 86 32, 88 48 C 89 55, 89 60, 89 65"
          stroke="rgba(255,255,255,0.55)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="89" cy="65" r="4" fill="#111111" stroke="rgba(255,255,255,0.9)" strokeWidth="1.3" />
      </svg>
    );
  }

  return null;
}



function MobileHero() {
  return (
    <div className="relative w-full bg-black px-5 py-10">
      <div className="relative overflow-hidden rounded-2xl">
        <Image
          src={carImg}
          alt="MT Auto Zone"
          className="h-[260px] w-full object-cover object-center opacity-90"
        />
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-5">
          <p className="font-poppins text-[40px] font-medium leading-none text-white/90">
            MT <span className="text-white/40">AUTO</span>
          </p>
          <p className="font-poppins text-[46px] font-medium leading-none tracking-tight text-white/25">
            ZONE
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="mt-6 grid grid-cols-3 gap-3 text-center font-poppins text-white">
        <div>
          <p className="text-[28px] font-normal leading-none tracking-[-1px]">22</p>
          <p className="mt-1 text-[12px] leading-tight text-[#BDBDBD]">
            Year Of
            <br />
            Experience
          </p>
        </div>
        <div>
          <p className="text-[28px] font-normal leading-none tracking-[-1px]">4.8</p>
          <p className="mt-1 text-[12px] leading-tight text-white">
            Customer
            <br />
            Satisfaction
          </p>
        </div>
        <div>
          <p className="text-[28px] font-normal leading-none tracking-[-1px] text-white/75">
            22301
          </p>
          <p className="mt-1 text-[12px] leading-tight text-[#B0B0B0]">Cars Served</p>
        </div>
      </div>

      {/* Card 1 */}
      <article className="relative mt-6 overflow-hidden rounded-2xl">
        <Image src={card1Bg} alt="" className="h-[160px] w-full object-cover" />
        <div className="absolute inset-0 flex flex-col justify-center gap-2 px-5">
          <h3 className="font-poppins text-[18px] font-medium leading-snug text-white">
            Premium Care. Impeccable Finish.
          </h3>
          <p className="font-poppins text-[14px] font-normal leading-snug text-[#C8C8C8]">
            Professional car detailing to restore, protect, and enhance your
            vehicle&rsquo;s appearance.
          </p>
        </div>
      </article>

      {/* Card 2 */}
      <article className="mt-4 flex flex-col gap-3 rounded-2xl border border-[#2f2f2f] bg-[#78787833] py-5 backdrop-blur-sm">
        <h3 className="px-5 font-poppins text-[18px] font-medium leading-snug text-white">
          Premium Automotive Detailing Solutions
        </h3>

        <ul className="flex flex-col">
          {features.map((f) => (
            <li
              key={f.label}
              className="flex items-center gap-3 border-b border-white/10 py-3 px-5 last:border-b-0"
            >
              <Image src={f.icon} alt="" width={20} height={20} className="shrink-0" />
              <span className="font-poppins text-[14px] font-normal leading-snug text-[#C0C0C0]">
                {f.label}
              </span>
            </li>
          ))}
        </ul>

        <div className="px-5">
          <Link
            href="/services"
            className="
              group flex w-full items-center justify-center gap-2
              rounded-[16px] border border-[#E400002B] bg-[#FFFFFF24]
              px-5 py-3
              font-poppins text-[15px] font-medium text-white
              shadow-[0_3px_4px_rgba(0,0,0,0.35)]
              transition-[background,box-shadow] duration-300 ease-out
              hover:bg-[linear-gradient(135deg,#4A2929_0%,#572C2C_25%,#8B2525_55%,#C91A1A_78%,#E00000_100%)]
              hover:shadow-[0_7px_6px_rgba(0,0,0,0.55)]
            "
          >
            <span>Explore</span>
            <span
              aria-hidden
              className="inline-block -rotate-45 transition-transform duration-300 ease-out group-hover:rotate-0"
            >
              →
            </span>
          </Link>
        </div>
      </article>

      {/* Bottom description */}
      <div
        className="mt-4 rounded-[10px] px-5 py-3 backdrop-blur-[4.4px]"
        style={{ background: "#62626254" }}
      >
        <p className="font-poppins text-[13px] font-normal leading-snug text-white">
          Elevating every vehicle with professional detailing, body
          polishing, paint protection, window tinting, and complete interior
          &amp; exterior care.
        </p>
      </div>
    </div>
  );
}


function DesktopHero() {
  const { containerRef, scale, height } = useCanvasScale(DESIGN_WIDTH, DESIGN_HEIGHT);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-full min-w-0 max-w-[1920px]"
      style={{ height }}
    >
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{
          width: DESIGN_WIDTH,
          height: DESIGN_HEIGHT,
          transform: `scale(${scale})`,
        }}
      >
        <div className="absolute inset-0 z-0">
          <Image
            src={carImg}
            alt="MT Auto Zone"
            fill
            priority
            className="object-cover object-center opacity-90"
          />
        </div>

        <article
          className="absolute z-[4] overflow-hidden rounded-[16px]"
          style={{ top: 108, left: 162, width: 425, height: 197 }}
        >
          <Image src={card1Bg} alt="" fill className="object-cover object-right" />
          <div className="relative z-10 flex h-full flex-col justify-center gap-3 px-6">
            <h3 className="font-poppins text-[22px] font-medium leading-[150%] text-white">
              Premium Care. Impeccable Finish.
            </h3>
            <p
              className="font-poppins text-[16px] font-normal leading-[150%] text-[#C8C8C8]"
              style={{ width: 306, height: 72 }}
            >
              Professional car detailing to restore, protect, and enhance
              your vehicle&rsquo;s appearance.
            </p>
          </div>
        </article>

        <p
          className="absolute left-[282px] top-[356px] z-[2] select-none font-poppins text-[140px] font-medium leading-none text-white/90"
          style={{ letterSpacing: "-6px" }}
        >
          MT <span className="text-white/40">AUTO</span>
        </p>

        <p className="absolute right-[465px] top-[607px] z-[2] select-none font-poppins text-[166px] font-medium leading-none tracking-tight text-white/25">
          ZONE
        </p>

        <div
          className="absolute left-[1095px] top-[303px] z-[5] font-poppins text-right text-white"
          style={{ width: 155 }}
        >
          <Connector type="experience" />
          <p className="relative z-[2] font-poppins text-[40px] font-normal leading-[0.9] tracking-[-1.5px] text-white">
            22
          </p>
          <p className="relative z-[2] mt-[7px] font-poppins text-[14px] font-normal leading-[1.25] text-[#BDBDBD]">
            Year Of
            <br />
            Experience
          </p>
        </div>

        <div
          className="absolute left-[345px] top-[582px] z-[5] font-poppins text-white"
          style={{ width: 150 }}
        >
          <p className="relative z-[2] font-poppins text-[40px] font-normal leading-[0.9] tracking-[-1.5px] text-white">
            4.8
          </p>
          <p className="relative z-[2] mt-[7px] font-poppins text-[14px] font-normal leading-[1.3] text-white">
            customer
            <br />
            Satisfaction
          </p>
          <Connector type="satisfaction" />
        </div>

        <div
          className="absolute left-[1031px] top-[830px] z-[5] font-poppins text-white/80"
          style={{ width: 155 }}
        >
          <Connector type="cars" />
          <p className="relative z-[2] font-poppins text-[40px] font-normal leading-[0.9] tracking-[-1.5px] text-white/75">
            22301
          </p>
          <p className="relative z-[2] mt-[7px] font-poppins text-[14px] font-normal leading-[1.2] text-[#B0B0B0]">
            Cars Served
          </p>
        </div>

        <article
          className="absolute z-[3] flex flex-col gap-[13px] rounded-[20px] border border-[#2f2f2f] bg-[#78787833] py-5 backdrop-blur-sm"
          style={{ top: 108, left: 1297, width: 523, height: 444 }}
        >
          <h3 className="px-[42px] font-poppins text-[24px] font-medium leading-[150%] text-white">
            Premium Automotive Detailing Solutions
          </h3>
          <ul className="flex flex-col">
            {features.map((f) => (
              <li
                key={f.label}
                className="flex items-center gap-[18px] border-b border-white/10 py-[17px] pl-[42px] pr-[40px] last:border-b-0"
              >
                <Image src={f.icon} alt="" width={24} height={24} className="shrink-0" />
                <span className="font-poppins text-[18px] font-normal leading-none text-[#C0C0C0]">
                  {f.label}
                </span>
              </li>
            ))}
          </ul>
          <div className="px-[42px]">
            <Link
              href="/services"
              className="
                group flex w-full items-center justify-center gap-2
                rounded-[19px] border border-[#E400002B] bg-[#FFFFFF24]
                px-[24px] py-[17px]
                font-poppins text-[16px] font-medium text-white
                shadow-[0_3px_4px_rgba(0,0,0,0.35)]
                transition-[background,box-shadow] duration-300 ease-out
                hover:bg-[linear-gradient(135deg,#4A2929_0%,#572C2C_25%,#8B2525_55%,#C91A1A_78%,#E00000_100%)]
                hover:shadow-[0_7px_6px_rgba(0,0,0,0.55)]
              "
            >
              <span>Explore</span>
              <span
                aria-hidden
                className="inline-block -rotate-45 transition-transform duration-300 ease-out group-hover:rotate-0"
              >
                →
              </span>
            </Link>
          </div>
        </article>

        <div
          className="absolute z-[5] flex items-center rounded-[10px] px-[30px] py-[10px] backdrop-blur-[4.4px]"
          style={{ top: 741, left: 162, width: 782, height: 68, background: "#62626254" }}
        >
          <p className="font-poppins text-[15px] font-normal leading-snug text-white">
            Elevating every vehicle with professional detailing, body
            polishing, paint protection, window tinting, and complete
            interior &amp; exterior care.
          </p>
        </div>
      </div>
    </div>
  );
}



export default function HeroSection() {
  return (
    <section className="relative w-full min-w-0 overflow-x-hidden overflow-y-hidden bg-black">
      <div className="block md:hidden">
        <MobileHero />
      </div>
      <div className="hidden md:block">
        <DesktopHero />
      </div>
    </section>
  );
}