"use client";

import Image from "next/image";

/**
 * AboutSection
 * ------------------------------------------------------------------
 * Replicates the "About MT Auto Zone" block with a headlight on/off
 * hover animation on the car image.
 *
 * light.png must be the SAME dimensions/aspect ratio as defender.png,
 * with only the headlight glow drawn in its correct position and
 * everything else transparent — stacking it directly on top with
 * identical fill/object-fit props lines it up automatically.
 *
 * The ambient "bleed" glow below is a separate, larger soft blob
 * anchored near the headlight's real position (roughly where the two
 * grid columns meet on desktop) so it reads as light spilling from
 * the headlight into the text column, not a random glow.
 */
export default function AboutMTZone() {
  return (
    <section className="group relative overflow-hidden bg-black">
      {/* Ambient glow — anchored near the headlight, bleeding left into text */}
      <div
        className="pointer-events-none absolute left-[30%] top-[60%] h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 blur-[130px] transition-opacity duration-[1200ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:opacity-[0.09] sm:h-[650px] sm:w-[650px] lg:left-[38%] lg:top-[52%] lg:h-[850px] lg:w-[850px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-[1600px] grid-cols-1 items-center gap-10 px-6 py-16 md:px-10 lg:grid-cols-2 lg:gap-6 lg:py-24">
        {/* Left column — copy */}
        <div className="relative z-10">
          <p className="mb-3 text-sm font-medium text-red-600">About Us</p>

          <h2 className="mb-5 text-3xl font-bold leading-tight text-white sm:text-4xl">
            About MT Auto Zone
          </h2>

          <p className="max-w-xl text-[15px] leading-relaxed text-neutral-300 sm:text-base">
            <span className="text-red-600">MT Auto Zone</span> is a professional
            car care and detailing service provider based in Dubai, dedicated to
            improving the appearance, cleanliness and protection of the cars.
            Over the years of experience, we have been providing high quality
            services to our clients in the field of exterior and interior car
            care. Services provided by us include detailing, cleaning, body
            polishing, paint protection film, window tinting, interior cleaning,
            fabric protection, headlight restoration, rustproofing, glass
            cleaning and washing. We focus on professional workmanship, quality
            products, and attention to detail, ensuring every vehicle receives a
            clean, polished, and well-protected finish. At M.T. Autozone, we are
            committed to making every drive feel fresh and every vehicle looks
            its best.
          </p>

          <button
            type="button"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-neutral-800/90 px-6 py-3.5 text-sm font-medium text-white transition-colors duration-300 hover:bg-red-600"
          >
            View More
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 12L12 2M12 2H4M12 2V10"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Right column — car image with headlight glow overlay */}
        <div className="relative h-[260px] w-full sm:h-[340px] lg:h-[460px]">
          {/* Base car image — headlights off */}
          <Image
            src="/images/defender.png"
            alt="MT Auto Zone car"
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-contain object-right"
          />

          {/* Headlight lamp glow — same canvas as defender.png, lines up
              automatically. Tight to the lamp housing itself. */}
          <Image
            src="/images/light.png"
            alt=""
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="pointer-events-none object-contain object-right opacity-0 transition-opacity duration-[1200ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:opacity-100"
          />

          {/* Progress bar / pagination track */}
          <div className="absolute bottom-0 left-0 right-14 h-[2px] rounded-full bg-neutral-700">
            <div className="h-full w-[70%] rounded-full bg-neutral-500 transition-colors duration-[1200ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:bg-red-600" />
          </div>

          {/* Prev/next control */}
          <button
            type="button"
            aria-label="Previous"
            className="absolute -bottom-3 right-0 flex h-8 w-14 items-center justify-center rounded-full bg-neutral-800 text-white transition-colors duration-[1200ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:bg-red-600"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 17L6 12L11 7M18 17L13 12L18 7"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
