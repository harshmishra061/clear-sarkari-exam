"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CreateJobPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
  const [showImport, setShowImport] = useState(false);
  const [importJson, setImportJson] = useState("");

  const STORAGE_KEY = 'createJobFormData_v2'; // Changed key to avoid conflicts

  // Load saved form data on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          if (parsed.formData) setFormData(parsed.formData);
          if (parsed.importantDates) setImportantDates(parsed.importantDates);
          if (parsed.applicationFee) setApplicationFee(parsed.applicationFee);
          if (parsed.ageRange) setAgeRange(parsed.ageRange);
          if (parsed.vacancy) setVacancy(parsed.vacancy);
          if (parsed.tables) setTables(parsed.tables);
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
        applicationFee,
        ageRange,
        vacancy,
        tables,
        importantLinks,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    }, 1000); // 1 second debounce

    return () => clearTimeout(timer);
  }, [formData, importantDates, applicationFee, ageRange, vacancy, tables, importantLinks]);

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
      title: "Job Title Here",
      slug: "job-slug-here",
      organization: "Organization Name",
      description: "Detailed job description...",
      vacancy: 100,
      status: "active",
      seo: {
        title: "SEO Title",
        description: "SEO Description"
      },
      importantDates: [
        { label: "Application Begin", date: "DD/MM/YYYY" },
        { label: "Last Date", date: "DD/MM/YYYY" }
      ],
      applicationFee: [
        { category: "General/UR/OBC", amount: 500 },
        { category: "SC/ST/PWD", amount: 250 }
      ],
      ageRange: [
        { title: "Minimum Age", value: "18 Years" },
        { title: "Maximum Age", value: "30 Years" },
        { title: "Age as on", value: "DD/MM/YYYY" }
      ],
      table: [
        {
          title: "Table Title (e.g., Post Details)",
          columns: ["Column 1", "Column 2", "Column 3"],
          rows: [
            ["Row 1 Cell 1", "Row 1 Cell 2", "Row 1 Cell 3"],
            ["Row 2 Cell 1", "Row 2 Cell 2\nMultiline text", "Row 2 Cell 3"]
          ]
        }
      ],
      importantLinks: [
        {
          label: "Apply Online",
          url: "https://example.com",
          buttonText: "Click Here",
          otherInfo: "Additional information (optional)"
        },
        {
          label: "Download Notification",
          url: "https://example.com/notification.pdf",
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
    
    if (data.title !== undefined) setFormData(prev => ({ ...prev, title: data.title }));
    if (data.slug !== undefined) setFormData(prev => ({ ...prev, slug: data.slug }));
    if (data.organization !== undefined) setFormData(prev => ({ ...prev, organization: data.organization }));
    if (data.description !== undefined) setFormData(prev => ({ ...prev, description: data.description }));
    if (data.status !== undefined) setFormData(prev => ({ ...prev, status: data.status }));
    if (data.importantDates) setImportantDates(data.importantDates);
    if (data.applicationFee) setApplicationFee(data.applicationFee.map((f: { category: string; amount: number | string }) => ({ ...f, amount: f.amount.toString() })));
    if (data.ageRange) setAgeRange(data.ageRange);
      if (data.vacancy !== undefined) setVacancy(data.vacancy.toString());
      if (data.table) setTables(data.table);
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

      const response = await fetch("/api/admin/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // Clear saved form data on successful creation
        localStorage.removeItem(STORAGE_KEY);
        alert("Job created successfully!");
        router.push("/admin/jobs");
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error creating job:", error);
      alert("Failed to create job");
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
        <h1 className="text-3xl font-bold text-gray-900">Create New Job</h1>
        <p className="text-gray-500 mt-2">Fill in the details below to create a new job posting</p>
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
  "title": "Railway Recruitment 2026",
  "organization": "Indian Railways",
  "description": "Job description here...",
  "importantDates": [{"label": "Application Begin", "date": "2026-01-20"}],
  "applicationFee": [{"category": "General", "amount": 500}],
  "ageRange": [{"title": "Minimum Age", "value": "18 Years"}],
  "vacancy": 100,
  "table": [{"title": "Post Details", "columns": ["Post Name", "Height"], "rows": [["Constable", "168 CMS (160 CMS ST)\\n152 CMS Female"]]}],
  "importantLinks": [{"label": "Official Website", "url": "https://example.com"}]
}

Note: Use \\n in table cells for line breaks (each line appears on new line)`}
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

        {/* Age Range */}
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
                Creating...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Create Job
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
