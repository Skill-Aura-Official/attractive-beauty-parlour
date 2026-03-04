import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const ManageContact = () => {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    phone_number: "", whatsapp_number: "", email: "", address: "",
    google_map_embed: "", instagram_url: "", facebook_url: "",
  });

  const { data: settings } = useQuery({
    queryKey: ["admin-contact"],
    queryFn: async () => {
      const { data, error } = await supabase.from("contact_settings").select("*").limit(1).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (settings) {
      setForm({
        phone_number: settings.phone_number || "",
        whatsapp_number: settings.whatsapp_number || "",
        email: settings.email || "",
        address: settings.address || "",
        google_map_embed: settings.google_map_embed || "",
        instagram_url: settings.instagram_url || "",
        facebook_url: settings.facebook_url || "",
      });
    }
  }, [settings]);

  const save = useMutation({
    mutationFn: async () => {
      if (settings?.id) {
        const { error } = await supabase.from("contact_settings").update(form).eq("id", settings.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("contact_settings").insert(form);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-contact"] }); toast.success("Contact settings saved"); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <h2 className="font-display text-2xl text-foreground mb-6">Contact Settings</h2>
      <Card>
        <CardHeader><CardTitle>Update Contact Information</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label>Phone Number</Label><Input value={form.phone_number} onChange={(e) => setForm({ ...form, phone_number: e.target.value })} /></div>
              <div><Label>WhatsApp Number</Label><Input value={form.whatsapp_number} onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })} /></div>
              <div><Label>Email</Label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              <div><Label>Instagram URL</Label><Input value={form.instagram_url} onChange={(e) => setForm({ ...form, instagram_url: e.target.value })} /></div>
              <div><Label>Facebook URL</Label><Input value={form.facebook_url} onChange={(e) => setForm({ ...form, facebook_url: e.target.value })} /></div>
            </div>
            <div><Label>Address</Label><Textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
            <div><Label>Google Map Embed URL</Label><Input value={form.google_map_embed} onChange={(e) => setForm({ ...form, google_map_embed: e.target.value })} /></div>
            <Button type="submit" disabled={save.isPending}>{save.isPending ? "Saving..." : "Save Settings"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageContact;
