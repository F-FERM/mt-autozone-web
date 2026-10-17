"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import api from "@/lib/axios";

// Fallback image
import about1 from "../../../public/images/road.jpg";

// ================= TYPES =================

interface DescriptionSegment {
  text: string;
  highlight: boolean;
}

interface WorksPageApiResponse {
  _id: string;
  sectionLabel: string;
  title: string;
  description: DescriptionSegment[];
  heroImage: string;
  buttonText: string;
  buttonLink: string;
  works: unknown[];
  isActive: boolean;
}

interface HeroData {
  sectionLabel: string;
  title: string;
  description: DescriptionSegment[];
  heroImage: string;
  buttonText: string;
  buttonLink: string;
}

const defaultHeroData: HeroData = {
  sectionLabel: "Our Works",
  title: "Completed Projects & Vehicle Transformations",
  description: [
    { text: "At ", highlight: false },
    { text: "M.T. Autozone", highlight: true },
    {
      text: ", every completed project reflects our commitment to quality, precision, and professional car care.",
      highlight: false,
    },
  ],
  heroImage: "",
  buttonText: "View Works",
  buttonLink: "/works",
};

// Anchor target for the projects grid rendered below this hero on the same page.
const PROJECTS_GRID_ID = "our-works-projects";

// ================= COMPONENT =================

export default function OurWorks() {
  const [data, setData] = useState<HeroData>(defaultHeroData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const res = await api.get<
          WorksPageApiResponse | WorksPageApiResponse[]
        >("/works-page");

        let apiData: WorksPageApiResponse | null = null;
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
          heroImage: apiData.heroImage || "",
          buttonText: apiData.buttonText || defaultHeroData.buttonText,
          buttonLink: apiData.buttonLink || defaultHeroData.buttonLink,
        });
      } catch (err) {
        console.error("Failed to fetch works page hero:", err);
        setData(defaultHeroData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorks();
  }, []);

  // Render rich description segments
  const renderDescription = () =>
    data.description.map((seg, idx) =>
      seg.highlight ? (
        <span key={idx} className="text-[#E40000]">
          {""} {seg.text} {""}
        </span>
      ) : (
        <span key={idx}>{seg.text}</span>
      ),
    );

  const handleViewWorksClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById(PROJECTS_GRID_ID);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="bg-black">
      <section
        className="
          relative w-full overflow-hidden
          bg-black isolate
        "
      >
        {/* Red glow bleeding in from the right */}
        <div
          aria-hidden
          className="
            pointer-events-none absolute inset-0 z-0
            bg-[radial-gradient(ellipse_60%_100%_at_100%_0%,rgba(228,0,0,0.65)_0%,rgba(228,0,0,0.25)_45%,transparent_75%)]
          "
        />

        {/* Bottom hand-off glow */}
        <div
          aria-hidden
          className="
            pointer-events-none absolute inset-x-0 bottom-0 z-[1]
            h-40 sm:h-48 md:h-86
            bg-[radial-gradient(ellipse_50%_100%_at_10%_100%,rgba(228,0,0,0.5)_0%,rgba(228,0,0,0.2)_40%,transparent_75%)]
          "
        />

        <div
          className="
            relative z-10
            flex flex-col
            pt-8 sm:pt-12 md:pt-14 lg:pt-16 xl:pt-24
            pb-14 sm:pb-20 md:pb-28 lg:pb-10
            w-full max-w-[1464px] mx-auto
            px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12
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
            {/* Image — height slightly increased */}
            <div
              className="
                relative w-full
                h-[195px] sm:h-[260px] md:h-[295px] lg:h-[320px]
                lg:flex-1 lg:max-w-[722px]
                flex-shrink-0
                rounded-2xl lg:rounded-[20px] overflow-hidden
              "
            >
              {data.heroImage ? (
                <Image
                  src={data.heroImage}
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
              {/* Left-side blend */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 z-10 w-1/3
                  bg-gradient-to-r from-black via-black/60 to-transparent"
              />
            </div>

            {/* Paragraph + button column */}
            <div
              className="
                flex min-w-0 flex-col
                w-full lg:flex-1 lg:max-w-[719px]
              "
            >
              {isLoading ? (
                <div className="space-y-2">
                  <div className="h-4 w-full animate-pulse rounded-md bg-white/10" />
                  <div className="h-4 w-full animate-pulse rounded-md bg-white/10" />
                  <div className="h-4 w-2/3 animate-pulse rounded-md bg-white/10" />
                </div>
              ) : (
                <p
                  className="
                    font-poppins font-normal
                    text-sm sm:text-[15px] lg:text-[16px]
                    leading-relaxed lg:leading-normal
                    tracking-normal
                    text-[#C0C0C0]
                    w-full break-words
                  "
                >
                  {renderDescription()}
                </p>
              )}

              {/* View Works button — smooth-scrolls to the projects grid below */}
              {!isLoading && data.buttonText && (
                <a
                  href={`#${PROJECTS_GRID_ID}`}
                  onClick={handleViewWorksClick}
                  className="
                    group relative overflow-hidden
                    mx-auto mt-5 sm:mt-6 lg:mt-8
                    flex w-fit max-w-full shrink-0 items-center justify-center
                    h-11 sm:h-[50px] lg:h-[55px]
                    min-w-[170px] sm:min-w-[200px] lg:min-w-[221px]
                    gap-2 sm:gap-[13px]
                    px-6 sm:px-8 lg:px-[40px]
                    py-3 lg:py-[17px]
                    rounded-[19px]
                    border border-[#E400002B]
                    text-sm sm:text-base lg:text-[18px]
                    bg-[#FFFFFF24]
                    font-poppins font-medium leading-none text-white
                    shadow-[0_3px_4px_rgba(0,0,0,0.35)]
                    transition-[box-shadow,border-color] duration-300 ease-out
                    hover:border-transparent
                    hover:shadow-[0_7px_6px_rgba(0,0,0,0.55)]
                    lg:mx-0
                  "
                >
                  {/* Hover gradient layer */}
                  <span
                    aria-hidden
                    className="
                      pointer-events-none absolute -inset-px rounded-[19px]
                      opacity-0 group-hover:opacity-100
                      transition-opacity duration-300 ease-out
                      bg-[radial-gradient(ellipse_70%_120%_at_0%_100%,#4a1f1f_0%,rgba(74,31,31,0.85)_30%,rgba(74,31,31,0.45)_55%,rgba(74,31,31,0)_85%),linear-gradient(90deg,#8a2e2e_0%,#b02222_40%,#d10c0c_75%,#e00000_100%)]
                    "
                  />

                  <span className="relative z-10 flex items-center gap-2 sm:gap-[13px]">
                    <span className="whitespace-nowrap">{data.buttonText}</span>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-5 w-5 shrink-0 transition-transform duration-300 ease-out group-hover:rotate-[45deg] lg:h-6 lg:w-6"
                    >
                      <path
                        d="M7 17L17 7M17 7H8M17 7V16"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}