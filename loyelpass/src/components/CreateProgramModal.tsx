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
import { Settings2, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function CreateProgramModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [rewardType, setRewardType] = useState("FREE_ITEM");
  const [rewardValue, setRewardValue] = useState("");
  const [pointsThreshold, setPointsThreshold] = useState("100");
  const [pointsPerCurrency, setPointsPerCurrency] = useState("1");

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
          rewardValue:
            rewardType === "DISCOUNT" ? `${rewardValue}% OFF` : rewardValue,
          pointsThreshold: parseInt(pointsThreshold),
          pointsPerCurrency: parseFloat(pointsPerCurrency),
        }),
      });

      if (res.ok) {
        setOpen(false);
        router.refresh();
        setName("");
        setRewardValue("");
        setPointsThreshold("100");
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
        <Button className="gap-2 bg-primary hover:bg-primary/90">
          + Create New Program
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Loyalty Program</DialogTitle>
          <DialogDescription>
            Configure how your customers earn and burn points.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-5 py-4">
          {/* Basic Info */}
          <div className="grid gap-2">
            <Label htmlFor="name">Program Name</Label>
            <Input
              id="name"
              placeholder="e.g. VIP Coffee Club"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Reward Type</Label>
              <Select onValueChange={setRewardType} defaultValue={rewardType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FREE_ITEM">Free Item</SelectItem>
                  <SelectItem value="DISCOUNT">Discount</SelectItem>
                  <SelectItem value="CUSTOM">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="value">
                {rewardType === "DISCOUNT" ? "Percentage (%)" : "Reward Name"}
              </Label>
              <Input
                id="value"
                type={rewardType === "DISCOUNT" ? "number" : "text"}
                placeholder={rewardType === "DISCOUNT" ? "10" : "Free Latte"}
                value={rewardValue}
                onChange={(e) => setRewardValue(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="points">Points Needed to Redeem</Label>
            <div className="relative">
              <Input
                id="points"
                type="number"
                value={pointsThreshold}
                onChange={(e) => setPointsThreshold(e.target.value)}
                className="pl-20"
                required
              />
              <span className="absolute left-3 top-2.5 text-sm text-muted-foreground font-medium">
                Target:
              </span>
            </div>
          </div>

          {/* Advanced Section Toggle */}
          <div className="border rounded-lg p-3 bg-muted/20">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center justify-between w-full text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <div className="flex items-center gap-2">
                <Settings2 className="h-4 w-4" />
                Advanced Settings
              </div>
              {showAdvanced ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>

            {showAdvanced && (
              <div className="mt-4 space-y-4 animate-in slide-in-from-top-2">
                <div className="grid gap-2">
                  <Label className="text-xs uppercase text-muted-foreground">
                    Currency Conversion
                  </Label>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="h-10 px-3 text-sm">
                      1 Currency Unit
                    </Badge>
                    <span className="text-muted-foreground">=</span>
                    <div className="relative flex-1">
                      <Input
                        value={pointsPerCurrency}
                        onChange={(e) => setPointsPerCurrency(e.target.value)}
                        type="number"
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-muted-foreground">
                        Points
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Example: If set to 10, a $5 purchase gives 50 points.
                  </p>
                </div>
              </div>
            )}
          </div>

          <Button type="submit" disabled={loading} className="w-full mt-2">
            {loading ? "Configuring..." : "Launch Program"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
