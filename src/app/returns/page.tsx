import type { Metadata } from "next";
import InfoPage from "@/components/content/InfoPage";
import { returnsPage } from "@/lib/content";

export const metadata: Metadata = { title: "Returns & Refunds" };

export default function Page() {
  return <InfoPage {...returnsPage} />;
}
