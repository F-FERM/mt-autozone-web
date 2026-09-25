"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import api from "@/lib/axios";

// Fallback image
import servicesHeroBg from "../../../public/images/serviceshero.jpg";

// ================= TYPES =================

interface DescriptionSegment {
  text: string;
  highlight: boolean;
}

interface ServicePageApiResponse {
  _id: string;
  sectionLabel: string;
  title: string;
  description: DescriptionSegment[];
  backgroundImage: string;
  services: unknown[];
  isActive: boolean;
}

interface HeroData {
  sectionLabel: string;
  title: string;
  description: DescriptionSegment[];
  backgroundImage: string;
}

const defaultHeroData: HeroData = {
  sectionLabel: "Services",
  title: "Our Expert Automotive Services",
  description: [
    { text: "At ", highlight: false },
    { text: "M.T. Autozone", highlight: true },
    {
      text: ", we provide professional automotive care focused on maintaining your vehicle's appearance, comfort, and overall presentation.",
      highlight: false,
    },
  ],
  backgroundImage: "",
};

// ================= COMPONENT =================

export default function ServicesHero() {
  const [data, setData] = useState<HeroData>(defaultHeroData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServicePage = async () => {
      try {
        const res = await api.get<ServicePageApiResponse | ServicePageApiResponse[]>(
          "/service-page"
        );

        let apiData: ServicePageApiResponse | null = null;
        if (Array.isArray(res.data)) {
          apiData = res.data.length > 0 ? res.data[0] : null;
        } else if (res.data && typeof res.data === "object") {
          apiData = res.data;
        }

        if (!apiData) {
          setData(defaultHeroData);
          return;
        }

        setData({
          sectionLabel: apiData.sectionLabel || defaultHeroData.sectionLabel,
          title: apiData.title || defaultHeroData.title,
          description:
            apiData.description?.length > 0
              ? apiData.description
              : defaultHeroData.description,
          backgroundImage: apiData.backgroundImage || "",
        });
      } catch (err) {
        console.error("Failed to fetch service page hero:", err);
        setData(defaultHeroData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServicePage();
  }, []);

  // Render description segments with highlight styling
  const renderDescription = () =>
    data.description.map((seg, idx) =>
      seg.highlight ? (
        <span key={idx} className="text-[#E40000]">
        {""} {seg.text} {""}
        </span>
      ) : (
        <span key={idx}>{seg.text}</span>
      )
    );

  return (
    <section
      className="
        relative w-full overflow-hidden
        min-h-[280px] sm:min-h-[360px] md:min-h-[420px] lg:min-h-[448px] 2xl:min-h-[476px]
      "
    >
      {/* Background image — API first, fallback to static */}
      {data.backgroundImage ? (
        <Image
          src={data.backgroundImage}
          alt="M.T. Autozone technician servicing a vehicle"
          fill
          unoptimized
          sizes="100vw"
          className="object-cover"
          priority
        />
      ) : (
        <Image
          src={servicesHeroBg}
          alt="M.T. Autozone technician servicing a vehicle"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      )}

      {/* Dark overlay */}
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
          min-h-full
          px-5 sm:px-8 md:px-12
          py-10 sm:py-12 md:py-14
          gap-3 sm:gap-4 lg:gap-[19px]
          w-full max-w-[1464px] mx-auto
          justify-center
          text-center
        "
      >
        {isLoading ? (
          <>
            <div className="h-4 w-24 animate-pulse rounded-md bg-white/10" />
            <div className="h-8 w-3/4 animate-pulse rounded-md bg-white/10 sm:h-10" />
            <div className="h-4 w-full max-w-[880px] animate-pulse rounded-md bg-white/10" />
          </>
        ) : (
          <>
            <span
              className="
                font-poppins font-normal
                text-sm sm:text-base
                leading-none tracking-normal
                text-[#E40000]
              "
            >
              {data.sectionLabel}
            </span>

            <h2
              className="
                font-poppins font-semibold
                text-2xl sm:text-3xl md:text-[32px] lg:text-[36px]
                leading-tight sm:leading-snug lg:leading-[100%]
                tracking-normal
                text-white
                max-w-[575px] mb-4
              "
            >
              {data.title}
            </h2>

            <p
              className="
                font-poppins font-normal
                text-sm sm:text-base
                leading-relaxed lg:leading-[180%]
                tracking-normal
                text-[#C0C0C0]
                max-w-[880px]
              "
            >
              {renderDescription()}
            </p>
          </>
        )}
      </div>
    </section>
  );
}