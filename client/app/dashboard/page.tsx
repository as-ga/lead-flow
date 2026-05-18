"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { Lead, LeadFilters, LeadSource, LeadStatus } from "@/types";
import { useDebounce } from "@/lib/helpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LeadDialog } from "@/components/leads/lead-dialog";
import { DeleteLeadDialog } from "@/components/leads/delete-lead-dialog";
import {
  getStatusColor,
  getStatusLabel,
  getSourceLabel,
  formatDateShort,
  exportToCSV,
} from "@/lib/helpers";
import { Plus, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/store";
import Link from "next/link";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const [filters, setFilters] = useState<Partial<LeadFilters>>({
    page: 1,
    limit: 10,
  });
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<LeadStatus | null>(null);
  const [source, setSource] = useState<LeadSource | null>(null);
  const [sort, setSort] = useState<"latest" | "oldest">("latest");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);

  const debouncedSearch = useDebounce(search, 500);

  // Update filters when search/status/source/sort changes
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      page: 1,
      search: debouncedSearch || undefined,
      status: status || undefined,
      source: source || undefined,
      sort: sort,
    }));
  }, [debouncedSearch, status, source, sort]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["leads", filters],
    queryFn: async () => {
      return await apiClient.getLeads(filters);
    },
  });

  const handleCreateSuccess = async () => {
    setIsCreateDialogOpen(false);
    await refetch();
    toast.success("Lead created successfully!");
  };

  const handleEditClick = (lead: Lead) => {
    setSelectedLead(lead);
    setIsCreateDialogOpen(true);
  };

  const handleDeleteClick = (lead: Lead) => {
    setLeadToDelete(lead);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!leadToDelete) return;

    try {
      await apiClient.deleteLead(leadToDelete._id);
      toast.success("Lead deleted successfully!");
      setIsDeleteDialogOpen(false);
      setLeadToDelete(null);
      await refetch();
    } catch (error) {
      toast.error("Failed to delete lead");
    }
  };

  const handleExportCSV = () => {
    if (!data?.leads || data.leads.length === 0) {
      toast.error("No leads to export");
      return;
    }

    const exportData = data.leads.map((lead) => ({
      Name: lead.name,
      Email: lead.email,
      Status: getStatusLabel(lead.status),
      Source: getSourceLabel(lead.source),
      Remarks: lead.remarks || "-",
      "Created At": formatDateShort(lead.createdAt),
    }));

    exportToCSV(
      exportData,
      `leads-${new Date().toISOString().split("T")[0]}.csv`
    );
    toast.success("Leads exported as CSV!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
          <p className="text-muted-foreground">
            Manage and track your sales leads
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExportCSV} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button
            onClick={() => {
              setSelectedLead(null);
              setIsCreateDialogOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Lead
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="text-sm font-medium">
                Search by name or email
              </label>
              <Input
                placeholder="Search leads..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Status</label>
              <Select
                value={status || ""}
                onValueChange={(value) => setStatus(value as LeadStatus)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Source</label>
              <Select
                value={source || ""}
                onValueChange={(value) => setSource(value as LeadSource)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="All Sources" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Sort</label>
              <Select
                value={sort}
                onValueChange={(value) => setSort(value as "latest" | "oldest")}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Leads ({data?.meta.total || 0})
          </CardTitle>
          <CardDescription>
            Page {data?.meta.page || 1} of {data?.meta.pages || 1}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center py-8">
              <p className="text-destructive">Failed to load leads</p>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : data?.leads.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No leads found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Created</TableHead>
                    {user?.role === "admin" && (
                      <TableHead>Created By</TableHead>
                    )}
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.leads.map((lead) => (
                    <TableRow key={lead._id}>
                      <TableCell className="font-medium">{lead.name}</TableCell>
                      <TableCell>{lead.email}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(lead.status)}>
                          {getStatusLabel(lead.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>{getSourceLabel(lead.source)}</TableCell>
                      <TableCell>{formatDateShort(lead.createdAt)}</TableCell>
                      {user?.role === "admin" && (
                        <TableCell>
                          <Link
                            href={`/users/${lead.createdBy._id}`}
                            target="_blank"
                            className="text-sm text-primary hover:underline"
                          >
                            {lead.createdBy.name} ({lead.createdBy.email})
                          </Link>
                        </TableCell>
                      )}
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditClick(lead)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteClick(lead)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {data && data.meta.pages > 1 && (
            <div className="flex gap-2 justify-center mt-6">
              <Button
                variant="outline"
                disabled={data.meta.page === 1}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    page: Math.max(1, (prev.page || 1) - 1),
                  }))
                }
              >
                Previous
              </Button>
              <div className="flex items-center gap-2">
                {Array.from({ length: data.meta.pages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={data.meta.page === page ? "default" : "outline"}
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          page,
                        }))
                      }
                    >
                      {page}
                    </Button>
                  )
                )}
              </div>
              <Button
                variant="outline"
                disabled={data.meta.page === data.meta.pages}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    page: Math.min(data.meta.pages, (prev.page || 1) + 1),
                  }))
                }
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lead Dialog */}
      <LeadDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        lead={selectedLead}
        onSuccess={handleCreateSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteLeadDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        leadName={leadToDelete?.name}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
