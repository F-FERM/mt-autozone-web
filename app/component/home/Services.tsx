"use client";

import Image from "next/image";
import {
  ArrowRight,
  CarFront,
  ShieldCheck,
  Shield,
  Droplet,
} from "lucide-react";
import type { ReactNode } from "react";

type ServiceCard = {
  icon: ReactNode;
  title: string;
  description: string;
  image?: string; // background image for the "dark" cards
};

const services: ServiceCard[] = [
  {
    icon: <CarFront size={28} />,
    title: "Car Washing",
    description:
      "M.T. Autozone provides professional car washing services in Dubai for the cleaning of dust, dirt, mud, and other road pollutants. It is essential to have your car cleaned regularly to maintain its shine and freshness. Professional car washing service provided in Dubai by M.T. Autozone will always keep your car looking shiny and fresh.",
    // no image — this card is always in the "light" state
  },
  {
    icon: <ShieldCheck size={28} />,
    title: "Car Detailing",
    description:
      "M.T. Autozone provides professional car detailing services in Dubai so that you can make your car look beautiful. Our detailing process focuses on thorough exterior and interior cleaning, careful finishing, and attention to every detail. From removing surface dirt to refreshing the cabin, we help keep your vehicle looking clean, polished, and well-presented.",
    image: "/images/car-detailing.jpg",
  },
  {
    icon: <Shield size={28} />,
    title: "Car Paint Protection",
    description:
      "Professional car paint protection services are offered by M.T. Autozone in Dubai so that your car paintwork may be protected from dust, stains, UV exposure, and environmental contaminants while maintaining its shine. Paint protection services provided by M.T. Autozone will always keep your car looking clean and shiny.",
    image: "/images/paint-protection.jpg",
  },
  {
    icon: <Droplet size={28} />,
    title: "Car Window Tinting",
    description:
      "M.T. Autozone provides car window tinting services in Dubai for adding comfort, privacy, and appearance of your car. Proper window tinting will help reduce excessive sunlight and glare and give your car a modern and stylish look. With our professional installation, you can be sure about a precise finish that will make your car more beautiful.",
    image: "/images/window-tinting.jpg",
  },
];

function Card({
  service,
  alwaysLight,
}: {
  service: ServiceCard;
  alwaysLight?: boolean;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-3xl ${
        alwaysLight ? "bg-white" : "bg-black"
      }`}
    >
      {/* Background image + dark overlay — fades out on hover to reveal white card */}
      {!alwaysLight && service.image && (
        <>
          <Image
            src={service.image}
            alt={service.title}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover transition-opacity duration-500 ease-out group-hover:opacity-0"
          />
          <div className="absolute inset-0 bg-black/55 transition-opacity duration-500 ease-out group-hover:opacity-0" />
        </>
      )}

      {/* White base layer that shows through once the image/overlay fade out */}
      {!alwaysLight && <div className="absolute inset-0 -z-10 bg-white" />}

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col gap-4 p-8">
        <span
          className={`text-red-600 ${
            alwaysLight ? "" : "transition-colors duration-500"
          }`}
        >
          {service.icon}
        </span>

        <h3
          className={`text-2xl font-semibold transition-colors duration-500 ${
            alwaysLight ? "text-black" : "text-white group-hover:text-black"
          }`}
        >
          {service.title}
        </h3>

        <p
          className={`text-sm leading-relaxed transition-colors duration-500 ${
            alwaysLight
              ? "text-neutral-600"
              : "text-white/80 group-hover:text-neutral-600"
          }`}
        >
          {service.description}
        </p>

        <a
          href="#"
          className="mt-2 inline-flex w-fit items-center gap-2 font-medium text-red-600 transition-transform duration-300 hover:gap-3"
        >
          Explore
          <ArrowRight size={18} />
        </a>
      </div>
    </div>
  );
}

export default function ServicesSection() {
  return (
    <section className="relative overflow-hidden bg-black">
      {/* Hero image, right side */}
      <div className="absolute inset-y-0 right-0 w-full lg:w-2/3">
        <Image
          src="/images/engine-hero.jpg"
          alt=""
          fill
          className="object-cover object-left opacity-90"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 pt-20 pb-16 text-center">
        <p className="text-sm font-medium text-red-600">Services</p>
        <h1 className="mt-3 text-4xl font-bold text-white sm:text-5xl">
          Reliable Automotive Solutions
        </h1>
        <p className="mx-auto mt-5 max-w-3xl text-neutral-400">
          At <span className="text-red-600">M.T. Autozone</span>, we deliver
          professional car care with quality, precision, and attention to
          detail. Our commitment is to keep your vehicle looking its best while
          providing a premium experience you can trust.
        </p>
      </div>

      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 pb-24 md:grid-cols-2">
        {services.map((service, i) => (
          <Card key={service.title} service={service} alwaysLight={i === 0} />
        ))}
      </div>
    </section>
  );
}
