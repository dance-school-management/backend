"use client";

import { MenuIcon } from "lucide-react";

import { Button } from "@repo/ui/button";
import { Separator } from "@repo/ui/separator";
import { useSidebar } from "@repo/ui/sidebar";
import { ModeToggle } from "./theme-toggle";

export function SiteHeader() {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4 ">
        <div className="flex md:hidden">
          <Button
            className="h-8 w-8"
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
          >
            <MenuIcon />
          </Button>
          <Separator orientation="vertical" className="mr-2 h-4" />
        </div>
        <div className="ml-auto">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
