"use client";

import api from "@/lib/axios";
import Image, { type StaticImageData } from "next/image";
import { useEffect, useState } from "react";

// Fallback logos (used if API fails or returns empty)
import toyotaLogo from "../../../public/images/b1.png";
import nissanLogo from "../../../public/images/b2.png";
import lexusLogo from "../../../public/images/b3.png";
import kiaLogo from "../../../public/images/b4.png";
import jeepLogo from "../../../public/images/b5.png";
import chryslerLogo from "../../../public/images/b6.png";
import fordLogo from "../../../public/images/kia.png";

// ================= TYPES =================

interface BrandApi {
  _id: string;
  name: string;
  image: string;
  order: number;
  isActive: boolean;
}

interface HomeBrandsApiResponse {
  _id: string;
  sectionLabel: string;
  title: string;
  description: string;
  brands: BrandApi[];
  isActive: boolean;
}

interface Brand {
  _id: string;
  name: string;
  image: string | StaticImageData;
  order: number;
}

interface BrandsData {
  sectionLabel: string;
  title: string;
  description: string;
  brands: Brand[];
}

// ================= SPEED =================

/**
 * Time for one full loop of the marquee.
 * Lower number = faster. Try 8s for faster, 16s for slower.
 */
const MARQUEE_DURATION = "12s";

// ================= RESPONSIVE SIZES =================
// Change sizes here once — the skeleton and the real cards both use them.

// Card size per breakpoint
const CARD_SIZE =
  "h-[85px] w-[140px] " + // < 640px  (small phones)
  "sm:h-[110px] sm:w-[190px] " + // ≥ 640px  (large phones)
  "md:h-[135px] md:w-[240px] " + // ≥ 768px  (tablets)
  "lg:h-[170px] lg:w-[300px] " + // ≥ 1024px (laptops)
  "xl:h-[195px] xl:w-[340px] " + // ≥ 1280px (desktops)
  "2xl:h-[220px] 2xl:w-[380px]"; // ≥ 1536px (large screens)

// Space between cards (applied as padding on each card, keeps loop seamless)
const CARD_SPACING = "px-2 sm:px-3 md:px-4 lg:px-5";

// Logo max size inside the card
const LOGO_SIZE = "max-h-[70%] max-w-[75%]";

// Red side shadow size per breakpoint (matches card height)
const SHADOW_SIZE =
  "h-[85px] w-[95px] " +
  "sm:h-[110px] sm:w-[130px] " +
  "md:h-[135px] md:w-[155px] " +
  "lg:h-[170px] lg:w-[195px] " +
  "xl:h-[195px] xl:w-[220px] " +
  "2xl:h-[220px] 2xl:w-[245px]";

// ================= FALLBACK DATA =================

const defaultBrands: Brand[] = [
  { _id: "1", name: "Toyota", image: toyotaLogo, order: 0 },
  { _id: "2", name: "Nissan", image: nissanLogo, order: 1 },
  { _id: "3", name: "Lexus", image: lexusLogo, order: 2 },
  { _id: "4", name: "Kia", image: kiaLogo, order: 3 },
  { _id: "5", name: "Jeep", image: jeepLogo, order: 4 },
  { _id: "6", name: "Chrysler", image: chryslerLogo, order: 5 },
  { _id: "7", name: "Ford", image: fordLogo, order: 6 },
];

const defaultData: BrandsData = {
  sectionLabel: "Brands",
  title: "All Major Car Brands Covered",
  description:
    "We service a wide range of leading automobile brands, providing expert care, maintenance, and repairs for every vehicle make and model.",
  brands: defaultBrands,
};

const SECTION_STYLE = {
  backgroundImage:
    "radial-gradient(120% 55% at 100% 100%, rgba(228,0,0,0.45) 0%, rgba(228,0,0,0) 15%), linear-gradient(90deg, #000000 0%, #050000 40%, #200000 65%, #5a0000 85%, #8a0000 100%)",
};

const SECTION_CLASS =
  "relative overflow-hidden bg-black py-10 sm:py-14 md:py-16 lg:py-20 xl:py-24";

const HEADER_CLASS =
  "relative z-10 mx-auto flex max-w-[702px] flex-col items-center gap-3 px-4 text-center sm:px-6";

const MARQUEE_WRAPPER_CLASS =
  "relative z-10 mt-8 sm:mt-10 md:mt-12 lg:mt-14 xl:mt-16";

// ================= SKELETON =================

