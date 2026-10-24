import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useKcPackages = () => {
  return useQuery({
    queryKey: ["kc-packages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("kc_packages")
        .select("*")
        .eq("is_published", true)
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
};
