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

/* One contact button, reused for desktop and mobile. Size comes from className. */
function ContactButton({
  className = "",
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href="/contact-us"
      onClick={onClick}
      className={`
        group relative overflow-hidden
        items-center justify-center
        shrink-0 font-poppins

        rounded-[19px]
        border border-[#E4000038]
        bg-[#FFFFFF24]

        shadow-[0_3px_4px_rgba(0,0,0,0.35)]
        transition-[box-shadow,border-color] duration-300 ease-out

        hover:border-transparent
        hover:shadow-[0_7px_6px_rgba(0,0,0,0.55)]
        ${className}
      `}
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

      <span className="relative z-10 flex items-center gap-[10px] xl:gap-[14px]">
        <span
          className="
            text-white whitespace-nowrap font-medium leading-none
            text-[16px] xl:text-[20px]
          "
        >
          Contact
        </span>

        <Image
          src={phoneIcon}
          alt="Phone"
          width={25}
          height={25}
          className="
            w-[20px] h-[20px] xl:w-[25px] xl:h-[25px]
            object-contain shrink-0
            rotate-0
            group-hover:rotate-[-120deg]
            transition-transform duration-300 ease-out
          "
        />
      </span>
    </Link>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className="w-full sticky top-0 z-50 border-t border-[#3a1010]"
      style={{ background: "#0d0d0d" }}
    >
      <div
        className="mx-auto flex items-center justify-between gap-3 px-4 sm:px-8 lg:px-12 xl:px-20"
        style={{ maxWidth: "1920px" }}
      >
        {/* ================= LOGO ================= */}
        <Link
          href="/"
          aria-label="AutoZone home"
          className="flex items-center shrink-0 py-3 w-[120px] sm:w-[150px] xl:w-[182px]"
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

        {/* ================= DESKTOP NAV (lg and up) ================= */}
        <nav
          className="
            hidden lg:flex
            flex-1 max-w-[590px]
            mx-auto
            items-center justify-between
            gap-4
            font-poppins
          "
        >
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors duration-200 font-medium text-[15px] xl:text-[16px] leading-none hover:text-[#E40000]"
                style={{ color: isActive ? "#E40000" : "#EBEBEB" }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* ================= DESKTOP CONTACT ================= */}
        <ContactButton className="hidden lg:flex w-[150px] h-[48px] xl:w-[181px] xl:h-[55px]" />

        {/* ================= MOBILE MENU BUTTON ================= */}
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          className="lg:hidden text-white p-2 -mr-2"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* ================= MOBILE / TABLET DRAWER ================= */}
      {mobileOpen && (
        <div
          className="
            lg:hidden
            flex flex-col gap-5
            px-4 sm:px-8
            pb-6 pt-4
            font-poppins
            border-t border-[#3a1010]
            max-h-[calc(100vh-84px)] overflow-y-auto
          "
        >
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="font-medium text-[16px] leading-none"
                style={{ color: isActive ? "#E40000" : "#EBEBEB" }}
              >
                {link.label}
              </Link>
            );
          })}

          <ContactButton
            onClick={() => setMobileOpen(false)}
            className="flex w-full sm:w-[220px] h-[52px] mt-2"
          />
        </div>
      )}
    </header>
  );
}