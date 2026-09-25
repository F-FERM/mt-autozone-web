"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import api from "@/lib/axios";

// ================= TYPES =================

interface ContactFormData {
  name: string;
  phone: string;
  service: string;
  message: string;
}

const INITIAL_FORM: ContactFormData = {
  name: "",
  phone: "",
  service: "",
  message: "",
};

// ================= HELPERS =================

function extractErrorMessage(err: unknown, fallback: string): string {
  const e = err as {
    response?: { data?: { message?: string | string[] } };
  };
  const msg = e?.response?.data?.message;
  if (Array.isArray(msg)) {
    return msg.length > 0 ? msg[0] : fallback;
  }
  return msg || fallback;
}

// ================= COMPONENT =================

export default function ContactForm() {
  const [form, setForm] = useState<ContactFormData>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // ---- Validation ----
    if (!form.name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!form.phone.trim()) {
      toast.error("Please enter your phone number");
      return;
    }
    if (!form.service) {
      toast.error("Please select a service");
      return;
    }
    if (!form.message.trim()) {
      toast.error("Please enter your message");
      return;
    }

    const toastId = toast.loading("Sending your message...");

    try {
      setSubmitting(true);

      const payload = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        service: form.service,
        message: form.message.trim(),
      };

      await api.post("/home-contact/submission", payload);

      toast.success("Message sent successfully! We'll get back to you soon.", {
        id: toastId,
      });
      setForm(INITIAL_FORM);
    } catch (err: unknown) {
      toast.error(
        extractErrorMessage(err, "Failed to send message. Please try again."),
        { id: toastId },
      );
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClasses =
    "w-full rounded-[20px] bg-[#AEAEAE61] px-5 py-4 font-poppins text-sm font-normal leading-normal tracking-[0.04em] placeholder:text-[#989898] backdrop-blur-[7.2px] outline-none focus:ring-1 focus:ring-[#E40000]/60 disabled:opacity-60 sm:px-8 sm:py-[18px] sm:text-base md:px-10 md:py-5 lg:min-h-[65px] lg:w-[593px] lg:px-10 lg:py-[25px]";

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-[722px] flex-col gap-2.5 rounded-[30px] px-5 py-7 backdrop-blur-[7.8px] sm:px-8 sm:py-9 md:px-10 md:py-10 lg:min-h-[628px] lg:w-[722px] lg:gap-2.5 lg:pl-[65px] lg:pr-[64px] lg:pt-[43px] lg:pb-[61px]"
      style={{
        background:
          "linear-gradient(180deg, rgba(72,0,0,0) 0%, rgba(174,0,0,0.54) 100%)",
      }}
    >
      <div className="flex w-full flex-col gap-4 sm:gap-[19px] lg:w-[593px]">
        <h3 className="font-poppins text-2xl font-semibold leading-tight tracking-normal text-white sm:text-[32px] lg:text-[36px] lg:leading-none">
          Send Message
        </h3>

        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Your Name"
          disabled={submitting}
          className={`${fieldClasses} text-white`}
        />
        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Your Phone No."
          disabled={submitting}
          className={`${fieldClasses} text-white`}
        />

        <div className="relative w-full lg:w-[593px]">
          <select
            name="service"
            value={form.service}
            onChange={handleChange}
            disabled={submitting}
            className={`${fieldClasses} appearance-none pr-10`}
            style={{ color: form.service ? "#FFFFFF" : "#989898" }}
          >
            <option value="" hidden style={{ color: "#989898" }}>
              Select Service
            </option>
            <option
              value="Interior Cleaning"
              className="bg-[#2a0000] text-white"
            >
              Interior Cleaning
            </option>
            <option
              value="Exterior Cleaning"
              className="bg-[#2a0000] text-white"
            >
              Exterior Cleaning
            </option>
            <option
              value="Paint Correction"
              className="bg-[#2a0000] text-white"
            >
              Paint Correction
            </option>
            <option
              value="Polishing & Waxing"
              className="bg-[#2a0000] text-white"
            >
              Polishing &amp; Waxing
            </option>
            <option
              value="Paint Protection"
              className="bg-[#2a0000] text-white"
            >
              Paint Protection
            </option>
            <option value="Ceramic Coating" className="bg-[#2a0000] text-white">
              Ceramic Coating
            </option>
            <option
              value="Headlight Restoration"
              className="bg-[#2a0000] text-white"
            >
              Headlight Restoration
            </option>
            <option
              value="Waterless Car Wash"
              className="bg-[#2a0000] text-white"
            >
              Waterless Car Wash
            </option>
            <option
              value="Paint Protection Film"
              className="bg-[#2a0000] text-white"
            >
              Paint Protection Film
            </option>
          </select>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-[#989898] sm:right-8 md:right-10"
          >
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Type Here..."
          rows={4}
          disabled={submitting}
          className={`${fieldClasses} text-white resize-none lg:h-auto lg:flex-1 lg:py-[25px]`}
        />

        <button
          type="submit"
          disabled={submitting}
          className="group flex w-full items-center justify-center rounded-[19px] border border-[#E400002B] bg-[#FFFFFF24] px-6 py-3.5 font-poppins text-sm font-normal text-white transition-all duration-300 hover:bg-[linear-gradient(90deg,#5A1717_0%,#E40000_50%,#7A1717_100%)] disabled:cursor-not-allowed disabled:opacity-70 sm:px-[60px] sm:py-4 sm:text-base md:min-h-[65px] lg:w-[593px]"
        >
          <span className="mx-auto flex items-center gap-2">
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Sending...
              </>
            ) : (
              <>
                Send
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
              </>
            )}
          </span>
        </button>
      </div>
    </form>
  );
}