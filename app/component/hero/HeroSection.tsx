"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import carImg from "../../../public/images/homemaincar.png";
import card1Bg from "../../../public/images/card1car.jpg";
import checkIcon from "../../../public/images/qlementine-icons_certified-16.png";
import dropIcon from "../../../public/images/ri_paint-line.png";
import carIcon from "../../../public/images/carbon_car.png";
import gridIcon from "../../../public/images/fluent_glance-horizontal-sparkles-24-regular.png";

import api from "@/lib/axios";

// ================= TYPES =================

interface HomeHeroStats {
  yearsOfExperience: number;
  yearsLabel: string;
  customerSatisfaction: number;
  satisfactionLabel: string;
  carsServiced: number;
  carsServicedLabel: string;
}

interface HomeHeroData {
  eyebrow: string;
  eyebrowDescription: string;
  subtitle: string;
  description: string;
  stats: HomeHeroStats;
}

// ================= STATIC DATA =================

const features = [
  { icon: checkIcon, label: "Complete Car Detailing & Cleaning" },
  { icon: dropIcon, label: "Advanced Paint Protection & Polishing" },
  { icon: carIcon, label: "Premium Interior & Exterior Care" },
  { icon: gridIcon, label: "Professional Vehicle Appearance Solutions" },
];

// Fallbacks used until the API responds (and if it fails) — matches the
// original static copy so there is never a flash of empty text.
const FALLBACK: HomeHeroData = {
  eyebrow: "Premium Care. Impeccable Finish.",
  eyebrowDescription:
    "Professional car detailing to restore, protect, and enhance your vehicle’s appearance.",
  subtitle: "Premium Automotive Detailing Solutions",
  description:
    "Elevating every vehicle with professional detailing, body polishing, paint protection, window tinting, and complete interior & exterior care.",
  stats: {
    yearsOfExperience: 22,
    yearsLabel: "Year Of\nExperience",
    customerSatisfaction: 4.8,
    satisfactionLabel: "Customer\nSatisfaction",
    carsServiced: 22301,
    carsServicedLabel: "Cars Served",
  },
};

/* ---------- Canvas sizes ---------- */
const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 900;

const COMPACT_WIDTH = 390;
const COMPACT_HEIGHT = 480;

const TABLET_WIDTH = 900;
const TABLET_HEIGHT = 580;

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

/**
 * Renders a stat label. If it contains a newline, split into two lines with
 * a <br />; otherwise render as a single line.
 */
function StatLabel({ text }: { text: string }) {
  const parts = text.split("\n");
  if (parts.length === 1) return <>{text}</>;
  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && <br />}
        </span>
      ))}
    </>
  );
}

/* ---------- Desktop connectors ---------- */
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

