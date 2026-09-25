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
            <Link
              href="/contact-us"
              className="
                group
                flex items-center gap-2
                rounded-[19px] border border-[#E400002B] bg-[#FFFFFF24]
                px-5 py-2.5 sm:px-6 sm:py-3
                font-poppins text-sm font-medium text-white
                shadow-[0_3px_4px_rgba(0,0,0,0.35)]
                transition-[background,box-shadow]
                duration-300 ease-out
                hover:bg-[linear-gradient(135deg,#4A2929_0%,#572C2C_25%,#8B2525_55%,#C91A1A_78%,#E00000_100%)]
                hover:shadow-[0_7px_6px_rgba(0,0,0,0.55)]
                sm:text-base
              "
            >
              Get Quote
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                className="-rotate-45 transition-transform duration-300 ease-out group-hover:rotate-0"
              >
                <path
                  d="M7 17L17 7M17 7H8M17 7V16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>

            <button
              onClick={scrollToTop}
              aria-label="Scroll to top"
              className="footer-float flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2A2A2A] text-white transition-colors duration-300 hover:bg-[#E40000] sm:h-12 sm:w-12"
            >
              <ArrowUp size={18} className="sm:hidden" />
              <ArrowUp size={20} className="hidden sm:block" />
            </button>
          </div>
        </div>

        <div className="h-px w-full bg-white/10" />

        {/* ADDRESS / SERVICES / COMPANY / CONTACT */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10 lg:flex lg:flex-row lg:justify-between lg:gap-8">
          {/* ADDRESS */}
          <div className="flex w-full flex-col gap-3 sm:gap-[17px] lg:max-w-[350px]">
            <h3 className="font-poppins text-xl font-normal leading-tight text-[#DDDDDD] sm:text-[28px] sm:leading-none lg:text-[36px]">
              {data.addressTitle || "Address"}
            </h3>
            <p className="font-poppins text-sm font-normal leading-[150%] text-[#878787] sm:text-base">
              {data.address}
            </p>

            {socials.length > 0 && (
              <div className="mt-2 flex items-center gap-5 sm:gap-[27px]">
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
            <div className="flex w-full flex-col gap-3 sm:gap-[17px] lg:max-w-[248px]">
              <h3 className="font-poppins text-xl font-normal leading-tight text-[#DDDDDD] sm:text-[28px] sm:leading-none lg:text-[36px]">
                {data.servicesTitle || "Services"}
              </h3>
              <ul className="flex flex-col gap-3 sm:gap-[17px]">
                {services.map((service) => (
                  <li
                    key={service._id || service.title}
                    className="flex items-start gap-2"
                  >
                    <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-[#878787]" />
                    <Link
                      href={service.link || "/services"}
                      className="font-poppins text-sm font-normal leading-snug text-[#878787] transition-colors duration-300 hover:text-white sm:text-base sm:leading-none"
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
            <div className="flex w-full flex-col gap-3 sm:gap-[17px] lg:max-w-[248px]">
              <h3 className="font-poppins text-xl font-normal leading-tight text-[#DDDDDD] sm:text-[28px] sm:leading-none lg:text-[36px]">
                {data.companyTitle || "Company"}
              </h3>
              <ul className="flex flex-col gap-3 sm:gap-[17px]">
                {companyLinks.map((link) => (
                  <li
                    key={link._id || link.title}
                    className="flex items-start gap-2"
                  >
                    <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-[#878787]" />
                    <Link
                      href={link.link || "/"}
                      className="font-poppins text-sm font-normal leading-snug text-[#878787] transition-colors duration-300 hover:text-white sm:text-base sm:leading-none"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CONTACT */}
          <div className="flex w-full flex-col gap-3 sm:gap-[17px] lg:max-w-[320px]">
            <h3 className="font-poppins text-xl font-normal leading-tight text-[#DDDDDD] sm:text-[28px] sm:leading-none lg:text-[36px]">
              {data.contactTitle || "Contact"}
            </h3>
            <div className="flex flex-col gap-3 sm:gap-[17px]">
              {data.phone && (
                <a
                  href={`tel:${phoneDigits ? `+${phoneDigits}` : ""}`}
                  className="font-poppins text-sm font-normal leading-snug text-[#878787] transition-colors duration-300 hover:text-white sm:text-base sm:leading-none"
                >
                  Phone: {data.phone}
                </a>
              )}
              {data.email && (
                <a
                  href={`mailto:${data.email}`}
                  className="font-poppins text-sm font-normal leading-snug text-[#878787] transition-colors duration-300 hover:text-white sm:text-base sm:leading-none"
                >
                  Email: {data.email}
                </a>
              )}
              {data.salesEmail && (
                <a
                  href={`mailto:${data.salesEmail}`}
                  className="font-poppins text-sm font-normal leading-snug text-[#878787] transition-colors duration-300 hover:text-white sm:text-base sm:leading-none"
                >
                  Sales: {data.salesEmail}
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
          50% { transform: translateY(-6px); }
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