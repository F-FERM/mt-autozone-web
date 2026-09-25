"use client";

import "../globals.css";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { TooltipProvider } from "@/components/ui/tooltip";

export default function AdminLayout({ children }: any) {
  const router = useRouter();
  const pathname = usePathname();

  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Skip authorization check for the login page
    if (pathname === "/admin/login/" || pathname === "/admin/login") {
      setAuthorized(true);
      return;
    }

    const token = localStorage.getItem("access_token");

    if (!token) {
      router.replace("/admin/login");
    } else {
      setAuthorized(true);
    }
  }, [router, pathname]);

  // While checking auth, we return an empty state to avoid flashing the dashboard.
  if (!authorized) {
    return <></>;
  }

  // If we are on the login page, don't show the sidebar or header
  if (pathname === "/admin/login/" || pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <>
      <TooltipProvider>
        <SidebarProvider>
          {/* <AppSidebar /> */}

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
    </>
  );
}