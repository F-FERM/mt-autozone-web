"use client";

import api from "@/lib/axios";
import Image from "next/image";
import { useEffect, useState } from "react";

// Fallback images
import interiorDetailingImg from "../../../public/images/homeservice1.jpg";
import interiorCleaningImg from "../../../public/images/homeservice2.jpg";
import bodyPolishingImg from "../../../public/images/homeservice3.jpg";

import swirlsIcon from "../../../public/images//service8icon.png";
import shineIcon from "../../../public/images/sercice7icon.png";
import deepCleanIcon from "../../../public/images/service1icon.png";
import freshIcon from "../../../public/images/service2icon.png";
import protectionIcon from "../../../public/images/service3icon.png";
import dirtIcon from "../../../public/images/service4icon.png";
import interiorFeelIcon from "../../../public/images/service5icon.png";
import cleanFinishIcon from "../../../public/images/service6icon.png";
import glossyIcon from "../../../public/images/service9icon.png";

// ================= TYPES =================

interface FeatureApi {
  _id?: string;
  title: string;
  icon: string; // URL to uploaded icon image
  order: number;
  isActive: boolean;
}

interface ServiceCardApi {
  _id: string;
  title: string;
  description: string;
  image: string;
  features: FeatureApi[];
  order: number;
  isActive: boolean;
}

interface HomeAboutApiResponse {
  _id: string;
  serviceCards: ServiceCardApi[];
}

interface ServiceItem {
  icon: string | StaticImageData;
  label: string;
}

interface ServiceCardData {
  _id: string;
  image: string | StaticImageData;
  title: string;
  description: string;
  items: ServiceItem[];
}

// StaticImageData type import
type StaticImageData = {
  src: string;
  height: number;
  width: number;
  blurDataURL?: string;
  blurWidth?: number;
  blurHeight?: number;
};

// Fallback icons (used when API icon URL is missing)
const FALLBACK_ICONS: StaticImageData[] = [
  deepCleanIcon,
  freshIcon,
  protectionIcon,
  dirtIcon,
  interiorFeelIcon,
  cleanFinishIcon,
  shineIcon,
  swirlsIcon,
  glossyIcon,
];

// Fallback cards (used when API fails)
const FALLBACK_CARDS: ServiceCardData[] = [
  {
    _id: "fb-1",
    image: interiorDetailingImg,
    title: "Interior Cleaning & Detailing",
    description:
      "Make your car look brand new with the help of professional auto detailing that involves a detailed cleaning and finishing for a spotless, polished look.",
    items: [
      { icon: deepCleanIcon, label: "Deep Interior Clean" },
      { icon: freshIcon, label: "Fresh & Refreshed" },
      { icon: protectionIcon, label: "Long Lasting Protection" },
    ],
  },
  {
    _id: "fb-2",
    image: interiorCleaningImg,
    title: "Interior Cleaning",
    description:
      "Experience professional car interior cleaning in Dubai, removing dirt, stains, and dust for a fresh, comfortable cabin.",
    items: [
      { icon: dirtIcon, label: "Deep Dirt Removal" },
      { icon: interiorFeelIcon, label: "Fresh Interior Feel" },
      { icon: cleanFinishIcon, label: "Clean Finish" },
    ],
  },
  {
    _id: "fb-3",
    image: bodyPolishingImg,
    title: "Body Polishing",
    description:
      "Restore your vehicle's shine with complete body polishing, enhancing paint gloss and creating a smooth, refined exterior finish.",
    items: [
      { icon: shineIcon, label: "Restores Shine" },
      { icon: swirlsIcon, label: "Removes Fine Swirls" },
      { icon: glossyIcon, label: "Glossy Finish" },
    ],
  },
];

// Feature item layout (icon + label).
// Always 3 items in one row, each as wide as its own content (no equal-width columns). Icon sits LEFT of the label (like the design)
// whenever the card is wide enough, and goes ABOVE the label when the card is narrow:
//   < 420px      -> icon above label   (small phones)
//   420-639px    -> icon left          (1 card per row, wide)
//   640-767px    -> icon above label   (2 cards per row, narrow)
//   768-1023px   -> icon left          (2 cards per row, wide)
//   1024-1279px  -> icon above label   (3 cards per row, narrow)
//   1280px+      -> icon left          (3 cards per row, wide)
const FEATURE_ITEM_LAYOUT =
  "flex min-w-0 shrink flex-col items-start gap-1.5 " +
  "min-[420px]:flex-row min-[420px]:items-center min-[420px]:gap-2 " +
  "sm:flex-col sm:items-start sm:gap-1.5 " +
  "md:flex-row md:items-center md:gap-2 " +
  "lg:flex-col lg:items-start lg:gap-1.5 " +
  "xl:flex-row xl:items-center xl:gap-2";

// ================= COMPONENT =================

