"use client";

import { useState } from "react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { DollarSign, QrCode, RefreshCcw } from "lucide-react";

export default function WaiterDashboard() {
  const [amount, setAmount] = useState("");
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    setLoading(true);
    setQrImage(null);

    try {
      const res = await fetch("/api/purchases/generate", {
        method: "POST",
        body: JSON.stringify({ amount: parseFloat(amount), products: [] }),
      });

      if (!res.ok) throw new Error("Failed to generate");

      const data = await res.json();

      // Convert data string to QR Data URL
      const qrDataUrl = await QRCode.toDataURL(data.qrData);
      setQrImage(qrDataUrl);
    } catch (error) {
      console.error(error);
      alert("Error generating code");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setAmount("");
    setQrImage(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 max-w-md mx-auto">
      <Card className="w-full shadow-xl border-2">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">New Sale</CardTitle>
          <p className="text-muted-foreground">
            Enter amount to generate points QR
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {!qrImage ? (
            <form onSubmit={generateCode} className="space-y-4">
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="0.00"
                  className="pl-10 text-2xl h-14"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  step="0.01"
                  min="0.01"
                  autoFocus
                />
              </div>
              <Button
                type="submit"
                className="w-full h-12 text-lg"
                disabled={loading || !amount}
              >
                {loading ? "Generating..." : "Generate QR Code"}
              </Button>
            </form>
          ) : (
            <div className="flex flex-col items-center animate-in zoom-in duration-300">
              <div className="bg-white p-4 rounded-xl shadow-inner border">
                <img
                  src={qrImage}
                  alt="Scan to Collect Points"
                  className="w-64 h-64"
                />
              </div>
              <p className="mt-4 text-center font-medium text-lg">
                Ask client to scan to collect points for <br />
                <span className="text-primary font-bold text-2xl">
                  ${amount}
                </span>
              </p>
            </div>
          )}
        </CardContent>

        {qrImage && (
          <CardFooter>
            <Button variant="outline" className="w-full gap-2" onClick={reset}>
              <RefreshCcw className="h-4 w-4" /> New Sale
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
