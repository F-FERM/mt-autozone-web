import Image from "next/image";
import serviceBodyWaxing from "../../../public/images/serviceshero.jpg";
import serviceInteriorDetailing from "../../../public/images/serviceshero.jpg";
import serviceEngineCleaning from "../../../public/images/serviceshero.jpg";
import serviceCeramicCoating from "../../../public/images/serviceshero.jpg";
import serviceHeadlightRestoration from "../../../public/images/serviceshero.jpg";
import serviceLeatherConditioning from "../../../public/images/serviceshero.jpg";
import servicePaintCorrection from "../../../public/images/serviceshero.jpg";
import serviceOdorRemoval from "../../../public/images/serviceshero.jpg";
import serviceWindowTinting from "../../../public/images/serviceshero.jpg";
import serviceUndercarriageWash from "../../../public/images/serviceshero.jpg";
import serviceScratchRemoval from "../../../public/images/serviceshero.jpg";
import serviceRimCleaning from "../../../public/images/serviceshero.jpg";
import serviceFullBodyWash from "../../../public/images/serviceshero.jpg";
import serviceWaxPolish from "../../../public/images/serviceshero.jpg";
import servicePetHairRemoval from "../../../public/images/serviceshero.jpg";
import serviceSteamCleaning from "../../../public/images/serviceshero.jpg";
import serviceDashboardTreatment from "../../../public/images/serviceshero.jpg";
import serviceTireShine from "../../../public/images/serviceshero.jpg";

