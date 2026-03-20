import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, useSidebar,
} from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";
import {
  LayoutDashboard, Scissors, Gift, Star, FileText, Settings, Image, LogOut, Layers, HelpCircle, PanelTop, Users, ExternalLink,
} from "lucide-react";
import logo from "@/assets/logo.png";

const navItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Hero Slides", url: "/admin/hero", icon: PanelTop },
  { title: "Services", url: "/admin/services", icon: Scissors },
  { title: "Offers", url: "/admin/offers", icon: Gift },
  { title: "Testimonials", url: "/admin/testimonials", icon: Star },
  { title: "Blog Posts", url: "/admin/blog", icon: FileText },
  { title: "FAQ", url: "/admin/faq", icon: HelpCircle },
  { title: "Page Content", url: "/admin/pages", icon: Layers },
  { title: "Chatbot Leads", url: "/admin/leads", icon: Users },
  { title: "Media", url: "/admin/media", icon: Image },
  { title: "Contact Settings", url: "/admin/contact", icon: Settings },
];

function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { signOut } = useAuth();
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-4 flex items-center gap-3 border-b border-sidebar-border shrink-0">
          <img src={logo} alt="Logo" className="h-8 w-auto" />
          {!collapsed && <span className="font-display text-sm text-sidebar-foreground tracking-wide">Admin Panel</span>}
        </div>

        {/* Nav */}
        <SidebarGroup className="flex-1 overflow-y-auto">
          <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground/60">Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = item.url === "/admin"
                  ? location.pathname === "/admin"
                  : location.pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end={item.url === "/admin"}
                        className={`rounded-lg transition-all duration-200 ${isActive ? "bg-primary/10 text-primary font-medium" : "hover:bg-sidebar-accent/50 text-sidebar-foreground/70"}`}
                        activeClassName="bg-primary/10 text-primary font-medium"
                      >
                        <item.icon className={`mr-2 h-4 w-4 shrink-0 ${isActive ? "text-primary" : ""}`} />
                        {!collapsed && <span className="text-sm">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Bottom actions */}
        <SidebarGroup className="shrink-0 border-t border-sidebar-border">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    {!collapsed && <span className="text-sm">View Website</span>}
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={signOut} className="text-destructive hover:bg-destructive/10 rounded-lg">
                  <LogOut className="mr-2 h-4 w-4" />
                  {!collapsed && <span className="text-sm">Sign Out</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

const AdminLayout = () => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
        <p className="text-sm text-muted-foreground animate-pulse">Loading admin panel...</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  // Get page title from current route
  const currentNav = navItems.find((n) =>
    n.url === "/admin" ? location.pathname === "/admin" : location.pathname.startsWith(n.url)
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center gap-4 border-b border-border/50 px-4 sm:px-6 bg-background/80 backdrop-blur-sm sticky top-0 z-10 shrink-0">
            <SidebarTrigger />
            <div className="h-5 w-px bg-border/50" />
            <h1 className="font-display text-base text-foreground truncate">
              {currentNav?.title || "Admin Panel"}
            </h1>
          </header>
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto bg-muted/20">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
