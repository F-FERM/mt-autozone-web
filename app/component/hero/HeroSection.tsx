'use client';

import Image from 'next/image';
import { CheckCircle2, Droplet, Cloud, ShieldCheck, ArrowUpRight } from 'lucide-react';
import carBg from "../../../public/images/bgcar.png"
import carHero from "../../../public/images/gt.jpg"
/**
 * HeroSection
 * ---------------------------------------------------------------------------
 * Changes from the previous pass, per your screenshot feedback:
 * 1. Header/navbar REMOVED from this component entirely (you're handling
 *    that as its own piece elsewhere).
 * 2. "MT AUTO" / "ZONE" typography now sits BEHIND the car (z-index 0,
 *    car is z-20) and is pushed down/reflowed so it clears card 1 instead
 *    of overlapping it.
 * 3. Added the three curved connector lines from the reference shot: one
 *    from "22 Year Of Experience" down to a point near the roof, one from
 *    "4.8 Customer Satisfaction" to the headlight, one from "22301 Cars
 *    Served" up to the front tyre. Drawn as a single SVG overlay so the
 *    curves + end-dots sit on top of the car like in your reference image.
 * ---------------------------------------------------------------------------
 * ASSUMPTIONS still in play (flagged, since exact coordinates were only
 * given for the two cards):
 * - Canvas reference is 1920x1080; boxToStyle() converts the spec'd card
 *   pixels into % so everything stays proportional. Update CANVAS_W/H if
 *   your real Figma frame differs.
 * - Connector-line endpoints (roof / headlight / tyre) and the car's own
 *   position are eyeballed off your reference screenshots, not exact
 *   coordinates — nudge the `x`/`y` values in `connectors` below against
 *   your actual car asset once it's in place, since every car render
 *   crops differently.
 * - Image paths (/images/...) are placeholders — point them at your real
 *   assets in /public/images.
 * ---------------------------------------------------------------------------
 */

const CANVAS_W = 1920;
const CANVAS_H = 1080;

const boxToStyle = (top: number, left: number, width: number, height: number) => ({
  top: `${(top / CANVAS_H) * 100}%`,
  left: `${(left / CANVAS_W) * 100}%`,
  width: `${(width / CANVAS_W) * 100}%`,
  height: `${(height / CANVAS_H) * 100}%`,
});

const services = [
  { icon: CheckCircle2, label: 'Complete Car Detailing & Cleaning' },
  { icon: Droplet, label: 'Advanced Paint Protection & Polishing' },
  { icon: Cloud, label: 'Premium Interior & Exterior Care' },
  { icon: ShieldCheck, label: 'Professional Vehicle Appearance Solutions' },
];

