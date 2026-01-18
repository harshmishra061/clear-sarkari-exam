"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Job {
  _id: string;
  title: string;
  organization: string;
}

export default function CreateResultPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
  const [showImport, setShowImport] = useState(false);
  const [importJson, setImportJson] = useState("");

  const STORAGE_KEY = 'createResultFormData';

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

  // Load saved form data on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          if (parsed.formData) setFormData(parsed.formData);
          if (parsed.importantDates) setImportantDates(parsed.importantDates);
          if (parsed.importantLinks) setImportantLinks(parsed.importantLinks);
        } catch (error) {
          console.error('Error loading saved form data:', error);
        }
      }
    }
  }, []);

  // Auto-save form data to localStorage with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      const dataToSave = {
        formData,
        importantDates,
        importantLinks,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    }, 1000); // 1 second debounce

    return () => clearTimeout(timer);
  }, [formData, importantDates, importantLinks]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  // Auto-generate slug from title
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

  // Copy schema structure to clipboard
  const copySchemaStructure = async () => {
    const schemaTemplate = {
      jobId: "select_from_dropdown",
      title: "Result Title Here",
      slug: "result-slug-here",
      status: "active",
      seo: {
        title: "SEO Title",
        description: "SEO Description"
      },
      importantDates: [
        { label: "Result Date", date: "DD/MM/YYYY" },
        { label: "Interview Date", date: "DD/MM/YYYY" }
      ],
      importantLinks: [
        {
          label: "Download Result",
          url: "https://example.com",
          buttonText: "View Result",
          otherInfo: "Additional information (optional)"
        },
        {
          label: "Download Merit List",
          url: "https://example.com/merit.pdf",
          buttonText: "Download PDF"
        }
      ]
    };

    try {
      await navigator.clipboard.writeText(JSON.stringify(schemaTemplate, null, 2));
      alert('Schema structure copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
      alert('Failed to copy to clipboard. Please try again.');
    }
  };

  // Import from JSON
  const handleImport = () => {
    try {
      const data = JSON.parse(importJson);
      
      if (data.jobId !== undefined) setFormData(prev => ({ ...prev, jobId: data.jobId }));
      if (data.title !== undefined) setFormData(prev => ({ ...prev, title: data.title }));
      if (data.slug !== undefined) setFormData(prev => ({ ...prev, slug: data.slug }));
      if (data.status !== undefined) setFormData(prev => ({ ...prev, status: data.status }));
      if (data.importantDates) setImportantDates(data.importantDates);
      if (data.importantLinks) setImportantLinks(data.importantLinks);

      alert("Data imported successfully!");
      setShowImport(false);
      setImportJson("");
    } catch (error) {
      alert("Error parsing JSON: " + (error instanceof Error ? error.message : "Invalid JSON"));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        importantDates: importantDates.filter((d) => d.label && d.date),
        importantLinks: importantLinks.filter((l) => l.label && l.url),
      };

      const response = await fetch("/api/admin/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // Clear saved form data on successful creation
        localStorage.removeItem(STORAGE_KEY);
        alert("Result created successfully!");
        router.push("/admin/results");
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error creating result:", error);
      alert("Failed to create result");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
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
        <h1 className="text-3xl font-bold text-gray-900">Create New Result</h1>
        <p className="text-gray-500 mt-2">Fill in the details below to create a new result posting</p>
      </div>

      {/* Import from JSON */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl shadow-sm border border-blue-100 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Import from JSON</h2>
            <p className="text-sm text-gray-600 mt-1">Quickly fill the form by pasting JSON data</p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={copySchemaStructure}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center gap-2"
              title="Copy schema structure to clipboard"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Schema
            </button>
            <button
              type="button"
              onClick={() => setShowImport(!showImport)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {showImport ? "Hide" : "Show"} Import
            </button>
          </div>
        </div>

        {showImport && (
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paste JSON Object
              </label>
              <textarea
                value={importJson}
                onChange={(e) => setImportJson(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none transition-all font-mono text-sm"
                rows={10}
                placeholder={`{
  "title": "Railway Result 2026",
  "importantDates": [{"label": "Result Date", "date": "2026-03-15"}],
  "importantLinks": [{"label": "Download Result", "url": "https://example.com"}]
}`}
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleImport}
                className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Import Data
              </button>
              <button
                type="button"
                onClick={() => {
                  setImportJson("");
                  setShowImport(false);
                }}
                className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">Basic Information</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Related Job *
              </label>
              <select
                required
                value={formData.jobId}
                onChange={(e) => setFormData({ ...formData, jobId: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none transition-all"
              >
                <option value="">Select a job</option>
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
                Creating...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Create Result
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
