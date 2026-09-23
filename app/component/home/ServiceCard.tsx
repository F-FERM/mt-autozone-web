"use client";

import Image, { type StaticImageData } from "next/image";

// Replace these with your actual asset imports
import interiorDetailingImg from "../../../public/images/serviceshero.jpg";
import interiorCleaningImg from "../../../public/images/serviceshero.jpg";
import bodyPolishingImg from "../../../public/images/serviceshero.jpg";

import deepCleanIcon from "../../../public/images/phone.png";
import freshIcon from "../../../public/images/phone.png";
import protectionIcon from "../../../public/images/phone.png";
import dirtIcon from "../../../public/images/phone.png";
import interiorFeelIcon from "../../../public/images/phone.png";
import cleanFinishIcon from "../../../public/images/phone.png";
import shineIcon from "../../../public/images/phone.png";
import swirlsIcon from "../../../public/images/phone.png";
import glossyIcon from "../../../public/images/phone.png";

/**
 * ServiceCards
 * Figma spec: container 1464x446, 3 cards @ 425x446, gap 10px, radius 20px
 * Cards use a background photo with a dark readability overlay by default,
 * swapping to a red gradient overlay on hover.
 *
 * Titles line up on the same row across all three cards: the content block
 * is anchored under the fixed top padding (not the card bottom), so a
 * longer description on one card never pushes its title out of line with
 * the others.
 *
 * Fonts: uses Poppins — make sure it's loaded (next/font or Tailwind config)
 * and mapped to `font-poppins` in tailwind.config.
 */

interface ServiceItem {
  icon: StaticImageData;
  label: string;
}

interface ServiceCard {
  image: StaticImageData;
  title: string;
  description: string;
  items: ServiceItem[];
}

const services: ServiceCard[] = [
  {
    image: interiorDetailingImg,
    title: "Interior Cleaning & Detailing",
    description:
      "Make your car look brand new with the help of professional auto detailing that involves a detailed cleaning and finishing for a spotless, polished look.",
    items: [
      { icon: deepCleanIcon, label: "Deep Interior Clean" },
      { icon: freshIcon, label: "Fresh & Refreshed" },
      { icon: protectionIcon, label: "Long Lasting Protection" },
    ],
  },
  {
    image: interiorCleaningImg,
    title: "Interior Cleaning",
    description:
      "Experience professional car interior cleaning in Dubai, removing dirt, stains, and dust for a fresh, comfortable cabin.",
    items: [
      { icon: dirtIcon, label: "Deep Dirt Removal" },
      { icon: interiorFeelIcon, label: "Fresh Interior Feel" },
      { icon: cleanFinishIcon, label: "Clean Finish" },
    ],
  },
  {
    image: bodyPolishingImg,
    title: "Body Polishing",
    description:
      "Restore your vehicle's shine with complete body polishing, enhancing paint gloss and creating a smooth, refined exterior finish.",
    items: [
      { icon: shineIcon, label: "Restores Shine" },
      { icon: swirlsIcon, label: "Removes Fine Swirls" },
      { icon: glossyIcon, label: "Glossy Finish" },
    ],
  },
];

export default function ServiceCards() {
  return (
    <section
      className="mx-auto flex w-full max-w-[1464px] flex-col gap-4 px-4 py-10
                 sm:flex-row sm:flex-wrap sm:justify-between sm:gap-[10px] sm:px-6
                 lg:flex-nowrap"
    >
      {services.map((service) => (
        <article
          key={service.title}
          className="group relative h-[320px] w-full overflow-hidden rounded-[20px]
                     transition-transform duration-300 hover:-translate-y-1
                     sm:h-[380px] sm:w-[calc(50%-5px)]
                     lg:h-[446px] lg:w-[425px]"
        >
          <Image
            src={service.image}
            alt={service.title}
            fill
            sizes="(min-width: 1024px) 425px, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
            priority={false}
          />

          {/* default readability overlay */}
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t
                       from-black/80 via-black/30 to-transparent
                       transition-opacity duration-300 group-hover:opacity-0"
          />

          {/* hover overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-0
                       transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background:
                "linear-gradient(179.97deg, rgba(0,0,0,0) -96.67%, rgba(226,0,0,0.328) 99.97%)",
            }}
          />

          {/* content block: anchored under the top padding, not the card
              bottom — this is what keeps every card's title on the same
              line regardless of description length. Icon row sits directly
              under the description with no gap. */}
          <div
            className="relative z-10 flex h-full flex-col
                       px-6 pb-8 pt-[170px]
                       sm:pt-[210px]
                       lg:px-10 lg:pb-[50px] lg:pt-[250px]"
          >
            <h3 className="font-poppins text-[20px] font-semibold leading-none text-white sm:text-[22px]">
              {service.title}
            </h3>

            <p className="mt-3 font-poppins text-[14px] font-normal leading-snug text-[#C4C4C4] sm:text-[16px]">
              {service.description}
            </p>

            <div
              className="mt-0 flex flex-col gap-0
                         sm:h-[45px] sm:w-full sm:flex-row sm:items-center sm:justify-between"
            >
              {service.items.map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <Image
                    src={item.icon}
                    alt=""
                    width={16}
                    height={16}
                    className="h-4 w-4 shrink-0"
                  />
                  <span className="font-poppins text-[12px] font-medium leading-[160%] text-[#D3D3D3]">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}