import ContactForm from "@/app/component/contact/ContactForm";

const INFO_CARDS = [
  {
    key: "location",
    title: "Location",
    value:
      "MT Autozone Address: 18th B St - Umm Ramool - Dubai - United Arab Emirates",
    icon: (
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
    ),
  },
  {
    key: "email",
    title: "Email",
    value: "abrar.sayed@honestynperfection.com",
    icon: (
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
    ),
  },
  {
    key: "phone",
    title: "Phone",
    value: "+971 4263 0077, +971 5589 66452",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M4.5 3.5h3.2l1.5 4.2-2.1 1.7a12.5 12.5 0 006 6l1.7-2.1 4.2 1.5v3.2c0 1-.9 1.8-1.9 1.7A17 17 0 013 5.4a1.8 1.8 0 011.7-1.9z"
          stroke="#E40000"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    key: "hours",
    title: "Working Hours",
    value: "Monday – Saturday | 9:00 AM – 7:00 PM",
    icon: (
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
    ),
  },
];

export default function ContactInfoSection() {
  return (
    <section className="relative w-full overflow-hidden bg-black isolate">
      {/* Red glow — TOP RIGHT corner, fading out toward the left and down */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute inset-0 z-0
          bg-[radial-gradient(ellipse_55%_90%_at_100%_0%,rgba(228,0,0,0.6)_0%,rgba(228,0,0,0.25)_45%,transparent_80%)]
        "
      />

      {/* Red glow — BOTTOM LEFT corner, fading out toward the right and up */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute inset-0 z-0
          bg-[radial-gradient(ellipse_40%_65%_at_0%_100%,rgba(228,0,0,0.55)_0%,rgba(228,0,0,0.2)_45%,transparent_80%)]
        "
      />

      {/*
        CONTENT WRAPPER
        Same container + padding as OurWorks (max-w 1464, px-4/sm:px-6/lg:px-0,
        same top/bottom padding) so the start and end points line up exactly.
      */}
      <div
        className="
          relative z-10
          flex flex-col items-center gap-10
          pt-8 sm:pt-12 md:pt-14 lg:pt-16 xl:pt-24
          pb-14 sm:pb-20 md:pb-28 lg:pb-10
          w-full max-w-[1464px] mx-auto
          px-4 sm:px-6 lg:px-0
          lg:flex-row lg:items-start lg:justify-between
          lg:gap-4
        "
      >
        {/* LEFT SECTION — 724 x 549, gap 20px */}
        <div className="flex w-full max-w-[724px] flex-col gap-5 text-center lg:h-[549px] lg:text-left">
          <p className="font-poppins text-base font-normal leading-none tracking-normal text-[#E40000] text-center lg:text-left">
            Contact
          </p>
          <h2 className="font-poppins text-[26px] font-semibold leading-none tracking-normal text-white sm:text-[30px] lg:text-[36px]">
            Connect With MT Auto Zone
          </h2>
          <p className="font-poppins text-base font-normal leading-[150%] tracking-normal text-[#878787] lg:h-[120px] lg:w-[724px]">
            Looking for professional car detailing? Book your appointment with{" "}
            <span className="text-[#E40000]">MT Auto Zone</span> today and give
            your vehicle the care it deserves. Our skilled detailing specialists
            provide everything from deep interior and exterior cleaning to paint
            correction, polishing, waxing, and premium paint protection. Restore
            your vehicle&apos;s shine, protect its finish, and enjoy a flawless
            showroom-quality appearance with our trusted detailing services.
          </p>

          {/* 4 CARDS — grid width 724 x 311, gap 11px */}
          <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-[11px] lg:h-[311px] lg:w-[724px]">
            {INFO_CARDS.map((card) => (
              <div
                key={card.key}
                className="
                  flex w-full flex-col items-start justify-center
                  text-left
                  sm:w-[355px] sm:max-w-full
                  min-h-[150px] lg:h-[150px]
                  rounded-[20px]
                  gap-[10px]
                  pt-[21px] pr-[26px] pb-[21px] pl-[26px]
                "
                style={{
                  background: "#A2A2A221",
                  backdropFilter: "blur(4px)",
                  WebkitBackdropFilter: "blur(4px)",
                }}
              >
                <div className="flex items-center justify-start gap-2.5">
                  {card.icon}
                  <h3 className="font-poppins text-2xl font-medium leading-none tracking-normal text-white">
                    {card.title}
                  </h3>
                </div>
                <p className="font-poppins text-base font-normal leading-[150%] tracking-normal text-[#A9A9A9]">
                  {card.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SECTION — 722 x 628, radius 30 */}
        <div className="w-full lg:w-auto rounded-[30px]">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}