"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Search, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { encodeId } from "@/lib/utils/id";

export default function ComplaintsListPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["complaints", search, status, priority, page],
    queryFn: () => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (status) params.append("status", status);
      if (priority) params.append("priority", priority);
      params.append("page", page.toString());
      return fetch(`/api/complaints?${params.toString()}`).then((res) => res.json());
    },
  });

  const complaints = data?.complaints || [];
  const pagination = data?.pagination || { total: 0, pages: 1, currentPage: 1 };

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Complaints</h1>
        <Button asChild>
          <Link href="/complaints/new">
            <Plus className="mr-2 h-4 w-4" /> New Complaint
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search complaints..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="RESOLVED">Resolved</option>
          </select>
          <select 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="">All Priority</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          <div>Loading complaints...</div>
        ) : complaints.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">No complaints found.</div>
        ) : (
          complaints.map((complaint: any) => (
            <Card key={complaint.id} className="hover:border-primary/50 transition-colors">
              <Link href={`/complaints/${encodeId(complaint.id)}`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{complaint.title}</CardTitle>
                    <div className="flex gap-2">
                      <Badge variant={complaint.aiPriority === "HIGH" ? "destructive" : complaint.aiPriority === "MEDIUM" ? "warning" : "success"}>
                        {complaint.aiPriority}
                      </Badge>
                      <Badge variant={complaint.status === "RESOLVED" ? "success" : "outline"}>
                        {complaint.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-2">{complaint.aiSummary || complaint.description}</p>
                  <div className="mt-4 flex justify-between items-center text-xs text-muted-foreground">
                    <span>Category: {complaint.category}</span>
                    <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))
        )}
      </div>

      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setPage(page - 1)} 
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="flex items-center px-4 text-sm font-medium">
            Page {page} of {pagination.pages}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setPage(page + 1)} 
            disabled={page === pagination.pages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
