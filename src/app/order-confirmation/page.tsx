import { Suspense } from "react";
import type { Metadata } from "next";
import { Spinner } from "@/components/ui";
import ConfirmationClient from "./ConfirmationClient";

export const metadata: Metadata = { title: "Order Confirmed" };

export default function OrderConfirmationPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Suspense fallback={<Spinner label="Loading your order…" />}>
        <ConfirmationClient />
      </Suspense>
    </div>
  );
}
