import type { Metadata } from "next";
import InfoPage from "@/components/content/InfoPage";
import { refundPage } from "@/lib/content";

export const metadata: Metadata = { title: "Refund Policy" };

export default function Page() {
  return <InfoPage {...refundPage} />;
}