const SERVICES = [
  {
    key: "body-waxing",
    title: "Body Waxing",
    description:
      "Your car's paint is protected with the professional body waxing service from dirt and other environmental factors for long-lasting shine.",
    points: [
      { label: "UV Protection", icon: "shield" },
      { label: "Smoother, Glossier", icon: "sparkle" },
      { label: "Paint Protection", icon: "spray" },
    ],
    image: serviceBodyWaxing,
  },
  {
    key: "interior-detailing",
    title: "Interior Detailing",
    description:
      "A deep interior clean that removes dust, stains, and grime, leaving every surface fresh, sanitized, and comfortable to sit in.",
    points: [
      { label: "Deep Cleaning", icon: "spray" },
      { label: "Stain Removal", icon: "shield" },
      { label: "Fresh Interior", icon: "sparkle" },
    ],
    image: serviceInteriorDetailing,
  },
  {
    key: "engine-cleaning",
    title: "Engine Cleaning",
    description:
      "Careful degreasing and cleaning of the engine bay to remove built-up grime, improving performance visibility and presentation.",
    points: [
      { label: "Degreasing", icon: "spray" },
      { label: "Improved Airflow", icon: "sparkle" },
      { label: "Clean Bay", icon: "shield" },
    ],
    image: serviceEngineCleaning,
  },
  {
    key: "ceramic-coating",
    title: "Ceramic Coating",
    description:
      "A durable ceramic layer that shields your paint from scratches, oxidation, and weather damage while giving it a glass-like finish.",
    points: [
      { label: "Scratch Resistant", icon: "shield" },
      { label: "Glossy Finish", icon: "sparkle" },
      { label: "Weatherproof", icon: "shield" },
    ],
    image: serviceCeramicCoating,
  },
  {
    key: "headlight-restoration",
    title: "Headlight Restoration",
    description:
      "Foggy, yellowed headlights are restored to a clear finish, improving night visibility and refreshing your car's overall look.",
    points: [
      { label: "Clear Vision", icon: "sparkle" },
      { label: "UV Sealant", icon: "shield" },
      { label: "Restored Clarity", icon: "sparkle" },
    ],
    image: serviceHeadlightRestoration,
  },
  {
    key: "leather-conditioning",
    title: "Leather Conditioning",
    description:
      "Leather seats and trim are cleaned and conditioned to prevent cracking, keeping the interior soft, supple, and looking new.",
    points: [
      { label: "Crack Prevention", icon: "shield" },
      { label: "Soft Finish", icon: "sparkle" },
      { label: "Long-Term Care", icon: "spray" },
    ],
    image: serviceLeatherConditioning,
  },
  {
    key: "paint-correction",
    title: "Paint Correction",
    description:
      "Swirl marks, light scratches, and oxidation are carefully polished away to restore a smooth, flawless paint finish.",
    points: [
      { label: "Swirl Removal", icon: "spray" },
      { label: "Smooth Finish", icon: "sparkle" },
      { label: "Restored Gloss", icon: "shield" },
    ],
    image: servicePaintCorrection,
  },
  {
    key: "odor-removal",
    title: "Odor Removal",
    description:
      "Stubborn odors are neutralized at the source using professional treatment, leaving your cabin smelling clean and fresh.",
    points: [
      { label: "Odor Neutralizing", icon: "spray" },
      { label: "Fresh Cabin", icon: "sparkle" },
      { label: "Long-Lasting", icon: "shield" },
    ],
    image: serviceOdorRemoval,
  },
  {
    key: "window-tinting",
    title: "Window Tinting",
    description:
      "Quality tint film applied for added privacy, heat reduction, and UV protection without compromising visibility.",
    points: [
      { label: "UV Blocking", icon: "shield" },
      { label: "Heat Reduction", icon: "sparkle" },
      { label: "Added Privacy", icon: "shield" },
    ],
    image: serviceWindowTinting,
  },
  {
    key: "undercarriage-wash",
    title: "Undercarriage Wash",
    description:
      "A thorough wash beneath the vehicle removes road salt, mud, and debris that can lead to rust and long-term corrosion.",
    points: [
      { label: "Rust Prevention", icon: "shield" },
      { label: "Deep Rinse", icon: "spray" },
      { label: "Debris Removal", icon: "sparkle" },
    ],
    image: serviceUndercarriageWash,
  },
  {
    key: "scratch-removal",
    title: "Scratch Removal",
    description:
      "Minor scratches and surface imperfections are treated and blended, restoring a clean, uniform look to your paintwork.",
    points: [
      { label: "Surface Repair", icon: "spray" },
      { label: "Blended Finish", icon: "sparkle" },
      { label: "Restored Look", icon: "shield" },
    ],
    image: serviceScratchRemoval,
  },
  {
    key: "rim-cleaning",
    title: "Rim Cleaning",
    description:
      "Brake dust, grime, and road residue are removed from wheels and rims, restoring their shine and finish.",
    points: [
      { label: "Brake Dust Removal", icon: "spray" },
      { label: "Restored Shine", icon: "sparkle" },
      { label: "Detailed Finish", icon: "shield" },
    ],
    image: serviceRimCleaning,
  },
  {
    key: "full-body-wash",
    title: "Full Body Wash",
    description:
      "A complete hand wash covering every panel of your vehicle, removing dirt and grime for a clean, streak-free finish.",
    points: [
      { label: "Hand Washed", icon: "spray" },
      { label: "Streak-Free", icon: "sparkle" },
      { label: "Complete Coverage", icon: "shield" },
    ],
    image: serviceFullBodyWash,
  },
  {
    key: "wax-polish",
    title: "Wax & Polish",
    description:
      "A combined wax and polish treatment that enhances shine while adding a protective layer against everyday wear.",
    points: [
      { label: "Enhanced Shine", icon: "sparkle" },
      { label: "Protective Layer", icon: "shield" },
      { label: "Smooth Finish", icon: "sparkle" },
    ],
    image: serviceWaxPolish,
  },
  {
    key: "pet-hair-removal",
    title: "Pet Hair Removal",
    description:
      "Embedded pet hair is thoroughly removed from seats, carpets, and upholstery, leaving your interior clean and fresh.",
    points: [
      { label: "Deep Extraction", icon: "spray" },
      { label: "Upholstery Safe", icon: "shield" },
      { label: "Fresh Interior", icon: "sparkle" },
    ],
    image: servicePetHairRemoval,
  },
  {
    key: "steam-cleaning",
    title: "Steam Cleaning",
    description:
      "High-temperature steam lifts dirt and bacteria from surfaces without harsh chemicals, for a safe, deep clean.",
    points: [
      { label: "Chemical-Free", icon: "shield" },
      { label: "Bacteria Removal", icon: "spray" },
      { label: "Deep Clean", icon: "sparkle" },
    ],
    image: serviceSteamCleaning,
  },
  {
    key: "dashboard-treatment",
    title: "Dashboard Treatment",
    description:
      "Dashboard and trim are cleaned and treated to reduce sun damage and fading, keeping surfaces looking refreshed.",
    points: [
      { label: "UV Protection", icon: "shield" },
      { label: "Anti-Fade", icon: "sparkle" },
      { label: "Refreshed Look", icon: "spray" },
    ],
    image: serviceDashboardTreatment,
  },
  {
    key: "tire-shine",
    title: "Tire Shine",
    description:
      "A long-lasting tire dressing that restores a deep black finish, completing your vehicle's fully detailed look.",
    points: [
      { label: "Deep Black Finish", icon: "sparkle" },
      { label: "Long-Lasting", icon: "shield" },
      { label: "Complete Look", icon: "spray" },
    ],
    image: serviceTireShine,
  },
];

