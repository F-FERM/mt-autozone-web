"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import ContactForm from "@/app/component/contact/ContactForm";

// ================= TYPES =================

interface DescriptionSegment {
  text: string;
  highlight: boolean;
}

interface ContactInfoApi {
  location: string;
  email: string;
  phone: string[];
  workingHours: string;
}

interface ContactPageApiResponse {
  _id: string;
  sectionLabel: string;
  title: string;
  description: DescriptionSegment[];
  contactInfo: ContactInfoApi;
  isActive: boolean;
}

interface InfoCard {
  key: string;
  title: string;
  value: string;
  icon: React.ReactNode;
}

interface ContactData {
  sectionLabel: string;
  title: string;
  description: DescriptionSegment[];
  contactInfo: ContactInfoApi;
}

// ================= ICONS =================

const LocationIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 22s7-7.05 7-12a7 7 0 10-14 0c0 4.95 7 12 7 12z"
      stroke="#E40000"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="10" r="2.5" stroke="#E40000" strokeWidth="1.8" />
  </svg>
);

const EmailIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect
      x="2.5"
      y="4.5"
      width="19"
      height="15"
      rx="2"
      stroke="#E40000"
      strokeWidth="1.8"
    />
    <path
      d="M3 6l9 6 9-6"
      stroke="#E40000"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PhoneIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M4.5 3.5h3.2l1.5 4.2-2.1 1.7a12.5 12.5 0 006 6l1.7-2.1 4.2 1.5v3.2c0 1-.9 1.8-1.9 1.7A17 17 0 013 5.4a1.8 1.8 0 011.7-1.9z"
      stroke="#E40000"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const HoursIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="#E40000" strokeWidth="1.8" />
    <path
      d="M12 7v5l3.5 2"
      stroke="#E40000"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ================= DEFAULT DATA =================

const DEFAULT_CONTACT_INFO: ContactInfoApi = {
  location: "",
  email: "",
  phone: [],
  workingHours: "",
};

const DEFAULT_DATA: ContactData = {
  sectionLabel: "Contact",
  title: "Connect With MT Auto Zone",
  description: [
    {
      text: "Looking for professional car detailing? Book your appointment with ",
      highlight: false,
    },
    { text: "M.T. Auto Zone", highlight: true },
    {
      text: " today and give your vehicle the care it deserves.",
      highlight: false,
    },
  ],
  contactInfo: { ...DEFAULT_CONTACT_INFO },
};

// ================= HELPER =================

/** Build the info cards array from contact info */
function buildInfoCards(info: ContactInfoApi): InfoCard[] {
  const cards: InfoCard[] = [];

  if (info.location) {
    cards.push({
      key: "location",
      title: "Location",
      value: info.location,
      icon: LocationIcon,
    });
  }

  if (info.email) {
    cards.push({
      key: "email",
      title: "Email",
      value: info.email,
      icon: EmailIcon,
    });
  }

  if (info.phone && info.phone.length > 0) {
    cards.push({
      key: "phone",
      title: "Phone",
      value: info.phone.join(", "),
      icon: PhoneIcon,
    });
  }

  if (info.workingHours) {
    cards.push({
      key: "hours",
      title: "Working Hours",
      value: info.workingHours,
      icon: HoursIcon,
    });
  }

  return cards;
}

// ================= COMPONENT =================

