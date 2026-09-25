"use client";

import api from "@/lib/axios";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

// Fallback images
import cleanCar from "../../../public/images/cleancar.png";
import dustyCar from "../../../public/images/defender.png";
import halfCleanCar from "../../../public/images/haldfclean.png";

// ================= TYPES =================

interface DescriptionSegment {
  text: string;
  highlight: boolean;
}

interface HomeAboutApiResponse {
  _id: string;
  sectionLabel: string;
  title: string;
  description: DescriptionSegment[];
  image: string;
  imageTwo: string;
  imageThree: string;
  buttonText: string;
  buttonLink: string;
  isActive: boolean;
}

interface AboutHeroData {
  sectionLabel: string;
  title: string;
  description: DescriptionSegment[];
  image: string;
  imageTwo: string;
  imageThree: string;
  buttonText: string;
  buttonLink: string;
}

const DEFAULT_DATA: AboutHeroData = {
  sectionLabel: "About Us",
  title: "About MT Auto Zone",
  description: [
    { text: "MT Auto Zone", highlight: true },
    {
      text: " is a professional car care and detailing service provider based in Dubai, dedicated to improving the appearance, cleanliness and protection of the cars.",
      highlight: false,
    },
  ],
  image: "",
  imageTwo: "",
  imageThree: "",
  buttonText: "View More",
  buttonLink: "/about",
};

// ================= HELPERS =================

function normalizeSegments(
  segments: DescriptionSegment[],
): DescriptionSegment[] {
  if (segments.length === 0) return [];

  return segments.map((seg, idx) => {
    let text = seg.text ?? "";

    if (idx > 0) {
      const prevText = segments[idx - 1]?.text ?? "";
      const prevEndsWithSpace = /\s$/.test(prevText);
      const currentStartsWithSpace = /^\s/.test(text);

      if (!prevEndsWithSpace && !currentStartsWithSpace && text.length > 0) {
        text = " " + text;
      }
    }

    return { ...seg, text };
  });
}

// ================= COMPONENT =================

