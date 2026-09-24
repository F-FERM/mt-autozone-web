"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "@/app/component/admin/Sidebar";



export default function AdminLayout({ children }: any) {
  const router = useRouter();

  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.replace("/admin/login");
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) return null;

  return (
    <TooltipProvider >
      <SidebarProvider>
        <AppSidebar />

        <SidebarInset>
          {/* ================= HEADER ================= */}

          <header
            className="
              flex
              h-16

              shrink-0

              items-center
              gap-2

              border-b

              bg-white

              px-4
            "
          >
            <SidebarTrigger />

            <h1
              className="
                text-[18px]
                font-semibold
              "
            >
              Duae Admin
            </h1>
          </header>

          {/* ================= CONTENT ================= */}

          <main
            className="
              flex-1

              bg-[#F7F7F7]

              p-6
            "
          >
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}