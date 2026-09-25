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
  List,
  Tag,
  Settings,
} from "lucide-react";

import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { fileUpload } from "@/app/api/admin/upload/upload";

// ================= TYPES =================

interface StatFields {
  yearsOfExperience: number;
  yearsLabel: string;
  customerSatisfaction: number;
  satisfactionLabel: string;
  carsServiced: number;
  carsServicedLabel: string;
}

interface HeroService {
  _id?: string;
  title: string;
  icon: string; // URL to uploaded icon image
  order: number;
  isActive: boolean;
}

export interface HomeHeroResponse {
  eyebrow: string;
  eyebrowDescription: string;
  eyebrowImage: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  backgroundImage: string;
  stats: StatFields;
  servicesTitle: string;
  services: HeroService[];
  buttonText: string;
  buttonLink: string;
  isActive: boolean;
}

interface HomeHeroData extends HomeHeroResponse {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

// ================= HELPERS =================

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Strip `_id` from nested services before sending to API.
 */
function stripNestedIds<T extends { services?: unknown[] }>(obj: T): T {
  const clone = deepClone(obj);
  if (Array.isArray(clone.services)) {
    clone.services = clone.services.map((svc) => {
      const s = svc as Record<string, unknown>;
      const { _id, ...rest } = s;
      return rest;
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

const EMPTY_STATS: StatFields = {
  yearsOfExperience: 0,
  yearsLabel: "Years of Experience",
  customerSatisfaction: 0,
  satisfactionLabel: "Customer Satisfaction",
  carsServiced: 0,
  carsServicedLabel: "Cars Serviced",
};

const EMPTY_SERVICE: HeroService = {
  title: "",
  icon: "",
  order: 0,
  isActive: true,
};

const EMPTY_FORM: HomeHeroResponse = {
  eyebrow: "",
  eyebrowDescription: "",
  eyebrowImage: "",
  title: "",
  subtitle: "",
  description: "",
  image: "",
  backgroundImage: "",
  stats: { ...EMPTY_STATS },
  servicesTitle: "",
  services: [],
  buttonText: "Explore",
  buttonLink: "/services",
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
        title="Upload icon"
      >
        {value ? (
          <Image
            src={value}
            alt="Icon"
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

// ================= EDIT MODAL =================

function HomeHeroEditModal({
  data: initialData,
  onClose,
  onSaved,
}: {
  data: HomeHeroData;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<HomeHeroData>(() => {
    const cloned = deepClone(initialData);
    if (!cloned.stats) cloned.stats = { ...EMPTY_STATS };
    if (!cloned.services) cloned.services = [];
    return cloned;
  });
  const [originalForm] = useState<HomeHeroData>(() => deepClone(initialData));
  const [saving, setSaving] = useState(false);

  const [uploadingEyebrowImage, setUploadingEyebrowImage] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingBg, setUploadingBg] = useState(false);
  const [uploadingServiceIcon, setUploadingServiceIcon] = useState<
    number | null
  >(null);

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
        form as HomeHeroData & { __v?: number };

      const payload = stripNestedIds(cleanPayload);

      await api.patch(`/home-hero/${form._id}`, payload);
      toast.success("Home hero updated successfully!");
      onSaved();
      onClose();
    } catch (err: unknown) {
      toast.error(extractErrorMessage(err, "Failed to update home hero"));
    } finally {
      setSaving(false);
    }
  };

  // ---- service ops ----
  const updateService = (
    idx: number,
    key: keyof HeroService,
    val: unknown,
  ) => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (!clone.services) clone.services = [];
      if (!clone.services[idx]) clone.services[idx] = { ...EMPTY_SERVICE };
      (clone.services[idx] as unknown as Record<string, unknown>)[key] = val;
      return clone;
    });
  };

  const addService = () => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (!clone.services) clone.services = [];
      clone.services.push({
        ...deepClone(EMPTY_SERVICE),
        order: clone.services.length,
      });
      return clone;
    });
  };

