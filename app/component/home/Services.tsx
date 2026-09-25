"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import api from "@/lib/axios";

interface ServiceCardApi {
  _id: string;
  title: string;
  description: string;
  icon: string;
  image: string;
  buttonText: string;
  buttonLink: string;
  order: number;
  isActive: boolean;
}

interface HomeServicesApiResponse {
  _id: string;
  sectionLabel: string;
  title: string;
  backgroundImage: string;
  serviceCards: ServiceCardApi[];
  isActive: boolean;
}

interface ServiceCard {
  _id: string;
  title: string;
  description: string;
  icon: string;
  image: string;
  buttonText: string;
  buttonLink: string;
  order: number;
}

interface ServicesData {
  sectionLabel: string;
  title: string;
  backgroundImage: string;
  serviceCards: ServiceCard[];
}

const defaultData: ServicesData = {
  sectionLabel: "Services",
  title: "Reliable Automotive Solutions",
  backgroundImage: "/images/services/services-bg.jpg",
  serviceCards: [
    {
      _id: "1",
      title: "Car Washing",
      description:
        "M.T. Autozone provides professional car washing services in Dubai for the cleaning of dust, dirt, mud, and other road pollutants.",
      icon: "/images/services/icons/car-washing.png",
      image: "/images/services/car-washing.jpg",
      buttonText: "Explore",
      buttonLink: "/services/car-washing",
      order: 0,
    },
    {
      _id: "2",
      title: "Car Detailing",
      description:
        "M.T. Autozone provides professional car detailing services in Dubai so that you can make your car look beautiful.",
      icon: "/images/services/icons/car-detailing.png",
      image: "/images/services/car-detailing.jpg",
      buttonText: "Explore",
      buttonLink: "/services/car-detailing",
      order: 1,
    },
    {
      _id: "3",
      title: "Car Paint Protection",
      description:
        "Professional car paint protection services are offered by M.T. Autozone in Dubai so that your car paintwork may be protected.",
      icon: "/images/services/icons/paint-protection.png",
      image: "/images/services/car-paint-protection.jpg",
      buttonText: "Explore",
      buttonLink: "/services/car-paint-protection",
      order: 2,
    },
    {
      _id: "4",
      title: "Car Window Tinting",
      description:
        "M.T. Autozone provides car window tinting services in Dubai for adding comfort, privacy, and appearance of your car.",
      icon: "/images/services/icons/window-tinting.png",
      image: "/images/services/car-window-tinting.jpg",
      buttonText: "Explore",
      buttonLink: "/services/car-window-tinting",
      order: 3,
    },
  ],
};

