import Image from "next/image";
import servicesHeroBg from "../../../public/images/serviceshero.jpg";

export default function ServicesHero() {
  return (
    <section
      className="
        relative w-full overflow-hidden
        h-[280px] sm:h-[360px] md:h-[420px] 2xl:h-[476px]
      "
    >
      {/* Background image */}
      <Image
        src={servicesHeroBg}
        alt="M.T. Autozone technician servicing a vehicle"
        fill
        sizes="100vw"
        className="object-cover"
        priority
      />

      {/* Dark overlay — #0000009C */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ backgroundColor: "#0000009C" }}
      />

      {/* Content */}
      <div
        className="
          relative z-10
          flex flex-col items-center
          h-full
          px-5 sm:px-8 md:px-12
          gap-3 sm:gap-4 lg:gap-[19px]
          w-full max-w-[912px] mx-auto
          justify-center
          text-center
        "
      >
        <span
          className="
            font-poppins font-normal
            text-sm sm:text-base
            leading-none tracking-normal
            text-[#E40000]
          "
        >
          Services
        </span>

        <h2
          className="
            font-poppins font-semibold
            text-2xl sm:text-3xl md:text-[32px] lg:text-[36px]
            leading-tight sm:leading-snug lg:leading-[100%]
            tracking-normal
            text-white
            max-w-[575px]
          "
        >
          Our Expert Automotive Services
        </h2>

        <p
          className="
            font-poppins font-normal
            text-sm sm:text-base
            leading-relaxed lg:leading-[150%]
            tracking-normal
            text-[#C0C0C0]
            max-w-[880px]
          "
        >
          At M.T. Autozone, we provide professional automotive care focused
          on maintaining your vehicle&rsquo;s appearance, comfort, and
          overall presentation. Our experienced team combines skilled
          workmanship, quality materials, advanced equipment, and modern
          techniques to deliver reliable results. Every vehicle receives
          careful attention and a personalized approach based on its
          specific needs. With precision and professionalism at every stage,
          we are committed to maintaining high standards and delivering a
          dependable customer experience. At{" "}
          <span className="text-white">M.T. Autozone</span>, quality,
          attention to detail, and customer satisfaction remain at the heart
          of everything we do.
        </p>
      </div>
    </section>
  );
}