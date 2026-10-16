"use client";

import api from "@/lib/axios";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

// Fallback images
import cleanCar from "../../../public/images/cleancar.png";
import dustyCar from "../../../public/images/defender.png";
import halfCleanCar from "../../../public/images/haldfclean.png";
// Designer's lit car image (headlight on)
import dustyCarLit from "../../../public/images/aboutlightedcar.png";

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

// Solid-pixel bounds of the car inside an image, as fractions (0-1) of that image
interface Bounds {
  x: number;
  y: number;
  w: number;
  h: number;
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

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// Finds the box around the solid (non-glow) pixels of an image.
function getSolidBounds(img: HTMLImageElement, alphaThreshold: number): Bounds {
  const scale = Math.min(1, 600 / img.naturalWidth);
  const cw = Math.max(1, Math.round(img.naturalWidth * scale));
  const ch = Math.max(1, Math.round(img.naturalHeight * scale));

  const canvas = document.createElement("canvas");
  canvas.width = cw;
  canvas.height = ch;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("No canvas context");
  ctx.drawImage(img, 0, 0, cw, ch);

  const { data } = ctx.getImageData(0, 0, cw, ch);
  let minX = cw;
  let minY = ch;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < ch; y++) {
    for (let x = 0; x < cw; x++) {
      if (data[(y * cw + x) * 4 + 3] >= alphaThreshold) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (maxX < 0) throw new Error("No solid pixels found");

  return {
    x: minX / cw,
    y: minY / ch,
    w: (maxX - minX + 1) / cw,
    h: (maxY - minY + 1) / ch,
  };
}

// ================= COMPONENT =================

export default function AboutSection() {
  const barRef = useRef<HTMLDivElement>(null);
  const carBoxRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const [data, setData] = useState<AboutHeroData>(DEFAULT_DATA);
  const [isLoading, setIsLoading] = useState(true);

  const [handlePosition, setHandlePosition] = useState(100);
  const [isDragging, setIsDragging] = useState(false);
  const [isHoveringCar, setIsHoveringCar] = useState(false);
  const [canShowLight, setCanShowLight] = useState(false);
  const [boxSize, setBoxSize] = useState({ w: 0, h: 0 });
  // Section size + where the car box sits inside the section (for the wide light beam)
  const [sectionInfo, setSectionInfo] = useState({ w: 0, h: 0, offX: 0, offY: 0 });

  // Measured car bounds (normal image + lit image). null = not measured, use fallback.
  const [align, setAlign] = useState<{
    normalW: number;
    normalH: number;
    normal: Bounds;
    lit: Bounds;
  } | null>(null);

  // Lit image is desktop + real-hover only (it spills over the text column)
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (hover: hover)");
    const update = () => setCanShowLight(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Measure the car box and the whole section
  useEffect(() => {
    const el = carBoxRef.current;
    const sec = sectionRef.current;
    if (!el) return;

    const update = () => {
      setBoxSize({ w: el.clientWidth, h: el.clientHeight });
      if (sec) {
        const a = sec.getBoundingClientRect();
        const b = el.getBoundingClientRect();
        setSectionInfo({
          w: sec.clientWidth,
          h: sec.clientHeight,
          offX: b.left - a.left,
          offY: b.top - a.top,
        });
      }
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    if (sec) ro.observe(sec);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

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

  // Lit image shows only while hovering and not dragging
  const showLight = canShowLight && isHoveringCar && !isDragging;

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

  // ---- Lit image alignment ----
  // We measure where the solid car is in the first image and in the lit image
  // (the soft transparent beam is ignored), then scale + place the lit image so
  // both cars sit on exactly the same spot.
  const LIT_ALPHA_THRESHOLD = 200; // 0-255. Pixels more opaque than this count as "car". Raise it if the beam is being counted as car.
  const LIT_NUDGE_X = 0; // % of the box width, + moves right, - moves left (only for tiny manual tweaks)
  const LIT_NUDGE_Y = 0; // % of the box height, + moves down, - moves up
  const LIT_DEBUG = false; // true = always show lit image at 50% over the normal car to check alignment

  // ---- Beam edge softening (removes the visible box edges) ----
  // The beam fades out smoothly toward the left / top / bottom edges of the lit
  // image, so no rectangle border is visible. The car itself is never faded.
  const BEAM_SOLID_PCT = 22; // % of the beam radius that stays fully visible. Lower = beam fades sooner.
  const BEAM_Y_ON_CAR = 0.35; // 0 = top of car, 1 = bottom. Vertical centre of the beam (headlight height).

  const beforeSrc =
    typeof beforeImage === "string" ? beforeImage : beforeImage.src;

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [normalImg, litImg] = await Promise.all([
          loadImage(beforeSrc),
          loadImage(dustyCarLit.src),
        ]);
        const normal = getSolidBounds(normalImg, LIT_ALPHA_THRESHOLD);
        const lit = getSolidBounds(litImg, LIT_ALPHA_THRESHOLD);
        if (!cancelled) {
          setAlign({
            normalW: normalImg.naturalWidth,
            normalH: normalImg.naturalHeight,
            normal,
            lit,
          });
        }
      } catch {
        // Could not measure (e.g. remote image blocks pixel access): use fallback placement
        if (!cancelled) setAlign(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [beforeSrc]);

  const litW = dustyCarLit.width;
  const litH = dustyCarLit.height;
  const normalW = align?.normalW ?? dustyCar.width;
  const normalH = align?.normalH ?? dustyCar.height;

  // Same fit the first image uses (object-contain, centered)
  const fitScale =
    boxSize.w > 0 && boxSize.h > 0
      ? Math.min(boxSize.w / normalW, boxSize.h / normalH)
      : 0;
  const normalLeft = (boxSize.w - normalW * fitScale) / 2;
  const normalTop = (boxSize.h - normalH * fitScale) / 2;

  let litRenderW = 0;
  let litRenderH = 0;
  let litLeft = 0;
  let litTop = 0;

  if (fitScale > 0) {
    if (align) {
      // Car box of the normal image, in px inside the container
      const nx = normalLeft + align.normal.x * normalW * fitScale;
      const ny = normalTop + align.normal.y * normalH * fitScale;
      const nw = align.normal.w * normalW * fitScale;
      const nh = align.normal.h * normalH * fitScale;

      // Scale the lit image so its car is the same size as the normal car
      const sx = nw / (align.lit.w * litW);
      const sy = nh / (align.lit.h * litH);
      const s = (sx + sy) / 2;

      litRenderW = litW * s;
      litRenderH = litH * s;
      // Place it so its car's top-left lands on the normal car's top-left
      litLeft = nx - align.lit.x * litW * s;
      litTop = ny - align.lit.y * litH * s;
    } else {
      // Fallback: same pixel scale as the normal image, right edge and vertical center aligned
      litRenderW = litW * fitScale;
      litRenderH = litH * fitScale;
      litLeft = normalLeft + normalW * fitScale - litRenderW;
      litTop = normalTop + (normalH * fitScale - litRenderH) / 2;
    }

    litLeft += (LIT_NUDGE_X / 100) * boxSize.w;
    litTop += (LIT_NUDGE_Y / 100) * boxSize.h;
  }

  // ---- Build the soft-edge mask for the lit image ----
  // Layer 1: a fully visible rectangle over the car (keeps the car untouched).
  // Layer 2: an elliptical fade centred on the headlight that reaches
  //          transparent at the left, top and bottom edges of the image.
  const litCar = align?.lit ?? { x: 0.5, y: 0.2, w: 0.5, h: 0.6 };
  const carPxX = litCar.x * litRenderW;
  const carPxY = litCar.y * litRenderH;
  const carPxW = Math.max(1, litRenderW - carPxX); // car to the right edge
  const carPxH = Math.max(1, litCar.h * litRenderH);

  const beamCx = carPxX; // beam starts at the front of the car
  const beamCy = carPxY + carPxH * BEAM_Y_ON_CAR;
  const beamRx = Math.max(1, beamCx);
  const beamRy = Math.max(1, Math.max(beamCy, litRenderH - beamCy));

  const litMask =
    litRenderW > 0
      ? [
        "linear-gradient(#000, #000)",
        `radial-gradient(${beamRx}px ${beamRy}px at ${beamCx}px ${beamCy}px, #000 0%, #000 ${BEAM_SOLID_PCT}%, transparent 100%)`,
      ].join(", ")
      : undefined;
  const litMaskSize = `${carPxW}px ${carPxH}px, 100% 100%`;
  const litMaskPosition = `${carPxX}px ${carPxY}px, 0 0`;

  // ---- Wide light beam across the whole section ----
  // A soft cone that starts at the headlight and widens to the far left end of
  // the section (over the text), like the design.
  const BEAM_OPACITY = 0.3; // brightness right at the headlight (0-1)
  const BEAM_END_OPACITY = 0.08; // brightness at the far left end (0-1)
  const BEAM_BLUR = 36; // px. Higher = softer edges
  const BEAM_START_HALF = 14; // px. Half-height of the beam at the headlight

  const beamReady = sectionInfo.w > 0 && fitScale > 0 && litRenderW > 0;
  const beamX = sectionInfo.offX + litLeft + carPxX; // headlight x inside section
  const beamY = sectionInfo.offY + litTop + beamCy; // headlight y inside section
  const beamClip = `polygon(${beamX}px ${beamY - BEAM_START_HALF}px, -120px -80px, -120px ${sectionInfo.h + 80}px, ${beamX}px ${beamY + BEAM_START_HALF}px)`;
  const beamBg = `linear-gradient(to right, rgba(255,255,255,${BEAM_END_OPACITY}) 0px, rgba(255,255,255,${BEAM_OPACITY}) ${beamX}px, transparent ${beamX}px)`;

  return (
    <section
      ref={sectionRef}
      className="relative mx-auto w-full max-w-[1920px] overflow-hidden py-10"
    >
      {/* Wide headlight beam: spreads from the car to the end of the section */}
      {beamReady && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300 ease-out"
          style={{
            opacity: showLight || LIT_DEBUG ? 1 : 0,
            filter: `blur(${BEAM_BLUR}px)`,
          }}
        >
          <div
            className="absolute inset-0"
            style={{ clipPath: beamClip, background: beamBg }}
          />
        </div>
      )}

      <div className="relative z-10 mx-auto flex max-w-[1464px] flex-col items-center gap-10 px-4 sm:px-6 lg:flex-row lg:items-center lg:gap-16">
        {/* LEFT CONTENT */}
        <div className="relative z-10 flex w-full max-w-[631px] flex-col gap-3.5 text-center lg:text-left">
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
            ref={carBoxRef}
            onMouseEnter={() => setIsHoveringCar(true)}
            onMouseLeave={() => setIsHoveringCar(false)}
            className="relative aspect-[940/520] w-full select-none"
          >
            {/* Normal car images (before / midway / after).
                Fully hidden while the lit image is showing, so only one car is visible. */}
            <div
              className={`absolute inset-0 ${showLight ? "invisible" : "visible"
                }`}
            >
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

            {/* Lit car image: scaled and placed so its car sits exactly on the normal car.
                A mask softens the beam edges so no box/border shows. */}
            {fitScale > 0 && (
              <Image
                src={dustyCarLit}
                alt=""
                aria-hidden
                priority
                draggable={false}
                className={`pointer-events-none absolute max-w-none ${showLight || LIT_DEBUG ? "visible" : "invisible"
                  }`}
                style={{
                  left: litLeft,
                  top: litTop,
                  width: litRenderW,
                  height: litRenderH,
                  opacity: LIT_DEBUG ? 0.5 : 1,
                  WebkitMaskImage: litMask,
                  maskImage: litMask,
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                  WebkitMaskSize: litMaskSize,
                  maskSize: litMaskSize,
                  WebkitMaskPosition: litMaskPosition,
                  maskPosition: litMaskPosition,
                }}
              />
            )}
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