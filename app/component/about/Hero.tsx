import Image from "next/image";
import about1 from "../../../public/images/about1.jpg";
import MissionVisionCards from "./MissionVissionCards";


export default function AboutUs() {
  return (
    <div>

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
          pointer-events-none absolute inset-y-0 right-0
          w-full
          bg-gradient-to-l from-[#E40000]/65 via-[#E40000]/10 to-transparent
        "
      />
      {/* Secondary red bloom, bottom-left corner */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute
          -left-24 -bottom-24
          h-[220px] w-[220px]
          sm:h-[300px] sm:w-[300px]
          md:h-[380px] md:w-[380px]
          lg:h-[480px] lg:w-[480px]
          rounded-full
          bg-[#E40000]/35
          blur-[80px] sm:blur-[100px] lg:blur-[110px]
        "
      />

      <div
        className="
          relative z-10
          flex flex-col
          px-5 sm:px-8 md:px-12 lg:px-16 xl:px-24 
          pt-8 sm:pt-12 md:pt-14 lg:pt-16 xl:pt-24 
          pb-12 sm:pb-16 md:pb-20 lg:pb-24
          w-full max-w-[1464px] mx-auto
        "
      >
        {/* About Us eyebrow */}
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
          About Us
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
          Your Trusted Partner in Automotive Detailing Excellence
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
          </div>

          {/* Paragraph */}
          <p
            className="
              font-poppins font-normal
              text-sm sm:text-base lg:text-[18px]
              leading-relaxed lg:leading-normal
              tracking-normal
              text-[#878787]
              w-full lg:flex-1 lg:max-w-[719px]
            "
          >
            Our vision at{" "}
            <span className="text-[#E40000]">M.T. Autozone</span> is to
            deliver exceptional car care through professional expertise,
            quality materials, modern techniques, and genuine customer
            service. We believe every vehicle deserves careful attention and
            a commitment to excellence. With a strong focus on quality,
            precision, and customer satisfaction, we work to maintain your
            vehicle&rsquo;s appearance, comfort, and protection. Our
            experienced team approaches every vehicle with dedication and
            attention to detail, ensuring a reliable experience and a finish
            you can be proud of. At{" "}
            <span className="text-[#E40000]">M.T. Autozone</span>, we are
            committed to building lasting relationships with our customers
            through consistent quality, professional care, and dependable
            results.
          </p>
        </div>
      </div>
    </section>
     
    </div>
  );
}