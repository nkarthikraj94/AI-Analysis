"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { AlertCircle, CheckCircle, Clock, ListFilter } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["complaints"],
    queryFn: () => fetch("/api/complaints").then((res) => res.json()),
  });

  if (isLoading) return <div className="container mx-auto py-10">Loading...</div>;

  const complaints = data?.complaints || [];
  
  const statusCounts = {
    PENDING: complaints.filter((c: any) => c.status === "PENDING").length,
    RESOLVED: complaints.filter((c: any) => c.status === "RESOLVED").length,
  };

  const priorityCounts = {
    HIGH: complaints.filter((c: any) => c.aiPriority === "HIGH").length,
    MEDIUM: complaints.filter((c: any) => c.aiPriority === "MEDIUM").length,
    LOW: complaints.filter((c: any) => c.aiPriority === "LOW").length,
  };

  const barData = {
    labels: ["High", "Medium", "Low"],
    datasets: [
      {
        label: "Priority Counts",
        data: [priorityCounts.HIGH, priorityCounts.MEDIUM, priorityCounts.LOW],
        backgroundColor: ["#ef4444", "#f59e0b", "#10b981"],
      },
    ],
  };

  const pieData = {
    labels: ["Pending", "Resolved"],
    datasets: [
      {
        data: [statusCounts.PENDING, statusCounts.RESOLVED],
        backgroundColor: ["#f59e0b", "#10b981"],
      },
    ],
  };

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complaints.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.PENDING}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.RESOLVED}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Priority Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={barData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center h-[300px]">
            <Pie data={pieData} options={{ maintainAspectRatio: false }} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
