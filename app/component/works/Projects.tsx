import Image from "next/image";

import project1 from "../../../public/images/homeservicecar.tsx.jpg";
import project2 from "../../../public/images/homeservicecar.tsx.jpg";
import project3 from "../../../public/images/homeservicecar.tsx.jpg";
import project4 from "../../../public/images/homeservicecar.tsx.jpg";

// Small feature icons
import uvIcon from "../../../public/images/insta.png";
import glossIcon from "../../../public/images/insta.png";
import sprayIcon from "../../../public/images/insta.png";
import shineIcon from "../../../public/images/insta.png";
import ceramicIcon from "../../../public/images/insta.png";
import interiorIcon from "../../../public/images/insta.png";
import freshIcon from "../../../public/images/insta.png";
import shieldIcon from "../../../public/images/insta.png";
import metalIcon from "../../../public/images/insta.png";

const projects = [
  {
    image: project1,
    alt: "M.T. Autozone body waxing service on a black SUV",
    title: "Body Waxing",
    description:
      "M.T. Autozone's professional body waxing service enhances your vehicle's exterior shine while adding a protective layer to the paintwork. It helps reduce the impact of dust, dirt, UV exposure, and environmental contaminants, leaving your car with a smoother, glossier, and freshly detailed appearance.",
    features: [
      { icon: uvIcon, label: "UV exposure" },
      { icon: glossIcon, label: "smoother, glossier" },
      { icon: sprayIcon, label: "detailed appearance." },
    ],
  },
  {
    image: project2,
    alt: "M.T. Autozone ceramic coating service on a vehicle",
    title: "Ceramic Coating",
    description:
      "Enhance your vehicle's paintwork with professional ceramic coating from M.T. Autozone. This protective treatment creates an additional protective layer over the exterior surface, helping resist dirt, stains, and environmental contaminants while providing deep gloss, a smooth finish, and a long-lasting polished appearance.",
    features: [
      { icon: shineIcon, label: "long-lasting" },
      { icon: glossIcon, label: "smooth" },
      { icon: ceramicIcon, label: "Ceramic Coating" },
    ],
  },
  {
    image: project3,
    alt: "M.T. Autozone interior sanitization service",
    title: "Interior Sanitization",
    description:
      "Our company M.T. Autozone specializes in interior sanitization that can help you make the interior of your car cleaner and fresher. Our process helps remove unwanted odors, bacteria, and allergens for a healthier cabin environment.",
    features: [
      { icon: interiorIcon, label: "deep clean" },
      { icon: freshIcon, label: "fresh interior" },
      { icon: shieldIcon, label: "sanitized" },
    ],
  },
  {
    image: project4,
    alt: "M.T. Autozone rust proofing service on a vehicle underbody",
    title: "Rust Proofing",
    description:
      "A protective coating applied to the vehicle's underbody and other vulnerable metal surfaces from moisture and environmental conditions that cause corrosion, extending the life of your vehicle.",
    features: [
      { icon: shieldIcon, label: "corrosion protection" },
      { icon: metalIcon, label: "metal surfaces" },
      { icon: freshIcon, label: "long-lasting" },
    ],
  },
];

