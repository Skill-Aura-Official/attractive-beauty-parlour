import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Phone, Sparkles, Calendar, Download, MessageCircle, TrendingUp } from "lucide-react";
import { CONTACT_INFO } from "@/lib/constants";
import { toast } from "sonner";

const ManageLeads = () => {
  const { data: leads, isLoading } = useQuery({
    queryKey: ["chatbot-leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chatbot_leads")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
    });

  const exportCSV = () => {
    if (!leads?.length) {
      toast.error("No leads to export");
      return;
    }
    const headers = ["Name", "Phone", "Preferred Service", "Notes", "Date"];
    const rows = leads.map((l) => [
      l.name,
      l.phone,
      l.preferred_service || "",
      (l.notes || "").replace(/"/g, '""'),
      new Date(l.created_at).toISOString(),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chatbot-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${leads.length} leads`);
  };

  const todayCount = leads?.filter((l) => new Date(l.created_at).toDateString() === new Date().toDateString()).length ?? 0;
  const serviceCount = leads?.filter((l) => l.preferred_service).length ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-foreground">Chatbot Leads</h2>
            <p className="text-sm text-muted-foreground">Visitors who showed interest via Glam Genie</p>
          </div>
        </div>
        <Button onClick={exportCSV} variant="outline" size="sm" disabled={!leads?.length} className="gap-2 self-start">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Leads", value: leads?.length ?? 0, icon: Users, color: "text-primary" },
          { label: "Today", value: todayCount, icon: TrendingUp, color: "text-emerald-500" },
          { label: "Service Interest", value: serviceCount, icon: Sparkles, color: "text-amber-500" },
        ].map((stat) => (
          <Card key={stat.label} className="border-border/50">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`p-2.5 rounded-lg bg-muted ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card className="border-border/50 overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-lg" />
              ))}
            </div>
          ) : !leads?.length ? (
            <div className="p-16 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <MessageCircle className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-foreground font-medium mb-1">No leads yet</p>
              <p className="text-sm text-muted-foreground">Leads will appear here when visitors interact with Glam Genie.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="font-semibold">Name</TableHead>
                    <TableHead className="font-semibold">Phone</TableHead>
                    <TableHead className="font-semibold">Service</TableHead>
                    <TableHead className="font-semibold">Notes</TableHead>
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead) => (
                    <TableRow key={lead.id} className="group">
                      <TableCell className="font-medium text-foreground">{lead.name}</TableCell>
                      <TableCell>
                        <a href={`tel:${lead.phone}`} className="inline-flex items-center gap-1.5 text-primary hover:underline text-sm">
                          <Phone className="h-3.5 w-3.5" />
                          {lead.phone}
                        </a>
                      </TableCell>
                      <TableCell>
                        {lead.preferred_service ? (
                          <Badge variant="secondary" className="gap-1 text-xs">
                            <Sparkles className="h-3 w-3" />
                            {lead.preferred_service}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">—</span>
                        )}
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <p className="text-sm text-muted-foreground truncate">{lead.notes || "—"}</p>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(lead.created_at)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <a
                          href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}?text=Hi ${encodeURIComponent(lead.name)}, thank you for your interest in ${lead.preferred_service || "our services"} at Attractive Beauty Parlour! We'd love to help you book an appointment.`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="ghost" size="sm" className="gap-1.5 text-xs opacity-60 group-hover:opacity-100 transition-opacity">
                            <MessageCircle className="h-3.5 w-3.5" />
                            Follow up
                          </Button>
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageLeads;
