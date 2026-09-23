"use client";

import Image from "next/image";
import { useState } from "react";

// Two separate images — replace with your actual assets
import leftImage from "../../../public/images/leftimage.jpg";
import rightImage from "../../../public/images/rightimage.jpg";

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire up your submit logic
    console.log(form);
  };

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
        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-[722px] flex-col gap-2.5 rounded-[30px] px-6 py-8 backdrop-blur-[7.8px] sm:px-10 sm:py-10 lg:px-[65px] lg:pb-[61px] lg:pt-[43px]"
          style={{
            background:
              "linear-gradient(180deg, rgba(72,0,0,0) 0%, rgba(174,0,0,0.54) 100%)",
          }}
        >
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="w-full rounded-[20px] bg-[#AEAEAE61] px-6 py-5 font-poppins text-base font-normal tracking-[0.04em] text-white placeholder:text-[#989898] backdrop-blur-[7.2px] outline-none focus:ring-1 focus:ring-[#E40000]/60 sm:px-10"
          />
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Your Phone No."
            className="w-full rounded-[20px] bg-[#AEAEAE61] px-6 py-5 font-poppins text-base font-normal tracking-[0.04em] text-white placeholder:text-[#989898] backdrop-blur-[7.2px] outline-none focus:ring-1 focus:ring-[#E40000]/60 sm:px-10"
          />
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Type Here..."
            rows={4}
            className="w-full resize-none rounded-[20px] bg-[#AEAEAE61] px-6 py-5 font-poppins text-base font-normal tracking-[0.04em] text-white placeholder:text-[#989898] backdrop-blur-[7.2px] outline-none focus:ring-1 focus:ring-[#E40000]/60 sm:px-10"
          />
<button
  type="submit"
  className="
    group
    flex
    w-full
    items-center
    justify-center
    rounded-[19px]

    border
    border-[#E400002B]

    bg-[#FFFFFF24]

    px-8
    py-4

    font-poppins
    text-base
    font-normal
    text-white

    transition-all
    duration-300
    hover:bg-[linear-gradient(90deg,#5A1717_0%,#E40000_50%,#7A1717_100%)]

    sm:px-[60px]
    lg:px-[211px]
  "
>
  <span className="mx-auto flex items-center gap-2">
    send

    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      className="transition-transform duration-300 group-hover:translate-x-1"
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
</button>
        </form>
      </div>
    </section>
  );
}