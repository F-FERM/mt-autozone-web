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

// ================= SMALL COMPONENTS =================

function PointIcon({ src }: { src: string }) {
  if (!src) return <span className="block h-4 w-4 shrink-0 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />;
  return (
    <span className="relative block h-4 w-4 shrink-0 sm:h-5 sm:w-5 lg:h-6 lg:w-6">
      <Image
        src={src}
        alt=""
        fill
        unoptimized
        sizes="30px"
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
      <div className="relative z-10 grid grid-cols-1 gap-x-6 gap-y-10 px-5 pt-10 pb-16 sm:grid-cols-2 sm:gap-x-7 sm:gap-y-12 sm:px-8 sm:pt-14 sm:pb-20 md:px-12 md:pt-16 md:pb-24 lg:grid-cols-3 lg:gap-x-[30px] lg:gap-y-[45px] lg:px-16 lg:pt-20 lg:pb-28 xl:px-24 xl:pb-32 mx-auto w-full max-w-[1464px]">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="relative min-h-[340px] animate-pulse rounded-[20px] bg-white/5 sm:min-h-[351px]"
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
              icon: f.icon, // ← URL, not a key
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

      <div
        className="
          relative z-10
          grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
          gap-x-6 sm:gap-x-7 lg:gap-x-[30px]
          gap-y-10 sm:gap-y-12 lg:gap-y-[45px]
          px-5 sm:px-8 md:px-12 lg:px-16 xl:px-24
          pt-10 sm:pt-14 md:pt-16 lg:pt-20
          pb-16 sm:pb-20 md:pb-24 lg:pb-28 xl:pb-32
          w-full max-w-[1464px] mx-auto
        "
      >
        {services.map((service) => (
          <div
            key={service._id}
            className="
              group relative isolate overflow-hidden
              w-full
              min-h-[340px] sm:min-h-[351px]
              rounded-[20px]
              pt-[100px] sm:pt-[130px] lg:pt-[151px]
              pr-6 sm:pr-8 lg:pr-[33px]
              pb-8 sm:pb-9 lg:pb-[39px]
              pl-6 sm:pl-8 lg:pl-[34px]
              flex flex-col justify-end
              transition-transform duration-500 ease-out
              hover:-translate-y-1 hover:scale-[1.02]
            "
          >
            {/* Background image — API URL or fallback */}
            {service.image ? (
              <Image
                src={service.image}
                alt={service.title}
                fill
                unoptimized
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 48vw, (max-width: 1464px) 32vw, 468px"
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
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 48vw, (max-width: 1464px) 32vw, 468px"
                className="
                  z-0 object-cover
                  transition-transform duration-500
                  group-hover:scale-105
                "
              />
            )}

            {/* Dark gradient overlay */}
            <div
              aria-hidden
              className="
                absolute inset-0 z-10
                bg-gradient-to-t from-black/90 via-black/50 to-black/10
                opacity-100
                transition-opacity duration-500 ease-out
                [@media(hover:hover)]:opacity-0
                [@media(hover:hover)]:group-hover:opacity-100
              "
            />

            {/* Content */}
            <div
              className="
                relative z-20 flex flex-col gap-2.5
                opacity-100 translate-y-0 scale-100
                transition-all duration-500 ease-out
                [@media(hover:hover)]:opacity-0
                [@media(hover:hover)]:translate-y-3
                [@media(hover:hover)]:scale-95
                [@media(hover:hover)]:group-hover:opacity-100
                [@media(hover:hover)]:group-hover:translate-y-0
                [@media(hover:hover)]:group-hover:scale-100
              "
            >
              {/* Title */}
              <h3
                className="
                  font-poppins font-medium
                  text-xl sm:text-[22px] lg:text-[24px]
                  leading-tight lg:leading-[150%]
                  tracking-normal
                  text-white
                "
              >
                {service.title}
              </h3>

              {/* Description */}
              <p
                className="
                  font-poppins font-normal
                  text-sm lg:text-[14px]
                  leading-relaxed
                  tracking-normal
                  text-[#ADADAD]
                "
              >
                {service.description}
              </p>

              {/* Feature points — max 3, icons are uploaded image URLs */}
              {service.points.length > 0 && (
                <div className="grid grid-cols-3 gap-2 pt-1 sm:gap-3">
                  {service.points.map((point, idx) => (
                    <div
                      key={`${point.label}-${idx}`}
                      className="flex min-w-0 flex-row items-center gap-1.5 sm:gap-2"
                    >
                      <PointIcon src={point.icon} />
                      <span className="min-w-0 break-words font-poppins text-[11px] font-normal leading-tight text-white sm:text-xs xl:text-sm">
                        {point.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* View Service link */}
              <Link
                href={`/services/${service.key}`}
                className="group/btn flex items-center gap-2.5 w-fit"
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