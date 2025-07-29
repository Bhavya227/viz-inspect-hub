import { 
  BarChart3, 
  Shield, 
  FileText, 
  Settings, 
  Users, 
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Camera
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Dashboard", url: "/", icon: BarChart3 },
  { title: "Inspections", url: "/inspections", icon: Shield },
  { title: "Reports", url: "/reports", icon: FileText },
  { title: "Analytics", url: "/analytics", icon: TrendingUp },
  { title: "Visual Inspect", url: "/visual-inspect", icon: Camera },
];

const qualityItems = [
  { title: "Quality Metrics", url: "/quality-metrics", icon: CheckCircle2 },
  { title: "Issues", url: "/issues", icon: AlertTriangle },
  { title: "Team", url: "/team", icon: Users },
];

const systemItems = [
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(path);
  };

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    `group relative transition-all duration-200 ${
      isActive 
        ? "bg-gradient-primary text-primary-foreground shadow-sm" 
        : "hover:bg-accent/50 text-muted-foreground hover:text-foreground"
    }`;

  const SidebarSection = ({ 
    label, 
    items 
  }: { 
    label: string; 
    items: typeof mainItems;
  }) => (
    <SidebarGroup>
      <SidebarGroupLabel className="text-xs font-medium uppercase tracking-wide text-muted-foreground px-3">
        {label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <NavLink to={item.url} className={getNavCls}>
                  <item.icon className={`h-4 w-4 transition-colors ${collapsed ? "mx-auto" : "mr-3"}`} />
                  {!collapsed && (
                    <span className="font-medium truncate">{item.title}</span>
                  )}
                  {isActive(item.url) && !collapsed && (
                    <div className="absolute right-2 w-1 h-4 bg-primary-foreground rounded-full opacity-80" />
                  )}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar
      className={`border-r border-border transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
      collapsible="icon"
    >
      <div className="flex h-14 items-center border-b border-border px-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">QualityViz</span>
              <span className="text-xs text-muted-foreground">Inspection Hub</span>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center mx-auto">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
        )}
      </div>

      <SidebarContent className="py-4">
        <SidebarSection label="Main" items={mainItems} />
        <SidebarSection label="Quality" items={qualityItems} />
        <SidebarSection label="System" items={systemItems} />
      </SidebarContent>
    </Sidebar>
  );
}