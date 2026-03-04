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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";
import type { Tables } from "@/integrations/supabase/types";

type Testimonial = Tables<"testimonials">;
const empty = { client_name: "", review_text: "", rating: 5, image_url: "", is_visible: true };

const ManageTestimonials = () => {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState(empty);

  const { data: items, isLoading } = useQuery({
    queryKey: ["admin-testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const upsert = useMutation({
    mutationFn: async (v: typeof form & { id?: string }) => {
      if (v.id) {
        const { error } = await supabase.from("testimonials").update(v).eq("id", v.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("testimonials").insert(v);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-testimonials"] }); qc.invalidateQueries({ queryKey: ["testimonials"] }); toast.success("Saved"); close(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("testimonials").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-testimonials"] }); qc.invalidateQueries({ queryKey: ["testimonials"] }); toast.success("Deleted"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const openCreate = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (t: Testimonial) => { setEditing(t); setForm({ client_name: t.client_name, review_text: t.review_text, rating: t.rating || 5, image_url: t.image_url || "", is_visible: t.is_visible }); setOpen(true); };
  const close = () => { setOpen(false); setEditing(null); };
  const submit = (e: React.FormEvent) => { e.preventDefault(); upsert.mutate(editing ? { ...form, id: editing.id } : form); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl text-foreground">Testimonials</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" />Add Testimonial</Button></DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editing ? "Edit Testimonial" : "New Testimonial"}</DialogTitle></DialogHeader>
            <form onSubmit={submit} className="space-y-4">
              <div><Label>Client Name</Label><Input value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} required /></div>
              <div><Label>Review</Label><Textarea value={form.review_text} onChange={(e) => setForm({ ...form, review_text: e.target.value })} required rows={4} /></div>
              <div><Label>Rating (1-5)</Label>
                <div className="flex gap-1 mt-1">
                  {[1,2,3,4,5].map((r) => (
                    <button type="button" key={r} onClick={() => setForm({ ...form, rating: r })}>
                      <Star className={`h-6 w-6 ${r <= form.rating ? "text-primary fill-primary" : "text-muted-foreground"}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div><Label>Client Photo</Label><ImageUpload value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url })} folder="testimonials" /></div>
              <div className="flex items-center gap-2"><Switch checked={form.is_visible} onCheckedChange={(v) => setForm({ ...form, is_visible: v })} /><Label>Visible</Label></div>
              <Button type="submit" className="w-full" disabled={upsert.isPending}>{upsert.isPending ? "Saving..." : "Save"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Card><CardContent className="p-0">
        <Table>
          <TableHeader><TableRow><TableHead>Photo</TableHead><TableHead>Client</TableHead><TableHead>Review</TableHead><TableHead>Rating</TableHead><TableHead>Visible</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {isLoading ? <TableRow><TableCell colSpan={6} className="text-center py-8">Loading...</TableCell></TableRow> : items?.map((t) => (
              <TableRow key={t.id}>
                <TableCell>{t.image_url ? <img src={t.image_url} alt={t.client_name} className="h-10 w-10 rounded-full object-cover" /> : <div className="h-10 w-10 rounded-full bg-muted" />}</TableCell>
                <TableCell className="font-medium">{t.client_name}</TableCell>
                <TableCell className="max-w-xs truncate">{t.review_text}</TableCell>
                <TableCell>{t.rating}/5</TableCell>
                <TableCell><span className={`px-2 py-1 rounded text-xs ${t.is_visible ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>{t.is_visible ? "Yes" : "No"}</span></TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(t)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => remove.mutate(t.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  );
};

export default ManageTestimonials;
