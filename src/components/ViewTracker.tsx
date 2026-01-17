"use client";

import { useEffect } from "react";

interface ViewTrackerProps {
  slug: string;
}

export default function ViewTracker({ slug }: ViewTrackerProps) {
  useEffect(() => {
    // Increment view count when component mounts
    const incrementView = async () => {
      try {
        await fetch(`/api/jobs/${slug}/increment-view`, {
          method: "POST",
        });
      } catch (error) {
        console.error("Failed to increment view count:", error);
      }
    };

    incrementView();
  }, [slug]);

  // This component doesn't render anything
  return null;
}
