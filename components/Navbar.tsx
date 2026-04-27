import { auth } from "@/auth";
import { Button } from "./ui/button";
import Link from "next/link";
import { signOut } from "@/auth";
import { LogoutButton } from "./LogoutButton";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between mx-auto px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold tracking-tighter">
            AI Analyzer
          </Link>
          {session && (
            <div className="hidden md:flex gap-4">
              <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                Dashboard
              </Link>
              <Link href="/complaints" className="text-sm font-medium hover:text-primary transition-colors">
                Complaints
              </Link>
              <Link href="/profile" className="text-sm font-medium hover:text-primary transition-colors">
                Profile
              </Link>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden sm:inline-block">
                {session.user?.email}
              </span>
              <LogoutButton />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register">Register</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
