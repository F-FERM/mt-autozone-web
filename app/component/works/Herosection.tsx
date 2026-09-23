import Image from "next/image";
import about1 from "../../../public/images/road.jpg";

export default function OurWorks() {
  return (
    <div className="bg-black">
      <section
        className="
          relative w-full overflow-hidden
          bg-black isolate
        "
      >
        {/* Red glow bleeding in from the right, fading to black on the left */}
        <div
          aria-hidden
          className="
            pointer-events-none absolute inset-y-0 right-0 z-0
            w-full
            bg-gradient-to-l from-[#E40000]/65 via-[#E40000]/10 to-transparent
          "
        />

        {/* Bottom strip: red glow on the LEFT edge (matching where ProjectsGrid's
            glow will pick up), fading to black elsewhere — this is the "hand-off" */}
        <div
          aria-hidden
          className="
            pointer-events-none absolute inset-x-0 bottom-0 z-[1]
            h-40 sm:h-48 md:h-86
            bg-[radial-gradient(ellipse_50%_100%_at_10%_100%,rgba(228,0,0,0.5)_0%,rgba(228,0,0,0.2)_40%,transparent_75%)]
          "
        />

        <div
          className="
            relative z-10
            flex flex-col
            pt-8 sm:pt-12 md:pt-14 lg:pt-16 xl:pt-24
            pb-14 sm:pb-20 md:pb-28 lg:pb-10
            w-full max-w-[1464px] mx-auto
            px-4 sm:px-6 lg:px-0
          "
        >
          {/* Our Works eyebrow */}
          <span
            className="
              block w-full
              font-poppins font-normal
              text-sm sm:text-base
              leading-none tracking-normal
              text-[#E40000]
              mb-2 sm:mb-3 md:mb-4
            "
          >
            Our Works
          </span>

          {/* Heading */}
          <h2
            className="
              font-poppins font-semibold
              text-2xl sm:text-3xl md:text-[32px] lg:text-[36px]
              leading-tight sm:leading-snug lg:leading-[150%]
              tracking-normal
              text-white
              w-full max-w-[681px] min-h-0 lg:min-h-[108px]
              mb-4 sm:mb-5 md:mb-6 lg:mb-[30px]
            "
          >
            Completed Projects & Vehicle Transformations
          </h2>

          {/* Image + content row */}
          <div
            className="
              flex flex-col
              lg:flex-row lg:items-start
              gap-5 sm:gap-6 lg:gap-[23px]
              w-full
            "
          >
            {/* Image */}
            <div
              className="
                relative w-full
                h-[220px] sm:h-[300px] md:h-[340px] lg:h-[367px]
                lg:flex-1 lg:max-w-[722px]
                flex-shrink-0
                rounded-2xl lg:rounded-[20px] overflow-hidden
              "
            >
              <Image
                src={about1}
                alt="M.T. Autozone technician detailing a vehicle"
                fill
                sizes="(max-width: 1024px) 100vw, 722px"
                className="object-cover"
                priority
              />
              {/* Left-side blend: fades image into the black background */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 z-10 w-1/3
                  bg-gradient-to-r from-black via-black/60 to-transparent"
              />
            </div>

            {/* Paragraph + button column */}
            <div
              className="
                flex flex-col
                w-full lg:flex-1 lg:max-w-[719px]
              "
            >
              <p
                className="
                  font-poppins font-normal
                  text-sm sm:text-base lg:text-[18px]
                  leading-relaxed lg:leading-normal
                  tracking-normal
                  text-[#878787]
                  w-full
                "
              >
                At <span className="text-[#E40000]">M.T. Autozone</span>,
                every completed project reflects our commitment to quality,
                precision, and professional car care. From professional
                cleaning and protection of interior and fabrics, to full
                body polishing, paint protection, window tinting and
                exterior cleaning, we focus on making your car look even
                better. With our professional services you can transform
                your car into a cleaner, fresher and more polished version
                of it. With careful workmanship, quality products, and
                attention to detail,{" "}
                <span className="text-[#E40000]">M.T. Autozone</span>{" "}
                delivers impressive vehicle transformations while
                prioritizing customer satisfaction and consistently
                high-quality results.
              </p>

              {/* View Works button */}
              <button
                className="
                  group
                  mt-6 sm:mt-7 lg:mt-8 flex w-fit items-center gap-2
                  rounded-[19px] border border-[#E400002B] bg-[#FFFFFF24]
                  px-6 py-3
                  font-poppins text-sm font-medium text-white
                  shadow-[-4px_4px_6px_rgba(0,0,0,0.35),4px_4px_6px_rgba(0,0,0,0.35),0_5px_6px_rgba(0,0,0,0.35)]
                  transition-[background,box-shadow]
                  duration-300 ease-out
                  hover:bg-[linear-gradient(135deg,#4A2929_0%,#572C2C_25%,#8B2525_55%,#C91A1A_78%,#E00000_100%)]
                  hover:shadow-[-6px_6px_8px_rgba(0,0,0,0.55),6px_6px_8px_rgba(0,0,0,0.55),0_7px_8px_rgba(0,0,0,0.55)]
                "
              >
                View Works
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
          </div>
        </div>
      </section>
    </div>
  );
}