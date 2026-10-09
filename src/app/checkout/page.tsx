"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { coupons, formatINR, FREE_SHIPPING_THRESHOLD, indianStates, shippingCost, shippingMethods, type ShippingMethod } from "@/lib/catalog";
import { paymentLabels, useStore, type Address, type PaymentMethod } from "@/lib/store";
import { isPhone, isPincode } from "@/lib/validate";
import { Field, inputCls, Spinner } from "@/components/ui";

const steps = [
  { id: 1, label: "Shipping Address" },
  { id: 2, label: "Payment" },
  { id: 3, label: "Review Order" },
  { id: 4, label: "Order Placed" },
];

const banks = ["State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Mahindra Bank", "Bank of Baroda", "Punjab National Bank", "Canara Bank"];
const wallets = ["Amazon Pay", "PhonePe", "Paytm"];
const COD_LIMIT = 5000;

type AddressForm = Omit<Address, "id" | "isDefault">;
const emptyAddress: AddressForm = { label: "Home", name: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "" };

function validateAddress(a: AddressForm) {
  const e: Partial<Record<keyof AddressForm, string>> = {};
  if (a.name.trim().length < 2) e.name = "Please enter the full name.";
  if (!isPhone(a.phone)) e.phone = "Enter a valid 10-digit mobile number.";
  if (a.line1.trim().length < 5) e.line1 = "Please enter house no. and street.";
  if (a.city.trim().length < 2) e.city = "Please enter a city.";
  if (!a.state) e.state = "Please select a state.";
  if (!isPincode(a.pincode)) e.pincode = "Enter a valid 6-digit pincode.";
  return e;
}

