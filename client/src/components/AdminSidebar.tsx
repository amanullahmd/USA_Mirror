import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { LayoutDashboard, Inbox, List, FolderTree, MapPin, Package, Settings, LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AdminSidebar() {
  const [location] = useLocation();

  const menuItems = [
    { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
    { title: "Pending Submissions", url: "/admin/submissions", icon: Inbox, badge: 12 },
    { title: "All Listings", url: "/admin/listings", icon: List },
    { title: "Categories", url: "/admin/categories", icon: FolderTree },
    { title: "Packages", url: "/admin/packages", icon: Package },
    { title: "Locations", url: "/admin/locations", icon: MapPin },
    { title: "Settings", url: "/admin/settings", icon: Settings },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">BD</span>
          </div>
          <div>
            <p className="font-semibold text-sm">Admin Panel</p>
            <p className="text-xs text-muted-foreground">Directory Portal</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url}>
                    <Link href={item.url} data-testid={`link-admin-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                      {item.badge && (
                        <Badge variant="default" className="ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <Button variant="ghost" className="w-full justify-start gap-2" data-testid="button-logout">
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
