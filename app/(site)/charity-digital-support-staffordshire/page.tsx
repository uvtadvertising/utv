import type { Metadata } from "next";
import { CommunityPageView } from "@/components/sections/community-page-view";
import { communitySeo } from "@/content/community";

export const metadata: Metadata = {
  title: communitySeo.title,
  description: communitySeo.description,
  robots: {
    index: true,
    follow: true,
  },
};

export default function CommunityDigitalSupportPage() {
  return <CommunityPageView />;
}