function ServicesSkeleton() {
  return (
    <section className="relative overflow-hidden bg-black px-4 py-16 sm:px-6 lg:py-24">
      <div className="relative z-10 mx-auto max-w-[1464px]">
        <div className="mx-auto max-w-[700px] text-center">
          <div className="mx-auto h-4 w-24 animate-pulse rounded-md bg-white/10" />
          <div className="mx-auto mt-3 h-8 w-3/4 animate-pulse rounded-md bg-white/10 sm:h-10" />
          <div className="mx-auto mt-4 h-4 w-full animate-pulse rounded-md bg-white/10" />
          <div className="mx-auto mt-2 h-4 w-2/3 animate-pulse rounded-md bg-white/10" />
        </div>

        <div className="mt-10 grid grid-cols-1 gap-[10px] sm:grid-cols-2 sm:mt-14 lg:mt-16">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="relative flex min-h-[280px] flex-col justify-end overflow-hidden rounded-[20px] bg-white/5 px-5 py-8 sm:min-h-[300px] sm:px-6 sm:py-9 lg:min-h-[300px] lg:px-8 lg:py-10"
            >
              <div className="mb-3 h-10 w-10 animate-pulse rounded-md bg-white/10" />
              <div className="h-6 w-1/2 animate-pulse rounded-md bg-white/10" />
              <div className="mt-3 h-4 w-full animate-pulse rounded-md bg-white/10" />
              <div className="mt-2 h-4 w-4/5 animate-pulse rounded-md bg-white/10" />
              <div className="mt-4 h-6 w-24 animate-pulse rounded-md bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ServicesSection() {
  const [data, setData] = useState<ServicesData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHomeServices = async () => {
      try {
        const res = await api.get<HomeServicesApiResponse | HomeServicesApiResponse[]>(
          "/home-services"
        );

        // Handle both single object and array responses
        let apiData: HomeServicesApiResponse | null = null;
        if (Array.isArray(res.data)) {
          apiData = res.data.length > 0 ? res.data[0] : null;
        } else if (res.data && typeof res.data === "object") {
          apiData = res.data;
        }

        if (!apiData) {
          setData(defaultData);
          return;
        }

        // Filter active cards and sort by order
        const activeCards = (apiData.serviceCards || [])
          .filter((card) => card.isActive)
          .sort((a, b) => a.order - b.order)
          .map((card) => ({
            _id: card._id,
            title: card.title,
            description: card.description,
            icon: card.icon,
            image: card.image,
            buttonText: card.buttonText || "Explore",
            buttonLink: card.buttonLink || "#",
            order: card.order,
          }));

        setData({
          sectionLabel: apiData.sectionLabel || defaultData.sectionLabel,
          title: apiData.title || defaultData.title,
          backgroundImage: apiData.backgroundImage || defaultData.backgroundImage,
          serviceCards: activeCards.length > 0 ? activeCards : defaultData.serviceCards,
        });
      } catch (err) {
        console.error("Failed to fetch home services:", err);
        setData(defaultData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeServices();
  }, []);

  if (isLoading) return <ServicesSkeleton />;

  return (
    <section className="relative overflow-hidden bg-black px-4 py-16 sm:px-6 lg:py-24">
      {/* decorative right-side photo, hidden below lg since it clashes with text on narrow screens */}
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[65%] lg:block xl:w-[58%]">
        <Image
          src={data.backgroundImage}
          alt=""
          fill
          unoptimized
          className="object-cover"
          priority={false}
          sizes="(min-width: 1280px) 58vw, 65vw"
        />
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
          <p className="font-poppins text-sm font-normal leading-none text-[#E40000] sm:text-base">
            {data.sectionLabel}
          </p>
          <h2 className="mt-3 font-poppins text-2xl font-semibold leading-tight text-white sm:text-[32px] lg:text-[36px]">
            {data.title}
          </h2>
          <p className="mt-4 font-poppins text-sm font-normal leading-relaxed text-[#878787] sm:text-base">
            At M.T. Autozone, we deliver professional car care with quality,
            precision, and attention to detail. Our commitment is to keep
            your vehicle looking its best while providing a premium
            experience you can trust.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-[10px] sm:grid-cols-2 sm:mt-14 lg:mt-16">
          {data.serviceCards.map((service, index) => (
            <motion.article
              key={service._id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="group relative flex min-h-[280px] flex-col justify-end overflow-hidden rounded-[20px]
                         px-5 py-8 transition-colors duration-300
                         sm:min-h-[300px] sm:px-6 sm:py-9
                         lg:min-h-[300px] lg:px-8 lg:py-10"
            >
              {/* Background image */}
              {service.image ? (
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  unoptimized
                  sizes="(min-width: 1024px) 722px, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-opacity duration-500 group-hover:opacity-0"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]" />
              )}

              {/* default dark overlay for legibility over the photo */}
              <div className="pointer-events-none absolute inset-0 bg-black/75 transition-opacity duration-500 group-hover:opacity-0" />

              {/* hover: card flips to a solid white surface */}
              <div className="pointer-events-none absolute inset-0 bg-white opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative z-10 flex flex-col gap-3 sm:gap-4">
                {/* Icon */}
                {service.icon ? (
                  <div className="relative mb-1 h-8 w-8 sm:mb-3 sm:h-10 sm:w-10">
                    <Image
                      src={service.icon}
                      alt=""
                      fill
                      unoptimized
                      sizes="40px"
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="mb-1 h-8 w-8 sm:mb-3 sm:h-10 sm:w-10" />
                )}

                <h3 className="font-poppins text-lg font-semibold leading-snug text-white transition-colors duration-300 group-hover:text-[#111111] sm:text-xl lg:text-[22px]">
                  {service.title}
                </h3>

                <p className="font-poppins text-[13px] font-normal leading-relaxed text-[#C4C4C4] transition-colors duration-300 group-hover:text-[#6B6B6B] sm:text-sm">
                  {service.description}
                </p>

                <Link
                  href={service.buttonLink}
                  className="inline-flex w-fit items-center gap-2 font-poppins text-lg font-normal leading-none text-[#E40000] transition-all duration-300 hover:gap-3 sm:text-xl lg:text-2xl"
                >
                  {service.buttonText}
                  <span className="-translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                    →
                  </span>
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}