export default function ProjectsGrid() {
  return (
    <div className="relative isolate w-full overflow-hidden bg-black">
      {/* ============================================================
          TOP-LEFT RED GLOW
          ============================================================ */}
      <div
        aria-hidden
        className="
          pointer-events-none
          absolute left-[-5%] top-0 z-0
          h-[450px] w-[80%]
          bg-[radial-gradient(ellipse_60%_50%_at_15%_0%,rgba(228,0,0,0.55)_0%,rgba(228,0,0,0.28)_30%,rgba(228,0,0,0.1)_55%,rgba(228,0,0,0.02)_78%,transparent_100%)]
          sm:h-[550px]
          sm:w-[70%]
          lg:h-[850px]
          lg:w-[60%]
        "
      />

      {/* ============================================================
          RIGHT-SIDE RED GLOW
          ============================================================ */}
      <div
        aria-hidden
        className="
          pointer-events-none
          absolute
          right-[-5%]
          top-1/2
          z-0
          h-[1000px]
          w-[500px]
          -translate-y-1/2
          rounded-full
          bg-[radial-gradient(ellipse_at_center,rgba(228,0,0,0.45)_0%,rgba(228,0,0,0.22)_35%,rgba(228,0,0,0.08)_60%,transparent_80%)]
          blur-[20px]
        "
      />

      {/* ============================================================
          SAME CONTAINER AS OUR WORKS
          
          This makes the project grid start/end at exactly the same
          horizontal points as the OurWorks section.
          ============================================================ */}
      <div
        className="
          relative z-10
          mx-auto
          flex
          w-full
          max-w-[1464px]
          flex-col
          px-4
          pt-6
          pb-12
          sm:px-6
          sm:pt-8
          sm:pb-16
          md:pt-10
          md:pb-20
          lg:px-0
          lg:pt-60
        "
      >
        {/* ==========================================================
            PROJECT GRID
            ========================================================== */}
        <div
          className="
            relative z-10
            grid
            w-full
            grid-cols-1
            gap-x-5
            gap-y-4
            sm:gap-x-6
            sm:gap-y-5
            lg:grid-cols-2
            lg:gap-x-[23px]
            lg:gap-y-6
          "
        >
          {projects.map((project) => (
            <div
              key={project.title}
              className="
                group
                relative
                h-[380px]
                w-full
                overflow-hidden
                rounded-[20px]
                sm:h-[450px]
                lg:h-[511px]
              "
            >
              {/* ==================================================
                  BACKGROUND IMAGE
                  ================================================== */}
              <Image
                src={project.image}
                alt={project.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 722px"
                className="
                  object-cover
                  transition-transform
                  duration-500
                  ease-out
                  group-hover:scale-105
                "
              />

              {/* ==================================================
                  LEFT DARK GRADIENT
                  ================================================== */}
              <div
                aria-hidden
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  bg-[linear-gradient(270deg,rgba(0,0,0,0)_-2.84%,rgba(0,0,0,0.79)_100%)]
                "
              />

              {/* ==================================================
                  BOTTOM DARK GRADIENT
                  ================================================== */}
              <div
                aria-hidden
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-black/70
                  via-black/10
                  to-transparent
                "
              />

              {/* ==================================================
                  CONTENT
                  
                  NO RIGHT PADDING
                  ================================================== */}
              <div
                className="
                  relative
                  z-10
                  flex
                  h-full
                  flex-col
                  justify-end
                  pt-[120px]
                  pb-6
                  pl-6
                  pr-0
                  sm:pt-[160px]
                  sm:pb-8
                  sm:pl-7
                  sm:pr-0
                  lg:pt-[207px]
                  lg:pb-[30px]
                  lg:pl-8
                  lg:pr-0
                "
              >
                {/* Title */}
                <h3
                  className="
                    mb-3
                    max-w-[479px]
                    font-poppins
                    text-xl
                    font-medium
                    leading-none
                    tracking-normal
                    text-white
                    sm:mb-4
                    sm:text-2xl
                    lg:text-[28px]
                  "
                >
                  {project.title}
                </h3>

                {/* Description */}
                <p
                  className="
                    mb-4
                    max-w-[479px]
                    font-poppins
                    text-sm
                    font-normal
                    leading-[150%]
                    tracking-normal
                    text-[#D3D3D3]
                    sm:mb-5
                    lg:text-base
                  "
                >
                  {project.description}
                </p>

                {/* Divider */}
                <div
                  className="
                    mb-4
                    h-px
                    w-full
                    bg-white/20
                    sm:mb-5
                  "
                />

                {/* Features */}
                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    gap-5
                    sm:gap-6
                  "
                >
                  {project.features.map((feature, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4"
                    >
                      <Image
                        src={feature.icon}
                        alt=""
                        width={20}
                        height={20}
                        className="
                          h-[30px]
                          w-[30px]
                          shrink-0
                          object-contain
                        "
                      />

                      <span
                        className="
                          max-w-[80px]
                          font-poppins
                          text-xs
                          font-normal
                          leading-[150%]
                          text-white
                          sm:text-sm
                        "
                      >
                        {feature.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}