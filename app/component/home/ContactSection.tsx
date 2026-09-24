"use client";

import Image from "next/image";
import ContactForm from "../contact/ContactForm";

// Two separate images — replace with your actual assets
import leftImage from "../../../public/images/leftimage.jpg";
import rightImage from "../../../public/images/rightimage.jpg";

export default function ContactSection() {
  return (
    <section className="relative overflow-hidden bg-black px-4 py-16 sm:px-6 lg:py-24">
      {/* LEFT IMAGE — width:1119 height:746 */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-0 hidden w-[60%] max-w-[1119px] md:block">
        <Image
          src={leftImage}
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(270deg, #000000 0%, rgba(0,0,0,0) 197.36%)",
          }}
        />
      </div>

      {/* RIGHT IMAGE — width:746 height:746, left:1174px */}
      <div className="pointer-events-none absolute inset-y-0 right-0 z-0 hidden w-[45%] max-w-[746px] md:block">
        <Image
          src={rightImage}
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, #000000 0%, rgba(0,0,0,0) 100%)",
          }}
        />
      </div>

      {/* mobile fallback: dim solid background so text/card stay readable without the two side images */}
      <div className="absolute inset-0 z-0 bg-black md:hidden" />

      {/* MAIN section overlay */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[#00000080]" />

      {/* subtle red glow behind the card */}
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
          <p className="font-poppins text-base font-normal leading-none text-[#E40000]">
            Contact
          </p>
          <h2 className="font-poppins text-[26px] font-semibold leading-tight text-white sm:text-[30px] lg:text-[36px] lg:leading-[100%]">
            Connect With MT Auto Zone
          </h2>
          <p className="font-poppins text-base font-normal leading-relaxed text-[#878787]">
            Looking for expert car care service? Book your appointment with{" "}
            <span className="text-[#E40000]">MT Auto Zone</span> today and
            experience professional care for your vehicle. Our detailing
            experts restore, enhance, and protect your vehicle with precision
            care and a flawless showroom finish. Restore your vehicle&apos;s
            beauty with expert detailing, premium protection, and meticulous
            care for a flawless finish.
          </p>
        </div>

        {/* RIGHT FORM CARD */}
        <ContactForm />
      </div>
    </section>
  );
}