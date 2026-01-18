"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Job {
  _id: string;
  title: string;
  organization: string;
}

export default function EditResultPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const resultId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [formData, setFormData] = useState({
    jobId: "",
    title: "",
    slug: "",
    status: "active",
  });

  const [importantDates, setImportantDates] = useState([{ label: "", date: "" }]);
  const [importantLinks, setImportantLinks] = useState([
    { label: "", url: "", buttonText: "View Result", otherInfo: "" },
  ]);

  // Fetch jobs for dropdown
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch("/api/admin/jobs");
      if (response.ok) {
        const data = await response.json();
        setJobs(data);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session && resultId) {
      fetchResult();
    }
  }, [session, resultId]);

  const fetchResult = async () => {
    try {
      const response = await fetch(`/api/admin/results/${resultId}`);
      if (response.ok) {
        const result = await response.json();
        
        // Populate form data
        setFormData({
          jobId: result.jobId?._id || result.jobId || "",
          title: result.title || "",
          slug: result.slug || "",
          status: result.status || "active",
        });

        setImportantDates(result.importantDates?.length > 0 ? result.importantDates : [{ label: "", date: "" }]);
        setImportantLinks(result.importantLinks?.length > 0 ? result.importantLinks : [{ label: "", url: "", buttonText: "View Result", otherInfo: "" }]);
      } else {
        alert("Failed to fetch result");
        router.push("/admin/results");
      }
    } catch (error) {
      console.error("Error fetching result:", error);
      alert("Error fetching result");
    } finally {
      setFetching(false);
    }
  };

  const handleTitleChange = (value: string) => {
    setFormData({
      ...formData,
      title: value,
      slug: value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload: Record<string, any> = {
        ...formData,
        importantDates: importantDates.filter((d) => d.label && d.date),
        importantLinks: importantLinks.filter((l) => l.label && l.url),
      };

      // Remove jobId if it's empty
      if (!payload.jobId || payload.jobId === "") {
        delete payload.jobId;
      }

      const response = await fetch(`/api/admin/results/${resultId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Result updated successfully!");
        router.push("/admin/results");
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error updating result:", error);
      alert("Failed to update result");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#BF1A1A' }}></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Result</h1>
        <p className="text-gray-500 mt-2">Update the result details below</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">Basic Information</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Related Job (Optional)
              </label>
              <select
                value={formData.jobId}
                onChange={(e) => setFormData({ ...formData, jobId: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none transition-all"
              >
                <option value="">Select a job (optional)</option>
                {jobs.map((job) => (
                  <option key={job._id} value={job._id}>
                    {job.title} - {job.organization}
                  </option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Result Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none transition-all"
                placeholder="e.g., Railway Result 2026"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug (Auto-generated)
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none transition-all bg-gray-50"
                placeholder="railway-result-2026"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none transition-all"
              >
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>

        {/* Important Dates */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">Important Dates</h2>
          {importantDates.map((date, index) => (
            <div key={index} className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                value={date.label}
                onChange={(e) => {
                  const newDates = [...importantDates];
                  newDates[index].label = e.target.value;
                  setImportantDates(newDates);
                }}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none transition-all"
                placeholder="e.g., Result Date"
              />
              <input
                type="text"
                value={date.date}
                onChange={(e) => {
                  const newDates = [...importantDates];
                  newDates[index].date = e.target.value;
                  setImportantDates(newDates);
                }}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none transition-all"
                placeholder="e.g., 15/01/2026"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => setImportantDates([...importantDates, { label: "", date: "" }])}
            className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            style={{ color: '#BF1A1A' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Date
          </button>
        </div>

        {/* Important Links */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">Important Links</h2>
          {importantLinks.map((link, index) => (
            <div key={index} className="space-y-3 mb-4 pb-6 border-b border-gray-200 last:border-0 last:pb-0">
              <input
                type="text"
                value={link.label}
                onChange={(e) => {
                  const newLinks = [...importantLinks];
                  newLinks[index].label = e.target.value;
                  setImportantLinks(newLinks);
                }}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none transition-all"
                placeholder="Link Label"
              />
              <input
                type="url"
                value={link.url}
                onChange={(e) => {
                  const newLinks = [...importantLinks];
                  newLinks[index].url = e.target.value;
                  setImportantLinks(newLinks);
                }}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none transition-all"
                placeholder="URL"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  value={link.buttonText}
                  onChange={(e) => {
                    const newLinks = [...importantLinks];
                    newLinks[index].buttonText = e.target.value;
                    setImportantLinks(newLinks);
                  }}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none transition-all"
                  placeholder="Button Text"
                />
                <input
                  type="text"
                  value={link.otherInfo}
                  onChange={(e) => {
                    const newLinks = [...importantLinks];
                    newLinks[index].otherInfo = e.target.value;
                    setImportantLinks(newLinks);
                  }}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none transition-all"
                  placeholder="Other Info (optional)"
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setImportantLinks([
                ...importantLinks,
                { label: "", url: "", buttonText: "View Result", otherInfo: "" },
              ])
            }
            className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            style={{ color: '#BF1A1A' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Link
          </button>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3.5 text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 shadow-sm transition-all flex items-center justify-center gap-2"
            style={{ backgroundColor: '#BF1A1A' }}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Updating...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Update Result
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-8 py-3.5 border-2 border-gray-300 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
