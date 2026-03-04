import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Trash2, Copy } from "lucide-react";

const ManageMedia = () => {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ file_name: "", file_url: "", file_type: "", alt_text: "", category: "" });

  const { data: media, isLoading } = useQuery({
    queryKey: ["admin-media"],
    queryFn: async () => {
      const { data, error } = await supabase.from("media").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const add = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("media").insert(form);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-media"] }); toast.success("Added"); setOpen(false); setForm({ file_name: "", file_url: "", file_type: "", alt_text: "", category: "" }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("media").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-media"] }); toast.success("Deleted"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const copyUrl = (url: string) => { navigator.clipboard.writeText(url); toast.success("URL copied!"); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl text-foreground">Media Library</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Add Media</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Media</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); add.mutate(); }} className="space-y-4">
              <div><Label>File Name</Label><Input value={form.file_name} onChange={(e) => setForm({ ...form, file_name: e.target.value })} required /></div>
              <div><Label>File URL</Label><Input value={form.file_url} onChange={(e) => setForm({ ...form, file_url: e.target.value })} required placeholder="https://..." /></div>
              <div><Label>Alt Text</Label><Input value={form.alt_text} onChange={(e) => setForm({ ...form, alt_text: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Type</Label><Input value={form.file_type} onChange={(e) => setForm({ ...form, file_type: e.target.value })} placeholder="image/jpeg" /></div>
                <div><Label>Category</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. services" /></div>
              </div>
              <Button type="submit" className="w-full" disabled={add.isPending}>{add.isPending ? "Adding..." : "Add"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? <p className="text-muted-foreground">Loading...</p> : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {media?.map((m) => (
            <Card key={m.id} className="overflow-hidden group">
              <div className="aspect-square bg-muted relative">
                <img src={m.file_url} alt={m.alt_text || m.file_name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button size="icon" variant="secondary" onClick={() => copyUrl(m.file_url)}><Copy className="h-4 w-4" /></Button>
                  <Button size="icon" variant="destructive" onClick={() => remove.mutate(m.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
              <CardContent className="p-3">
                <p className="text-sm font-medium truncate">{m.file_name}</p>
                <p className="text-xs text-muted-foreground">{m.category || "Uncategorized"}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageMedia;
