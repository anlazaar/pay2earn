"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { UserPlus, Users } from "lucide-react";

export default function WaitersPage() {
  const [waiters, setWaiters] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWaiters();
  }, []);

  const fetchWaiters = async () => {
    const res = await fetch("/api/waiters");
    if (res.ok) setWaiters(await res.json());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/waiters", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormData({ name: "", email: "", password: "" });
        fetchWaiters();
      } else {
        alert("Failed to create waiter");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Staff Management
          </h2>
          <p className="text-muted-foreground">
            Add waiters who can generate QR codes.
          </p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Create Waiter Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" /> Add New Waiter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="waiter@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input
                  required
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating..." : "Create Account"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Waiter List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" /> Your Team
            </CardTitle>
          </CardHeader>
          <CardContent>
            {waiters.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No waiters added yet.
              </p>
            ) : (
              <div className="space-y-4">
                {waiters.map((waiter) => (
                  <div
                    key={waiter.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-secondary/20"
                  >
                    <div>
                      <p className="font-medium">{waiter.username}</p>
                      <p className="text-sm text-muted-foreground">
                        {waiter.email}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Added {new Date(waiter.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
