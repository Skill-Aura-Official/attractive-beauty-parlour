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

const empty = { question: "", answer: "", category: "General", display_order: 0, is_visible: true };

const ManageFAQ = () => {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState(empty);

  const { data: items, isLoading } = useQuery({
    queryKey: ["admin-faq"],
    queryFn: async () => {
      const { data, error } = await supabase.from("faq_items").select("*").order("category").order("display_order");
      if (error) throw error;
      return data;
    },
  });

  const upsert = useMutation({
    mutationFn: async (v: typeof form & { id?: string }) => {
      if (v.id) {
        const { error } = await supabase.from("faq_items").update(v).eq("id", v.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("faq_items").insert(v);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-faq"] }); toast.success("Saved"); close(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("faq_items").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-faq"] }); toast.success("Deleted"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const openCreate = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (f: any) => {
    setEditing(f);
    setForm({ question: f.question, answer: f.answer, category: f.category, display_order: f.display_order || 0, is_visible: f.is_visible });
    setOpen(true);
  };
  const close = () => { setOpen(false); setEditing(null); };
  const submit = (e: React.FormEvent) => { e.preventDefault(); upsert.mutate(editing ? { ...form, id: editing.id } : form); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl text-foreground">FAQ Management</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage frequently asked questions on your FAQ page</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" />Add FAQ</Button></DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editing ? "Edit FAQ" : "New FAQ"}</DialogTitle></DialogHeader>
            <form onSubmit={submit} className="space-y-4">
              <div><Label>Category</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required placeholder="e.g. General, Services, Booking" /></div>
              <div><Label>Question</Label><Input value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} required /></div>
              <div><Label>Answer</Label><Textarea value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} required rows={4} /></div>
              <div className="flex items-center gap-4">
                <div><Label>Display Order</Label><Input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} className="w-20" /></div>
                <div className="flex items-center gap-2"><Switch checked={form.is_visible} onCheckedChange={(v) => setForm({ ...form, is_visible: v })} /><Label>Visible</Label></div>
              </div>
              <Button type="submit" className="w-full" disabled={upsert.isPending}>{upsert.isPending ? "Saving..." : "Save"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card><CardContent className="p-0">
        <Table>
          <TableHeader><TableRow><TableHead>Category</TableHead><TableHead>Question</TableHead><TableHead>Order</TableHead><TableHead>Visible</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {isLoading ? <TableRow><TableCell colSpan={5} className="text-center py-8">Loading...</TableCell></TableRow> : items?.map((f) => (
              <TableRow key={f.id}>
                <TableCell><span className="px-2 py-1 rounded text-xs bg-accent text-accent-foreground">{f.category}</span></TableCell>
                <TableCell className="font-medium max-w-xs truncate">{f.question}</TableCell>
                <TableCell>{f.display_order}</TableCell>
                <TableCell><span className={`px-2 py-1 rounded text-xs ${f.is_visible ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>{f.is_visible ? "Yes" : "No"}</span></TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(f)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => remove.mutate(f.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  );
};

export default ManageFAQ;
