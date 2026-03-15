import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Phone, Sparkles, Calendar } from "lucide-react";

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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Users className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-display font-bold text-foreground">Chatbot Leads</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Leads</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold text-foreground">{leads?.length ?? 0}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Today</CardTitle></CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">
              {leads?.filter(l => new Date(l.created_at).toDateString() === new Date().toDateString()).length ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">With Service Interest</CardTitle></CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">
              {leads?.filter(l => l.preferred_service).length ?? 0}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : !leads?.length ? (
            <div className="p-12 text-center text-muted-foreground">No leads captured yet. Leads will appear here when visitors interact with Glam Genie.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Service Interest</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>
                      <a href={`tel:${lead.phone}`} className="flex items-center gap-1 text-primary hover:underline">
                        <Phone className="h-3 w-3" /> {lead.phone}
                      </a>
                    </TableCell>
                    <TableCell>
                      {lead.preferred_service ? (
                        <Badge variant="secondary" className="gap-1"><Sparkles className="h-3 w-3" />{lead.preferred_service}</Badge>
                      ) : <span className="text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-muted-foreground">{lead.notes || "—"}</TableCell>
                    <TableCell className="text-muted-foreground whitespace-nowrap">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDate(lead.created_at)}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageLeads;
