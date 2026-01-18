"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Result {
  _id: string;
  title: string;
  slug: string;
  status: string;
  publishDate: string;
  jobId: {
    title: string;
    organization: string;
  };
}

export default function AdminResultsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await fetch("/api/admin/results");
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      }
    } catch (error) {
      console.error("Error fetching results:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this result?")) return;

    try {
      const response = await fetch(`/api/admin/results/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setResults(results.filter((result) => result._id !== id));
        alert("Result deleted successfully!");
      } else {
        alert("Failed to delete result");
      }
    } catch (error) {
      console.error("Error deleting result:", error);
      alert("Error deleting result");
    }
  };

  if (status === "loading" || loading) {
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Results</h1>
          <p className="text-gray-500 mt-2">View and manage all result postings</p>
        </div>
        <Link
          href="/admin/results/new"
          className="flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-sm"
          style={{ backgroundColor: '#BF1A1A' }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create New Result
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Result Title
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Job/Organization
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Published
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {results.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-gray-500 mb-2">No results found</p>
                      <Link
                        href="/admin/results/new"
                        className="text-sm font-medium hover:underline"
                        style={{ color: '#BF1A1A' }}
                      >
                        Create your first result
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                results.map((result) => (
                  <tr key={result._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">{result.title}</div>
                      <div className="text-xs text-gray-500 mt-1">/{result.slug}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 font-medium">{result.jobId.title}</div>
                      <div className="text-xs text-gray-500">{result.jobId.organization}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                          result.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {result.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(result.publishDate).toLocaleDateString('en-IN', { 
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/results/${result.slug}`}
                          target="_blank"
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          View
                        </Link>
                        <Link
                          href={`/admin/results/${result._id}/edit`}
                          className="text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(result._id)}
                          className="text-red-600 hover:text-red-700 font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