function PointIcon({ type }: { type: "shield" | "sparkle" | "spray" }) {
  if (type === "shield") {
    return (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M11 2L18.5 5V10.5C18.5 15 15.5 18.5 11 20C6.5 18.5 3.5 15 3.5 10.5V5L11 2Z"
          stroke="#E40000"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path
          d="M8 11L10 13L14.5 8.5"
          stroke="#E40000"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (type === "sparkle") {
    return (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M11 2L12.6 8.9L19.5 10.5L12.6 12.1L11 19L9.4 12.1L2.5 10.5L9.4 8.9L11 2Z"
          stroke="#E40000"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="8.5" width="6" height="11" rx="1.4" stroke="#E40000" strokeWidth="1.4" />
      <path d="M9.5 8.5V5.5C9.5 4.4 10.4 3.5 11.5 3.5C12.6 3.5 13.5 4.4 13.5 5.5" stroke="#E40000" strokeWidth="1.4" />
      <path d="M3.5 6.5L5.5 8.5M18.5 6.5L16.5 8.5M4.5 11.5H2.5M19.5 11.5H17.5" stroke="#E40000" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
      <path
        d="M4 14L14 4M14 4H6M14 4V12"
        stroke="#E40000"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ServicesGrid() {
  return (
    <section className="relative w-full bg-black">
      <div
        className="
          grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
          gap-x-5 lg:gap-x-[20px]
          gap-y-10 sm:gap-y-12 lg:gap-y-[45px]
          px-5 sm:px-8 md:px-12 lg:px-16 xl:px-24 
          pt-10 sm:pt-14 md:pt-16 lg:pt-20
          pb-16 sm:pb-20 md:pb-24
          w-full max-w-[1464px] mx-auto
        "
      >
        {SERVICES.map((service) => (
          <div
            key={service.key}
            className="
              group relative isolate overflow-hidden
              w-full 2xl:max-w-[425px]
              h-[340px] sm:h-[351px]
              rounded-[20px]
              pt-[100px] sm:pt-[130px] lg:pt-[151px]
              pr-6 sm:pr-8 lg:pr-[33px]
              pb-8 sm:pb-9 lg:pb-[39px]
              pl-6 sm:pl-8 lg:pl-[34px]
              flex flex-col justify-end
              gap-2.5
              transition-transform duration-500
              hover:-translate-y-1
            "
          >
            {/* Background image */}
            <Image
              src={service.image}
              alt={service.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 48vw, 425px"
              className="
                z-0 object-cover
                transition-transform duration-500
                group-hover:scale-105
              "
            />

            {/* Dark gradient overlay so text always reads clearly */}
            <div
              aria-hidden
              className="
                absolute inset-0 z-10
                bg-gradient-to-t from-black/90 via-black/50 to-black/10
              "
            />

            {/* Title */}
            <h3
              className="
                relative z-20
                font-poppins font-medium
                text-xl lg:text-[24px]
                leading-none tracking-normal
                text-white
              "
            >
              {service.title}
            </h3>

            {/* Description */}
            <p
              className="
                relative z-20
                font-poppins font-normal
                text-sm lg:text-[14px]
                leading-relaxed
                tracking-normal
                text-[#ADADAD]
              "
            >
              {service.description}
            </p>

            {/* 3 feature points, icon above label */}
            <div
              className="
                relative z-20
                flex items-start justify-between
                w-full lg:max-w-[358px]
                pt-1
              "
            >
              {service.points.map((point) => (
                <div
                  key={point.label}
                  className="flex  items-start gap-1.5 max-w-[110px]"
                >
                  <PointIcon type={point.icon as "shield" | "sparkle" | "spray"} />
                  <span
                    className="
                      font-poppins font-medium
                      text-xs lg:text-[12px]
                      leading-tight tracking-normal
                      text-[#D3D3D3]
                    "
                  >
                    {point.label}
                  </span>
                </div>
              ))}
            </div>

            {/* View Service link */}
            <button
              type="button"
              className="
                relative z-20
                flex items-center
                gap-2.5
                w-fit
                mt-1
              "
            >
              <span
                className="
                  font-poppins font-normal
                  text-base lg:text-[19px]
                  leading-none tracking-normal
                  text-[#E40000]
                  whitespace-nowrap
                "
              >
                View Service
              </span>
              <ArrowIcon />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}