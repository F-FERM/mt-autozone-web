"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import api from "@/lib/axios";
import MissionVisionCards from "./MissionVissionCards";

// Fallback image
import about1 from "../../../public/images/about1.jpg";

// ================= TYPES =================

interface DescriptionSegment {
  text: string;
  highlight: boolean;
}

interface AboutPageApiResponse {
  _id: string;
  sectionLabel: string;
  title: string;
  description: DescriptionSegment[];
  mainImage: string;
  isActive: boolean;
}

interface AboutHeroData {
  sectionLabel: string;
  title: string;
  description: DescriptionSegment[];
  mainImage: string;
}

const DEFAULT_DATA: AboutHeroData = {
  sectionLabel: "About Us",
  title: "Your Trusted Partner in Automotive Detailing Excellence",
  description: [
    { text: "Our vision at ", highlight: false },
    { text: "M.T. Autozone", highlight: true },
    {
      text: " is to deliver exceptional car care through professional expertise, quality materials, modern techniques, and genuine customer service.",
      highlight: false,
    },
  ],
  mainImage: "",
};

// ================= COMPONENT =================

export default function AboutUs() {
  const [data, setData] = useState<AboutHeroData>(DEFAULT_DATA);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await api.get<AboutPageApiResponse | AboutPageApiResponse[]>(
          "/about-page",
        );

        let apiData: AboutPageApiResponse | null = null;
        if (Array.isArray(res.data)) {
          apiData = res.data.length > 0 ? res.data[0] : null;
        } else if (res.data && typeof res.data === "object") {
          apiData = res.data;
        }

        if (!apiData) {
          setData(DEFAULT_DATA);
          return;
        }

        setData({
          sectionLabel: apiData.sectionLabel || DEFAULT_DATA.sectionLabel,
          title: apiData.title || DEFAULT_DATA.title,
          description:
            apiData.description?.length > 0
              ? apiData.description
              : DEFAULT_DATA.description,
          mainImage: apiData.mainImage || "",
        });
      } catch (err) {
        console.error("Failed to fetch about page hero:", err);
        setData(DEFAULT_DATA);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAbout();
  }, []);

  const renderDescription = () =>
    data.description.map((seg, idx) =>
      seg.highlight ? (
        <span key={idx} className="text-[#E40000]">
          {" "} {seg.text} {" "}
        </span>
      ) : (
        <span key={idx}>{seg.text}</span>
      ),
    );

  return (
    <div className="bg-black">
      <section className="relative w-full overflow-hidden bg-black isolate">
        {/* Red glow bleeding in from the right */}
        <div
          aria-hidden
          className="
            pointer-events-none absolute inset-y-0 right-0 z-0
            w-full
            bg-gradient-to-l from-[#E40000]/65 via-[#E40000]/10 to-transparent
          "
        />

        {/* Vertical fade to black at bottom */}
        <div
          aria-hidden
          className="
            pointer-events-none absolute inset-x-0 bottom-0 z-[1]
            h-24 sm:h-32 md:h-40
            bg-gradient-to-b from-transparent to-black
          "
        />

        <div
          className="
            relative z-10 flex flex-col
            px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16
            pt-8 sm:pt-12 md:pt-14 lg:pt-16 xl:pt-24
            w-full max-w-[1464px] mx-auto
          "
        >
          {/* Eyebrow */}
          {isLoading ? (
            <div className="h-4 w-24 animate-pulse rounded-md bg-white/10 mb-2 sm:mb-3 md:mb-4" />
          ) : (
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
              {data.sectionLabel}
            </span>
          )}

          {/* Heading */}
          {isLoading ? (
            <div className="h-8 w-3/4 animate-pulse rounded-md bg-white/10 mb-4 sm:mb-5 md:mb-6 lg:mb-[30px]" />
          ) : (
            <h2
              className="
                font-poppins font-semibold
                text-2xl sm:text-3xl md:text-[32px] lg:text-[36px]
                leading-tight sm:leading-snug lg:leading-[150%]
                tracking-normal
                text-white
                w-full max-w-[681px]
                mb-4 sm:mb-5 md:mb-6 lg:mb-[30px]
              "
            >
              {data.title}
            </h2>
          )}

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
                aspect-[16/9] lg:aspect-auto
                h-auto lg:h-[367px]
                lg:flex-1 lg:max-w-[722px]
                flex-shrink-0
                rounded-2xl lg:rounded-[20px] overflow-hidden
              "
            >
              {data.mainImage ? (
                <Image
                  src={data.mainImage}
                  alt="M.T. Autozone technician detailing a vehicle"
                  fill
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 722px"
                  className="object-cover"
                  priority
                />
              ) : (
                <Image
                  src={about1}
                  alt="M.T. Autozone technician detailing a vehicle"
                  fill
                  sizes="(max-width: 1024px) 100vw, 722px"
                  className="object-cover"
                  priority
                />
              )}
            </div>

            {/* Paragraph */}
            {isLoading ? (
              <div className="space-y-2 w-full lg:flex-1 lg:max-w-[719px]">
                <div className="h-4 w-full animate-pulse rounded-md bg-white/10" />
                <div className="h-4 w-full animate-pulse rounded-md bg-white/10" />
                <div className="h-4 w-2/3 animate-pulse rounded-md bg-white/10" />
              </div>
            ) : (
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
                {renderDescription()}
              </p>
            )}
          </div>
        </div>
      </section>

      <MissionVisionCards />
    </div>
  );
}