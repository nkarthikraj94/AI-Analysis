"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, ArrowLeft, CheckCircle, Trash2, Pencil, X, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { decodeId } from "@/lib/utils/id";

export default function ComplaintDetailPage() {
  const params = useParams();
  const id = decodeId(params.id as string);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editDescription, setEditDescription] = useState("");

  const { data: complaint, isLoading } = useQuery({
    queryKey: ["complaints", id],
    queryFn: () => fetch(`/api/complaints/${id}`).then((res) => res.json()),
  });

  useEffect(() => {
    if (complaint) {
      setEditDescription(complaint.description);
    }
  }, [complaint]);

  const mutation = useMutation({
    mutationFn: (updates: any) => 
      fetch(`/api/complaints/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      }).then((res) => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["complaints", id] });
      setIsEditing(false);
      toast.success("Complaint updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update complaint");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: () => fetch(`/api/complaints/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["complaints"] });
      toast.success("Complaint deleted successfully!");
      router.push("/complaints");
    },
    onError: () => {
      toast.error("Failed to delete complaint");
    }
  });

  const handleSave = () => {
    mutation.mutate({ description: editDescription });
  };

  if (isLoading) return <div className="container mx-auto py-10">Loading...</div>;
  if (!complaint || complaint.error) return <div className="container mx-auto py-10 text-center">Complaint not found.</div>;

  return (
    <div className="container mx-auto py-10 px-4 space-y-6 max-w-4xl">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/complaints">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Complaints
        </Link>
      </Button>

      <div className="flex justify-between items-start flex-wrap gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{complaint.title}</h1>
          <div className="flex gap-2 mt-2">
            <Badge variant={complaint.status === "RESOLVED" ? "success" : "outline"}>
              {complaint.status}
            </Badge>
            <Badge variant={complaint.aiPriority === "HIGH" ? "destructive" : complaint.aiPriority === "MEDIUM" ? "warning" : "success"}>
              Priority: {complaint.aiPriority}
            </Badge>
            <Badge variant="secondary">
              Category: {complaint.category}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          {!isEditing && (
            <>
              {complaint.status === "PENDING" && (
                <Button onClick={() => mutation.mutate({ status: "RESOLVED" })} disabled={mutation.isPending}>
                  <CheckCircle className="mr-2 h-4 w-4" /> Mark as Resolved
                </Button>
              )}
              
              <Button variant="outline" size="icon" onClick={() => setIsEditing(true)}>
                <Pencil className="h-4 w-4" />
              </Button>

              {/* Delete with Confirmation */}
              <div className="inline-flex gap-1 border rounded-lg p-1 bg-muted/50">
                <Button 
                  variant="destructive" 
                  size="icon" 
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete this complaint?")) {
                      deleteMutation.mutate();
                    }
                  }} 
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
          {isEditing && (
            <Button variant="outline" size="icon" onClick={() => setIsEditing(false)}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <Textarea 
                  value={editDescription} 
                  onChange={(e) => setEditDescription(e.target.value)} 
                  className="min-h-[200px] text-lg"
                  placeholder="Detailed description of your complaint..."
                />
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsEditing(false)} disabled={mutation.isPending}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={mutation.isPending}>
                    {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    Save Changes
                  </Button>
                </div>
              </>
            ) : (
              <p className="whitespace-pre-wrap text-lg leading-relaxed">{complaint.description}</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary flex items-center">
              <AlertCircle className="mr-2 h-5 w-5" /> AI Analysis
            </CardTitle>
            <CardDescription>Generated automatically</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-semibold uppercase text-muted-foreground">Sentiment</p>
              <p className="text-lg font-bold">{complaint.aiSentiment}</p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase text-muted-foreground">AI Summary</p>
              <p className="italic text-sm">{complaint.aiSummary || "No summary available."}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
