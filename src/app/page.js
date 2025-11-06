"use client";

import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Home Page / Dashboard
 *
 * Simple landing page for authenticated users.
 * Content to be expanded based on requirements.
 */
export default function Home() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Welcome, {session?.user?.username || "User"}</h1>
        <p className="text-muted-foreground">4Tracks Office Management System</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Employees</CardTitle>
            <CardDescription>Manage office employees and production staff</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/table?entity=employees" className="text-sm text-primary hover:underline">
              View Employees →
            </Link>
          </CardContent>
        </Card>

        {/* Add more quick access cards here as needed */}
      </div>
    </div>
  );
}
