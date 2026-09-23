"use client";

interface LocationMapProps {
  mapQuery?: string;
}

export default function LocationMap({
  mapQuery = "MT Auto Zone, Al Quoz Industrial Area 1, Dubai, UAE",
}: LocationMapProps) {
  const encodedQuery = encodeURIComponent(mapQuery);

  const embedSrc = `https://www.google.com/maps?q=${encodedQuery}&output=embed`;

  return (
    <section className="relative w-full">
      <div className="relative h-[311px] w-full overflow-hidden">
        <iframe
          title="MT Auto Zone Location"
          src={embedSrc}
          className="h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />

        {/* Map overlay */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-[#00000057]" />
      </div>
    </section>
  );
}