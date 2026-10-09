import type { Metadata } from "next";
import InfoPage from "@/components/content/InfoPage";
import { termsPage } from "@/lib/content";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default function Page() {
  return <InfoPage {...termsPage} />;
}
