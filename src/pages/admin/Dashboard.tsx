import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scissors, Gift, Star, FileText, Image } from "lucide-react";

const Dashboard = () => {
  const { data: counts } = useQuery({
    queryKey: ["admin-counts"],
    queryFn: async () => {
      const [services, offers, testimonials, blogPosts, media] = await Promise.all([
        supabase.from("services").select("id", { count: "exact", head: true }),
        supabase.from("offers").select("id", { count: "exact", head: true }),
        supabase.from("testimonials").select("id", { count: "exact", head: true }),
        supabase.from("blog_posts").select("id", { count: "exact", head: true }),
        supabase.from("media").select("id", { count: "exact", head: true }),
      ]);
      return {
        services: services.count ?? 0,
        offers: offers.count ?? 0,
        testimonials: testimonials.count ?? 0,
        blogPosts: blogPosts.count ?? 0,
        media: media.count ?? 0,
      };
    },
  });

  const stats = [
    { label: "Services", count: counts?.services ?? 0, icon: Scissors, color: "text-primary" },
    { label: "Offers", count: counts?.offers ?? 0, icon: Gift, color: "text-primary" },
    { label: "Testimonials", count: counts?.testimonials ?? 0, icon: Star, color: "text-primary" },
    { label: "Blog Posts", count: counts?.blogPosts ?? 0, icon: FileText, color: "text-primary" },
    { label: "Media", count: counts?.media ?? 0, icon: Image, color: "text-primary" },
  ];

  return (
    <div>
      <h2 className="font-display text-2xl text-foreground mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <p className="font-display text-3xl text-foreground">{stat.count}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
