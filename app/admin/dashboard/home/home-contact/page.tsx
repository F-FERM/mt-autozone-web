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

interface ServiceOption {
  _id?: string;
  label: string;
  value: string;
  order: number;
  isActive: boolean;
}

export interface ContactBookingResponse {
  sectionLabel: string;
  title: string;
  description: DescriptionSegment[];
  backgroundImage: string;    // left image
  backgroundImageTwo: string; // right image
  services: ServiceOption[];
  isActive: boolean;
}

interface ContactBookingData extends ContactBookingResponse {
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

const EMPTY_SERVICE_OPTION: ServiceOption = {
  label: "",
  value: "",
  order: 0,
  isActive: true,
};

const EMPTY_FORM: ContactBookingResponse = {
  sectionLabel: "Contact",
  title: "",
  description: [],
  backgroundImage: "",
  backgroundImageTwo: "",
  services: [],
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

function ContactBookingEditModal({
  data: initialData,
  onClose,
  onSaved,
}: {
  data: ContactBookingData;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<ContactBookingData>(() => {
    const cloned = deepClone(initialData);
    if (!cloned.description) cloned.description = [];
    if (!cloned.services) cloned.services = [];
    return cloned;
  });
  const [originalForm] = useState<ContactBookingData>(() =>
    deepClone(initialData),
  );
  const [saving, setSaving] = useState(false);

  const [uploadingLeft, setUploadingLeft] = useState(false);
  const [uploadingRight, setUploadingRight] = useState(false);

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
        form as ContactBookingData & { __v?: number };

      const payload = stripNestedIds(cleanPayload);

      await api.patch(`/home-contact/${form._id}`, payload);
      toast.success("Contact booking updated successfully!");
      onSaved();
      onClose();
    } catch (err: unknown) {
      toast.error(
        extractErrorMessage(err, "Failed to update contact booking"),
      );
    } finally {
      setSaving(false);
    }
  };

  // ---- services ops ----
  const updateService = (
    idx: number,
    key: keyof ServiceOption,
    val: unknown,
  ) => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (!clone.services) clone.services = [];
      if (!clone.services[idx])
        clone.services[idx] = { ...EMPTY_SERVICE_OPTION };
      (clone.services[idx] as unknown as Record<string, unknown>)[key] = val;
      return clone;
    });
  };

  const addService = () => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (!clone.services) clone.services = [];
      clone.services.push({
        ...deepClone(EMPTY_SERVICE_OPTION),
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
        className="relative flex w-full max-w-[900px] flex-col overflow-hidden rounded-t-[24px] bg-[#FFF4EC] shadow-2xl sm:max-h-[92vh] sm:rounded-[24px]"
        style={{ maxHeight: "92dvh" }}
      >
        {/* HEADER */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#E4C9B4] bg-white px-[20px] py-[14px] sm:px-[28px] sm:py-[16px]">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-widest text-[#EA580C]">
              Edit Contact Booking
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
                    placeholder="Contact"
                  />
                </Field>

                <Field label="Title" hasChanged={hasChanged("title")}>
                  <input
                    className={hasChanged("title") ? inputChangedCls : inputCls}
                    value={form.title}
                    onChange={(e) => setField("title", e.target.value)}
                    placeholder="Connect With MT Auto Zone"
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
                    value={form.backgroundImage}
                    onChange={(url) => setField("backgroundImage", url)}
                    label="Left Image"
                    uploading={uploadingLeft}
                    setUploading={setUploadingLeft}
                    hasChanged={hasChanged("backgroundImage")}
                    aspect="wide"
                  />
                </div>

                <div className="sm:col-span-2">
                  <ImageUpload
                    value={form.backgroundImageTwo}
                    onChange={(url) => setField("backgroundImageTwo", url)}
                    label="Right Image"
                    uploading={uploadingRight}
                    setUploading={setUploadingRight}
                    hasChanged={hasChanged("backgroundImageTwo")}
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

            {/* SERVICE OPTIONS */}
            <div className="rounded-[14px] border border-[#E4C9B4] bg-white p-[16px]">
              <div className="mb-[14px] flex flex-wrap items-center justify-between gap-[8px]">
                <h3 className="flex items-center gap-[8px] text-[13px] font-semibold text-[#111111] sm:text-[14px]">
                  <List className="h-[15px] w-[15px] text-[#EA580C]" />
                  Service Options ({form.services.length})
                </h3>
                {hasChanged("services") && (
                  <span className="flex items-center gap-[4px] text-[10px] font-medium text-[#EA580C]">
                    <CircleDot className="h-[10px] w-[10px] fill-[#EA580C]" />
                    Changed
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-[12px]">
                {form.services.map((service, idx) => (
                  <ItemCard
                    key={service._id || idx}
                    title={service.label || `Service ${idx + 1}`}
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
                        <Field
                          label="Label"
                          hasChanged={hasChanged(
                            `services.${idx}.label`,
                          )}
                        >
                          <input
                            className={
                              hasChanged(`services.${idx}.label`)
                                ? inputChangedCls
                                : inputCls
                            }
                            value={service.label}
                            onChange={(e) =>
                              updateService(idx, "label", e.target.value)
                            }
                            placeholder="Car Washing"
                          />
                        </Field>

                        <Field
                          label="Value"
                          hasChanged={hasChanged(
                            `services.${idx}.value`,
                          )}
                        >
                          <input
                            className={
                              hasChanged(`services.${idx}.value`)
                                ? inputChangedCls
                                : inputCls
                            }
                            value={service.value}
                            onChange={(e) =>
                              updateService(idx, "value", e.target.value)
                            }
                            placeholder="car-washing"
                          />
                        </Field>

                        <Field
                          label="Order"
                          hasChanged={hasChanged(
                            `services.${idx}.order`,
                          )}
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
                      </div>
                    </div>
                  </ItemCard>
                ))}

                <AddButton onClick={addService} label="Add Service" />
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

function ContactBookingCreateModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [form, setForm] = useState<ContactBookingResponse>({
    ...deepClone(EMPTY_FORM),
    description: [],
    services: [],
  });
  const [saving, setSaving] = useState(false);
  const [uploadingLeft, setUploadingLeft] = useState(false);
  const [uploadingRight, setUploadingRight] = useState(false);

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
    key: keyof ServiceOption,
    val: unknown,
  ) => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (!clone.services[idx])
        clone.services[idx] = { ...EMPTY_SERVICE_OPTION };
      (clone.services[idx] as unknown as Record<string, unknown>)[key] = val;
      return clone;
    });
  };

  const addService = () => {
    setForm((prev) => ({
      ...prev,
      services: [
        ...prev.services,
        { ...deepClone(EMPTY_SERVICE_OPTION), order: prev.services.length },
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
      await api.post("/home-contact", payload);
      toast.success("Contact booking created successfully!");
      onCreated();
      onClose();
    } catch (err: unknown) {
      toast.error(
        extractErrorMessage(err, "Failed to create contact booking"),
      );
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
        className="relative flex w-full max-w-[900px] flex-col overflow-hidden rounded-t-[24px] bg-[#FFF4EC] shadow-2xl sm:max-h-[92vh] sm:rounded-[24px]"
        style={{ maxHeight: "92dvh" }}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[#E4C9B4] bg-white px-[20px] py-[14px] sm:px-[28px] sm:py-[16px]">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-widest text-[#EA580C]">
              Create
            </p>
            <h2 className="mt-[1px] text-[16px] font-semibold text-[#111111] sm:text-[18px]">
              New Contact Booking
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
                    placeholder="Contact"
                  />
                </Field>
                <Field label="Title">
                  <input
                    className={inputCls}
                    value={form.title}
                    onChange={(e) => setField("title", e.target.value)}
                    placeholder="Connect With MT Auto Zone"
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
                    value={form.backgroundImage}
                    onChange={(url) => setField("backgroundImage", url)}
                    label="Left Image"
                    uploading={uploadingLeft}
                    setUploading={setUploadingLeft}
                    aspect="wide"
                  />
                </div>
                <div className="sm:col-span-2">
                  <ImageUpload
                    value={form.backgroundImageTwo}
                    onChange={(url) => setField("backgroundImageTwo", url)}
                    label="Right Image"
                    uploading={uploadingRight}
                    setUploading={setUploadingRight}
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

            <div className="rounded-[14px] border border-[#E4C9B4] bg-white p-[16px]">
              <h3 className="mb-[14px] flex items-center gap-[8px] text-[13px] font-semibold text-[#111111] sm:text-[14px]">
                <List className="h-[15px] w-[15px] text-[#EA580C]" />
                Service Options ({form.services.length})
              </h3>
              <div className="flex flex-col gap-[12px]">
                {form.services.map((service, idx) => (
                  <ItemCard
                    key={idx}
                    title={service.label || `Service ${idx + 1}`}
                    onRemove={() => removeService(idx)}
                  >
                    <div className="grid gap-[14px] sm:grid-cols-2">
                      <Field label="Label">
                        <input
                          className={inputCls}
                          value={service.label}
                          onChange={(e) =>
                            updateService(idx, "label", e.target.value)
                          }
                          placeholder="Car Washing"
                        />
                      </Field>
                      <Field label="Value">
                        <input
                          className={inputCls}
                          value={service.value}
                          onChange={(e) =>
                            updateService(idx, "value", e.target.value)
                          }
                          placeholder="car-washing"
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
                      </div>
                    </div>
                  </ItemCard>
                ))}
                <AddButton onClick={addService} label="Add Service" />
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

export default function ContactBookingAdmin() {
  const [data, setData] = useState<ContactBookingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [editTarget, setEditTarget] = useState<ContactBookingData | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const [deleteTarget, setDeleteTarget] =
    useState<ContactBookingData | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get<ContactBookingData[] | ContactBookingData>(
        "/home-contact",
      );

      let list: ContactBookingData[] = [];
      if (Array.isArray(res.data)) {
        list = res.data;
      } else if (res.data && typeof res.data === "object") {
        list = [res.data as ContactBookingData];
      }

      setData(list);
    } catch (err: unknown) {
      const e = err as {
        response?: { status?: number; data?: { message?: string } };
      };
      if (e?.response?.status === 401) {
        toast.error("Unauthorized. Please sign in again.");
      } else {
        toast.error(
          extractErrorMessage(err, "Failed to load contact booking"),
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const confirmDelete = (item: ContactBookingData) => setDeleteTarget(item);
  const cancelDelete = () => {
    if (deletingId) return;
    setDeleteTarget(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeletingId(deleteTarget._id);
      await api.delete(`/home-contact/${deleteTarget._id}`);
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
            Contact Booking
          </h1>
          <p className="mt-[6px] text-[13px] leading-[1.6] text-[#666666] sm:text-[14px] lg:text-[15px]">
            Manage the contact booking section content and service options.
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
            Add Contact Booking
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
                No contact booking found
              </p>
              <p className="text-[12px] text-[#888888]">
                Click "Add Contact Booking" to create one.
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
                    {/* DUAL IMAGE PREVIEW */}
                    <div className="grid grid-cols-2 gap-[1px] bg-white/20">
                      {[item.backgroundImage, item.backgroundImageTwo].map(
                        (img, i) => (
                          <div
                            key={i}
                            className="relative h-[110px] w-full overflow-hidden bg-[#F1E4D8] sm:h-[140px]"
                          >
                            {img ? (
                              <Image
                                src={img}
                                alt={`${item.title} image ${i + 1}`}
                                fill
                                unoptimized
                                sizes="(max-width: 768px) 50vw, 400px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <ImageIcon className="h-[24px] w-[24px] text-[#C2410C]/40" />
                              </div>
                            )}
                          </div>
                        ),
                      )}
                    </div>

                    {/* OVERLAY HEADER */}
                    <div className="relative border-b border-[#E4C9B4]/30">
                      <div className="absolute right-[12px] top-[-36px] rounded-full bg-black/50 px-[10px] py-[4px] text-[10px] font-medium text-white backdrop-blur-sm sm:text-[11px]">
                        {item.isActive ? "Active" : "Inactive"}
                      </div>
                    </div>

                    <CardContent className="p-[16px] sm:p-[20px]">
                      <div className="flex flex-wrap items-center gap-[8px]">
                        {item.sectionLabel && (
                          <span className="text-[10px] font-medium uppercase tracking-widest text-[#EA580C] sm:text-[11px]">
                            {item.sectionLabel}
                          </span>
                        )}
                      </div>
                      <h3 className="mt-[2px] text-[16px] font-semibold text-[#111111] sm:text-[18px]">
                        {item.title}
                      </h3>

                      {/* Description preview */}
                      {item.description && item.description.length > 0 && (
                        <p className="mt-[10px] line-clamp-2 text-[12px] leading-[1.6] text-[#666] sm:text-[13px]">
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

                      {/* Service options preview */}
                      <div className="mt-[14px] flex flex-wrap items-center gap-[8px]">
                        <Tag className="h-[13px] w-[13px] text-[#888]" />
                        <span className="text-[11px] font-semibold uppercase tracking-widest text-[#888888]">
                          Services ({item.services?.length ?? 0})
                        </span>
                      </div>

                      <div className="mt-[10px] flex flex-wrap gap-[8px]">
                        {(item.services ?? []).map((svc, idx) => (
                          <span
                            key={svc._id || idx}
                            className={`rounded-full border px-[10px] py-[4px] text-[11px] font-medium sm:text-[12px] ${
                              svc.isActive
                                ? "border-[#EA580C]/20 bg-[#FFF4EC] text-[#C2410C]"
                                : "border-[#E4C9B4] bg-white text-[#999]"
                            }`}
                          >
                            {svc.label}
                          </span>
                        ))}
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
          <ContactBookingCreateModal
            onClose={() => setCreateOpen(false)}
            onCreated={fetchData}
          />
        )}
      </AnimatePresence>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {editTarget && (
          <ContactBookingEditModal
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
                Delete this contact booking?
              </h3>
              <p className="mt-[6px] text-[12px] leading-[1.6] text-[#666666] sm:text-[13px]">
                "{deleteTarget.title}" and its{" "}
                {deleteTarget.services?.length ?? 0} service options will be
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