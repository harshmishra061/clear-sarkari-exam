/**
 * Utility functions for generating structured data (Schema.org JSON-LD)
 */

interface JobPostingData {
  title: string;
  description: string;
  organization: string;
  slug: string;
  postDate: Date;
  importantDates?: Array<{ label: string; date: string }>;
  vacancies?: { total: number };
}

/**
 * Generate JobPosting schema for search engines
 */
export function generateJobPostingSchema(job: JobPostingData, baseUrl: string = 'https://clear-sarkari-exam.vercel.app') {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.description,
    "identifier": {
      "@type": "PropertyValue",
      "name": job.organization,
      "value": job.slug,
    },
    "datePosted": job.postDate.toISOString(),
    "hiringOrganization": {
      "@type": "Organization",
      "name": job.organization,
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "IN",
      },
    },
    "employmentType": "FULL_TIME",
    "url": `${baseUrl}/jobs/${job.slug}`,
    ...(job.importantDates &&
      job.importantDates.length > 0 && {
        validThrough: job.importantDates[job.importantDates.length - 1]?.date,
      }),
    ...(job.vacancies && {
      totalJobOpenings: job.vacancies.total,
    }),
  };
}

/**
 * Generate Organization schema
 */
export function generateOrganizationSchema(baseUrl: string = 'https://clear-sarkari-exam.vercel.app') {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Clear Sarkari Exam",
    "url": baseUrl,
    "logo": `${baseUrl}/opengraph-image`,
    "description": "Latest Government Job Notifications, Results and Admit Cards",
  };
}

/**
 * Generate WebSite schema with search action
 */
export function generateWebsiteSchema(baseUrl: string = 'https://clear-sarkari-exam.vercel.app') {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Clear Sarkari Exam",
    "url": baseUrl,
    "description": "Latest Government Job Notifications, Results and Admit Cards",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Generate BreadcrumbList schema
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url,
    })),
  };
}
