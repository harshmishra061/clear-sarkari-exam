"use client";

import { useEffect } from "react";

interface ViewTrackerProps {
  slug: string;
  isResult?: boolean;
}

export default function ViewTracker({ slug, isResult = false }: ViewTrackerProps) {
  useEffect(() => {
    // Increment view count when component mounts
    const incrementView = async () => {
      try {
        const endpoint = isResult 
          ? `/api/results/${slug}/increment-view`
          : `/api/jobs/${slug}/increment-view`;
          
        await fetch(endpoint, {
          method: "POST",
        });
      } catch (error) {
        console.error("Failed to increment view count:", error);
      }
    };

    incrementView();
  }, [slug, isResult]);

  // This component doesn't render anything
  return null;
}
