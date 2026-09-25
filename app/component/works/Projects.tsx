"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import api from "@/lib/axios";

// Fallback image
import fallbackProject from "../../../public/images/homeservicecar.tsx.jpg";

// ================= TYPES =================

interface DescriptionSegment {
  text: string;
  highlight: boolean;
}

interface FeatureApi {
  _id?: string;
  title: string;
  icon: string; // URL to uploaded icon image
}

interface WorkApi {
  _id: string;
  title: string;
  slug: string;
  description: DescriptionSegment[];
  image: string;
  features: FeatureApi[];
  order: number;
  isActive: boolean;
}

interface WorksPageApiResponse {
  _id: string;
  works: WorkApi[];
}

interface ProjectItem {
  _id: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  features: { icon: string; label: string }[];
}

// Matches the anchor target used by the "View Works" button in OurWorks.
const PROJECTS_GRID_ID = "our-works-projects";

// ================= SKELETON =================

function ProjectsGridSkeleton() {
  return (
    <div
      id={PROJECTS_GRID_ID}
      className="relative isolate w-full overflow-hidden bg-black scroll-mt-20"
    >
      <div
        className="
          relative z-10
          mx-auto flex w-full max-w-[1464px] flex-col
          px-4 pt-6 pb-12 sm:px-6 sm:pt-8 sm:pb-16 md:px-8 md:pt-10 md:pb-20 lg:px-10 lg:pt-60 xl:px-12
        "
      >
        <div
          className="
            relative z-10 grid w-full grid-cols-1 gap-x-5 gap-y-4
            sm:gap-x-6 sm:gap-y-5 lg:grid-cols-2 lg:gap-x-[23px] lg:gap-y-6
          "
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="relative h-[380px] w-full animate-pulse overflow-hidden rounded-[20px] bg-white/5 sm:h-[450px] lg:h-[511px]"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ================= MAIN COMPONENT =================

export default function ProjectsGrid() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const res = await api.get<
          WorksPageApiResponse | WorksPageApiResponse[]
        >("/works-page");

        let apiData: WorksPageApiResponse | null = null;
        if (Array.isArray(res.data)) {
          apiData = res.data.length > 0 ? res.data[0] : null;
        } else if (res.data && typeof res.data === "object") {
          apiData = res.data;
        }

        if (!apiData?.works) {
          setProjects([]);
          return;
        }

        // Filter active works + sort by order
        const mapped: ProjectItem[] = apiData.works
          .filter((w) => w.isActive)
          .sort((a, b) => a.order - b.order)
          .map((w) => ({
            _id: w._id,
            title: w.title,
            // Join description segments into a single string
            description: Array.isArray(w.description)
              ? w.description.map((seg) => seg.text).join("")
              : "",
            image: w.image || "",
            alt: `${w.title} — M.T. Autozone`,
            features: (w.features ?? []).map((f) => ({
              icon: f.icon,
              label: f.title,
            })),
          }));

        setProjects(mapped);
      } catch (err) {
        console.error("Failed to fetch works:", err);
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorks();
  }, []);

  if (isLoading) return <ProjectsGridSkeleton />;

  if (projects.length === 0) {
    return null;
  }

  return (
    <div
      id={PROJECTS_GRID_ID}
      className="relative isolate w-full overflow-hidden bg-black scroll-mt-20"
    >
      {/* TOP-LEFT RED GLOW */}
      <div
        aria-hidden
        className="
          pointer-events-none
          absolute left-[-5%] top-0 z-0
          h-[450px] w-[80%]
          bg-[radial-gradient(ellipse_60%_50%_at_15%_0%,rgba(228,0,0,0.55)_0%,rgba(228,0,0,0.28)_30%,rgba(228,0,0,0.1)_55%,rgba(228,0,0,0.02)_78%,transparent_100%)]
          sm:h-[550px] sm:w-[70%]
          lg:h-[850px] lg:w-[60%]
        "
      />

      {/* RIGHT-SIDE RED GLOW */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute right-[-5%] top-1/2 z-0
          h-[1000px] w-[500px] -translate-y-1/2 rounded-full
          bg-[radial-gradient(ellipse_at_center,rgba(228,0,0,0.45)_0%,rgba(228,0,0,0.22)_35%,rgba(228,0,0,0.08)_60%,transparent_80%)]
          blur-[20px]
        "
      />

      {/* CONTAINER */}
      <div
        className="
          relative z-10 mx-auto flex w-full max-w-[1464px] flex-col
          px-4 pt-6 pb-12 sm:px-6 sm:pt-8 sm:pb-16 md:px-8 md:pt-10 md:pb-20 lg:px-10 lg:pt-60 xl:px-12
        "
      >
        {/* GRID */}
        <div
          className="
            relative z-10 grid w-full grid-cols-1 gap-x-5 gap-y-4
            sm:gap-x-6 sm:gap-y-5 lg:grid-cols-2 lg:gap-x-[23px] lg:gap-y-6
          "
        >
          {projects.map((project) => (
            <div
              key={project._id}
              className="
                group relative h-[380px] w-full overflow-hidden rounded-[20px]
                sm:h-[450px] lg:h-[511px]
              "
            >
              {/* BACKGROUND IMAGE */}
              {project.image ? (
                <Image
                  src={project.image}
                  alt={project.alt}
                  fill
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 722px"
                  className="
                    object-cover transition-transform duration-500 ease-out
                    group-hover:scale-105
                  "
                />
              ) : (
                <Image
                  src={fallbackProject}
                  alt={project.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 722px"
                  className="
                    object-cover transition-transform duration-500 ease-out
                    group-hover:scale-105
                  "
                />
              )}

              {/* LEFT DARK GRADIENT */}
              <div
                aria-hidden
                className="
                  pointer-events-none absolute inset-0
                  bg-[linear-gradient(270deg,rgba(0,0,0,0)_-2.84%,rgba(0,0,0,0.79)_100%)]
                "
              />

              {/* BOTTOM DARK GRADIENT */}
              <div
                aria-hidden
                className="
                  pointer-events-none absolute inset-0
                  bg-gradient-to-t from-black/70 via-black/10 to-transparent
                "
              />

              {/* CONTENT */}
              <div
                className="
                  relative z-10 flex h-full flex-col justify-end
                  pt-[120px] pb-6 pl-6 pr-0
                  sm:pt-[160px] sm:pb-8 sm:pl-7 sm:pr-0
                  lg:pt-[207px] lg:pb-[30px] lg:pl-8 lg:pr-0
                "
              >
                {/* Title */}
                <h3
                  className="
                    mb-3 max-w-[479px] font-poppins text-xl font-medium
                    leading-none tracking-normal text-white
                    sm:mb-4 sm:text-2xl lg:text-[28px]
                  "
                >
                  {project.title}
                </h3>

                {/* Description */}
                <p
                  className="
                    mb-4 max-w-[479px] font-poppins text-sm font-normal
                    leading-[150%] tracking-normal text-[#D3D3D3]
                    sm:mb-5 lg:text-base
                  "
                >
                  {project.description}
                </p>

                {/* Divider */}
                <div className="mb-4 h-px w-full bg-white/20 sm:mb-5" />

                {/* Features */}
                {project.features.length > 0 && (
                  <div className="flex flex-wrap items-center gap-5 sm:gap-6">
                    {project.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-4">
                        {feature.icon ? (
                          <div className="relative h-[30px] w-[30px] shrink-0">
                            <Image
                              src={feature.icon}
                              alt=""
                              fill
                              unoptimized
                              sizes="30px"
                              className="object-contain"
                            />
                          </div>
                        ) : (
                          <div className="h-[30px] w-[30px] shrink-0" />
                        )}

                        <span
                          className="
                            max-w-[80px] font-poppins text-xs font-normal
                            leading-[150%] text-white sm:text-sm
                          "
                        >
                          {feature.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}