export default function ContactInfoSection() {
  const [data, setData] = useState<ContactData>(DEFAULT_DATA);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContactPage = async () => {
      try {
        const res = await api.get<
          ContactPageApiResponse | ContactPageApiResponse[]
        >("/contact-page");

        let apiData: ContactPageApiResponse | null = null;
        if (Array.isArray(res.data)) {
          apiData = res.data.length > 0 ? res.data[0] : null;
        } else if (res.data && typeof res.data === "object") {
          apiData = res.data;
        }

        if (!apiData) {
          setData(DEFAULT_DATA);
          return;
        }

        setData({
          sectionLabel: apiData.sectionLabel || DEFAULT_DATA.sectionLabel,
          title: apiData.title || DEFAULT_DATA.title,
          description:
            apiData.description?.length > 0
              ? apiData.description
              : DEFAULT_DATA.description,
          contactInfo: {
            location: apiData.contactInfo?.location || "",
            email: apiData.contactInfo?.email || "",
            phone: Array.isArray(apiData.contactInfo?.phone)
              ? apiData.contactInfo.phone
              : [],
            workingHours: apiData.contactInfo?.workingHours || "",
          },
        });
      } catch (err) {
        console.error("Failed to fetch contact page:", err);
        setData(DEFAULT_DATA);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContactPage();
  }, []);

  const infoCards = buildInfoCards(data.contactInfo);

  // Render rich description segments
  const renderDescription = () =>
    data.description.map((seg, idx) =>
      seg.highlight ? (
        <span key={idx} className="text-[#E40000]">
          {""} {seg.text} {""}
        </span>
      ) : (
        <span key={idx}>{seg.text}</span>
      ),
    );

  return (
    <section className="relative w-full overflow-hidden bg-black isolate">
      {/* Red glow — TOP RIGHT */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute inset-0 z-0
          bg-[radial-gradient(ellipse_55%_90%_at_100%_0%,rgba(228,0,0,0.6)_0%,rgba(228,0,0,0.25)_45%,transparent_80%)]
        "
      />

      {/* Red glow — BOTTOM LEFT */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute inset-0 z-0
          bg-[radial-gradient(ellipse_40%_100%_at_0%_100%,rgba(228,0,0,0.55)_0%,rgba(228,0,0,0.2)_45%,transparent_80%)]
        "
      />

      {/* CONTENT WRAPPER */}
      <div
        className="
          relative z-10
          flex flex-col items-center gap-8 sm:gap-10
          pt-8 sm:pt-12 md:pt-14 lg:pt-16 xl:pt-24
          pb-14 sm:pb-20 md:pb-28 lg:pb-10
          w-full max-w-[1464px] mx-auto
          px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12
          lg:flex-row lg:items-start lg:justify-between
          lg:gap-4
        "
      >
        {/* LEFT SECTION */}
        <div className="flex w-full flex-col gap-5 text-center lg:flex-1 lg:max-w-[724px] lg:text-left">
          {isLoading ? (
            <>
              <div className="mx-auto h-4 w-24 animate-pulse rounded-md bg-white/10 lg:mx-0" />
              <div className="mx-auto h-10 w-3/4 animate-pulse rounded-md bg-white/10 lg:mx-0" />
              <div className="h-4 w-full animate-pulse rounded-md bg-white/10" />
              <div className="h-4 w-full animate-pulse rounded-md bg-white/10" />
              <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-[11px]">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="min-h-[150px] animate-pulse rounded-[20px] bg-white/5"
                  />
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Eyebrow */}
              <p className="font-poppins text-sm font-normal leading-none tracking-normal text-[#E40000] text-center sm:text-base lg:text-left">
                {data.sectionLabel}
              </p>

              {/* Title */}
              <h2 className="font-poppins text-2xl font-semibold leading-tight tracking-normal text-white sm:text-[30px] lg:text-[36px] lg:leading-none">
                {data.title}
              </h2>

              {/* Description */}
              <p className="font-poppins text-sm font-normal leading-[150%] tracking-normal text-[#878787] sm:text-base w-full">
                {renderDescription()}
              </p>

              {/* INFO CARDS */}
             {infoCards.length > 0 && (
  <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-[11px] w-full">
    {infoCards.map((card) => (
      <div
        key={card.key}
        className="
          flex w-full min-w-0 flex-col items-start justify-center
          text-left
          min-h-[150px]
          rounded-[20px]
          gap-[10px]
          pt-[21px] pr-[26px] pb-[21px] pl-[26px]
          overflow-hidden
        "
        style={{
          background: "#A2A2A221",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
        }}
      >
        <div className="flex min-w-0 items-center justify-start gap-2.5">
          {card.icon}
          <h3 className="font-poppins text-lg font-medium leading-tight tracking-normal text-white sm:text-2xl sm:leading-none">
            {card.title}
          </h3>
        </div>
        <p className="w-full min-w-0 break-words font-poppins text-sm font-normal leading-[150%] tracking-normal text-[#A9A9A9] sm:text-base">
          {card.value}
        </p>
      </div>
    ))}
  </div>
)}
            </>
          )}
        </div>

        {/* RIGHT SECTION — Form (unchanged) */}
        <div className="w-full lg:w-auto rounded-[30px]">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}