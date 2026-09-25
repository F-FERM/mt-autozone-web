"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import api from "@/lib/axios";

// Fallback images
import missionBg from "../../../public/images/k1.jpg";
import visionBg from "../../../public/images/k2.jpg";

// ================= TYPES =================

interface DescriptionSegment {
  text: string;
  highlight: boolean;
}

interface MissionBlockApi {
  title: string;
  image: string;
  description: DescriptionSegment[];
}

interface VisionBlockApi {
  title: string;
  image: string;
  description: DescriptionSegment[];
}

interface AboutPageApiResponse {
  _id: string;
  mission: MissionBlockApi;
  vision: VisionBlockApi;
}

interface CardData {
  key: string;
  title: string;
  description: DescriptionSegment[];
  image: string;
  alt: string;
}

// ================= COMPONENT =================

export default function MissionVisionCards() {
  const [cards, setCards] = useState<CardData[]>([]);
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
          setCards([]);
          return;
        }

        const result: CardData[] = [];

        if (apiData.mission) {
          result.push({
            key: "mission",
            title: apiData.mission.title || "Our Mission",
            description: apiData.mission.description ?? [],
            image: apiData.mission.image || "",
            alt: "M.T. Autozone technician working on a vehicle",
          });
        }

        if (apiData.vision) {
          result.push({
            key: "vision",
            title: apiData.vision.title || "Our Vision",
            description: apiData.vision.description ?? [],
            image: apiData.vision.image || "",
            alt: "Close-up of automotive detailing tools in use",
          });
        }

        setCards(result);
      } catch (err) {
        console.error("Failed to fetch mission/vision:", err);
        setCards([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAbout();
  }, []);

  // Fallback while loading
  if (isLoading) {
    return (
      <section className="relative w-full overflow-hidden bg-black isolate px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 2xl:px-[228px] py-8 sm:py-14 md:py-16">
        <div className="relative z-10 flex flex-col md:flex-row md:items-stretch gap-5 md:gap-4 lg:gap-5 xl:gap-[20px] w-full max-w-[1464px] mx-auto">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="relative min-h-[240px] animate-pulse rounded-2xl bg-white/5 sm:min-h-[220px] lg:min-h-[216px] w-full md:flex-1"
            />
          ))}
        </div>
      </section>
    );
  }

  if (cards.length === 0) return null;

  // Fallback images when API returns empty image URLs
  const fallbackImages: Record<string, typeof missionBg> = {
    mission: missionBg,
    vision: visionBg,
  };

  const renderDescription = (segments: DescriptionSegment[]) =>
    segments.map((seg, idx) =>
      seg.highlight ? (
        <span key={idx} className="text-[#E40000]">
           {""}  {seg.text}   {""} 
        </span>
      ) : (
        <span key={idx}>{seg.text}</span>
      ),
    );

  return (
    <section
      className="
        relative w-full overflow-hidden
        bg-black isolate
        px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 2xl:px-[228px]
        py-8 sm:py-14 md:py-16
      "
    >
      {/* Red glow from the left */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute inset-y-0 left-0 z-0
          w-full
          bg-gradient-to-r from-[#E40000]/45 via-[#E40000]/10 to-transparent
        "
      />
      {/* Fade to black at the top */}
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
        {cards.map((card) => (
          <div
            key={card.key}
            className="
              group relative isolate overflow-hidden
              w-full md:flex-1 xl:max-w-[722px]
              min-h-[240px] sm:min-h-[220px] lg:min-h-[216px]
              rounded-2xl lg:rounded-[20px]
              px-5 py-7 sm:px-8 sm:py-10 lg:px-9 lg:py-[45px]
              flex flex-col justify-start gap-2.5
            "
          >
            {/* Background image */}
            {card.image ? (
              <Image
                src={card.image}
                alt={card.alt}
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, 722px"
                className="
                  z-0 object-cover
                  transition-opacity duration-500
                  group-hover:opacity-0
                "
              />
            ) : (
              <Image
                src={fallbackImages[card.key] || missionBg}
                alt={card.alt}
                fill
                sizes="(max-width: 768px) 100vw, 722px"
                className="
                  z-0 object-cover
                  transition-opacity duration-500
                  group-hover:opacity-0
                "
              />
            )}

            {/* Dark overlay */}
            <div
              className="
                absolute inset-0 z-10
                bg-black/80
                transition-opacity duration-500
                group-hover:opacity-0
              "
            />
            {/* White hover overlay */}
            <div
              className="
                absolute inset-0 z-20
                bg-white opacity-0
                transition-opacity duration-500
                group-hover:opacity-100
              "
            />

            {/* Title */}
            <h3
              className="
                relative z-30
                font-poppins font-medium
                text-lg sm:text-2xl lg:text-[24px]
                leading-tight sm:leading-none tracking-normal
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
                text-sm
                leading-relaxed sm:leading-loose lg:leading-[1.9]
                tracking-normal
                text-[#A9A9A9]
                transition-colors duration-500
                group-hover:text-[#4B4B4B]
                max-w-full lg:max-w-[650px]
              "
            >
              {renderDescription(card.description)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}