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

// ================= SKELETON =================

function BrandsSkeleton() {
  return (
    <section
      className="relative overflow-hidden bg-black py-12 sm:py-16 lg:py-24"
      style={{
        backgroundImage:
          "radial-gradient(120% 55% at 100% 100%, rgba(228,0,0,0.45) 0%, rgba(228,0,0,0) 15%), linear-gradient(90deg, #000000 0%, #050000 40%, #200000 65%, #5a0000 85%, #8a0000 100%)",
      }}
    >
      <div className="relative z-10 mx-auto flex max-w-[702px] flex-col items-center gap-3 px-4 text-center sm:px-6">
        <div className="h-4 w-20 animate-pulse rounded-md bg-white/10" />
        <div className="h-8 w-3/4 animate-pulse rounded-md bg-white/10 sm:h-10" />
        <div className="h-4 w-full animate-pulse rounded-md bg-white/10" />
        <div className="h-4 w-2/3 animate-pulse rounded-md bg-white/10" />
      </div>

      <div className="relative z-10 mt-10 sm:mt-14 lg:mt-16">
        <div className="relative overflow-hidden">
          <div className="flex w-max items-center gap-6 sm:gap-8 lg:gap-10">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex h-[110px] w-[200px] shrink-0 items-center justify-center rounded-[20px] bg-white/5 sm:h-[150px] sm:w-[300px] lg:h-[180px] lg:w-[360px]"
              >
                <div className="h-[60%] w-[70%] animate-pulse rounded-md bg-white/10" />
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

  // Duplicate for seamless marquee loop
  const track = [...data.brands, ...data.brands];

  return (
    <section
      className="relative overflow-hidden bg-black py-12 sm:py-16 lg:py-24"
      style={{
        backgroundImage:
          "radial-gradient(120% 55% at 100% 100%, rgba(228,0,0,0.45) 0%, rgba(228,0,0,0) 15%), linear-gradient(90deg, #000000 0%, #050000 40%, #200000 65%, #5a0000 85%, #8a0000 100%)",
      }}
    >
      <div className="relative z-10 mx-auto flex max-w-[702px] flex-col items-center gap-3 px-4 text-center sm:px-6">
        <p className="font-poppins text-sm font-normal leading-none text-[#E40000] sm:text-base">
          {data.sectionLabel}
        </p>
        <h2 className="font-poppins text-2xl font-semibold leading-tight text-white sm:text-[32px] lg:text-[36px]">
          {data.title}
        </h2>
        <p className="font-poppins text-sm font-normal leading-relaxed text-[#878787] sm:text-base">
          {data.description}
        </p>
      </div>

      {/* MARQUEE AREA — full width, no side padding */}
      <div className="relative z-10 mt-10 sm:mt-14 lg:mt-16">
        {/* LEFT EXTERNAL RED SHADOW */}
        <div
          className="pointer-events-none absolute left-[-40px] top-[58%] z-20 h-[110px] w-[130px] -translate-y-1/2 rounded-full bg-[#8a0000] opacity-70 blur-[45px]
                     sm:left-[-60px] sm:h-[150px] sm:w-[180px] sm:blur-[60px]
                     lg:left-[-80px] lg:h-[180px] lg:w-[220px] lg:blur-[70px]"
        />
        {/* RIGHT EXTERNAL RED SHADOW */}
        <div
          className="pointer-events-none absolute right-[-40px] top-1/2 z-20 h-[110px] w-[130px] -translate-y-1/2 rounded-full bg-[#8a0000] opacity-70 blur-[45px]
                     sm:right-[-60px] sm:h-[150px] sm:w-[180px] sm:blur-[60px]
                     lg:right-[-80px] lg:h-[180px] lg:w-[220px] lg:blur-[70px]"
        />

        {/* ACTUAL MARQUEE CONTAINER */}
        <div className="relative overflow-hidden">
          <div
            className="flex w-max items-center gap-6 sm:gap-8 lg:gap-10"
            style={{
              animation: "brands-marquee-scroll 16s linear infinite",
            }}
          >
            {track.map((brand, i) => (
              <div
                key={`${brand._id}-${i}`}
                className="flex h-[110px] w-[200px] shrink-0 items-center justify-center rounded-[20px] sm:h-[150px] sm:w-[300px] lg:h-[180px] lg:w-[360px]"
              >
                {typeof brand.image === "string" ? (
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    width={200}
                    height={100}
                    unoptimized
                    className="h-auto max-h-[60%] w-auto max-w-[70%] object-contain"
                  />
                ) : (
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    className="h-auto max-h-[60%] w-auto max-w-[70%] object-contain"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes brands-marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          section .flex[style*="brands-marquee-scroll"] {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}