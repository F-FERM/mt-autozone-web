// hooks/useAboutContent.ts
"use client";

import { useEffect, useState } from "react";

export interface AboutService {
  title: string;
  description: string;
  icon: string;
  link: string;
  order: number;
  _id: string;
}

export interface AboutValue {
  title: string;
  description: string;
  icon: string;
  order: number;
  _id: string;
}

export interface AboutContent {
  servicesBadge: string;
  servicesTitle: string;
  servicesDescription: string;
  services: AboutService[];
  visionTitle: string;
  visionDescription: string;
  missionTitle: string;
  missionDescription: string;
  valuesTitle: string;
  values: AboutValue[];
  whyChooseUsTitle: string;
  whyChooseUs: AboutValue[];
}

export function useAboutContent() {
  const [data, setData] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/about-content`,
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error("Failed to fetch about content");
        const json = await res.json();
        if (isMounted) setData(json);
      } catch (err) {
        if (isMounted) setError(err instanceof Error ? err.message : "Error");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  return { data, loading, error };
}