import type { Metadata } from "next";
import InfoPage from "@/components/content/InfoPage";
import { cookiePage } from "@/lib/content";

export const metadata: Metadata = { title: "Cookie Policy" };

export default function Page() {
  return <InfoPage {...cookiePage} />;
}
