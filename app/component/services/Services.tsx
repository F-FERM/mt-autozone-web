"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/axios";

// Fallback image
import serviceFallback from "../../../public/images/serviceshero.jpg";

// ================= TYPES =================

interface FeatureApi {
  _id?: string;
  title: string;
  icon: string; // URL to uploaded icon image
}

interface ServiceApi {
  _id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  features: FeatureApi[];
  order: number;
  isActive: boolean;
}

interface ServicePageApiResponse {
  _id: string;
  services: ServiceApi[];
}

interface ServiceItem {
  _id: string;
  key: string;
  title: string;
  description: string;
  image: string;
  points: { label: string; icon: string }[];
}

/* Grid spacing shared by the skeleton and the real grid.
   2xl (1536px+): 1464px wide grid, 94px column gap, 137px row gap,
   which gives 425px wide cards like the reference. */
const GRID_CLASSES = `
  relative z-10
  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
  gap-x-6 sm:gap-x-7 lg:gap-x-8 xl:gap-x-12 2xl:gap-x-[94px]
  gap-y-10 sm:gap-y-12 lg:gap-y-16 xl:gap-y-24 2xl:gap-y-[137px]
  px-5 sm:px-8 md:px-12 lg:px-16 xl:px-24 2xl:px-0
  pt-10 sm:pt-14 md:pt-16 lg:pt-20
  pb-16 sm:pb-20 md:pb-24 lg:pb-28 xl:pb-32
  w-full max-w-[1464px] mx-auto
`;

// ================= SMALL COMPONENTS =================

function PointIcon({ src }: { src: string }) {
  if (!src)
    return <span className="block h-5 w-5 shrink-0 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />;
  return (
    <span className="relative block h-5 w-5 shrink-0 sm:h-5 sm:w-5 lg:h-6 lg:w-6">
      <Image
        src={src}
        alt=""
        fill
        unoptimized
        sizes="24px"
        className="object-contain"
      />
    </span>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="
        flex-shrink-0
        transition-transform duration-300 ease-out
        [transform:rotate(-45deg)]
        group-hover/btn:[transform:translateX(6px)_rotate(0deg)]
      "
    >
      <path
        d="M2.5 9H15.5M15.5 9L10.5 4M15.5 9L10.5 14"
        stroke="#E40000"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ServicesGridSkeleton() {
  return (
    <section className="relative isolate w-full bg-black">
      <div className={GRID_CLASSES}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="relative min-h-[320px] animate-pulse rounded-[20px] bg-white/5 sm:min-h-[340px] lg:min-h-[351px]"
          />
        ))}
      </div>
    </section>
  );
}

// ================= MAIN COMPONENT =================