export default function AboutSection() {
  const barRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<AboutHeroData>(DEFAULT_DATA);
  const [isLoading, setIsLoading] = useState(true);

  const [handlePosition, setHandlePosition] = useState(100);
  const [isDragging, setIsDragging] = useState(false);
  const [isHoveringCar, setIsHoveringCar] = useState(false);

  // ---- Fetch about data ----
  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await api.get<
          HomeAboutApiResponse | HomeAboutApiResponse[]
        >("/home-about");

        let apiData: HomeAboutApiResponse | null = null;
        if (Array.isArray(res.data)) {
          apiData = res.data.length > 0 ? res.data[0] : null;
        } else if (res.data && typeof res.data === "object") {
          apiData = res.data;
        }

        if (!apiData) {
          setData(DEFAULT_DATA);
          return;
        }

        const rawDescription =
          apiData.description?.length > 0
            ? apiData.description
            : DEFAULT_DATA.description;

        setData({
          sectionLabel: apiData.sectionLabel || DEFAULT_DATA.sectionLabel,
          title: apiData.title || DEFAULT_DATA.title,
          description: normalizeSegments(rawDescription),
          image: apiData.image || "",
          imageTwo: apiData.imageTwo || "",
          imageThree: apiData.imageThree || "",
          buttonText: apiData.buttonText || DEFAULT_DATA.buttonText,
          buttonLink: apiData.buttonLink || DEFAULT_DATA.buttonLink,
        });
      } catch (err) {
        console.error("Failed to fetch home about:", err);
        setData(DEFAULT_DATA);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAbout();
  }, []);

  // ---- Drag handlers ----
  const updatePositionFromClientX = useCallback((clientX: number) => {
    const rect = barRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = clientX - rect.left;
    const pct = Math.min(100, Math.max(0, (x / rect.width) * 100));
    setHandlePosition(pct);
  }, []);

  const handleBarMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    updatePositionFromClientX(e.clientX);
  };

  useEffect(() => {
    if (!isDragging) return;
    const onMouseMove = (e: MouseEvent) =>
      updatePositionFromClientX(e.clientX);
    const onMouseUp = () => setIsDragging(false);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging, updatePositionFromClientX]);

  const handleBarTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
    updatePositionFromClientX(e.touches[0].clientX);
  };

  useEffect(() => {
    if (!isDragging) return;
    const onTouchMove = (e: TouchEvent) =>
      updatePositionFromClientX(e.touches[0].clientX);
    const onTouchEnd = () => setIsDragging(false);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [isDragging, updatePositionFromClientX]);

  const revealProgress = 100 - handlePosition;
  const halfCleanReveal = Math.min(revealProgress * 2, 100);


  const cleanReveal = revealProgress > 50 ? revealProgress : 0;

  const showLight = isHoveringCar && !isDragging;

  // Render rich description segments
  const renderDescription = () =>
    data.description.map((seg, idx) =>
      seg.highlight ? (
        <span key={idx} className="text-[#E40000]">
          {seg.text}
        </span>
      ) : (
        <span key={idx}>{seg.text}</span>
      ),
    );

  // Image sources (API or fallback)
  const beforeImage = data.image || dustyCar;
  const midwayImage = data.imageTwo || halfCleanCar;
  const afterImage = data.imageThree || cleanCar;

  // Detect if we're using API URLs (strings) or static imports
  const isBeforeRemote = typeof beforeImage === "string";
  const isMidwayRemote = typeof midwayImage === "string";
  const isAfterRemote = typeof afterImage === "string";

  return (
    <section className="relative mx-auto w-full max-w-[1920px] overflow-hidden py-10">
      <div className="relative z-10 mx-auto flex max-w-[1464px] flex-col items-center gap-10 px-4 sm:px-6 lg:flex-row lg:items-center lg:gap-16">
        {/* LEFT CONTENT */}
        <div className="flex w-full max-w-[631px] flex-col gap-3.5 text-center lg:text-left">
          {isLoading ? (
            <>
              <div className="mx-auto h-4 w-20 animate-pulse rounded-md bg-white/10 lg:mx-0" />
              <div className="mx-auto h-8 w-3/4 animate-pulse rounded-md bg-white/10 lg:mx-0" />
              <div className="h-4 w-full animate-pulse rounded-md bg-white/10" />
              <div className="h-4 w-full animate-pulse rounded-md bg-white/10" />
              <div className="h-4 w-2/3 animate-pulse rounded-md bg-white/10" />
            </>
          ) : (
            <>
              <p className="font-poppins text-base font-normal leading-none text-[#E40000]">
                {data.sectionLabel}
              </p>
              <h2 className="font-poppins text-[26px] font-semibold leading-tight text-white sm:text-[30px] lg:text-[36px] lg:leading-[100%]">
                {data.title}
              </h2>
              <p className="font-poppins text-base font-normal leading-[150%] text-[#cfcfcf] break-words">
                {renderDescription()}
              </p>

              {data.buttonText && (
                <a
                  href={data.buttonLink}
                  className="
                    group
                    mx-auto mt-4 flex w-fit items-center gap-2
                    rounded-[19px] border border-[#E400002B] bg-[#FFFFFF24]
                    px-6 py-3
                    font-poppins text-sm font-medium text-white
                    shadow-[0_3px_4px_rgba(0,0,0,0.35)]
                    transition-[background,box-shadow]
                    duration-300 ease-out
                    hover:bg-[linear-gradient(135deg,#4A2929_0%,#572C2C_25%,#8B2525_55%,#C91A1A_78%,#E00000_100%)]
                    hover:shadow-[0_7px_6px_rgba(0,0,0,0.55)]
                    lg:mx-0
                  "
                >
                  {data.buttonText}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="transition-transform duration-300 ease-out group-hover:rotate-[45deg]"
                  >
                    <path
                      d="M7 17L17 7M17 7H8M17 7V16"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              )}
            </>
          )}
        </div>

        {/* RIGHT — BEFORE / AFTER SLIDER */}
        <div className="w-full max-w-[940px]">
          <div
            onMouseEnter={() => setIsHoveringCar(true)}
            onMouseLeave={() => setIsHoveringCar(false)}
            className="relative aspect-[940/520] w-full select-none bg-black"
          >
            {/* Triangular light beam on hover */}
            <div
              aria-hidden
              className={`pointer-events-none absolute right-1/2 top-1/2 z-0 hidden w-[1200px] -translate-y-1/2 transition-opacity duration-700 ease-out [@media(hover:hover)]:block ${
                showLight ? "opacity-100" : "opacity-0"
              }`}
              style={{
                height: "170%",
                background:
                  "linear-gradient(270deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.14) 40%, rgba(255,255,255,0) 100%)",
                clipPath: "polygon(100% 50%, 0% 0%, 0% 100%)",
                mixBlendMode: "screen",
              }}
            />

            {/* Before image (bottom layer) */}
            {isBeforeRemote ? (
              <Image
                src={beforeImage}
                alt="MT Auto Zone — before detailing"
                fill
                unoptimized
                priority
                sizes="(max-width: 1024px) 100vw, 940px"
                className="object-contain object-center"
                draggable={false}
              />
            ) : (
              <Image
                src={beforeImage}
                alt="MT Auto Zone — before detailing"
                fill
                priority
                className="object-contain object-center"
                draggable={false}
              />
            )}

            {/* Midway image (clipped reveal) */}
           
            <div
              className="absolute inset-0 transition-[clip-path] duration-75 ease-out"
              style={{ clipPath: `inset(0 0 0 ${100 - halfCleanReveal}%)` }}
            >
              {isMidwayRemote ? (
                <Image
                  src={midwayImage}
                  alt="MT Auto Zone — halfway detailed"
                  fill
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 940px"
                  className="object-contain object-center"
                  draggable={false}
                />
              ) : (
                <Image
                  src={midwayImage}
                  alt="MT Auto Zone — halfway detailed"
                  fill
                  className="object-contain object-center"
                  draggable={false}
                />
              )}
            </div>

            {/* After image (clipped reveal) */}
            
            <div
              className="absolute inset-0 transition-[clip-path] duration-75 ease-out"
              style={{ clipPath: `inset(0 0 0 ${100 - cleanReveal}%)` }}
            >
              {isAfterRemote ? (
                <Image
                  src={afterImage}
                  alt="MT Auto Zone — after detailing"
                  fill
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 940px"
                  className="object-contain object-center"
                  draggable={false}
                />
              ) : (
                <Image
                  src={afterImage}
                  alt="MT Auto Zone — after detailing"
                  fill
                  className="object-contain object-center"
                  draggable={false}
                />
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div
            ref={barRef}
            onMouseDown={handleBarMouseDown}
            onTouchStart={handleBarTouchStart}
            className="relative mt-6 h-[3px] w-full cursor-pointer rounded-full bg-white/15 py-3"
          >
            <div className="absolute left-0 top-1/2 h-[3px] w-full -translate-y-1/2 rounded-full bg-white/15" />
            <div
              className="absolute left-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-white/70 transition-[width] duration-75 ease-out"
              style={{ width: `${revealProgress}%` }}
            />
            <div
              className="absolute top-1/2 flex h-6 w-9 -translate-y-1/2 cursor-grab items-center justify-center rounded-full bg-[#E40000] text-white shadow-[0_0_12px_rgba(228,0,0,0.6)] transition-[left] duration-75 ease-out active:cursor-grabbing"
              style={{
                left: `clamp(0px, calc(${handlePosition}% - 18px), calc(100% - 36px))`,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M11 17l-5-5 5-5M18 17l-5-5 5-5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}