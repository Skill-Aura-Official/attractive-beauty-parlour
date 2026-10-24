import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Clock, Percent, Save, CalendarDays } from "lucide-react";
import {
  formatINR,
  discountedPrice,
  isValidHappyHoursWindow,
  MAX_FACIAL_DISCOUNT,
  MAX_HAPPY_HOURS_DISCOUNT,
} from "@/lib/campaign";
import type { Tables } from "@/integrations/supabase/types";

type Campaign = Tables<"campaigns">;
type Service = Tables<"services">;
type CampaignServiceRow = Tables<"campaign_services">;

const CAMPAIGN_TABS: { key: "happy_hours" | "facial_offer"; label: string; maxDiscount: number }[] = [
  { key: "happy_hours", label: "Happy Hours", maxDiscount: MAX_HAPPY_HOURS_DISCOUNT },
  { key: "facial_offer", label: "Facial Offers", maxDiscount: MAX_FACIAL_DISCOUNT },
];

const ManageCampaigns = () => {
  const qc = useQueryClient();
  const [tab, setTab] = useState<"happy_hours" | "facial_offer">("happy_hours");
  const [form, setForm] = useState<Partial<Campaign>>({});

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ["admin-campaigns"],
    queryFn: async () => {
      const { data, error } = await supabase.from("campaigns").select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: services } = useQuery({
    queryKey: ["admin-services"],
    queryFn: async () => {
      const { data, error } = await supabase.from("services").select("*").order("display_order");
      if (error) throw error;
      return data as Service[];
    },
  });

  const { data: csRows } = useQuery({
    queryKey: ["admin-campaign-services"],
    queryFn: async () => {
      const { data, error } = await supabase.from("campaign_services").select("*");
      if (error) throw error;
      return data as CampaignServiceRow[];
    },
  });

  const campaign = campaigns?.find((c) => c.campaign_key === tab);
  const maxDiscount = CAMPAIGN_TABS.find((t) => t.key === tab)?.maxDiscount ?? 50;
  const eligibleByService = useMemo(() => {
    const map = new Map<string, number>();
    (csRows ?? [])
      .filter((r) => r.campaign_id === campaign?.id)
      .forEach((r) => map.set(r.service_id, r.discount_pct));
    return map;
  }, [csRows, campaign?.id]);

  useEffect(() => {
    if (campaign) setForm({ ...campaign });
  }, [campaign?.id, campaign?.updated_at]); // eslint-disable-line react-hooks/exhaustive-deps

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin-campaigns"] });
    qc.invalidateQueries({ queryKey: ["admin-campaign-services"] });
    qc.invalidateQueries({ queryKey: ["campaigns-with-services"] });
  };

  const saveCampaign = useMutation({
    mutationFn: async (values: Partial<Campaign>) => {
      if (!campaign) throw new Error("Campaign not found");
      if (campaign.campaign_key === "happy_hours" && values.daily_start_time && values.daily_end_time) {
        if (!isValidHappyHoursWindow(values.daily_start_time, values.daily_end_time)) {
          throw new Error("The daily window must be exactly two hours (e.g. 11:00 – 13:00)");
        }
      }
      const { error } = await supabase.from("campaigns").update(values).eq("id", campaign.id);
      if (error) throw error;
    },
    onSuccess: () => { invalidate(); toast.success("Campaign saved"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const upsertEligible = useMutation({
    mutationFn: async ({ serviceId, discount }: { serviceId: string; discount: number }) => {
      if (!campaign) throw new Error("Campaign not found");
      const { error } = await supabase
        .from("campaign_services")
        .upsert(
          { campaign_id: campaign.id, service_id: serviceId, discount_pct: discount },
          { onConflict: "campaign_id,service_id" }
        );
      if (error) throw error;
    },
    onSuccess: () => { invalidate(); toast.success("Service added to offer"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const removeEligible = useMutation({
    mutationFn: async (serviceId: string) => {
      if (!campaign) throw new Error("Campaign not found");
      const { error } = await supabase
        .from("campaign_services")
        .delete()
        .eq("campaign_id", campaign.id)
        .eq("service_id", serviceId);
      if (error) throw error;
    },
    onSuccess: () => { invalidate(); toast.success("Service removed from offer"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaign) return;
    saveCampaign.mutate({
      title: form.title ?? "",
      subtitle: form.subtitle ?? "",
      description: form.description ?? "",
      image_url: form.image_url ?? "",
      start_date: form.start_date ?? null,
      end_date: form.end_date ?? null,
      daily_start_time: campaign.campaign_key === "happy_hours" ? form.daily_start_time ?? null : null,
      daily_end_time: campaign.campaign_key === "happy_hours" ? form.daily_end_time ?? null : null,
      cta_text: form.cta_text ?? "",
      terms: form.terms ?? "",
      is_published: form.is_published ?? true,
    });
  };

  const handleToggleService = (s: Service, checked: boolean) => {
    if (checked) {
      upsertEligible.mutate({ serviceId: s.id, discount: eligibleByService.get(s.id) ?? 0 });
    } else {
      removeEligible.mutate(s.id);
    }
  };

  const handleDiscountChange = (s: Service, raw: string) => {
    const value = Math.max(0, Math.min(maxDiscount, Number(raw) || 0));
    upsertEligible.mutate({ serviceId: s.id, discount: value });
  };

  const isHappyHours = tab === "happy_hours";

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-2xl text-foreground">Campaigns</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Happy Hours discounts are capped at {MAX_HAPPY_HOURS_DISCOUNT}% and facial offers at {MAX_FACIAL_DISCOUNT}%. Only services you select here are advertised as discounted.
        </p>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList>
          {CAMPAIGN_TABS.map((t) => (
            <TabsTrigger key={t.key} value={t.key}>{t.label}</TabsTrigger>
          ))}
        </TabsList>

        {CAMPAIGN_TABS.map((t) => {
          const c = campaigns?.find((x) => x.campaign_key === t.key);
          return (
            <TabsContent key={t.key} value={t.key}>
              {isLoading || !c ? (
                <Card><CardContent className="py-10 text-center text-muted-foreground">Loading campaign…</CardContent></Card>
              ) : (
                <div className="grid lg:grid-cols-2 gap-6 mt-4">
                  {/* Campaign settings */}
                  <Card>
                    <CardContent className="p-5">
                      <h3 className="font-display text-lg text-foreground mb-4">Campaign Settings</h3>
                      <form onSubmit={submit} className="space-y-4">
                        <div><Label>Title</Label><Input value={form.title ?? ""} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
                        <div><Label>Subtitle</Label><Input value={form.subtitle ?? ""} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} /></div>
                        <div><Label>Description</Label><Textarea value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
                        <div><Label>Image</Label><ImageUpload value={form.image_url ?? ""} onChange={(url) => setForm({ ...form, image_url: url })} folder="campaigns" /></div>

                        {isHappyHours && (
                          <div>
                            <Label className="flex items-center gap-2"><CalendarDays className="h-3.5 w-3.5" /> Start Date</Label>
                            <Input type="date" value={form.start_date ?? ""} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
                            <div className="flex gap-2 mt-2">
                              {["2026-10-29", "2026-10-30"].map((d) => (
                                <Button key={d} type="button" variant="outline" size="sm" onClick={() => setForm({ ...form, start_date: d })}>
                                  {d === "2026-10-29" ? "29 Oct 2026" : "30 Oct 2026"}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                        {!isHappyHours && (
                          <div className="grid grid-cols-2 gap-3">
                            <div><Label>Start Date</Label><Input type="date" value={form.start_date ?? ""} onChange={(e) => setForm({ ...form, start_date: e.target.value })} /></div>
                            <div><Label>End Date</Label><Input type="date" value={form.end_date ?? ""} onChange={(e) => setForm({ ...form, end_date: e.target.value })} /></div>
                          </div>
                        )}

                        {isHappyHours && (
                          <div className="p-3.5 rounded-xl border border-border/50 bg-muted/30">
                            <Label className="flex items-center gap-2 mb-2"><Clock className="h-3.5 w-3.5" /> Daily Two-Hour Window</Label>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label className="text-xs text-muted-foreground">Starts at</Label>
                                <Input type="time" value={(form.daily_start_time ?? "").slice(0, 5)} onChange={(e) => setForm({ ...form, daily_start_time: e.target.value })} />
                              </div>
                              <div>
                                <Label className="text-xs text-muted-foreground">Ends at</Label>
                                <Input type="time" value={(form.daily_end_time ?? "").slice(0, 5)} onChange={(e) => setForm({ ...form, daily_end_time: e.target.value })} />
                              </div>
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-2">
                              Leave empty while the salon finalises the timing — the website will show “call to confirm”.
                            </p>
                          </div>
                        )}

                        <div><Label>CTA Text</Label><Input value={form.cta_text ?? ""} onChange={(e) => setForm({ ...form, cta_text: e.target.value })} /></div>
                        <div><Label>Terms &amp; Conditions</Label><Textarea rows={6} value={form.terms ?? ""} onChange={(e) => setForm({ ...form, terms: e.target.value })} /></div>
                        <div className="flex items-center gap-2">
                          <Switch checked={form.is_published ?? true} onCheckedChange={(v) => setForm({ ...form, is_published: v })} />
                          <Label>Published</Label>
                        </div>
                        <Button type="submit" className="w-full" disabled={saveCampaign.isPending}>
                          <Save className="mr-2 h-4 w-4" />
                          {saveCampaign.isPending ? "Saving..." : "Save Campaign"}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>

                  {/* Eligible services */}
                  <Card>
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-display text-lg text-foreground flex items-center gap-2">
                          <Percent className="h-4 w-4 text-primary" /> Eligible Services
                        </h3>
                        <span className="text-xs text-muted-foreground">Max {t.maxDiscount}%</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-4">
                        Only ticked services appear as discounted on the website. {isHappyHours ? "Customers are asked to call to confirm today's selection." : ""}
                      </p>
                      <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
                        {(services ?? []).map((s) => {
                          const checked = eligibleByService.has(s.id);
                          const pct = eligibleByService.get(s.id) ?? 0;
                          const promo = discountedPrice(s.price, pct);
                          return (
                            <div
                              key={s.id}
                              className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${checked ? "border-primary/40 bg-primary/5" : "border-border/50"}`}
                            >
                              <Checkbox
                                checked={checked}
                                onCheckedChange={(v) => handleToggleService(s, v === true)}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">{s.display_name || s.name}</p>
                                {s.price != null && Number(s.price) > 0 && (
                                  <p className="text-xs text-muted-foreground tabular-nums">
                                    {formatINR(s.price)}
                                    {checked && pct > 0 && promo != null && (
                                      <> → <span className="text-primary font-semibold">{formatINR(promo)}</span></>
                                    )}
                                  </p>
                                )}
                              </div>
                              {checked && (
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <Input
                                    type="number"
                                    min={0}
                                    max={t.maxDiscount}
                                    value={pct}
                                    onChange={(e) => handleDiscountChange(s, e.target.value)}
                                    className="w-20 h-8 text-sm"
                                  />
                                  <span className="text-xs text-muted-foreground">%</span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};

export default ManageCampaigns;
