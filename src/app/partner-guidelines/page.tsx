import type { Metadata } from "next";
import InfoPage from "@/components/content/InfoPage";
import { partnerPage } from "@/lib/content";

export const metadata: Metadata = { title: "Partner Guidelines" };

export default function Page() {
  return <InfoPage {...partnerPage} />;
}