function RadioDot({ active }: { active: boolean }) {
  return (
    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${active ? "border-[#e91e8c]" : "border-gray-300"}`}>
      {active && <div className="w-2 h-2 rounded-full bg-[#e91e8c]" />}
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { ready, user, cart, subtotal, addresses, couponCode, couponDiscount, couponError, applyCoupon, removeCoupon, placeOrder } = useStore();

  const [addr, setAddr] = useState<AddressForm>(emptyAddress);
  const [touched, setTouched] = useState(false);
  const [savedOpen, setSavedOpen] = useState(false);
  const [selectedSaved, setSelectedSaved] = useState<string | null>(null);
  const [shipping, setShipping] = useState<ShippingMethod>("standard");
  const [payment, setPayment] = useState<PaymentMethod>("upi");
  const [upiId, setUpiId] = useState("");
  const [bank, setBank] = useState("");
  const [wallet, setWallet] = useState("");
  const [saveAddress, setSaveAddress] = useState(true);
  const [couponOpen, setCouponOpen] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [couponMsg, setCouponMsg] = useState("");
  const [phase, setPhase] = useState<"details" | "review" | "paying">("details");
  const [placing, setPlacing] = useState(false);

  // Gate: sign-in required, cart must not be empty.
  useEffect(() => {
    if (!ready || placing) return;
    if (!user) router.replace("/login?next=/checkout");
    else if (cart.length === 0) router.replace("/cart");
  }, [ready, user, cart.length, router, placing]);

  // Prefill the default saved address once.
  const defaultAddr = addresses.find((a) => a.isDefault) ?? addresses[0];
  const [prefilled, setPrefilled] = useState(false);
  if (ready && !prefilled && (defaultAddr || user)) {
    setPrefilled(true);
    if (defaultAddr) {
      const { id, isDefault: _d, ...rest } = defaultAddr;
      void _d;
      setAddr({ ...emptyAddress, ...rest });
      setSelectedSaved(id);
      setSaveAddress(false);
    } else if (user) {
      setAddr((a) => ({ ...a, name: user.name, phone: user.phone }));
    }
  }

  const errors = useMemo(() => validateAddress(addr), [addr]);
  const addressValid = Object.keys(errors).length === 0;
  const paymentError = (() => {
    if (payment === "upi" && !/^[\w.-]{2,}@[a-zA-Z]{2,}$/.test(upiId.trim())) return "Enter a valid UPI ID (e.g. name@okaxis).";
    if (payment === "netbanking" && !bank) return "Please choose your bank.";
    if (payment === "wallet" && !wallet) return "Please choose a wallet.";
    return "";
  })();

  const shippingFee = shippingCost(shipping, subtotal);
  const total = subtotal + shippingFee - couponDiscount;
  const codBlocked = total > COD_LIMIT;
  const itemCount = cart.reduce((s, i) => s + i.qty, 0);
  const activeStep = phase === "details" ? (addressValid ? 2 : 1) : 3;

  const set = (k: keyof AddressForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setAddr((a) => ({ ...a, [k]: k === "pincode" ? e.target.value.replace(/\D/g, "").slice(0, 6) : e.target.value }));
    setSelectedSaved(null);
  };

  const chooseSaved = (a: Address) => {
    const { id, isDefault: _d, ...rest } = a;
    void _d;
    setAddr({ ...emptyAddress, ...rest });
    setSelectedSaved(id);
    setSaveAddress(false);
    setSavedOpen(false);
  };

  const submitCoupon = () => {
    if (!coupon.trim()) return;
    const r = applyCoupon(coupon);
    setCouponMsg(r.ok ? "" : r.error);
    if (r.ok) setCoupon("");
  };

  const paymentDetail = () => {
    if (payment === "upi") return `UPI (${upiId.trim()})`;
    if (payment === "netbanking") return `Net Banking (${bank})`;
    if (payment === "wallet") return `Wallet (${wallet})`;
    if (payment === "card") return "Credit / Debit Card";
    return "Cash on Delivery";
  };

  const goToReview = () => {
    setTouched(true);
    if (!addressValid) { document.getElementById("shipping-address")?.scrollIntoView({ behavior: "smooth" }); return; }
    if (paymentError || (payment === "cod" && codBlocked)) { document.getElementById("payment-method")?.scrollIntoView({ behavior: "smooth" }); return; }
    setPhase("review");
  };

  const confirmOrder = () => {
    setPhase("paying");
    setPlacing(true);
    // Simulated payment gateway round-trip.
    setTimeout(() => {
      const order = placeOrder({ address: addr, saveAddress: saveAddress && !selectedSaved, shippingMethod: shipping, payment: { method: payment, detail: paymentDetail() } });
      router.push(`/order-confirmation?id=${order.id}`);
    }, payment === "cod" ? 900 : 1800);
  };

  if (!ready || !user || (cart.length === 0 && !placing)) return <Spinner label="Preparing checkout…" />;

  const err = (k: keyof AddressForm) => (touched ? errors[k] : undefined);
  const fieldCls = (k: keyof AddressForm) => `${inputCls} ${err(k) ? "border-red-300" : ""}`;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Progress Steps */}
        <div className="flex items-start justify-center mb-8 gap-0 overflow-x-auto">
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-start">
              <div className="flex flex-col items-center" style={{ minWidth: 80 }}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-sm border-2 transition-colors ${
                  step.id <= activeStep ? "bg-[#e91e8c] border-[#e91e8c] text-white" : "bg-white border-gray-300 text-gray-400"
                }`}>
                  {step.id < activeStep ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                  ) : step.id}
                </div>
                <span className={`text-xs font-semibold mt-1.5 text-center leading-tight ${step.id <= activeStep ? "text-[#e91e8c]" : "text-gray-400"}`}>{step.label}</span>
                {step.id === activeStep && <div className="h-0.5 w-12 bg-[#e91e8c] rounded-full mt-1" />}
              </div>
              {i < steps.length - 1 && (
                <div className={`h-0.5 w-8 sm:w-16 mt-[18px] mx-0 transition-colors ${step.id < activeStep ? "bg-[#e91e8c]" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">

          {/* ── LEFT COLUMN ── */}
          <div className="space-y-5">

            {/* ① Shipping Address */}
            <div id="shipping-address" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 scroll-mt-32">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#e91e8c] flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h2 className="font-black text-[#1a1a2e] text-lg">Shipping Address</h2>
                </div>
                {addresses.length > 0 && (
                  <div className="relative flex items-center gap-1.5 text-sm text-gray-400 flex-wrap">
                    <span>Already have an address?</span>
                    <button type="button" onClick={() => setSavedOpen((o) => !o)} className="text-[#e91e8c] font-semibold flex items-center gap-0.5 hover:underline" aria-expanded={savedOpen}>
                      Select from saved addresses
                      <svg className={`w-3.5 h-3.5 transition-transform ${savedOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {savedOpen && (
                      <div className="absolute right-0 top-7 z-20 w-80 max-w-[85vw] bg-white rounded-2xl border border-gray-100 shadow-xl p-2">
                        {addresses.map((a) => (
                          <button key={a.id} type="button" onClick={() => chooseSaved(a)}
                            className={`w-full text-left p-3 rounded-xl hover:bg-[#fff0f7] transition-colors ${selectedSaved === a.id ? "bg-[#fff0f7]" : ""}`}>
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-sm font-bold text-[#1a1a2e]">{a.label}</span>
                              {a.isDefault && <span className="text-[10px] font-bold bg-[#e91e8c] text-white px-1.5 py-0.5 rounded">Default</span>}
                            </div>
                            <div className="text-xs text-gray-500 leading-snug">{a.name}, {a.line1}{a.line2 ? `, ${a.line2}` : ""}, {a.city} - {a.pincode}</div>
                          </button>
                        ))}
                        <button type="button" onClick={() => { setAddr({ ...emptyAddress, name: user.name, phone: user.phone }); setSelectedSaved(null); setSaveAddress(true); setSavedOpen(false); }}
                          className="w-full text-left p-3 rounded-xl text-sm font-bold text-[#e91e8c] hover:bg-[#fff0f7]">
                          + Use a new address
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Full Name" required error={err("name")}>
                    <input type="text" autoComplete="name" value={addr.name} onChange={set("name")} placeholder="Enter full name" className={fieldCls("name")} />
                  </Field>
                  <Field label="Phone Number" required error={err("phone")}>
                    <input type="tel" autoComplete="tel" value={addr.phone} onChange={set("phone")} placeholder="Enter phone number" className={fieldCls("phone")} />
                  </Field>
                </div>
                <Field label="Address" required error={err("line1")}>
                  <input type="text" autoComplete="address-line1" value={addr.line1} onChange={set("line1")} placeholder="House No, Building Name, Street Name" className={fieldCls("line1")} />
                </Field>
                <Field label="Area / Landmark">
                  <input type="text" autoComplete="address-line2" value={addr.line2 ?? ""} onChange={set("line2")} placeholder="Area, locality or landmark (optional)" className={inputCls} />
                </Field>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Field label="City" required error={err("city")}>
                    <input type="text" autoComplete="address-level2" value={addr.city} onChange={set("city")} placeholder="Enter city" className={fieldCls("city")} />
                  </Field>
                  <Field label="State" required error={err("state")}>
                    <div className="relative">
                      <select value={addr.state} onChange={set("state")} className={`${fieldCls("state")} appearance-none pr-8`}>
                        <option value="">Select state</option>
                        {indianStates.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <svg className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </Field>
                  <Field label="Pincode" required error={err("pincode")}>
                    <input type="text" inputMode="numeric" autoComplete="postal-code" value={addr.pincode} onChange={set("pincode")} placeholder="Enter pincode" className={fieldCls("pincode")} />
                  </Field>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold text-gray-500 mr-1">Save as:</span>
                  {(["Home", "Work", "Other"] as const).map((l) => (
                    <button key={l} type="button" onClick={() => setAddr((a) => ({ ...a, label: l }))}
                      className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-colors ${addr.label === l ? "bg-[#e91e8c] text-white border-[#e91e8c]" : "border-gray-200 text-gray-600 hover:border-[#e91e8c]"}`}>
                      {l}
                    </button>
                  ))}
                </div>
                {!selectedSaved && (
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input type="checkbox" checked={saveAddress} onChange={() => setSaveAddress((v) => !v)} className="w-4 h-4 rounded accent-[#e91e8c]" />
                    <span className="text-sm text-gray-600">Save this address for future orders</span>
                  </label>
                )}
              </div>
            </div>

            {/* ② Shipping Method */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${addressValid ? "bg-[#e91e8c]" : "bg-gray-200"}`}>
                  <span className={`font-black text-sm ${addressValid ? "text-white" : "text-gray-500"}`}>2</span>
                </div>
                <div>
                  <h2 className="font-black text-[#1a1a2e] text-lg">Shipping Method</h2>
                  <p className="text-xs text-gray-400">Choose a delivery option</p>
                </div>
              </div>

              <div className="space-y-3">
                {(Object.keys(shippingMethods) as ShippingMethod[]).map((m) => {
                  const fee = shippingCost(m, subtotal);
                  return (
                    <label key={m} className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-colors ${shipping === m ? "border-[#e91e8c] bg-[#fff0f7]" : "border-gray-200 hover:border-gray-300"}`}>
                      <div className="flex items-center gap-3">
                        <RadioDot active={shipping === m} />
                        <div>
                          <div className="font-bold text-[#1a1a2e] text-sm">{shippingMethods[m].label}</div>
                          <div className="text-xs text-gray-400">{shippingMethods[m].eta}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-black ${fee === 0 ? "text-[#4caf50]" : "text-[#1a1a2e]"}`}>
                          {fee === 0 ? <><span className="line-through text-gray-300 text-sm mr-1">{formatINR(shippingMethods[m].price)}</span>FREE</> : formatINR(fee)}
                        </div>
                        {m === "standard" && <div className="text-xs text-[#4caf50] font-semibold">Free on orders above {formatINR(FREE_SHIPPING_THRESHOLD)}</div>}
                      </div>
                      <input type="radio" name="shipping" value={m} checked={shipping === m} onChange={() => setShipping(m)} className="sr-only" />
                    </label>
                  );
                })}
              </div>
            </div>

            {/* ③ Payment Method */}
            <div id="payment-method" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 scroll-mt-32">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-full bg-[#e91e8c] flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                </div>
                <div>
                  <h2 className="font-black text-[#1a1a2e] text-lg">Payment Method</h2>
                  <p className="text-xs text-gray-400">Choose a secure payment option</p>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {/* UPI */}
                <div>
                  <label className="flex items-center justify-between py-4 cursor-pointer gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <RadioDot active={payment === "upi"} />
                      <div className="min-w-0">
                        <div className="font-bold text-[#1a1a2e] text-sm">UPI (Google Pay, PhonePe, Paytm, etc.)</div>
                        <div className="text-xs text-gray-400">Pay easily using UPI</div>
                      </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-1 shrink-0">
                      <span className="text-[10px] font-black text-[#4285f4] border border-gray-200 px-1.5 py-0.5 rounded bg-white">G Pay</span>
                      <span className="text-[10px] font-black bg-[#5f259f] text-white px-1.5 py-0.5 rounded">Pe</span>
                      <span className="text-[10px] font-black bg-[#002970] text-white px-1.5 py-0.5 rounded">Paytm</span>
                      <span className="text-[10px] font-black bg-[#00579f] text-white px-1.5 py-0.5 rounded">BHIM</span>
                    </div>
                    <input type="radio" name="payment" value="upi" checked={payment === "upi"} onChange={() => setPayment("upi")} className="sr-only" />
                  </label>
                  {payment === "upi" && (
                    <div className="pb-4 pl-7">
                      <input value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="Enter UPI ID (e.g. priya@okaxis)" className={`${inputCls} ${touched && paymentError ? "border-red-300" : ""}`} />
                      {touched && paymentError && <p className="text-xs text-red-500 font-semibold mt-1">{paymentError}</p>}
                    </div>
                  )}
                </div>

                {/* Card */}
                <div>
                  <label className="flex items-center justify-between py-4 cursor-pointer gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <RadioDot active={payment === "card"} />
                      <div className="min-w-0">
                        <div className="font-bold text-[#1a1a2e] text-sm">Credit / Debit Card</div>
                        <div className="text-xs text-gray-400">Visa, Mastercard, RuPay</div>
                      </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] font-black text-[#1a1f71] border border-gray-200 px-1.5 py-0.5 rounded italic bg-white">VISA</span>
                      <span className="flex items-center"><span className="w-4 h-4 rounded-full bg-[#eb001b] inline-block" /><span className="w-4 h-4 rounded-full bg-[#f79e1b] inline-block -ml-2 opacity-90" /></span>
                      <span className="text-[10px] font-black text-[#1a1a2e] border border-gray-200 px-1.5 py-0.5 rounded bg-white">RuPay</span>
                    </div>
                    <input type="radio" name="payment" value="card" checked={payment === "card"} onChange={() => setPayment("card")} className="sr-only" />
                  </label>
                  {payment === "card" && (
                    <p className="pb-4 pl-7 text-xs text-gray-500">🔒 You&apos;ll enter your card details securely on the payment gateway after reviewing your order.</p>
                  )}
                </div>

                {/* Net Banking */}
                <div>
                  <label className="flex items-center justify-between py-4 cursor-pointer gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <RadioDot active={payment === "netbanking"} />
                      <div className="min-w-0">
                        <div className="font-bold text-[#1a1a2e] text-sm">Net Banking</div>
                        <div className="text-xs text-gray-400">All major banks</div>
                      </div>
                    </div>
                    <svg className="w-6 h-6 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>
                    <input type="radio" name="payment" value="netbanking" checked={payment === "netbanking"} onChange={() => setPayment("netbanking")} className="sr-only" />
                  </label>
                  {payment === "netbanking" && (
                    <div className="pb-4 pl-7">
                      <select value={bank} onChange={(e) => setBank(e.target.value)} className={`${inputCls} ${touched && paymentError ? "border-red-300" : ""}`}>
                        <option value="">Select your bank</option>
                        {banks.map((b) => <option key={b}>{b}</option>)}
                      </select>
                      {touched && paymentError && <p className="text-xs text-red-500 font-semibold mt-1">{paymentError}</p>}
                    </div>
                  )}
                </div>

                {/* Wallets */}
                <div>
                  <label className="flex items-center justify-between py-4 cursor-pointer gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <RadioDot active={payment === "wallet"} />
                      <div className="min-w-0">
                        <div className="font-bold text-[#1a1a2e] text-sm">Wallets</div>
                        <div className="text-xs text-gray-400">Amazon Pay, PhonePe, Paytm</div>
                      </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-1 shrink-0">
                      <span className="text-[10px] font-bold text-[#FF9900] border border-gray-200 px-1.5 py-0.5 rounded bg-white">amazon pay</span>
                      <span className="text-[10px] font-black bg-[#5f259f] text-white px-1.5 py-0.5 rounded">Pe</span>
                      <span className="text-[10px] font-black bg-[#002970] text-white px-1.5 py-0.5 rounded">Paytm</span>
                    </div>
                    <input type="radio" name="payment" value="wallet" checked={payment === "wallet"} onChange={() => setPayment("wallet")} className="sr-only" />
                  </label>
                  {payment === "wallet" && (
                    <div className="pb-4 pl-7 flex gap-2 flex-wrap">
                      {wallets.map((w) => (
                        <button key={w} type="button" onClick={() => setWallet(w)}
                          className={`text-xs font-bold px-4 py-2 rounded-xl border-2 transition-colors ${wallet === w ? "border-[#e91e8c] bg-[#fff0f7] text-[#e91e8c]" : "border-gray-200 text-gray-600"}`}>
                          {w}
                        </button>
                      ))}
                      {touched && paymentError && <p className="w-full text-xs text-red-500 font-semibold">{paymentError}</p>}
                    </div>
                  )}
                </div>

                {/* COD */}
                <div>
                  <label className={`flex items-center justify-between py-4 gap-3 ${codBlocked ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
                    <div className="flex items-center gap-3 min-w-0">
                      <RadioDot active={payment === "cod"} />
                      <div className="min-w-0">
                        <div className="font-bold text-[#1a1a2e] text-sm">Cash on Delivery</div>
                        <div className="text-xs text-gray-400">{codBlocked ? `Available on orders up to ${formatINR(COD_LIMIT)}` : "Pay at your doorstep"}</div>
                      </div>
                    </div>
                    <svg className="w-6 h-6 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    <input type="radio" name="payment" value="cod" disabled={codBlocked} checked={payment === "cod"} onChange={() => setPayment("cod")} className="sr-only" />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="space-y-4 lg:sticky lg:top-32">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-[#1a1a2e] text-base">
                  Order Summary <span className="text-gray-400 font-semibold text-sm">({itemCount} {itemCount === 1 ? "item" : "items"})</span>
                </h3>
                <Link href="/cart" className="text-sm font-bold text-[#e91e8c] hover:underline">Edit Cart</Link>
              </div>

              <div className="space-y-3 mb-5 max-h-72 overflow-y-auto pr-1">
                {cart.map(({ product: item, qty }) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
                      <Image src={item.images[0]} alt={item.name} fill className="object-cover" sizes="56px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-[#1a1a2e] leading-tight line-clamp-2">{item.name}</div>
                      <div className="text-xs text-gray-400 mt-0.5">Qty: {qty}</div>
                    </div>
                    <div className="font-black text-[#1a1a2e] shrink-0 text-sm">{formatINR(item.price * qty)}</div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-semibold text-[#1a1a2e]">{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm items-start">
                  <div>
                    <div className="text-gray-500">Shipping Charge</div>
                    <div className="text-xs text-[#4caf50]">(Free on orders above {formatINR(FREE_SHIPPING_THRESHOLD)})</div>
                  </div>
                  <span className={`font-semibold ${shippingFee === 0 ? "text-[#4caf50]" : "text-[#1a1a2e]"}`}>{shippingFee === 0 ? "FREE" : formatINR(shippingFee)}</span>
                </div>

                <div className="border border-dashed border-gray-200 rounded-xl overflow-hidden">
                  <button type="button" onClick={() => setCouponOpen((o) => !o)} className="w-full flex items-center justify-between px-3 py-2.5 text-sm hover:bg-gray-50 transition-colors" aria-expanded={couponOpen}>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-[#fce4ec] rounded-lg flex items-center justify-center shrink-0">
                        <svg className="w-3.5 h-3.5 text-[#e91e8c]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                      </div>
                      <span className="font-semibold text-[#1a1a2e] text-sm">{couponCode ? `Coupon: ${couponCode}` : "Have a Coupon Code?"}</span>
                    </div>
                    <svg className={`w-4 h-4 text-gray-400 transition-transform ${couponOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {couponOpen && (
                    <div className="px-3 pb-3 border-t border-gray-100">
                      {couponCode ? (
                        <div className="flex items-center justify-between mt-2 text-sm">
                          <span className={couponError ? "text-[#ef6c00] text-xs font-semibold" : "text-[#4caf50] font-semibold"}>{couponError ?? `${couponCode} applied`}</span>
                          <button type="button" onClick={removeCoupon} className="text-xs font-bold text-gray-400 hover:text-red-500">Remove</button>
                        </div>
                      ) : (
                        <>
                          <div className="flex gap-2 mt-2">
                            <input type="text" value={coupon} onKeyDown={(e) => { if (e.key === "Enter") submitCoupon(); }} onChange={(e) => { setCoupon(e.target.value.toUpperCase()); setCouponMsg(""); }} placeholder="Enter coupon code"
                              className="flex-1 min-w-0 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#e91e8c]" />
                            <button type="button" onClick={submitCoupon} className="bg-[#e91e8c] hover:bg-[#c2187a] text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors">Apply</button>
                          </div>
                          {couponMsg && <p className="text-xs text-red-500 font-semibold mt-1.5">{couponMsg}</p>}
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {coupons.map((c) => (
                              <button key={c.code} type="button" onClick={() => setCoupon(c.code)} title={c.description} className="text-[10px] font-bold border border-dashed border-[#e91e8c] text-[#e91e8c] px-2 py-1 rounded-lg hover:bg-pink-50">{c.code}</button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-sm text-[#4caf50] font-semibold">
                    <span>Coupon Discount ({couponCode})</span>
                    <span>−{formatINR(couponDiscount)}</span>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                  <span className="font-black text-[#1a1a2e] text-base">Total Amount</span>
                  <span className="font-black text-[#e91e8c] text-2xl">{formatINR(total)}</span>
                </div>
              </div>

              <button onClick={goToReview} className="w-full mt-4 bg-[#e91e8c] hover:bg-[#c2187a] active:bg-[#ad1466] text-white font-black text-base py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-pink-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                Place Order Now →
              </button>
              {touched && (!addressValid || paymentError) && (
                <p className="text-xs text-red-500 font-semibold text-center mt-2">Please complete the highlighted details above.</p>
              )}

              <p className="flex items-center justify-center gap-1.5 text-xs text-gray-400 mt-3">
                <svg className="w-3.5 h-3.5 text-[#4caf50]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                100% Secure Payment | Your data is safe with us
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">❤️</span>
                <h4 className="font-black text-[#1a1a2e] text-sm">Why Shop With Us?</h4>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                {[
                  { emoji: "🛡️", label: "Safe &\nTrusted", bg: "bg-[#e8f5e9]" },
                  { emoji: "🚚", label: "Fast\nDelivery", bg: "bg-[#fce4ec]" },
                  { emoji: "⭐", label: "Quality\nProducts", bg: "bg-[#fffde7]" },
                  { emoji: "💜", label: "Happy\nCustomers", bg: "bg-[#f3e5f5]" },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5">
                    <div className={`${item.bg} w-12 h-12 rounded-2xl flex items-center justify-center text-2xl`}>{item.emoji}</div>
                    <span className="text-[10px] font-semibold text-gray-600 leading-tight whitespace-pre-line">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-[#e0f4fb] rounded-2xl flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-[#0288d1]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-black text-[#1a1a2e] text-sm">Need Help?</div>
                <div className="text-xs text-gray-400">Our support team is always here for you.</div>
              </div>
              <Link href="/contact" className="border-2 border-gray-200 text-[#1a1a2e] font-bold text-xs px-4 py-2 rounded-xl hover:border-[#e91e8c] hover:text-[#e91e8c] transition-colors whitespace-nowrap shrink-0">Contact Us</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Step 3: Review + simulated payment */}
      {phase !== "details" && (
        <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4" role="dialog" aria-modal="true" aria-labelledby="review-title">
          <div className="absolute inset-0 bg-black/40" onClick={() => phase === "review" && setPhase("details")} />
          <div className="relative bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
            {phase === "paying" ? (
              <div className="p-10 text-center">
                <div className="w-14 h-14 mx-auto rounded-full border-4 border-pink-100 border-t-[#e91e8c] animate-spin mb-5" />
                <h3 className="font-black text-[#1a1a2e] text-lg">{payment === "cod" ? "Placing your order…" : `Processing ${paymentLabels[payment]} payment…`}</h3>
                <p className="text-sm text-gray-500 mt-1">Please don&apos;t close or refresh this page.</p>
              </div>
            ) : (
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 id="review-title" className="font-black text-[#1a1a2e] text-lg">Review Your Order</h3>
                  <button onClick={() => setPhase("details")} aria-label="Close" className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500">✕</button>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <div className="flex justify-between mb-1"><span className="font-bold text-[#1a1a2e]">📍 Deliver to</span><button onClick={() => setPhase("details")} className="text-xs font-bold text-[#e91e8c]">Change</button></div>
                    <div className="text-gray-600">{addr.name} · {addr.phone}<br />{addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}, {addr.city}, {addr.state} - {addr.pincode}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-2xl p-4">
                      <div className="font-bold text-[#1a1a2e] mb-1">🚚 Delivery</div>
                      <div className="text-gray-600 text-xs">{shippingMethods[shipping].label}<br />{shippingMethods[shipping].eta}</div>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-4">
                      <div className="font-bold text-[#1a1a2e] mb-1">💳 Payment</div>
                      <div className="text-gray-600 text-xs break-words">{paymentDetail()}</div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4 space-y-1.5">
                    <div className="flex justify-between"><span className="text-gray-500">Items ({itemCount})</span><span className="font-semibold">{formatINR(subtotal)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span className="font-semibold">{shippingFee === 0 ? "FREE" : formatINR(shippingFee)}</span></div>
                    {couponDiscount > 0 && <div className="flex justify-between text-[#4caf50] font-semibold"><span>Coupon ({couponCode})</span><span>−{formatINR(couponDiscount)}</span></div>}
                    <div className="flex justify-between border-t border-gray-200 pt-2 mt-1"><span className="font-black text-[#1a1a2e]">Total</span><span className="font-black text-[#e91e8c] text-lg">{formatINR(total)}</span></div>
                  </div>
                </div>
                <button onClick={confirmOrder} className="w-full mt-5 bg-[#e91e8c] hover:bg-[#c2187a] text-white font-black py-4 rounded-2xl shadow-lg shadow-pink-200 transition-colors">
                  {payment === "cod" ? `Confirm Order · ${formatINR(total)}` : `Pay ${formatINR(total)} Securely`}
                </button>
                <p className="text-[11px] text-gray-400 text-center mt-2">By placing this order you agree to our <Link href="/terms" className="underline">Terms</Link> and <Link href="/refund-policy" className="underline">Refund Policy</Link>.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
