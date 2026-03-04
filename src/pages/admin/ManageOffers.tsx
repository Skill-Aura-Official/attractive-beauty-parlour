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
import { Plus, Pencil, Trash2 } from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";
import type { Tables } from "@/integrations/supabase/types";

type Offer = Tables<"offers">;
const empty = { title: "", description: "", image_url: "", is_active: true, is_bridal: false, is_party: false };

const ManageOffers = () => {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Offer | null>(null);
  const [form, setForm] = useState(empty);

  const { data: offers, isLoading } = useQuery({
    queryKey: ["admin-offers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("offers").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const upsert = useMutation({
    mutationFn: async (v: typeof form & { id?: string }) => {
      if (v.id) {
        const { error } = await supabase.from("offers").update(v).eq("id", v.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("offers").insert(v);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-offers"] }); qc.invalidateQueries({ queryKey: ["offers"] }); toast.success("Saved"); close(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("offers").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-offers"] }); qc.invalidateQueries({ queryKey: ["offers"] }); toast.success("Deleted"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const openCreate = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (o: Offer) => { setEditing(o); setForm({ title: o.title, description: o.description || "", image_url: o.image_url || "", is_active: o.is_active, is_bridal: o.is_bridal || false, is_party: o.is_party || false }); setOpen(true); };
  const close = () => { setOpen(false); setEditing(null); };
  const submit = (e: React.FormEvent) => { e.preventDefault(); upsert.mutate(editing ? { ...form, id: editing.id } : form); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl text-foreground">Offers & Packages</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" />Add Offer</Button></DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editing ? "Edit Offer" : "New Offer"}</DialogTitle></DialogHeader>
            <form onSubmit={submit} className="space-y-4">
              <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
              <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div><Label>Image</Label><ImageUpload value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url })} folder="offers" /></div>
              <div className="flex gap-6">
                <div className="flex items-center gap-2"><Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} /><Label>Active</Label></div>
                <div className="flex items-center gap-2"><Switch checked={form.is_bridal} onCheckedChange={(v) => setForm({ ...form, is_bridal: v })} /><Label>Bridal</Label></div>
                <div className="flex items-center gap-2"><Switch checked={form.is_party} onCheckedChange={(v) => setForm({ ...form, is_party: v })} /><Label>Party</Label></div>
              </div>
              <Button type="submit" className="w-full" disabled={upsert.isPending}>{upsert.isPending ? "Saving..." : "Save"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Card><CardContent className="p-0">
        <Table>
          <TableHeader><TableRow><TableHead>Image</TableHead><TableHead>Title</TableHead><TableHead>Type</TableHead><TableHead>Active</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {isLoading ? <TableRow><TableCell colSpan={5} className="text-center py-8">Loading...</TableCell></TableRow> : offers?.map((o) => (
              <TableRow key={o.id}>
                <TableCell>{o.image_url ? <img src={o.image_url} alt={o.title} className="h-10 w-10 rounded object-cover" /> : <div className="h-10 w-10 rounded bg-muted" />}</TableCell>
                <TableCell className="font-medium">{o.title}</TableCell>
                <TableCell>{o.is_bridal ? "Bridal" : o.is_party ? "Party" : "General"}</TableCell>
                <TableCell><span className={`px-2 py-1 rounded text-xs ${o.is_active ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>{o.is_active ? "Yes" : "No"}</span></TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(o)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => remove.mutate(o.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  );
};

export default ManageOffers;
