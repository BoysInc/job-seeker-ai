import type { Metadata } from "next";

import { LegalPageLayout } from "@/features/legal/legal-page-layout";
import { PrivacyPolicyContent } from "@/features/legal/privacy-policy-content";

export const metadata: Metadata = {
  title: "Privacy Policy - JobSeeker AI",
  description: "How JobSeeker AI collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      eyebrow="Legal"
      title="Privacy Policy"
      lastUpdated="[Month Day, Year]"
    >
      <PrivacyPolicyContent />
    </LegalPageLayout>
  );
}
