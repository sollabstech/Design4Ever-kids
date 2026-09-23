"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const BASE = "https://images.unsplash.com";

const steps = [
  { id: 1, label: "Shipping Address" },
  { id: 2, label: "Payment" },
  { id: 3, label: "Review Order" },
  { id: 4, label: "Order Placed" },
];

const orderItems = [
  {
    id: 11,
    name: "Teddy Bear Soft Toy",
    qty: 1,
    price: 499,
    image: `${BASE}/photo-1602734846297-9299fc2d4703?w=120&h=120&fit=crop&auto=format&q=80`,
  },
  {
    id: 5,
    name: "Wooden Building Blocks",
    qty: 1,
    price: 590,
    image: `${BASE}/photo-1587654780291-39c9404d746b?w=120&h=120&fit=crop&auto=format&q=80`,
  },
  {
    id: 9,
    name: "Coloring Books Set (5)",
    qty: 1,
    price: 299,
    image: `${BASE}/photo-1455884981818-54cb785db6fc?w=120&h=120&fit=crop&auto=format&q=80`,
  },
];

const indianStates = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
  "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu",
  "Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Delhi","Jammu & Kashmir","Ladakh","Puducherry",
];

export default function CheckoutPage() {
  const [activeStep] = useState(1);
  const [shipping, setShipping] = useState<"standard" | "express">("standard");
  const [payment, setPayment] = useState<"upi" | "card" | "netbanking" | "wallet" | "cod">("upi");
  const [saveAddress, setSaveAddress] = useState(true);
  const [couponOpen, setCouponOpen] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  const subtotal = orderItems.reduce((s, i) => s + i.price * i.qty, 0);
  const shippingCost = shipping === "standard" ? 60 : 120;
  const couponDiscount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + shippingCost - couponDiscount;

  function RadioDot({ active }: { active: boolean }) {
    return (
      <div
        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
          active ? "border-[#e91e8c]" : "border-gray-300"
        }`}
      >
        {active && <div className="w-2 h-2 rounded-full bg-[#e91e8c]" />}
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Progress Steps */}
        <div className="flex items-start justify-center mb-8 gap-0">
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-start">
              <div className="flex flex-col items-center" style={{ minWidth: 90 }}>
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-sm border-2 transition-colors ${
                    step.id < activeStep
                      ? "bg-[#e91e8c] border-[#e91e8c] text-white"
                      : step.id === activeStep
                      ? "bg-[#e91e8c] border-[#e91e8c] text-white"
                      : "bg-white border-gray-300 text-gray-400"
                  }`}
                >
                  {step.id < activeStep ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.id
                  )}
                </div>
                <span
                  className={`text-xs font-semibold mt-1.5 text-center leading-tight ${
                    step.id <= activeStep ? "text-[#e91e8c]" : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
                {step.id === activeStep && (
                  <div className="h-0.5 w-12 bg-[#e91e8c] rounded-full mt-1" />
                )}
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`h-0.5 w-12 sm:w-16 mt-[18px] mx-0 transition-colors ${
                    step.id < activeStep ? "bg-[#e91e8c]" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">

          {/* ── LEFT COLUMN ── */}
          <div className="space-y-5">

            {/* ① Shipping Address */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
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
                <div className="flex items-center gap-1.5 text-sm text-gray-400 flex-wrap">
                  <span>Already have an address?</span>
                  <button className="text-[#e91e8c] font-semibold flex items-center gap-0.5 hover:underline">
                    Select from saved addresses
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                      Full Name <span className="text-[#e91e8c]">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter full name"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#e91e8c] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                      Phone Number <span className="text-[#e91e8c]">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="Enter phone number"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#e91e8c] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                    Address <span className="text-[#e91e8c]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="House No, Building Name, Street Name"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#e91e8c] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                      City <span className="text-[#e91e8c]">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter city"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#e91e8c] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                      State <span className="text-[#e91e8c]">*</span>
                    </label>
                    <div className="relative">
                      <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#e91e8c] transition-colors bg-white appearance-none pr-8">
                        <option value="">Select state</option>
                        {indianStates.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <svg className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                      Pincode <span className="text-[#e91e8c]">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter pincode"
                      maxLength={6}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#e91e8c] transition-colors"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={saveAddress}
                    onChange={() => setSaveAddress((v) => !v)}
                    className="w-4 h-4 rounded accent-[#e91e8c]"
                  />
                  <span className="text-sm text-gray-600">Save this address for future orders</span>
                </label>
              </div>
            </div>

            {/* ② Shipping Method */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                  <span className="font-black text-gray-500 text-sm">2</span>
                </div>
                <div>
                  <h2 className="font-black text-[#1a1a2e] text-lg">Shipping Method</h2>
                  <p className="text-xs text-gray-400">Choose a delivery option</p>
                </div>
              </div>

              <div className="space-y-3">
                {/* Standard */}
                <label
                  className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                    shipping === "standard"
                      ? "border-[#e91e8c] bg-[#fff0f7]"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <RadioDot active={shipping === "standard"} />
                    <div>
                      <div className="font-bold text-[#1a1a2e] text-sm">Standard Delivery</div>
                      <div className="text-xs text-gray-400">3 – 7 Business Days</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-[#1a1a2e]">₹60</div>
                    <div className="text-xs text-[#4caf50] font-semibold">Free on orders above ₹499</div>
                  </div>
                  <input
                    type="radio"
                    name="shipping"
                    value="standard"
                    checked={shipping === "standard"}
                    onChange={() => setShipping("standard")}
                    className="sr-only"
                  />
                </label>

                {/* Express */}
                <label
                  className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                    shipping === "express"
                      ? "border-[#e91e8c] bg-[#fff0f7]"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <RadioDot active={shipping === "express"} />
                    <div>
                      <div className="font-bold text-[#1a1a2e] text-sm">Express Delivery</div>
                      <div className="text-xs text-gray-400">1 – 3 Business Days</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-[#1a1a2e]">₹120</div>
                  </div>
                  <input
                    type="radio"
                    name="shipping"
                    value="express"
                    checked={shipping === "express"}
                    onChange={() => setShipping("express")}
                    className="sr-only"
                  />
                </label>
              </div>
            </div>

            {/* ③ Payment Method */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-full bg-[#e91e8c] flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-black text-[#1a1a2e] text-lg">Payment Method</h2>
                  <p className="text-xs text-gray-400">Choose a secure payment option</p>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {/* UPI */}
                <label className="flex items-center justify-between py-4 cursor-pointer gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <RadioDot active={payment === "upi"} />
                    <div className="min-w-0">
                      <div className="font-bold text-[#1a1a2e] text-sm">UPI</div>
                      <div className="text-xs text-gray-400">Google Pay, PhonePe, Paytm, etc.</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[10px] font-black text-[#4285f4] border border-gray-200 px-1.5 py-0.5 rounded bg-white">G Pay</span>
                    <span className="text-[10px] font-black bg-[#5f259f] text-white px-1.5 py-0.5 rounded">Pe</span>
                    <span className="text-[10px] font-black bg-[#002970] text-white px-1.5 py-0.5 rounded">Paytm</span>
                    <span className="text-[10px] font-black bg-[#00579f] text-white px-1.5 py-0.5 rounded">BHIM</span>
                  </div>
                  <input type="radio" name="payment" value="upi" checked={payment === "upi"} onChange={() => setPayment("upi")} className="sr-only" />
                </label>

                {/* Credit / Debit Card */}
                <label className="flex items-center justify-between py-4 cursor-pointer gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <RadioDot active={payment === "card"} />
                    <div className="min-w-0">
                      <div className="font-bold text-[#1a1a2e] text-sm">Credit / Debit Card</div>
                      <div className="text-xs text-gray-400">Visa, Mastercard, RuPay</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] font-black text-[#1a1f71] border border-gray-200 px-1.5 py-0.5 rounded italic bg-white">VISA</span>
                    <span className="flex items-center">
                      <span className="w-4 h-4 rounded-full bg-[#eb001b] inline-block" />
                      <span className="w-4 h-4 rounded-full bg-[#f79e1b] inline-block -ml-2 opacity-90" />
                    </span>
                    <span className="text-[10px] font-black text-[#1a1a2e] border border-gray-200 px-1.5 py-0.5 rounded bg-white">RuPay</span>
                  </div>
                  <input type="radio" name="payment" value="card" checked={payment === "card"} onChange={() => setPayment("card")} className="sr-only" />
                </label>

                {/* Net Banking */}
                <label className="flex items-center justify-between py-4 cursor-pointer gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <RadioDot active={payment === "netbanking"} />
                    <div className="min-w-0">
                      <div className="font-bold text-[#1a1a2e] text-sm">Net Banking</div>
                      <div className="text-xs text-gray-400">All major banks</div>
                    </div>
                  </div>
                  <svg className="w-6 h-6 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                  </svg>
                  <input type="radio" name="payment" value="netbanking" checked={payment === "netbanking"} onChange={() => setPayment("netbanking")} className="sr-only" />
                </label>

                {/* Wallets */}
                <label className="flex items-center justify-between py-4 cursor-pointer gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <RadioDot active={payment === "wallet"} />
                    <div className="min-w-0">
                      <div className="font-bold text-[#1a1a2e] text-sm">Wallets</div>
                      <div className="text-xs text-gray-400">Amazon Pay, PhonePe, Paytm</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[10px] font-bold text-[#FF9900] border border-gray-200 px-1.5 py-0.5 rounded bg-white">amazon pay</span>
                    <span className="text-[10px] font-black bg-[#5f259f] text-white px-1.5 py-0.5 rounded">Pe</span>
                    <span className="text-[10px] font-black bg-[#002970] text-white px-1.5 py-0.5 rounded">Paytm</span>
                  </div>
                  <input type="radio" name="payment" value="wallet" checked={payment === "wallet"} onChange={() => setPayment("wallet")} className="sr-only" />
                </label>

                {/* Cash on Delivery */}
                <label className="flex items-center justify-between py-4 cursor-pointer gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <RadioDot active={payment === "cod"} />
                    <div className="min-w-0">
                      <div className="font-bold text-[#1a1a2e] text-sm">Cash on Delivery</div>
                      <div className="text-xs text-gray-400">Pay at your doorstep</div>
                    </div>
                  </div>
                  <svg className="w-6 h-6 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <input type="radio" name="payment" value="cod" checked={payment === "cod"} onChange={() => setPayment("cod")} className="sr-only" />
                </label>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="space-y-4 lg:sticky lg:top-24">

            {/* Order Summary */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-[#1a1a2e] text-base">
                  Order Summary{" "}
                  <span className="text-gray-400 font-semibold text-sm">(3 items)</span>
                </h3>
                <Link href="/shop" className="text-sm font-bold text-[#e91e8c] hover:underline">
                  Edit Cart
                </Link>
              </div>

              {/* Items */}
              <div className="space-y-3 mb-5">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-[#1a1a2e] leading-tight line-clamp-2">
                        {item.name}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">Qty: {item.qty}</div>
                    </div>
                    <div className="font-black text-[#1a1a2e] shrink-0 text-sm">
                      ₹{item.price}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-100 pt-4 space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-semibold text-[#1a1a2e]">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-sm items-start">
                  <div>
                    <div className="text-gray-500">Shipping Charge</div>
                    <div className="text-xs text-[#4caf50]">(Free on orders above ₹499)</div>
                  </div>
                  <span className="font-semibold text-[#1a1a2e]">₹{shippingCost}</span>
                </div>

                {/* Coupon Accordion */}
                <div className="border border-dashed border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setCouponOpen((o) => !o)}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-sm hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-[#fce4ec] rounded-lg flex items-center justify-center shrink-0">
                        <svg className="w-3.5 h-3.5 text-[#e91e8c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                      </div>
                      <span className="font-semibold text-[#1a1a2e] text-sm">Have a Coupon Code?</span>
                    </div>
                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform ${couponOpen ? "rotate-180" : ""}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {couponOpen && (
                    <div className="px-3 pb-3 border-t border-gray-100">
                      <div className="flex gap-2 mt-2">
                        <input
                          type="text"
                          value={coupon}
                          onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                          placeholder="Enter coupon code"
                          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#e91e8c]"
                        />
                        <button
                          onClick={() => { if (coupon === "KIDS10") setCouponApplied(true); }}
                          className="bg-[#e91e8c] hover:bg-[#c2187a] text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors"
                        >
                          Apply
                        </button>
                      </div>
                      {coupon && coupon !== "KIDS10" && couponApplied === false && (
                        <p className="text-xs text-gray-400 mt-1.5">Try code: KIDS10</p>
                      )}
                    </div>
                  )}
                </div>

                {couponApplied && (
                  <div className="flex justify-between text-sm text-[#4caf50] font-semibold">
                    <span>Coupon Discount (KIDS10)</span>
                    <span>−₹{couponDiscount}</span>
                  </div>
                )}

                {/* Total */}
                <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                  <span className="font-black text-[#1a1a2e] text-base">Total Amount</span>
                  <span className="font-black text-[#e91e8c] text-2xl">
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Place Order */}
              <button className="w-full mt-4 bg-[#e91e8c] hover:bg-[#c2187a] active:bg-[#ad1466] text-white font-black text-base py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-pink-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Place Order Now →
              </button>

              <p className="flex items-center justify-center gap-1.5 text-xs text-gray-400 mt-3">
                <svg className="w-3.5 h-3.5 text-[#4caf50]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                100% Secure Payment | Your data is safe with us
              </p>
            </div>

            {/* Why Shop With Us */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">❤️</span>
                <h4 className="font-black text-[#1a1a2e] text-sm">Why Shop With Us?</h4>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                {[
                  { emoji: "🛡️", label: "Safe &\nTrusted",      bg: "bg-[#e8f5e9]" },
                  { emoji: "🚚", label: "Fast\nDelivery",       bg: "bg-[#fce4ec]" },
                  { emoji: "⭐", label: "Quality\nProducts",    bg: "bg-[#fffde7]" },
                  { emoji: "💜", label: "Happy\nCustomers",     bg: "bg-[#f3e5f5]" },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5">
                    <div className={`${item.bg} w-12 h-12 rounded-2xl flex items-center justify-center text-2xl`}>
                      {item.emoji}
                    </div>
                    <span className="text-[10px] font-semibold text-gray-600 leading-tight whitespace-pre-line">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Need Help */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-[#e0f4fb] rounded-2xl flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-[#0288d1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-black text-[#1a1a2e] text-sm">Need Help?</div>
                <div className="text-xs text-gray-400">Our support team is always here for you.</div>
              </div>
              <Link
                href="/contact"
                className="border-2 border-gray-200 text-[#1a1a2e] font-bold text-xs px-4 py-2 rounded-xl hover:border-[#e91e8c] hover:text-[#e91e8c] transition-colors whitespace-nowrap shrink-0"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
