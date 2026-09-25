"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Search,
  CircleDot,
  Save,
  Layers,
  ArrowUp,
  ArrowDown,
  Highlighter,
  MapPin,
  Mail,
  Phone,
  Clock,
  Sparkles,
} from "lucide-react";

import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

// ================= TYPES =================

interface DescriptionSegment {
  text: string;
  highlight: boolean;
}

interface ContactInfo {
  location: string;
  email: string;
  phone: string[];
  workingHours: string;
}

export interface ContactPageResponse {
  sectionLabel: string;
  title: string;
  description: DescriptionSegment[];
  contactInfo: ContactInfo;
  isActive: boolean;
}

interface ContactPageData extends ContactPageResponse {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

// ================= HELPERS =================

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
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

const EMPTY_CONTACT_INFO: ContactInfo = {
  location: "",
  email: "",
  phone: [],
  workingHours: "",
};

const EMPTY_FORM: ContactPageResponse = {
  sectionLabel: "Contact",
  title: "",
  description: [],
  contactInfo: { ...EMPTY_CONTACT_INFO, phone: [] },
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
          <span className="flex items-center gap-[4px] text-[10px] font-medium text-[#E40000]">
            <CircleDot className="h-[10px] w-[10px] fill-[#E40000]" />
            Changed
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

const inputCls =
  "w-full rounded-[10px] border border-[#E4C9B4] bg-white px-[12px] py-[9px] text-[13px] text-[#111111] placeholder:text-[#BBBBBB] focus:border-[#E40000] focus:outline-none transition-colors";

const inputChangedCls =
  "w-full rounded-[10px] border-2 border-[#E40000] bg-[#FFF9F4] px-[12px] py-[9px] text-[13px] text-[#111111] placeholder:text-[#BBBBBB] focus:border-[#E40000] focus:outline-none transition-colors";

const textareaCls =
  "w-full rounded-[10px] border border-[#E4C9B4] bg-white px-[12px] py-[9px] text-[13px] text-[#111111] placeholder:text-[#BBBBBB] focus:border-[#E40000] focus:outline-none transition-colors resize-y min-h-[80px]";

const textareaChangedCls =
  "w-full rounded-[10px] border-2 border-[#E40000] bg-[#FFF9F4] px-[12px] py-[9px] text-[13px] text-[#111111] placeholder:text-[#BBBBBB] focus:border-[#E40000] focus:outline-none transition-colors resize-y min-h-[80px]";

function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-[6px] self-start rounded-[10px] border border-dashed border-[#E4C9B4] px-[14px] py-[9px] text-[12px] font-medium text-[#E40000] transition-colors hover:border-[#E40000] hover:bg-[#FFF4EC]"
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
          <span className="flex items-center gap-[4px] text-[10px] font-medium text-[#E40000]">
            <CircleDot className="h-[10px] w-[10px] fill-[#E40000]" />
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
                <span className="ml-[6px] rounded-full bg-[#E40000]/10 px-[6px] py-[1px] text-[9px] text-[#E40000]">
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

function ContactPageEditModal({
  data: initialData,
  onClose,
  onSaved,
}: {
  data: ContactPageData;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<ContactPageData>(() => {
    const cloned = deepClone(initialData);
    if (!cloned.description) cloned.description = [];
    if (!cloned.contactInfo) {
      cloned.contactInfo = { ...EMPTY_CONTACT_INFO, phone: [] };
    }
    if (!Array.isArray(cloned.contactInfo.phone)) {
      cloned.contactInfo.phone = [];
    }
    return cloned;
  });
  const [originalForm] = useState<ContactPageData>(() =>
    deepClone(initialData),
  );
  const [saving, setSaving] = useState(false);

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
        form as ContactPageData & { __v?: number };

      await api.patch(`/contact-page/${form._id}`, cleanPayload);
      toast.success("Contact page updated successfully!");
      onSaved();
      onClose();
    } catch (err: unknown) {
      toast.error(extractErrorMessage(err, "Failed to update contact page"));
    } finally {
      setSaving(false);
    }
  };

  // ---- phone ops ----
  const updatePhone = (idx: number, val: string) => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (!clone.contactInfo) clone.contactInfo = { ...EMPTY_CONTACT_INFO, phone: [] };
      if (!Array.isArray(clone.contactInfo.phone)) clone.contactInfo.phone = [];
      clone.contactInfo.phone[idx] = val;
      return clone;
    });
  };

  const addPhone = () => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (!clone.contactInfo) clone.contactInfo = { ...EMPTY_CONTACT_INFO, phone: [] };
      if (!Array.isArray(clone.contactInfo.phone)) clone.contactInfo.phone = [];
      clone.contactInfo.phone.push("");
      return clone;
    });
  };

  const removePhone = (idx: number) => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (Array.isArray(clone.contactInfo?.phone)) {
        clone.contactInfo.phone.splice(idx, 1);
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
        className="relative flex w-full max-w-[860px] flex-col overflow-hidden rounded-t-[24px] bg-[#FFF4EC] shadow-2xl sm:max-h-[92vh] sm:rounded-[24px]"
        style={{ maxHeight: "92dvh" }}
      >
        {/* HEADER */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#E4C9B4] bg-white px-[20px] py-[14px] sm:px-[28px] sm:py-[16px]">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-widest text-[#E40000]">
              Edit Contact Page
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
                <Layers className="h-[15px] w-[15px] text-[#E40000]" />
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
                    <CircleDot className="h-[10px] w-[10px] fill-[#E40000] text-[#E40000]" />
                  )}
                </div>
              </div>
            </div>

            {/* CONTACT INFO */}
            <div className="rounded-[14px] border border-[#E4C9B4] bg-white p-[16px]">
              <div className="mb-[14px] flex flex-wrap items-center justify-between gap-[8px]">
                <h3 className="flex items-center gap-[8px] text-[13px] font-semibold text-[#111111] sm:text-[14px]">
                  <Phone className="h-[15px] w-[15px] text-[#E40000]" />
                  Contact Information
                </h3>
                {hasChanged("contactInfo") && (
                  <span className="flex items-center gap-[4px] text-[10px] font-medium text-[#E40000]">
                    <CircleDot className="h-[10px] w-[10px] fill-[#E40000]" />
                    Changed
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-[14px]">
                {/* Location */}
                <Field
                  label="Location"
                  hasChanged={hasChanged("contactInfo.location")}
                  icon={<MapPin className="h-[12px] w-[12px] text-[#E40000]" />}
                >
                  <input
                    className={
                      hasChanged("contactInfo.location")
                        ? inputChangedCls
                        : inputCls
                    }
                    value={form.contactInfo.location}
                    onChange={(e) =>
                      setField("contactInfo.location", e.target.value)
                    }
                    placeholder="18th B St - Umm Ramool - Dubai - United Arab Emirates"
                  />
                </Field>

                {/* Email */}
                <Field
                  label="Email"
                  hasChanged={hasChanged("contactInfo.email")}
                  icon={<Mail className="h-[12px] w-[12px] text-[#E40000]" />}
                >
                  <input
                    type="email"
                    className={
                      hasChanged("contactInfo.email")
                        ? inputChangedCls
                        : inputCls
                    }
                    value={form.contactInfo.email}
                    onChange={(e) =>
                      setField("contactInfo.email", e.target.value)
                    }
                    placeholder="info@example.com"
                  />
                </Field>

                {/* Working Hours */}
                <Field
                  label="Working Hours"
                  hasChanged={hasChanged("contactInfo.workingHours")}
                  icon={<Clock className="h-[12px] w-[12px] text-[#E40000]" />}
                >
                  <input
                    className={
                      hasChanged("contactInfo.workingHours")
                        ? inputChangedCls
                        : inputCls
                    }
                    value={form.contactInfo.workingHours}
                    onChange={(e) =>
                      setField("contactInfo.workingHours", e.target.value)
                    }
                    placeholder="Monday – Saturday | 9:00 AM – 7:00 PM"
                  />
                </Field>

                {/* Phones */}
                <div className="flex flex-col gap-[8px]">
                  <div className="flex items-center gap-[6px]">
                    <Phone className="h-[12px] w-[12px] text-[#E40000]" />
                    <Label className="text-[11px] font-semibold uppercase tracking-widest text-[#888888]">
                      Phone Numbers ({form.contactInfo.phone?.length ?? 0})
                    </Label>
                    {hasChanged("contactInfo.phone") && (
                      <span className="flex items-center gap-[4px] text-[10px] font-medium text-[#E40000]">
                        <CircleDot className="h-[10px] w-[10px] fill-[#E40000]" />
                        Changed
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-[6px]">
                    {(form.contactInfo.phone ?? []).map((phone, idx) => (
                      <div key={idx} className="flex items-center gap-[6px]">
                        <input
                          className={
                            hasChanged(`contactInfo.phone.${idx}`)
                              ? `${inputChangedCls} flex-1`
                              : `${inputCls} flex-1`
                          }
                          value={phone}
                          onChange={(e) => updatePhone(idx, e.target.value)}
                          placeholder="+971 4 000 0000"
                        />
                        <button
                          type="button"
                          onClick={() => removePhone(idx)}
                          className="shrink-0 rounded-[6px] p-[8px] text-[#DC2626] transition-colors hover:bg-red-50"
                        >
                          <Trash2 className="h-[13px] w-[13px]" />
                        </button>
                      </div>
                    ))}
                    <AddButton onClick={addPhone} label="Add Phone" />
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
            className="flex items-center gap-[7px] rounded-[10px] bg-[#E40000] px-[18px] py-[9px] text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
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

function ContactPageCreateModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [form, setForm] = useState<ContactPageResponse>({
    ...deepClone(EMPTY_FORM),
    description: [],
    contactInfo: { ...EMPTY_CONTACT_INFO, phone: [] },
  });
  const [saving, setSaving] = useState(false);

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

  const updatePhone = (idx: number, val: string) => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (!Array.isArray(clone.contactInfo.phone)) clone.contactInfo.phone = [];
      clone.contactInfo.phone[idx] = val;
      return clone;
    });
  };

  const addPhone = () => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (!Array.isArray(clone.contactInfo.phone)) clone.contactInfo.phone = [];
      clone.contactInfo.phone.push("");
      return clone;
    });
  };

  const removePhone = (idx: number) => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (Array.isArray(clone.contactInfo.phone)) {
        clone.contactInfo.phone.splice(idx, 1);
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
      await api.post("/contact-page", form);
      toast.success("Contact page created successfully!");
      onCreated();
      onClose();
    } catch (err: unknown) {
      toast.error(extractErrorMessage(err, "Failed to create contact page"));
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
        className="relative flex w-full max-w-[860px] flex-col overflow-hidden rounded-t-[24px] bg-[#FFF4EC] shadow-2xl sm:max-h-[92vh] sm:rounded-[24px]"
        style={{ maxHeight: "92dvh" }}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[#E4C9B4] bg-white px-[20px] py-[14px] sm:px-[28px] sm:py-[16px]">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-widest text-[#E40000]">
              Create
            </p>
            <h2 className="mt-[1px] text-[16px] font-semibold text-[#111111] sm:text-[18px]">
              New Contact Page
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
                <Layers className="h-[15px] w-[15px] text-[#E40000]" />
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
                <Phone className="h-[15px] w-[15px] text-[#E40000]" />
                Contact Information
              </h3>

              <div className="flex flex-col gap-[14px]">
                <Field
                  label="Location"
                  icon={<MapPin className="h-[12px] w-[12px] text-[#E40000]" />}
                >
                  <input
                    className={inputCls}
                    value={form.contactInfo.location}
                    onChange={(e) =>
                      setField("contactInfo.location", e.target.value)
                    }
                    placeholder="18th B St - Umm Ramool - Dubai - United Arab Emirates"
                  />
                </Field>

                <Field
                  label="Email"
                  icon={<Mail className="h-[12px] w-[12px] text-[#E40000]" />}
                >
                  <input
                    type="email"
                    className={inputCls}
                    value={form.contactInfo.email}
                    onChange={(e) =>
                      setField("contactInfo.email", e.target.value)
                    }
                    placeholder="info@example.com"
                  />
                </Field>

                <Field
                  label="Working Hours"
                  icon={<Clock className="h-[12px] w-[12px] text-[#E40000]" />}
                >
                  <input
                    className={inputCls}
                    value={form.contactInfo.workingHours}
                    onChange={(e) =>
                      setField("contactInfo.workingHours", e.target.value)
                    }
                    placeholder="Monday – Saturday | 9:00 AM – 7:00 PM"
                  />
                </Field>

                <div className="flex flex-col gap-[8px]">
                  <div className="flex items-center gap-[6px]">
                    <Phone className="h-[12px] w-[12px] text-[#E40000]" />
                    <Label className="text-[11px] font-semibold uppercase tracking-widest text-[#888888]">
                      Phone Numbers ({form.contactInfo.phone?.length ?? 0})
                    </Label>
                  </div>

                  <div className="flex flex-col gap-[6px]">
                    {(form.contactInfo.phone ?? []).map((phone, idx) => (
                      <div key={idx} className="flex items-center gap-[6px]">
                        <input
                          className={`${inputCls} flex-1`}
                          value={phone}
                          onChange={(e) => updatePhone(idx, e.target.value)}
                          placeholder="+971 4 000 0000"
                        />
                        <button
                          type="button"
                          onClick={() => removePhone(idx)}
                          className="shrink-0 rounded-[6px] p-[8px] text-[#DC2626] transition-colors hover:bg-red-50"
                        >
                          <Trash2 className="h-[13px] w-[13px]" />
                        </button>
                      </div>
                    ))}
                    <AddButton onClick={addPhone} label="Add Phone" />
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
            className="flex items-center gap-[7px] rounded-[10px] bg-[#E40000] px-[18px] py-[9px] text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
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

export default function ContactPageAdmin() {
  const [data, setData] = useState<ContactPageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [editTarget, setEditTarget] = useState<ContactPageData | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<ContactPageData | null>(
    null,
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get<ContactPageData[] | ContactPageData>(
        "/contact-page",
      );

      let list: ContactPageData[] = [];
      if (Array.isArray(res.data)) {
        list = res.data;
      } else if (res.data && typeof res.data === "object") {
        list = [res.data as ContactPageData];
      }

      setData(list);
    } catch (err: unknown) {
      const e = err as {
        response?: { status?: number; data?: { message?: string } };
      };
      if (e?.response?.status === 401) {
        toast.error("Unauthorized. Please sign in again.");
      } else {
        toast.error(extractErrorMessage(err, "Failed to load contact page"));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const confirmDelete = (item: ContactPageData) => setDeleteTarget(item);
  const cancelDelete = () => {
    if (deletingId) return;
    setDeleteTarget(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeletingId(deleteTarget._id);
      await api.delete(`/contact-page/${deleteTarget._id}`);
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
          success: { iconTheme: { primary: "#E40000", secondary: "#fff" } },
          error: { iconTheme: { primary: "#DC2626", secondary: "#fff" } },
        }}
      />

      {/* HEADER */}
      <div className="mx-auto flex max-w-[1600px] flex-col gap-[16px] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[22px] font-semibold tracking-[-0.5px] text-[#111111] xs:text-[24px] sm:text-[28px] lg:text-[32px]">
            Contact Page
          </h1>
          <p className="mt-[6px] text-[13px] leading-[1.6] text-[#666666] sm:text-[14px] lg:text-[15px]">
            Manage the contact section content and contact information.
          </p>
        </div>

        <div className="flex flex-col gap-[10px] xs:flex-row sm:gap-[12px]">
          <div className="relative">
            <Search className="absolute left-[12px] top-1/2 h-[16px] w-[16px] -translate-y-1/2 text-[#999]" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="h-[42px] w-full rounded-[12px] border-[#E4E4E4] bg-white pl-[36px] text-[13px] focus-visible:ring-[#E40000]/30 sm:w-[220px]"
            />
          </div>
          <Button
            onClick={() => setCreateOpen(true)}
            className="flex h-[42px] items-center justify-center gap-[8px] rounded-[14px] bg-[#E40000] text-[13px] font-medium text-white hover:bg-[#E40000] hover:shadow-[0_14px_30px_rgba(234,88,12,0.3)] sm:h-[44px] sm:px-[20px] sm:text-[14px]"
          >
            <Plus className="h-[17px] w-[17px]" />
            Add Contact Page
          </Button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="mx-auto mt-[22px] max-w-[1600px] sm:mt-[28px] lg:mt-[32px]">
        {loading ? (
          <div className="flex min-h-[200px] items-center justify-center">
            <Loader2 className="h-[28px] w-[28px] animate-spin text-[#E40000]" />
          </div>
        ) : filtered.length === 0 ? (
          <Card className="rounded-[20px] border border-dashed border-[#E4C9B4] bg-white/60">
            <CardContent className="flex flex-col items-center justify-center gap-[10px] p-[48px] text-center">
              <Sparkles className="h-[32px] w-[32px] text-[#E40000]/50" />
              <p className="text-[14px] font-medium text-[#333333]">
                No contact page found
              </p>
              <p className="text-[12px] text-[#888888]">
                Click "Add Contact Page" to create one.
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
                    <CardContent className="p-[16px] sm:p-[24px]">
                      {/* HEADER ROW */}
                      <div className="flex flex-wrap items-start justify-between gap-[12px] border-b border-[#E4C9B4]/30 pb-[16px]">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-[8px]">
                            {item.sectionLabel && (
                              <span className="text-[11px] font-medium uppercase tracking-widest text-[#E40000] sm:text-[12px]">
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
                          <h3 className="mt-[4px] text-[16px] font-semibold text-[#111111] sm:text-[18px] lg:text-[20px]">
                            {item.title}
                          </h3>
                        </div>

                        <div className="flex shrink-0 items-center gap-[8px]">
                          <Button
                            onClick={() => setEditTarget(item)}
                            variant="outline"
                            className="h-[34px] gap-[6px] rounded-[10px] border-[#E4C9B4] bg-white px-[12px] text-[12px] font-medium text-[#E40000] hover:bg-[#FFF4EC] hover:text-[#E40000] sm:h-[36px] sm:text-[13px]"
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

                      {/* DESCRIPTION PREVIEW */}
                      {item.description && item.description.length > 0 && (
                        <p className="mt-[14px] line-clamp-3 text-[12px] leading-[1.6] text-[#666] sm:text-[13px]">
                          {item.description.map((seg, i) =>
                            seg.highlight ? (
                              <span
                                key={i}
                                className="font-medium text-[#E40000]"
                              >
                                {seg.text}
                              </span>
                            ) : (
                              <span key={i}>{seg.text}</span>
                            ),
                          )}
                        </p>
                      )}

                      {/* CONTACT INFO */}
                      <div className="mt-[16px] grid grid-cols-1 gap-[8px] sm:grid-cols-2 lg:grid-cols-4">
                        {item.contactInfo?.location && (
                          <div className="flex items-start gap-[8px] rounded-[8px] bg-[#FFF9F4] p-[10px]">
                            <MapPin className="mt-[2px] h-[14px] w-[14px] shrink-0 text-[#E40000]" />
                            <span className="text-[11px] leading-[1.5] text-[#666] sm:text-[12px]">
                              {item.contactInfo.location}
                            </span>
                          </div>
                        )}
                        {item.contactInfo?.email && (
                          <div className="flex items-center gap-[8px] rounded-[8px] bg-[#FFF9F4] p-[10px]">
                            <Mail className="h-[14px] w-[14px] shrink-0 text-[#E40000]" />
                            <span className="truncate text-[11px] text-[#666] sm:text-[12px]">
                              {item.contactInfo.email}
                            </span>
                          </div>
                        )}
                        {item.contactInfo?.workingHours && (
                          <div className="flex items-center gap-[8px] rounded-[8px] bg-[#FFF9F4] p-[10px]">
                            <Clock className="h-[14px] w-[14px] shrink-0 text-[#E40000]" />
                            <span className="truncate text-[11px] text-[#666] sm:text-[12px]">
                              {item.contactInfo.workingHours}
                            </span>
                          </div>
                        )}
                        {item.contactInfo?.phone?.length > 0 && (
                          <div className="flex items-start gap-[8px] rounded-[8px] bg-[#FFF9F4] p-[10px]">
                            <Phone className="mt-[2px] h-[14px] w-[14px] shrink-0 text-[#E40000]" />
                            <div className="flex flex-col gap-[2px]">
                              {item.contactInfo.phone.map((p, i) => (
                                <span
                                  key={i}
                                  className="text-[11px] text-[#666] sm:text-[12px]"
                                >
                                  {p}
                                </span>
                              ))}
                            </div>
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
          <ContactPageCreateModal
            onClose={() => setCreateOpen(false)}
            onCreated={fetchData}
          />
        )}
      </AnimatePresence>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {editTarget && (
          <ContactPageEditModal
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
                Delete this contact page?
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