/* ---------- Compact connectors ---------- */
function CompactConnectors() {
  const stroke = "rgba(255,255,255,0.6)";
  const dot = { r: 3.5, fill: "#111111", stroke: "rgba(255,255,255,0.9)", strokeWidth: 1.2 };

  return (
    <svg
      className="pointer-events-none absolute left-0 top-0 z-[4] overflow-visible"
      width={COMPACT_WIDTH}
      height={COMPACT_HEIGHT}
      viewBox={`0 0 ${COMPACT_WIDTH} ${COMPACT_HEIGHT}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M 343.1 147.4 C 326.3 147.4, 315 148.8, 306.8 161.6 C 296.8 177.3, 297.3 199.5, 288.2 215.8 C 281 228.7, 268.8 235.2, 249.3 235.2"
        stroke={stroke}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="343.1" cy="147.4" {...dot} />

      <path
        d="M 62 322 C 62 314, 66 306, 76 300 C 88 293, 104 292, 124 296"
        stroke={stroke}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="62" cy="322" {...dot} />

      <path
        d="M 190 300 C 206 292, 222 298, 228 310 C 231 316, 232 319, 232 322"
        stroke={stroke}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="232" cy="322" {...dot} />
    </svg>
  );
}

/* ---------- Tablet connectors ---------- */
function TabletConnectors() {
  const stroke = "rgba(255,255,255,0.6)";
  const dot = { r: 4.5, fill: "#111111", stroke: "rgba(255,255,255,0.9)", strokeWidth: 1.5 };

  return (
    <svg
      className="pointer-events-none absolute left-0 top-0 z-[4] overflow-visible"
      width={TABLET_WIDTH}
      height={TABLET_HEIGHT}
      viewBox={`0 0 ${TABLET_WIDTH} ${TABLET_HEIGHT}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M 696.9 202 C 672.2 202, 655.6 204.1, 643.6 222.9 C 628.9 246, 629.6 278.6, 616.2 302.6 C 605.6 321.5, 587.7 331.1, 559 331.1"
        stroke={stroke}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="696.9" cy="202" {...dot} />

      <path
        d="M 107 389.4 C 107 377.7, 113 366, 127.6 357 C 145 347, 168.8 345.3, 198 351.2"
        stroke={stroke}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="107" cy="389.4" {...dot} />

      <path
        d="M 378 357 C 401.5 345, 425 354, 434 372 C 438 380.6, 439.7 385, 439.7 389.4"
        stroke={stroke}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="439.7" cy="389.4" {...dot} />
    </svg>
  );
}

/* ---------- Shared button ---------- */
function ExploreButton({
  className = "",
  label = "Explore",
  href = "/services",
}: {
  className?: string;
  label?: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className={`
        group flex w-full items-center justify-center gap-2
        border border-[#E400002B] bg-[#FFFFFF24]
        font-poppins font-medium text-white
        shadow-[0_3px_4px_rgba(0,0,0,0.35)]
        transition-[background,box-shadow] duration-300 ease-out
        hover:bg-[linear-gradient(135deg,#4A2929_0%,#572C2C_25%,#8B2525_55%,#C91A1A_78%,#E00000_100%)]
        hover:shadow-[0_7px_6px_rgba(0,0,0,0.55)]
        ${className}
      `}
    >
      <span>{label}</span>
      <span
        aria-hidden
        className="inline-block -rotate-45 transition-transform duration-300 ease-out group-hover:rotate-0"
      >
        →
      </span>
    </Link>
  );
}

/* =========================================================
   COMPACT (mobile)
   ========================================================= */

function CompactCanvas({ data }: { data: HomeHeroData }) {
  const { containerRef, scale, height } = useCanvasScale(COMPACT_WIDTH, COMPACT_HEIGHT);
  const { stats } = data;

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-full min-w-0"
      style={{ height }}
    >
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{
          width: COMPACT_WIDTH,
          height: COMPACT_HEIGHT,
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
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60" />
        </div>

        <p
          className="absolute left-[24px] top-[150px] z-[2] select-none font-poppins text-[58px] font-medium leading-none text-white/90"
          style={{ letterSpacing: "-2.5px" }}
        >
          MT <span className="text-white/40">AUTO</span>
        </p>

        <p className="absolute right-[24px] top-[212px] z-[2] select-none font-poppins text-[68px] font-medium leading-none tracking-tight text-white/25">
          ZONE
        </p>

        {/* ✅ Experience — dynamic from API */}
        <div
          className="absolute left-[222px] top-[78px] z-[5] text-right font-poppins text-white"
          style={{ width: 130 }}
        >
          <p className="relative z-[2] font-poppins text-[30px] font-normal leading-[0.9] tracking-[-1px] text-white">
            {stats.yearsOfExperience}
          </p>
          <p className="relative z-[2] mt-[5px] font-poppins text-[11px] font-normal leading-[1.25] text-[#BDBDBD]">
            <StatLabel text={stats.yearsLabel} />
          </p>
        </div>

        {/* ✅ Satisfaction — dynamic */}
        <div
          className="absolute left-[30px] top-[336px] z-[5] font-poppins text-white"
          style={{ width: 110 }}
        >
          <p className="relative z-[2] font-poppins text-[30px] font-normal leading-[0.9] tracking-[-1px] text-white">
            {stats.customerSatisfaction}
          </p>
          <p className="relative z-[2] mt-[5px] font-poppins text-[11px] font-normal leading-[1.3] text-white">
            <StatLabel text={stats.satisfactionLabel} />
          </p>
        </div>

        {/* ✅ Cars served — dynamic */}
        <div
          className="absolute left-[205px] top-[336px] z-[5] font-poppins text-white/80"
          style={{ width: 120 }}
        >
          <p className="relative z-[2] font-poppins text-[30px] font-normal leading-[0.9] tracking-[-1px] text-white/75">
            {stats.carsServiced}
          </p>
          <p className="relative z-[2] mt-[5px] font-poppins text-[11px] font-normal leading-[1.2] text-[#B0B0B0]">
            <StatLabel text={stats.carsServicedLabel} />
          </p>
        </div>

        {/* ✅ Description — dynamic */}
        <div
          className="absolute z-[5] flex items-center rounded-[10px] px-[16px] py-[8px] backdrop-blur-[4.4px]"
          style={{ top: 410, left: 20, width: 350, height: 54, background: "#62626254" }}
        >
          <p className="font-poppins text-[11px] font-normal leading-snug text-white">
            {data.description}
          </p>
        </div>

        <CompactConnectors />
      </div>
    </div>
  );
}

function CompactCards({ data }: { data: HomeHeroData }) {
  return (
    <div className="mx-auto grid w-full max-w-[1100px] grid-cols-1 gap-4 px-5 pb-10 pt-4 md:grid-cols-2 md:gap-6 md:px-8 md:pt-6">
      <article className="relative min-h-[170px] overflow-hidden rounded-2xl">
        <Image src={card1Bg} alt="" fill className="object-cover object-right" />
        <div className="relative z-10 flex h-full min-h-[170px] flex-col justify-center gap-2 px-5 py-5">
          <h3 className="font-poppins text-[18px] font-medium leading-snug text-white md:text-[20px]">
            {data.eyebrow}
          </h3>
          <p className="max-w-[300px] font-poppins text-[14px] font-normal leading-snug text-[#C8C8C8]">
            {data.eyebrowDescription}
          </p>
        </div>
      </article>

      <article className="flex flex-col gap-3 rounded-2xl border border-[#2f2f2f] bg-[#78787833] py-5 backdrop-blur-sm">
        <h3 className="px-5 font-poppins text-[18px] font-medium leading-snug text-white">
          {data.subtitle}
        </h3>

        <ul className="flex flex-col">
          {features.map((f) => (
            <li
              key={f.label}
              className="flex items-center gap-3 border-b border-white/10 px-5 py-3 last:border-b-0"
            >
              <Image src={f.icon} alt="" width={20} height={20} className="shrink-0" />
              <span className="font-poppins text-[14px] font-normal leading-snug text-[#C0C0C0]">
                {f.label}
              </span>
            </li>
          ))}
        </ul>

        <div className="px-5">
          <ExploreButton className="rounded-[16px] px-5 py-3 text-[15px]" />
        </div>
      </article>
    </div>
  );
}

function CompactHero({ data }: { data: HomeHeroData }) {
  return (
    <div className="w-full bg-black">
      <CompactCanvas data={data} />
      <CompactCards data={data} />
    </div>
  );
}

/* =========================================================
   TABLET
   ========================================================= */

function TabletCanvas({ data }: { data: HomeHeroData }) {
  const { containerRef, scale, height } = useCanvasScale(TABLET_WIDTH, TABLET_HEIGHT);
  const { stats } = data;

  return (
    <div ref={containerRef} className="relative mx-auto w-full min-w-0" style={{ height }}>
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{
          width: TABLET_WIDTH,
          height: TABLET_HEIGHT,
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
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        </div>

        <p
          className="absolute left-[60px] top-[190px] z-[2] select-none font-poppins text-[100px] font-medium leading-none text-white/90"
          style={{ letterSpacing: "-4px" }}
        >
          MT <span className="text-white/40">AUTO</span>
        </p>

        <p className="absolute right-[80px] top-[300px] z-[2] select-none font-poppins text-[116px] font-medium leading-none tracking-tight text-white/25">
          ZONE
        </p>

        {/* ✅ Experience — dynamic */}
        <div
          className="absolute left-[560px] top-[100px] z-[5] text-right font-poppins text-white"
          style={{ width: 150 }}
        >
          <p className="relative z-[2] font-poppins text-[44px] font-normal leading-[0.9] tracking-[-1.5px] text-white">
            {stats.yearsOfExperience}
          </p>
          <p className="relative z-[2] mt-[6px] font-poppins text-[13px] font-normal leading-[1.25] text-[#BDBDBD]">
            <StatLabel text={stats.yearsLabel} />
          </p>
        </div>

        {/* ✅ Satisfaction — dynamic */}
        <div
          className="absolute left-[60px] top-[410px] z-[5] font-poppins text-white"
          style={{ width: 150 }}
        >
          <p className="relative z-[2] font-poppins text-[44px] font-normal leading-[0.9] tracking-[-1.5px] text-white">
            {stats.customerSatisfaction}
          </p>
          <p className="relative z-[2] mt-[6px] font-poppins text-[13px] font-normal leading-[1.3] text-white">
            <StatLabel text={stats.satisfactionLabel} />
          </p>
        </div>

        {/* ✅ Cars served — dynamic */}
        <div
          className="absolute left-[400px] top-[410px] z-[5] font-poppins text-white/80"
          style={{ width: 150 }}
        >
          <p className="relative z-[2] font-poppins text-[44px] font-normal leading-[0.9] tracking-[-1.5px] text-white/75">
            {stats.carsServiced}
          </p>
          <p className="relative z-[2] mt-[6px] font-poppins text-[13px] font-normal leading-[1.2] text-[#B0B0B0]">
            <StatLabel text={stats.carsServicedLabel} />
          </p>
        </div>

        {/* ✅ Description — dynamic */}
        <div
          className="absolute z-[5] flex items-center rounded-[10px] px-[24px] py-[8px] backdrop-blur-[4.4px]"
          style={{ top: 510, left: 60, width: 780, height: 50, background: "#62626254" }}
        >
          <p className="font-poppins text-[15px] font-normal leading-snug text-white">
            {data.description}
          </p>
        </div>

        <TabletConnectors />
      </div>
    </div>
  );
}

function TabletHero({ data }: { data: HomeHeroData }) {
  return (
    <div className="w-full bg-black">
      <TabletCanvas data={data} />
      <CompactCards data={data} />
    </div>
  );
}

/* =========================================================
   DESKTOP
   ========================================================= */

function DesktopHero({ data }: { data: HomeHeroData }) {
  const { containerRef, scale, height } = useCanvasScale(DESIGN_WIDTH, DESIGN_HEIGHT);
  const { stats } = data;

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

        {/* Card 1 — dynamic eyebrow + eyebrowDescription */}
        <article
          className="absolute z-[4] overflow-hidden rounded-[16px]"
          style={{ top: 108, left: 162, width: 425, height: 197 }}
        >
          <Image src={card1Bg} alt="" fill className="object-cover object-right" />
          <div className="relative z-10 flex h-full flex-col justify-center gap-3 px-6">
            <h3 className="font-poppins text-[22px] font-medium leading-[150%] text-white">
              {data.eyebrow}
            </h3>
            <p
              className="font-poppins text-[16px] font-normal leading-[150%] text-[#C8C8C8]"
              style={{ width: 306, height: 72 }}
            >
              {data.eyebrowDescription}
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

        {/* ✅ Experience — dynamic */}
        <div
          className="absolute left-[1095px] top-[303px] z-[5] font-poppins text-right text-white"
          style={{ width: 155 }}
        >
          <Connector type="experience" />
          <p className="relative z-[2] font-poppins text-[40px] font-normal leading-[0.9] tracking-[-1.5px] text-white">
            {stats.yearsOfExperience}
          </p>
          <p className="relative z-[2] mt-[7px] font-poppins text-[14px] font-normal leading-[1.25] text-[#BDBDBD]">
            <StatLabel text={stats.yearsLabel} />
          </p>
        </div>

        {/* ✅ Satisfaction — dynamic */}
        <div
          className="absolute left-[345px] top-[582px] z-[5] font-poppins text-white"
          style={{ width: 150 }}
        >
          <p className="relative z-[2] font-poppins text-[40px] font-normal leading-[0.9] tracking-[-1.5px] text-white">
            {stats.customerSatisfaction}
          </p>
          <p className="relative z-[2] mt-[7px] font-poppins text-[14px] font-normal leading-[1.3] text-white">
            <StatLabel text={stats.satisfactionLabel} />
          </p>
          <Connector type="satisfaction" />
        </div>

        {/* ✅ Cars served — dynamic */}
        <div
          className="absolute left-[1031px] top-[830px] z-[5] font-poppins text-white/80"
          style={{ width: 155 }}
        >
          <Connector type="cars" />
          <p className="relative z-[2] font-poppins text-[40px] font-normal leading-[0.9] tracking-[-1.5px] text-white/75">
            {stats.carsServiced}
          </p>
          <p className="relative z-[2] mt-[7px] font-poppins text-[14px] font-normal leading-[1.2] text-[#B0B0B0]">
            <StatLabel text={stats.carsServicedLabel} />
          </p>
        </div>

        {/* Card 2 — dynamic subtitle, static features + button */}
        <article
          className="absolute z-[3] flex flex-col gap-[13px] rounded-[20px] border border-[#2f2f2f] bg-[#78787833] py-5 backdrop-blur-sm"
          style={{ top: 108, left: 1297, width: 523, height: 444 }}
        >
          <h3 className="px-[42px] font-poppins text-[24px] font-medium leading-[150%] text-white">
            {data.subtitle}
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
            <ExploreButton className="rounded-[19px] px-[24px] py-[17px] text-[16px]" />
          </div>
        </article>

        {/* ✅ Description — dynamic */}
        <div
          className="absolute z-[5] flex items-center rounded-[10px] px-[30px] py-[10px] backdrop-blur-[4.4px]"
          style={{ top: 741, left: 162, width: 782, height: 68, background: "#62626254" }}
        >
          <p className="font-poppins text-[15px] font-normal leading-snug text-white">
            {data.description}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------- Root ---------- */
export default function HeroSection() {
  const [data, setData] = useState<HomeHeroData>(FALLBACK);

  useEffect(() => {
    let cancelled = false;

    const fetchHero = async () => {
      try {
        const res = await api.get<
          | HomeHeroData
          | (HomeHeroData & { isActive?: boolean })[]
        >("/home-hero");

        const payload = Array.isArray(res.data) ? res.data[0] : res.data;

        if (!cancelled && payload) {
          setData((prev) => ({
            eyebrow: payload.eyebrow ?? prev.eyebrow,
            eyebrowDescription:
              payload.eyebrowDescription ?? prev.eyebrowDescription,
            subtitle: payload.subtitle ?? prev.subtitle,
            description: payload.description ?? prev.description,
            stats: {
              // Numbers: use nullish coalescing so 0 is preserved
              yearsOfExperience:
                payload.stats?.yearsOfExperience ?? prev.stats.yearsOfExperience,
              customerSatisfaction:
                payload.stats?.customerSatisfaction ??
                prev.stats.customerSatisfaction,
              carsServiced:
                payload.stats?.carsServiced ?? prev.stats.carsServiced,
              // Labels: use `||` so an empty string falls back to the default
              yearsLabel:
                payload.stats?.yearsLabel?.trim() || prev.stats.yearsLabel,
              satisfactionLabel:
                payload.stats?.satisfactionLabel?.trim() ||
                prev.stats.satisfactionLabel,
              carsServicedLabel:
                payload.stats?.carsServicedLabel?.trim() ||
                prev.stats.carsServicedLabel,
            },
          }));
        }
      } catch {
        // Silent failure — fallback copy stays visible
      }
    };

    fetchHero();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="relative w-full min-w-0 overflow-x-hidden overflow-y-hidden bg-black">
      <div className="block md:hidden">
        <CompactHero data={data} />
      </div>
      <div className="hidden md:block xl:hidden">
        <TabletHero data={data} />
      </div>
      <div className="hidden xl:block">
        <DesktopHero data={data} />
      </div>
    </section>
  );
}