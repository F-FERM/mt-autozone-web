"use client";

import api from "@/lib/axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import ContactForm from "../contact/ContactForm";

// Fallback images
import leftImageFallback from "../../../public/images/leftimage.jpg";
import rightImageFallback from "../../../public/images/rightimage.jpg";

// ================= TYPES =================

interface DescriptionSegment {
  text: string;
  highlight: boolean;
}

interface ContactBookingApi {
  _id: string;
  sectionLabel: string;
  title: string;
  description: DescriptionSegment[];
  backgroundImage: string;
  backgroundImageTwo: string;
  services?: unknown[];
  isActive: boolean;
}

interface ContactSectionData {
  sectionLabel: string;
  title: string;
  description: DescriptionSegment[];
  backgroundImage: string;
  backgroundImageTwo: string;
}

const DEFAULT_DATA: ContactSectionData = {
  sectionLabel: "Contact",
  title: "Connect With MT Auto Zone",
  description: [
    {
      text: "Looking for expert car care service? Book your appointment with ",
      highlight: false,
    },
    { text: "MT Auto Zone", highlight: true },
    {
      text: " today and experience professional care for your vehicle.",
      highlight: false,
    },
  ],
  backgroundImage: "",
  backgroundImageTwo: "",
};

// ================= HELPERS =================

function pickBookingEntry(data: unknown): ContactBookingApi | null {
  if (!data) return null;

  let list: ContactBookingApi[] = [];

  if (Array.isArray(data)) {
    list = data as ContactBookingApi[];
  } else if (typeof data === "object") {
    list = [data as ContactBookingApi];
  }

  if (list.length === 0) return null;

  const bookingEntry = list.find(
    (item) =>
      item &&
      typeof item === "object" &&
      typeof (item as ContactBookingApi).backgroundImage === "string" &&
      (item as ContactBookingApi).backgroundImage !== "" &&
      Array.isArray((item as ContactBookingApi).services),
  );

  return bookingEntry ?? null;
}


function normalizeSegments(
  segments: DescriptionSegment[],
): DescriptionSegment[] {
  if (segments.length === 0) return [];

  return segments.map((seg, idx) => {
    let text = seg.text ?? "";

    if (idx > 0) {
      const prev = segments[idx - 1];
      const prevText = prev?.text ?? "";
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

export default function ContactSection() {
  const [data, setData] = useState<ContactSectionData>(DEFAULT_DATA);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await api.get("/home-contact");
        
        const entry = pickBookingEntry(res.data);

        if (!entry) {
          setData(DEFAULT_DATA);
          return;
        }

        const rawDescription =
          entry.description?.length > 0
            ? entry.description
            : DEFAULT_DATA.description;

        setData({
          sectionLabel: entry.sectionLabel || DEFAULT_DATA.sectionLabel,
          title: entry.title || DEFAULT_DATA.title,
          description: normalizeSegments(rawDescription),
          backgroundImage: entry.backgroundImage || "",
          backgroundImageTwo: entry.backgroundImageTwo || "",
        });
      } catch (err) {
        console.error("Failed to fetch contact section:", err);
        setData(DEFAULT_DATA);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContact();
  }, []);

  // Render rich description with highlight spans
  const renderDescription = () =>
    data.description.map((seg, idx) =>
      seg.highlight ? (
        <span key={idx} className="text-[#E40000]">
          {""} {seg.text}{""}
        </span>
      ) : (
        <span key={idx}>{seg.text}</span>
      ),
    );

  return (
    <section className="relative overflow-hidden bg-black px-4 py-16 sm:px-6 lg:py-24">
      {/* LEFT IMAGE */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-0 hidden w-[60%] max-w-[1119px] md:block">
        {data.backgroundImage ? (
          <Image
            src={data.backgroundImage}
            alt=""
            fill
            unoptimized
            priority
            sizes="(min-width: 768px) 60vw, 0vw"
            className="object-cover"
          />
        ) : (
          <Image
            src={leftImageFallback}
            alt=""
            fill
            priority
            sizes="(min-width: 768px) 60vw, 0vw"
            className="object-cover"
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(270deg, #000000 0%, rgba(0,0,0,0) 197.36%)",
          }}
        />
      </div>

      {/* RIGHT IMAGE */}
      <div className="pointer-events-none absolute inset-y-0 right-0 z-0 hidden w-[45%] max-w-[746px] md:block">
        {data.backgroundImageTwo ? (
          <Image
            src={data.backgroundImageTwo}
            alt=""
            fill
            unoptimized
            priority
            sizes="(min-width: 768px) 45vw, 0vw"
            className="object-cover"
          />
        ) : (
          <Image
            src={rightImageFallback}
            alt=""
            fill
            priority
            sizes="(min-width: 768px) 45vw, 0vw"
            className="object-cover"
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, #000000 0%, rgba(0,0,0,0) 100%)",
          }}
        />
      </div>

      {/* mobile fallback */}
      <div className="absolute inset-0 z-0 bg-black md:hidden" />

      {/* section overlay */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[#00000080]" />

      {/* red glow */}
      <div
        className="pointer-events-none absolute right-0 top-1/2 z-0 h-[471px] w-[722px] max-w-full -translate-y-1/2 rounded-[30px] opacity-70 blur-[80px]"
        style={{
          background:
            "radial-gradient(60% 60% at 70% 50%, rgba(174,0,0,0.6) 0%, rgba(174,0,0,0) 100%)",
        }}
      />

      {/* CONTENT */}
      <div className="relative z-10 mx-auto flex max-w-[1464px] flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-[111px]">
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
              <p className="font-poppins text-base font-normal leading-relaxed text-[#878787] break-words">
                {renderDescription()}
              </p>
            </>
          )}
        </div>

        {/* RIGHT FORM CARD */}
        <ContactForm />
      </div>
    </section>
  );
}