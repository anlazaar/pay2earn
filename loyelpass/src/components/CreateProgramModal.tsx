"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CreateProgramModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [rewardType, setRewardType] = useState("FREE_ITEM");
  const [rewardValue, setRewardValue] = useState("");
  const [pointsThreshold, setPointsThreshold] = useState("100");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/loyalty-programs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          rewardType,
          rewardValue,
          pointsThreshold: parseInt(pointsThreshold),
          calculationMethod: "by_amount", // Default for now
        }),
      });

      if (res.ok) {
        setOpen(false);
        router.refresh(); // Reloads the page data to show the new program
        // Reset form
        setName("");
        setRewardValue("");
      } else {
        alert("Failed to create program");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>+ Create New Program</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Loyalty Program</DialogTitle>
          <DialogDescription>
            Define how your clients earn rewards.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Program Name</Label>
            <Input
              id="name"
              placeholder="e.g. Coffee Lovers"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label>Reward Type</Label>
            <Select onValueChange={setRewardType} defaultValue={rewardType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FREE_ITEM">Free Item</SelectItem>
                <SelectItem value="DISCOUNT">Discount (%)</SelectItem>
                <SelectItem value="CUSTOM">Custom Reward</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="value">Reward Value</Label>
            <Input
              id="value"
              placeholder="e.g. 1 Free Latte or 10%"
              value={rewardValue}
              onChange={(e) => setRewardValue(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="points">Points Needed</Label>
            <Input
              id="points"
              type="number"
              value={pointsThreshold}
              onChange={(e) => setPointsThreshold(e.target.value)}
              required
            />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Program"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
