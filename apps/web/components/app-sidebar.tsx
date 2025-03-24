"use client";

import {
  Banknote,
  Calendar,
  ChartColumn,
  Home,
  Info,
  LifeBuoy,
  PieChart,
  ScanQrCode,
  Tickets,
  User,
  NotebookText,
  Newspaper
} from "lucide-react";

import { NavProfile } from "components/nav/profile";
import { NavSecondary } from "components/nav/secondary";
import { NavSection } from "components/nav/section";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@repo/ui/sidebar";

const user = {
  name: "Test User",
  email: "test@test.com",
  avatar: "",
};

const data = {
  general: [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
    {
      title: "About Us",
      url: "",
      icon: Info,
      items: [
        {
          title: "Our instructors",
          url: "/about/instructors",
        },
        {
          title: "School Map",
          url: "/about/map",
        },
        {
          title: "Dance Styles",
          url: "/about/styles",
        }
      ]
    },
    {
      title: "News",
      url: "/news",
      icon: Newspaper,
    },
    {
      title: "Pricing",
      url: "/pricing",
      icon: Banknote,
    },
    {
      title: "Schedule",
      url: "/schedule",
      icon: Calendar,
    }
  ],
  bottom: [
    {
      title: "Contact Us",
      url: "/contact",
      icon: LifeBuoy,
    }
  ],
  admin: [
    {
      title: "Manage Employees",
      url: "/admin/employees",
      icon: User,
    },
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: PieChart,
    },
  ],
  receptionist: [
    {
      title: "Scan Ticket",
      url: "/employee/scan",
      icon: ScanQrCode,
    }
  ],
  user: [
    {
      title: "My Progress",
      url: "/user/progress",
      icon: ChartColumn,
    },
    {
      title: "My Tickets",
      url: "/user/tickets",
      icon: Tickets,
    }
  ],
  trainer: [
    {
      title: "My Classes",
      url: "/trainer/classes",
      icon: NotebookText,
    }
  ],

};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarContent>
        <NavSection title="General" items={data.general} />
        <NavSection title="User" items={data.user} />
        <NavSection title="Trainer" items={data.trainer} />
        <NavSection title="Receptionist" items={data.receptionist} />
        <NavSection title="Admin" items={data.admin} />
        <NavSecondary items={data.bottom} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavProfile user={user} />
      </SidebarFooter>
    </Sidebar>
  );
};
