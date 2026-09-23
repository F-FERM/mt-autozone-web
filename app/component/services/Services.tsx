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

// Point icons — update paths/extensions to match your actual icon filenames
import shieldIcon from "../../../public/images/phone.png";
import sparkleIcon from "../../../public/images/phone.png";
import sprayIcon from "../../../public/images/phone.png";

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

const ICON_MAP = {
  shield: shieldIcon,
  sparkle: sparkleIcon,
  spray: sprayIcon,
};

function PointIcon({ type, }: { type: "shield" | "sparkle" | "spray"; }) { return ( <span className=" relative block h-[30px] w-[30px] shrink-0 " > <Image src={ICON_MAP[type]} alt="" fill sizes="30px" className="object-contain" /> </span> ); }

function ArrowIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="
        flex-shrink-0
        transition-transform duration-300 ease-out
        [transform:rotate(-45deg)]
        group-hover/btn:[transform:translateX(6px)_rotate(0deg)]
      "
    >
      <path
        d="M2.5 9H15.5M15.5 9L10.5 4M15.5 9L10.5 14"
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
              transition-transform duration-500 ease-out
              hover:-translate-y-1 hover:scale-[1.02]
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

            {/* Dark gradient overlay — hidden by default, fades in with content on hover */}
            <div
              aria-hidden
              className="
                absolute inset-0 z-10
                bg-gradient-to-t from-black/90 via-black/50 to-black/10
                opacity-0
                transition-opacity duration-500 ease-out
                group-hover:opacity-100
              "
            />

            {/* Content — hidden by default, fades + slides + scales in on hover */}
            <div
              className="
                relative z-20 flex flex-col gap-2.5
                opacity-0 translate-y-3 scale-95
                transition-all duration-500 ease-out
                group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100
              "
            >
              {/* Title */}
              <h3
                className="
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
              <div className=" flex flex-wrap items-center gap-5 sm:gap-6 pt-1 " > {service.points.map((point) => ( <div key={point.label} className=" flex items-center gap-4 " > <PointIcon type={point.icon as "shield" | "sparkle" | "spray"} /> <span className=" max-w-[100px] font-poppins text-xs font-normal leading-[150%] text-white sm:text-sm " > {point.label} </span> </div> ))} </div>

              {/* View Service link */}
              <button
                type="button"
                className="
    group/btn
    flex items-center
    gap-2.5
    w-fit
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
          </div>
        ))}
      </div>
    </section>
  );
}