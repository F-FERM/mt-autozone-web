"use client";

import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log(form);
  };

  return (
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
        className="group flex w-full items-center justify-center rounded-[19px] border border-[#E400002B] bg-[#FFFFFF24] px-8 py-4 font-poppins text-base font-normal text-white transition-all duration-300 hover:bg-[linear-gradient(90deg,#5A1717_0%,#E40000_50%,#7A1717_100%)] sm:px-[60px] lg:px-[211px]"
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
  );
}
