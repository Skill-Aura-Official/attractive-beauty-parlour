import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { toast } from "sonner";
import { Eye, EyeOff, ImagePlus, Play, Upload } from "lucide-react";

type GalleryItem = {
  id: string;
  title: string;
  description: string | null;
  media_url: string;
  media_type: "image" | "video";
  file_name: string | null;
  file_size: number | null;
  display_order: number | null;
  is_visible: boolean;
  created_at: string;
};

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ManageGallery = () => {
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const { data: items, isLoading } = useQuery({
    queryKey: ["admin-gallery-items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_items" as never)
        .select("*" as never)
        .order("display_order" as never, { ascending: true })
        .order("created_at" as never, { ascending: false });
      if (error) throw error;
      return data as unknown as GalleryItem[];
    },
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);

    for (const file of Array.from(files)) {
      const mediaType = file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : null;
      if (!mediaType) {
        toast.error(`${file.name} must be an image or video`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} is larger than 10MB`);
        continue;
      }

      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
      const path = `gallery/${Date.now()}-${Math.random().toString(36).slice(2)}-${safeName}`;
      const { error: uploadError } = await supabase.storage.from("media").upload(path, file, { contentType: file.type });
      if (uploadError) {
        toast.error(`Upload failed: ${uploadError.message}`);
        continue;
      }

      const { data: urlData } = supabase.storage.from("media").getPublicUrl(path);
      const { error } = await supabase.from("gallery_items" as never).insert({
        title: title.trim() || file.name.replace(/\.[^/.]+$/, ""),
        media_url: urlData.publicUrl,
        media_type: mediaType,
        file_name: file.name,
        file_size: file.size,
        display_order: displayOrder,
        is_visible: isVisible,
      } as never);
      if (error) toast.error(`Could not save ${file.name}: ${error.message}`);
    }

    setUploading(false);
    setTitle("");
    if (fileRef.current) fileRef.current.value = "";
    qc.invalidateQueries({ queryKey: ["admin-gallery-items"] });
    qc.invalidateQueries({ queryKey: ["public-gallery-items"] });
    toast.success("Gallery upload complete");
  };

  const toggleVisibility = useMutation({
    mutationFn: async (item: GalleryItem) => {
      const { error } = await supabase.from("gallery_items" as never).update({ is_visible: !item.is_visible } as never).eq("id" as never, item.id as never);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-gallery-items"] });
      qc.invalidateQueries({ queryKey: ["public-gallery-items"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("gallery_items" as never).delete().eq("id" as never, id as never);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-gallery-items"] });
      qc.invalidateQueries({ queryKey: ["public-gallery-items"] });
      toast.success("Gallery item removed");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl text-foreground">Gallery</h2>
          <p className="text-sm text-muted-foreground mt-1">Upload salon images or videos up to 10MB for the public gallery section.</p>
        </div>
        <Card className="border-border/50 bg-card/90 lg:min-w-[520px]">
          <CardContent className="p-4 grid sm:grid-cols-[1fr_110px_auto] gap-3 items-end">
            <div>
              <Label>Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Optional title" />
            </div>
            <div>
              <Label>Order</Label>
              <Input type="number" value={displayOrder} onChange={(e) => setDisplayOrder(Number(e.target.value) || 0)} />
            </div>
            <div className="flex items-center gap-3 sm:pb-2">
              <Switch checked={isVisible} onCheckedChange={setIsVisible} />
              <span className="text-sm text-muted-foreground">Visible</span>
            </div>
            <input ref={fileRef} type="file" accept="image/*,video/*" multiple onChange={handleUpload} className="hidden" />
            <Button onClick={() => fileRef.current?.click()} disabled={uploading} className="sm:col-span-3 gap-2">
              {uploading ? <div className="animate-spin h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full" /> : <Upload className="h-4 w-4" />}
              {uploading ? "Uploading..." : "Upload Images / Videos"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading gallery...</p>
      ) : !items?.length ? (
        <div className="premium-surface p-12 text-center">
          <ImagePlus className="h-10 w-10 text-primary mx-auto mb-3" />
          <p className="font-medium text-foreground">No gallery uploads yet</p>
          <p className="text-sm text-muted-foreground mt-1">Upload your first salon image or video to replace the default gallery.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden border-border/50 bg-card/90 group">
              <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                {item.media_type === "video" ? (
                  <video src={item.media_url} className="h-full w-full object-cover" muted playsInline preload="metadata" />
                ) : (
                  <img src={item.media_url} alt={item.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                )}
                {item.media_type === "video" && <Play className="absolute left-3 top-3 h-8 w-8 text-primary drop-shadow" />}
              </div>
              <CardContent className="p-4 space-y-3">
                <div>
                  <p className="font-medium text-foreground truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.media_type} · {item.file_size ? `${(item.file_size / 1024 / 1024).toFixed(1)}MB` : "External"}</p>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <Button variant="outline" size="sm" onClick={() => toggleVisibility.mutate(item)} className="gap-2">
                    {item.is_visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    {item.is_visible ? "Visible" : "Hidden"}
                  </Button>
                  <ConfirmDelete onConfirm={() => remove.mutate(item.id)} isPending={remove.isPending} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageGallery;