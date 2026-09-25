"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  UploadCloud,
  ImagePlus,
  Search,
  CircleDot,
  Save,
  Layers,
  ArrowUp,
  ArrowDown,
  ImageIcon,
  Sparkles,
  Highlighter,
  List,
  Tag,
} from "lucide-react";

import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { fileUpload } from "@/app/api/admin/upload/upload";

// ================= TYPES =================

interface DescriptionSegment {
  text: string;
  highlight: boolean;
}

interface ServiceFeature {
  _id?: string;
  title: string;
  icon: string; // URL to uploaded icon image
  order: number;
  isActive: boolean;
}

interface ServiceCard {
  _id?: string;
  title: string;
  description: string;
  image: string;
  features: ServiceFeature[];
  order: number;
  isActive: boolean;
}

export interface HomeAboutResponse {
  sectionLabel: string;
  title: string;
  description: DescriptionSegment[];
  image: string;
  imageTwo: string;
  imageThree: string;
  buttonText: string;
  buttonLink: string;
  serviceCards: ServiceCard[];
  isActive: boolean;
}

interface HomeAboutData extends HomeAboutResponse {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

// ================= HELPERS =================

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Strip `_id` from nested serviceCards and their features before sending
 * to the API — backend regenerates them and rejects them in the payload.
 */
function stripNestedIds<T extends { serviceCards?: unknown[] }>(obj: T): T {
  const clone = deepClone(obj);
  if (Array.isArray(clone.serviceCards)) {
    clone.serviceCards = clone.serviceCards.map((card) => {
      const c = card as Record<string, unknown>;
      const { _id, ...cardRest } = c;
      const cleanedCard: Record<string, unknown> = { ...cardRest };
      if (Array.isArray(c.features)) {
        cleanedCard.features = (c.features as unknown[]).map((feat) => {
          const f = feat as Record<string, unknown>;
          const { _id: _fid, ...featRest } = f;
          return featRest;
        });
      }
      return cleanedCard;
    });
  }
  return clone;
}

function extractErrorMessage(err: unknown, fallback: string): string {
  const e = err as {
    response?: { data?: { message?: string | string[] } };
  };
  const msg = e?.response?.data?.message;
  if (Array.isArray(msg)) {
    return msg.length > 0 ? msg[0] : fallback;
  }
  return msg || fallback;
}

/**
 * Normalize upload response into a URL string.
 * Handles { url }, { secure_url }, { data: { url } }, etc.
 */
function extractUploadedUrl(result: unknown): string {
  if (!result) return "";
  if (typeof result === "string") return result;

  const r = result as Record<string, unknown>;

  if (typeof r.url === "string") return r.url;
  if (typeof r.secure_url === "string") return r.secure_url;
  if (typeof r.image === "string") return r.image;
  if (typeof r.imageUrl === "string") return r.imageUrl;
  if (typeof r.path === "string") return r.path;
  if (typeof r.data === "string") return r.data;

  if (r.data && typeof r.data === "object") {
    return extractUploadedUrl(r.data);
  }
  if (r.result && typeof r.result === "object") {
    return extractUploadedUrl(r.result);
  }

  return "";
}

const EMPTY_FEATURE: ServiceFeature = {
  title: "",
  icon: "",
  order: 0,
  isActive: true,
};

const EMPTY_SERVICE: ServiceCard = {
  title: "",
  description: "",
  image: "",
  features: [],
  order: 0,
  isActive: true,
};

const EMPTY_FORM: HomeAboutResponse = {
  sectionLabel: "About Us",
  title: "",
  description: [],
  image: "",
  imageTwo: "",
  imageThree: "",
  buttonText: "View More",
  buttonLink: "/about",
  serviceCards: [],
  isActive: true,
};

// ================= SMALL UI HELPERS =================

function Field({
  label,
  children,
  hasChanged = false,
}: {
  label: string;
  children: React.ReactNode;
  hasChanged?: boolean;
}) {
  return (
    <div className="flex flex-col gap-[4px]">
      <div className="flex items-center gap-[6px]">
        <label className="text-[11px] font-semibold uppercase tracking-widest text-[#888888]">
          {label}
        </label>
        {hasChanged && (
          <span className="flex items-center gap-[4px] text-[10px] font-medium text-[#EA580C]">
            <CircleDot className="h-[10px] w-[10px] fill-[#EA580C]" />
            Changed
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

const inputCls =
  "w-full rounded-[10px] border border-[#E4C9B4] bg-white px-[12px] py-[9px] text-[13px] text-[#111111] placeholder:text-[#BBBBBB] focus:border-[#EA580C] focus:outline-none transition-colors";

const inputChangedCls =
  "w-full rounded-[10px] border-2 border-[#EA580C] bg-[#FFF9F4] px-[12px] py-[9px] text-[13px] text-[#111111] placeholder:text-[#BBBBBB] focus:border-[#EA580C] focus:outline-none transition-colors";

const textareaCls =
  "w-full rounded-[10px] border border-[#E4C9B4] bg-white px-[12px] py-[9px] text-[13px] text-[#111111] placeholder:text-[#BBBBBB] focus:border-[#EA580C] focus:outline-none transition-colors resize-y min-h-[80px]";

const textareaChangedCls =
  "w-full rounded-[10px] border-2 border-[#EA580C] bg-[#FFF9F4] px-[12px] py-[9px] text-[13px] text-[#111111] placeholder:text-[#BBBBBB] focus:border-[#EA580C] focus:outline-none transition-colors resize-y min-h-[80px]";

// ================= IMAGE UPLOAD =================

function ImageUpload({
  value,
  onChange,
  label,
  uploading,
  setUploading,
  hasChanged = false,
  aspect = "wide",
}: {
  value: string;
  onChange: (url: string) => void;
  label: string;
  uploading: boolean;
  setUploading: (loading: boolean) => void;
  hasChanged?: boolean;
  aspect?: "square" | "wide";
}) {
  const inputId = useMemo(
    () =>
      `upload-${label.replace(/\s/g, "-")}-${Math.random()
        .toString(36)
        .slice(2, 9)}`,
    [label],
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const result = await fileUpload(file);
      const url = extractUploadedUrl(result);
      if (!url) {
        toast.error("Upload succeeded but no URL was returned");
        return;
      }
      onChange(url);
      toast.success("Image uploaded");
    } catch (err: unknown) {
      toast.error(extractErrorMessage(err, "Failed to upload image"));
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const heightCls = aspect === "wide" ? "h-[140px] sm:h-[160px]" : "h-[100px]";

  return (
    <div>
      <div className="mb-[6px] flex items-center gap-[6px]">
        <Label className="text-[12px] font-medium text-[#2A2A2A]">{label}</Label>
        {hasChanged && (
          <span className="flex items-center gap-[4px] text-[10px] font-medium text-[#EA580C]">
            <CircleDot className="h-[10px] w-[10px] fill-[#EA580C]" />
            Changed
          </span>
        )}
      </div>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        id={inputId}
        onChange={handleFileUpload}
      />
      <div
        onClick={() => !uploading && document.getElementById(inputId)?.click()}
        className={`
          relative flex ${heightCls} w-full cursor-pointer items-center justify-center overflow-hidden rounded-[12px] border border-dashed border-[#E4C9B4] bg-[#FFF9F4] transition-colors hover:bg-[#FFF4EC]
          ${uploading ? "pointer-events-none opacity-70" : ""}
          ${hasChanged ? "border-2 border-[#EA580C] bg-[#FFF9F4]" : ""}
        `}
      >
        {value ? (
          <>
            <Image
              src={value}
              alt={label}
              fill
              unoptimized
              className="object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-opacity hover:bg-black/40 hover:opacity-100">
              <span className="flex items-center gap-[6px] text-[13px] font-medium text-white">
                <ImagePlus className="h-[14px] w-[14px]" />
                Change
              </span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-[4px] text-[#C2410C]">
            <UploadCloud className="h-[20px] w-[20px]" />
            <span className="text-[11px] font-medium">Upload image</span>
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
            <Loader2 className="h-[20px] w-[20px] animate-spin text-[#EA580C]" />
          </div>
        )}
      </div>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or paste image URL"
        className={`mt-[4px] h-[36px] rounded-[10px] border-[#E4E4E4] bg-white text-[12px] focus-visible:ring-[#EA580C]/30 ${
          hasChanged ? "border-2 border-[#EA580C] bg-[#FFF9F4]" : ""
        }`}
      />
    </div>
  );
}

// ================= ICON UPLOAD =================

function IconUpload({
  value,
  onChange,
  uploading,
  setUploading,
  hasChanged = false,
}: {
  value: string;
  onChange: (url: string) => void;
  uploading: boolean;
  setUploading: (loading: boolean) => void;
  hasChanged?: boolean;
}) {
  const inputId = useMemo(
    () => `icon-upload-${Math.random().toString(36).slice(2, 11)}`,
    [],
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const result = await fileUpload(file);
      const url = extractUploadedUrl(result);
      if (!url) {
        toast.error("Upload succeeded but no URL was returned");
        return;
      }
      onChange(url);
      toast.success("Icon uploaded");
    } catch (err: unknown) {
      toast.error(extractErrorMessage(err, "Failed to upload icon"));
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="flex items-center gap-[6px]">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        id={inputId}
        onChange={handleFileUpload}
      />
      <button
        type="button"
        onClick={() => !uploading && document.getElementById(inputId)?.click()}
        className={`
          relative flex h-[40px] w-[40px] shrink-0 items-center justify-center overflow-hidden rounded-[8px] border border-dashed border-[#E4C9B4] bg-[#FFF9F4] transition-colors hover:bg-[#FFF4EC]
          ${uploading ? "pointer-events-none opacity-70" : ""}
          ${hasChanged ? "border-2 border-[#EA580C]" : ""}
        `}
        title="Upload feature icon"
      >
        {value ? (
          <Image
            src={value}
            alt="Feature icon"
            fill
            unoptimized
            sizes="40px"
            className="object-contain p-[4px]"
          />
        ) : uploading ? (
          <Loader2 className="h-[16px] w-[16px] animate-spin text-[#EA580C]" />
        ) : (
          <UploadCloud className="h-[16px] w-[16px] text-[#C2410C]" />
        )}
      </button>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Icon URL"
        className={`${inputCls} flex-1 text-[12px]`}
      />
    </div>
  );
}

// ================= ITEM CARD =================

function ItemCard({
  title,
  onRemove,
  children,
  extraActions,
}: {
  title: string;
  onRemove: () => void;
  children: React.ReactNode;
  extraActions?: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="overflow-hidden rounded-[12px] border border-[#E4C9B4] bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-[14px] py-[11px] text-left"
      >
        <span className="truncate text-[13px] font-medium text-[#333333]">
          {title}
        </span>
        <div className="flex items-center gap-[8px]">
          {extraActions}
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            onKeyDown={(e) =>
              e.key === "Enter" && (e.stopPropagation(), onRemove())
            }
            className="rounded-[6px] p-[4px] text-[#DC2626] transition-colors hover:bg-red-50"
          >
            <Trash2 className="h-[13px] w-[13px]" />
          </span>
          <ChevronDownIcon
            className={`h-[14px] w-[14px] text-[#888888] transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>
      {open && (
        <div className="border-t border-[#F1E4D8] p-[14px]">{children}</div>
      )}
    </div>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-[6px] self-start rounded-[10px] border border-dashed border-[#E4C9B4] px-[14px] py-[9px] text-[12px] font-medium text-[#C2410C] transition-colors hover:border-[#EA580C] hover:bg-[#FFF4EC]"
    >
      <Plus className="h-[13px] w-[13px]" />
      {label}
    </button>
  );
}

// ================= DESCRIPTION EDITOR =================

function DescriptionEditor({
  segments,
  onChange,
  hasChanged = false,
}: {
  segments: DescriptionSegment[];
  onChange: (segments: DescriptionSegment[]) => void;
  hasChanged?: boolean;
}) {
  const updateSegment = (
    idx: number,
    key: keyof DescriptionSegment,
    val: string | boolean,
  ) => {
    const copy = segments.map((s, i) =>
      i === idx ? { ...s, [key]: val } : s,
    );
    onChange(copy);
  };

  const addSegment = () => {
    onChange([...segments, { text: "", highlight: false }]);
  };

  const removeSegment = (idx: number) => {
    onChange(segments.filter((_, i) => i !== idx));
  };

  const moveSegment = (idx: number, dir: "up" | "down") => {
    const newIdx = dir === "up" ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= segments.length) return;
    const copy = [...segments];
    const [moved] = copy.splice(idx, 1);
    copy.splice(newIdx, 0, moved);
    onChange(copy);
  };

  return (
    <div className="flex flex-col gap-[10px]">
      <div className="flex items-center gap-[6px]">
        <Label className="text-[11px] font-semibold uppercase tracking-widest text-[#888888]">
          Description Segments
        </Label>
        {hasChanged && (
          <span className="flex items-center gap-[4px] text-[10px] font-medium text-[#EA580C]">
            <CircleDot className="h-[10px] w-[10px] fill-[#EA580C]" />
            Changed
          </span>
        )}
      </div>
      <p className="text-[10px] text-[#888888]">
        Split text into segments. Toggle "Highlight" to emphasize brand name or
        key phrases.
      </p>

      {segments.map((seg, idx) => (
        <div
          key={idx}
          className="rounded-[10px] border border-[#E4C9B4] bg-white p-[10px]"
        >
          <div className="mb-[6px] flex items-center justify-between">
            <span className="text-[10px] font-medium text-[#999]">
              Segment {idx + 1}
              {seg.highlight && (
                <span className="ml-[6px] rounded-full bg-[#EA580C]/10 px-[6px] py-[1px] text-[9px] text-[#EA580C]">
                  Highlight
                </span>
              )}
            </span>
            <div className="flex items-center gap-[4px]">
              <button
                type="button"
                onClick={() => moveSegment(idx, "up")}
                disabled={idx === 0}
                className="rounded-[6px] p-[4px] text-[#666] transition-colors hover:bg-[#FFF4EC] disabled:opacity-30"
              >
                <ArrowUp className="h-[12px] w-[12px]" />
              </button>
              <button
                type="button"
                onClick={() => moveSegment(idx, "down")}
                disabled={idx === segments.length - 1}
                className="rounded-[6px] p-[4px] text-[#666] transition-colors hover:bg-[#FFF4EC] disabled:opacity-30"
              >
                <ArrowDown className="h-[12px] w-[12px]" />
              </button>
              <button
                type="button"
                onClick={() => removeSegment(idx)}
                className="rounded-[6px] p-[4px] text-[#DC2626] transition-colors hover:bg-red-50"
              >
                <Trash2 className="h-[12px] w-[12px]" />
              </button>
            </div>
          </div>

          <textarea
            className={textareaCls}
            rows={3}
            value={seg.text}
            onChange={(e) => updateSegment(idx, "text", e.target.value)}
            placeholder="Enter segment text..."
          />

          <div className="mt-[6px] flex items-center gap-[8px]">
            <Switch
              checked={seg.highlight}
              onCheckedChange={(checked) =>
                updateSegment(idx, "highlight", checked)
              }
            />
            <span className="flex items-center gap-[4px] text-[11px] text-[#666]">
              <Highlighter className="h-[11px] w-[11px]" />
              Highlight this segment
            </span>
          </div>
        </div>
      ))}

      <AddButton onClick={addSegment} label="Add Segment" />
    </div>
  );
}

// ================= EDIT MODAL =================

function HomeAboutEditModal({
  data: initialData,
  onClose,
  onSaved,
}: {
  data: HomeAboutData;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<HomeAboutData>(() => {
    const cloned = deepClone(initialData);
    if (!cloned.description) cloned.description = [];
    if (!cloned.serviceCards) cloned.serviceCards = [];
    cloned.serviceCards = cloned.serviceCards.map((c) => ({
      ...c,
      features: Array.isArray(c.features) ? c.features : [],
    }));
    return cloned;
  });
  const [originalForm] = useState<HomeAboutData>(() => deepClone(initialData));
  const [saving, setSaving] = useState(false);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingImageTwo, setUploadingImageTwo] = useState(false);
  const [uploadingImageThree, setUploadingImageThree] = useState(false);

  const [uploadingServiceImage, setUploadingServiceImage] = useState<
    number | null
  >(null);
  const [uploadingFeatureIcon, setUploadingFeatureIcon] = useState<{
    cIdx: number;
    fIdx: number;
  } | null>(null);

  const hasChanged = (path: string): boolean => {
    const keys = path.split(".");
    let formValue: unknown = form;
    let originalValue: unknown = originalForm;
    for (const key of keys) {
      if (formValue === undefined || formValue === null) return false;
      if (originalValue === undefined || originalValue === null) return false;
      formValue = (formValue as Record<string, unknown>)[key];
      originalValue = (originalValue as Record<string, unknown>)[key];
    }
    return JSON.stringify(formValue) !== JSON.stringify(originalValue);
  };

  const setField = (path: string, value: unknown) => {
    setForm((prev) => {
      const clone = deepClone(prev);
      const keys = path.split(".");
      let cur: Record<string, unknown> = clone as unknown as Record<
        string,
        unknown
      >;
      for (let i = 0; i < keys.length - 1; i++) {
        cur = cur[keys[i]] as Record<string, unknown>;
      }
      cur[keys[keys.length - 1]] = value;
      return clone;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { _id, __v, createdAt, updatedAt, ...cleanPayload } =
        form as HomeAboutData & { __v?: number };

      const payload = stripNestedIds(cleanPayload);

      await api.patch(`/home-about/${form._id}`, payload);
      toast.success("Home about updated successfully!");
      onSaved();
      onClose();
    } catch (err: unknown) {
      toast.error(extractErrorMessage(err, "Failed to update home about"));
    } finally {
      setSaving(false);
    }
  };

  // ---- service card ops ----
  const updateService = (
    idx: number,
    key: keyof ServiceCard,
    val: unknown,
  ) => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (!clone.serviceCards) clone.serviceCards = [];
      if (!clone.serviceCards[idx])
        clone.serviceCards[idx] = { ...EMPTY_SERVICE };
      (clone.serviceCards[idx] as unknown as Record<string, unknown>)[key] =
        val;
      return clone;
    });
  };

  const addService = () => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (!clone.serviceCards) clone.serviceCards = [];
      clone.serviceCards.push({
        ...deepClone(EMPTY_SERVICE),
        order: clone.serviceCards.length,
      });
      return clone;
    });
  };

  const removeService = (idx: number) => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (clone.serviceCards) {
        clone.serviceCards.splice(idx, 1);
        clone.serviceCards = clone.serviceCards.map((s, i) => ({
          ...s,
          order: i,
        }));
      }
      return clone;
    });
  };

  const moveService = (idx: number, dir: "up" | "down") => {
    const newIdx = dir === "up" ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= form.serviceCards.length) return;
    setForm((prev) => {
      const clone = deepClone(prev);
      if (!clone.serviceCards) return clone;
      const [moved] = clone.serviceCards.splice(idx, 1);
      clone.serviceCards.splice(newIdx, 0, moved);
      clone.serviceCards = clone.serviceCards.map((s, i) => ({
        ...s,
        order: i,
      }));
      return clone;
    });
  };

  // ---- feature ops ----
  const updateFeature = (
    cIdx: number,
    fIdx: number,
    key: keyof ServiceFeature,
    val: unknown,
  ) => {
    setForm((prev) => {
      const clone = deepClone(prev);
      const card = clone.serviceCards[cIdx];
      if (!card.features) card.features = [];
      if (!card.features[fIdx]) card.features[fIdx] = { ...EMPTY_FEATURE };
      (card.features[fIdx] as unknown as Record<string, unknown>)[key] = val;
      return clone;
    });
  };

  const addFeature = (cIdx: number) => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (!clone.serviceCards[cIdx].features)
        clone.serviceCards[cIdx].features = [];
      clone.serviceCards[cIdx].features.push({
        ...deepClone(EMPTY_FEATURE),
        order: clone.serviceCards[cIdx].features.length,
      });
      return clone;
    });
  };

  const removeFeature = (cIdx: number, fIdx: number) => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (clone.serviceCards[cIdx]?.features) {
        clone.serviceCards[cIdx].features.splice(fIdx, 1);
        clone.serviceCards[cIdx].features = clone.serviceCards[
          cIdx
        ].features.map((f, i) => ({ ...f, order: i }));
      }
      return clone;
    });
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-[3px] sm:items-center sm:p-[16px]"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.22 }}
        className="relative flex w-full max-w-[960px] flex-col overflow-hidden rounded-t-[24px] bg-[#FFF4EC] shadow-2xl sm:max-h-[92vh] sm:rounded-[24px]"
        style={{ maxHeight: "92dvh" }}
      >
        {/* HEADER */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#E4C9B4] bg-white px-[20px] py-[14px] sm:px-[28px] sm:py-[16px]">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-widest text-[#EA580C]">
              Edit Home About
            </p>
            <h2 className="mt-[1px] text-[16px] font-semibold text-[#111111] sm:text-[18px]">
              {form.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-[7px] text-[#888888] transition-colors hover:bg-[#F1E4D8] hover:text-[#111111]"
          >
            <X className="h-[18px] w-[18px]" />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-[20px] sm:p-[28px]">
          <div className="flex flex-col gap-[20px]">
            {/* SECTION HEADER */}
            <div className="rounded-[14px] border border-[#E4C9B4] bg-white p-[16px]">
              <h3 className="mb-[14px] flex items-center gap-[8px] text-[13px] font-semibold text-[#111111] sm:text-[14px]">
                <Layers className="h-[15px] w-[15px] text-[#EA580C]" />
                Section Header
              </h3>

              <div className="grid gap-[14px] sm:grid-cols-2">
                <Field
                  label="Section Label"
                  hasChanged={hasChanged("sectionLabel")}
                >
                  <input
                    className={
                      hasChanged("sectionLabel") ? inputChangedCls : inputCls
                    }
                    value={form.sectionLabel}
                    onChange={(e) => setField("sectionLabel", e.target.value)}
                    placeholder="About Us"
                  />
                </Field>

                <Field label="Title" hasChanged={hasChanged("title")}>
                  <input
                    className={hasChanged("title") ? inputChangedCls : inputCls}
                    value={form.title}
                    onChange={(e) => setField("title", e.target.value)}
                    placeholder="About MT Auto Zone"
                  />
                </Field>

                <div className="sm:col-span-2">
                  <DescriptionEditor
                    segments={form.description}
                    onChange={(segs) => setField("description", segs)}
                    hasChanged={hasChanged("description")}
                  />
                </div>

                <div className="sm:col-span-2">
                  <ImageUpload
                    value={form.image}
                    onChange={(url) => setField("image", url)}
                    label="Image 1"
                    uploading={uploadingImage}
                    setUploading={setUploadingImage}
                    hasChanged={hasChanged("image")}
                    aspect="wide"
                  />
                </div>

                <div className="sm:col-span-2">
                  <ImageUpload
                    value={form.imageTwo}
                    onChange={(url) => setField("imageTwo", url)}
                    label="Image 2"
                    uploading={uploadingImageTwo}
                    setUploading={setUploadingImageTwo}
                    hasChanged={hasChanged("imageTwo")}
                    aspect="wide"
                  />
                </div>

                <div className="sm:col-span-2">
                  <ImageUpload
                    value={form.imageThree}
                    onChange={(url) => setField("imageThree", url)}
                    label="Image 3"
                    uploading={uploadingImageThree}
                    setUploading={setUploadingImageThree}
                    hasChanged={hasChanged("imageThree")}
                    aspect="wide"
                  />
                </div>

                <Field
                  label="Button Text"
                  hasChanged={hasChanged("buttonText")}
                >
                  <input
                    className={
                      hasChanged("buttonText") ? inputChangedCls : inputCls
                    }
                    value={form.buttonText}
                    onChange={(e) => setField("buttonText", e.target.value)}
                    placeholder="View More"
                  />
                </Field>

                <Field
                  label="Button Link"
                  hasChanged={hasChanged("buttonLink")}
                >
                  <input
                    className={
                      hasChanged("buttonLink") ? inputChangedCls : inputCls
                    }
                    value={form.buttonLink}
                    onChange={(e) => setField("buttonLink", e.target.value)}
                    placeholder="/about"
                  />
                </Field>

                <div className="flex items-center gap-[10px] sm:col-span-2">
                  <Switch
                    checked={form.isActive}
                    onCheckedChange={(checked) =>
                      setField("isActive", checked)
                    }
                  />
                  <Label className="text-[13px] font-medium text-[#2A2A2A]">
                    Section Active
                  </Label>
                  {hasChanged("isActive") && (
                    <CircleDot className="h-[10px] w-[10px] fill-[#EA580C] text-[#EA580C]" />
                  )}
                </div>
              </div>
            </div>

            {/* SERVICE CARDS */}
            <div className="rounded-[14px] border border-[#E4C9B4] bg-white p-[16px]">
              <div className="mb-[14px] flex flex-wrap items-center justify-between gap-[8px]">
                <h3 className="flex items-center gap-[8px] text-[13px] font-semibold text-[#111111] sm:text-[14px]">
                  <List className="h-[15px] w-[15px] text-[#EA580C]" />
                  Service Cards ({form.serviceCards.length})
                </h3>
                {hasChanged("serviceCards") && (
                  <span className="flex items-center gap-[4px] text-[10px] font-medium text-[#EA580C]">
                    <CircleDot className="h-[10px] w-[10px] fill-[#EA580C]" />
                    Changed
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-[12px]">
                {form.serviceCards.map((card, cIdx) => (
                  <ItemCard
                    key={card._id || cIdx}
                    title={card.title || `Card ${cIdx + 1}`}
                    onRemove={() => removeService(cIdx)}
                    extraActions={
                      <>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveService(cIdx, "up");
                          }}
                          disabled={cIdx === 0}
                          className="rounded-[6px] p-[4px] text-[#666] transition-colors hover:bg-[#FFF4EC] disabled:opacity-30"
                        >
                          <ArrowUp className="h-[13px] w-[13px]" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveService(cIdx, "down");
                          }}
                          disabled={cIdx === form.serviceCards.length - 1}
                          className="rounded-[6px] p-[4px] text-[#666] transition-colors hover:bg-[#FFF4EC] disabled:opacity-30"
                        >
                          <ArrowDown className="h-[13px] w-[13px]" />
                        </button>
                      </>
                    }
                  >
                    <div className="flex flex-col gap-[14px]">
                      <div className="grid gap-[14px] sm:grid-cols-2">
                        <div className="sm:col-span-2">
                          <Field
                            label="Title"
                            hasChanged={hasChanged(
                              `serviceCards.${cIdx}.title`,
                            )}
                          >
                            <input
                              className={
                                hasChanged(`serviceCards.${cIdx}.title`)
                                  ? inputChangedCls
                                  : inputCls
                              }
                              value={card.title}
                              onChange={(e) =>
                                updateService(cIdx, "title", e.target.value)
                              }
                              placeholder="Interior Cleaning & Detailing"
                            />
                          </Field>
                        </div>

                        <Field
                          label="Order"
                          hasChanged={hasChanged(
                            `serviceCards.${cIdx}.order`,
                          )}
                        >
                          <input
                            type="number"
                            className={
                              hasChanged(`serviceCards.${cIdx}.order`)
                                ? inputChangedCls
                                : inputCls
                            }
                            value={card.order}
                            onChange={(e) =>
                              updateService(
                                cIdx,
                                "order",
                                Number(e.target.value),
                              )
                            }
                          />
                        </Field>

                        <div className="flex items-center gap-[10px] pt-[20px]">
                          <Switch
                            checked={card.isActive}
                            onCheckedChange={(checked) =>
                              updateService(cIdx, "isActive", checked)
                            }
                          />
                          <Label className="text-[13px] font-medium text-[#2A2A2A]">
                            Active
                          </Label>
                          {hasChanged(`serviceCards.${cIdx}.isActive`) && (
                            <CircleDot className="h-[10px] w-[10px] fill-[#EA580C] text-[#EA580C]" />
                          )}
                        </div>

                        <div className="sm:col-span-2">
                          <Field
                            label="Description"
                            hasChanged={hasChanged(
                              `serviceCards.${cIdx}.description`,
                            )}
                          >
                            <textarea
                              className={
                                hasChanged(
                                  `serviceCards.${cIdx}.description`,
                                )
                                  ? textareaChangedCls
                                  : textareaCls
                              }
                              value={card.description}
                              onChange={(e) =>
                                updateService(
                                  cIdx,
                                  "description",
                                  e.target.value,
                                )
                              }
                              placeholder="Card description..."
                            />
                          </Field>
                        </div>

                        <div className="sm:col-span-2">
                          <ImageUpload
                            value={card.image}
                            onChange={(url) =>
                              updateService(cIdx, "image", url)
                            }
                            label="Card Image"
                            uploading={uploadingServiceImage === cIdx}
                            setUploading={(loading) =>
                              setUploadingServiceImage(loading ? cIdx : null)
                            }
                            hasChanged={hasChanged(
                              `serviceCards.${cIdx}.image`,
                            )}
                            aspect="wide"
                          />
                        </div>
                      </div>

                      {/* FEATURES */}
                      <div className="rounded-[10px] border border-[#F1E4D8] bg-[#FFFDFB] p-[12px]">
                        <div className="mb-[8px] flex items-center justify-between">
                          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#888888]">
                            Features ({card.features?.length ?? 0})
                          </p>
                          {hasChanged(`serviceCards.${cIdx}.features`) && (
                            <span className="flex items-center gap-[4px] text-[10px] font-medium text-[#EA580C]">
                              <CircleDot className="h-[10px] w-[10px] fill-[#EA580C]" />
                              Changed
                            </span>
                          )}
                        </div>

                        <div className="flex flex-col gap-[8px]">
                          {(card.features ?? []).map((feat, fIdx) => (
                            <div
                              key={feat._id || fIdx}
                              className="flex flex-col gap-[6px] rounded-[8px] border border-[#E4C9B4] bg-white p-[10px] sm:flex-row sm:items-center"
                            >
                              <input
                                className={`${inputCls} flex-1`}
                                value={feat.title}
                                onChange={(e) =>
                                  updateFeature(
                                    cIdx,
                                    fIdx,
                                    "title",
                                    e.target.value,
                                  )
                                }
                                placeholder="Feature title"
                              />

                              <div className="sm:w-[240px]">
                                <IconUpload
                                  value={feat.icon}
                                  onChange={(url) =>
                                    updateFeature(cIdx, fIdx, "icon", url)
                                  }
                                  uploading={
                                    uploadingFeatureIcon?.cIdx === cIdx &&
                                    uploadingFeatureIcon?.fIdx === fIdx
                                  }
                                  setUploading={(loading) =>
                                    setUploadingFeatureIcon(
                                      loading ? { cIdx, fIdx } : null,
                                    )
                                  }
                                  hasChanged={hasChanged(
                                    `serviceCards.${cIdx}.features.${fIdx}.icon`,
                                  )}
                                />
                              </div>

                              <button
                                type="button"
                                onClick={() => removeFeature(cIdx, fIdx)}
                                className="shrink-0 self-end rounded-[6px] p-[6px] text-[#DC2626] transition-colors hover:bg-red-50 sm:self-auto"
                              >
                                <Trash2 className="h-[13px] w-[13px]" />
                              </button>
                            </div>
                          ))}
                          <AddButton
                            onClick={() => addFeature(cIdx)}
                            label="Add Feature"
                          />
                        </div>
                      </div>
                    </div>
                  </ItemCard>
                ))}

                <AddButton onClick={addService} label="Add Service Card" />
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex shrink-0 items-center justify-end gap-[10px] border-t border-[#E4C9B4] bg-white px-[20px] py-[14px] sm:px-[28px]">
          <button
            onClick={onClose}
            className="rounded-[10px] border border-[#E4C9B4] bg-white px-[16px] py-[9px] text-[13px] font-medium text-[#666666] transition-colors hover:bg-[#F9EEE6]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-[7px] rounded-[10px] bg-[#EA580C] px-[18px] py-[9px] text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="h-[14px] w-[14px] animate-spin" />
            ) : (
              <Save className="h-[14px] w-[14px]" />
            )}
            Save Changes
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ================= CREATE MODAL =================

function HomeAboutCreateModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [form, setForm] = useState<HomeAboutResponse>({
    ...deepClone(EMPTY_FORM),
    description: [],
    serviceCards: [],
  });
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingImageTwo, setUploadingImageTwo] = useState(false);
  const [uploadingImageThree, setUploadingImageThree] = useState(false);
  const [uploadingServiceImage, setUploadingServiceImage] = useState<
    number | null
  >(null);
  const [uploadingFeatureIcon, setUploadingFeatureIcon] = useState<{
    cIdx: number;
    fIdx: number;
  } | null>(null);

  const setField = (path: string, value: unknown) => {
    setForm((prev) => {
      const clone = deepClone(prev);
      const keys = path.split(".");
      let cur: Record<string, unknown> = clone as unknown as Record<
        string,
        unknown
      >;
      for (let i = 0; i < keys.length - 1; i++) {
        cur = cur[keys[i]] as Record<string, unknown>;
      }
      cur[keys[keys.length - 1]] = value;
      return clone;
    });
  };

  const updateService = (
    idx: number,
    key: keyof ServiceCard,
    val: unknown,
  ) => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (!clone.serviceCards[idx])
        clone.serviceCards[idx] = { ...EMPTY_SERVICE };
      (clone.serviceCards[idx] as unknown as Record<string, unknown>)[key] =
        val;
      return clone;
    });
  };

  const addService = () => {
    setForm((prev) => ({
      ...prev,
      serviceCards: [
        ...prev.serviceCards,
        { ...deepClone(EMPTY_SERVICE), order: prev.serviceCards.length },
      ],
    }));
  };

  const removeService = (idx: number) => {
    setForm((prev) => {
      const cards = prev.serviceCards.filter((_, i) => i !== idx);
      return {
        ...prev,
        serviceCards: cards.map((c, i) => ({ ...c, order: i })),
      };
    });
  };

  const updateFeature = (
    cIdx: number,
    fIdx: number,
    key: keyof ServiceFeature,
    val: unknown,
  ) => {
    setForm((prev) => {
      const clone = deepClone(prev);
      const card = clone.serviceCards[cIdx];
      if (!card.features) card.features = [];
      if (!card.features[fIdx]) card.features[fIdx] = { ...EMPTY_FEATURE };
      (card.features[fIdx] as unknown as Record<string, unknown>)[key] = val;
      return clone;
    });
  };

  const addFeature = (cIdx: number) => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (!clone.serviceCards[cIdx].features)
        clone.serviceCards[cIdx].features = [];
      clone.serviceCards[cIdx].features.push({
        ...deepClone(EMPTY_FEATURE),
        order: clone.serviceCards[cIdx].features.length,
      });
      return clone;
    });
  };

  const removeFeature = (cIdx: number, fIdx: number) => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (clone.serviceCards[cIdx]?.features) {
        clone.serviceCards[cIdx].features.splice(fIdx, 1);
        clone.serviceCards[cIdx].features = clone.serviceCards[
          cIdx
        ].features.map((f, i) => ({ ...f, order: i }));
      }
      return clone;
    });
  };

  const handleCreate = async () => {
    if (!form.title) {
      return toast.error("Title is required");
    }
    setSaving(true);
    try {
      const payload = stripNestedIds(form);
      await api.post("/home-about", payload);
      toast.success("Home about created successfully!");
      onCreated();
      onClose();
    } catch (err: unknown) {
      toast.error(extractErrorMessage(err, "Failed to create home about"));
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-[3px] sm:items-center sm:p-[16px]"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.22 }}
        className="relative flex w-full max-w-[960px] flex-col overflow-hidden rounded-t-[24px] bg-[#FFF4EC] shadow-2xl sm:max-h-[92vh] sm:rounded-[24px]"
        style={{ maxHeight: "92dvh" }}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[#E4C9B4] bg-white px-[20px] py-[14px] sm:px-[28px] sm:py-[16px]">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-widest text-[#EA580C]">
              Create
            </p>
            <h2 className="mt-[1px] text-[16px] font-semibold text-[#111111] sm:text-[18px]">
              New Home About
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-[7px] text-[#888888] transition-colors hover:bg-[#F1E4D8] hover:text-[#111111]"
          >
            <X className="h-[18px] w-[18px]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-[20px] sm:p-[28px]">
          <div className="flex flex-col gap-[20px]">
            <div className="rounded-[14px] border border-[#E4C9B4] bg-white p-[16px]">
              <h3 className="mb-[14px] flex items-center gap-[8px] text-[13px] font-semibold text-[#111111] sm:text-[14px]">
                <Layers className="h-[15px] w-[15px] text-[#EA580C]" />
                Section Header
              </h3>
              <div className="grid gap-[14px] sm:grid-cols-2">
                <Field label="Section Label">
                  <input
                    className={inputCls}
                    value={form.sectionLabel}
                    onChange={(e) => setField("sectionLabel", e.target.value)}
                    placeholder="About Us"
                  />
                </Field>
                <Field label="Title">
                  <input
                    className={inputCls}
                    value={form.title}
                    onChange={(e) => setField("title", e.target.value)}
                    placeholder="About MT Auto Zone"
                  />
                </Field>
                <div className="sm:col-span-2">
                  <DescriptionEditor
                    segments={form.description}
                    onChange={(segs) => setField("description", segs)}
                  />
                </div>
                <div className="sm:col-span-2">
                  <ImageUpload
                    value={form.image}
                    onChange={(url) => setField("image", url)}
                    label="Image 1"
                    uploading={uploadingImage}
                    setUploading={setUploadingImage}
                    aspect="wide"
                  />
                </div>
                <div className="sm:col-span-2">
                  <ImageUpload
                    value={form.imageTwo}
                    onChange={(url) => setField("imageTwo", url)}
                    label="Image 2"
                    uploading={uploadingImageTwo}
                    setUploading={setUploadingImageTwo}
                    aspect="wide"
                  />
                </div>
                <div className="sm:col-span-2">
                  <ImageUpload
                    value={form.imageThree}
                    onChange={(url) => setField("imageThree", url)}
                    label="Image 3"
                    uploading={uploadingImageThree}
                    setUploading={setUploadingImageThree}
                    aspect="wide"
                  />
                </div>
                <Field label="Button Text">
                  <input
                    className={inputCls}
                    value={form.buttonText}
                    onChange={(e) => setField("buttonText", e.target.value)}
                    placeholder="View More"
                  />
                </Field>
                <Field label="Button Link">
                  <input
                    className={inputCls}
                    value={form.buttonLink}
                    onChange={(e) => setField("buttonLink", e.target.value)}
                    placeholder="/about"
                  />
                </Field>
                <div className="flex items-center gap-[10px] sm:col-span-2">
                  <Switch
                    checked={form.isActive}
                    onCheckedChange={(checked) =>
                      setField("isActive", checked)
                    }
                  />
                  <Label className="text-[13px] font-medium text-[#2A2A2A]">
                    Section Active
                  </Label>
                </div>
              </div>
            </div>

            <div className="rounded-[14px] border border-[#E4C9B4] bg-white p-[16px]">
              <h3 className="mb-[14px] flex items-center gap-[8px] text-[13px] font-semibold text-[#111111] sm:text-[14px]">
                <List className="h-[15px] w-[15px] text-[#EA580C]" />
                Service Cards ({form.serviceCards.length})
              </h3>
              <div className="flex flex-col gap-[12px]">
                {form.serviceCards.map((card, cIdx) => (
                  <ItemCard
                    key={cIdx}
                    title={card.title || `Card ${cIdx + 1}`}
                    onRemove={() => removeService(cIdx)}
                  >
                    <div className="flex flex-col gap-[14px]">
                      <div className="grid gap-[14px] sm:grid-cols-2">
                        <div className="sm:col-span-2">
                          <Field label="Title">
                            <input
                              className={inputCls}
                              value={card.title}
                              onChange={(e) =>
                                updateService(cIdx, "title", e.target.value)
                              }
                              placeholder="Interior Cleaning & Detailing"
                            />
                          </Field>
                        </div>
                        <div className="sm:col-span-2">
                          <Field label="Description">
                            <textarea
                              className={textareaCls}
                              value={card.description}
                              onChange={(e) =>
                                updateService(
                                  cIdx,
                                  "description",
                                  e.target.value,
                                )
                              }
                              placeholder="Card description..."
                            />
                          </Field>
                        </div>
                        <div className="sm:col-span-2">
                          <ImageUpload
                            value={card.image}
                            onChange={(url) =>
                              updateService(cIdx, "image", url)
                            }
                            label="Card Image"
                            uploading={uploadingServiceImage === cIdx}
                            setUploading={(loading) =>
                              setUploadingServiceImage(loading ? cIdx : null)
                            }
                            aspect="wide"
                          />
                        </div>
                        <div className="flex items-center gap-[10px] sm:col-span-2">
                          <Switch
                            checked={card.isActive}
                            onCheckedChange={(checked) =>
                              updateService(cIdx, "isActive", checked)
                            }
                          />
                          <Label className="text-[13px] font-medium text-[#2A2A2A]">
                            Active
                          </Label>
                        </div>
                      </div>

                      <div className="rounded-[10px] border border-[#F1E4D8] bg-[#FFFDFB] p-[12px]">
                        <p className="mb-[8px] text-[11px] font-semibold uppercase tracking-widest text-[#888888]">
                          Features ({card.features?.length ?? 0})
                        </p>
                        <div className="flex flex-col gap-[8px]">
                          {(card.features ?? []).map((feat, fIdx) => (
                            <div
                              key={fIdx}
                              className="flex flex-col gap-[6px] rounded-[8px] border border-[#E4C9B4] bg-white p-[10px] sm:flex-row sm:items-center"
                            >
                              <input
                                className={`${inputCls} flex-1`}
                                value={feat.title}
                                onChange={(e) =>
                                  updateFeature(
                                    cIdx,
                                    fIdx,
                                    "title",
                                    e.target.value,
                                  )
                                }
                                placeholder="Feature title"
                              />
                              <div className="sm:w-[240px]">
                                <IconUpload
                                  value={feat.icon}
                                  onChange={(url) =>
                                    updateFeature(cIdx, fIdx, "icon", url)
                                  }
                                  uploading={
                                    uploadingFeatureIcon?.cIdx === cIdx &&
                                    uploadingFeatureIcon?.fIdx === fIdx
                                  }
                                  setUploading={(loading) =>
                                    setUploadingFeatureIcon(
                                      loading ? { cIdx, fIdx } : null,
                                    )
                                  }
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFeature(cIdx, fIdx)}
                                className="shrink-0 self-end rounded-[6px] p-[6px] text-[#DC2626] transition-colors hover:bg-red-50 sm:self-auto"
                              >
                                <Trash2 className="h-[13px] w-[13px]" />
                              </button>
                            </div>
                          ))}
                          <AddButton
                            onClick={() => addFeature(cIdx)}
                            label="Add Feature"
                          />
                        </div>
                      </div>
                    </div>
                  </ItemCard>
                ))}
                <AddButton onClick={addService} label="Add Service Card" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-end gap-[10px] border-t border-[#E4C9B4] bg-white px-[20px] py-[14px] sm:px-[28px]">
          <button
            onClick={onClose}
            className="rounded-[10px] border border-[#E4C9B4] bg-white px-[16px] py-[9px] text-[13px] font-medium text-[#666666] transition-colors hover:bg-[#F9EEE6]"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={saving}
            className="flex items-center gap-[7px] rounded-[10px] bg-[#EA580C] px-[18px] py-[9px] text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="h-[14px] w-[14px] animate-spin" />
            ) : (
              <Save className="h-[14px] w-[14px]" />
            )}
            Create
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ================= PAGE =================

export default function HomeAboutAdmin() {
  const [data, setData] = useState<HomeAboutData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [editTarget, setEditTarget] = useState<HomeAboutData | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<HomeAboutData | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get<HomeAboutData[] | HomeAboutData>(
        "/home-about",
      );

      let list: HomeAboutData[] = [];
      if (Array.isArray(res.data)) {
        list = res.data;
      } else if (res.data && typeof res.data === "object") {
        list = [res.data as HomeAboutData];
      }

      setData(list);
    } catch (err: unknown) {
      const e = err as {
        response?: { status?: number; data?: { message?: string } };
      };
      if (e?.response?.status === 401) {
        toast.error("Unauthorized. Please sign in again.");
      } else {
        toast.error(extractErrorMessage(err, "Failed to load home about"));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const confirmDelete = (item: HomeAboutData) => setDeleteTarget(item);
  const cancelDelete = () => {
    if (deletingId) return;
    setDeleteTarget(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeletingId(deleteTarget._id);
      await api.delete(`/home-about/${deleteTarget._id}`);
      toast.success("Deleted successfully");
      setDeleteTarget(null);
      fetchData();
    } catch (err: unknown) {
      toast.error(extractErrorMessage(err, "Failed to delete"));
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = data.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sectionLabel.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <section className="min-h-screen bg-[#FFF4EC] px-[16px] py-[24px] xs:px-[20px] sm:px-[28px] sm:py-[36px] md:px-[36px] lg:px-[48px] lg:py-[48px] 2xl:px-[64px]">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "12px",
            background: "#111111",
            color: "#fff",
            fontSize: "14px",
          },
          success: { iconTheme: { primary: "#EA580C", secondary: "#fff" } },
          error: { iconTheme: { primary: "#DC2626", secondary: "#fff" } },
        }}
      />

      {/* HEADER */}
      <div className="mx-auto flex max-w-[1600px] flex-col gap-[16px] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[22px] font-semibold tracking-[-0.5px] text-[#111111] xs:text-[24px] sm:text-[28px] lg:text-[32px]">
            Home About
          </h1>
          <p className="mt-[6px] text-[13px] leading-[1.6] text-[#666666] sm:text-[14px] lg:text-[15px]">
            Manage the home about section content and its service cards.
          </p>
        </div>

        <div className="flex flex-col gap-[10px] xs:flex-row sm:gap-[12px]">
          <div className="relative">
            <Search className="absolute left-[12px] top-1/2 h-[16px] w-[16px] -translate-y-1/2 text-[#999]" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="h-[42px] w-full rounded-[12px] border-[#E4E4E4] bg-white pl-[36px] text-[13px] focus-visible:ring-[#EA580C]/30 sm:w-[220px]"
            />
          </div>
          <Button
            onClick={() => setCreateOpen(true)}
            className="flex h-[42px] items-center justify-center gap-[8px] rounded-[14px] bg-[#EA580C] text-[13px] font-medium text-white hover:bg-[#EA580C] hover:shadow-[0_14px_30px_rgba(234,88,12,0.3)] sm:h-[44px] sm:px-[20px] sm:text-[14px]"
          >
            <Plus className="h-[17px] w-[17px]" />
            Add Home About
          </Button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="mx-auto mt-[22px] max-w-[1600px] sm:mt-[28px] lg:mt-[32px]">
        {loading ? (
          <div className="flex min-h-[200px] items-center justify-center">
            <Loader2 className="h-[28px] w-[28px] animate-spin text-[#EA580C]" />
          </div>
        ) : filtered.length === 0 ? (
          <Card className="rounded-[20px] border border-dashed border-[#E4C9B4] bg-white/60">
            <CardContent className="flex flex-col items-center justify-center gap-[10px] p-[48px] text-center">
              <Sparkles className="h-[32px] w-[32px] text-[#C2410C]/50" />
              <p className="text-[14px] font-medium text-[#333333]">
                No home about found
              </p>
              <p className="text-[12px] text-[#888888]">
                Click "Add Home About" to create one.
              </p>
            </CardContent>
          </Card>
        ) : (
          <AnimatePresence>
            <div className="flex flex-col gap-[16px]">
              {filtered.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.04 }}
                >
                  <Card className="overflow-hidden rounded-[18px] border border-white/60 bg-white/80 shadow-[0_10px_40px_rgba(0,0,0,0.06)] backdrop-blur-[10px] sm:rounded-[22px]">
                    {/* IMAGE TRIO PREVIEW */}
                    <div className="grid grid-cols-3 gap-[1px] bg-white/20">
                      {[item.image, item.imageTwo, item.imageThree].map(
                        (img, i) => (
                          <div
                            key={i}
                            className="relative h-[90px] w-full overflow-hidden bg-[#F1E4D8] sm:h-[130px]"
                          >
                            {img ? (
                              <Image
                                src={img}
                                alt={`${item.title} image ${i + 1}`}
                                fill
                                unoptimized
                                sizes="(max-width: 768px) 33vw, 300px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <ImageIcon className="h-[22px] w-[22px] text-[#C2410C]/40" />
                              </div>
                            )}
                            <div className="absolute bottom-[6px] left-[6px] rounded-full bg-black/50 px-[8px] py-[2px] text-[9px] font-medium text-white">
                              #{i + 1}
                            </div>
                          </div>
                        ),
                      )}
                    </div>

                    <CardContent className="p-[16px] sm:p-[20px]">
                      {/* HEADER ROW */}
                      <div className="flex flex-wrap items-start justify-between gap-[12px] border-b border-[#E4C9B4]/30 pb-[16px]">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-[8px]">
                            {item.sectionLabel && (
                              <span className="text-[11px] font-medium uppercase tracking-widest text-[#EA580C] sm:text-[12px]">
                                {item.sectionLabel}
                              </span>
                            )}
                            <div
                              className={`rounded-full px-[9px] py-[3px] text-[10px] font-medium sm:text-[11px] ${
                                item.isActive
                                  ? "bg-[#16A34A]/90 text-white"
                                  : "bg-black/40 text-white/80"
                              }`}
                            >
                              {item.isActive ? "Active" : "Inactive"}
                            </div>
                          </div>
                          <h3 className="mt-[4px] text-[16px] font-semibold text-[#111111] sm:text-[18px]">
                            {item.title}
                          </h3>
                        </div>

                        <div className="flex shrink-0 items-center gap-[8px]">
                          <Button
                            onClick={() => setEditTarget(item)}
                            variant="outline"
                            className="h-[34px] gap-[6px] rounded-[10px] border-[#E4C9B4] bg-white px-[12px] text-[12px] font-medium text-[#C2410C] hover:bg-[#FFF4EC] hover:text-[#C2410C] sm:h-[36px] sm:text-[13px]"
                          >
                            <Pencil className="h-[13px] w-[13px]" />
                            Edit
                          </Button>
                          <Button
                            onClick={() => confirmDelete(item)}
                            variant="outline"
                            className="h-[34px] w-[34px] shrink-0 rounded-[10px] border-[#F3D0D0] bg-white p-0 text-[#DC2626] hover:bg-[#FEF2F2] hover:text-[#DC2626] sm:h-[36px] sm:w-[36px]"
                          >
                            <Trash2 className="h-[13px] w-[13px]" />
                          </Button>
                        </div>
                      </div>

                      {/* Description preview */}
                      {item.description && item.description.length > 0 && (
                        <p className="mt-[14px] line-clamp-3 text-[12px] leading-[1.6] text-[#666] sm:text-[13px]">
                          {item.description.map((seg, i) =>
                            seg.highlight ? (
                              <span
                                key={i}
                                className="font-medium text-[#EA580C]"
                              >
                                {seg.text}
                              </span>
                            ) : (
                              <span key={i}>{seg.text}</span>
                            ),
                          )}
                        </p>
                      )}

                      {/* Button preview */}
                      {item.buttonText && item.buttonLink && (
                        <div className="mt-[12px] flex items-center gap-[6px]">
                          <span className="text-[11px] font-medium text-[#EA580C] sm:text-[12px]">
                            {item.buttonText}
                          </span>
                          <span className="text-[10px] text-[#999] sm:text-[11px]">
                            → {item.buttonLink}
                          </span>
                        </div>
                      )}

                      {/* Service cards preview */}
                      <div className="mt-[16px] flex flex-wrap items-center gap-[8px]">
                        <Tag className="h-[13px] w-[13px] text-[#888]" />
                        <span className="text-[11px] font-semibold uppercase tracking-widest text-[#888888]">
                          Service Cards ({item.serviceCards?.length ?? 0})
                        </span>
                      </div>

                      <div className="mt-[10px] grid grid-cols-1 gap-[8px] xs:grid-cols-2 lg:grid-cols-3">
                        {(item.serviceCards ?? []).slice(0, 3).map((card, i) => (
                          <div
                            key={card._id || i}
                            className="flex gap-[8px] rounded-[8px] border border-[#E4C9B4] bg-white p-[8px]"
                          >
                            {card.image && (
                              <div className="relative h-[50px] w-[50px] shrink-0 overflow-hidden rounded-[6px] bg-[#F1E4D8]">
                                <Image
                                  src={card.image}
                                  alt={card.title}
                                  fill
                                  unoptimized
                                  sizes="50px"
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
                              <span className="line-clamp-1 text-[11px] font-medium text-[#333] sm:text-[12px]">
                                {card.title}
                              </span>
                              <span className="text-[9px] text-[#999] sm:text-[10px]">
                                {card.features?.length ?? 0} features
                              </span>
                            </div>
                          </div>
                        ))}
                        {(item.serviceCards?.length ?? 0) > 3 && (
                          <div className="flex items-center justify-center rounded-[8px] border border-dashed border-[#E4C9B4] bg-white p-[8px] text-[11px] text-[#888]">
                            +{(item.serviceCards?.length ?? 0) - 3} more
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>

      {/* CREATE MODAL */}
      <AnimatePresence>
        {createOpen && (
          <HomeAboutCreateModal
            onClose={() => setCreateOpen(false)}
            onCreated={fetchData}
          />
        )}
      </AnimatePresence>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {editTarget && (
          <HomeAboutEditModal
            data={editTarget}
            onClose={() => setEditTarget(null)}
            onSaved={fetchData}
          />
        )}
      </AnimatePresence>

      {/* DELETE CONFIRM */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-[16px] backdrop-blur-[4px] sm:p-[20px]"
            onClick={cancelDelete}
          >
            <motion.div
              initial={{ y: 20, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 10, opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[380px] rounded-[20px] bg-white p-[22px] shadow-[0_30px_80px_rgba(0,0,0,0.25)] sm:rounded-[22px] sm:p-[26px]"
            >
              <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#FEF2F2] sm:h-[44px] sm:w-[44px]">
                <Trash2 className="h-[19px] w-[19px] text-[#DC2626] sm:h-[20px] sm:w-[20px]" />
              </div>

              <h3 className="mt-[14px] text-[16px] font-semibold text-[#111111] sm:text-[17px]">
                Delete this home about?
              </h3>
              <p className="mt-[6px] text-[12px] leading-[1.6] text-[#666666] sm:text-[13px]">
                "{deleteTarget.title}" and its{" "}
                {deleteTarget.serviceCards?.length ?? 0} service cards will be
                permanently removed.
              </p>

              <div className="mt-[18px] flex gap-[10px] sm:mt-[20px]">
                <Button
                  variant="outline"
                  onClick={cancelDelete}
                  disabled={!!deletingId}
                  className="h-[44px] flex-1 rounded-[12px] border-[#E4E4E4] text-[14px] font-medium text-[#666666] sm:h-[46px]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDelete}
                  disabled={!!deletingId}
                  className="h-[44px] flex-1 gap-[8px] rounded-[12px] bg-[#DC2626] text-[14px] font-medium text-white hover:bg-[#DC2626] sm:h-[46px]"
                >
                  {deletingId && (
                    <Loader2 className="h-[15px] w-[15px] animate-spin" />
                  )}
                  Delete
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}