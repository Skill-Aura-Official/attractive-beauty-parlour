import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Copy, Upload } from "lucide-react";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";

const ManageMedia = () => {
  const qc = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [filterCat, setFilterCat] = useState("all");
  const fileRef = useRef<HTMLInputElement>(null);

  const { data: media, isLoading } = useQuery({
    queryKey: ["admin-media"],
    queryFn: async () => {
      const { data, error } = await supabase.from("media").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filtered = filterCat === "all" ? media : media?.filter((m) => m.category === filterCat);
  const categories = [...new Set(media?.map((m) => m.category).filter(Boolean))];

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
        toast.error(`${file.name} is not a supported file type`);
        continue;
      }

      const ext = file.name.split(".").pop();
      const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error } = await supabase.storage.from("media").upload(path, file);
      if (error) {
        toast.error(`Failed to upload ${file.name}: ${error.message}`);
        continue;
      }

      const { data: urlData } = supabase.storage.from("media").getPublicUrl(path);
      await supabase.from("media").insert({
        file_name: file.name,
        file_url: urlData.publicUrl,
        file_type: file.type,
        file_size: file.size,
        category: "uploads",
      });
    }

    qc.invalidateQueries({ queryKey: ["admin-media"] });
    toast.success("Upload complete!");
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const remove = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("media").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-media"] }); toast.success("Deleted"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const copyUrl = (url: string) => { navigator.clipboard.writeText(url); toast.success("URL copied!"); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl text-foreground">Media Library</h2>
          <p className="text-sm text-muted-foreground mt-1">{media?.length ?? 0} files</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={filterCat} onValueChange={setFilterCat}>
            <SelectTrigger className="w-32"><SelectValue placeholder="Filter" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {categories.map((c) => <SelectItem key={c} value={c!}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <input ref={fileRef} type="file" accept="image/*,video/*" multiple onChange={handleUpload} className="hidden" />
          <Button onClick={() => fileRef.current?.click()} disabled={uploading}>
            {uploading ? <div className="animate-spin h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full mr-2" /> : <Upload className="mr-2 h-4 w-4" />}
            {uploading ? "Uploading..." : "Upload Files"}
          </Button>
        </div>
      </div>

      {isLoading ? <p className="text-muted-foreground">Loading...</p> : filtered?.length === 0 ? (
        <p className="text-center text-muted-foreground py-16">No media files yet. Upload your first file!</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered?.map((m) => (
            <Card key={m.id} className="overflow-hidden group">
              <div className="aspect-square bg-muted relative">
                <img src={m.file_url} alt={m.alt_text || m.file_name} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button size="icon" variant="secondary" onClick={() => copyUrl(m.file_url)}><Copy className="h-4 w-4" /></Button>
                  <ConfirmDelete onConfirm={() => remove.mutate(m.id)} isPending={remove.isPending} />
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
