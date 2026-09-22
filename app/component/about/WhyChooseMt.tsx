import Image from "next/image";

const REASONS = [
  {
    key: "expert-technicians",
    title: "Expert Technicians:",
    description:
      "Our skilled technicians bring professional expertise and careful attention to detail, ensuring every vehicle receives high-quality care and a superior finish.",
  },
  {
    key: "advanced-technology",
    title: "Advanced Technology:",
    description:
      "With our use of advanced technology and techniques, we ensure efficiency and consistency of results with an improvement of the vehicle's overall appearance.",
  },
  {
    key: "comprehensive-services",
    title: "Comprehensive Services:",
    description:
      "We take care of everything you need like the exterior and interior of your car is handled in order to make sure that your car stays clean, shiny and protected.",
  },
  {
    key: "customer-satisfaction",
    title: "Customer Satisfaction:",
    description:
      "We prioritize customer satisfaction through quality workmanship, transparent communication, reliable service, and a commitment to delivering results that meet your expectations.",
  },
];

function CheckIcon() {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
    >
      <path
        d="M21 6.5L9.5 18L4 12.5"
        stroke="#E40000"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function WhyChooseUs() {
  return (
    <section className="relative w-full">
      <div
        className="
          relative z-10    bg-black
          flex flex-col lg:flex-row lg:items-start lg:justify-between
          px-5 sm:px-8 md:px-12 lg:px-16 xl:px-24 2xl:px-[228px]
          py-10 sm:py-14 md:py-16 lg:py-20
          gap-8 lg:gap-5
          w-full  mx-auto
        "
      >
         {/* Red glow bleeding in from the left, fading to black on the right */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute inset-y-0 left-0 z-0
          w-full
          
        "
      />
        {/* Left column */}
        <div
          className="
            flex flex-col
            w-full 
          "
        >
          <span
            className="
              block
              font-poppins font-normal
              text-sm sm:text-base
              leading-none tracking-normal
              text-[#E40000]
              mb-2 sm:mb-3 md:mb-4
            "
          >
            Why
          </span>

          <h2
            className="
              font-poppins font-semibold
              text-2xl sm:text-3xl md:text-[32px] lg:text-[36px]
              leading-tight sm:leading-snug lg:leading-[100%]
              tracking-normal
              text-white
              mb-4 sm:mb-5 md:mb-6
            "
          >
            Why Choose MT Auto Zone?
          </h2>

          <p
            className="
              font-poppins font-normal
              text-sm sm:text-base
              leading-relaxed lg:leading-[150%]
              tracking-normal
              text-[#878787]
            "
          >
            <span className="text-[#E40000]">M.T. Autozone</span> provides
            its clients with professional and reliable car care services in
            Dubai, focusing especially on the quality, precision, and
            satisfaction of clients. Our company uses quality products and
            professional approaches in order to produce great results and
            improve the appearance, cleaning, and protection of your
            vehicle. With careful attention to detail and a customer-focused
            approach, <span className="text-[#E40000]">M.T. Autozone</span>{" "}
            ensures every vehicle receives professional care and a clean,
            polished, and refreshed finish.
          </p>
        </div>

        {/* Right column */}
        <div
          className="
            flex flex-col
            gap-[17px]
            w-full lg:max-w-[722px]
          "
        >
          {REASONS.map((reason) => (
            <div
              key={reason.key}
              className="flex items-start justify-between gap-4 sm:gap-6"
            >
              <div className="flex flex-col gap-1">
                <h3
                  className="
                    font-poppins font-semibold
                    text-base sm:text-lg
                    leading-none tracking-normal
                    text-white mb-2
                  "
                >
                  {reason.title}
                </h3>
                <p
                  className="
                    font-poppins font-normal
                    text-sm sm:text-base
                    leading-relaxed
                    tracking-normal
                    text-[#A1A1A1]
                  "
                >
                  {reason.description}
                </p>
              </div>

              <div className="pt-1">
                <CheckIcon />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}