export default function ServicesGrid() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get<
          ServicePageApiResponse | ServicePageApiResponse[]
        >("/service-page");

        let apiData: ServicePageApiResponse | null = null;
        if (Array.isArray(res.data)) {
          apiData = res.data.length > 0 ? res.data[0] : null;
        } else if (res.data && typeof res.data === "object") {
          apiData = res.data;
        }

        if (!apiData?.services) {
          setServices([]);
          return;
        }

        // Filter active + sort by order + map to internal shape
        const mapped: ServiceItem[] = apiData.services
          .filter((s) => s.isActive)
          .sort((a, b) => a.order - b.order)
          .map((s) => ({
            _id: s._id,
            key: s.slug || s._id,
            title: s.title,
            description: s.description,
            image: s.image || "",
            // Take up to 3 features, pass the icon URL directly
            points: (s.features ?? []).slice(0, 3).map((f) => ({
              label: f.title,
              icon: f.icon,
            })),
          }));

        setServices(mapped);
      } catch (err) {
        console.error("Failed to fetch services:", err);
        setServices([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (isLoading) return <ServicesGridSkeleton />;

  if (services.length === 0) {
    return null;
  }

  return (
    <section className="relative isolate w-full bg-black">
      {/* Red glow — TOP LEFT */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute inset-0 z-0
          bg-[radial-gradient(ellipse_80%_400px_at_0%_0%,#E40000_0%,rgba(228,0,0,0.25)_55%,rgba(228,0,0,0.06)_80%,transparent_100%)]
        "
      />

      {/* Red glow — TOP RIGHT */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute inset-0 z-0
          bg-[radial-gradient(ellipse_32%_32%_at_100%_0%,#E40000_0%,rgba(228,0,0,0.25)_55%,rgba(228,0,0,0.06)_80%,transparent_100%)]
        "
      />

      <div className={`${GRID_CLASSES} cursor-pointer`}>
        {services.map((service) => (
          <div
            key={service._id}
            className="
              group relative isolate overflow-hidden transform-gpu
              w-full
              min-h-[320px] sm:min-h-[340px] lg:min-h-[351px]
              rounded-[20px]
              pt-8
              pl-6 pr-6 pb-8
              sm:pl-8 sm:pr-8 sm:pb-9
              xl:pl-[34px] xl:pr-[33px] xl:pb-[47px]
              flex flex-col justify-end
            "
          >
            {/* Background image — always visible */}
            {service.image ? (
              <Image
                src={service.image}
                alt={service.title}
                fill
                unoptimized
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 48vw, (max-width: 1464px) 32vw, 425px"
                className="
                  z-0 object-cover
                  transition-transform duration-500
                  group-hover:scale-105
                "
              />
            ) : (
              <Image
                src={serviceFallback}
                alt={service.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 48vw, (max-width: 1464px) 32vw, 425px"
                className="
                  z-0 object-cover
                  transition-transform duration-500
                  group-hover:scale-105
                "
              />
            )}

            {/* Dark gradient overlay — hidden at first, fades in on hover so the text is readable */}
            <div
              aria-hidden
              className="
                absolute inset-0 z-10
                bg-gradient-to-t from-black/90 via-black/50 to-black/10
                opacity-0
                transition-opacity duration-500
                group-hover:opacity-100
                group-focus-within:opacity-100
              "
            />

            {/* Content — hidden at first, fades in on hover, bottom aligned */}
            <div
              className="
                relative z-20 flex flex-col
                opacity-0
                transition-opacity duration-500
                group-hover:opacity-100
                group-focus-within:opacity-100
              "
            >
              {/* Title */}
              <h3
                className="
                  mb-1
                  font-poppins font-medium
                  text-xl sm:text-[22px] lg:text-[24px]
                  leading-tight lg:leading-[1.25]
                  tracking-normal
                  text-white
                "
              >
                {service.title}
              </h3>

              {/* Description */}
              <p
                className="
                  mb-2.5
                  font-poppins font-normal
                  text-sm
                  leading-[1.5]
                  tracking-normal
                  text-[#ADADAD]
                "
              >
                {service.description}
              </p>

              {/* Feature points — 3 equal columns, always one row, label wraps below inside its column */}
              {service.points.length > 0 && (
                <div className="mb-4 grid w-full grid-cols-3 items-start gap-x-3 xl:mb-5 xl:gap-x-[25px]">
                  {service.points.map((point, idx) => (
                    <div
                      key={`${point.label}-${idx}`}
                      className="flex min-w-0 flex-row items-start gap-1.5"
                    >
                      <PointIcon src={point.icon} />
                      <span className="min-w-0 break-words font-poppins text-[11px] font-normal leading-[1.4] text-white sm:text-xs">
                        {point.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* View Service link */}
              <Link
                href={`/services`}
                className="group/btn flex w-fit items-center gap-4 lg:gap-5"
              >
                <span
                  className="
                    font-poppins font-normal
                    text-base lg:text-[19px]
                    leading-none tracking-normal
                    text-[#E40000]
                    whitespace-nowrap
                  "
                >
                  View Service
                </span>
                <ArrowIcon />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}