export default function ServiceCards() {
  const [cards, setCards] = useState<ServiceCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await api.get<HomeAboutApiResponse | HomeAboutApiResponse[]>(
          "/home-about",
        );

        let apiData: HomeAboutApiResponse | null = null;
        if (Array.isArray(res.data)) {
          apiData = res.data.length > 0 ? res.data[0] : null;
        } else if (res.data && typeof res.data === "object") {
          apiData = res.data;
        }

        if (!apiData?.serviceCards) {
          setCards(FALLBACK_CARDS);
          return;
        }

        // Filter active + sort by order
        const mapped: ServiceCardData[] = apiData.serviceCards
          .filter((c) => c.isActive)
          .sort((a, b) => a.order - b.order)
          .map((card) => {
            // Filter active features + sort by order
            const activeFeatures = (card.features ?? [])
              .filter((f) => f.isActive)
              .sort((a, b) => a.order - b.order);

            return {
              _id: card._id,
              image: card.image || "",
              title: card.title,
              description: card.description,
              items: activeFeatures.map((feat) => ({
                icon: feat.icon || "",
                label: feat.title,
              })),
            };
          });

        setCards(mapped.length > 0 ? mapped : FALLBACK_CARDS);
      } catch (err) {
        console.error("Failed to fetch service cards:", err);
        setCards(FALLBACK_CARDS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCards();
  }, []);

  // ---- Loading skeleton ----
  if (isLoading) {
    return (
      <section
        className="mx-auto grid w-full max-w-[1464px] grid-cols-1 gap-4 px-4 py-10
                   sm:grid-cols-2 sm:gap-3 sm:px-6
                   lg:grid-cols-3 lg:gap-[10px]"
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="relative h-[420px] w-full animate-pulse overflow-hidden rounded-[20px] bg-white/5 sm:h-[420px] lg:h-[446px]"
          />
        ))}
      </section>
    );
  }

  if (cards.length === 0) return null;

  return (
    <section
      className="mx-auto grid w-full max-w-[1464px] grid-cols-1 gap-4 px-4
                 sm:grid-cols-2 sm:gap-3 sm:px-6
                 lg:grid-cols-3 lg:gap-[10px]"
    >
      {cards.map((service, cardIdx) => {
        const isImageRemote = typeof service.image === "string";

        return (
          <article
            key={service._id || cardIdx}
            className="group relative flex min-h-[420px] w-full cursor-pointer overflow-hidden rounded-[20px]
                       transition-transform duration-300 hover:-translate-y-1
                       sm:min-h-[420px]
                       lg:min-h-[446px]"
          >
            {isImageRemote ? (
              <Image
                src={service.image}
                alt={service.title}
                fill
                unoptimized
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
                priority={false}
              />
            ) : (
              <Image
                src={service.image}
                alt={service.title}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
                priority={false}
              />
            )}

            {/* default readability overlay */}
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t
                         from-black/85 via-black/35 to-transparent
                         transition-opacity duration-300 group-hover:opacity-0"
            />

            {/* hover overlay */}
            <div
              className="pointer-events-none absolute inset-0 opacity-0
                         transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background:
                  "linear-gradient(179.97deg, rgba(0,0,0,0) -96.67%, rgba(226,0,0,0.328) 99.97%)",
              }}
            />

            {/* content: pinned to the bottom, padding grows with the screen */}
            <div
              className="relative z-10 mt-auto flex w-full min-w-0 flex-col gap-1
                         px-5 pb-6
                         min-[420px]:px-8 min-[420px]:pb-8
                         sm:px-6 sm:pb-7
                         md:px-8 md:pb-8
                         lg:px-7 lg:pb-9
                         xl:px-10 xl:pb-[50px]"
            >
              <h3 className="font-poppins text-[18px] font-semibold leading-tight text-white min-[420px]:text-[20px] lg:text-[20px] xl:text-[22px]">
                {service.title}
              </h3>

              <p className="font-poppins text-[13px] font-normal leading-[150%] text-[#C4C4C4] min-[420px]:text-[14px] xl:text-[16px]">
                {service.description}
              </p>

              {/* feature row: always 3 in one row */}
              {service.items.length > 0 && (
                <div className="flex flex-nowrap items-start justify-start gap-x-3 pt-1 xl:gap-x-4">
                  {service.items.map((item, iIdx) => {
                    const hasRemoteIcon =
                      typeof item.icon === "string" && item.icon.length > 0;
                    const fallbackIcon =
                      FALLBACK_ICONS[(cardIdx * 3 + iIdx) % FALLBACK_ICONS.length];

                    return (
                      <div
                        key={`${item.label}-${iIdx}`}
                        className={FEATURE_ITEM_LAYOUT}
                      >
                        {hasRemoteIcon ? (
                          <div className="relative h-6 w-6 shrink-0">
                            <Image
                              src={item.icon as string}
                              alt=""
                              fill
                              unoptimized
                              sizes="24px"
                              className="object-contain"
                            />
                          </div>
                        ) : (
                          <Image
                            src={
                              typeof item.icon === "string" ? fallbackIcon : item.icon
                            }
                            alt=""
                            width={24}
                            height={24}
                            className="h-6 w-6 shrink-0 object-contain"
                          />
                        )}
                        <span className="min-w-0 max-w-[88px] break-words font-poppins text-[11px] font-medium leading-[150%] text-[#D3D3D3] sm:text-[12px]">
                          {item.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </article>
        );
      })}
    </section>
  );
}