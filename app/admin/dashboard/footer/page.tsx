"use client";

import { useEffect, useState, useCallback, useRef } from "react";
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
  Sparkles,
  List,
  Link as LinkIcon,
  Phone,
  Mail,
  MapPin,
  Share2,
  Building2,
  Wrench,
  AtSign,
} from "lucide-react";

import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

// ================= TYPES =================

interface FooterLink {
  _id?: string;
  title: string;
  link: string;
  order: number;
  isActive: boolean;
}

interface FooterSocialLink {
  _id?: string;
  name: string;
  icon: string;
  link: string;
  order: number;
  isActive: boolean;
}

export interface FooterResponse {
  addressTitle: string;
  address: string;
  servicesTitle: string;
  services: FooterLink[];
  companyTitle: string;
  companyLinks: FooterLink[];
  contactTitle: string;
  phone: string;
  email: string;
  salesEmail: string;
  socialLinks: FooterSocialLink[];
  isActive: boolean;
}

interface FooterData extends FooterResponse {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

// ================= HELPERS =================

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Strip `_id` from nested arrays (services, companyLinks, socialLinks) before
 * sending to the API. The backend regenerates these automatically.
 */
function stripNestedIds<T extends Record<string, unknown>>(obj: T): T {
  const clone = deepClone(obj);

  const cleanArray = (arr: unknown[] | undefined) => {
    if (!Array.isArray(arr)) return arr;
    return arr.map((item) => {
      const it = item as Record<string, unknown>;
      const { _id, ...rest } = it;
      return rest;
    });
  };

  const mutableClone = clone as Record<string, any>;
  mutableClone.services = cleanArray(mutableClone.services);
  mutableClone.companyLinks = cleanArray(mutableClone.companyLinks);
  mutableClone.socialLinks = cleanArray(mutableClone.socialLinks);

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

const EMPTY_LINK: FooterLink = {
  title: "",
  link: "",
  order: 0,
  isActive: true,
};

const EMPTY_SOCIAL: FooterSocialLink = {
  name: "",
  icon: "",
  link: "",
  order: 0,
  isActive: true,
};

const EMPTY_FORM: FooterResponse = {
  addressTitle: "Address",
  address: "",
  servicesTitle: "Services",
  services: [],
  companyTitle: "Company",
  companyLinks: [],
  contactTitle: "Contact",
  phone: "",
  email: "",
  salesEmail: "",
  socialLinks: [],
  isActive: true,
};

// ================= UI HELPERS =================

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
      className="flex items-center gap-[6px] self-start rounded-[10px] border border-dashed border-[#E4C9B4] px-[14px] py-[9px] text-[12px] font-medium text-[#E40000] transition-colors hover:border-[#E40000] hover:bg-[#FFF4EC]"
    >
      <Plus className="h-[13px] w-[13px]" />
      {label}
    </button>
  );
}

// ================= EDIT MODAL =================

