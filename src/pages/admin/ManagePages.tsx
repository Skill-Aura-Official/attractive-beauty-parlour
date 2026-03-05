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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Pencil } from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";

const empty = { page: "about", section_key: "", title: "", content: "", image_url: "", display_order: 0, is_visible: true };

const ManagePages = () => {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState(empty);
  const [filterPage, setFilterPage] = useState("all");

  const { data: sections, isLoading } = useQuery({
    queryKey: ["admin-page-sections"],
    queryFn: async () => {
      const { data, error } = await supabase.from("page_sections").select("*").order("page").order("display_order");
      if (error) throw error;
      return data;
    },
  });

  const filtered = filterPage === "all" ? sections : sections?.filter((s) => s.page === filterPage);

  const upsert = useMutation({
    mutationFn: async (v: typeof form & { id?: string }) => {
      if (v.id) {
        const { error } = await supabase.from("page_sections").update(v).eq("id", v.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("page_sections").insert(v);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-page-sections"] }); toast.success("Saved"); closeDialog(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("page_sections").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-page-sections"] }); toast.success("Deleted"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const openCreate = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (s: any) => {
    setEditing(s);
    setForm({ page: s.page, section_key: s.section_key, title: s.title || "", content: s.content || "", image_url: s.image_url || "", display_order: s.display_order || 0, is_visible: s.is_visible });
    setOpen(true);
  };
  const closeDialog = () => { setOpen(false); setEditing(null); };
  const submit = (e: React.FormEvent) => { e.preventDefault(); upsert.mutate(editing ? { ...form, id: editing.id } : form); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl text-foreground">Page Content</h2>
          <p className="text-sm text-muted-foreground mt-1">{sections?.length ?? 0} sections total</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={filterPage} onValueChange={setFilterPage}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Pages</SelectItem>
              <SelectItem value="about">About</SelectItem>
              <SelectItem value="home">Home</SelectItem>
              <SelectItem value="kids">Kids</SelectItem>
              <SelectItem value="contact">Contact</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" />Add Section</Button></DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>{editing ? "Edit Section" : "New Section"}</DialogTitle></DialogHeader>
              <form onSubmit={submit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Page</Label>
                    <Select value={form.page} onValueChange={(v) => setForm({ ...form, page: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="home">Home</SelectItem>
                        <SelectItem value="about">About</SelectItem>
                        <SelectItem value="kids">Kids</SelectItem>
                        <SelectItem value="contact">Contact</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>Section Key</Label><Input value={form.section_key} onChange={(e) => setForm({ ...form, section_key: e.target.value })} required placeholder="e.g. hero, story, mission" /></div>
                </div>
                <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
                <div><Label>Content</Label><Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={6} /></div>
                <div><Label>Image</Label><ImageUpload value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url })} folder="pages" /></div>
                <div className="flex items-center gap-4">
                  <div><Label>Display Order</Label><Input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} className="w-20" /></div>
                  <div className="flex items-center gap-2"><Switch checked={form.is_visible} onCheckedChange={(v) => setForm({ ...form, is_visible: v })} /><Label>Visible</Label></div>
                </div>
                <Button type="submit" className="w-full" disabled={upsert.isPending}>{upsert.isPending ? "Saving..." : "Save"}</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card><CardContent className="p-0">
        <Table>
          <TableHeader><TableRow><TableHead>Page</TableHead><TableHead>Section</TableHead><TableHead>Title</TableHead><TableHead>Order</TableHead><TableHead>Visible</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {isLoading ? <TableRow><TableCell colSpan={6} className="text-center py-8">Loading...</TableCell></TableRow> : 
            filtered?.length === 0 ? <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No sections yet.</TableCell></TableRow> :
            filtered?.map((s) => (
              <TableRow key={s.id}>
                <TableCell><span className="px-2 py-1 rounded text-xs bg-accent text-accent-foreground capitalize">{s.page}</span></TableCell>
                <TableCell className="font-medium">{s.section_key}</TableCell>
                <TableCell className="max-w-xs truncate">{s.title || "—"}</TableCell>
                <TableCell>{s.display_order}</TableCell>
                <TableCell><span className={`px-2 py-1 rounded text-xs ${s.is_visible ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>{s.is_visible ? "Yes" : "No"}</span></TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(s)}><Pencil className="h-4 w-4" /></Button>
                  <ConfirmDelete onConfirm={() => remove.mutate(s.id)} isPending={remove.isPending} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  );
};

export default ManagePages;
