"use client";

import { useState } from "react";
import { Cake, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { updateBirthdayReward } from "@/app/[locale]/(dashboard)/business/actions";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface BirthdayConfigProps {
  initialPoints: number;
}

export function BirthdayConfig({ initialPoints }: BirthdayConfigProps) {
  const t = useTranslations("BusinessDashboard.birthday");
  const [points, setPoints] = useState(initialPoints);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await updateBirthdayReward(points);
      if (res.success) {
        toast.success(t("success_title"), {
          description: t("success_desc", { points }),
        });
      } else {
        toast.error(t("error_title"));
      }
    } catch (err) {
      toast.error(t("error_title"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border border-border/50 shadow-sm bg-card rounded-xl overflow-hidden h-fit">
      <CardHeader className="pb-3 border-b border-border/50 bg-secondary/5 pt-5 px-5 text-start">
        <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Cake className="w-4 h-4 text-pink-500" />
          {t("title")}
        </CardTitle>
        <CardDescription className="text-xs">
          {t("description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-5">
        <div className="flex gap-3 items-end">
          <div className="space-y-1.5 flex-1">
            <span className="text-xs font-medium text-muted-foreground">
              {t("points_label")}
            </span>
            <div className="relative">
              <Input
                type="number"
                min="0"
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
                className="pe-12 font-mono"
              />
              <span className="absolute end-3 top-2.5 text-xs text-muted-foreground font-medium">
                PTS
              </span>
            </div>
          </div>
          <Button
            onClick={handleSave}
            disabled={loading || points === initialPoints}
            className="shrink-0"
            size="icon"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground mt-3 leading-tight">
          {points > 0 ? t("active_message") : t("disabled_message")}
        </p>
      </CardContent>
    </Card>
  );
}
