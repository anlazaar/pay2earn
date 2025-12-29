"use client";

import { useState, useEffect, useMemo } from "react";
import QRCode from "qrcode";
import { Scanner } from "@yudiel/react-qr-scanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  RefreshCcw,
  CheckCircle2,
  QrCode,
  Zap,
  AlertCircle,
  Plus,
  Minus,
  Trash2,
  Calculator,
  ArrowLeft,
  Banknote,
  Coins,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

// Types
interface Product {
  id: string;
  name: string;
  price: number;
  points: number | null;
}

interface CartItem extends Product {
  qty: number;
  isCustom?: boolean; // Track if it was a manual entry
}

export default function WaiterDashboard() {
  const t = useTranslations("WaiterDashboard");
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("new-sale");

  // --- UI STATE ---
  // 'cart' = selecting items, 'checkout' = calculating change, 'qr' = showing code
  const [view, setView] = useState<"cart" | "checkout" | "qr">("cart");

  // --- DATA STATE ---
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // --- CART STATE ---
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customPriceInput, setCustomPriceInput] = useState("");

  // --- CHECKOUT STATE ---
  const [cashReceived, setCashReceived] = useState("");

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

  // 1. Fetch Products
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
  const addToCart = (product: Product, isCustom = false) => {
    setCart((prev) => {
      const existingId = isCustom ? `custom-${product.price}` : product.id;
      const existing = prev.find((item) => item.id === existingId);

      if (existing) {
        return prev.map((item) =>
          item.id === existingId ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [
        ...prev,
        { ...product, id: existingId, qty: 1, isCustom }, // Ensure unique ID for custom items
      ];
    });
  };

  const addCustomItem = () => {
    const price = parseFloat(customPriceInput);
    if (!price || price <= 0) return;

    addToCart(
      {
        id: `custom-${Date.now()}`, // Temporary ID
        name: t("sale.custom_amount"),
        price: price,
        points: null,
      },
      true
    );
    setCustomPriceInput("");
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === itemId ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const clearCart = () => {
    setCart([]);
    setCashReceived("");
    setView("cart");
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + Number(item.price) * item.qty, 0);
  }, [cart]);

  // 3. Checkout Calculations
  const changeDue = useMemo(() => {
    const cash = parseFloat(cashReceived) || 0;
    return cash - cartTotal;
  }, [cashReceived, cartTotal]);

  const handleExactCash = () => {
    setCashReceived(cartTotal.toString());
  };

  // 4. Generate QR
  const generateCode = async () => {
    if (cartTotal <= 0) return;
    setLoadingGen(true);

    // Prepare payload
    const payload = {
      amount: cartTotal,
      products: cart.map((i) => ({
        id: i.isCustom ? "custom" : i.id,
        name: i.name,
        qty: i.qty,
        price: i.price,
      })),
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
      setView("qr");
    } catch (err) {
      alert("Error generating code");
    } finally {
      setLoadingGen(false);
    }
  };

  const resetFlow = () => {
    setCart([]);
    setCashReceived("");
    setQrImage(null);
    setView("cart");
  };

  // 5. Scanner Logic (Unchanged)
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
        setScanResult({ error: t("scan.connection_error") });
      }
    }
  };

  const resetScan = () => {
    setScanStatus("idle");
    setScanResult(null);
  };

  if (!mounted) return null;

  return (
    <div className="max-w-md mx-auto h-screen flex flex-col bg-background text-start">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50 bg-card">
        <div>
          <h1 className="text-lg font-bold tracking-tight">
            {t("header.title")}
          </h1>
          <p className="text-xs text-muted-foreground">
            {t("header.subtitle")}
          </p>
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
            <TabsTrigger value="new-sale" onClick={() => setView("cart")}>
              {t("tabs.sale")}
            </TabsTrigger>
            <TabsTrigger value="scan">{t("tabs.scan")}</TabsTrigger>
          </TabsList>
        </div>

        {/* 🟢 TAB 1: PRODUCT POS & CALCULATOR */}
        <TabsContent
          value="new-sale"
          className="flex-1 flex flex-col overflow-hidden mt-2"
        >
          {/* VIEW 1: CART (Select Products) */}
          {view === "cart" && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <ScrollArea className="flex-1 px-4">
                <div className="pb-36">
                  {/* Custom Item Input */}
                  <div className="mb-6 bg-secondary/20 p-4 rounded-xl border border-border/50">
                    <label className="text-xs font-semibold uppercase text-muted-foreground mb-2 block">
                      {t("sale.add_custom")}
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={customPriceInput}
                        onChange={(e) => setCustomPriceInput(e.target.value)}
                        className="text-lg font-medium bg-background border-border text-start"
                      />
                      <Button
                        onClick={addCustomItem}
                        size="icon"
                        className="shrink-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Menu Grid */}
                  <label className="text-xs font-semibold uppercase text-muted-foreground mb-3 block">
                    {t("sale.menu_items")}
                  </label>
                  {loadingProducts ? (
                    <div className="flex justify-center py-10">
                      <RefreshCcw className="animate-spin text-muted-foreground" />
                    </div>
                  ) : products.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      {t("sale.no_products")}
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
                              "relative flex flex-col items-start p-3 rounded-xl border transition-all text-start",
                              inCart
                                ? "bg-primary/5 border-primary/50 ring-1 ring-primary/20"
                                : "bg-card border-border hover:border-primary/30"
                            )}
                          >
                            <span className="font-semibold text-sm line-clamp-1 w-full">
                              {product.name}
                            </span>
                            <span className="text-xs text-muted-foreground mt-1">
                              {Number(product.price).toFixed(2)}{" "}
                              {t("sale.currency")}
                            </span>
                            {inCart && (
                              <Badge className="absolute top-2 end-2 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-primary text-[10px]">
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

              {/* Sticky Cart Summary */}
              <div className="border-t border-border bg-card p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-10">
                {cart.length > 0 ? (
                  <>
                    {/* Horizontal Cart List */}
                    <div className="flex gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar">
                      {cart.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-2 bg-secondary rounded-lg px-2 py-1 shrink-0 border border-border"
                        >
                          <span className="text-xs font-medium max-w-[80px] truncate">
                            {item.name}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {(item.price * item.qty).toFixed(0)}
                          </span>
                          <div className="flex items-center gap-1 border-s border-border ps-1 ms-1">
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="h-5 w-5 flex items-center justify-center rounded-full hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-mono w-3 text-center">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => addToCart(item, item.isCustom)}
                              className="h-5 w-5 flex items-center justify-center rounded-full hover:bg-primary/10 hover:text-primary"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {t("sale.total_amount")}
                        </p>
                        <p className="text-2xl font-bold font-mono tracking-tight text-foreground">
                          {cartTotal.toFixed(2)} {t("sale.currency")}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={clearCart}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Go to Checkout Calculator */}
                    <Button
                      onClick={() => setView("checkout")}
                      className="w-full h-12 text-base shadow-lg shadow-primary/20"
                    >
                      <Calculator className="me-2 h-4 w-4 rtl:ml-2" />
                      {t("sale.checkout_btn")}
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-2 text-sm text-muted-foreground">
                    {t("sale.cart_empty")}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VIEW 2: CHECKOUT CALCULATOR */}
          {view === "checkout" && (
            <div className="flex-1 flex flex-col bg-background animate-in slide-in-from-right-10 duration-200">
              {/* Calc Header */}
              <div className="flex items-center gap-2 p-4 border-b border-border/50">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setView("cart")}
                >
                  <ArrowLeft className="h-5 w-5 rtl:rotate-180" />
                </Button>
                <h2 className="font-semibold">{t("checkout.title")}</h2>
              </div>

              <div className="flex-1 p-6 flex flex-col gap-6">
                {/* Total Display */}
                <div className="bg-primary/5 rounded-2xl p-6 text-center border border-primary/10">
                  <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">
                    {t("checkout.total_due")}
                  </p>
                  <p className="text-4xl font-bold text-foreground font-mono">
                    {cartTotal.toFixed(2)}{" "}
                    <span className="text-lg text-muted-foreground">
                      {t("sale.currency")}
                    </span>
                  </p>
                </div>

                {/* Cash Input */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {t("checkout.cash_received")}
                    </label>
                    <div className="relative">
                      <Banknote className="absolute top-3 start-3 h-5 w-5 text-muted-foreground" />
                      <Input
                        type="number"
                        className="ps-10 h-12 text-xl font-mono"
                        placeholder="0.00"
                        autoFocus
                        value={cashReceived}
                        onChange={(e) => setCashReceived(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Quick Cash Buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleExactCash}
                      className="flex-1 text-xs"
                    >
                      {t("checkout.exact_cash")}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCashReceived("50")}
                      className="flex-1 font-mono text-xs"
                    >
                      50
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCashReceived("100")}
                      className="flex-1 font-mono text-xs"
                    >
                      100
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCashReceived("200")}
                      className="flex-1 font-mono text-xs"
                    >
                      200
                    </Button>
                  </div>
                </div>

                {/* Change Result */}
                <div
                  className={cn(
                    "flex-1 rounded-2xl p-6 flex flex-col items-center justify-center border transition-colors",
                    changeDue < 0
                      ? "bg-destructive/5 border-destructive/20"
                      : "bg-emerald-500/5 border-emerald-500/20"
                  )}
                >
                  <Coins
                    className={cn(
                      "h-8 w-8 mb-2",
                      changeDue < 0 ? "text-destructive" : "text-emerald-600"
                    )}
                  />
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {t("checkout.change_due")}
                  </p>
                  <p
                    className={cn(
                      "text-3xl font-bold font-mono",
                      changeDue < 0 ? "text-destructive" : "text-emerald-600"
                    )}
                  >
                    {changeDue < 0 ? "-" : ""}
                    {Math.abs(changeDue).toFixed(2)}
                  </p>
                  {changeDue < 0 && (
                    <p className="text-xs text-destructive mt-2">
                      {t("checkout.insufficient")}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-4 bg-card border-t border-border">
                <Button
                  className="w-full h-12 text-base shadow-lg"
                  onClick={generateCode}
                  disabled={loadingGen || changeDue < 0}
                >
                  {loadingGen ? (
                    <RefreshCcw className="animate-spin me-2" />
                  ) : (
                    <QrCode className="me-2" />
                  )}
                  {t("checkout.generate_qr")}
                </Button>
              </div>
            </div>
          )}

          {/* VIEW 3: QR CODE DISPLAY */}
          {view === "qr" && (
            <div className="flex-1 flex flex-col items-center justify-center p-6 bg-white animate-in zoom-in-95 duration-200 text-start">
              <div className="w-full max-w-xs bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                <div className="mb-6">
                  <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">
                    {t("qr.scan_prompt")}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {cartTotal.toFixed(2)} {t("sale.currency")}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
                  <img
                    src={qrImage!}
                    alt="QR Code"
                    className="w-full h-auto mix-blend-multiply"
                  />
                </div>
                <div className="space-y-2 text-start">
                  <p className="text-xs text-gray-400 font-medium uppercase border-b border-gray-100 pb-2 mb-2">
                    {t("qr.receipt_details")}
                  </p>
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between text-xs text-gray-600"
                    >
                      <span>
                        {item.qty}x {item.name}
                      </span>
                      <span>{(Number(item.price) * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Button
                variant="outline"
                onClick={resetFlow}
                className="mt-8 min-w-[200px] border-gray-200 bg-transparent text-gray-900 hover:bg-gray-50"
              >
                <RefreshCcw className="me-2 h-4 w-4 rtl:ml-2" />{" "}
                {t("qr.new_sale_btn")}
              </Button>
            </div>
          )}
        </TabsContent>

        {/* 🟢 TAB 2: SCANNER (Unchanged) */}
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
                      {t("scan.success_client", {
                        name: scanResult?.clientName || "Unknown",
                      })}
                    </p>
                    <Button onClick={resetScan} className="w-full">
                      {t("scan.next_btn")}
                    </Button>
                  </>
                ) : scanStatus === "error" ? (
                  <>
                    <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                    <h3 className="font-bold text-lg mb-1">
                      {t("scan.invalid_title")}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {scanResult?.error || "Error"}
                    </p>
                    <Button
                      onClick={resetScan}
                      variant="outline"
                      className="w-full"
                    >
                      {t("scan.try_again")}
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
