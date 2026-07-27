import type { Metadata } from "next";

import { LegalPageLayout } from "@/features/legal/legal-page-layout";
import { TermsContent } from "@/features/legal/terms-content";

export const metadata: Metadata = {
  title: "Terms of Service - JobSeeker AI",
  description: "The terms that govern your use of JobSeeker AI.",
};

export default function TermsPage() {
  return (
    <LegalPageLayout
      eyebrow="Legal"
      title="Terms of Service"
      lastUpdated="[Month Day, Year]"
    >
      <TermsContent />
    </LegalPageLayout>
  );
}
