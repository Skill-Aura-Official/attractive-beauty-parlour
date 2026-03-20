import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Scissors, Gift, Star, FileText, Image, PanelTop, HelpCircle, Layers, Users, TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const { user } = useAuth();

  const { data: counts, isLoading } = useQuery({
    queryKey: ["admin-counts"],
    queryFn: async () => {
      const [services, offers, testimonials, blogPosts, media, heroSlides, faqItems, pageSections, leads] = await Promise.all([
        supabase.from("services").select("id", { count: "exact", head: true }),
        supabase.from("offers").select("id", { count: "exact", head: true }),
        supabase.from("testimonials").select("id", { count: "exact", head: true }),
        supabase.from("blog_posts").select("id", { count: "exact", head: true }),
        supabase.from("media").select("id", { count: "exact", head: true }),
        supabase.from("hero_slides").select("id", { count: "exact", head: true }),
        supabase.from("faq_items").select("id", { count: "exact", head: true }),
        supabase.from("page_sections").select("id", { count: "exact", head: true }),
        supabase.from("chatbot_leads").select("id", { count: "exact", head: true }),
      ]);
      return {
        services: services.count ?? 0,
        offers: offers.count ?? 0,
        testimonials: testimonials.count ?? 0,
        blogPosts: blogPosts.count ?? 0,
        media: media.count ?? 0,
        heroSlides: heroSlides.count ?? 0,
        faqItems: faqItems.count ?? 0,
        pageSections: pageSections.count ?? 0,
        leads: leads.count ?? 0,
      };
    },
  });

  const stats = [
    { label: "Hero Slides", count: counts?.heroSlides ?? 0, icon: PanelTop, link: "/admin/hero", color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Services", count: counts?.services ?? 0, icon: Scissors, link: "/admin/services", color: "text-primary", bg: "bg-primary/10" },
    { label: "Offers", count: counts?.offers ?? 0, icon: Gift, link: "/admin/offers", color: "text-rose-400", bg: "bg-rose-400/10" },
    { label: "Testimonials", count: counts?.testimonials ?? 0, icon: Star, link: "/admin/testimonials", color: "text-yellow-400", bg: "bg-yellow-400/10" },
    { label: "Blog Posts", count: counts?.blogPosts ?? 0, icon: FileText, link: "/admin/blog", color: "text-sky-400", bg: "bg-sky-400/10" },
    { label: "FAQ Items", count: counts?.faqItems ?? 0, icon: HelpCircle, link: "/admin/faq", color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Page Sections", count: counts?.pageSections ?? 0, icon: Layers, link: "/admin/pages", color: "text-violet-400", bg: "bg-violet-400/10" },
    { label: "Media Files", count: counts?.media ?? 0, icon: Image, link: "/admin/media", color: "text-orange-400", bg: "bg-orange-400/10" },
    { label: "Chatbot Leads", count: counts?.leads ?? 0, icon: Users, link: "/admin/leads", color: "text-teal-400", bg: "bg-teal-400/10" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h2 className="font-display text-2xl text-foreground">
          Welcome back{user?.email ? `, ${user.email.split("@")[0]}` : ""}
        </h2>
        <p className="text-muted-foreground text-sm mt-1">Here's an overview of your website content.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading
          ? Array.from({ length: 9 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))
          : stats.map((stat) => (
              <Link key={stat.label} to={stat.link} className="group">
                <Card className="border-border/40 hover:border-primary/40 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/5">
                  <CardContent className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                        <stat.icon className={`h-5 w-5 ${stat.color}`} />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-bold text-foreground tabular-nums">{stat.count}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </CardContent>
                </Card>
              </Link>
            ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="border-border/40">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="font-display text-lg text-foreground">Quick Actions</h3>
            </div>
            <div className="space-y-2">
              {[
                { label: "Add new service", link: "/admin/services" },
                { label: "Upload media", link: "/admin/media" },
                { label: "Create blog post", link: "/admin/blog" },
                { label: "View leads", link: "/admin/leads" },
              ].map((action) => (
                <Link
                  key={action.label}
                  to={action.link}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-muted/50 text-sm text-foreground transition-colors group"
                >
                  <span>{action.label}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/40">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <Users className="h-5 w-5 text-primary" />
              <h3 className="font-display text-lg text-foreground">Recent Activity</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {(counts?.leads ?? 0) > 0
                ? `You have ${counts?.leads} chatbot lead${(counts?.leads ?? 0) > 1 ? "s" : ""} to follow up on.`
                : "No recent activity. Leads from the chatbot will appear here."}
            </p>
            {(counts?.leads ?? 0) > 0 && (
              <Link to="/admin/leads" className="inline-flex items-center gap-1.5 text-primary text-sm mt-3 hover:gap-2.5 transition-all">
                View leads <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
