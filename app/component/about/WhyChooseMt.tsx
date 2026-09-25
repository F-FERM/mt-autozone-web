"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

// ================= TYPES =================

interface DescriptionSegment {
  text: string;
  highlight: boolean;
}

interface WhyChoosePointApi {
  _id?: string;
  title: string;
  description: string;
  order: number;
  isActive: boolean;
}

interface AboutPageApiResponse {
  _id: string;
  whyChooseLabel: string;
  whyChooseTitle: string;
  whyChooseDescription: DescriptionSegment[];
  whyChoosePoints: WhyChoosePointApi[];
}

interface WhyChooseData {
  label: string;
  title: string;
  description: DescriptionSegment[];
  points: WhyChoosePointApi[];
}

const DEFAULT_DATA: WhyChooseData = {
  label: "Why",
  title: "Why Choose MT Auto Zone?",
  description: [
    { text: "", highlight: false },
    { text: "M.T. Autozone", highlight: true },
    {
      text: " provides its clients with professional and reliable car care services in Dubai.",
      highlight: false,
    },
  ],
  points: [],
};

// ================= CHECK ICON =================

function CheckIcon() {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
    >
      <path
        d="M21 6.5L9.5 18L4 12.5"
        stroke="#E40000"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ================= COMPONENT =================

export default function WhyChooseUs() {
  const [data, setData] = useState<WhyChooseData>(DEFAULT_DATA);
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

        const activePoints = (apiData.whyChoosePoints ?? [])
          .filter((p) => p.isActive)
          .sort((a, b) => a.order - b.order);

        setData({
          label: apiData.whyChooseLabel || DEFAULT_DATA.label,
          title: apiData.whyChooseTitle || DEFAULT_DATA.title,
          description:
            apiData.whyChooseDescription?.length > 0
              ? apiData.whyChooseDescription
              : DEFAULT_DATA.description,
          points: activePoints,
        });
      } catch (err) {
        console.error("Failed to fetch why-choose:", err);
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
           {""}  {seg.text}   {""} 
        </span>
      ) : (
        <span key={idx}>{seg.text}</span>
      ),
    );

  return (
    <section className="relative w-full overflow-hidden bg-black isolate">
      {/* Red glow bleeding in from the left */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute inset-y-0 left-0 z-0
          w-full
          bg-gradient-to-r from-[#E40000]/45 via-[#E40000]/10 to-transparent
        "
      />

      {/* Fade to black at bottom */}
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
          relative z-10
          flex flex-col lg:flex-row lg:items-start
          px-5 sm:px-8 md:px-12 lg:px-16 xl:px-24 2xl:px-[228px]
          py-10 sm:py-14 md:py-16 lg:py-20
          gap-8
          w-full mx-auto
        "
      >
        {/* Left column */}
        <div className="flex flex-col w-full lg:flex-1">
          {isLoading ? (
            <>
              <div className="h-4 w-16 animate-pulse rounded-md bg-white/10 mb-2 sm:mb-3 md:mb-4" />
              <div className="h-8 w-3/4 animate-pulse rounded-md bg-white/10 mb-4 sm:mb-5 md:mb-8" />
              <div className="space-y-2">
                <div className="h-4 w-full animate-pulse rounded-md bg-white/10" />
                <div className="h-4 w-full animate-pulse rounded-md bg-white/10" />
                <div className="h-4 w-2/3 animate-pulse rounded-md bg-white/10" />
              </div>
            </>
          ) : (
            <>
              <span
                className="
                  block
                  font-poppins font-normal
                  text-sm sm:text-base
                  leading-none tracking-normal
                  text-[#E40000]
                  mb-2 sm:mb-3 md:mb-4
                "
              >
                {data.label}
              </span>

              <h2
                className="
                  font-poppins font-semibold
                  text-2xl sm:text-3xl md:text-[32px] lg:text-[36px]
                  leading-tight sm:leading-snug lg:leading-[150%]
                  tracking-normal
                  text-white
                  mb-4 sm:mb-5 md:mb-8
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
                  text-[#878787]
                "
              >
                {renderDescription()}
              </p>
            </>
          )}
        </div>

        {/* Right column */}
        <div
          className="
            flex flex-col
            gap-[17px]
            w-full lg:w-[722px] lg:flex-shrink-0
          "
        >
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-4 sm:gap-6"
                >
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <div className="h-5 w-40 animate-pulse rounded-md bg-white/10 mb-2" />
                    <div className="h-4 w-full animate-pulse rounded-md bg-white/10" />
                  </div>
                  <div className="h-[25px] w-[25px] shrink-0 animate-pulse rounded-full bg-white/10" />
                </div>
              ))
            : data.points.map((point, idx) => (
                <div
                  key={point._id || idx}
                  className="flex items-center justify-between gap-4 sm:gap-6"
                >
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <h3
                      className="
                        font-poppins font-semibold
                        text-base sm:text-lg
                        leading-none tracking-normal
                        text-white mb-2
                      "
                    >
                      {point.title}
                    </h3>
                    <p
                      className="
                        font-poppins font-normal
                        text-sm sm:text-base
                        leading-relaxed
                        tracking-normal
                        text-[#A1A1A1]
                      "
                    >
                      {point.description}
                    </p>
                  </div>

                  <div>
                    <CheckIcon />
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}