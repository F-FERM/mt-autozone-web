import {
  Settings,
  CheckCircle2,
  Wrench,
  ShieldCheck,
  Hammer,
  Users,
  Clock,
  Star,
  Layers,
  Leaf,
  Award,
  Scissors,
  Newspaper,
  Trophy,
  type LucideIcon,
} from "lucide-react";

// Font Awesome class (from API) -> lucide-react icon. Extend this map as the
// backend adds new icon values; unmapped icons fall back to the provided
// fallback (defaults to Settings).
export const ICON_MAP: Record<string, LucideIcon> = {
  "fa-hammer": Hammer,
  "fa-people-arrows": Users,
  "fa-clock": Clock,
  "fa-star": Star,
  "fa-check-circle": CheckCircle2,
  "fa-wrench": Wrench,
  "fa-shield-check": ShieldCheck,
  "fa-gear": Settings,
  "fa-cog": Settings,
  "fa-layer-group": Layers,
  "fa-leaf": Leaf,
  "fa-award": Award,
  "fa-scissors": Scissors,
  "fa-newspaper": Newspaper,
  "fa-trophy": Trophy,
};

export function resolveIcon(faIconClass: string, fallback: LucideIcon = Settings): LucideIcon {
  const key = (faIconClass || "")
    .split(" ")
    .find((part) => part.startsWith("fa-") && part !== "fa-solid" && part !== "fa-regular");
  return (key && ICON_MAP[key]) || fallback;
}