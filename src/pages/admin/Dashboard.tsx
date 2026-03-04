import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scissors, Gift, Star, FileText, Image, PanelTop, HelpCircle, Layers } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { data: counts } = useQuery({
    queryKey: ["admin-counts"],
    queryFn: async () => {
      const [services, offers, testimonials, blogPosts, media, heroSlides, faqItems, pageSections] = await Promise.all([
        supabase.from("services").select("id", { count: "exact", head: true }),
        supabase.from("offers").select("id", { count: "exact", head: true }),
        supabase.from("testimonials").select("id", { count: "exact", head: true }),
        supabase.from("blog_posts").select("id", { count: "exact", head: true }),
        supabase.from("media").select("id", { count: "exact", head: true }),
        supabase.from("hero_slides").select("id", { count: "exact", head: true }),
        supabase.from("faq_items").select("id", { count: "exact", head: true }),
        supabase.from("page_sections").select("id", { count: "exact", head: true }),
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
      };
    },
  });

  const stats = [
    { label: "Hero Slides", count: counts?.heroSlides ?? 0, icon: PanelTop, link: "/admin/hero" },
    { label: "Services", count: counts?.services ?? 0, icon: Scissors, link: "/admin/services" },
    { label: "Offers", count: counts?.offers ?? 0, icon: Gift, link: "/admin/offers" },
    { label: "Testimonials", count: counts?.testimonials ?? 0, icon: Star, link: "/admin/testimonials" },
    { label: "Blog Posts", count: counts?.blogPosts ?? 0, icon: FileText, link: "/admin/blog" },
    { label: "FAQ Items", count: counts?.faqItems ?? 0, icon: HelpCircle, link: "/admin/faq" },
    { label: "Page Sections", count: counts?.pageSections ?? 0, icon: Layers, link: "/admin/pages" },
    { label: "Media", count: counts?.media ?? 0, icon: Image, link: "/admin/media" },
  ];

  return (
    <div>
      <h2 className="font-display text-2xl text-foreground mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.label} to={stat.link}>
            <Card className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                <stat.icon className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="font-display text-3xl text-foreground">{stat.count}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
