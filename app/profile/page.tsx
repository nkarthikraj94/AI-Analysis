"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, User, Phone, Mail, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    gender: "",
  });

  const { data: profile, isLoading } = useQuery({
    queryKey: ["user-profile"],
    queryFn: () => fetch("/api/user/profile").then((res) => res.json()),
  });

  useEffect(() => {
    if (profile && !profile.error) {
      setFormData({
        name: profile.name || "",
        phone: profile.phone || "",
        gender: profile.gender || "",
      });
    }
  }, [profile]);

  const mutation = useMutation({
    mutationFn: (updates: typeof formData) =>
      fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      }).then((res) => res.json()),
    onSuccess: (data) => {
      if (data.error) {
        toast.error("Failed to update profile");
      } else {
        queryClient.invalidateQueries({ queryKey: ["user-profile"] });
        toast.success("Profile updated successfully!");
      }
    },
    onError: () => {
      toast.error("An error occurred. Please try again.");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  if (isLoading) return <div className="container mx-auto py-10 flex justify-center"><Loader2 className="animate-spin h-8 w-8" /></div>;

  return (
    <div className="container mx-auto py-10 px-4 max-w-2xl">
      <Card className="shadow-lg border-t-4 border-t-primary">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4">
            <User className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl font-extrabold">My Profile</CardTitle>
          <CardDescription>Manage your personal information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold flex items-center gap-2">
                <Mail className="h-4 w-4" /> Email Address (Not editable)
              </Label>
              <Input
                id="email"
                value={profile?.email || ""}
                disabled
                className="bg-muted cursor-not-allowed opacity-70"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold flex items-center gap-2">
                <User className="h-4 w-4" /> Full Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-semibold flex items-center gap-2">
                  <Phone className="h-4 w-4" /> Phone Number
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="1234567890"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender" className="text-sm font-semibold flex items-center gap-2">
                   Gender
                </Label>
                <select 
                  id="gender"
                  value={formData.gender} 
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>

            <Button type="submit" className="w-full h-11 text-lg font-bold" disabled={mutation.isPending}>
              {mutation.isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
              Save Profile Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