function FooterEditModal({
  data: initialData,
  onClose,
  onSaved,
}: {
  data: FooterData;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<FooterData>(() => {
    const cloned = deepClone(initialData);
    cloned.services = Array.isArray(cloned.services) ? cloned.services : [];
    cloned.companyLinks = Array.isArray(cloned.companyLinks)
      ? cloned.companyLinks
      : [];
    cloned.socialLinks = Array.isArray(cloned.socialLinks)
      ? cloned.socialLinks
      : [];
    return cloned;
  });
  const [originalForm] = useState<FooterData>(() => deepClone(initialData));
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
        form as FooterData & { __v?: number };

      const payload = stripNestedIds(cleanPayload as unknown as Record<string, unknown>);

      await api.put(`/footer/${form._id}`, payload);
      toast.success("Footer updated successfully!");
      onSaved();
      onClose();
    } catch (err: unknown) {
      toast.error(extractErrorMessage(err, "Failed to update footer"));
    } finally {
      setSaving(false);
    }
  };

  // ============ LINK ARRAY HELPERS ============

  const updateLink = (
    arrayKey: "services" | "companyLinks",
    idx: number,
    key: keyof FooterLink,
    val: unknown,
  ) => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (!clone[arrayKey]) clone[arrayKey] = [];
      (clone[arrayKey][idx] as unknown as Record<string, unknown>)[key] = val;
      return clone;
    });
  };

  const addLink = (arrayKey: "services" | "companyLinks") => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (!clone[arrayKey]) clone[arrayKey] = [];
      clone[arrayKey].push({
        ...deepClone(EMPTY_LINK),
        order: clone[arrayKey].length,
      });
      return clone;
    });
  };

  const removeLink = (arrayKey: "services" | "companyLinks", idx: number) => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (clone[arrayKey]) {
        clone[arrayKey].splice(idx, 1);
        clone[arrayKey] = clone[arrayKey].map((l, i) => ({ ...l, order: i }));
      }
      return clone;
    });
  };

  const moveLink = (
    arrayKey: "services" | "companyLinks",
    idx: number,
    dir: "up" | "down",
  ) => {
    const newIdx = dir === "up" ? idx - 1 : idx + 1;
    if (!form[arrayKey]) return;
    if (newIdx < 0 || newIdx >= form[arrayKey].length) return;
    setForm((prev) => {
      const clone = deepClone(prev);
      if (!clone[arrayKey]) return clone;
      const [moved] = clone[arrayKey].splice(idx, 1);
      clone[arrayKey].splice(newIdx, 0, moved);
      clone[arrayKey] = clone[arrayKey].map((l, i) => ({ ...l, order: i }));
      return clone;
    });
  };

  // ============ SOCIAL HELPERS ============

  const updateSocial = (
    idx: number,
    key: keyof FooterSocialLink,
    val: unknown,
  ) => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (!clone.socialLinks) clone.socialLinks = [];
      (clone.socialLinks[idx] as unknown as Record<string, unknown>)[key] = val;
      return clone;
    });
  };

  const addSocial = () => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (!clone.socialLinks) clone.socialLinks = [];
      clone.socialLinks.push({
        ...deepClone(EMPTY_SOCIAL),
        order: clone.socialLinks.length,
      });
      return clone;
    });
  };

  const removeSocial = (idx: number) => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (clone.socialLinks) {
        clone.socialLinks.splice(idx, 1);
        clone.socialLinks = clone.socialLinks.map((s, i) => ({
          ...s,
          order: i,
        }));
      }
      return clone;
    });
  };

  const moveSocial = (idx: number, dir: "up" | "down") => {
    const newIdx = dir === "up" ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= form.socialLinks.length) return;
    setForm((prev) => {
      const clone = deepClone(prev);
      if (!clone.socialLinks) return clone;
      const [moved] = clone.socialLinks.splice(idx, 1);
      clone.socialLinks.splice(newIdx, 0, moved);
      clone.socialLinks = clone.socialLinks.map((s, i) => ({
        ...s,
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
            <p className="text-[11px] font-medium uppercase tracking-widest text-[#E40000]">
              Edit Footer
            </p>
            <h2 className="mt-[1px] text-[16px] font-semibold text-[#111111] sm:text-[18px]">
              {form.addressTitle || "Footer Configuration"}
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
            {/* ADDRESS */}
            <div className="rounded-[14px] border border-[#E4C9B4] bg-white p-[16px]">
              <h3 className="mb-[14px] flex items-center gap-[8px] text-[13px] font-semibold text-[#111111] sm:text-[14px]">
                <MapPin className="h-[15px] w-[15px] text-[#E40000]" />
                Address
              </h3>
              <div className="grid gap-[14px] sm:grid-cols-2">
                <Field
                  label="Address Title"
                  hasChanged={hasChanged("addressTitle")}
                >
                  <input
                    className={
                      hasChanged("addressTitle") ? inputChangedCls : inputCls
                    }
                    value={form.addressTitle}
                    onChange={(e) => setField("addressTitle", e.target.value)}
                    placeholder="Address"
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Address" hasChanged={hasChanged("address")}>
                    <textarea
                      className={
                        hasChanged("address")
                          ? `${inputChangedCls} min-h-[70px] resize-y`
                          : `${inputCls} min-h-[70px] resize-y`
                      }
                      value={form.address}
                      onChange={(e) => setField("address", e.target.value)}
                      placeholder="MT Autozone Address: 18th B St - Umm Ramool - Dubai..."
                    />
                  </Field>
                </div>
              </div>
            </div>

            {/* SERVICES */}
            <div className="rounded-[14px] border border-[#E4C9B4] bg-white p-[16px]">
              <div className="mb-[14px] flex flex-wrap items-center justify-between gap-[8px]">
                <h3 className="flex items-center gap-[8px] text-[13px] font-semibold text-[#111111] sm:text-[14px]">
                  <Wrench className="h-[15px] w-[15px] text-[#E40000]" />
                  Services ({form.services?.length ?? 0})
                </h3>
                {hasChanged("services") && (
                  <span className="flex items-center gap-[4px] text-[10px] font-medium text-[#E40000]">
                    <CircleDot className="h-[10px] w-[10px] fill-[#E40000]" />
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
                    placeholder="Services"
                  />
                </Field>
              </div>

              <div className="flex flex-col gap-[10px]">
                {(form.services ?? []).map((srv, idx) => (
                  <ItemCard
                    key={srv._id || `service-${idx}`}
                    title={srv.title || `Service ${idx + 1}`}
                    onRemove={() => removeLink("services", idx)}
                    extraActions={
                      <>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveLink("services", idx, "up");
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
                            moveLink("services", idx, "down");
                          }}
                          disabled={idx === (form.services?.length ?? 0) - 1}
                          className="rounded-[6px] p-[4px] text-[#666] transition-colors hover:bg-[#FFF4EC] disabled:opacity-30"
                        >
                          <ArrowDown className="h-[13px] w-[13px]" />
                        </button>
                      </>
                    }
                  >
                    <div className="grid gap-[12px] sm:grid-cols-2">
                      <Field
                        label="Title"
                        hasChanged={hasChanged(`services.${idx}.title`)}
                      >
                        <input
                          className={
                            hasChanged(`services.${idx}.title`)
                              ? inputChangedCls
                              : inputCls
                          }
                          value={srv.title}
                          onChange={(e) =>
                            updateLink("services", idx, "title", e.target.value)
                          }
                          placeholder="Interior Cleaning & Detailing"
                        />
                      </Field>

                      <Field
                        label="Link"
                        hasChanged={hasChanged(`services.${idx}.link`)}
                      >
                        <input
                          className={
                            hasChanged(`services.${idx}.link`)
                              ? inputChangedCls
                              : inputCls
                          }
                          value={srv.link}
                          onChange={(e) =>
                            updateLink("services", idx, "link", e.target.value)
                          }
                          placeholder="/services/interior-cleaning-detailing"
                        />
                      </Field>

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
                          value={srv.order}
                          onChange={(e) =>
                            updateLink(
                              "services",
                              idx,
                              "order",
                              Number(e.target.value),
                            )
                          }
                        />
                      </Field>

                      <div className="flex items-center gap-[10px]">
                        <Switch
                          checked={srv.isActive}
                          onCheckedChange={(checked) =>
                            updateLink("services", idx, "isActive", checked)
                          }
                        />
                        <Label className="text-[13px] font-medium text-[#2A2A2A]">
                          Active
                        </Label>
                        {hasChanged(`services.${idx}.isActive`) && (
                          <CircleDot className="h-[10px] w-[10px] fill-[#E40000] text-[#E40000]" />
                        )}
                      </div>
                    </div>
                  </ItemCard>
                ))}
                <AddButton
                  onClick={() => addLink("services")}
                  label="Add Service"
                />
              </div>
            </div>

            {/* COMPANY LINKS */}
            <div className="rounded-[14px] border border-[#E4C9B4] bg-white p-[16px]">
              <div className="mb-[14px] flex flex-wrap items-center justify-between gap-[8px]">
                <h3 className="flex items-center gap-[8px] text-[13px] font-semibold text-[#111111] sm:text-[14px]">
                  <Building2 className="h-[15px] w-[15px] text-[#E40000]" />
                  Company Links ({form.companyLinks?.length ?? 0})
                </h3>
                {hasChanged("companyLinks") && (
                  <span className="flex items-center gap-[4px] text-[10px] font-medium text-[#E40000]">
                    <CircleDot className="h-[10px] w-[10px] fill-[#E40000]" />
                    Changed
                  </span>
                )}
              </div>

              <div className="mb-[14px]">
                <Field
                  label="Company Title"
                  hasChanged={hasChanged("companyTitle")}
                >
                  <input
                    className={
                      hasChanged("companyTitle") ? inputChangedCls : inputCls
                    }
                    value={form.companyTitle}
                    onChange={(e) => setField("companyTitle", e.target.value)}
                    placeholder="Company"
                  />
                </Field>
              </div>

              <div className="flex flex-col gap-[10px]">
                {(form.companyLinks ?? []).map((lnk, idx) => (
                  <ItemCard
                    key={lnk._id || `company-${idx}`}
                    title={lnk.title || `Link ${idx + 1}`}
                    onRemove={() => removeLink("companyLinks", idx)}
                    extraActions={
                      <>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveLink("companyLinks", idx, "up");
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
                            moveLink("companyLinks", idx, "down");
                          }}
                          disabled={
                            idx === (form.companyLinks?.length ?? 0) - 1
                          }
                          className="rounded-[6px] p-[4px] text-[#666] transition-colors hover:bg-[#FFF4EC] disabled:opacity-30"
                        >
                          <ArrowDown className="h-[13px] w-[13px]" />
                        </button>
                      </>
                    }
                  >
                    <div className="grid gap-[12px] sm:grid-cols-2">
                      <Field
                        label="Title"
                        hasChanged={hasChanged(`companyLinks.${idx}.title`)}
                      >
                        <input
                          className={
                            hasChanged(`companyLinks.${idx}.title`)
                              ? inputChangedCls
                              : inputCls
                          }
                          value={lnk.title}
                          onChange={(e) =>
                            updateLink(
                              "companyLinks",
                              idx,
                              "title",
                              e.target.value,
                            )
                          }
                          placeholder="Home"
                        />
                      </Field>

                      <Field
                        label="Link"
                        hasChanged={hasChanged(`companyLinks.${idx}.link`)}
                      >
                        <input
                          className={
                            hasChanged(`companyLinks.${idx}.link`)
                              ? inputChangedCls
                              : inputCls
                          }
                          value={lnk.link}
                          onChange={(e) =>
                            updateLink(
                              "companyLinks",
                              idx,
                              "link",
                              e.target.value,
                            )
                          }
                          placeholder="/about"
                        />
                      </Field>

                      <Field
                        label="Order"
                        hasChanged={hasChanged(`companyLinks.${idx}.order`)}
                      >
                        <input
                          type="number"
                          className={
                            hasChanged(`companyLinks.${idx}.order`)
                              ? inputChangedCls
                              : inputCls
                          }
                          value={lnk.order}
                          onChange={(e) =>
                            updateLink(
                              "companyLinks",
                              idx,
                              "order",
                              Number(e.target.value),
                            )
                          }
                        />
                      </Field>

                      <div className="flex items-center gap-[10px]">
                        <Switch
                          checked={lnk.isActive}
                          onCheckedChange={(checked) =>
                            updateLink(
                              "companyLinks",
                              idx,
                              "isActive",
                              checked,
                            )
                          }
                        />
                        <Label className="text-[13px] font-medium text-[#2A2A2A]">
                          Active
                        </Label>
                        {hasChanged(`companyLinks.${idx}.isActive`) && (
                          <CircleDot className="h-[10px] w-[10px] fill-[#E40000] text-[#E40000]" />
                        )}
                      </div>
                    </div>
                  </ItemCard>
                ))}
                <AddButton
                  onClick={() => addLink("companyLinks")}
                  label="Add Company Link"
                />
              </div>
            </div>

            {/* CONTACT */}
            <div className="rounded-[14px] border border-[#E4C9B4] bg-white p-[16px]">
              <h3 className="mb-[14px] flex items-center gap-[8px] text-[13px] font-semibold text-[#111111] sm:text-[14px]">
                <Phone className="h-[15px] w-[15px] text-[#E40000]" />
                Contact
              </h3>
              <div className="grid gap-[14px] sm:grid-cols-2">
                <Field
                  label="Contact Title"
                  hasChanged={hasChanged("contactTitle")}
                >
                  <input
                    className={
                      hasChanged("contactTitle") ? inputChangedCls : inputCls
                    }
                    value={form.contactTitle}
                    onChange={(e) => setField("contactTitle", e.target.value)}
                    placeholder="Contact"
                  />
                </Field>

                <Field label="Phone" hasChanged={hasChanged("phone")}>
                  <input
                    className={hasChanged("phone") ? inputChangedCls : inputCls}
                    value={form.phone}
                    onChange={(e) => setField("phone", e.target.value)}
                    placeholder="+971 55 169 6443"
                  />
                </Field>

                <Field label="Email" hasChanged={hasChanged("email")}>
                  <input
                    className={hasChanged("email") ? inputChangedCls : inputCls}
                    value={form.email}
                    onChange={(e) => setField("email", e.target.value)}
                    placeholder="abrar.sayed@honestynperfection.com"
                  />
                </Field>

                <Field
                  label="Sales Email"
                  hasChanged={hasChanged("salesEmail")}
                >
                  <input
                    className={
                      hasChanged("salesEmail") ? inputChangedCls : inputCls
                    }
                    value={form.salesEmail}
                    onChange={(e) => setField("salesEmail", e.target.value)}
                    placeholder="sales@honestynperfection.com"
                  />
                </Field>
              </div>
            </div>

            {/* SOCIAL LINKS */}
            <div className="rounded-[14px] border border-[#E4C9B4] bg-white p-[16px]">
              <div className="mb-[14px] flex flex-wrap items-center justify-between gap-[8px]">
                <h3 className="flex items-center gap-[8px] text-[13px] font-semibold text-[#111111] sm:text-[14px]">
                  <Share2 className="h-[15px] w-[15px] text-[#E40000]" />
                  Social Links ({form.socialLinks?.length ?? 0})
                </h3>
                {hasChanged("socialLinks") && (
                  <span className="flex items-center gap-[4px] text-[10px] font-medium text-[#E40000]">
                    <CircleDot className="h-[10px] w-[10px] fill-[#E40000]" />
                    Changed
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-[10px]">
                {(form.socialLinks ?? []).map((soc, idx) => (
                  <ItemCard
                    key={soc._id || `social-${idx}`}
                    title={soc.name || `Social ${idx + 1}`}
                    onRemove={() => removeSocial(idx)}
                    extraActions={
                      <>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveSocial(idx, "up");
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
                            moveSocial(idx, "down");
                          }}
                          disabled={
                            idx === (form.socialLinks?.length ?? 0) - 1
                          }
                          className="rounded-[6px] p-[4px] text-[#666] transition-colors hover:bg-[#FFF4EC] disabled:opacity-30"
                        >
                          <ArrowDown className="h-[13px] w-[13px]" />
                        </button>
                      </>
                    }
                  >
                    <div className="grid gap-[12px] sm:grid-cols-2">
                      <Field
                        label="Name"
                        hasChanged={hasChanged(`socialLinks.${idx}.name`)}
                      >
                        <input
                          className={
                            hasChanged(`socialLinks.${idx}.name`)
                              ? inputChangedCls
                              : inputCls
                          }
                          value={soc.name}
                          onChange={(e) =>
                            updateSocial(idx, "name", e.target.value)
                          }
                          placeholder="Instagram"
                        />
                      </Field>

                      <Field
                        label="Icon"
                        hasChanged={hasChanged(`socialLinks.${idx}.icon`)}
                      >
                        <input
                          className={
                            hasChanged(`socialLinks.${idx}.icon`)
                              ? inputChangedCls
                              : inputCls
                          }
                          value={soc.icon}
                          onChange={(e) =>
                            updateSocial(idx, "icon", e.target.value)
                          }
                          placeholder="instagram"
                        />
                      </Field>

                      <div className="sm:col-span-2">
                        <Field
                          label="Link"
                          hasChanged={hasChanged(`socialLinks.${idx}.link`)}
                        >
                          <input
                            className={
                              hasChanged(`socialLinks.${idx}.link`)
                                ? inputChangedCls
                                : inputCls
                            }
                            value={soc.link}
                            onChange={(e) =>
                              updateSocial(idx, "link", e.target.value)
                            }
                            placeholder="https://www.instagram.com/"
                          />
                        </Field>
                      </div>

                      <Field
                        label="Order"
                        hasChanged={hasChanged(`socialLinks.${idx}.order`)}
                      >
                        <input
                          type="number"
                          className={
                            hasChanged(`socialLinks.${idx}.order`)
                              ? inputChangedCls
                              : inputCls
                          }
                          value={soc.order}
                          onChange={(e) =>
                            updateSocial(
                              idx,
                              "order",
                              Number(e.target.value),
                            )
                          }
                        />
                      </Field>

                      <div className="flex items-center gap-[10px]">
                        <Switch
                          checked={soc.isActive}
                          onCheckedChange={(checked) =>
                            updateSocial(idx, "isActive", checked)
                          }
                        />
                        <Label className="text-[13px] font-medium text-[#2A2A2A]">
                          Active
                        </Label>
                        {hasChanged(`socialLinks.${idx}.isActive`) && (
                          <CircleDot className="h-[10px] w-[10px] fill-[#E40000] text-[#E40000]" />
                        )}
                      </div>
                    </div>
                  </ItemCard>
                ))}
                <AddButton onClick={addSocial} label="Add Social Link" />
              </div>
            </div>

            {/* SECTION ACTIVE */}
            <div className="flex items-center gap-[10px] rounded-[14px] border border-[#E4C9B4] bg-white p-[16px]">
              <Switch
                checked={form.isActive}
                onCheckedChange={(checked) => setField("isActive", checked)}
              />
              <Label className="text-[13px] font-medium text-[#2A2A2A]">
                Footer Active
              </Label>
              {hasChanged("isActive") && (
                <CircleDot className="h-[10px] w-[10px] fill-[#E40000] text-[#E40000]" />
              )}
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

function FooterCreateModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [form, setForm] = useState<FooterResponse>(() => {
    const f = deepClone(EMPTY_FORM);
    // Seed with a sensible default social link / service so users have a starting row
    f.services = [{ ...deepClone(EMPTY_LINK), order: 0 }];
    f.companyLinks = [{ ...deepClone(EMPTY_LINK), order: 0 }];
    f.socialLinks = [{ ...deepClone(EMPTY_SOCIAL), order: 0 }];
    return f;
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

  const updateLink = (
    arrayKey: "services" | "companyLinks",
    idx: number,
    key: keyof FooterLink,
    val: unknown,
  ) => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (!clone[arrayKey]) clone[arrayKey] = [];
      (clone[arrayKey][idx] as unknown as Record<string, unknown>)[key] = val;
      return clone;
    });
  };

  const addLink = (arrayKey: "services" | "companyLinks") => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (!clone[arrayKey]) clone[arrayKey] = [];
      clone[arrayKey].push({
        ...deepClone(EMPTY_LINK),
        order: clone[arrayKey].length,
      });
      return clone;
    });
  };

  const removeLink = (arrayKey: "services" | "companyLinks", idx: number) => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (clone[arrayKey]) {
        clone[arrayKey].splice(idx, 1);
        clone[arrayKey] = clone[arrayKey].map((l, i) => ({ ...l, order: i }));
      }
      return clone;
    });
  };

  const updateSocial = (
    idx: number,
    key: keyof FooterSocialLink,
    val: unknown,
  ) => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (!clone.socialLinks) clone.socialLinks = [];
      (clone.socialLinks[idx] as unknown as Record<string, unknown>)[key] = val;
      return clone;
    });
  };

  const addSocial = () => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (!clone.socialLinks) clone.socialLinks = [];
      clone.socialLinks.push({
        ...deepClone(EMPTY_SOCIAL),
        order: clone.socialLinks.length,
      });
      return clone;
    });
  };

  const removeSocial = (idx: number) => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (clone.socialLinks) {
        clone.socialLinks.splice(idx, 1);
        clone.socialLinks = clone.socialLinks.map((s, i) => ({
          ...s,
          order: i,
        }));
      }
      return clone;
    });
  };

  const handleCreate = async () => {
    if (!form.address && !form.services?.length && !form.companyLinks?.length) {
      return toast.error("Please fill in at least the address or add links");
    }
    setSaving(true);
    try {
      const payload = stripNestedIds(
        form as unknown as Record<string, unknown>,
      );
      await api.post("/footer", payload);
      toast.success("Footer created successfully!");
      onCreated();
      onClose();
    } catch (err: unknown) {
      toast.error(extractErrorMessage(err, "Failed to create footer"));
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
            <p className="text-[11px] font-medium uppercase tracking-widest text-[#E40000]">
              Create
            </p>
            <h2 className="mt-[1px] text-[16px] font-semibold text-[#111111] sm:text-[18px]">
              New Footer
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
            {/* ADDRESS */}
            <div className="rounded-[14px] border border-[#E4C9B4] bg-white p-[16px]">
              <h3 className="mb-[14px] flex items-center gap-[8px] text-[13px] font-semibold text-[#111111] sm:text-[14px]">
                <MapPin className="h-[15px] w-[15px] text-[#E40000]" />
                Address
              </h3>
              <div className="grid gap-[14px] sm:grid-cols-2">
                <Field label="Address Title">
                  <input
                    className={inputCls}
                    value={form.addressTitle}
                    onChange={(e) => setField("addressTitle", e.target.value)}
                    placeholder="Address"
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Address">
                    <textarea
                      className={`${inputCls} min-h-[70px] resize-y`}
                      value={form.address}
                      onChange={(e) => setField("address", e.target.value)}
                      placeholder="MT Autozone Address: 18th B St - Umm Ramool - Dubai..."
                    />
                  </Field>
                </div>
              </div>
            </div>

            {/* SERVICES */}
            <div className="rounded-[14px] border border-[#E4C9B4] bg-white p-[16px]">
              <h3 className="mb-[14px] flex items-center gap-[8px] text-[13px] font-semibold text-[#111111] sm:text-[14px]">
                <Wrench className="h-[15px] w-[15px] text-[#E40000]" />
                Services ({form.services?.length ?? 0})
              </h3>
              <div className="mb-[14px]">
                <Field label="Services Title">
                  <input
                    className={inputCls}
                    value={form.servicesTitle}
                    onChange={(e) => setField("servicesTitle", e.target.value)}
                    placeholder="Services"
                  />
                </Field>
              </div>

              <div className="flex flex-col gap-[10px]">
                {(form.services ?? []).map((srv, idx) => (
                  <ItemCard
                    key={`service-${idx}`}
                    title={srv.title || `Service ${idx + 1}`}
                    onRemove={() => removeLink("services", idx)}
                  >
                    <div className="grid gap-[12px] sm:grid-cols-2">
                      <Field label="Title">
                        <input
                          className={inputCls}
                          value={srv.title}
                          onChange={(e) =>
                            updateLink("services", idx, "title", e.target.value)
                          }
                          placeholder="Interior Cleaning & Detailing"
                        />
                      </Field>
                      <Field label="Link">
                        <input
                          className={inputCls}
                          value={srv.link}
                          onChange={(e) =>
                            updateLink("services", idx, "link", e.target.value)
                          }
                          placeholder="/services/interior-cleaning-detailing"
                        />
                      </Field>
                      <Field label="Order">
                        <input
                          type="number"
                          className={inputCls}
                          value={srv.order}
                          onChange={(e) =>
                            updateLink(
                              "services",
                              idx,
                              "order",
                              Number(e.target.value),
                            )
                          }
                        />
                      </Field>
                      <div className="flex items-center gap-[10px]">
                        <Switch
                          checked={srv.isActive}
                          onCheckedChange={(checked) =>
                            updateLink("services", idx, "isActive", checked)
                          }
                        />
                        <Label className="text-[13px] font-medium text-[#2A2A2A]">
                          Active
                        </Label>
                      </div>
                    </div>
                  </ItemCard>
                ))}
                <AddButton
                  onClick={() => addLink("services")}
                  label="Add Service"
                />
              </div>
            </div>

            {/* COMPANY LINKS */}
            <div className="rounded-[14px] border border-[#E4C9B4] bg-white p-[16px]">
              <h3 className="mb-[14px] flex items-center gap-[8px] text-[13px] font-semibold text-[#111111] sm:text-[14px]">
                <Building2 className="h-[15px] w-[15px] text-[#E40000]" />
                Company Links ({form.companyLinks?.length ?? 0})
              </h3>
              <div className="mb-[14px]">
                <Field label="Company Title">
                  <input
                    className={inputCls}
                    value={form.companyTitle}
                    onChange={(e) => setField("companyTitle", e.target.value)}
                    placeholder="Company"
                  />
                </Field>
              </div>
              <div className="flex flex-col gap-[10px]">
                {(form.companyLinks ?? []).map((lnk, idx) => (
                  <ItemCard
                    key={`company-${idx}`}
                    title={lnk.title || `Link ${idx + 1}`}
                    onRemove={() => removeLink("companyLinks", idx)}
                  >
                    <div className="grid gap-[12px] sm:grid-cols-2">
                      <Field label="Title">
                        <input
                          className={inputCls}
                          value={lnk.title}
                          onChange={(e) =>
                            updateLink(
                              "companyLinks",
                              idx,
                              "title",
                              e.target.value,
                            )
                          }
                          placeholder="Home"
                        />
                      </Field>
                      <Field label="Link">
                        <input
                          className={inputCls}
                          value={lnk.link}
                          onChange={(e) =>
                            updateLink(
                              "companyLinks",
                              idx,
                              "link",
                              e.target.value,
                            )
                          }
                          placeholder="/about"
                        />
                      </Field>
                      <Field label="Order">
                        <input
                          type="number"
                          className={inputCls}
                          value={lnk.order}
                          onChange={(e) =>
                            updateLink(
                              "companyLinks",
                              idx,
                              "order",
                              Number(e.target.value),
                            )
                          }
                        />
                      </Field>
                      <div className="flex items-center gap-[10px]">
                        <Switch
                          checked={lnk.isActive}
                          onCheckedChange={(checked) =>
                            updateLink(
                              "companyLinks",
                              idx,
                              "isActive",
                              checked,
                            )
                          }
                        />
                        <Label className="text-[13px] font-medium text-[#2A2A2A]">
                          Active
                        </Label>
                      </div>
                    </div>
                  </ItemCard>
                ))}
                <AddButton
                  onClick={() => addLink("companyLinks")}
                  label="Add Company Link"
                />
              </div>
            </div>

            {/* CONTACT */}
            <div className="rounded-[14px] border border-[#E4C9B4] bg-white p-[16px]">
              <h3 className="mb-[14px] flex items-center gap-[8px] text-[13px] font-semibold text-[#111111] sm:text-[14px]">
                <Phone className="h-[15px] w-[15px] text-[#E40000]" />
                Contact
              </h3>
              <div className="grid gap-[14px] sm:grid-cols-2">
                <Field label="Contact Title">
                  <input
                    className={inputCls}
                    value={form.contactTitle}
                    onChange={(e) => setField("contactTitle", e.target.value)}
                    placeholder="Contact"
                  />
                </Field>
                <Field label="Phone">
                  <input
                    className={inputCls}
                    value={form.phone}
                    onChange={(e) => setField("phone", e.target.value)}
                    placeholder="+971 55 169 6443"
                  />
                </Field>
                <Field label="Email">
                  <input
                    className={inputCls}
                    value={form.email}
                    onChange={(e) => setField("email", e.target.value)}
                    placeholder="abrar.sayed@honestynperfection.com"
                  />
                </Field>
                <Field label="Sales Email">
                  <input
                    className={inputCls}
                    value={form.salesEmail}
                    onChange={(e) => setField("salesEmail", e.target.value)}
                    placeholder="sales@honestynperfection.com"
                  />
                </Field>
              </div>
            </div>

            {/* SOCIAL LINKS */}
            <div className="rounded-[14px] border border-[#E4C9B4] bg-white p-[16px]">
              <h3 className="mb-[14px] flex items-center gap-[8px] text-[13px] font-semibold text-[#111111] sm:text-[14px]">
                <Share2 className="h-[15px] w-[15px] text-[#E40000]" />
                Social Links ({form.socialLinks?.length ?? 0})
              </h3>
              <div className="flex flex-col gap-[10px]">
                {(form.socialLinks ?? []).map((soc, idx) => (
                  <ItemCard
                    key={`social-${idx}`}
                    title={soc.name || `Social ${idx + 1}`}
                    onRemove={() => removeSocial(idx)}
                  >
                    <div className="grid gap-[12px] sm:grid-cols-2">
                      <Field label="Name">
                        <input
                          className={inputCls}
                          value={soc.name}
                          onChange={(e) =>
                            updateSocial(idx, "name", e.target.value)
                          }
                          placeholder="Instagram"
                        />
                      </Field>
                      <Field label="Icon">
                        <input
                          className={inputCls}
                          value={soc.icon}
                          onChange={(e) =>
                            updateSocial(idx, "icon", e.target.value)
                          }
                          placeholder="instagram"
                        />
                      </Field>
                      <div className="sm:col-span-2">
                        <Field label="Link">
                          <input
                            className={inputCls}
                            value={soc.link}
                            onChange={(e) =>
                              updateSocial(idx, "link", e.target.value)
                            }
                            placeholder="https://www.instagram.com/"
                          />
                        </Field>
                      </div>
                      <Field label="Order">
                        <input
                          type="number"
                          className={inputCls}
                          value={soc.order}
                          onChange={(e) =>
                            updateSocial(
                              idx,
                              "order",
                              Number(e.target.value),
                            )
                          }
                        />
                      </Field>
                      <div className="flex items-center gap-[10px]">
                        <Switch
                          checked={soc.isActive}
                          onCheckedChange={(checked) =>
                            updateSocial(idx, "isActive", checked)
                          }
                        />
                        <Label className="text-[13px] font-medium text-[#2A2A2A]">
                          Active
                        </Label>
                      </div>
                    </div>
                  </ItemCard>
                ))}
                <AddButton onClick={addSocial} label="Add Social Link" />
              </div>
            </div>

            {/* SECTION ACTIVE */}
            <div className="flex items-center gap-[10px] rounded-[14px] border border-[#E4C9B4] bg-white p-[16px]">
              <Switch
                checked={form.isActive}
                onCheckedChange={(checked) => setField("isActive", checked)}
              />
              <Label className="text-[13px] font-medium text-[#2A2A2A]">
                Footer Active
              </Label>
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

export default function FooterAdmin() {
  const [data, setData] = useState<FooterData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [editTarget, setEditTarget] = useState<FooterData | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<FooterData | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get<FooterData[] | FooterData>("/footer");

      let list: FooterData[] = [];
      if (Array.isArray(res.data)) {
        list = res.data;
      } else if (res.data && typeof res.data === "object") {
        list = [res.data as FooterData];
      }

      setData(list);
    } catch (err: unknown) {
      const e = err as {
        response?: { status?: number; data?: { message?: string } };
      };
      if (e?.response?.status === 401) {
        toast.error("Unauthorized. Please sign in again.");
      } else {
        toast.error(extractErrorMessage(err, "Failed to load footer"));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const confirmDelete = (item: FooterData) => setDeleteTarget(item);
  const cancelDelete = () => {
    if (deletingId) return;
    setDeleteTarget(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeletingId(deleteTarget._id);
      await api.delete(`/footer/${deleteTarget._id}`);
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
      (item.address || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.phone || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.email || "").toLowerCase().includes(searchTerm.toLowerCase()),
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
            Footer
          </h1>
          <p className="mt-[6px] text-[13px] leading-[1.6] text-[#666666] sm:text-[14px] lg:text-[15px]">
            Manage footer address, services, company links, contact, and
            socials.
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
            Add Footer
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
                No footer found
              </p>
              <p className="text-[12px] text-[#888888]">
                Click "Add Footer" to create one.
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
                    <CardContent className="p-[16px] sm:p-[20px]">
                      {/* TOP ROW: Address / status */}
                      <div className="mb-[14px] flex flex-wrap items-start justify-between gap-[10px]">
                        <div className="flex items-start gap-[10px]">
                          <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] bg-[#FFF4EC]">
                            <MapPin className="h-[18px] w-[18px] text-[#E40000]" />
                          </div>
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#888888]">
                              {item.addressTitle || "Address"}
                            </p>
                            <p className="mt-[2px] max-w-[560px] text-[13px] text-[#333333]">
                              {item.address || "—"}
                            </p>
                          </div>
                        </div>
                        <div
                          className={`rounded-full px-[10px] py-[4px] text-[10px] font-medium sm:text-[11px] ${
                            item.isActive
                              ? "bg-[#16A34A]/10 text-[#16A34A]"
                              : "bg-black/10 text-[#666]"
                          }`}
                        >
                          {item.isActive ? "Active" : "Inactive"}
                        </div>
                      </div>

                      {/* CONTACT PREVIEW */}
                      <div className="mb-[14px] flex flex-wrap items-center gap-[14px] text-[12px] text-[#555]">
                        <span className="flex items-center gap-[6px]">
                          <Phone className="h-[13px] w-[13px] text-[#E40000]" />
                          {item.phone || "—"}
                        </span>
                        <span className="flex items-center gap-[6px]">
                          <Mail className="h-[13px] w-[13px] text-[#E40000]" />
                          {item.email || "—"}
                        </span>
                        <span className="flex items-center gap-[6px]">
                          <AtSign className="h-[13px] w-[13px] text-[#E40000]" />
                          {item.salesEmail || "—"}
                        </span>
                      </div>

                      {/* SERVICES PREVIEW */}
                      <div className="mb-[12px]">
                        <div className="mb-[6px] flex items-center gap-[6px]">
                          <Wrench className="h-[13px] w-[13px] text-[#888]" />
                          <span className="text-[11px] font-semibold uppercase tracking-widest text-[#888888]">
                            {item.servicesTitle || "Services"} (
                            {item.services?.length ?? 0})
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-[6px]">
                          {(item.services ?? []).slice(0, 6).map((srv, i) => (
                            <span
                              key={srv._id || i}
                              className="flex items-center gap-[4px] rounded-full border border-[#E4C9B4] bg-white px-[10px] py-[3px] text-[11px] text-[#333]"
                            >
                              <LinkIcon className="h-[10px] w-[10px] text-[#E40000]" />
                              {srv.title}
                            </span>
                          ))}
                          {(item.services?.length ?? 0) > 6 && (
                            <span className="rounded-full border border-dashed border-[#E4C9B4] bg-white px-[10px] py-[3px] text-[11px] text-[#888]">
                              +{(item.services?.length ?? 0) - 6} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* COMPANY LINKS PREVIEW */}
                      <div className="mb-[12px]">
                        <div className="mb-[6px] flex items-center gap-[6px]">
                          <Building2 className="h-[13px] w-[13px] text-[#888]" />
                          <span className="text-[11px] font-semibold uppercase tracking-widest text-[#888888]">
                            {item.companyTitle || "Company"} (
                            {item.companyLinks?.length ?? 0})
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-[6px]">
                          {(item.companyLinks ?? []).map((lnk, i) => (
                            <span
                              key={lnk._id || i}
                              className="flex items-center gap-[4px] rounded-full border border-[#E4C9B4] bg-white px-[10px] py-[3px] text-[11px] text-[#333]"
                            >
                              <LinkIcon className="h-[10px] w-[10px] text-[#E40000]" />
                              {lnk.title}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* SOCIAL PREVIEW */}
                      <div className="mb-[14px]">
                        <div className="mb-[6px] flex items-center gap-[6px]">
                          <Share2 className="h-[13px] w-[13px] text-[#888]" />
                          <span className="text-[11px] font-semibold uppercase tracking-widest text-[#888888]">
                            Social ({item.socialLinks?.length ?? 0})
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-[6px]">
                          {(item.socialLinks ?? []).map((s, i) => (
                            <span
                              key={s._id || i}
                              className="flex items-center gap-[4px] rounded-full border border-[#E4C9B4] bg-white px-[10px] py-[3px] text-[11px] text-[#333]"
                            >
                              <LinkIcon className="h-[10px] w-[10px] text-[#E40000]" />
                              {s.name}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* ACTIONS */}
                      <div className="flex justify-end gap-[8px]">
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
          <FooterCreateModal
            onClose={() => setCreateOpen(false)}
            onCreated={fetchData}
          />
        )}
      </AnimatePresence>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {editTarget && (
          <FooterEditModal
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
                Delete this footer?
              </h3>
              <p className="mt-[6px] text-[12px] leading-[1.6] text-[#666666] sm:text-[13px]">
                This footer configuration and all its links will be permanently
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