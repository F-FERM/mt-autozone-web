"use client";

import Image from "next/image";
import {
  ThumbsUp,
  ShieldCheck,
  SprayCan,
  Wind,
  Sparkles,
  Heart,
  Droplets,
} from "lucide-react";
import type { ReactNode } from "react";

type Feature = {
  icon: ReactNode;
  label: string;
};

type Card = {
  image: string;
  title: string;
  description: string;
  features: Feature[];
};

const cards: Card[] = [
  {
    image: "/images/interior-detailing.jpg",
    title: "Interior Cleaning & Detailing",
    description:
      "Make your car look brand new with the help of professional auto detailing that involves a detailed cleaning and finishing for a spotless, polished look.",
    features: [
      { icon: <ThumbsUp size={16} />, label: "Deep Interior Clean" },
      { icon: <ShieldCheck size={16} />, label: "Fresh & Refreshed" },
      { icon: <SprayCan size={16} />, label: "Long Lasting Protection" },
    ],
  },
  {
    image: "/images/interior-cleaning.jpg",
    title: "Interior Cleaning",
    description:
      "Experience professional car interior cleaning in Dubai, removing dirt, stains, and dust for a fresh, comfortable cabin.",
    features: [
      { icon: <Wind size={16} />, label: "Deep Dirt Removal" },
      { icon: <ShieldCheck size={16} />, label: "Fresh Interior Feel" },
      { icon: <Sparkles size={16} />, label: "Clean Finish" },
    ],
  },
  {
    image: "/images/body-polishing.jpg",
    title: "Body Polishing",
    description:
      "Restore your vehicle's shine with complete body polishing, enhancing paint gloss and creating a smooth, refined exterior finish.",
    features: [
      { icon: <Heart size={16} />, label: "Restores Shine" },
      { icon: <Droplets size={16} />, label: "Removes Fine Swirls" },
      { icon: <Sparkles size={16} />, label: "Glossy Finish" },
    ],
  },
];

function ServiceCard({ card }: { card: Card }) {
  return (
    <div className="group relative aspect-[3/4] w-full overflow-hidden rounded-3xl">
      {/* Background image */}
      <Image
        src={card.image}
        alt={card.title}
        fill
        sizes="(min-width: 1024px) 33vw, 100vw"
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      />

      {/* Base dark gradient, always present so text stays legible */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

      {/* Red hover gradient, fades in on hover — matches the reference card */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#7a0d0d]/95 via-[#7a0d0d]/40 to-transparent opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100" />

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-6">
        <h3 className="text-xl font-semibold text-white">{card.title}</h3>
        <p className="text-sm leading-relaxed text-white/80">
          {card.description}
        </p>

        <div className="mt-2 flex items-center gap-6">
          {card.features.map((feature) => (
            <div key={feature.label} className="flex items-center gap-2">
              <span className="text-red-500">{feature.icon}</span>
              <span className="text-xs leading-tight text-white/90">
                {feature.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ServiceCards() {
  return (
    <section className="bg-black px-6 py-16">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
        {cards.map((card) => (
          <ServiceCard key={card.title} card={card} />
        ))}
      </div>
    </section>
  );
}
