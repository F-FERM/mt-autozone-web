import Image from "next/image";
import about1 from "../../../public/images/about1.jpg";

export default function AboutSpotlightSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#050505] text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-full bg-gradient-to-l from-[#E40000]/45 via-[#E40000]/10 to-transparent"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 bottom-[-60px] h-[220px] w-[220px] rounded-full bg-[#E40000]/30 blur-[90px]"
      />

      <div className="relative z-10 mx-auto w-full max-w-[1464px] px-5 pb-16 pt-10 sm:px-8 md:px-12 lg:px-16 xl:px-24">
        <span className="mb-4 block font-poppins text-base font-normal text-[#E40000]">
          About Us
        </span>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="w-full lg:max-w-[700px]">
            <h2 className="mb-6 font-poppins text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-[4rem]">
              About MT Auto Zone
            </h2>

            <p className="max-w-[650px] font-poppins text-base leading-relaxed text-[#b0b0b0] sm:text-lg">
              <span className="font-semibold text-[#E40000]">MT Auto Zone</span>{" "}
              is a professional car care and detailing service provider based in
              Dubai, dedicated to improving the appearance, cleanliness and
              protection of the cars. Over the years of experience, we have been
              providing high quality services to our clients in the field of
              exterior and interior car care. Services provided by us include
              detailing, cleaning, body polishing, paint protection film, window
              tinting, interior cleaning, fabric protection, headlight
              restoration, rustproofing, glass cleaning and washing. We focus on
              professional workmanship, quality products, and attention to
              detail, ensuring every vehicle receives a clean, polished, and
              well-protected finish. At M.T. Autozone, we are committed to
              making every drive feel fresh and every vehicle looks its best.
            </p>

            <button
              type="button"
              className="mt-8 flex items-center justify-center gap-3 rounded-[18px] border border-white/10 bg-[#2c2c2c]/70 px-6 py-3 text-lg font-medium text-white shadow-[0_0_30px_rgba(0,0,0,0.35)] transition hover:bg-[#3a3a3a]"
            >
              View More
              <span aria-hidden="true" className="text-xl">
                ↗
              </span>
            </button>
          </div>

          <div className="relative w-full overflow-hidden rounded-[20px] lg:max-w-[760px] lg:flex-1">
            <div className="relative h-[260px] sm:h-[360px] lg:h-[460px]">
              <Image
                src={about1}
                alt="Technician working on a vehicle at MT Auto Zone"
                fill
                priority
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 760px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
