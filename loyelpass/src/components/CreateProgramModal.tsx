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
import { Settings2, ChevronDown, ChevronUp, Plus } from "lucide-react";
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
        <Button className="h-9 gap-2 bg-primary hover:bg-primary/90 text-sm font-medium shadow-sm">
          <Plus className="h-4 w-4" />
          Create Program
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] border border-border/50 bg-background shadow-2xl">
        <DialogHeader className="pb-4 border-b border-border/50">
          <DialogTitle className="text-lg font-semibold tracking-tight">
            New Loyalty Program
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Configure rules for earning and redeeming points.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-5 py-4">
          <div className="grid gap-2">
            <Label
              htmlFor="name"
              className="text-xs uppercase font-medium tracking-wider text-muted-foreground"
            >
              Internal Name
            </Label>
            <Input
              id="name"
              placeholder="e.g. Summer Coffee Club"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="h-10 bg-secondary/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className="text-xs uppercase font-medium tracking-wider text-muted-foreground">
                Type
              </Label>
              <Select onValueChange={setRewardType} defaultValue={rewardType}>
                <SelectTrigger className="h-10 bg-secondary/20">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-secondary">
                  <SelectItem value="FREE_ITEM">Free Item</SelectItem>
                  <SelectItem value="DISCOUNT">Discount</SelectItem>
                  <SelectItem value="CUSTOM">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label
                htmlFor="value"
                className="text-xs uppercase font-medium tracking-wider text-muted-foreground"
              >
                {rewardType === "DISCOUNT" ? "Value (%)" : "Reward"}
              </Label>
              <Input
                id="value"
                type={rewardType === "DISCOUNT" ? "number" : "text"}
                placeholder={rewardType === "DISCOUNT" ? "10" : "Free Latte"}
                value={rewardValue}
                onChange={(e) => setRewardValue(e.target.value)}
                required
                className="h-10 bg-secondary/20"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label
              htmlFor="points"
              className="text-xs uppercase font-medium tracking-wider text-muted-foreground"
            >
              Threshold
            </Label>
            <div className="relative">
              <Input
                id="points"
                type="number"
                value={pointsThreshold}
                onChange={(e) => setPointsThreshold(e.target.value)}
                className="pl-24 h-10 bg-secondary/20"
                required
              />
              <span className="absolute left-3 top-2.5 text-xs font-mono text-muted-foreground">
                POINTS_REQ:
              </span>
            </div>
          </div>

          {/* Advanced Toggle */}
          <div className="border border-border/50 rounded-lg bg-secondary/10">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center justify-between w-full p-3 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <div className="flex items-center gap-2">
                <Settings2 className="h-3 w-3" />
                Advanced Logic
              </div>
              {showAdvanced ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </button>

            {showAdvanced && (
              <div className="px-3 pb-3 pt-0 animate-in slide-in-from-top-1">
                <div className="grid gap-2 pt-2 border-t border-border/50">
                  <Label className="text-[10px] uppercase text-muted-foreground mt-2">
                    Currency Multiplier
                  </Label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 relative">
                      <Input
                        value={pointsPerCurrency}
                        onChange={(e) => setPointsPerCurrency(e.target.value)}
                        type="number"
                        className="h-9 bg-background text-sm pr-12"
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-muted-foreground">
                        pts/unit
                      </span>
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    E.g. "10" means 100 MAD spent = 1000 points.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto bg-primary hover:bg-primary/90"
            >
              {loading ? "Creating..." : "Create Program"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
