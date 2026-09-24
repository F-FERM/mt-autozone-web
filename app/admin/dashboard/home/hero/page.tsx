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
    ChevronDown,
    ChevronUp,
    Loader2,
    UploadCloud,
    ImagePlus,
    CircleDot,
    Save,
    ImageIcon,
    Sparkles,
    Car,
    ArrowUp,
} from "lucide-react";

import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    icon: string;
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

interface HomeHero extends HomeHeroResponse {
    _id: string;
    createdAt: string;
    updatedAt: string;
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
    icon: "car-detailing",
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

// ================= HELPERS =================

function deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}

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

// ================= TABS =================

const TABS = [
    "Basic",
    "Content",
    "Images",
    "Stats",
    "Services",
    "Button",
] as const;

type TabName = (typeof TABS)[number];

// ================= IMAGE UPLOAD COMPONENT =================

function ImageUpload({
    value,
    onChange,
    label,
    uploading,
    setUploading,
    hasChanged = false,
}: {
    value: string;
    onChange: (url: string) => void;
    label: string;
    uploading: boolean;
    setUploading: (loading: boolean) => void;
    hasChanged?: boolean;
}) {
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            const result = await fileUpload(file);
            onChange(result.url);
            toast.success("Image uploaded");
        } catch (err: unknown) {
            const e = err as { response?: { data?: { message?: string } } };
            toast.error(e?.response?.data?.message || "Failed to upload image");
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    };

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
                id={`upload-${label.replace(/\s/g, "-")}`}
                onChange={handleFileUpload}
            />
            <div
                onClick={() =>
                    !uploading &&
                    document
                        .getElementById(`upload-${label.replace(/\s/g, "-")}`)
                        ?.click()
                }
                className={`
          relative flex h-[100px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-[12px] border border-dashed border-[#E4C9B4] bg-[#FFF9F4] transition-colors hover:bg-[#FFF4EC]
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
                className={`mt-[4px] h-[36px] rounded-[10px] border-[#E4E4E4] bg-white text-[12px] focus-visible:ring-[#EA580C]/30 ${hasChanged ? "border-2 border-[#EA580C] bg-[#FFF9F4]" : ""
                    }`}
            />
        </div>
    );
}

// ================= REUSABLE ITEM CARD =================

function ItemCard({
    title,
    onRemove,
    children,
}: {
    title: string;
    onRemove: () => void;
    children: React.ReactNode;
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
                    {open ? (
                        <ChevronUp className="h-[14px] w-[14px] text-[#888888]" />
                    ) : (
                        <ChevronDown className="h-[14px] w-[14px] text-[#888888]" />
                    )}
                </div>
            </button>
            {open && (
                <div className="border-t border-[#F1E4D8] p-[14px]">{children}</div>
            )}
        </div>
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
    hero: initialHero,
    onClose,
    onSaved,
}: {
    hero: HomeHero;
    onClose: () => void;
    onSaved: () => void;
}) {
    const [form, setForm] = useState<HomeHero>(() => {
        const cloned = deepClone(initialHero);
        if (!cloned.stats) cloned.stats = { ...EMPTY_STATS };
        if (!cloned.services) cloned.services = [];
        return cloned;
    });
    const [originalForm] = useState<HomeHero>(() => deepClone(initialHero));
    const [activeTab, setActiveTab] = useState<TabName>("Basic");
    const [saving, setSaving] = useState(false);

    const [uploadingEyebrow, setUploadingEyebrow] = useState(false);
    const [uploadingMain, setUploadingMain] = useState(false);
    const [uploadingBg, setUploadingBg] = useState(false);

    // Change detection
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

    const tabHasChanges = (tab: TabName): boolean => {
        switch (tab) {
            case "Basic":
                return (
                    hasChanged("eyebrow") ||
                    hasChanged("title") ||
                    hasChanged("subtitle") ||
                    hasChanged("isActive")
                );
            case "Content":
                return (
                    hasChanged("description") ||
                    hasChanged("eyebrowDescription") ||
                    hasChanged("servicesTitle")
                );
            case "Images":
                return (
                    hasChanged("image") ||
                    hasChanged("backgroundImage") ||
                    hasChanged("eyebrowImage")
                );
            case "Stats":
                return hasChanged("stats");
            case "Services":
                return hasChanged("services");
            case "Button":
                return hasChanged("buttonText") || hasChanged("buttonLink");
            default:
                return false;
        }
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
                form as HomeHero & { __v?: number };
            await api.patch(`/home-hero/${form._id}`, cleanPayload);
            toast.success("Home hero updated successfully!");
            onSaved();
            onClose();
        } catch (err: unknown) {
            const e = err as { response?: { data?: { message?: string } } };
            toast.error(e?.response?.data?.message || "Failed to update home hero");
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

                {/* TABS */}
                <div className="shrink-0 overflow-x-auto border-b border-[#E4C9B4] bg-white">
                    <div className="flex min-w-max px-[20px] sm:px-[28px]">
                        {TABS.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex items-center gap-[6px] border-b-[2px] px-[12px] py-[10px] text-[12px] font-medium whitespace-nowrap transition-colors sm:text-[13px] ${activeTab === tab
                                    ? "border-[#EA580C] text-[#EA580C]"
                                    : "border-transparent text-[#888888] hover:text-[#333333]"
                                    }`}
                            >
                                {tab}
                                {tabHasChanges(tab) && (
                                    <CircleDot className="h-[10px] w-[10px] fill-[#EA580C] text-[#EA580C]" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* BODY */}
                <div className="flex-1 overflow-y-auto p-[20px] sm:p-[28px]">
                    {activeTab === "Basic" && (
                        <BasicTab form={form} setField={setField} hasChanged={hasChanged} />
                    )}
                    {activeTab === "Content" && (
                        <ContentTab form={form} setField={setField} hasChanged={hasChanged} />
                    )}
                    {activeTab === "Images" && (
                        <ImagesTab
                            form={form}
                            setField={setField}
                            uploadingEyebrow={uploadingEyebrow}
                            setUploadingEyebrow={setUploadingEyebrow}
                            uploadingMain={uploadingMain}
                            setUploadingMain={setUploadingMain}
                            uploadingBg={uploadingBg}
                            setUploadingBg={setUploadingBg}
                            hasChanged={hasChanged}
                        />
                    )}
                    {activeTab === "Stats" && (
                        <StatsTab form={form} setField={setField} hasChanged={hasChanged} />
                    )}
                    {activeTab === "Services" && (
                        <ServicesTab
                            form={form}
                            setForm={setForm}
                            setField={setField}
                            hasChanged={hasChanged}
                        />
                    )}
                    {activeTab === "Button" && (
                        <ButtonTab form={form} setField={setField} hasChanged={hasChanged} />
                    )}
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

// ================= TAB PANELS =================

function BasicTab({
    form,
    setField,
    hasChanged,
}: {
    form: HomeHero;
    setField: (path: string, value: unknown) => void;
    hasChanged: (path: string) => boolean;
}) {
    const getInputClass = (path: string) =>
        hasChanged(path) ? inputChangedCls : inputCls;

    return (
        <div className="grid gap-[16px] sm:grid-cols-2">
            <div className="sm:col-span-2">
                <Field label="Eyebrow" hasChanged={hasChanged("eyebrow")}>
                    <input
                        className={getInputClass("eyebrow")}
                        value={form.eyebrow}
                        onChange={(e) => setField("eyebrow", e.target.value)}
                        placeholder="Premium Care. Impeccable Finish."
                    />
                </Field>
            </div>
            <div className="sm:col-span-2">
                <Field label="Title" hasChanged={hasChanged("title")}>
                    <input
                        className={getInputClass("title")}
                        value={form.title}
                        onChange={(e) => setField("title", e.target.value)}
                        placeholder="MT AUTO ZONE"
                    />
                </Field>
            </div>
            <div className="sm:col-span-2">
                <Field label="Subtitle" hasChanged={hasChanged("subtitle")}>
                    <input
                        className={getInputClass("subtitle")}
                        value={form.subtitle}
                        onChange={(e) => setField("subtitle", e.target.value)}
                        placeholder="Premium Automotive Detailing Solutions"
                    />
                </Field>
            </div>
            <div className="flex items-center gap-[10px] sm:col-span-2">
                <Switch
                    checked={form.isActive}
                    onCheckedChange={(checked) => setField("isActive", checked)}
                />
                <Label className="text-[13px] font-medium text-[#2A2A2A]">Active</Label>
                {hasChanged("isActive") && (
                    <CircleDot className="h-[10px] w-[10px] fill-[#EA580C] text-[#EA580C]" />
                )}
            </div>
        </div>
    );
}

function ContentTab({
    form,
    setField,
    hasChanged,
}: {
    form: HomeHero;
    setField: (path: string, value: unknown) => void;
    hasChanged: (path: string) => boolean;
}) {
    const getTextareaClass = (path: string) =>
        hasChanged(path) ? textareaChangedCls : textareaCls;
    const getInputClass = (path: string) =>
        hasChanged(path) ? inputChangedCls : inputCls;

    return (
        <div className="grid gap-[16px]">
            <Field
                label="Eyebrow Description"
                hasChanged={hasChanged("eyebrowDescription")}
            >
                <textarea
                    className={getTextareaClass("eyebrowDescription")}
                    value={form.eyebrowDescription}
                    onChange={(e) => setField("eyebrowDescription", e.target.value)}
                    placeholder="Professional car detailing to restore, protect..."
                />
            </Field>
            <Field label="Description" hasChanged={hasChanged("description")}>
                <textarea
                    className={getTextareaClass("description")}
                    style={{ minHeight: 120 }}
                    value={form.description}
                    onChange={(e) => setField("description", e.target.value)}
                    placeholder="Elevating every vehicle with professional detailing..."
                />
            </Field>
            <Field label="Services Title" hasChanged={hasChanged("servicesTitle")}>
                <input
                    className={getInputClass("servicesTitle")}
                    value={form.servicesTitle}
                    onChange={(e) => setField("servicesTitle", e.target.value)}
                    placeholder="Premium Automotive Detailing Solutions"
                />
            </Field>
        </div>
    );
}

function ImagesTab({
    form,
    setField,
    uploadingEyebrow,
    setUploadingEyebrow,
    uploadingMain,
    setUploadingMain,
    uploadingBg,
    setUploadingBg,
    hasChanged,
}: {
    form: HomeHero;
    setField: (path: string, value: unknown) => void;
    uploadingEyebrow: boolean;
    setUploadingEyebrow: (loading: boolean) => void;
    uploadingMain: boolean;
    setUploadingMain: (loading: boolean) => void;
    uploadingBg: boolean;
    setUploadingBg: (loading: boolean) => void;
    hasChanged: (path: string) => boolean;
}) {
    return (
        <div className="grid gap-[16px]">
            <ImageUpload
                value={form.eyebrowImage}
                onChange={(url) => setField("eyebrowImage", url)}
                label="Eyebrow Image"
                uploading={uploadingEyebrow}
                setUploading={setUploadingEyebrow}
                hasChanged={hasChanged("eyebrowImage")}
            />
            <ImageUpload
                value={form.image}
                onChange={(url) => setField("image", url)}
                label="Main Image"
                uploading={uploadingMain}
                setUploading={setUploadingMain}
                hasChanged={hasChanged("image")}
            />
            <ImageUpload
                value={form.backgroundImage}
                onChange={(url) => setField("backgroundImage", url)}
                label="Background Image"
                uploading={uploadingBg}
                setUploading={setUploadingBg}
                hasChanged={hasChanged("backgroundImage")}
            />
        </div>
    );
}

function StatsTab({
    form,
    setField,
    hasChanged,
}: {
    form: HomeHero;
    setField: (path: string, value: unknown) => void;
    hasChanged: (path: string) => boolean;
}) {
    const s = form.stats ?? { ...EMPTY_STATS };
    const getInputClass = (path: string) =>
        hasChanged(path) ? inputChangedCls : inputCls;

    return (
        <div className="grid gap-[16px] sm:grid-cols-2">
            <Field
                label="Years of Experience"
                hasChanged={hasChanged("stats.yearsOfExperience")}
            >
                <input
                    type="number"
                    className={getInputClass("stats.yearsOfExperience")}
                    value={s.yearsOfExperience}
                    onChange={(e) =>
                        setField("stats.yearsOfExperience", Number(e.target.value))
                    }
                />
            </Field>
            <Field label="Years Label" hasChanged={hasChanged("stats.yearsLabel")}>
                <input
                    className={getInputClass("stats.yearsLabel")}
                    value={s.yearsLabel}
                    onChange={(e) => setField("stats.yearsLabel", e.target.value)}
                />
            </Field>
            <Field
                label="Customer Satisfaction"
                hasChanged={hasChanged("stats.customerSatisfaction")}
            >
                <input
                    type="number"
                    step="0.1"
                    className={getInputClass("stats.customerSatisfaction")}
                    value={s.customerSatisfaction}
                    onChange={(e) =>
                        setField("stats.customerSatisfaction", Number(e.target.value))
                    }
                />
            </Field>
            <Field
                label="Satisfaction Label"
                hasChanged={hasChanged("stats.satisfactionLabel")}
            >
                <input
                    className={getInputClass("stats.satisfactionLabel")}
                    value={s.satisfactionLabel}
                    onChange={(e) => setField("stats.satisfactionLabel", e.target.value)}
                />
            </Field>
            <Field
                label="Cars Serviced"
                hasChanged={hasChanged("stats.carsServiced")}
            >
                <input
                    type="number"
                    className={getInputClass("stats.carsServiced")}
                    value={s.carsServiced}
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
                    className={getInputClass("stats.carsServicedLabel")}
                    value={s.carsServicedLabel}
                    onChange={(e) => setField("stats.carsServicedLabel", e.target.value)}
                />
            </Field>
        </div>
    );
}

function ServicesTab({
    form,
    setForm,
    setField,
    hasChanged,
}: {
    form: HomeHero;
    setForm: React.Dispatch<React.SetStateAction<HomeHero>>;
    setField: (path: string, value: unknown) => void;
    hasChanged: (path: string) => boolean;
}) {
    const services = form.services ?? [];
    const getInputClass = (path: string) =>
        hasChanged(path) ? inputChangedCls : inputCls;

    const updateService = (
        idx: number,
        key: keyof HeroService,
        val: string | number | boolean,
    ) => {
        setForm((prev) => {
            const clone = deepClone(prev);
            if (!clone.services) clone.services = [];
            if (!clone.services[idx]) clone.services[idx] = { ...EMPTY_SERVICE };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (clone.services[idx] as any)[key] = val;
            return clone;
        });
    };

    const addService = () => {
        setForm((prev) => {
            const clone = deepClone(prev);
            if (!clone.services) clone.services = [];
            const n = clone.services.length;
            clone.services.push({
                title: "",
                icon: "car-detailing",
                order: n,
                isActive: true,
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
        if (newIdx < 0 || newIdx >= services.length) return;
        setForm((prev) => {
            const clone = deepClone(prev);
            if (!clone.services) return clone;
            const [moved] = clone.services.splice(idx, 1);
            clone.services.splice(newIdx, 0, moved);
            clone.services = clone.services.map((s, i) => ({ ...s, order: i }));
            return clone;
        });
    };

    return (
        <div className="flex flex-col gap-[16px]">
            <Field label="Services Title" hasChanged={hasChanged("servicesTitle")}>
                <input
                    className={getInputClass("servicesTitle")}
                    value={form.servicesTitle}
                    onChange={(e) => setField("servicesTitle", e.target.value)}
                    placeholder="Premium Automotive Detailing Solutions"
                />
            </Field>

            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#888888]">
                Services ({services.length})
            </p>

            {services.map((service, idx) => (
                <ItemCard
                    key={idx}
                    title={service.title || `Service ${idx + 1}`}
                    onRemove={() => removeService(idx)}
                >
                    <div className="grid gap-[12px] sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <Field
                                label="Title"
                                hasChanged={hasChanged(`services.${idx}.title`)}
                            >
                                <input
                                    className={getInputClass(`services.${idx}.title`)}
                                    value={service.title}
                                    onChange={(e) => updateService(idx, "title", e.target.value)}
                                    placeholder="Complete Car Detailing & Cleaning"
                                />
                            </Field>
                        </div>
                        <Field label="Icon" hasChanged={hasChanged(`services.${idx}.icon`)}>
                            <input
                                className={getInputClass(`services.${idx}.icon`)}
                                value={service.icon}
                                onChange={(e) => updateService(idx, "icon", e.target.value)}
                                placeholder="car-detailing"
                            />
                        </Field>
                        <Field label="Order" hasChanged={hasChanged(`services.${idx}.order`)}>
                            <input
                                type="number"
                                className={getInputClass(`services.${idx}.order`)}
                                value={service.order}
                                onChange={(e) =>
                                    updateService(idx, "order", Number(e.target.value))
                                }
                            />
                        </Field>
                        <div className="flex items-center gap-[10px] sm:col-span-2">
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
                        <div className="flex gap-[6px] sm:col-span-2">
                            <button
                                type="button"
                                onClick={() => moveService(idx, "up")}
                                disabled={idx === 0}
                                className="flex h-[34px] w-[34px] items-center justify-center rounded-[8px] border border-[#E4C9B4] text-[#666] transition-colors hover:bg-[#FFF4EC] disabled:opacity-30"
                            >
                                <ChevronUp className="h-[14px] w-[14px]" />
                            </button>
                            <button
                                type="button"
                                onClick={() => moveService(idx, "down")}
                                disabled={idx === services.length - 1}
                                className="flex h-[34px] w-[34px] items-center justify-center rounded-[8px] border border-[#E4C9B4] text-[#666] transition-colors hover:bg-[#FFF4EC] disabled:opacity-30"
                            >
                                <ChevronDown className="h-[14px] w-[14px]" />
                            </button>
                        </div>
                    </div>
                </ItemCard>
            ))}

            <AddButton onClick={addService} label="Add Service" />
        </div>
    );
}

function ButtonTab({
    form,
    setField,
    hasChanged,
}: {
    form: HomeHero;
    setField: (path: string, value: unknown) => void;
    hasChanged: (path: string) => boolean;
}) {
    const getInputClass = (path: string) =>
        hasChanged(path) ? inputChangedCls : inputCls;

    return (
        <div className="grid gap-[16px] sm:grid-cols-2">
            <Field label="Button Text" hasChanged={hasChanged("buttonText")}>
                <input
                    className={getInputClass("buttonText")}
                    value={form.buttonText}
                    onChange={(e) => setField("buttonText", e.target.value)}
                    placeholder="Explore"
                />
            </Field>
            <Field label="Button Link" hasChanged={hasChanged("buttonLink")}>
                <input
                    className={getInputClass("buttonLink")}
                    value={form.buttonLink}
                    onChange={(e) => setField("buttonLink", e.target.value)}
                    placeholder="/services"
                />
            </Field>
        </div>
    );
}

// ================= PAGE =================

export default function HomeHeroPage() {
    const [heroData, setHeroData] = useState<HomeHero | null>(null);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<HomeHero | null>(null);

    const fetchHero = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get<HomeHero | HomeHero[]>("/home-hero");

            let data: HomeHero | null = null;
            if (Array.isArray(res.data)) {
                data = res.data.length > 0 ? res.data[0] : null;
            } else if (res.data && typeof res.data === "object") {
                data = res.data as HomeHero;
            }

            setHeroData(data);
        } catch (err: unknown) {
            const e = err as {
                response?: { status?: number; data?: { message?: string } };
            };
            if (e?.response?.status === 401) {
                toast.error("Unauthorized. Please sign in again.");
            } else {
                toast.error(e?.response?.data?.message || "Failed to load home hero");
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHero();
    }, [fetchHero]);

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
                    success: {
                        iconTheme: { primary: "#EA580C", secondary: "#fff" },
                    },
                    error: {
                        iconTheme: { primary: "#DC2626", secondary: "#fff" },
                    },
                }}
            />

            {/* HEADER */}
            <div className="mx-auto flex max-w-[1600px] flex-col gap-[16px] sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-[22px] font-semibold tracking-[-0.5px] text-[#111111] xs:text-[24px] sm:text-[28px] lg:text-[32px]">
                        Home Hero
                    </h1>
                    <p className="mt-[6px] text-[13px] leading-[1.6] text-[#666666] sm:text-[14px] lg:text-[15px]">
                        Manage the main hero section content. Click the card to edit.
                    </p>
                </div>
                {!loading && heroData && (
                    <div className="flex shrink-0 items-center gap-[8px] rounded-[14px] border border-[#E4C9B4] bg-white px-[16px] py-[10px] text-[13px] font-medium text-[#C2410C] sm:text-[14px]">
                        <CircleDot
                            className={`h-[15px] w-[15px] ${heroData.isActive
                                ? "fill-[#16A34A] text-[#16A34A]"
                                : "fill-[#999] text-[#999]"
                                }`}
                        />
                        {heroData.isActive ? "Active" : "Inactive"}
                        &nbsp;&middot;&nbsp;
                        {heroData.services?.length || 0} services
                    </div>
                )}
            </div>

            {/* CONTENT */}
            <div className="mx-auto mt-[22px] max-w-[1600px] sm:mt-[28px] lg:mt-[32px]">
                {loading ? (
                    <div className="flex min-h-[200px] items-center justify-center">
                        <Loader2 className="h-[28px] w-[28px] animate-spin text-[#EA580C]" />
                    </div>
                ) : !heroData ? (
                    <Card className="rounded-[20px] border border-dashed border-[#E4C9B4] bg-white/60">
                        <CardContent className="flex flex-col items-center justify-center gap-[10px] p-[48px] text-center">
                            <Car className="h-[32px] w-[32px] text-[#C2410C]/50" />
                            <p className="text-[14px] font-medium text-[#333333]">
                                No home hero content found
                            </p>
                            <p className="text-[12px] text-[#888888]">
                                Home hero data from the API will appear here.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <AnimatePresence>
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25 }}
                        >
                            <Card
                                onClick={() => setSelected(heroData)}
                                className="group cursor-pointer overflow-hidden rounded-[18px] border border-white/60 bg-white/80 shadow-[0_10px_40px_rgba(0,0,0,0.06)] backdrop-blur-[10px] transition-all duration-300 hover:shadow-[0_18px_50px_rgba(234,88,12,0.18)] hover:ring-2 hover:ring-[#EA580C]/30 sm:rounded-[22px]"
                            >
                                {/* HERO PREVIEW */}
                                <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#F1E4D8] xs:aspect-auto xs:h-[200px] sm:h-[260px] lg:h-[320px]">
                                    {heroData.backgroundImage ? (
                                        <Image
                                            src={heroData.backgroundImage}
                                            alt={heroData.title}
                                            fill
                                            unoptimized
                                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 60vw, 800px"
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : heroData.image ? (
                                        <Image
                                            src={heroData.image}
                                            alt={heroData.title}
                                            fill
                                            unoptimized
                                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 60vw, 800px"
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center">
                                            <ImageIcon className="h-[36px] w-[36px] text-[#C2410C]/40" />
                                        </div>
                                    )}

                                    {/* Overlay content */}
                                    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/30 to-transparent p-[16px] sm:p-[24px] lg:p-[32px]">
                                        {heroData.eyebrow && (
                                            <span className="text-[10px] font-medium uppercase tracking-widest text-[#EA580C] sm:text-[11px]">
                                                {heroData.eyebrow}
                                            </span>
                                        )}
                                        <h3 className="mt-[4px] text-[18px] font-semibold text-white sm:text-[24px] lg:text-[28px]">
                                            {heroData.title}
                                        </h3>
                                        {heroData.subtitle && (
                                            <p className="mt-[2px] text-[12px] text-white/80 sm:text-[14px] lg:text-[16px]">
                                                {heroData.subtitle}
                                            </p>
                                        )}
                                        {heroData.description && (
                                            <p className="mt-[8px] line-clamp-2 max-w-[600px] text-[11px] leading-[1.6] text-white/70 sm:text-[12px] lg:text-[13px]">
                                                {heroData.description}
                                            </p>
                                        )}
                                        {heroData.buttonText && (
                                            <span className="mt-[12px] inline-flex w-fit items-center gap-[6px] rounded-[10px] bg-[#EA580C] px-[14px] py-[7px] text-[11px] font-semibold text-white sm:px-[18px] sm:py-[9px] sm:text-[13px]">
                                                {heroData.buttonText}
                                                <ArrowUp className="h-[12px] w-[12px] rotate-45 sm:h-[14px] sm:w-[14px]" />
                                            </span>
                                        )}
                                    </div>

                                    {/* Status badge */}
                                    <div
                                        className={`absolute right-[10px] top-[10px] rounded-full px-[9px] py-[4px] text-[10px] font-medium backdrop-blur-sm sm:right-[12px] sm:top-[12px] sm:px-[10px] sm:py-[5px] sm:text-[11px] ${heroData.isActive
                                            ? "bg-[#16A34A]/90 text-white"
                                            : "bg-black/40 text-white/80"
                                            }`}
                                    >
                                        {heroData.isActive ? "Active" : "Inactive"}
                                    </div>

                                    {/* Edit overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center bg-[#EA580C]/0 opacity-0 transition-all duration-300 group-hover:bg-[#EA580C]/10 group-hover:opacity-100">
                                        <span className="rounded-full bg-[#EA580C] px-[14px] py-[6px] text-[11px] font-semibold text-white shadow-lg">
                                            Edit Hero
                                        </span>
                                    </div>
                                </div>

                                {/* STATS & SERVICES */}
                                <CardContent className="p-[16px] sm:p-[20px] lg:p-[24px]">
                                    {/* Stats */}
                                    {heroData.stats && (
                                        <div className="grid grid-cols-3 gap-[8px] sm:gap-[12px]">
                                            <div className="rounded-[10px] bg-[#FFF9F4] p-[10px] text-center sm:p-[12px]">
                                                <div className="text-[16px] font-bold text-[#EA580C] sm:text-[20px]">
                                                    {heroData.stats.yearsOfExperience}+
                                                </div>
                                                <div className="text-[9px] text-[#666] sm:text-[11px]">
                                                    {heroData.stats.yearsLabel}
                                                </div>
                                            </div>
                                            <div className="rounded-[10px] bg-[#FFF9F4] p-[10px] text-center sm:p-[12px]">
                                                <div className="text-[16px] font-bold text-[#EA580C] sm:text-[20px]">
                                                    {heroData.stats.customerSatisfaction}
                                                </div>
                                                <div className="text-[9px] text-[#666] sm:text-[11px]">
                                                    {heroData.stats.satisfactionLabel}
                                                </div>
                                            </div>
                                            <div className="rounded-[10px] bg-[#FFF9F4] p-[10px] text-center sm:p-[12px]">
                                                <div className="text-[16px] font-bold text-[#EA580C] sm:text-[20px]">
                                                    {heroData.stats.carsServiced}+
                                                </div>
                                                <div className="text-[9px] text-[#666] sm:text-[11px]">
                                                    {heroData.stats.carsServicedLabel}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Services preview */}
                                    {heroData.services && heroData.services.length > 0 && (
                                        <div className="mt-[16px]">
                                            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#888888]">
                                                {heroData.servicesTitle}
                                            </p>
                                            <div className="mt-[8px] grid grid-cols-1 gap-[8px] sm:grid-cols-2">
                                                {heroData.services
                                                    .filter((s) => s.isActive)
                                                    .map((service, idx) => (
                                                        <div
                                                            key={service._id || idx}
                                                            className="flex items-center gap-[8px] rounded-[8px] border border-[#E4C9B4] bg-white px-[10px] py-[8px]"
                                                        >
                                                            <div className="flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-full bg-[#FFF4EC]">
                                                                <Sparkles className="h-[12px] w-[12px] text-[#EA580C]" />
                                                            </div>
                                                            <span className="truncate text-[11px] font-medium text-[#333] sm:text-[12px]">
                                                                {service.title}
                                                            </span>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-[16px] flex justify-end">
                                        <Button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelected(heroData);
                                            }}
                                            variant="outline"
                                            className="h-[34px] gap-[6px] rounded-[10px] border-[#E4C9B4] bg-white px-[12px] text-[12px] font-medium text-[#C2410C] hover:bg-[#FFF4EC] hover:text-[#C2410C] sm:h-[36px] sm:text-[13px]"
                                        >
                                            <Pencil className="h-[13px] w-[13px]" />
                                            Edit Hero
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>

            {/* EDIT MODAL */}
            <AnimatePresence>
                {selected && (
                    <HomeHeroEditModal
                        hero={selected}
                        onClose={() => setSelected(null)}
                        onSaved={fetchHero}
                    />
                )}
            </AnimatePresence>
        </section>
    );
}