import type { Metadata } from "next";
import { PageHeader } from "@/components/ui";
import TrackForm from "./TrackForm";

export const metadata: Metadata = { title: "Track Order" };

export default function TrackOrderPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <PageHeader title="Track Your Order" emoji="📦" subtitle="Enter your order number and the email or phone used at checkout." crumbs={[{ label: "Track Order" }]} />
      <TrackForm />
    </div>
  );
}
