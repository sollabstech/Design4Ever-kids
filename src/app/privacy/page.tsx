import type { Metadata } from "next";
import InfoPage from "@/components/content/InfoPage";
import { privacyPage } from "@/lib/content";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function Page() {
  return <InfoPage {...privacyPage} />;
}
