"use client";

import { useEffect, useState, useCallback } from "react";
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
  Target,
  Eye,
  Star,
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

interface MissionBlock {
  _id?: string;
  title: string;
  image: string;
  description: DescriptionSegment[];
}

interface VisionBlock {
  _id?: string;
  title: string;
  image: string;
  description: DescriptionSegment[];
}

interface WhyChoosePoint {
  _id?: string;
  title: string;
  description: string;
  order: number;
  isActive: boolean;
}

export interface AboutPageResponse {
  sectionLabel: string;
  title: string;
  description: DescriptionSegment[];
  mainImage: string;
  mission: MissionBlock;
  vision: VisionBlock;
  whyChooseLabel: string;
  whyChooseTitle: string;
  whyChooseDescription: DescriptionSegment[];
  whyChoosePoints: WhyChoosePoint[];
  isActive: boolean;
}

interface AboutPageData extends AboutPageResponse {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

// ================= HELPERS =================

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Strip `_id` from nested mission, vision, and whyChoosePoints.
 * The backend generates these automatically.
 */
function stripNestedIds<T>(obj: T): T {
  const clone = deepClone(obj) as Record<string, unknown>;

  // Strip _id from mission
  if (clone.mission && typeof clone.mission === "object") {
    const m = clone.mission as Record<string, unknown>;
    delete m._id;
  }

  // Strip _id from vision
  if (clone.vision && typeof clone.vision === "object") {
    const v = clone.vision as Record<string, unknown>;
    delete v._id;
  }

  // Strip _id from each whyChoosePoint
  if (Array.isArray(clone.whyChoosePoints)) {
    clone.whyChoosePoints = (clone.whyChoosePoints as unknown[]).map(
      (point) => {
        const p = point as Record<string, unknown>;
        const { _id, ...rest } = p;
        return rest;
      },
    );
  }

  return clone as T;
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

const EMPTY_MISSION: MissionBlock = {
  title: "Our Mission",
  image: "",
  description: [],
};

const EMPTY_VISION: VisionBlock = {
  title: "Our Vision",
  image: "",
  description: [],
};

const EMPTY_WHY_POINT: WhyChoosePoint = {
  title: "",
  description: "",
  order: 0,
  isActive: true,
};

const EMPTY_FORM: AboutPageResponse = {
  sectionLabel: "About Us",
  title: "",
  description: [],
  mainImage: "",
  mission: { ...EMPTY_MISSION, description: [] },
  vision: { ...EMPTY_VISION, description: [] },
  whyChooseLabel: "Why",
  whyChooseTitle: "Why Choose MT Auto Zone?",
  whyChooseDescription: [],
  whyChoosePoints: [],
  isActive: true,
};

// ================= SMALL UI HELPERS =================

function Field({
  label,
  children,
  hasChanged = false,
  icon,
}: {
  label: string;
  children: React.ReactNode;
  hasChanged?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-[4px]">
      <div className="flex items-center gap-[6px]">
        {icon}
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
  const inputId = `upload-${label.replace(/\s/g, "-")}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;

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
  label = "Description Segments",
}: {
  segments: DescriptionSegment[];
  onChange: (segments: DescriptionSegment[]) => void;
  hasChanged?: boolean;
  label?: string;
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
          {label}
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
            rows={2}
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

function AboutPageEditModal({
  data: initialData,
  onClose,
  onSaved,
}: {
  data: AboutPageData;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<AboutPageData>(() => {
    const cloned = deepClone(initialData);
    if (!cloned.description) cloned.description = [];
    if (!cloned.mission) {
      cloned.mission = { ...EMPTY_MISSION, description: [] };
    } else if (!cloned.mission.description) {
      cloned.mission.description = [];
    }
    if (!cloned.vision) {
      cloned.vision = { ...EMPTY_VISION, description: [] };
    } else if (!cloned.vision.description) {
      cloned.vision.description = [];
    }
    if (!cloned.whyChooseDescription) cloned.whyChooseDescription = [];
    if (!cloned.whyChoosePoints) cloned.whyChoosePoints = [];
    return cloned;
  });
  const [originalForm] = useState<AboutPageData>(() => deepClone(initialData));
  const [saving, setSaving] = useState(false);

  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingMission, setUploadingMission] = useState(false);
  const [uploadingVision, setUploadingVision] = useState(false);

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
        form as AboutPageData & { __v?: number };

      const payload = stripNestedIds(cleanPayload);

      await api.patch(`/about-page/${form._id}`, payload);
      toast.success("About page updated successfully!");
      onSaved();
      onClose();
    } catch (err: unknown) {
      toast.error(extractErrorMessage(err, "Failed to update about page"));
    } finally {
      setSaving(false);
    }
  };

  // ---- whyChoosePoints ops ----
  const updatePoint = (
    idx: number,
    key: keyof WhyChoosePoint,
    val: unknown,
  ) => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (!clone.whyChoosePoints) clone.whyChoosePoints = [];
      if (!clone.whyChoosePoints[idx])
        clone.whyChoosePoints[idx] = { ...EMPTY_WHY_POINT };
      (clone.whyChoosePoints[idx] as unknown as Record<string, unknown>)[key] =
        val;
      return clone;
    });
  };

  const addPoint = () => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (!clone.whyChoosePoints) clone.whyChoosePoints = [];
      clone.whyChoosePoints.push({
        ...deepClone(EMPTY_WHY_POINT),
        order: clone.whyChoosePoints.length,
      });
      return clone;
    });
  };

  const removePoint = (idx: number) => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (clone.whyChoosePoints) {
        clone.whyChoosePoints.splice(idx, 1);
        clone.whyChoosePoints = clone.whyChoosePoints.map((p, i) => ({
          ...p,
          order: i,
        }));
      }
      return clone;
    });
  };

  const movePoint = (idx: number, dir: "up" | "down") => {
    const newIdx = dir === "up" ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= form.whyChoosePoints.length) return;
    setForm((prev) => {
      const clone = deepClone(prev);
      if (!clone.whyChoosePoints) return clone;
      const [moved] = clone.whyChoosePoints.splice(idx, 1);
      clone.whyChoosePoints.splice(newIdx, 0, moved);
      clone.whyChoosePoints = clone.whyChoosePoints.map((p, i) => ({
        ...p,
        order: i,
      }));
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
              Edit About Page
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
                    placeholder="Your Trusted Partner..."
                  />
                </Field>

                <div className="sm:col-span-2">
                  <ImageUpload
                    value={form.mainImage}
                    onChange={(url) => setField("mainImage", url)}
                    label="Main Image"
                    uploading={uploadingMain}
                    setUploading={setUploadingMain}
                    hasChanged={hasChanged("mainImage")}
                    aspect="wide"
                  />
                </div>

                <div className="sm:col-span-2">
                  <DescriptionEditor
                    segments={form.description}
                    onChange={(segs) => setField("description", segs)}
                    hasChanged={hasChanged("description")}
                    label="Main Description"
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

            {/* MISSION */}
            <div className="rounded-[14px] border border-[#E4C9B4] bg-white p-[16px]">
              <div className="mb-[14px] flex items-center justify-between">
                <h3 className="flex items-center gap-[8px] text-[13px] font-semibold text-[#111111] sm:text-[14px]">
                  <Target className="h-[15px] w-[15px] text-[#EA580C]" />
                  Mission
                </h3>
                {hasChanged("mission") && (
                  <span className="flex items-center gap-[4px] text-[10px] font-medium text-[#EA580C]">
                    <CircleDot className="h-[10px] w-[10px] fill-[#EA580C]" />
                    Changed
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-[14px]">
                <Field
                  label="Title"
                  hasChanged={hasChanged("mission.title")}
                >
                  <input
                    className={
                      hasChanged("mission.title") ? inputChangedCls : inputCls
                    }
                    value={form.mission.title}
                    onChange={(e) => setField("mission.title", e.target.value)}
                    placeholder="Our Mission"
                  />
                </Field>

                <ImageUpload
                  value={form.mission.image}
                  onChange={(url) => setField("mission.image", url)}
                  label="Mission Image"
                  uploading={uploadingMission}
                  setUploading={setUploadingMission}
                  hasChanged={hasChanged("mission.image")}
                  aspect="wide"
                />

                <DescriptionEditor
                  segments={form.mission.description}
                  onChange={(segs) => setField("mission.description", segs)}
                  hasChanged={hasChanged("mission.description")}
                  label="Mission Description"
                />
              </div>
            </div>

            {/* VISION */}
            <div className="rounded-[14px] border border-[#E4C9B4] bg-white p-[16px]">
              <div className="mb-[14px] flex items-center justify-between">
                <h3 className="flex items-center gap-[8px] text-[13px] font-semibold text-[#111111] sm:text-[14px]">
                  <Eye className="h-[15px] w-[15px] text-[#EA580C]" />
                  Vision
                </h3>
                {hasChanged("vision") && (
                  <span className="flex items-center gap-[4px] text-[10px] font-medium text-[#EA580C]">
                    <CircleDot className="h-[10px] w-[10px] fill-[#EA580C]" />
                    Changed
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-[14px]">
                <Field label="Title" hasChanged={hasChanged("vision.title")}>
                  <input
                    className={
                      hasChanged("vision.title") ? inputChangedCls : inputCls
                    }
                    value={form.vision.title}
                    onChange={(e) => setField("vision.title", e.target.value)}
                    placeholder="Our Vision"
                  />
                </Field>

                <ImageUpload
                  value={form.vision.image}
                  onChange={(url) => setField("vision.image", url)}
                  label="Vision Image"
                  uploading={uploadingVision}
                  setUploading={setUploadingVision}
                  hasChanged={hasChanged("vision.image")}
                  aspect="wide"
                />

                <DescriptionEditor
                  segments={form.vision.description}
                  onChange={(segs) => setField("vision.description", segs)}
                  hasChanged={hasChanged("vision.description")}
                  label="Vision Description"
                />
              </div>
            </div>

            {/* WHY CHOOSE */}
            <div className="rounded-[14px] border border-[#E4C9B4] bg-white p-[16px]">
              <div className="mb-[14px] flex items-center justify-between">
                <h3 className="flex items-center gap-[8px] text-[13px] font-semibold text-[#111111] sm:text-[14px]">
                  <Star className="h-[15px] w-[15px] text-[#EA580C]" />
                  Why Choose Us
                </h3>
                {hasChanged("whyChooseTitle") && (
                  <span className="flex items-center gap-[4px] text-[10px] font-medium text-[#EA580C]">
                    <CircleDot className="h-[10px] w-[10px] fill-[#EA580C]" />
                    Changed
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-[14px]">
                <div className="grid gap-[14px] sm:grid-cols-2">
                  <Field
                    label="Label"
                    hasChanged={hasChanged("whyChooseLabel")}
                  >
                    <input
                      className={
                        hasChanged("whyChooseLabel")
                          ? inputChangedCls
                          : inputCls
                      }
                      value={form.whyChooseLabel}
                      onChange={(e) =>
                        setField("whyChooseLabel", e.target.value)
                      }
                      placeholder="Why"
                    />
                  </Field>

                  <Field
                    label="Title"
                    hasChanged={hasChanged("whyChooseTitle")}
                  >
                    <input
                      className={
                        hasChanged("whyChooseTitle")
                          ? inputChangedCls
                          : inputCls
                      }
                      value={form.whyChooseTitle}
                      onChange={(e) =>
                        setField("whyChooseTitle", e.target.value)
                      }
                      placeholder="Why Choose MT Auto Zone?"
                    />
                  </Field>
                </div>

                <DescriptionEditor
                  segments={form.whyChooseDescription}
                  onChange={(segs) =>
                    setField("whyChooseDescription", segs)
                  }
                  hasChanged={hasChanged("whyChooseDescription")}
                  label="Why Choose Description"
                />

                {/* Points */}
                <div className="rounded-[10px] border border-[#F1E4D8] bg-[#FFFDFB] p-[12px]">
                  <div className="mb-[8px] flex items-center justify-between">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-[#888888]">
                      Points ({form.whyChoosePoints.length})
                    </p>
                    {hasChanged("whyChoosePoints") && (
                      <span className="flex items-center gap-[4px] text-[10px] font-medium text-[#EA580C]">
                        <CircleDot className="h-[10px] w-[10px] fill-[#EA580C]" />
                        Changed
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-[8px]">
                    {form.whyChoosePoints.map((point, idx) => (
                      <ItemCard
                        key={point._id || idx}
                        title={point.title || `Point ${idx + 1}`}
                        onRemove={() => removePoint(idx)}
                        extraActions={
                          <>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                movePoint(idx, "up");
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
                                movePoint(idx, "down");
                              }}
                              disabled={
                                idx === form.whyChoosePoints.length - 1
                              }
                              className="rounded-[6px] p-[4px] text-[#666] transition-colors hover:bg-[#FFF4EC] disabled:opacity-30"
                            >
                              <ArrowDown className="h-[13px] w-[13px]" />
                            </button>
                          </>
                        }
                      >
                        <div className="flex flex-col gap-[12px]">
                          <Field
                            label="Title"
                            hasChanged={hasChanged(
                              `whyChoosePoints.${idx}.title`,
                            )}
                          >
                            <input
                              className={
                                hasChanged(
                                  `whyChoosePoints.${idx}.title`,
                                )
                                  ? inputChangedCls
                                  : inputCls
                              }
                              value={point.title}
                              onChange={(e) =>
                                updatePoint(idx, "title", e.target.value)
                              }
                              placeholder="Expert Technicians"
                            />
                          </Field>

                          <Field
                            label="Description"
                            hasChanged={hasChanged(
                              `whyChoosePoints.${idx}.description`,
                            )}
                          >
                            <textarea
                              className={
                                hasChanged(
                                  `whyChoosePoints.${idx}.description`,
                                )
                                  ? textareaChangedCls
                                  : textareaCls
                              }
                              value={point.description}
                              onChange={(e) =>
                                updatePoint(
                                  idx,
                                  "description",
                                  e.target.value,
                                )
                              }
                              placeholder="Point description..."
                            />
                          </Field>

                          <div className="grid gap-[12px] sm:grid-cols-2">
                            <Field
                              label="Order"
                              hasChanged={hasChanged(
                                `whyChoosePoints.${idx}.order`,
                              )}
                            >
                              <input
                                type="number"
                                className={
                                  hasChanged(
                                    `whyChoosePoints.${idx}.order`,
                                  )
                                    ? inputChangedCls
                                    : inputCls
                                }
                                value={point.order}
                                onChange={(e) =>
                                  updatePoint(
                                    idx,
                                    "order",
                                    Number(e.target.value),
                                  )
                                }
                              />
                            </Field>

                            <div className="flex items-center gap-[10px] pt-[20px]">
                              <Switch
                                checked={point.isActive}
                                onCheckedChange={(checked) =>
                                  updatePoint(idx, "isActive", checked)
                                }
                              />
                              <Label className="text-[13px] font-medium text-[#2A2A2A]">
                                Active
                              </Label>
                              {hasChanged(
                                `whyChoosePoints.${idx}.isActive`,
                              ) && (
                                <CircleDot className="h-[10px] w-[10px] fill-[#EA580C] text-[#EA580C]" />
                              )}
                            </div>
                          </div>
                        </div>
                      </ItemCard>
                    ))}
                    <AddButton onClick={addPoint} label="Add Point" />
                  </div>
                </div>
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

function AboutPageCreateModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [form, setForm] = useState<AboutPageResponse>({
    ...deepClone(EMPTY_FORM),
    description: [],
    mission: { ...EMPTY_MISSION, description: [] },
    vision: { ...EMPTY_VISION, description: [] },
    whyChooseDescription: [],
    whyChoosePoints: [],
  });
  const [saving, setSaving] = useState(false);
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingMission, setUploadingMission] = useState(false);
  const [uploadingVision, setUploadingVision] = useState(false);

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

  const updatePoint = (
    idx: number,
    key: keyof WhyChoosePoint,
    val: unknown,
  ) => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (!clone.whyChoosePoints[idx])
        clone.whyChoosePoints[idx] = { ...EMPTY_WHY_POINT };
      (clone.whyChoosePoints[idx] as unknown as Record<string, unknown>)[key] =
        val;
      return clone;
    });
  };

  const addPoint = () => {
    setForm((prev) => ({
      ...prev,
      whyChoosePoints: [
        ...prev.whyChoosePoints,
        { ...deepClone(EMPTY_WHY_POINT), order: prev.whyChoosePoints.length },
      ],
    }));
  };

  const removePoint = (idx: number) => {
    setForm((prev) => {
      const points = prev.whyChoosePoints.filter((_, i) => i !== idx);
      return {
        ...prev,
        whyChoosePoints: points.map((p, i) => ({ ...p, order: i })),
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

      await api.post("/about-page", payload);
      toast.success("About page created successfully!");
      onCreated();
      onClose();
    } catch (err: unknown) {
      toast.error(extractErrorMessage(err, "Failed to create about page"));
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
              New About Page
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
                    placeholder="Your Trusted Partner..."
                  />
                </Field>
                <div className="sm:col-span-2">
                  <ImageUpload
                    value={form.mainImage}
                    onChange={(url) => setField("mainImage", url)}
                    label="Main Image"
                    uploading={uploadingMain}
                    setUploading={setUploadingMain}
                    aspect="wide"
                  />
                </div>
                <div className="sm:col-span-2">
                  <DescriptionEditor
                    segments={form.description}
                    onChange={(segs) => setField("description", segs)}
                    label="Main Description"
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

            {/* MISSION */}
            <div className="rounded-[14px] border border-[#E4C9B4] bg-white p-[16px]">
              <h3 className="mb-[14px] flex items-center gap-[8px] text-[13px] font-semibold text-[#111111] sm:text-[14px]">
                <Target className="h-[15px] w-[15px] text-[#EA580C]" />
                Mission
              </h3>
              <div className="flex flex-col gap-[14px]">
                <Field label="Title">
                  <input
                    className={inputCls}
                    value={form.mission.title}
                    onChange={(e) => setField("mission.title", e.target.value)}
                    placeholder="Our Mission"
                  />
                </Field>
                <ImageUpload
                  value={form.mission.image}
                  onChange={(url) => setField("mission.image", url)}
                  label="Mission Image"
                  uploading={uploadingMission}
                  setUploading={setUploadingMission}
                  aspect="wide"
                />
                <DescriptionEditor
                  segments={form.mission.description}
                  onChange={(segs) => setField("mission.description", segs)}
                  label="Mission Description"
                />
              </div>
            </div>

            {/* VISION */}
            <div className="rounded-[14px] border border-[#E4C9B4] bg-white p-[16px]">
              <h3 className="mb-[14px] flex items-center gap-[8px] text-[13px] font-semibold text-[#111111] sm:text-[14px]">
                <Eye className="h-[15px] w-[15px] text-[#EA580C]" />
                Vision
              </h3>
              <div className="flex flex-col gap-[14px]">
                <Field label="Title">
                  <input
                    className={inputCls}
                    value={form.vision.title}
                    onChange={(e) => setField("vision.title", e.target.value)}
                    placeholder="Our Vision"
                  />
                </Field>
                <ImageUpload
                  value={form.vision.image}
                  onChange={(url) => setField("vision.image", url)}
                  label="Vision Image"
                  uploading={uploadingVision}
                  setUploading={setUploadingVision}
                  aspect="wide"
                />
                <DescriptionEditor
                  segments={form.vision.description}
                  onChange={(segs) => setField("vision.description", segs)}
                  label="Vision Description"
                />
              </div>
            </div>

            {/* WHY CHOOSE */}
            <div className="rounded-[14px] border border-[#E4C9B4] bg-white p-[16px]">
              <h3 className="mb-[14px] flex items-center gap-[8px] text-[13px] font-semibold text-[#111111] sm:text-[14px]">
                <Star className="h-[15px] w-[15px] text-[#EA580C]" />
                Why Choose Us
              </h3>
              <div className="flex flex-col gap-[14px]">
                <div className="grid gap-[14px] sm:grid-cols-2">
                  <Field label="Label">
                    <input
                      className={inputCls}
                      value={form.whyChooseLabel}
                      onChange={(e) =>
                        setField("whyChooseLabel", e.target.value)
                      }
                      placeholder="Why"
                    />
                  </Field>
                  <Field label="Title">
                    <input
                      className={inputCls}
                      value={form.whyChooseTitle}
                      onChange={(e) =>
                        setField("whyChooseTitle", e.target.value)
                      }
                      placeholder="Why Choose MT Auto Zone?"
                    />
                  </Field>
                </div>

                <DescriptionEditor
                  segments={form.whyChooseDescription}
                  onChange={(segs) =>
                    setField("whyChooseDescription", segs)
                  }
                  label="Why Choose Description"
                />

                <div className="rounded-[10px] border border-[#F1E4D8] bg-[#FFFDFB] p-[12px]">
                  <p className="mb-[8px] text-[11px] font-semibold uppercase tracking-widest text-[#888888]">
                    Points ({form.whyChoosePoints.length})
                  </p>
                  <div className="flex flex-col gap-[8px]">
                    {form.whyChoosePoints.map((point, idx) => (
                      <ItemCard
                        key={idx}
                        title={point.title || `Point ${idx + 1}`}
                        onRemove={() => removePoint(idx)}
                      >
                        <div className="flex flex-col gap-[12px]">
                          <Field label="Title">
                            <input
                              className={inputCls}
                              value={point.title}
                              onChange={(e) =>
                                updatePoint(idx, "title", e.target.value)
                              }
                              placeholder="Expert Technicians"
                            />
                          </Field>
                          <Field label="Description">
                            <textarea
                              className={textareaCls}
                              value={point.description}
                              onChange={(e) =>
                                updatePoint(
                                  idx,
                                  "description",
                                  e.target.value,
                                )
                              }
                              placeholder="Point description..."
                            />
                          </Field>
                          <div className="flex items-center gap-[10px]">
                            <Switch
                              checked={point.isActive}
                              onCheckedChange={(checked) =>
                                updatePoint(idx, "isActive", checked)
                              }
                            />
                            <Label className="text-[13px] font-medium text-[#2A2A2A]">
                              Active
                            </Label>
                          </div>
                        </div>
                      </ItemCard>
                    ))}
                    <AddButton onClick={addPoint} label="Add Point" />
                  </div>
                </div>
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

export default function AboutPageAdmin() {
  const [data, setData] = useState<AboutPageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [editTarget, setEditTarget] = useState<AboutPageData | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<AboutPageData | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get<AboutPageData[] | AboutPageData>(
        "/about-page",
      );

      let list: AboutPageData[] = [];
      if (Array.isArray(res.data)) {
        list = res.data;
      } else if (res.data && typeof res.data === "object") {
        list = [res.data as AboutPageData];
      }

      setData(list);
    } catch (err: unknown) {
      const e = err as {
        response?: { status?: number; data?: { message?: string } };
      };
      if (e?.response?.status === 401) {
        toast.error("Unauthorized. Please sign in again.");
      } else {
        toast.error(extractErrorMessage(err, "Failed to load about page"));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const confirmDelete = (item: AboutPageData) => setDeleteTarget(item);
  const cancelDelete = () => {
    if (deletingId) return;
    setDeleteTarget(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeletingId(deleteTarget._id);
      await api.delete(`/about-page/${deleteTarget._id}`);
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
            About Page
          </h1>
          <p className="mt-[6px] text-[13px] leading-[1.6] text-[#666666] sm:text-[14px] lg:text-[15px]">
            Manage about page content, mission, vision, and why-choose points.
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
            Add About Page
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
                No about page found
              </p>
              <p className="text-[12px] text-[#888888]">
                Click "Add About Page" to create one.
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
                    {/* MAIN IMAGE PREVIEW */}
                    <div className="relative h-[140px] w-full overflow-hidden bg-[#F1E4D8] sm:h-[180px]">
                      {item.mainImage ? (
                        <Image
                          src={item.mainImage}
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
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-[16px] sm:p-[20px]">
                        {item.sectionLabel && (
                          <span className="text-[10px] font-medium uppercase tracking-widest text-[#EA580C] sm:text-[11px]">
                            {item.sectionLabel}
                          </span>
                        )}
                        <h3 className="mt-[2px] text-[16px] font-semibold text-white sm:text-[20px]">
                          {item.title}
                        </h3>
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
                      {/* Description preview */}
                      {item.description && item.description.length > 0 && (
                        <p className="mb-[14px] line-clamp-2 text-[12px] leading-[1.6] text-[#666] sm:text-[13px]">
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

                      {/* Mission / Vision preview */}
                      <div className="grid grid-cols-1 gap-[8px] sm:grid-cols-2">
                        <div className="flex items-center gap-[8px] rounded-[8px] bg-[#FFF9F4] p-[10px]">
                          <Target className="h-[14px] w-[14px] shrink-0 text-[#EA580C]" />
                          <span className="truncate text-[11px] text-[#666] sm:text-[12px]">
                            {item.mission?.title || "Mission"}
                          </span>
                        </div>
                        <div className="flex items-center gap-[8px] rounded-[8px] bg-[#FFF9F4] p-[10px]">
                          <Eye className="h-[14px] w-[14px] shrink-0 text-[#EA580C]" />
                          <span className="truncate text-[11px] text-[#666] sm:text-[12px]">
                            {item.vision?.title || "Vision"}
                          </span>
                        </div>
                      </div>

                      {/* Why Choose points preview */}
                      <div className="mt-[14px] flex flex-wrap items-center gap-[8px]">
                        <Tag className="h-[13px] w-[13px] text-[#888]" />
                        <span className="text-[11px] font-semibold uppercase tracking-widest text-[#888888]">
                          Why Choose ({item.whyChoosePoints?.length ?? 0})
                        </span>
                      </div>

                      <div className="mt-[10px] grid grid-cols-2 gap-[8px] xs:grid-cols-3 sm:grid-cols-4">
                        {(item.whyChoosePoints ?? [])
                          .slice(0, 4)
                          .map((point, idx) => (
                            <div
                              key={point._id || idx}
                              className="flex flex-col gap-[4px] rounded-[8px] border border-[#E4C9B4] bg-white p-[8px]"
                            >
                              <span className="line-clamp-2 text-[11px] font-medium text-[#333]">
                                {point.title}
                              </span>
                              {!point.isActive && (
                                <span className="text-[9px] text-[#999]">
                                  Inactive
                                </span>
                              )}
                            </div>
                          ))}
                        {(item.whyChoosePoints?.length ?? 0) > 4 && (
                          <div className="flex items-center justify-center rounded-[8px] border border-dashed border-[#E4C9B4] bg-white p-[8px] text-[11px] text-[#888]">
                            +{(item.whyChoosePoints?.length ?? 0) - 4} more
                          </div>
                        )}
                      </div>

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
          <AboutPageCreateModal
            onClose={() => setCreateOpen(false)}
            onCreated={fetchData}
          />
        )}
      </AnimatePresence>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {editTarget && (
          <AboutPageEditModal
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
                Delete this about page?
              </h3>
              <p className="mt-[6px] text-[12px] leading-[1.6] text-[#666666] sm:text-[13px]">
                "{deleteTarget.title}" will be permanently removed. This can't
                be undone.
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