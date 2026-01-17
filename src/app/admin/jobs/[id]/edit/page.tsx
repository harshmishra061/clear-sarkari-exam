"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditJobPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    organization: "",
    description: "",
    status: "active",
  });

  const [importantDates, setImportantDates] = useState([{ label: "", date: "" }]);
  const [applicationFee, setApplicationFee] = useState([{ category: "", amount: "" }]);
  const [ageRange, setAgeRange] = useState([{ title: "", value: "" }]);
  const [vacancy, setVacancy] = useState("");
  const [tables, setTables] = useState([{ title: "", columns: [""], rows: [[""]] }]);
  const [importantLinks, setImportantLinks] = useState([
    { label: "", url: "", buttonText: "Click Here", otherInfo: "" },
  ]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session && jobId) {
      fetchJob();
    }
  }, [session, jobId]);

  const fetchJob = async () => {
    try {
      const response = await fetch(`/api/admin/jobs/${jobId}`);
      if (response.ok) {
        const job = await response.json();
        
        // Populate form data
        setFormData({
          title: job.title || "",
          slug: job.slug || "",
          organization: job.organization || "",
          description: job.description || "",
          status: job.status || "active",
        });

        setImportantDates(job.importantDates?.length > 0 ? job.importantDates : [{ label: "", date: "" }]);
        setApplicationFee(job.applicationFee?.length > 0 ? job.applicationFee.map((f: any) => ({ ...f, amount: String(f.amount) })) : [{ category: "", amount: "" }]);
        setAgeRange(job.ageRange?.length > 0 ? job.ageRange : [{ title: "", value: "" }]);
        
        setVacancy(job.vacancy ? String(job.vacancy) : "");
        setTables(job.table?.length > 0 ? job.table : [{ title: "", columns: [""], rows: [[""]] }]);
        setImportantLinks(job.importantLinks?.length > 0 ? job.importantLinks : [{ label: "", url: "", buttonText: "Click Here", otherInfo: "" }]);
      } else {
        alert("Failed to fetch job");
        router.push("/admin/jobs");
      }
    } catch (error) {
      console.error("Error fetching job:", error);
      alert("Error fetching job");
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
      const payload = {
        ...formData,
        importantDates: importantDates.filter((d) => d.label && d.date),
        applicationFee: applicationFee
          .filter((f) => f.category && f.amount)
          .map((f) => ({ ...f, amount: Number(f.amount) })),
        ageRange: ageRange.filter((a) => a.title && a.value),
        vacancy: vacancy ? Number(vacancy) : undefined,
        table: tables
          .filter((t) => t.title || (t.columns && t.columns.some(c => c)) || (t.rows && t.rows.some(r => r.some(c => c))))
          .map((t) => ({
            title: t.title || undefined,
            columns: t.columns.filter(c => c),
            rows: t.rows.map(row => row.filter(cell => cell !== undefined)),
          })),
        importantLinks: importantLinks.filter((l) => l.label && l.url),
      };

      const response = await fetch(`/api/admin/jobs/${jobId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Job updated successfully!");
        router.push("/admin/jobs");
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error updating job:", error);
      alert("Failed to update job");
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
        <h1 className="text-3xl font-bold text-gray-900">Edit Job</h1>
        <p className="text-gray-500 mt-2">Update job posting details</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">Basic Information</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none transition-all"
                placeholder="e.g., Railway Recruitment 2026"
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
                placeholder="railway-recruitment-2026"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organization *
              </label>
              <input
                type="text"
                required
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none transition-all"
                placeholder="e.g., Indian Railways"
              />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none transition-all"
                placeholder="Enter job description..."
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
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>
        </div>

        {/* Rest of the form sections - Similar to create job form */}
        {/* I'll add abbreviated versions for brevity */}
        
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
                placeholder="e.g., Application Start Date"
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

        {/* Application Fee */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">Application Fee</h2>
          {applicationFee.map((fee, index) => (
            <div key={index} className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                value={fee.category}
                onChange={(e) => {
                  const newFees = [...applicationFee];
                  newFees[index].category = e.target.value;
                  setApplicationFee(newFees);
                }}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none transition-all"
                placeholder="e.g., General"
              />
              <input
                type="number"
                value={fee.amount}
                onChange={(e) => {
                  const newFees = [...applicationFee];
                  newFees[index].amount = e.target.value;
                  setApplicationFee(newFees);
                }}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none transition-all"
                placeholder="Amount"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => setApplicationFee([...applicationFee, { category: "", amount: "" }])}
            className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            style={{ color: '#BF1A1A' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Fee Category
          </button>
        </div>

        {/* Age Limit */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">Age Limit</h2>
          {ageRange.map((age, index) => (
            <div key={index} className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                value={age.title}
                onChange={(e) => {
                  const newAges = [...ageRange];
                  newAges[index].title = e.target.value;
                  setAgeRange(newAges);
                }}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none transition-all"
                placeholder="e.g., Minimum Age"
              />
              <input
                type="text"
                value={age.value}
                onChange={(e) => {
                  const newAges = [...ageRange];
                  newAges[index].value = e.target.value;
                  setAgeRange(newAges);
                }}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none transition-all"
                placeholder="e.g., 18 years"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => setAgeRange([...ageRange, { title: "", value: "" }])}
            className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            style={{ color: '#BF1A1A' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Age Info
          </button>
        </div>

        {/* Vacancy */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">Vacancy</h2>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Total Vacancy</label>
            <input
              type="number"
              value={vacancy}
              onChange={(e) => setVacancy(e.target.value)}
              className="w-full lg:w-1/2 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none transition-all"
              placeholder="e.g., 100"
            />
          </div>
        </div>

        {/* Tables */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">Tables</h2>
          {tables.map((table, tableIndex) => (
            <div key={tableIndex} className="mb-8 p-6 bg-gray-50 rounded-lg border-2 border-gray-200">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Table Title</label>
                <input
                  type="text"
                  value={table.title}
                  onChange={(e) => {
                    const newTables = [...tables];
                    newTables[tableIndex].title = e.target.value;
                    setTables(newTables);
                  }}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none transition-all bg-white"
                  placeholder="e.g., Post Details"
                />
              </div>

              {/* Visual Table Structure */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border-2 border-gray-400 bg-white">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="border-2 border-gray-400 p-2 text-center text-xs font-semibold text-gray-600 w-20">
                        Row #
                      </th>
                      {table.columns.map((column, colIndex) => (
                        <th key={colIndex} className="border-2 border-gray-400 p-1">
                          <input
                            type="text"
                            value={column}
                            onChange={(e) => {
                              const newTables = [...tables];
                              newTables[tableIndex].columns[colIndex] = e.target.value;
                              setTables(newTables);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none text-center font-semibold bg-blue-100"
                            placeholder={`Column ${colIndex + 1}`}
                          />
                        </th>
                      ))}
                      <th className="border-2 border-gray-400 p-2 w-20">
                        <button
                          type="button"
                          onClick={() => {
                            const newTables = [...tables];
                            newTables[tableIndex].columns.push("");
                            newTables[tableIndex].rows = newTables[tableIndex].rows.map(row => [...row, ""]);
                            setTables(newTables);
                          }}
                          className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs font-medium"
                          title="Add Column"
                        >
                          + Col
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {table.rows.map((row, rowIndex) => (
                      <tr key={rowIndex} className="hover:bg-gray-50">
                        <td className="border-2 border-gray-400 p-2 text-center font-semibold text-gray-600 bg-gray-100">
                          {rowIndex + 1}
                        </td>
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="border-2 border-gray-400 p-1">
                  <input
                    type="text"
                              value={cell}
                    onChange={(e) => {
                                const newTables = [...tables];
                                newTables[tableIndex].rows[rowIndex][cellIndex] = e.target.value;
                                setTables(newTables);
                    }}
                              className="w-full px-3 py-2 border border-gray-200 rounded focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none"
                              placeholder="Enter value"
                            />
                          </td>
                        ))}
                        <td className="border-2 border-gray-400 p-2 text-center bg-gray-50">
                          <span className="text-xs text-gray-400">→</span>
                        </td>
                      </tr>
                ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const newTables = [...tables];
                    const newRow = new Array(table.columns.length || 1).fill("");
                    newTables[tableIndex].rows.push(newRow);
                    setTables(newTables);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Row
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setTables([...tables, { title: "", columns: ["Column 1", "Column 2"], rows: [["", ""]] }])}
            className="inline-flex items-center gap-2 text-sm font-medium px-6 py-3 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 transition-all shadow-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Table
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
                { label: "", url: "", buttonText: "Click Here", otherInfo: "" },
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
                Update Job
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
