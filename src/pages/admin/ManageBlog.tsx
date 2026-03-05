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
import { Plus, Pencil } from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import type { Tables } from "@/integrations/supabase/types";

type BlogPost = Tables<"blog_posts">;
const empty = { title: "", slug: "", content: "", excerpt: "", featured_image: "", category: "", author: "Attractive Beauty Parlour", is_published: false, is_featured: false, meta_title: "", meta_description: "" };

const ManageBlog = () => {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState(empty);

  const { data: posts, isLoading } = useQuery({
    queryKey: ["admin-blog"],
    queryFn: async () => {
      const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const upsert = useMutation({
    mutationFn: async (v: typeof form & { id?: string }) => {
      const payload = { ...v, published_at: v.is_published ? new Date().toISOString() : null };
      if (v.id) {
        const { error } = await supabase.from("blog_posts").update(payload).eq("id", v.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("blog_posts").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-blog"] }); qc.invalidateQueries({ queryKey: ["blog_posts"] }); toast.success("Saved"); closeDialog(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("blog_posts").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-blog"] }); qc.invalidateQueries({ queryKey: ["blog_posts"] }); toast.success("Deleted"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const openCreate = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (p: BlogPost) => {
    setEditing(p);
    setForm({ title: p.title, slug: p.slug, content: p.content || "", excerpt: p.excerpt || "", featured_image: p.featured_image || "", category: p.category || "", author: p.author || "Attractive Beauty Parlour", is_published: p.is_published, is_featured: p.is_featured || false, meta_title: p.meta_title || "", meta_description: p.meta_description || "" });
    setOpen(true);
  };
  const closeDialog = () => { setOpen(false); setEditing(null); };
  const autoSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const submit = (e: React.FormEvent) => { e.preventDefault(); upsert.mutate(editing ? { ...form, id: editing.id } : form); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl text-foreground">Blog Posts</h2>
          <p className="text-sm text-muted-foreground mt-1">{posts?.length ?? 0} posts total</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" />New Post</Button></DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? "Edit Post" : "New Post"}</DialogTitle></DialogHeader>
            <form onSubmit={submit} className="space-y-4">
              <div><Label>Title</Label><Input value={form.title} onChange={(e) => { setForm({ ...form, title: e.target.value, slug: editing ? form.slug : autoSlug(e.target.value) }); }} required /></div>
              <div><Label>Slug</Label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Category</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Skincare, Bridal" /></div>
                <div><Label>Author</Label><Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} /></div>
              </div>
              <div><Label>Excerpt</Label><Textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} /></div>
              <div><Label>Content</Label><Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={10} placeholder="Write your post content here..." /></div>
              <div><Label>Featured Image</Label><ImageUpload value={form.featured_image} onChange={(url) => setForm({ ...form, featured_image: url })} folder="blog" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Meta Title</Label><Input value={form.meta_title} onChange={(e) => setForm({ ...form, meta_title: e.target.value })} /></div>
                <div><Label>Meta Description</Label><Input value={form.meta_description} onChange={(e) => setForm({ ...form, meta_description: e.target.value })} /></div>
              </div>
              <div className="flex gap-6">
                <div className="flex items-center gap-2"><Switch checked={form.is_published} onCheckedChange={(v) => setForm({ ...form, is_published: v })} /><Label>Published</Label></div>
                <div className="flex items-center gap-2"><Switch checked={form.is_featured} onCheckedChange={(v) => setForm({ ...form, is_featured: v })} /><Label>Featured</Label></div>
              </div>
              <Button type="submit" className="w-full" disabled={upsert.isPending}>{upsert.isPending ? "Saving..." : "Save"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Card><CardContent className="p-0">
        <Table>
          <TableHeader><TableRow><TableHead>Image</TableHead><TableHead>Title</TableHead><TableHead>Category</TableHead><TableHead>Published</TableHead><TableHead>Featured</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {isLoading ? <TableRow><TableCell colSpan={6} className="text-center py-8">Loading...</TableCell></TableRow> : 
            posts?.length === 0 ? <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No blog posts yet.</TableCell></TableRow> :
            posts?.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.featured_image ? <img src={p.featured_image} alt={p.title} className="h-10 w-10 rounded object-cover" /> : <div className="h-10 w-10 rounded bg-muted" />}</TableCell>
                <TableCell className="font-medium max-w-xs truncate">{p.title}</TableCell>
                <TableCell>{p.category}</TableCell>
                <TableCell><span className={`px-2 py-1 rounded text-xs ${p.is_published ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>{p.is_published ? "Yes" : "Draft"}</span></TableCell>
                <TableCell>{p.is_featured ? "⭐" : "—"}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                  <ConfirmDelete onConfirm={() => remove.mutate(p.id)} isPending={remove.isPending} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  );
};

export default ManageBlog;
