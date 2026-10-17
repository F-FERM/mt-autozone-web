"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUp } from "lucide-react";

import api from "@/lib/axios";

import instagramIcon from "../../../public/images/insta.png";
import facebookIcon from "../../../public/images/fb.png";
import twitterIcon from "../../../public/images/twitter.png";
import whatsappIcon from "../../../public/images/whatsapp.png";

// ================= TYPES =================

interface FooterLink {
  _id?: string;
  title: string;
  link: string;
  order: number;
  isActive: boolean;
}

interface FooterSocialLink {
  _id?: string;
  name: string;
  icon: string; // "instagram" | "facebook" | "x" | "whatsapp" | ...
  link: string;
  order: number;
  isActive: boolean;
}

interface FooterData {
  _id: string;
  addressTitle: string;
  address: string;
  servicesTitle: string;
  services: FooterLink[];
  companyTitle: string;
  companyLinks: FooterLink[];
  contactTitle: string;
  phone: string;
  email: string;
  salesEmail: string;
  socialLinks: FooterSocialLink[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ================= FALLBACKS =================

const FALLBACK_DATA: FooterData = {
  _id: "fallback",
  addressTitle: "Address",
  address:
    "MT Autozone Address: 18th B St - Umm Ramool - Dubai - United Arab Emirates",
  servicesTitle: "Services",
  services: [
    { title: "Interior Cleaning & Detailing", link: "/services", order: 0, isActive: true },
    { title: "Paint Care & Protection", link: "/services", order: 1, isActive: true },
    { title: "Ceramic Coating", link: "/services", order: 2, isActive: true },
    { title: "Headlight Restoration", link: "/services", order: 3, isActive: true },
    { title: "Waterless Car Wash", link: "/services", order: 4, isActive: true },
    { title: "Paint Protection Film", link: "/services", order: 5, isActive: true },
  ],
  companyTitle: "Company",
  companyLinks: [
    { title: "Home", link: "/", order: 0, isActive: true },
    { title: "About", link: "/about", order: 1, isActive: true },
    { title: "Services", link: "/services", order: 2, isActive: true },
    { title: "Works", link: "/works", order: 3, isActive: true },
    { title: "Contact Us", link: "/contact", order: 4, isActive: true },
  ],
  contactTitle: "Contact",
  phone: "+971 55 169 6443",
  email: "dd@gmail.com",
  salesEmail: "fyudfddb@gmail.com",
  socialLinks: [
    { name: "Instagram", icon: "instagram", link: "#", order: 0, isActive: true },
    { name: "Facebook", icon: "facebook", link: "#", order: 1, isActive: true },
    { name: "X", icon: "x", link: "#", order: 2, isActive: true },
    { name: "WhatsApp", icon: "whatsapp", link: "#", order: 3, isActive: true },
  ],
  isActive: true,
};

// ================= ICON MAP =================

/**
 * Maps the icon key stored in the API (e.g., "instagram", "x") to the
 * locally bundled image. Keep keys lowercase & trimmed.
 */
const ICON_MAP: Record<string, typeof instagramIcon> = {
  instagram: instagramIcon,
  facebook: facebookIcon,
  twitter: twitterIcon,
  x: twitterIcon, // X uses the same asset as twitter here
  whatsapp: whatsappIcon,
};

function resolveIcon(icon: string | undefined) {
  if (!icon) return null;
  return ICON_MAP[icon.trim().toLowerCase()] ?? null;
}

// ================= HELPERS =================

/** Sort by `order`, then filter by `isActive`. */
function activeSorted<T extends { order: number; isActive: boolean }>(
  arr: T[] | undefined,
): T[] {
  if (!Array.isArray(arr)) return [];
  return [...arr]
    .filter((x) => x.isActive !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

// ================= SHARED CLASSES =================

/* Column heading. `capitalize` fixes API values like "company" -> "Company" */
const HEADING_CLASSES =
  "font-poppins text-xl font-normal capitalize leading-tight text-[#DDDDDD] sm:text-[28px] sm:leading-none lg:text-[36px]";

/* Column wrapper: gap UNDER the heading */
const COLUMN_CLASSES = "flex w-full flex-col gap-5 sm:gap-7 lg:gap-8";

/* List wrapper: gap BETWEEN the points */
const LIST_CLASSES = "flex flex-col gap-4 sm:gap-[22px] lg:gap-6";

const LINK_CLASSES =
  "font-poppins text-sm font-normal leading-snug text-[#878787] transition-colors duration-300 hover:text-white sm:text-base sm:leading-none";

/* Contact lines: always stay on ONE line from sm up */
const CONTACT_LINK_CLASSES =
  "font-poppins text-sm font-normal leading-snug text-[#878787] transition-colors duration-300 hover:text-white break-words sm:whitespace-nowrap sm:text-base sm:leading-none";

// ================= COMPONENT =================

export default function Footer() {
  const [data, setData] = useState<FooterData>(FALLBACK_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchFooter = async () => {
      try {
        const res = await api.get<FooterData | FooterData[]>("/footer");
        const payload = Array.isArray(res.data) ? res.data[0] : res.data;

        if (!cancelled && payload && payload.isActive !== false) {
          // Merge with fallback defaults so any missing field is safe
          setData({
            ...FALLBACK_DATA,
            ...payload,
            services: payload.services ?? [],
            companyLinks: payload.companyLinks ?? [],
            socialLinks: payload.socialLinks ?? [],
          });
        }
      } catch {
        // Silently keep the fallback data — footer should never block the page
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchFooter();
    return () => {
      cancelled = true;
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // If the section is explicitly turned off in the CMS, don't render anything
  if (!loading && data.isActive === false) return null;

  const services = activeSorted(data.services);
  const companyLinks = activeSorted(data.companyLinks);
  const socials = activeSorted(data.socialLinks);

  // Split phone/email labels (API stores raw values)
  const phoneDigits = (data.phone || "").replace(/\D/g, "");

  return (
    <footer className="w-full bg-[#1D1D1D] px-5 pb-8 pt-10 sm:px-8 sm:pt-12 md:px-10 md:pt-14 lg:px-20 lg:pt-16">
      <div className="mx-auto flex max-w-[1760px] flex-col gap-6">
        {/* GET STARTED NOW */}
        <div className="flex flex-col items-start justify-between gap-6 sm:gap-8 lg:flex-row lg:items-center">
          <div className="flex w-full max-w-[573px] flex-col gap-3">
            <h2 className="mb-2 font-poppins text-2xl font-semibold leading-tight text-white sm:mb-4 sm:text-[28px] md:text-[32px] lg:text-[36px] lg:leading-none">
              Get Started Now
            </h2>
            <p className="font-poppins text-sm font-normal leading-[150%] text-[#878787] sm:text-base">
              Get started with our expert team today for premium automotive
              protection, precision detailing, and long-lasting care tailored
              to your vehicle.
            </p>
          </div>

          <div className="mb-4 flex w-full shrink-0 items-center justify-between gap-4 sm:mb-8 sm:w-auto sm:justify-start">
            {/* GET QUOTE — same hover style as the Navbar Contact button */}
            <Link
              href="/contact-us"
              className="
                group relative overflow-hidden
                flex shrink-0 items-center justify-center
                rounded-[19px]
                border border-[#E4000038]
                bg-[#FFFFFF24]
                px-5 py-2.5 sm:px-6 sm:py-3
                font-poppins text-sm font-medium text-white sm:text-base
                shadow-[0_3px_4px_rgba(0,0,0,0.35)]
                transition-[box-shadow,border-color] duration-300 ease-out
                hover:border-transparent
                hover:shadow-[0_7px_6px_rgba(0,0,0,0.55)]
              "
            >
              {/* Hover gradient layer (same as Contact button) */}
              <span
                aria-hidden
                className="
                  pointer-events-none absolute -inset-px rounded-[19px]
                  opacity-0 group-hover:opacity-100
                  transition-opacity duration-300 ease-out
                  bg-[radial-gradient(ellipse_70%_120%_at_0%_100%,#4a1f1f_0%,rgba(74,31,31,0.85)_30%,rgba(74,31,31,0.45)_55%,rgba(74,31,31,0)_85%),linear-gradient(90deg,#8a2e2e_0%,#b02222_40%,#d10c0c_75%,#e00000_100%)]
                "
              />

              <span className="relative z-10 flex items-center gap-2 sm:gap-3">
                Get Quote
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  className="h-[18px] w-[18px] shrink-0 -rotate-45 transition-transform duration-300 ease-out group-hover:rotate-0 sm:h-5 sm:w-5"
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
            </Link>

            {/* SCROLL TO TOP — bigger button, bigger arrow, bigger float */}
            <button
              onClick={scrollToTop}
              aria-label="Scroll to top"
              className="footer-float flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#2A2A2A] text-white transition-colors duration-300 hover:bg-[#E40000] sm:h-14 sm:w-14 lg:h-16 lg:w-16"
            >
              <ArrowUp
                strokeWidth={2}
                className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8"
              />
            </button>
          </div>
        </div>

        <div className="h-px w-full bg-white/10" />

        {/* ADDRESS / SERVICES / COMPANY / CONTACT */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-12 lg:flex lg:flex-row lg:justify-between lg:gap-8">
          {/* ADDRESS — wider */}
        {/* ADDRESS — slightly narrower */}
<div className={`${COLUMN_CLASSES} lg:max-w-[350px] xl:max-w-[400px]`}>
            <h3 className={HEADING_CLASSES}>
              {data.addressTitle || "Address"}
            </h3>
            <p className="font-poppins text-sm font-normal leading-[150%] text-[#878787] sm:text-base">
              {data.address}
            </p>

            {socials.length > 0 && (
              <div className="mt-1 flex items-center gap-5 sm:mt-2 sm:gap-[27px]">
                {socials.map((s) => {
                  const icon = resolveIcon(s.icon);
                  if (!icon) return null;
                  return (
                    <Link
                      key={s._id || s.name}
                      href={s.link || "#"}
                      target={s.link?.startsWith("http") ? "_blank" : undefined}
                      rel={
                        s.link?.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      aria-label={s.name}
                      className="flex h-[26px] w-[26px] shrink-0 items-center justify-center transition-opacity duration-300 hover:opacity-70 sm:h-[30px] sm:w-[30px]"
                    >
                      <Image
                        src={icon}
                        alt={s.name}
                        width={30}
                        height={30}
                        className="h-full w-full object-contain"
                      />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* SERVICES */}
          {services.length > 0 && (
            <div className={`${COLUMN_CLASSES} lg:max-w-[248px]`}>
              <h3 className={HEADING_CLASSES}>
                {data.servicesTitle || "Services"}
              </h3>
              <ul className={LIST_CLASSES}>
                {services.map((service) => (
                  <li
                    key={service._id || service.title}
                    className="flex items-start gap-2.5"
                  >
                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[#878787]" />
                    <Link
                      href={service.link || "/services"}
                      className={LINK_CLASSES}
                    >
                      {service.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* COMPANY */}
          {companyLinks.length > 0 && (
            <div className={`${COLUMN_CLASSES} lg:max-w-[248px]`}>
              <h3 className={HEADING_CLASSES}>
                {data.companyTitle || "Company"}
              </h3>
              <ul className={LIST_CLASSES}>
                {companyLinks.map((link) => (
                  <li
                    key={link._id || link.title}
                    className="flex items-start gap-2.5"
                  >
                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[#878787]" />
                    <Link href={link.link || "/"} className={LINK_CLASSES}>
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CONTACT */}
          <div className={`${COLUMN_CLASSES} lg:w-auto`}>
            <h3 className={HEADING_CLASSES}>
              {data.contactTitle || "Contact"}
            </h3>
            <div className={LIST_CLASSES}>
              {data.phone && (
                <a
                  href={`tel:${phoneDigits ? `+${phoneDigits}` : ""}`}
                  className={CONTACT_LINK_CLASSES}
                >
                  Phone: {data.phone}
                </a>
              )}
              {data.email && (
                <a
                  href={`mailto:${data.email}`}
                  className={CONTACT_LINK_CLASSES}
                >
                  Email: {data.email}
                </a>
              )}
              {data.salesEmail && (
                <a
                  href={`mailto:${data.salesEmail}`}
                  className={CONTACT_LINK_CLASSES}
                >
                 For Sales: {data.salesEmail}
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-white/10" />

        {/* COPYRIGHT / LEGAL LINKS */}
        <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
          <p className="font-poppins text-xs font-normal leading-none text-[#878787] sm:text-sm md:text-base">
            Copyright © 2026 MT Auto Zone. All rights reserved.
          </p>
          <div className="flex items-center gap-2 font-poppins text-xs font-normal leading-none text-[#878787] sm:text-sm md:text-base">
            <Link
              href="/privacy"
              className="transition-colors duration-300 hover:text-white"
            >
              Privacy Policy
            </Link>
            <span>|</span>
            <Link
              href="/terms"
              className="transition-colors duration-300 hover:text-white"
            >
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes footer-arrow-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-16px); }
        }
        .footer-float {
          animation: footer-arrow-float 2.2s ease-in-out infinite;
        }
        .footer-float:hover {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .footer-float {
            animation: none !important;
          }
        }
      `}</style>
    </footer>
  );
}