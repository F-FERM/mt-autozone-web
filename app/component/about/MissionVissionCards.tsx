import Image from "next/image";
import missionBg from "../../../public/images/missionvision.jpg";
import visionBg from "../../../public/images/missionvision.jpg";

const CARDS = [
  {
    key: "mission",
    title: "Our Mission",
    description:
      "At M.T. Autozone, our mission is to deliver professional, high-quality car care that exceeds customer expectations. We combine skilled expertise, quality materials, modern techniques, and meticulous attention to detail to ensure every vehicle receives the care it deserves. We continuously strive to improve our standards and provide a reliable experience for every customer. ",
    image: missionBg,
    alt: "M.T. Autozone technician working on a vehicle",
  },
  {
    key: "vision",
    title: "Our Vision",
    description:
      "Our vision at M.T. Autozone is to become a leading name in professional car care in Dubai, recognized for quality, precision, innovation, and customer satisfaction. By continuously improving our practices and embracing innovation, we strive to deliver exceptional results and build lasting trust with every customer. Our goal is to create a reputation for excellence, reliability, and professional care, ensuring every vehicle receives the highest standard of attention. ",
    image: visionBg,
    alt: "Close-up of automotive detailing tools in use",
  },
];

export default function MissionVisionCards() {
  return (
    <section
      className="
        relative w-full overflow-hidden
        bg-black isolate
        px-5 sm:px-8 md:px-12 lg:px-16 xl:px-24 2xl:px-[228px]
        py-10 sm:py-14 md:py-16
      "
    >
      {/* Red glow bleeding in from the left, fading to black on the right —
          same treatment as the Hero's right-side glow, mirrored, so it
          reads as one continuous light source running down the page's
          left edge across Hero → Mission → Why Choose Us. */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute inset-y-0 left-0 z-0
          w-full
          bg-gradient-to-r from-[#E40000]/45 via-[#E40000]/10 to-transparent 
        "
      />
      {/* Vertical fade to black at the top, so the glow blends into the gap above */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute inset-x-0 top-0 z-[1]
          h-24 sm:h-32 md:h-40
          bg-gradient-to-b from-black to-transparent
        "
      />


      <div
        className="
          relative z-10
          flex flex-col md:flex-row md:items-stretch
          gap-5 md:gap-4 lg:gap-5 xl:gap-[20px]
          w-full max-w-[1464px] mx-auto
        "
      >
        {CARDS.map((card) => (
          <div
            key={card.key}
            className="
              group relative isolate overflow-hidden
              w-full md:flex-1 xl:max-w-[722px]
              min-h-[216px]
              rounded-2xl lg:rounded-[20px]
              px-6 py-9 sm:px-8 sm:py-10 lg:px-9 lg:py-[45px]
              flex flex-col justify-start gap-2.5
            "
          >
            {/* Background image (bottom-most layer, z-0) */}
            <Image
              src={card.image}
              alt={card.alt}
              fill
              sizes="(max-width: 768px) 100vw, 722px"
              className="
                z-0 object-cover
                transition-opacity duration-500
                group-hover:opacity-0
              "
            />
            {/* Dark overlay for default state, on top of the image */}
            <div
              className="
                absolute inset-0 z-10
                bg-black/85
                transition-opacity duration-500
                group-hover:opacity-0
              "
            />
            {/* White overlay revealed on hover, on top of everything below the text */}
            <div
              className="
                absolute inset-0 z-20
                bg-white opacity-0
                transition-opacity duration-500
                group-hover:opacity-100
              "
            />

            {/* Title (text sits above all background layers) */}
            <h3
              className="
                relative z-30
                font-poppins font-medium
                text-xl sm:text-2xl lg:text-[24px]
                leading-none tracking-normal
                text-white
                transition-colors duration-500
                group-hover:text-[#E40000]
                max-w-full lg:max-w-[650px] mb-2
              "
            >
              {card.title}
            </h3>

            {/* Description */}
            <p
              className="
                relative z-30
                font-poppins font-normal
                text-sm lg:text-[14px]
                leading-loose lg:leading-[1.9]
                tracking-normal
                text-[#A9A9A9]
                transition-colors duration-500
                group-hover:text-[#4B4B4B]
                max-w-full lg:max-w-[650px]
              "
            >
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}