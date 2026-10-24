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
import { Plus, Pencil, Crown } from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { formatINR } from "@/lib/campaign";
import type { Tables } from "@/integrations/supabase/types";

type KcPackage = Tables<"kc_packages">;

const emptyForm = {
  tier: "basic",
  display_name: "",
  price_inr: 0,
  inclusions_text: "",
  description: "",
  terms: "",
  image_url: "",
  display_order: 0,
  is_published: true,
};

const tierLabel: Record<string, string> = {
  basic: "Basic — Essential Glow",
  premium: "Premium — Signature Glow",
  luxury: "Luxury — Luxe Glow",
};

const ManagePackages = () => {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<KcPackage | null>(null);
  const [form, setForm] = useState(emptyForm);

  const { data: packages, isLoading } = useQuery({
    queryKey: ["admin-kc-packages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("kc_packages")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin-kc-packages"] });
    qc.invalidateQueries({ queryKey: ["kc-packages"] });
  };

  const upsert = useMutation({
    mutationFn: async (values: typeof form & { id?: string }) => {
      const { inclusions_text, ...rest } = values;
      const inclusions = inclusions_text
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
      const payload = { ...rest, inclusions };
      if (values.id) {
        const { error } = await supabase.from("kc_packages").update(payload).eq("id", values.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("kc_packages").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      invalidate();
      toast.success(editing ? "Package updated" : "Package created");
      closeDialog();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("kc_packages").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { invalidate(); toast.success("Package deleted"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const openCreate = () => { setEditing(null); setForm(emptyForm); setOpen(true); };
  const openEdit = (p: KcPackage) => {
    setEditing(p);
    setForm({
      tier: p.tier,
      display_name: p.display_name,
      price_inr: Number(p.price_inr),
      inclusions_text: (Array.isArray(p.inclusions) ? (p.inclusions as string[]) : []).join("\n"),
      description: p.description || "",
      terms: p.terms || "",
      image_url: p.image_url || "",
      display_order: p.display_order || 0,
      is_published: p.is_published,
    });
    setOpen(true);
  };
  const closeDialog = () => { setOpen(false); setEditing(null); };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.display_name.trim()) { toast.error("Display name is required"); return; }
    if (!Number(form.price_inr) || Number(form.price_inr) <= 0) { toast.error("Enter a valid price"); return; }
    upsert.mutate(editing ? { ...form, id: editing.id } : form);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl text-foreground">Karwa Chauth Packages</h2>
          <p className="text-sm text-muted-foreground mt-1">{packages?.length ?? 0} packages — prices shown exactly as configured</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" />Add Package</Button></DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? "Edit Package" : "New Package"}</DialogTitle></DialogHeader>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <Label>Tier</Label>
                <Select value={form.tier} onValueChange={(v) => setForm({ ...form, tier: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(tierLabel).map(([k, label]) => (
                      <SelectItem key={k} value={k}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Display Name</Label><Input value={form.display_name} onChange={(e) => setForm({ ...form, display_name: e.target.value })} required placeholder="e.g. The Essential Glow" /></div>
              <div>
                <Label>Price (₹, fixed)</Label>
                <Input type="number" min={1} value={form.price_inr} onChange={(e) => setForm({ ...form, price_inr: Number(e.target.value) || 0 })} required />
                <p className="text-[11px] text-muted-foreground mt-1">Shown as {formatINR(form.price_inr) || "—"} on the website. No discounts are applied to packages.</p>
              </div>
              <div>
                <Label>Included Services (one per line)</Label>
                <Textarea rows={6} value={form.inclusions_text} onChange={(e) => setForm({ ...form, inclusions_text: e.target.value })} placeholder={"Eyebrows\nUpper lips\nWax\nFacial\nHaircut / Head Massage"} />
              </div>
              <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div><Label>Terms &amp; Conditions</Label><Textarea rows={5} value={form.terms} onChange={(e) => setForm({ ...form, terms: e.target.value })} /></div>
              <div><Label>Image</Label><ImageUpload value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url })} folder="packages" /></div>
              <div><Label>Display Order</Label><Input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} /></div>
              <div className="flex items-center gap-2"><Switch checked={form.is_published} onCheckedChange={(v) => setForm({ ...form, is_published: v })} /><Label>Published</Label></div>
              <Button type="submit" className="w-full" disabled={upsert.isPending}>{upsert.isPending ? "Saving..." : "Save"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tier</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Inclusions</TableHead>
                <TableHead>Published</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8">Loading...</TableCell></TableRow>
              ) : packages?.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No packages yet.</TableCell></TableRow>
              ) : packages?.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs bg-primary/10 text-primary capitalize">
                      <Crown className="h-3 w-3" /> {p.tier}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">{p.display_name}</TableCell>
                  <TableCell className="tabular-nums">{formatINR(p.price_inr)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {(Array.isArray(p.inclusions) ? (p.inclusions as string[]) : []).length} services
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${p.is_published ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                      {p.is_published ? "Yes" : "Draft"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                    <ConfirmDelete onConfirm={() => remove.mutate(p.id)} isPending={remove.isPending} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagePackages;
