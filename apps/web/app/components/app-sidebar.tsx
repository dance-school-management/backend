import {
  BookOpen,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Settings2,
} from "lucide-react";

import { NavSection } from "@/components/nav/section";
import { NavSecondary } from "@/components/nav/secondary";
import { NavProfile } from "@/components/nav/profile";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@repo/ui/sidebar";


const data = {
  user: {
    name: "Test User",
    email: "test@test.com",
    avatar: "",
  },
  navMain: [
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Contact Us",
      url: "/contact",
      icon: LifeBuoy,
    }
  ],
  admin: [
    {
      title: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      title: "Sales Dashboard",
      url: "/dashboard",
      icon: PieChart,
    },
    {
      title: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarContent>
        <NavSection title="General" items={data.navMain} />
        <NavSection title="User" items={[]} />
        <NavSection title="Trainer" items={[]} />
        <NavSection title="Receptionist" items={[]} />
        <NavSection title="Admin" items={data.admin} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavProfile user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