function BrandsSkeleton() {
  return (
    <section className={SECTION_CLASS} style={SECTION_STYLE}>
      <div className={HEADER_CLASS}>
        <div className="h-4 w-20 animate-pulse rounded-md bg-white/10" />
        <div className="h-8 w-3/4 animate-pulse rounded-md bg-white/10 sm:h-10" />
        <div className="h-4 w-full animate-pulse rounded-md bg-white/10" />
        <div className="h-4 w-2/3 animate-pulse rounded-md bg-white/10" />
      </div>

      <div className={MARQUEE_WRAPPER_CLASS}>
        <div className="relative overflow-hidden">
          <div className="flex w-max items-center">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={`shrink-0 ${CARD_SPACING}`}>
                <div
                  className={`flex items-center justify-center rounded-[20px] bg-white/5 ${CARD_SIZE}`}
                >
                  <div className="h-[60%] w-[70%] animate-pulse rounded-md bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ================= COMPONENT =================

export default function BrandsSection() {
  const [data, setData] = useState<BrandsData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHomeBrands = async () => {
      try {
        const res = await api.get<HomeBrandsApiResponse | HomeBrandsApiResponse[]>(
          "/home-brands"
        );

        // Handle both single object and array responses
        let apiData: HomeBrandsApiResponse | null = null;
        if (Array.isArray(res.data)) {
          apiData = res.data.length > 0 ? res.data[0] : null;
        } else if (res.data && typeof res.data === "object") {
          apiData = res.data;
        }

        if (!apiData) {
          setData(defaultData);
          return;
        }

        // Filter active brands and sort by order
        const activeBrands = (apiData.brands || [])
          .filter((b) => b.isActive)
          .sort((a, b) => a.order - b.order)
          .map((b) => ({
            _id: b._id,
            name: b.name,
            image: b.image,
            order: b.order,
          }));

        setData({
          sectionLabel: apiData.sectionLabel || defaultData.sectionLabel,
          title: apiData.title || defaultData.title,
          description: apiData.description || defaultData.description,
          brands: activeBrands.length > 0 ? activeBrands : defaultBrands,
        });
      } catch (err) {
        console.error("Failed to fetch home brands:", err);
        setData(defaultData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeBrands();
  }, []);

  if (isLoading) return <BrandsSkeleton />;

  // Make sure one "half" of the track has at least 8 cards so it always
  // covers wide screens, then duplicate it for the seamless -50% loop.
  const MIN_CARDS_PER_HALF = 8;
  const repeats = Math.max(1, Math.ceil(MIN_CARDS_PER_HALF / data.brands.length));
  const half = Array.from({ length: repeats }).flatMap(() => data.brands);
  const track = [...half, ...half];

  return (
    <section className={SECTION_CLASS} style={SECTION_STYLE}>
      <div className={HEADER_CLASS}>
        <p className="font-poppins text-sm font-normal leading-none text-[#E40000] sm:text-base">
          {data.sectionLabel}
        </p>
        <h2 className="font-poppins text-2xl font-semibold leading-tight text-white sm:text-[28px] md:text-[32px] lg:text-[36px]">
          {data.title}
        </h2>
        <p className="font-poppins text-sm font-normal leading-relaxed text-[#878787] sm:text-base">
          {data.description}
        </p>
      </div>

      {/* MARQUEE AREA — full width, no side padding */}
      <div className={MARQUEE_WRAPPER_CLASS}>
        {/* LEFT EXTERNAL RED SHADOW */}
        <div
          className={`pointer-events-none absolute left-[-35px] top-1/2 z-20 -translate-y-1/2 rounded-full bg-[#8a0000] opacity-70 blur-[40px]
                      sm:left-[-45px] sm:blur-[50px]
                      md:left-[-55px] md:blur-[55px]
                      lg:left-[-70px] lg:blur-[65px]
                      ${SHADOW_SIZE}`}
        />
        {/* RIGHT EXTERNAL RED SHADOW */}
        <div
          className={`pointer-events-none absolute right-[-35px] top-1/2 z-20 -translate-y-1/2 rounded-full bg-[#8a0000] opacity-70 blur-[40px]
                      sm:right-[-45px] sm:blur-[50px]
                      md:right-[-55px] md:blur-[55px]
                      lg:right-[-70px] lg:blur-[65px]
                      ${SHADOW_SIZE}`}
        />

        {/* ACTUAL MARQUEE CONTAINER */}
        <div className="relative overflow-hidden">
          <div
            className="brands-marquee-track flex w-max items-center"
            style={{ ["--marquee-duration" as string]: MARQUEE_DURATION }}
          >
            {track.map((brand, i) => (
              <div key={`${brand._id}-${i}`} className={`shrink-0 ${CARD_SPACING}`}>
                <div
                  className={`flex items-center justify-center rounded-[20px] ${CARD_SIZE}`}
                >
                  {typeof brand.image === "string" ? (
                    <Image
                      src={brand.image}
                      alt={brand.name}
                      width={400}
                      height={200}
                      unoptimized
                      className={`h-auto w-auto object-contain ${LOGO_SIZE}`}
                    />
                  ) : (
                    <Image
                      src={brand.image}
                      alt={brand.name}
                      className={`h-auto w-auto object-contain ${LOGO_SIZE}`}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .brands-marquee-track {
          animation: brands-marquee-scroll var(--marquee-duration, 12s) linear infinite;
          will-change: transform;
        }
        @keyframes brands-marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .brands-marquee-track {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}