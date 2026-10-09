import type { Metadata } from "next";
import InfoPage from "@/components/content/InfoPage";
import { shippingPage } from "@/lib/content";

export const metadata: Metadata = { title: "Shipping Info" };

export default function Page() {
  return <InfoPage {...shippingPage} />;
}
