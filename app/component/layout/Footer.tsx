"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUp } from "lucide-react";

import instagramIcon from "../../../public/images/insta.png";
import facebookIcon from "../../../public/images/fb.png";
import twitterIcon from "../../../public/images/twitter.png";
import whatsappIcon from "../../../public/images/whatsapp.png";

const services = [
  "Interior Cleaning & Detailing",
  "Paint Care & Protection",
  "Ceramic Coating",
  "Headlight Restoration",
  "Waterless Car Wash",
  "Paint Protection Film",
];

const companyLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Works", href: "/works" },
  { label: "Contact Us", href: "/contact" },
];

const socials = [
  { icon: instagramIcon, href: "#", label: "Instagram" },
  { icon: facebookIcon, href: "#", label: "Facebook" },
  { icon: twitterIcon, href: "#", label: "Twitter" },
  { icon: whatsappIcon, href: "#", label: "WhatsApp" },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-[#1D1D1D] px-6 pb-8 pt-12 sm:px-10 sm:pt-14 lg:px-20 lg:pt-16">
      <div className="mx-auto flex max-w-[1760px] flex-col gap-6">
        {/* GET STARTED NOW */}
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div className="flex w-full max-w-[573px] flex-col gap-3">
            <h2 className="font-poppins text-[28px] font-semibold leading-none text-white sm:text-[32px] lg:text-[36px] mb-4">
              Get Started Now
            </h2>
            <p className="font-poppins text-base font-normal leading-[150%] text-[#878787]">
              Get started with our expert team today for premium automotive
              protection, precision detailing, and long-lasting care tailored
              to your vehicle.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-4 mb-8">
            {/* GET QUOTE — styled like the Explore button: same
                border/background, hover gradient, shadow, and arrow
                straightens (up-right → right) on hover */}
            <Link
              href="/contact"
              className="
                group
                flex items-center gap-2
                rounded-[19px] border border-[#E400002B] bg-[#FFFFFF24]
                px-6 py-3
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
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#2A2A2A] text-white transition-colors duration-300 hover:bg-[#E40000]"
            >
              <ArrowUp size={20} />
            </button>
          </div>
        </div>

        <div className="h-px w-full bg-white/10" />

        {/* ADDRESS / SERVICES / COMPANY / CONTACT */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:flex lg:flex-row lg:justify-between lg:gap-8">
          {/* ADDRESS */}
          <div className="flex w-full flex-col gap-[17px] lg:max-w-[350px]">
            <h3 className="font-poppins text-2xl font-normal leading-none text-[#DDDDDD] sm:text-[28px] lg:text-[36px]">
              Address
            </h3>
            <p className="font-poppins text-base font-normal leading-[150%] text-[#878787]">
              MT Autozone Address: 18th B St - Umm Ramool - Dubai - United
              Arab Emirates
            </p>
            <div className="mt-2 flex items-center gap-[27px]">
              {socials.map(({ icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-[30px] w-[30px] shrink-0 items-center justify-center transition-opacity duration-300 hover:opacity-70"
                >
                  <Image
                    src={icon}
                    alt={label}
                    width={30}
                    height={30}
                    className="h-[30px] w-[30px] object-contain"
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* SERVICES */}
          <div className="flex w-full flex-col gap-[17px] lg:max-w-[248px]">
            <h3 className="font-poppins text-2xl font-normal leading-none text-[#DDDDDD] sm:text-[28px] lg:text-[36px]">
              Services
            </h3>
            <ul className="flex flex-col gap-[17px]">
              {services.map((service) => (
                <li key={service} className="flex items-start gap-2">
                  <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-[#878787]" />
                  <Link
                    href="/services"
                    className="font-poppins text-base font-normal leading-none text-[#878787] transition-colors duration-300 hover:text-white"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COMPANY */}
          <div className="flex w-full flex-col gap-[17px] lg:max-w-[248px]">
            <h3 className="font-poppins text-2xl font-normal leading-none text-[#DDDDDD] sm:text-[28px] lg:text-[36px]">
              Company
            </h3>
            <ul className="flex flex-col gap-[17px]">
              {companyLinks.map((link) => (
                <li key={link.label} className="flex items-start gap-2">
                  <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-[#878787]" />
                  <Link
                    href={link.href}
                    className="font-poppins text-base font-normal leading-none text-[#878787] transition-colors duration-300 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}
          <div className="flex w-full flex-col gap-[17px] lg:max-w-[320px]">
            <h3 className="font-poppins text-2xl font-normal leading-none text-[#DDDDDD] sm:text-[28px] lg:text-[36px]">
              Contact
            </h3>
            <div className="flex flex-col gap-[17px]">
              <a
                href="tel:+971551696443"
                className="font-poppins text-base font-normal leading-none text-[#878787] transition-colors duration-300 hover:text-white"
              >
                Phone: +971 55 169 6443
              </a>
              <a
                href="mailto:dd@gmail.com"
                className="font-poppins text-base font-normal leading-none text-[#878787] transition-colors duration-300 hover:text-white"
              >
                Email: dd@gmail.com
              </a>
              <a
                href="mailto:fyudfddb@gmail.com"
                className="font-poppins text-base font-normal leading-none text-[#878787] transition-colors duration-300 hover:text-white"
              >
                Sales: fyudfddb@gmail.com
              </a>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-white/10" />

        {/* COPYRIGHT / LEGAL LINKS */}
        <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
          <p className="font-poppins text-sm font-normal leading-none text-[#878787] sm:text-base">
            Copyright © 2026 MT Auto Zone. All rights reserved.
          </p>
          <div className="flex items-center gap-2 font-poppins text-sm font-normal leading-none text-[#878787] sm:text-base">
            <Link href="/privacy" className="transition-colors duration-300 hover:text-white">
              Privacy Policy
            </Link>
            <span>|</span>
            <Link href="/terms" className="transition-colors duration-300 hover:text-white">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}