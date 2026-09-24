import ContactForm from "@/app/(web)/contact-us/page";


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
        <section className="relative overflow-hidden bg-black px-4 py-16 sm:px-6 lg:py-24">
            {/* Corner glow — top right */}
            <div
                aria-hidden
                className="
          pointer-events-none absolute z-0
          -right-24 -top-24
          h-[260px] w-[260px]
          sm:h-[340px] sm:w-[340px]
          lg:h-[420px] lg:w-[420px]
          rounded-full
          opacity-70
          blur-[90px] sm:blur-[100px] lg:blur-[120px]
        "
                style={{
                    background:
                        "radial-gradient(60% 60% at 50% 50%, rgba(228,0,0,0.55) 0%, rgba(228,0,0,0) 100%)",
                }}
            />

            {/* Corner glow — bottom left */}
            <div
                aria-hidden
                className="
          pointer-events-none absolute z-0
          -left-24 -bottom-24
          h-[260px] w-[260px]
          sm:h-[340px] sm:w-[340px]
          lg:h-[420px] lg:w-[420px]
          rounded-full
          opacity-70
          blur-[90px] sm:blur-[100px] lg:blur-[120px]
        "
                style={{
                    background:
                        "radial-gradient(60% 60% at 50% 50%, rgba(228,0,0,0.55) 0%, rgba(228,0,0,0) 100%)",
                }}
            />

            {/* subtle red glow behind the card */}
            <div
                className="pointer-events-none absolute right-0 top-1/2 z-0 h-[471px] w-[722px] max-w-full -translate-y-1/2 rounded-[30px] opacity-70 blur-[80px]"
                style={{
                    background:
                        "radial-gradient(60% 60% at 70% 50%, rgba(174,0,0,0.6) 0%, rgba(174,0,0,0) 100%)",
                }}
            />

            {/* CONTENT */}
            <div className="relative z-10 mx-auto flex max-w-[1464px] flex-col items-center gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-[111px]">
                {/* LEFT CONTENT */}
                <div className="flex w-full max-w-[631px] flex-col gap-3.5 text-center lg:text-left">
                    <p className="font-poppins text-base font-normal leading-none tracking-normal text-[#E40000] text-center lg:text-left">
                        Contact
                    </p>
                    <h2 className="font-poppins text-[26px] font-semibold leading-tight tracking-normal text-white sm:text-[30px] lg:text-[36px] lg:leading-[100%]">
                        Connect With MT Auto Zone
                    </h2>
                    <p className="font-poppins text-base font-normal leading-none tracking-normal text-[#878787]">
                        Looking for professional car detailing? Book your appointment with{" "}
                        <span className="text-[#E40000]">MT Auto Zone</span> today and
                        give your vehicle the care it deserves. Our skilled detailing
                        specialists provide everything from deep interior and exterior
                        cleaning to paint correction, polishing, waxing, and premium
                        paint protection. Restore your vehicle&apos;s shine, protect its
                        finish, and enjoy a flawless showroom-quality appearance with our
                        trusted detailing services.
                    </p>

                    {/* INFO CARDS */}
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-[15px]">
                        {INFO_CARDS.map((card) => (
                            <div
                                key={card.key}
                                className="
                  flex flex-col
                  w-full sm:w-[355px] sm:max-w-full
                  min-h-[150px]
                  rounded-[20px]
                  gap-[10px]
                  pt-[21px] pr-[26px] pb-[21px] pl-[26px]
                  bg-white/5
                  border border-white/10
                  backdrop-blur-[6px]
                  text-left
                "
                            >
                                <div className="flex items-center gap-2.5">
                                    {card.icon}
                                    <h3 className="font-poppins text-2xl font-medium leading-none tracking-normal text-white">
                                        {card.title}
                                    </h3>
                                </div>
                                <p className="font-poppins text-base font-normal leading-snug tracking-normal text-[#A9A9A9]">
                                    {card.value}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT FORM CARD — reused */}
                <ContactForm />
            </div>
        </section>
    );
}