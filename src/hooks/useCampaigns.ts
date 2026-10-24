import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export interface CampaignWithServices {
  campaign: Tables<"campaigns">;
  services: (Tables<"services"> & { discount_pct: number })[];
}

/**
 * Fetches the two published campaigns (happy_hours, facial_offer) together with
 * their explicitly eligible services and per-service discount percentages.
 */
export const useCampaigns = () => {
  return useQuery({
    queryKey: ["campaigns-with-services"],
    queryFn: async (): Promise<CampaignWithServices[]> => {
      const { data: campaigns, error } = await supabase
        .from("campaigns")
        .select("*")
        .eq("is_published", true);
      if (error) throw error;
      if (!campaigns || campaigns.length === 0) return [];

      const { data: rows, error: svcError } = await supabase
        .from("campaign_services")
        .select("campaign_id, discount_pct, services(*)")
        .in(
          "campaign_id",
          campaigns.map((c) => c.id)
        );
      if (svcError) throw svcError;

      return campaigns.map((campaign) => ({
        campaign,
        services: (rows ?? [])
          .filter((r) => r.campaign_id === campaign.id && r.services)
          .map((r) => ({
            ...(r.services as Tables<"services">),
            discount_pct: r.discount_pct,
          })),
      }));
    },
  });
};

export const useCampaign = (key: string) => {
  const all = useCampaigns();
  return {
    ...all,
    data: all.data?.find((c) => c.campaign.campaign_key === key),
  };
};
