"use client";

import { signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { toast } from "sonner";

export function LogoutButton() {
  const handleLogout = async () => {
    toast.success("Logout successful. See you soon!");
    // We delay slightly to allow the toast to be seen before redirect
    setTimeout(() => {
      signOut({ callbackUrl: "/" });
    }, 500);
  };

  return (
    <Button variant="outline" size="sm" onClick={handleLogout}>
      Sign Out
    </Button>
  );
}
