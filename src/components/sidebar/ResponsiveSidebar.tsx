"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react"; // icon for mobile
import Sidebar from "./Sidebar";
import Image from "next/image";

export default function ResponsiveSidebar() {
  return (
    <>
      <div className="lg:hidden flex justify-between items-center bg-background py-1.5 px-3">
        <div className="relative w-6 h-6 antialiased">
          <Image
            src="/logo.svg"
            alt="Coindra Logo"
            fill
            className="object-contain"
            loading="lazy"
          />
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="sm"
              aria-label="Open filters"
              className="p-0! h-6! w-6!"
            >
              <Menu className="h-5! w-5! text-base p-0!" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="p-0 w-fit border-0 bg-background-sidebar"
          >
            <Sidebar />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>
    </>
  );
}
