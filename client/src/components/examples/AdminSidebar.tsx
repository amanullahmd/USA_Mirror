import { Router } from "wouter";
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminSidebar from "../AdminSidebar";

export default function AdminSidebarExample() {
  const style = {
    "--sidebar-width": "16rem",
  };

  return (
    <Router>
      <SidebarProvider style={style as React.CSSProperties}>
        <div className="flex h-screen w-full">
          <AdminSidebar />
          <div className="flex-1 p-4">
            <p className="text-muted-foreground">Main content area</p>
          </div>
        </div>
      </SidebarProvider>
    </Router>
  );
}
