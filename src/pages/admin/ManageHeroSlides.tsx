import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Pencil } from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";

const empty = { title: "", highlight: "", subtitle: "", description: "", image_url: "", cta_text: "", cta_link: "", display_order: 0, is_active: true };

const ManageHeroSlides = () => {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState(empty);

  const { data: slides, isLoading } = useQuery({
    queryKey: ["admin-hero-slides"],
    queryFn: async () => {
      const { data, error } = await supabase.from("hero_slides").select("*").order("display_order");
      if (error) throw error;
      return data;
    },
  });

  const upsert = useMutation({
    mutationFn: async (v: typeof form & { id?: string }) => {
      if (v.id) {
        const { error } = await supabase.from("hero_slides").update(v).eq("id", v.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("hero_slides").insert(v);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-hero-slides"] }); qc.invalidateQueries({ queryKey: ["hero-slides"] }); toast.success("Saved"); closeDialog(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("hero_slides").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-hero-slides"] }); qc.invalidateQueries({ queryKey: ["hero-slides"] }); toast.success("Deleted"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const openCreate = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (s: any) => {
    setEditing(s);
    setForm({ title: s.title, highlight: s.highlight || "", subtitle: s.subtitle || "", description: s.description || "", image_url: s.image_url || "", cta_text: s.cta_text || "", cta_link: s.cta_link || "", display_order: s.display_order || 0, is_active: s.is_active });
    setOpen(true);
  };
  const closeDialog = () => { setOpen(false); setEditing(null); };
  const submit = (e: React.FormEvent) => { e.preventDefault(); upsert.mutate(editing ? { ...form, id: editing.id } : form); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl text-foreground">Hero Slides</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage the homepage hero carousel • {slides?.length ?? 0} slides</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" />Add Slide</Button></DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? "Edit Slide" : "New Slide"}</DialogTitle></DialogHeader>
            <form onSubmit={submit} className="space-y-4">
              <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="e.g. Where Beauty" /></div>
              <div><Label>Highlight Text (Gold)</Label><Input value={form.highlight} onChange={(e) => setForm({ ...form, highlight: e.target.value })} placeholder="e.g. Meets Elegance" /></div>
              <div><Label>Subtitle (Top Badge)</Label><Input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} placeholder="e.g. Luxury Beauty & Wellness" /></div>
              <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} /></div>
              <div><Label>Background Image</Label><ImageUpload value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url })} folder="hero" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>CTA Button Text</Label><Input value={form.cta_text} onChange={(e) => setForm({ ...form, cta_text: e.target.value })} placeholder="e.g. Book Now" /></div>
                <div><Label>CTA Link</Label><Input value={form.cta_link} onChange={(e) => setForm({ ...form, cta_link: e.target.value })} placeholder="e.g. /services" /></div>
              </div>
              <div className="flex items-center gap-4">
                <div><Label>Display Order</Label><Input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} className="w-20" /></div>
                <div className="flex items-center gap-2"><Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} /><Label>Active</Label></div>
              </div>
              <Button type="submit" className="w-full" disabled={upsert.isPending}>{upsert.isPending ? "Saving..." : "Save"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? <p className="text-muted-foreground">Loading...</p> : (
        <div className="grid gap-4">
          {slides?.map((s) => (
            <Card key={s.id} className={`overflow-hidden ${!s.is_active ? "opacity-50" : ""}`}>
              <CardContent className="p-0 flex items-center gap-4">
                <div className="w-40 h-24 bg-muted shrink-0">
                  {s.image_url && <img src={s.image_url} alt={s.title} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 py-3">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{s.subtitle}</p>
                  <p className="font-display text-lg text-foreground">{s.title} <span className="text-primary">{s.highlight}</span></p>
                  <p className="text-sm text-muted-foreground truncate">{s.description}</p>
                </div>
                <div className="flex items-center gap-1 pr-4">
                  <span className="text-xs text-muted-foreground mr-2">#{s.display_order}</span>
                  <Button variant="ghost" size="icon" onClick={() => openEdit(s)}><Pencil className="h-4 w-4" /></Button>
                  <ConfirmDelete onConfirm={() => remove.mutate(s.id)} isPending={remove.isPending} />
                </div>
              </CardContent>
            </Card>
          ))}
          {slides?.length === 0 && <p className="text-center text-muted-foreground py-8">No hero slides yet. Add your first slide!</p>}
        </div>
      )}
    </div>
  );
};

export default ManageHeroSlides;
