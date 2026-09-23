"use client";

import Image, { type StaticImageData } from "next/image";

// Replace these with your actual distinct logo files
import toyotaLogo from "../../../public/images/kia.png";
import nissanLogo from "../../../public/images/kia.png";
import lexusLogo from "../../../public/images/kia.png";
import kiaLogo from "../../../public/images/kia.png";
import jeepLogo from "../../../public/images/kia.png";
import chryslerLogo from "../../../public/images/kia.png";
import fordLogo from "../../../public/images/kia.png";

interface Brand {
  name: string;
  logo: StaticImageData;
}

const brands: Brand[] = [
  { name: "Toyota", logo: toyotaLogo },
  { name: "Nissan", logo: nissanLogo },
  { name: "Lexus", logo: lexusLogo },
  { name: "Kia", logo: kiaLogo },
  { name: "Jeep", logo: jeepLogo },
  { name: "Chrysler", logo: chryslerLogo },
  { name: "Ford", logo: fordLogo },
];

// duplicated so the marquee track can loop seamlessly
const track = [...brands, ...brands];

export default function BrandsSection() {
  return (
    <section
      className="relative overflow-hidden bg-black py-16 lg:py-24"
      style={{
        backgroundImage:
          "radial-gradient(120% 55% at 100% 100%, rgba(228,0,0,0.45) 0%, rgba(228,0,0,0) 15%), linear-gradient(90deg, #000000 0%, #050000 40%, #200000 65%, #5a0000 85%, #8a0000 100%)",
      }}
    >
      <div className="relative z-10 mx-auto flex max-w-[702px] flex-col items-center gap-3 px-4 text-center sm:px-6">
        <p className="font-poppins text-base font-normal leading-none text-[#E40000]">
          Brands
        </p>
        <h2 className="font-poppins text-[28px] font-semibold leading-none text-white sm:text-[32px] lg:text-[36px]">
          All Major Car Brands Covered
        </h2>
        <p className="font-poppins text-base font-normal leading-relaxed text-[#878787]">
          We service a wide range of leading automobile brands, providing
          expert care, maintenance, and repairs for every vehicle make and
          model.
        </p>
      </div>

      {/* MARQUEE AREA — full width, no side padding */}
      <div className="relative z-10 mt-14 lg:mt-16">
        {/* LEFT EXTERNAL RED SHADOW — nudged down from center */}
        <div
          className="pointer-events-none absolute left-[-80px] top-[58%] z-20 h-[180px] w-[220px] -translate-y-1/2 rounded-full bg-[#8a0000] opacity-70 blur-[70px]"
        />
        {/* RIGHT EXTERNAL RED SHADOW */}
        <div
          className="pointer-events-none absolute right-[-80px] top-1/2 z-20 h-[180px] w-[220px] -translate-y-1/2 rounded-full bg-[#8a0000] opacity-70 blur-[70px]"
        />

        {/* ACTUAL MARQUEE CONTAINER */}
        <div className="relative overflow-hidden">
          <div
            className="flex w-max items-center gap-6 sm:gap-8 lg:gap-10"
            style={{ animation: "brands-marquee-scroll 16s linear infinite" }}
          >
            {track.map((brand, i) => (
              <div
                key={`${brand.name}-${i}`}
                className="flex h-[90px] w-[160px] shrink-0 items-center justify-center rounded-[20px] sm:h-[110px] sm:w-[210px] lg:h-[133px] lg:w-[277px]"
              >
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  className="h-auto max-h-[60%] w-auto max-w-[70%] object-contain"
                />
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