  const removeService = (idx: number) => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (clone.services) {
        clone.services.splice(idx, 1);
        clone.services = clone.services.map((s, i) => ({ ...s, order: i }));
      }
      return clone;
    });
  };

  const moveService = (idx: number, dir: "up" | "down") => {
    const newIdx = dir === "up" ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= form.services.length) return;
    setForm((prev) => {
      const clone = deepClone(prev);
      if (!clone.services) return clone;
      const [moved] = clone.services.splice(idx, 1);
      clone.services.splice(newIdx, 0, moved);
      clone.services = clone.services.map((s, i) => ({ ...s, order: i }));
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
              Edit Home Hero
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
                <Field label="Eyebrow" hasChanged={hasChanged("eyebrow")}>
                  <input
                    className={
                      hasChanged("eyebrow") ? inputChangedCls : inputCls
                    }
                    value={form.eyebrow}
                    onChange={(e) => setField("eyebrow", e.target.value)}
                    placeholder="Premium Care. Impeccable Finish."
                  />
                </Field>

                <Field label="Title" hasChanged={hasChanged("title")}>
                  <input
                    className={hasChanged("title") ? inputChangedCls : inputCls}
                    value={form.title}
                    onChange={(e) => setField("title", e.target.value)}
                    placeholder="MT AUTO ZONE"
                  />
                </Field>

                <div className="sm:col-span-2">
                  <Field
                    label="Eyebrow Description"
                    hasChanged={hasChanged("eyebrowDescription")}
                  >
                    <Textarea
                      className={
                        hasChanged("eyebrowDescription")
                          ? textareaChangedCls
                          : textareaCls
                      }
                      value={form.eyebrowDescription}
                      onChange={(e) =>
                        setField("eyebrowDescription", e.target.value)
                      }
                      placeholder="Professional car detailing to restore..."
                    />
                  </Field>
                </div>

                <div className="sm:col-span-2">
                  <Field label="Subtitle" hasChanged={hasChanged("subtitle")}>
                    <input
                      className={
                        hasChanged("subtitle") ? inputChangedCls : inputCls
                      }
                      value={form.subtitle}
                      onChange={(e) => setField("subtitle", e.target.value)}
                      placeholder="Premium Automotive Detailing Solutions"
                    />
                  </Field>
                </div>

                <div className="sm:col-span-2">
                  <Field
                    label="Description"
                    hasChanged={hasChanged("description")}
                  >
                    <Textarea
                      className={
                        hasChanged("description")
                          ? textareaChangedCls
                          : textareaCls
                      }
                      value={form.description}
                      onChange={(e) => setField("description", e.target.value)}
                      placeholder="Elevating every vehicle with professional detailing..."
                    />
                  </Field>
                </div>

                <div className="sm:col-span-2">
                  <ImageUpload
                    value={form.eyebrowImage}
                    onChange={(url) => setField("eyebrowImage", url)}
                    label="Eyebrow Image"
                    uploading={uploadingEyebrowImage}
                    setUploading={setUploadingEyebrowImage}
                    hasChanged={hasChanged("eyebrowImage")}
                    aspect="wide"
                  />
                </div>

                <div className="sm:col-span-2">
                  <ImageUpload
                    value={form.image}
                    onChange={(url) => setField("image", url)}
                    label="Main Image"
                    uploading={uploadingImage}
                    setUploading={setUploadingImage}
                    hasChanged={hasChanged("image")}
                    aspect="wide"
                  />
                </div>

                <div className="sm:col-span-2">
                  <ImageUpload
                    value={form.backgroundImage}
                    onChange={(url) => setField("backgroundImage", url)}
                    label="Background Image"
                    uploading={uploadingBg}
                    setUploading={setUploadingBg}
                    hasChanged={hasChanged("backgroundImage")}
                    aspect="wide"
                  />
                </div>

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

            {/* STATS */}
            <div className="rounded-[14px] border border-[#E4C9B4] bg-white p-[16px]">
              <div className="mb-[14px] flex items-center justify-between">
                <h3 className="flex items-center gap-[8px] text-[13px] font-semibold text-[#111111] sm:text-[14px]">
                  <Sparkles className="h-[15px] w-[15px] text-[#EA580C]" />
                  Stats
                </h3>
                {hasChanged("stats") && (
                  <span className="flex items-center gap-[4px] text-[10px] font-medium text-[#EA580C]">
                    <CircleDot className="h-[10px] w-[10px] fill-[#EA580C]" />
                    Changed
                  </span>
                )}
              </div>

              <div className="grid gap-[14px] sm:grid-cols-2">
                <Field
                  label="Years of Experience"
                  hasChanged={hasChanged("stats.yearsOfExperience")}
                >
                  <input
                    type="number"
                    className={
                      hasChanged("stats.yearsOfExperience")
                        ? inputChangedCls
                        : inputCls
                    }
                    value={form.stats.yearsOfExperience}
                    onChange={(e) =>
                      setField(
                        "stats.yearsOfExperience",
                        Number(e.target.value),
                      )
                    }
                  />
                </Field>
                <Field
                  label="Years Label"
                  hasChanged={hasChanged("stats.yearsLabel")}
                >
                  <input
                    className={
                      hasChanged("stats.yearsLabel")
                        ? inputChangedCls
                        : inputCls
                    }
                    value={form.stats.yearsLabel}
                    onChange={(e) =>
                      setField("stats.yearsLabel", e.target.value)
                    }
                  />
                </Field>

                <Field
                  label="Customer Satisfaction"
                  hasChanged={hasChanged("stats.customerSatisfaction")}
                >
                  <input
                    type="number"
                    step="0.1"
                    className={
                      hasChanged("stats.customerSatisfaction")
                        ? inputChangedCls
                        : inputCls
                    }
                    value={form.stats.customerSatisfaction}
                    onChange={(e) =>
                      setField(
                        "stats.customerSatisfaction",
                        Number(e.target.value),
                      )
                    }
                  />
                </Field>
                <Field
                  label="Satisfaction Label"
                  hasChanged={hasChanged("stats.satisfactionLabel")}
                >
                  <input
                    className={
                      hasChanged("stats.satisfactionLabel")
                        ? inputChangedCls
                        : inputCls
                    }
                    value={form.stats.satisfactionLabel}
                    onChange={(e) =>
                      setField("stats.satisfactionLabel", e.target.value)
                    }
                  />
                </Field>

                <Field
                  label="Cars Serviced"
                  hasChanged={hasChanged("stats.carsServiced")}
                >
                  <input
                    type="number"
                    className={
                      hasChanged("stats.carsServiced")
                        ? inputChangedCls
                        : inputCls
                    }
                    value={form.stats.carsServiced}
                    onChange={(e) =>
                      setField("stats.carsServiced", Number(e.target.value))
                    }
                  />
                </Field>
                <Field
                  label="Cars Serviced Label"
                  hasChanged={hasChanged("stats.carsServicedLabel")}
                >
                  <input
                    className={
                      hasChanged("stats.carsServicedLabel")
                        ? inputChangedCls
                        : inputCls
                    }
                    value={form.stats.carsServicedLabel}
                    onChange={(e) =>
                      setField("stats.carsServicedLabel", e.target.value)
                    }
                  />
                </Field>
              </div>
            </div>

            {/* SERVICES */}
            <div className="rounded-[14px] border border-[#E4C9B4] bg-white p-[16px]">
              <div className="mb-[14px] flex flex-wrap items-center justify-between gap-[8px]">
                <h3 className="flex items-center gap-[8px] text-[13px] font-semibold text-[#111111] sm:text-[14px]">
                  <List className="h-[15px] w-[15px] text-[#EA580C]" />
                  Services ({form.services.length})
                </h3>
                {hasChanged("services") && (
                  <span className="flex items-center gap-[4px] text-[10px] font-medium text-[#EA580C]">
                    <CircleDot className="h-[10px] w-[10px] fill-[#EA580C]" />
                    Changed
                  </span>
                )}
              </div>

              <div className="mb-[14px]">
                <Field
                  label="Services Title"
                  hasChanged={hasChanged("servicesTitle")}
                >
                  <input
                    className={
                      hasChanged("servicesTitle") ? inputChangedCls : inputCls
                    }
                    value={form.servicesTitle}
                    onChange={(e) => setField("servicesTitle", e.target.value)}
                    placeholder="Premium Automotive Detailing Solutions"
                  />
                </Field>
              </div>

              <div className="flex flex-col gap-[12px]">
                {form.services.map((service, idx) => (
                  <ItemCard
                    key={service._id || idx}
                    title={service.title || `Service ${idx + 1}`}
                    onRemove={() => removeService(idx)}
                    extraActions={
                      <>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveService(idx, "up");
                          }}
                          disabled={idx === 0}
                          className="rounded-[6px] p-[4px] text-[#666] transition-colors hover:bg-[#FFF4EC] disabled:opacity-30"
                        >
                          <ArrowUp className="h-[13px] w-[13px]" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveService(idx, "down");
                          }}
                          disabled={idx === form.services.length - 1}
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
                              `services.${idx}.title`,
                            )}
                          >
                            <input
                              className={
                                hasChanged(`services.${idx}.title`)
                                  ? inputChangedCls
                                  : inputCls
                              }
                              value={service.title}
                              onChange={(e) =>
                                updateService(idx, "title", e.target.value)
                              }
                              placeholder="Complete Car Detailing & Cleaning"
                            />
                          </Field>
                        </div>

                        <Field
                          label="Order"
                          hasChanged={hasChanged(`services.${idx}.order`)}
                        >
                          <input
                            type="number"
                            className={
                              hasChanged(`services.${idx}.order`)
                                ? inputChangedCls
                                : inputCls
                            }
                            value={service.order}
                            onChange={(e) =>
                              updateService(
                                idx,
                                "order",
                                Number(e.target.value),
                              )
                            }
                          />
                        </Field>

                        <div className="flex items-center gap-[10px] pt-[20px]">
                          <Switch
                            checked={service.isActive}
                            onCheckedChange={(checked) =>
                              updateService(idx, "isActive", checked)
                            }
                          />
                          <Label className="text-[13px] font-medium text-[#2A2A2A]">
                            Active
                          </Label>
                          {hasChanged(`services.${idx}.isActive`) && (
                            <CircleDot className="h-[10px] w-[10px] fill-[#EA580C] text-[#EA580C]" />
                          )}
                        </div>

                        <div className="sm:col-span-2">
                          <Field
                            label="Icon"
                            hasChanged={hasChanged(`services.${idx}.icon`)}
                          >
                            <IconUpload
                              value={service.icon}
                              onChange={(url) =>
                                updateService(idx, "icon", url)
                              }
                              uploading={uploadingServiceIcon === idx}
                              setUploading={(loading) =>
                                setUploadingServiceIcon(loading ? idx : null)
                              }
                              hasChanged={hasChanged(
                                `services.${idx}.icon`,
                              )}
                            />
                          </Field>
                        </div>
                      </div>
                    </div>
                  </ItemCard>
                ))}

                <AddButton onClick={addService} label="Add Service" />
              </div>
            </div>

            {/* BUTTON */}
            <div className="rounded-[14px] border border-[#E4C9B4] bg-white p-[16px]">
              <h3 className="mb-[14px] flex items-center gap-[8px] text-[13px] font-semibold text-[#111111] sm:text-[14px]">
                <Settings className="h-[15px] w-[15px] text-[#EA580C]" />
                Button
              </h3>

              <div className="grid gap-[14px] sm:grid-cols-2">
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
                    placeholder="Explore"
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
                    placeholder="/services"
                  />
                </Field>
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

function HomeHeroCreateModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [form, setForm] = useState<HomeHeroResponse>({
    ...deepClone(EMPTY_FORM),
    stats: { ...EMPTY_STATS },
    services: [],
  });
  const [saving, setSaving] = useState(false);
  const [uploadingEyebrowImage, setUploadingEyebrowImage] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingBg, setUploadingBg] = useState(false);
  const [uploadingServiceIcon, setUploadingServiceIcon] = useState<
    number | null
  >(null);

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
    key: keyof HeroService,
    val: unknown,
  ) => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (!clone.services[idx]) clone.services[idx] = { ...EMPTY_SERVICE };
      (clone.services[idx] as unknown as Record<string, unknown>)[key] = val;
      return clone;
    });
  };

  const addService = () => {
    setForm((prev) => ({
      ...prev,
      services: [
        ...prev.services,
        { ...deepClone(EMPTY_SERVICE), order: prev.services.length },
      ],
    }));
  };

  const removeService = (idx: number) => {
    setForm((prev) => {
      const services = prev.services.filter((_, i) => i !== idx);
      return {
        ...prev,
        services: services.map((s, i) => ({ ...s, order: i })),
      };
    });
  };

  const handleCreate = async () => {
    if (!form.title) {
      return toast.error("Title is required");
    }
    setSaving(true);
    try {
      const payload = stripNestedIds(form);
      await api.post("/home-hero", payload);
      toast.success("Home hero created successfully!");
      onCreated();
      onClose();
    } catch (err: unknown) {
      toast.error(extractErrorMessage(err, "Failed to create home hero"));
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
              New Home Hero
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
            {/* SECTION HEADER */}
            <div className="rounded-[14px] border border-[#E4C9B4] bg-white p-[16px]">
              <h3 className="mb-[14px] flex items-center gap-[8px] text-[13px] font-semibold text-[#111111] sm:text-[14px]">
                <Layers className="h-[15px] w-[15px] text-[#EA580C]" />
                Section Header
              </h3>
              <div className="grid gap-[14px] sm:grid-cols-2">
                <Field label="Eyebrow">
                  <input
                    className={inputCls}
                    value={form.eyebrow}
                    onChange={(e) => setField("eyebrow", e.target.value)}
                    placeholder="Premium Care. Impeccable Finish."
                  />
                </Field>
                <Field label="Title">
                  <input
                    className={inputCls}
                    value={form.title}
                    onChange={(e) => setField("title", e.target.value)}
                    placeholder="MT AUTO ZONE"
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Eyebrow Description">
                    <Textarea
                      className={textareaCls}
                      value={form.eyebrowDescription}
                      onChange={(e) =>
                        setField("eyebrowDescription", e.target.value)
                      }
                      placeholder="Professional car detailing..."
                    />
                  </Field>
                </div>
                <div className="sm:col-span-2">
                  <Field label="Subtitle">
                    <input
                      className={inputCls}
                      value={form.subtitle}
                      onChange={(e) => setField("subtitle", e.target.value)}
                      placeholder="Premium Automotive Detailing Solutions"
                    />
                  </Field>
                </div>
                <div className="sm:col-span-2">
                  <Field label="Description">
                    <Textarea
                      className={textareaCls}
                      value={form.description}
                      onChange={(e) => setField("description", e.target.value)}
                      placeholder="Elevating every vehicle with professional detailing..."
                    />
                  </Field>
                </div>
                <div className="sm:col-span-2">
                  <ImageUpload
                    value={form.eyebrowImage}
                    onChange={(url) => setField("eyebrowImage", url)}
                    label="Eyebrow Image"
                    uploading={uploadingEyebrowImage}
                    setUploading={setUploadingEyebrowImage}
                    aspect="wide"
                  />
                </div>
                <div className="sm:col-span-2">
                  <ImageUpload
                    value={form.image}
                    onChange={(url) => setField("image", url)}
                    label="Main Image"
                    uploading={uploadingImage}
                    setUploading={setUploadingImage}
                    aspect="wide"
                  />
                </div>
                <div className="sm:col-span-2">
                  <ImageUpload
                    value={form.backgroundImage}
                    onChange={(url) => setField("backgroundImage", url)}
                    label="Background Image"
                    uploading={uploadingBg}
                    setUploading={setUploadingBg}
                    aspect="wide"
                  />
                </div>
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

            {/* STATS */}
            <div className="rounded-[14px] border border-[#E4C9B4] bg-white p-[16px]">
              <h3 className="mb-[14px] flex items-center gap-[8px] text-[13px] font-semibold text-[#111111] sm:text-[14px]">
                <Sparkles className="h-[15px] w-[15px] text-[#EA580C]" />
                Stats
              </h3>
              <div className="grid gap-[14px] sm:grid-cols-2">
                <Field label="Years of Experience">
                  <input
                    type="number"
                    className={inputCls}
                    value={form.stats.yearsOfExperience}
                    onChange={(e) =>
                      setField(
                        "stats.yearsOfExperience",
                        Number(e.target.value),
                      )
                    }
                  />
                </Field>
                <Field label="Years Label">
                  <input
                    className={inputCls}
                    value={form.stats.yearsLabel}
                    onChange={(e) =>
                      setField("stats.yearsLabel", e.target.value)
                    }
                  />
                </Field>
                <Field label="Customer Satisfaction">
                  <input
                    type="number"
                    step="0.1"
                    className={inputCls}
                    value={form.stats.customerSatisfaction}
                    onChange={(e) =>
                      setField(
                        "stats.customerSatisfaction",
                        Number(e.target.value),
                      )
                    }
                  />
                </Field>
                <Field label="Satisfaction Label">
                  <input
                    className={inputCls}
                    value={form.stats.satisfactionLabel}
                    onChange={(e) =>
                      setField("stats.satisfactionLabel", e.target.value)
                    }
                  />
                </Field>
                <Field label="Cars Serviced">
                  <input
                    type="number"
                    className={inputCls}
                    value={form.stats.carsServiced}
                    onChange={(e) =>
                      setField("stats.carsServiced", Number(e.target.value))
                    }
                  />
                </Field>
                <Field label="Cars Serviced Label">
                  <input
                    className={inputCls}
                    value={form.stats.carsServicedLabel}
                    onChange={(e) =>
                      setField("stats.carsServicedLabel", e.target.value)
                    }
                  />
                </Field>
              </div>
            </div>

            {/* SERVICES */}
            <div className="rounded-[14px] border border-[#E4C9B4] bg-white p-[16px]">
              <h3 className="mb-[14px] flex items-center gap-[8px] text-[13px] font-semibold text-[#111111] sm:text-[14px]">
                <List className="h-[15px] w-[15px] text-[#EA580C]" />
                Services ({form.services.length})
              </h3>

              <div className="mb-[14px]">
                <Field label="Services Title">
                  <input
                    className={inputCls}
                    value={form.servicesTitle}
                    onChange={(e) => setField("servicesTitle", e.target.value)}
                    placeholder="Premium Automotive Detailing Solutions"
                  />
                </Field>
              </div>

              <div className="flex flex-col gap-[12px]">
                {form.services.map((service, idx) => (
                  <ItemCard
                    key={idx}
                    title={service.title || `Service ${idx + 1}`}
                    onRemove={() => removeService(idx)}
                  >
                    <div className="flex flex-col gap-[12px]">
                      <Field label="Title">
                        <input
                          className={inputCls}
                          value={service.title}
                          onChange={(e) =>
                            updateService(idx, "title", e.target.value)
                          }
                          placeholder="Complete Car Detailing & Cleaning"
                        />
                      </Field>

                      <Field label="Icon">
                        <IconUpload
                          value={service.icon}
                          onChange={(url) =>
                            updateService(idx, "icon", url)
                          }
                          uploading={uploadingServiceIcon === idx}
                          setUploading={(loading) =>
                            setUploadingServiceIcon(loading ? idx : null)
                          }
                        />
                      </Field>

                      <div className="flex items-center gap-[10px]">
                        <Switch
                          checked={service.isActive}
                          onCheckedChange={(checked) =>
                            updateService(idx, "isActive", checked)
                          }
                        />
                        <Label className="text-[13px] font-medium text-[#2A2A2A]">
                          Active
                        </Label>
                      </div>
                    </div>
                  </ItemCard>
                ))}
                <AddButton onClick={addService} label="Add Service" />
              </div>
            </div>

            {/* BUTTON */}
            <div className="rounded-[14px] border border-[#E4C9B4] bg-white p-[16px]">
              <h3 className="mb-[14px] flex items-center gap-[8px] text-[13px] font-semibold text-[#111111] sm:text-[14px]">
                <Settings className="h-[15px] w-[15px] text-[#EA580C]" />
                Button
              </h3>
              <div className="grid gap-[14px] sm:grid-cols-2">
                <Field label="Button Text">
                  <input
                    className={inputCls}
                    value={form.buttonText}
                    onChange={(e) => setField("buttonText", e.target.value)}
                    placeholder="Explore"
                  />
                </Field>
                <Field label="Button Link">
                  <input
                    className={inputCls}
                    value={form.buttonLink}
                    onChange={(e) => setField("buttonLink", e.target.value)}
                    placeholder="/services"
                  />
                </Field>
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

export default function HomeHeroAdmin() {
  const [data, setData] = useState<HomeHeroData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [editTarget, setEditTarget] = useState<HomeHeroData | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<HomeHeroData | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get<HomeHeroData[] | HomeHeroData>(
        "/home-hero",
      );

      let list: HomeHeroData[] = [];
      if (Array.isArray(res.data)) {
        list = res.data;
      } else if (res.data && typeof res.data === "object") {
        list = [res.data as HomeHeroData];
      }

      setData(list);
    } catch (err: unknown) {
      const e = err as {
        response?: { status?: number; data?: { message?: string } };
      };
      if (e?.response?.status === 401) {
        toast.error("Unauthorized. Please sign in again.");
      } else {
        toast.error(extractErrorMessage(err, "Failed to load home hero"));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const confirmDelete = (item: HomeHeroData) => setDeleteTarget(item);
  const cancelDelete = () => {
    if (deletingId) return;
    setDeleteTarget(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeletingId(deleteTarget._id);
      await api.delete(`/home-hero/${deleteTarget._id}`);
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
      item.eyebrow.toLowerCase().includes(searchTerm.toLowerCase()),
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
            Home Hero
          </h1>
          <p className="mt-[6px] text-[13px] leading-[1.6] text-[#666666] sm:text-[14px] lg:text-[15px]">
            Manage the home hero section content, stats, and services.
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
            Add Home Hero
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
                No home hero found
              </p>
              <p className="text-[12px] text-[#888888]">
                Click "Add Home Hero" to create one.
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
                    {/* BACKGROUND PREVIEW */}
                    <div className="relative h-[140px] w-full overflow-hidden bg-[#F1E4D8] sm:h-[180px]">
                      {item.backgroundImage || item.image ? (
                        <Image
                          src={item.backgroundImage || item.image}
                          alt={item.title}
                          fill
                          unoptimized
                          sizes="(max-width: 768px) 100vw, 800px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <ImageIcon className="h-[28px] w-[28px] text-[#C2410C]/40" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-[16px] sm:p-[20px]">
                        {item.eyebrow && (
                          <span className="text-[10px] font-medium uppercase tracking-widest text-[#EA580C] sm:text-[11px]">
                            {item.eyebrow}
                          </span>
                        )}
                        <h3 className="mt-[2px] text-[16px] font-semibold text-white sm:text-[22px]">
                          {item.title}
                        </h3>
                        {item.subtitle && (
                          <p className="mt-[2px] text-[11px] text-white/80 sm:text-[13px]">
                            {item.subtitle}
                          </p>
                        )}
                      </div>
                      <div
                        className={`absolute right-[12px] top-[12px] rounded-full px-[10px] py-[4px] text-[10px] font-medium backdrop-blur-sm sm:text-[11px] ${
                          item.isActive
                            ? "bg-[#16A34A]/90 text-white"
                            : "bg-black/40 text-white/80"
                        }`}
                      >
                        {item.isActive ? "Active" : "Inactive"}
                      </div>
                    </div>

                    <CardContent className="p-[16px] sm:p-[20px]">
                      {/* Description */}
                      {item.description && (
                        <p className="mb-[14px] line-clamp-2 text-[12px] leading-[1.6] text-[#666] sm:text-[13px]">
                          {item.description}
                        </p>
                      )}

                      {/* Stats preview */}
                      {item.stats && (
                        <div className="grid grid-cols-3 gap-[8px] sm:gap-[12px]">
                          <div className="rounded-[10px] bg-[#FFF9F4] p-[10px] text-center sm:p-[12px]">
                            <div className="text-[16px] font-bold text-[#EA580C] sm:text-[20px]">
                              {item.stats.yearsOfExperience}+
                            </div>
                            <div className="text-[9px] text-[#666] sm:text-[10px]">
                              {item.stats.yearsLabel}
                            </div>
                          </div>
                          <div className="rounded-[10px] bg-[#FFF9F4] p-[10px] text-center sm:p-[12px]">
                            <div className="text-[16px] font-bold text-[#EA580C] sm:text-[20px]">
                              {item.stats.customerSatisfaction}
                            </div>
                            <div className="text-[9px] text-[#666] sm:text-[10px]">
                              {item.stats.satisfactionLabel}
                            </div>
                          </div>
                          <div className="rounded-[10px] bg-[#FFF9F4] p-[10px] text-center sm:p-[12px]">
                            <div className="text-[16px] font-bold text-[#EA580C] sm:text-[20px]">
                              {item.stats.carsServiced}+
                            </div>
                            <div className="text-[9px] text-[#666] sm:text-[10px]">
                              {item.stats.carsServicedLabel}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Services preview */}
                      <div className="mt-[16px] flex flex-wrap items-center gap-[8px]">
                        <Tag className="h-[13px] w-[13px] text-[#888]" />
                        <span className="text-[11px] font-semibold uppercase tracking-widest text-[#888888]">
                          {item.servicesTitle || "Services"} (
                          {item.services?.length ?? 0})
                        </span>
                      </div>

                      <div className="mt-[10px] grid grid-cols-1 gap-[8px] xs:grid-cols-2">
                        {(item.services ?? []).slice(0, 4).map((svc, i) => (
                          <div
                            key={svc._id || i}
                            className="flex items-center gap-[8px] rounded-[8px] border border-[#E4C9B4] bg-white p-[8px]"
                          >
                            {svc.icon ? (
                              <div className="relative h-[24px] w-[24px] shrink-0 overflow-hidden rounded-[6px] bg-[#FFF4EC]">
                                <Image
                                  src={svc.icon}
                                  alt={svc.title}
                                  fill
                                  unoptimized
                                  sizes="24px"
                                  className="object-contain p-[2px]"
                                />
                              </div>
                            ) : (
                              <div className="h-[24px] w-[24px] shrink-0 rounded-[6px] bg-[#FFF4EC]" />
                            )}
                            <span className="truncate text-[11px] font-medium text-[#333] sm:text-[12px]">
                              {svc.title}
                            </span>
                            {!svc.isActive && (
                              <span className="ml-auto text-[9px] text-[#999]">
                                Inactive
                              </span>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Button preview */}
                      {item.buttonText && (
                        <div className="mt-[14px] flex items-center gap-[6px]">
                          <span className="text-[11px] font-medium text-[#EA580C] sm:text-[12px]">
                            {item.buttonText}
                          </span>
                          <span className="text-[10px] text-[#999] sm:text-[11px]">
                            → {item.buttonLink}
                          </span>
                        </div>
                      )}

                      <div className="mt-[16px] flex justify-end gap-[8px]">
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
          <HomeHeroCreateModal
            onClose={() => setCreateOpen(false)}
            onCreated={fetchData}
          />
        )}
      </AnimatePresence>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {editTarget && (
          <HomeHeroEditModal
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
                Delete this home hero?
              </h3>
              <p className="mt-[6px] text-[12px] leading-[1.6] text-[#666666] sm:text-[13px]">
                "{deleteTarget.title}" and its{" "}
                {deleteTarget.services?.length ?? 0} services will be
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