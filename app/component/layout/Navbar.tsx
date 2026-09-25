"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

import autozonelogo from "../../../public/images/logo.png";
import phoneIcon from "../../../public/images/phone.png";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Service", href: "/services" },
  { label: "Works", href: "/works" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className="w-full sticky top-0 z-50 border-t border-[#3a1010]"
      style={{ background: "#0d0d0d" }}
    >
      <div
        className="mx-auto flex items-center justify-between gap-[10px] px-5 sm:px-10 lg:px-20"
        style={{ maxWidth: "1920px" }}
      >
        {/* ================= LOGO ================= */}
        <Link
          href="/"
          aria-label="AutoZone home"
          className="flex items-center shrink-0 py-3"
          style={{
            width: "182px",
            maxWidth: "40vw",
            height: "84px",
          }}
        >
          <Image
            src={autozonelogo}
            alt="AutoZone"
            width={182}
            height={84}
            className="w-full h-auto object-contain"
            priority
          />
        </Link>

        {/* ================= DESKTOP NAV ================= */}
        <nav
          className="
            hidden
            md:flex
            items-center
            justify-between
            shrink-0
            font-poppins
          "
          style={{
            width: "590px",
            height: "24px",
          }}
        >
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors duration-200"
                style={{
                  fontWeight: 500,
                  fontSize: "16px",
                  lineHeight: "100%",
                  color: isActive ? "#E40000" : "#EBEBEB",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* ================= DESKTOP CONTACT ================= */}
        <a
          href="/contact-us"
          className="
    group
    hidden md:flex
    items-center
    justify-center
    shrink-0
    font-poppins

    w-[181px]
    h-[55px]

    rounded-[19px]

    border
    border-[#E4000038]

    bg-[#FFFFFF24]

    shadow-[0_3px_4px_rgba(0,0,0,0.35)]

    transition-[background,box-shadow]
    duration-300
    ease-out

    hover:bg-[linear-gradient(135deg,#4A2929_0%,#572C2C_25%,#8B2525_55%,#C91A1A_78%,#E00000_100%)]
    hover:shadow-[0_7px_6px_rgba(0,0,0,0.55)]
  "
        >
          <div className="flex items-center gap-[10px]">
            <span
              className="text-white whitespace-nowrap"
              style={{
                fontWeight: 500,
                fontSize: "20px",
                lineHeight: "100%",
              }}
            >
              Contact
            </span>

            <span className="flex items-center justify-center w-[25px] h-[25px] shrink-0">
              <Image
                src={phoneIcon}
                alt="Phone"
                width={25}
                height={25}
                className="
          w-[25px]
          h-[25px]
          object-contain
          rotate-0
          group-hover:rotate-[-45deg]
          transition-transform
          duration-300
          ease-out
        "
              />
            </span>
          </div>
        </a>
        {/* ================= MOBILE MENU ================= */}
        <button
          type="button"
          aria-label="Toggle menu"
          className="md:hidden text-white p-2"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* ================= MOBILE DRAWER ================= */}
      {mobileOpen && (
        <div
          className="
            md:hidden
            flex
            flex-col
            gap-5
            px-6
            pb-6
            pt-2
            font-poppins
            border-t
            border-[#3a1010]
          "
        >
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  fontWeight: 500,
                  fontSize: "16px",
                  color: isActive ? "#E40000" : "#EBEBEB",
                }}
              >
                {link.label}
              </Link>
            );
          })}

          {/* ================= MOBILE CONTACT ================= */}
          <a
            href="/contact-us"
            className="
              group
              flex
              items-center
              justify-center
              mt-2

              h-[55px]

              rounded-[19px]

              border
              border-[#E400002B]

              bg-[#FFFFFF24]

              shadow-[5px_7px_12px_rgba(0,0,0,0.45)]

              transition-all
              duration-300

              hover:bg-[#E40000]
              hover:border-[#E40000]
              hover:shadow-[6px_8px_14px_rgba(0,0,0,0.65)]
            "
          >
            <div className="flex items-center gap-[10px]">
              <span
                className="text-white"
                style={{
                  fontWeight: 500,
                  fontSize: "16px",
                  lineHeight: "100%",
                }}
              >
                Contact
              </span>

              <Image
                src={phoneIcon}
                alt="Phone"
                width={20}
                height={20}
                className="
                  w-[20px]
                  h-[20px]
                  object-contain

                  rotate-0
                  group-hover:rotate-[-90deg]

                  transition-transform
                  duration-300
                  ease-out
                "
              />
            </div>
          </a>
        </div>
      )}
    </header>
  );
}