// Connector lines: label anchor (where the text sits) -> car point (dot on the car)
// All coordinates are in the 1920x1080 canvas space, same as boxToStyle().
const connectors = [
  {
    id: 'experience',
    value: '22',
    label: 'Year Of Experience',
    labelX: 1660,
    labelY: 90,
    align: 'left' as const,
    carX: 1180,
    carY: 300,
    // control point for the curve
    ctrlX: 1420,
    ctrlY: 140,
  },
  {
    id: 'satisfaction',
    value: '4.8',
    label: 'Customer Satisfaction',
    labelX: 60,
    labelY: 420,
    align: 'left' as const,
    carX: 740,
    carY: 560,
    ctrlX: 300,
    ctrlY: 480,
  },
  {
    id: 'served',
    value: '22301',
    label: 'Cars Served',
    labelX: 620,
    labelY: 866,
    align: 'left' as const,
    carX: 840,
    carY: 790,
    ctrlX: 700,
    ctrlY: 850,
  },
];

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-black text-white aspect-[1920/1080]">
      {/* Background image */}
      <Image
        src={carBg}
        alt=""
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/60" />

      {/* Headline typography — BEHIND the car (z-0) */}
      <h1
        aria-hidden
        className="pointer-events-none absolute left-[3%] top-[36%] z-0 select-none font-[Poppins] text-[8vw] font-semibold leading-none tracking-tight text-white/90"
      >
        MT AUTO
      </h1>
      <h1
        aria-hidden
        className="pointer-events-none absolute bottom-[8%] right-[4%] z-0 select-none font-[Poppins] text-[8vw] font-semibold leading-none tracking-tight text-white/15"
      >
        ZONE
      </h1>

      {/* Car image — in FRONT of the headline text */}


      {/* Curved connector lines, drawn over the car */}
      <svg
        aria-hidden
        viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
        className="pointer-events-none absolute inset-0 z-30 h-full w-full"
        preserveAspectRatio="none"
      >
        {connectors.map((c) => (
          <g key={c.id}>
            <path
              d={`M ${c.labelX} ${c.labelY} Q ${c.ctrlX} ${c.ctrlY} ${c.carX} ${c.carY}`}
              fill="none"
              stroke="rgba(255,255,255,0.45)"
              strokeWidth={1.5}
              vectorEffect="non-scaling-stroke"
            />
            <circle cx={c.carX} cy={c.carY} r={4} fill="white" fillOpacity={0.9} />
            <circle cx={c.carX} cy={c.carY} r={8} fill="none" stroke="white" strokeOpacity={0.35} />
          </g>
        ))}
      </svg>

      {/* Stat labels */}
      {connectors.map((c) => (
        <div
          key={c.id}
          className="absolute z-30 text-sm text-white/70"
          style={{
            left: `${(c.labelX / CANVAS_W) * 100}%`,
            top: `${(c.labelY / CANVAS_H) * 100}%`,
          }}
        >
          <p className="font-[Poppins] text-2xl font-semibold text-white">{c.value}</p>
          <p className="whitespace-nowrap">{c.label}</p>
        </div>
      ))}

      {/* Supporting paragraph */}
      <p className="absolute bottom-[6%] left-[4%] z-30 max-w-[26%] font-[Poppins] text-base leading-relaxed text-white/70">
        Elevating every vehicle with professional detailing, body polishing, paint protection,
        window tinting, and complete interior &amp; exterior care.
      </p>

      {/* Card 1 — Premium Care. Impeccable Finish. */}
      <div
        className="absolute z-40 overflow-hidden rounded-2xl"
        style={boxToStyle(205, 162, 425, 197)}
      >
        <Image
          src={carHero}
          alt=""
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 425px, 60vw"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative flex h-full flex-col justify-center gap-3 px-6">
          <h2 className="font-[Poppins] text-[22px] font-medium leading-none tracking-normal text-white">
            Premium Care. Impeccable Finish.
          </h2>
          <p className="font-[Poppins] text-base font-normal leading-none tracking-normal text-[#C8C8C8]">
            Professional car detailing to restore, protect, and enhance your vehicle&apos;s
            appearance.
          </p>
        </div>
      </div>

      {/* Card 2 — Premium Automotive Detailing Solutions */}
      <div
        className="absolute z-40 flex flex-col gap-[13px] rounded-[20px] border border-white/10 bg-white/[0.04] py-5 backdrop-blur-md"
        style={boxToStyle(202, 1297, 523, 444)}
      >
        <h2 className="px-8 font-[Poppins] text-2xl font-medium leading-none tracking-normal text-white">
          Premium Automotive Detailing Solutions
        </h2>

        <ul className="flex flex-1 flex-col justify-center gap-1">
          {services.map(({ icon: Icon, label }, i) => (
            <li key={label}>
              {i !== 0 && <div className="mx-8 border-t border-white/10" />}
              <div className="flex items-center gap-3 px-8 py-4">
                <Icon className="h-5 w-5 shrink-0 text-red-500" strokeWidth={1.75} />
                <span className="font-[Poppins] text-lg font-normal leading-none tracking-normal text-[#C0C0C0]">
                  {label}
                </span>
              </div>
            </li>
          ))}
        </ul>

        <div className="px-8">
          <a
            href="#explore"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-white/10 py-3 text-sm font-medium text-white transition-colors hover:bg-white/20"
          >
            Explore
            <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
          </a>
        </div>
      </div>
    </section>
  );
}