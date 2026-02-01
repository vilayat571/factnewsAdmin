import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Layout from "../layout/Layout";

// ─── Types ───────────────────────────────────────────────────
interface NewsItem {
  _id: string;
  title: string;
  category: string;
  date: string;
  image?: string;
}

// ─── Constants ───────────────────────────────────────────────
const API_URL = "https://agsanews-production.up.railway.app/api/v1/news";
const DELETE_URL =
  "https://agsanews-production.up.railway.app/api/v1/news/delete";
const ITEMS_PER_PAGE = 10;
const DEBOUNCE_DELAY = 400;

// ─── useDebounce Hook ────────────────────────────────────────
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// ─── AllNews Component ───────────────────────────────────────
const AllNews = () => {
  const navigate = useNavigate();
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // ─── Search & Filter State ─────────────────────────────────
  const [searchInput, setSearchInput] = useState<string>("");
  const [categoryInput, setCategoryInput] = useState<string>("");
  const debouncedSearch = useDebounce(searchInput, DEBOUNCE_DELAY);
  const debouncedCategory = useDebounce(categoryInput, DEBOUNCE_DELAY);

  const isInitialMount = useRef(true);

  // ─── Fetch News ──────────────────────────────────────────
  const fetchNews = useCallback(async (page: number, title: string, category: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: String(ITEMS_PER_PAGE),
        page: String(page),
      });
      if (title.trim()) params.set("title", title.trim());
      if (category.trim()) params.set("category", category.trim());

      const response = await fetch(`${API_URL}?${params.toString()}`);
      const data = await response.json();

      if (data.status === "OK") {
        setNewsList(data.news);
        const hasMore = data.news.length === ITEMS_PER_PAGE;
        setTotalPages(hasMore ? page + 1 : page);
      }
    } catch (error) {
      console.error("Failed to fetch news:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Initial fetch on mount ────────────────────────────────
  useEffect(() => {
    fetchNews(1, "", "");
  }, [fetchNews]);

  // ─── Re-fetch when debounced search/category changes ───────
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    setCurrentPage(1);
    fetchNews(1, debouncedSearch, debouncedCategory);
  }, [debouncedSearch, debouncedCategory, fetchNews]);

  // ─── Re-fetch on page change ────────────────────────────────
  useEffect(() => {
    if (isInitialMount.current) return;
    fetchNews(currentPage, debouncedSearch, debouncedCategory);
  }, [currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Delete News ─────────────────────────────────────────
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${DELETE_URL}/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (data.status === "OK") {
        setNewsList((prev) => prev.filter((item) => item._id !== id));
      } else {
        alert(data.message || "Delete failed");
      }
    } catch (error) {
      console.error("Failed to delete news:", error);
      alert("Something went wrong");
    } finally {
      setDeleteId(null);
    }
  };

  // ─── Pagination Handlers ─────────────────────────────────
  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // ─── Clear Filters ──────────────────────────────────────
  const handleClearFilters = () => {
    setSearchInput("");
    setCategoryInput("");
  };

  const hasActiveFilters = searchInput.trim() !== "" || categoryInput.trim() !== "";

  // ─── Render ──────────────────────────────────────────────
  return (
 <Layout>
     <div className=" xl:w-3/4 lg:w-3/4 md:w-full sm:w-full mx-auto xl:p-6 lg:p-6 md:p-0 sm:p-0">

      {/* Back to Dashboard Button */}
      <button
        onClick={() => navigate("/dashboard")}
        className="flex cursor-pointer items-center gap-2 text-sm text-gray-600 hover:text-orange-500 transition-colors duration-200 mb-6"
      >
        <ArrowLeft size={18} />
        <span> Dashboard</span>
      </button>

      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Bütün xəbərlər</h1>

      {/* ─── Search & Filter Bar ─────────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Title Search Input */}
          <div className="flex-1 relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <input
              type="text"
              placeholder="Search by title..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
            />

            {searchInput && (
              <button
                onClick={() => setSearchInput("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Category Filter Input */}
          <div className="relative" style={{ minWidth: "180px" }}>
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5a2 2 0 012 2v13a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2zm7.75 2.25a3.75 3.75 0 113 1.219A3.75 3.75 0 0114.75 5.25z" />
              </svg>
            </div>

            <input
              type="text"
              placeholder="Filter by category..."
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
            />

            {categoryInput && (
              <button
                onClick={() => setCategoryInput("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Clear All Button */}
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 cursor-pointer.5 text-sm text-orange-600 border border-orange-300 rounded-lg hover:bg-orange-50 transition-colors duration-200 whitespace-nowrap"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="text-gray-500 text-lg">Loading...</div>
        </div>
      )}

      {/* Empty State */}
      {!loading && newsList.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-gray-500 text-lg">
            {hasActiveFilters ? "No news matched your filters" : "No news found"}
          </div>
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="mt-3 text-sm text-orange-600 hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* News Cards Grid */}
      {!loading && newsList.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsList.map((news) => (
            <div
              key={news._id}
              className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col"
            >
              {news.image && (
                <img
                  src={news.image}
                  alt={news.title}
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="p-4 flex flex-col grow">
                <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full w-fit mb-2">
                  {news.category}
                </span>

                <h2 className="text-xl font-semibold text-gray-800 mb-1">
                  {news.title}
                </h2>

                <p className="text-sm text-gray-400 mb-4">
                  {new Date(news.date).toLocaleDateString()}
                </p>

                <div className="mt-auto">
                  <button
                    onClick={() => setDeleteId(news._id)}
                    className="w-full bg-orange-500 text-white text-lg  font-medium py-2 inline px-4 rounded-lg transition-colors duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── Pagination ────────────────────────────────────── */}
      {!loading && newsList.length > 0 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-2 cursor-pointer bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Previous
          </button>
          <span className="text-gray-600 font-medium">
            Page {currentPage}
          </span>
          <button
            onClick={goToNextPage}
            disabled={currentPage >= totalPages}
            className="px-4 py-2 cursor-pointer bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Next
          </button>
        </div>
      )}

      {/* ─── Delete Confirm Modal ──────────────────────────── */}
      {deleteId && (
        <div className="fixed inset-0 bg-white bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-80 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Confirm Delete
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              Are you sure you want to delete this news item?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 cursor-pointer border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 text-sm transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 cursor-pointer bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
 </Layout>
  );
};

export default AllNews;