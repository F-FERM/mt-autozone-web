"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

// Replace these with your actual asset imports
import heroBg from "../../../public/images/homeservicecar.tsx.jpg";

import washingImg from "../../../public/images/homeservicecar.tsx.jpg";
import detailingImg from "../../../public/images/homeservicecar.tsx.jpg";
import protectionImg from "../../../public/images/homeservicecar.tsx.jpg";
import tintingImg from "../../../public/images/homeservicecar.tsx.jpg";

import washingIcon from "../../../public/images/phone.png";
import detailingIcon from "../../../public/images/phone.png";
import protectionIcon from "../../../public/images/phone.png";
import tintingIcon from "../../../public/images/phone.png";

interface Service { 
  icon: StaticImageData;
  image: StaticImageData;
  title: string;
  description: string;
  href: string;
}

const services: Service[] = [
  {
    icon: washingIcon,
    image: washingImg,
    title: "Car Washing",
    description:
      "M.T. Autozone provides professional car washing services in Dubai for the cleaning of dust, dirt, mud, and other road pollutants. It is essential to have your car cleaned regularly to maintain its shine and freshness. Professional car washing service provided in Dubai by M.T. Autozone will always keep your car looking shiny and fresh.",
    href: "/services/car-washing",
  },
  {
    icon: detailingIcon,
    image: detailingImg,
    title: "Car Detailing",
    description:
      "M.T. Autozone provides professional car detailing services in Dubai so that you can make your car look beautiful. Our detailing process focuses on thorough exterior and interior cleaning, careful finishing, and attention to every detail. From removing surface dirt to refreshing the cabin, we help keep your vehicle looking clean, polished, and well-presented.",
    href: "/services/car-detailing",
  },
  {
    icon: protectionIcon,
    image: protectionImg,
    title: "Car Paint Protection",
    description:
      "Professional car paint protection services are offered by M.T. Autozone in Dubai so that your car paintwork may be protected from dust, stains, UV exposure, and environmental contaminants while maintaining its shine. Paint protection services provided by M.T. Autozone will always keep your car clean and shiny.",
    href: "/services/car-paint-protection",
  },
  {
    icon: tintingIcon,
    image: tintingImg,
    title: "Car Window Tinting",
    description:
      "M.T. Autozone provides car window tinting services in Dubai for adding comfort, privacy, and appearance of your car. Proper window tinting will help reduce excessive sunlight and glare and give your car a modern and stylish look. With our professional installation, you can be sure about a proper finish that will make your car more beautiful.",
    href: "/services/car-window-tinting",
  },
];

export default function ServicesSection() {
  return (
    <section className="relative overflow-hidden bg-black px-4 py-16 sm:px-6 lg:py-24">
      {/* decorative right-side photo, hidden below lg since it clashes with text on narrow screens */}
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[65%] lg:block xl:w-[58%]">
        <Image src={heroBg} alt="" fill className="object-cover" priority={false} />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(272.37deg, rgba(0,0,0,0) 16.24%, #000000 81.58%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1464px]">
        <div className="mx-auto max-w-[700px] text-center">
          <p className="font-poppins text-base font-normal leading-none text-[#E40000]">
            Services
          </p>
          <h2 className="mt-3 font-poppins text-[28px] font-semibold leading-none text-white sm:text-[32px] lg:text-[36px]">
            Reliable Automotive Solutions
          </h2>
          <p className="mt-4 font-poppins text-base font-normal leading-relaxed text-[#878787]">
            At M.T. Autozone, we deliver professional car care with quality,
            precision, and attention to detail. Our commitment is to keep
            your vehicle looking its best while providing a premium
            experience you can trust.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-[10px] sm:grid-cols-2 lg:mt-16">
          {services.map((service) => (
            <article
              key={service.title}
              className="group relative flex min-h-[260px] flex-col justify-end overflow-hidden rounded-[20px]
                         px-6 py-10 transition-colors duration-300
                         sm:min-h-[280px]
                         lg:h-[300px] lg:px-8 lg:pb-[46px] lg:pt-[47px]"
            >
              <Image
                src={service.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 722px, 100vw"
                className="object-cover transition-opacity duration-500 group-hover:opacity-0"
              />

              {/* default dark overlay for legibility over the photo */}
              <div className="pointer-events-none absolute inset-0 bg-black/75 transition-opacity duration-500 group-hover:opacity-0" />

              {/* hover: card flips to a solid white surface */}
              <div className="pointer-events-none absolute inset-0 bg-white opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative z-10 flex flex-col gap-4">
                <Image src={service.icon} alt="" width={54} height={54} className="mb-3" />

                <h3 className="font-poppins text-[22px] font-semibold leading-none text-white transition-colors duration-300 group-hover:text-[#111111]">
                  {service.title}
                </h3>

                <p className="font-poppins text-sm font-normal leading-relaxed text-[#C4C4C4] transition-colors duration-300 group-hover:text-[#6B6B6B]">
                  {service.description}
                </p>

                <Link
                  href={service.href}
                  className="inline-flex w-fit items-center gap-2 font-poppins text-2xl font-normal leading-none text-[#E40000]"
                >
                  Explore
                  <span className="-translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                    →
                  </span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}