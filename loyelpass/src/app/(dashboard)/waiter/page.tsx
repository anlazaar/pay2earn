"use client";

import { useState, useEffect, useMemo } from "react";
import QRCode from "qrcode";
import { Scanner } from "@yudiel/react-qr-scanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  RefreshCcw,
  ScanLine,
  CheckCircle2,
  Receipt,
  QrCode,
  Zap,
  Check,
  AlertCircle,
  Package,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface Product {
  id: string;
  name: string;
  price: number;
  points: number | null;
}

interface CartItem extends Product {
  qty: number;
}

export default function WaiterDashboard() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("new-sale");

  // --- DATA STATE ---
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // --- CART STATE ---
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customAmount, setCustomAmount] = useState("");

  // --- GENERATION STATE ---
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [loadingGen, setLoadingGen] = useState(false);

  // --- SCANNER STATE ---
  const [scanStatus, setScanStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");
  const [scanResult, setScanResult] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    fetchProducts();
  }, []);

  // 1. Fetch Products on Load
  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/waiters/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Failed to load products");
    } finally {
      setLoadingProducts(false);
    }
  };

  // 2. Cart Logic
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
    // Clear custom amount if adding real products to avoid confusion
    if (customAmount) setCustomAmount("");
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === productId ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const cartTotal = useMemo(() => {
    const productTotal = cart.reduce(
      (acc, item) => acc + Number(item.price) * item.qty,
      0
    );
    // Add custom amount if entered
    const custom = customAmount ? parseFloat(customAmount) : 0;
    return productTotal + custom;
  }, [cart, customAmount]);

  // 3. Generate QR
  const generateCode = async () => {
    if (cartTotal <= 0) return;
    setLoadingGen(true);
    setQrImage(null);

    // Prepare payload
    const payload = {
      amount: cartTotal,
      // If we have cart items, send them. If it's custom amount, send a dummy product description
      products:
        cart.length > 0
          ? cart.map((i) => ({
              id: i.id,
              name: i.name,
              qty: i.qty,
              price: i.price,
            }))
          : [{ name: "Custom Amount", price: cartTotal, qty: 1 }],
    };

    try {
      const res = await fetch("/api/purchases/generate", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed");
      const data = await res.json();

      const qrDataUrl = await QRCode.toDataURL(data.qrData, {
        width: 600,
        margin: 1,
        color: { dark: "#000000", light: "#FFFFFF" },
      });
      setQrImage(qrDataUrl);
    } catch (err) {
      alert("Error generating code");
    } finally {
      setLoadingGen(false);
    }
  };

  const resetGen = () => {
    setCart([]);
    setCustomAmount("");
    setQrImage(null);
  };

  // 4. Scanner Logic (Unchanged)
  const handleScanTicket = async (text: string) => {
    if (scanStatus !== "idle") return;
    if (text) {
      if (typeof navigator !== "undefined" && navigator.vibrate)
        navigator.vibrate(50);
      setScanStatus("processing");
      try {
        const res = await fetch("/api/waiters/validate-reward", {
          method: "POST",
          body: JSON.stringify({ qrData: text }),
        });
        const data = await res.json();
        if (res.ok) {
          setScanStatus("success");
          setScanResult(data);
          if (typeof navigator !== "undefined" && navigator.vibrate)
            navigator.vibrate([100, 50, 100]);
        } else {
          setScanStatus("error");
          setScanResult({ error: data.error });
          if (typeof navigator !== "undefined" && navigator.vibrate)
            navigator.vibrate(200);
        }
      } catch (err) {
        setScanStatus("error");
        setScanResult({ error: "Connection failed" });
      }
    }
  };

  const resetScan = () => {
    setScanStatus("idle");
    setScanResult(null);
  };

  if (!mounted) return null;

  return (
    <div className="max-w-md mx-auto h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50 bg-card">
        <div>
          <h1 className="text-lg font-bold tracking-tight">Staff Terminal</h1>
          <p className="text-xs text-muted-foreground">Logged in as Waiter</p>
        </div>
        <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
          <Zap className="w-4 h-4" />
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col overflow-hidden"
      >
        <div className="px-4 pt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="new-sale">New Sale</TabsTrigger>
            <TabsTrigger value="scan">Validate Reward</TabsTrigger>
          </TabsList>
        </div>

        {/* 🟢 TAB 1: PRODUCT POS */}
        <TabsContent
          value="new-sale"
          className="flex-1 flex flex-col overflow-hidden mt-2"
        >
          {!qrImage ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Product Grid (Scrollable) */}
              <ScrollArea className="flex-1 px-4">
                <div className="pb-32">
                  {" "}
                  {/* Padding for bottom fixed cart */}
                  {/* Custom Amount Input */}
                  <div className="mb-6 bg-secondary/20 p-4 rounded-xl border border-border/50">
                    <label className="text-xs font-semibold uppercase text-muted-foreground mb-2 block">
                      Custom Amount
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-mono text-muted-foreground">
                        $
                      </span>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={customAmount}
                        onChange={(e) => {
                          setCustomAmount(e.target.value);
                          if (e.target.value) setCart([]); // Reset cart if typing custom
                        }}
                        className="text-lg font-medium bg-background border-border"
                      />
                    </div>
                  </div>
                  {/* Menu Grid */}
                  <label className="text-xs font-semibold uppercase text-muted-foreground mb-3 block">
                    Menu Items
                  </label>
                  {loadingProducts ? (
                    <div className="flex justify-center py-10">
                      <RefreshCcw className="animate-spin text-muted-foreground" />
                    </div>
                  ) : products.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      No products found.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {products.map((product) => {
                        const inCart = cart.find((c) => c.id === product.id);
                        return (
                          <button
                            key={product.id}
                            onClick={() => addToCart(product)}
                            className={cn(
                              "relative flex flex-col items-start p-3 rounded-xl border transition-all text-left",
                              inCart
                                ? "bg-primary/5 border-primary/50 ring-1 ring-primary/20"
                                : "bg-card border-border hover:border-primary/30"
                            )}
                          >
                            <span className="font-semibold text-sm line-clamp-1 w-full">
                              {product.name}
                            </span>
                            <span className="text-xs text-muted-foreground mt-1">
                              ${Number(product.price).toFixed(2)}
                            </span>
                            {inCart && (
                              <Badge className="absolute top-2 right-2 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-primary text-[10px]">
                                {inCart.qty}
                              </Badge>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Bottom Cart Summary (Fixed) */}
              <div className="border-t border-border bg-card p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-10">
                {cart.length > 0 && (
                  <div className="flex gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-2 bg-secondary rounded-lg px-2 py-1 shrink-0 border border-border"
                      >
                        <span className="text-xs font-medium">{item.name}</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="h-5 w-5 flex items-center justify-center rounded-full bg-background hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-mono w-3 text-center">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => addToCart(item)}
                            className="h-5 w-5 flex items-center justify-center rounded-full bg-background hover:bg-primary/10 hover:text-primary"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Total Amount
                    </p>
                    <p className="text-2xl font-bold font-mono tracking-tight text-foreground">
                      ${cartTotal.toFixed(2)}
                    </p>
                  </div>
                  {cart.length > 0 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setCart([])}
                      className="h-8 w-8 text-muted-foreground"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <Button
                  onClick={generateCode}
                  disabled={cartTotal <= 0 || loadingGen}
                  className="w-full h-12 text-base font-medium shadow-lg shadow-primary/20"
                >
                  {loadingGen ? (
                    <RefreshCcw className="animate-spin mr-2 h-4 w-4" />
                  ) : (
                    <QrCode className="mr-2 h-4 w-4" />
                  )}
                  Generate QR Code
                </Button>
              </div>
            </div>
          ) : (
            // QR DISPLAY MODE (Similar to previous code)
            <div className="flex-1 flex flex-col items-center justify-center p-6 bg-white animate-in zoom-in-95 duration-200">
              <div className="w-full max-w-xs bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

                <div className="mb-6">
                  <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">
                    Scan to Collect
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    ${cartTotal.toFixed(2)}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
                  <img
                    src={qrImage}
                    alt="QR Code"
                    className="w-full h-auto mix-blend-multiply"
                  />
                </div>

                <div className="space-y-2 text-left">
                  <p className="text-xs text-gray-400 font-medium uppercase border-b border-gray-100 pb-2 mb-2">
                    Receipt Details
                  </p>
                  {cart.length > 0 ? (
                    cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-xs text-gray-600"
                      >
                        <span>
                          {item.qty}x {item.name}
                        </span>
                        <span>
                          ${(Number(item.price) * item.qty).toFixed(2)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Custom Amount</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>

              <Button
                variant="outline"
                onClick={resetGen}
                className="mt-8 min-w-[200px] border-gray-200 bg-transparent text-gray-900 hover:bg-gray-50"
              >
                <RefreshCcw className="mr-2 h-4 w-4" /> New Sale
              </Button>
            </div>
          )}
        </TabsContent>

        {/* 🟢 TAB 2: SCANNER (Unchanged logic, just keeping structure) */}
        <TabsContent value="scan" className="flex-1 mt-0 bg-black relative">
          <div className="absolute inset-0">
            {activeTab === "scan" && (
              <Scanner
                onScan={(res) => res[0] && handleScanTicket(res[0].rawValue)}
                styles={{ container: { height: "100%" } }}
                components={{ audio: false, torch: true }}
              />
            )}
          </div>
          {/* Overlay UI for Scanner Results... (Reuse previous scanner UI code here) */}
          {scanStatus !== "idle" && (
            <div className="absolute inset-0 z-20 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
              <div className="bg-background w-full p-6 rounded-xl text-center">
                {scanStatus === "success" ? (
                  <>
                    <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="font-bold text-lg mb-1">
                      {scanResult?.rewardName}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Client: {scanResult?.clientName}
                    </p>
                    <Button onClick={resetScan} className="w-full">
                      Next
                    </Button>
                  </>
                ) : scanStatus === "error" ? (
                  <>
                    <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                    <h3 className="font-bold text-lg mb-1">Invalid Ticket</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {scanResult?.error || "Error"}
                    </p>
                    <Button
                      onClick={resetScan}
                      variant="outline"
                      className="w-full"
                    >
                      Try Again
                    </Button>
                  </>
                ) : (
                  <RefreshCcw className="h-8 w-8 animate-spin mx-auto text-primary" />
                )}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
