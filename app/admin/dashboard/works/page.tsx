"use client";

import { useEffect, useState, useCallback, useRef } from "react";
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
  Link as LinkIcon,
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

interface WorkFeature {
  _id?: string;
  title: string;
  icon: string; // URL to uploaded icon image
}

interface WorkItem {
  _id?: string;
  title: string;
  slug: string;
  description: DescriptionSegment[];
  image: string;
  features: WorkFeature[];
  order: number;
  isActive: boolean;
}

export interface WorksPageResponse {
  sectionLabel: string;
  title: string;
  description: DescriptionSegment[];
  heroImage: string;
  buttonText: string;
  buttonLink: string;
  works: WorkItem[];
  isActive: boolean;
}

interface WorksPageData extends WorksPageResponse {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

// ================= HELPERS =================

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Strip `_id` from nested works and features before sending to API.
 * The backend generates these automatically and rejects them in the payload.
 */
function stripNestedIds<T extends { works?: unknown[] }>(obj: T): T {
  const clone = deepClone(obj);
  if (Array.isArray(clone.works)) {
    clone.works = clone.works.map((w) => {
      const item = w as Record<string, unknown>;
      const { _id, ...workRest } = item;
      const cleanedWork: Record<string, unknown> = { ...workRest };
      if (Array.isArray(item.features)) {
        cleanedWork.features = (item.features as unknown[]).map((feat) => {
          const f = feat as Record<string, unknown>;
          const { _id: _fid, ...featRest } = f;
          return featRest;
        });
      }
      return cleanedWork;
    });
  }
  return clone;
}

/** Extract a user-friendly message from an API error response. */
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

const EMPTY_FEATURE: WorkFeature = {
  title: "",
  icon: "",
};

const EMPTY_WORK: WorkItem = {
  title: "",
  slug: "",
  description: [],
  image: "",
  features: [],
  order: 0,
  isActive: true,
};

const EMPTY_FORM: WorksPageResponse = {
  sectionLabel: "Our Works",
  title: "",
  description: [],
  heroImage: "",
  buttonText: "View Works",
  buttonLink: "/works",
  works: [],
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
  // ✅ Use a ref instead of DOM id lookup. This guarantees that clicking
  // THIS upload area always opens THIS component's file input — no matter
  // how many ImageUpload instances are rendered on the page.
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const result = await fileUpload(file);
      onChange(result.url);
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
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
      />
      <div
        onClick={() => !uploading && fileInputRef.current?.click()}
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

// ================= ICON UPLOAD (small square) =================

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
  // ✅ Same ref-based approach for consistency and reliability.
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const result = await fileUpload(file);
      onChange(result.url);
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
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
      />
      <button
        type="button"
        onClick={() => !uploading && fileInputRef.current?.click()}
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

function WorksPageEditModal({
  data: initialData,
  onClose,
  onSaved,
}: {
  data: WorksPageData;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<WorksPageData>(() => {
    const cloned = deepClone(initialData);
    if (!cloned.works) cloned.works = [];
    if (!cloned.description) cloned.description = [];
    // Ensure every work has a description array
    cloned.works = cloned.works.map((w) => ({
      ...w,
      description: Array.isArray(w.description) ? w.description : [],
      features: Array.isArray(w.features) ? w.features : [],
    }));
    return cloned;
  });
  const [originalForm] = useState<WorksPageData>(() =>
    deepClone(initialData),
  );
  const [saving, setSaving] = useState(false);

  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingWorkImage, setUploadingWorkImage] = useState<number | null>(
    null,
  );
  const [uploadingFeatureIcon, setUploadingFeatureIcon] = useState<{
    wIdx: number;
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
        form as WorksPageData & { __v?: number };

      const payload = stripNestedIds(cleanPayload);

      await api.patch(`/works-page/${form._id}`, payload);
      toast.success("Works page updated successfully!");
      onSaved();
      onClose();
    } catch (err: unknown) {
      toast.error(extractErrorMessage(err, "Failed to update works page"));
    } finally {
      setSaving(false);
    }
  };

  // ---- work item ops ----
  const updateWork = (
    idx: number,
    key: keyof WorkItem,
    val: unknown,
  ) => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (!clone.works) clone.works = [];
      if (!clone.works[idx]) clone.works[idx] = { ...EMPTY_WORK };
      (clone.works[idx] as unknown as Record<string, unknown>)[key] = val;
      return clone;
    });
  };

  const addWork = () => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (!clone.works) clone.works = [];
      clone.works.push({
        ...deepClone(EMPTY_WORK),
        order: clone.works.length,
      });
      return clone;
    });
  };

  const removeWork = (idx: number) => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (clone.works) {
        clone.works.splice(idx, 1);
        clone.works = clone.works.map((w, i) => ({ ...w, order: i }));
      }
      return clone;
    });
  };

  const moveWork = (idx: number, dir: "up" | "down") => {
    const newIdx = dir === "up" ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= form.works.length) return;
    setForm((prev) => {
      const clone = deepClone(prev);
      if (!clone.works) return clone;
      const [moved] = clone.works.splice(idx, 1);
      clone.works.splice(newIdx, 0, moved);
      clone.works = clone.works.map((w, i) => ({ ...w, order: i }));
      return clone;
    });
  };

  // ---- feature ops ----
  const updateFeature = (
    wIdx: number,
    fIdx: number,
    key: keyof WorkFeature,
    val: string,
  ) => {
    setForm((prev) => {
      const clone = deepClone(prev);
      const work = clone.works[wIdx];
      if (!work.features) work.features = [];
      if (!work.features[fIdx]) work.features[fIdx] = { ...EMPTY_FEATURE };
      (work.features[fIdx] as unknown as Record<string, unknown>)[key] = val;
      return clone;
    });
  };

  const addFeature = (wIdx: number) => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (!clone.works[wIdx].features) clone.works[wIdx].features = [];
      clone.works[wIdx].features.push({ ...EMPTY_FEATURE });
      return clone;
    });
  };

  const removeFeature = (wIdx: number, fIdx: number) => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (clone.works[wIdx]?.features) {
        clone.works[wIdx].features.splice(fIdx, 1);
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
              Edit Works Page
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
                    placeholder="Our Works"
                  />
                </Field>

                <Field label="Title" hasChanged={hasChanged("title")}>
                  <input
                    className={hasChanged("title") ? inputChangedCls : inputCls}
                    value={form.title}
                    onChange={(e) => setField("title", e.target.value)}
                    placeholder="Completed Projects & Vehicle Transformations"
                  />
                </Field>

                <div className="sm:col-span-2">
                  <ImageUpload
                    value={form.heroImage}
                    onChange={(url) => setField("heroImage", url)}
                    label="Hero Image"
                    uploading={uploadingHero}
                    setUploading={setUploadingHero}
                    hasChanged={hasChanged("heroImage")}
                    aspect="wide"
                  />
                </div>

                <div className="sm:col-span-2">
                  <DescriptionEditor
                    segments={form.description}
                    onChange={(segs) => setField("description", segs)}
                    hasChanged={hasChanged("description")}
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
                    placeholder="View Works"
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
                    placeholder="/works"
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

            {/* WORKS */}
            <div className="rounded-[14px] border border-[#E4C9B4] bg-white p-[16px]">
              <div className="mb-[14px] flex flex-wrap items-center justify-between gap-[8px]">
                <h3 className="flex items-center gap-[8px] text-[13px] font-semibold text-[#111111] sm:text-[14px]">
                  <List className="h-[15px] w-[15px] text-[#EA580C]" />
                  Works ({form.works.length})
                </h3>
                {hasChanged("works") && (
                  <span className="flex items-center gap-[4px] text-[10px] font-medium text-[#EA580C]">
                    <CircleDot className="h-[10px] w-[10px] fill-[#EA580C]" />
                    Changed
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-[12px]">
                {form.works.map((work, idx) => (
                  <ItemCard
                    key={work._id || `work-${idx}`}
                    title={work.title || `Work ${idx + 1}`}
                    onRemove={() => removeWork(idx)}
                    extraActions={
                      <>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveWork(idx, "up");
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
                            moveWork(idx, "down");
                          }}
                          disabled={idx === form.works.length - 1}
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
                            hasChanged={hasChanged(`works.${idx}.title`)}
                          >
                            <input
                              className={
                                hasChanged(`works.${idx}.title`)
                                  ? inputChangedCls
                                  : inputCls
                              }
                              value={work.title}
                              onChange={(e) =>
                                updateWork(idx, "title", e.target.value)
                              }
                              placeholder="Body Waxing"
                            />
                          </Field>
                        </div>

                        <Field
                          label="Slug"
                          hasChanged={hasChanged(`works.${idx}.slug`)}
                        >
                          <input
                            className={
                              hasChanged(`works.${idx}.slug`)
                                ? inputChangedCls
                                : inputCls
                            }
                            value={work.slug}
                            onChange={(e) =>
                              updateWork(idx, "slug", e.target.value)
                            }
                            placeholder="body-waxing"
                          />
                        </Field>

                        <Field
                          label="Order"
                          hasChanged={hasChanged(`works.${idx}.order`)}
                        >
                          <input
                            type="number"
                            className={
                              hasChanged(`works.${idx}.order`)
                                ? inputChangedCls
                                : inputCls
                            }
                            value={work.order}
                            onChange={(e) =>
                              updateWork(idx, "order", Number(e.target.value))
                            }
                          />
                        </Field>

                        <div className="sm:col-span-2">
                          <ImageUpload
                            value={work.image}
                            onChange={(url) =>
                              updateWork(idx, "image", url)
                            }
                            label="Work Image"
                            uploading={uploadingWorkImage === idx}
                            setUploading={(loading) =>
                              setUploadingWorkImage(loading ? idx : null)
                            }
                            hasChanged={hasChanged(`works.${idx}.image`)}
                            aspect="wide"
                          />
                        </div>

                        <div className="flex items-center gap-[10px] sm:col-span-2">
                          <Switch
                            checked={work.isActive}
                            onCheckedChange={(checked) =>
                              updateWork(idx, "isActive", checked)
                            }
                          />
                          <Label className="text-[13px] font-medium text-[#2A2A2A]">
                            Active
                          </Label>
                          {hasChanged(`works.${idx}.isActive`) && (
                            <CircleDot className="h-[10px] w-[10px] fill-[#EA580C] text-[#EA580C]" />
                          )}
                        </div>
                      </div>

                      {/* PER-WORK DESCRIPTION */}
                      <div className="rounded-[10px] border border-[#F1E4D8] bg-[#FFFDFB] p-[12px]">
                        <DescriptionEditor
                          segments={work.description}
                          onChange={(segs) =>
                            updateWork(idx, "description", segs)
                          }
                          hasChanged={hasChanged(
                            `works.${idx}.description`,
                          )}
                          label="Work Description"
                        />
                      </div>

                      {/* FEATURES */}
                      <div className="rounded-[10px] border border-[#F1E4D8] bg-[#FFFDFB] p-[12px]">
                        <div className="mb-[8px] flex items-center justify-between">
                          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#888888]">
                            Features ({work.features?.length ?? 0})
                          </p>
                          {hasChanged(`works.${idx}.features`) && (
                            <span className="flex items-center gap-[4px] text-[10px] font-medium text-[#EA580C]">
                              <CircleDot className="h-[10px] w-[10px] fill-[#EA580C]" />
                              Changed
                            </span>
                          )}
                        </div>

                        <div className="flex flex-col gap-[8px]">
                          {(work.features ?? []).map((feat, fIdx) => (
                            <div
                              key={feat._id || fIdx}
                              className="flex flex-col gap-[6px] rounded-[8px] border border-[#E4C9B4] bg-white p-[10px] sm:flex-row sm:items-center"
                            >
                              <input
                                className={`${inputCls} flex-1`}
                                value={feat.title}
                                onChange={(e) =>
                                  updateFeature(
                                    idx,
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
                                    updateFeature(idx, fIdx, "icon", url)
                                  }
                                  uploading={
                                    uploadingFeatureIcon?.wIdx === idx &&
                                    uploadingFeatureIcon?.fIdx === fIdx
                                  }
                                  setUploading={(loading) =>
                                    setUploadingFeatureIcon(
                                      loading ? { wIdx: idx, fIdx } : null,
                                    )
                                  }
                                  hasChanged={hasChanged(
                                    `works.${idx}.features.${fIdx}.icon`,
                                  )}
                                />
                              </div>

                              <button
                                type="button"
                                onClick={() => removeFeature(idx, fIdx)}
                                className="shrink-0 self-end rounded-[6px] p-[6px] text-[#DC2626] transition-colors hover:bg-red-50 sm:self-auto"
                              >
                                <Trash2 className="h-[13px] w-[13px]" />
                              </button>
                            </div>
                          ))}
                          <AddButton
                            onClick={() => addFeature(idx)}
                            label="Add Feature"
                          />
                        </div>
                      </div>
                    </div>
                  </ItemCard>
                ))}

                <AddButton onClick={addWork} label="Add Work" />
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

function WorksPageCreateModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [form, setForm] = useState<WorksPageResponse>({
    ...deepClone(EMPTY_FORM),
    works: [],
    description: [],
  });
  const [saving, setSaving] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingWorkImage, setUploadingWorkImage] = useState<number | null>(
    null,
  );
  const [uploadingFeatureIcon, setUploadingFeatureIcon] = useState<{
    wIdx: number;
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

  const updateWork = (
    idx: number,
    key: keyof WorkItem,
    val: unknown,
  ) => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (!clone.works[idx]) clone.works[idx] = { ...EMPTY_WORK };
      (clone.works[idx] as unknown as Record<string, unknown>)[key] = val;
      return clone;
    });
  };

  const addWork = () => {
    setForm((prev) => ({
      ...prev,
      works: [
        ...prev.works,
        { ...deepClone(EMPTY_WORK), order: prev.works.length },
      ],
    }));
  };

  const removeWork = (idx: number) => {
    setForm((prev) => {
      const works = prev.works.filter((_, i) => i !== idx);
      return {
        ...prev,
        works: works.map((w, i) => ({ ...w, order: i })),
      };
    });
  };

  const updateFeature = (
    wIdx: number,
    fIdx: number,
    key: keyof WorkFeature,
    val: string,
  ) => {
    setForm((prev) => {
      const clone = deepClone(prev);
      const work = clone.works[wIdx];
      if (!work.features) work.features = [];
      if (!work.features[fIdx]) work.features[fIdx] = { ...EMPTY_FEATURE };
      (work.features[fIdx] as unknown as Record<string, unknown>)[key] = val;
      return clone;
    });
  };

  const addFeature = (wIdx: number) => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (!clone.works[wIdx].features) clone.works[wIdx].features = [];
      clone.works[wIdx].features.push({ ...EMPTY_FEATURE });
      return clone;
    });
  };

  const removeFeature = (wIdx: number, fIdx: number) => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (clone.works[wIdx]?.features) {
        clone.works[wIdx].features.splice(fIdx, 1);
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
      await api.post("/works-page", payload);
      toast.success("Works page created successfully!");
      onCreated();
      onClose();
    } catch (err: unknown) {
      toast.error(extractErrorMessage(err, "Failed to create works page"));
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
              New Works Page
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
                    placeholder="Our Works"
                  />
                </Field>
                <Field label="Title">
                  <input
                    className={inputCls}
                    value={form.title}
                    onChange={(e) => setField("title", e.target.value)}
                    placeholder="Completed Projects & Vehicle Transformations"
                  />
                </Field>
                <div className="sm:col-span-2">
                  <ImageUpload
                    value={form.heroImage}
                    onChange={(url) => setField("heroImage", url)}
                    label="Hero Image"
                    uploading={uploadingHero}
                    setUploading={setUploadingHero}
                    aspect="wide"
                  />
                </div>
                <div className="sm:col-span-2">
                  <DescriptionEditor
                    segments={form.description}
                    onChange={(segs) => setField("description", segs)}
                  />
                </div>
                <Field label="Button Text">
                  <input
                    className={inputCls}
                    value={form.buttonText}
                    onChange={(e) => setField("buttonText", e.target.value)}
                    placeholder="View Works"
                  />
                </Field>
                <Field label="Button Link">
                  <input
                    className={inputCls}
                    value={form.buttonLink}
                    onChange={(e) => setField("buttonLink", e.target.value)}
                    placeholder="/works"
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
                Works ({form.works.length})
              </h3>

              <div className="flex flex-col gap-[12px]">
                {form.works.map((work, idx) => (
                  <ItemCard
                    key={idx}
                    title={work.title || `Work ${idx + 1}`}
                    onRemove={() => removeWork(idx)}
                  >
                    <div className="flex flex-col gap-[14px]">
                      <div className="grid gap-[14px] sm:grid-cols-2">
                        <div className="sm:col-span-2">
                          <Field label="Title">
                            <input
                              className={inputCls}
                              value={work.title}
                              onChange={(e) =>
                                updateWork(idx, "title", e.target.value)
                              }
                              placeholder="Body Waxing"
                            />
                          </Field>
                        </div>
                        <Field label="Slug">
                          <input
                            className={inputCls}
                            value={work.slug}
                            onChange={(e) =>
                              updateWork(idx, "slug", e.target.value)
                            }
                            placeholder="body-waxing"
                          />
                        </Field>
                        <div className="sm:col-span-2">
                          <ImageUpload
                            value={work.image}
                            onChange={(url) =>
                              updateWork(idx, "image", url)
                            }
                            label="Work Image"
                            uploading={uploadingWorkImage === idx}
                            setUploading={(loading) =>
                              setUploadingWorkImage(loading ? idx : null)
                            }
                            aspect="wide"
                          />
                        </div>
                        <div className="flex items-center gap-[10px] sm:col-span-2">
                          <Switch
                            checked={work.isActive}
                            onCheckedChange={(checked) =>
                              updateWork(idx, "isActive", checked)
                            }
                          />
                          <Label className="text-[13px] font-medium text-[#2A2A2A]">
                            Active
                          </Label>
                        </div>
                      </div>

                      <div className="rounded-[10px] border border-[#F1E4D8] bg-[#FFFDFB] p-[12px]">
                        <DescriptionEditor
                          segments={work.description}
                          onChange={(segs) =>
                            updateWork(idx, "description", segs)
                          }
                          label="Work Description"
                        />
                      </div>

                      <div className="rounded-[10px] border border-[#F1E4D8] bg-[#FFFDFB] p-[12px]">
                        <p className="mb-[8px] text-[11px] font-semibold uppercase tracking-widest text-[#888888]">
                          Features ({work.features?.length ?? 0})
                        </p>
                        <div className="flex flex-col gap-[8px]">
                          {(work.features ?? []).map((feat, fIdx) => (
                            <div
                              key={fIdx}
                              className="flex flex-col gap-[6px] rounded-[8px] border border-[#E4C9B4] bg-white p-[10px] sm:flex-row sm:items-center"
                            >
                              <input
                                className={`${inputCls} flex-1`}
                                value={feat.title}
                                onChange={(e) =>
                                  updateFeature(
                                    idx,
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
                                    updateFeature(idx, fIdx, "icon", url)
                                  }
                                  uploading={
                                    uploadingFeatureIcon?.wIdx === idx &&
                                    uploadingFeatureIcon?.fIdx === fIdx
                                  }
                                  setUploading={(loading) =>
                                    setUploadingFeatureIcon(
                                      loading ? { wIdx: idx, fIdx } : null,
                                    )
                                  }
                                />
                              </div>

                              <button
                                type="button"
                                onClick={() => removeFeature(idx, fIdx)}
                                className="shrink-0 self-end rounded-[6px] p-[6px] text-[#DC2626] transition-colors hover:bg-red-50 sm:self-auto"
                              >
                                <Trash2 className="h-[13px] w-[13px]" />
                              </button>
                            </div>
                          ))}
                          <AddButton
                            onClick={() => addFeature(idx)}
                            label="Add Feature"
                          />
                        </div>
                      </div>
                    </div>
                  </ItemCard>
                ))}
                <AddButton onClick={addWork} label="Add Work" />
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

export default function WorksPageAdmin() {
  const [data, setData] = useState<WorksPageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [editTarget, setEditTarget] = useState<WorksPageData | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<WorksPageData | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get<WorksPageData[] | WorksPageData>(
        "/works-page",
      );

      let list: WorksPageData[] = [];
      if (Array.isArray(res.data)) {
        list = res.data;
      } else if (res.data && typeof res.data === "object") {
        list = [res.data as WorksPageData];
      }

      setData(list);
    } catch (err: unknown) {
      const e = err as {
        response?: { status?: number; data?: { message?: string } };
      };
      if (e?.response?.status === 401) {
        toast.error("Unauthorized. Please sign in again.");
      } else {
        toast.error(extractErrorMessage(err, "Failed to load works page"));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const confirmDelete = (item: WorksPageData) => setDeleteTarget(item);
  const cancelDelete = () => {
    if (deletingId) return;
    setDeleteTarget(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeletingId(deleteTarget._id);
      await api.delete(`/works-page/${deleteTarget._id}`);
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
            Works Page
          </h1>
          <p className="mt-[6px] text-[13px] leading-[1.6] text-[#666666] sm:text-[14px] lg:text-[15px]">
            Manage the works page content and completed projects.
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
            Add Works Page
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
                No works page found
              </p>
              <p className="text-[12px] text-[#888888]">
                Click "Add Works Page" to create one.
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
                    {/* HERO PREVIEW */}
                    <div className="relative h-[140px] w-full overflow-hidden bg-[#F1E4D8] sm:h-[180px]">
                      {item.heroImage ? (
                        <Image
                          src={item.heroImage}
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

                      {/* Button preview */}
                      {item.buttonText && item.buttonLink && (
                        <div className="mb-[14px] flex items-center gap-[6px]">
                          <LinkIcon className="h-[12px] w-[12px] text-[#EA580C]" />
                          <span className="text-[11px] font-medium text-[#EA580C]">
                            {item.buttonText}
                          </span>
                          <span className="text-[10px] text-[#999]">
                            → {item.buttonLink}
                          </span>
                        </div>
                      )}

                      {/* Works preview */}
                      <div className="flex flex-wrap items-center gap-[8px]">
                        <Tag className="h-[13px] w-[13px] text-[#888]" />
                        <span className="text-[11px] font-semibold uppercase tracking-widest text-[#888888]">
                          Works ({item.works?.length ?? 0})
                        </span>
                      </div>

                      <div className="mt-[10px] grid grid-cols-2 gap-[8px] xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-6">
                        {(item.works ?? []).slice(0, 6).map((work, idx) => (
                          <div
                            key={work._id || idx}
                            className="flex flex-col gap-[4px] rounded-[8px] border border-[#E4C9B4] bg-white p-[8px]"
                          >
                            {work.features && work.features.length > 0 && (
                              <div className="flex items-center gap-[4px]">
                                {work.features.slice(0, 3).map((f, fi) =>
                                  f.icon ? (
                                    <div
                                      key={fi}
                                      className="relative h-[16px] w-[16px] shrink-0"
                                    >
                                      <Image
                                        src={f.icon}
                                        alt={f.title}
                                        fill
                                        unoptimized
                                        sizes="16px"
                                        className="object-contain"
                                      />
                                    </div>
                                  ) : null,
                                )}
                              </div>
                            )}
                            <span className="line-clamp-2 text-[11px] font-medium text-[#333]">
                              {work.title}
                            </span>
                            <span className="text-[9px] text-[#999]">
                              {work.features?.length ?? 0} features
                            </span>
                          </div>
                        ))}
                        {(item.works?.length ?? 0) > 6 && (
                          <div className="flex items-center justify-center rounded-[8px] border border-dashed border-[#E4C9B4] bg-white p-[8px] text-[11px] text-[#888]">
                            +{(item.works?.length ?? 0) - 6} more
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
          <WorksPageCreateModal
            onClose={() => setCreateOpen(false)}
            onCreated={fetchData}
          />
        )}
      </AnimatePresence>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {editTarget && (
          <WorksPageEditModal
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
                Delete this works page?
              </h3>
              <p className="mt-[6px] text-[12px] leading-[1.6] text-[#666666] sm:text-[13px]">
                "{deleteTarget.title}" and its{" "}
                {deleteTarget.works?.length ?? 0} works will be permanently
                removed.
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