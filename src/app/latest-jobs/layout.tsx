import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Latest Government Jobs 2026 - All Job Notifications",
  description: "Browse all latest government job notifications, sarkari naukri updates, and exam notifications. Complete list of central and state government jobs with important dates and details.",
  keywords: [
    "latest government jobs",
    "sarkari jobs list",
    "government job notifications 2026",
    "all sarkari naukri",
    "central government jobs",
    "state government jobs",
    "job vacancy list",
    "govt jobs 2026"
  ],
  openGraph: {
    title: "Latest Government Jobs 2026 - All Job Notifications",
    description: "Browse all latest government job notifications, sarkari naukri updates, and exam notifications.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Latest Government Jobs 2026 - All Job Notifications",
    description: "Browse all latest government job notifications, sarkari naukri updates, and exam notifications.",
  },
};

export default function LatestJobsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
