import Layout from "../layout/Layout";
import { useState, useEffect, useCallback, type ChangeEvent } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { formats, modules } from "../utilites/quillConfig.ts";
import { API_ENDPOINT, AUTHORS, CATEGORIES } from "../constants/createNews";
import {
  Search,
  Tag,
  User,
  Calendar,
  FileText,
  Pencil,
  X,
  CircleX,
  CircleCheck,
  Loader,
} from "lucide-react";
import type { EditFormData, NewsItem } from "../types/editNews";

const EditNews = () => {
  // Search and Pagination States
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // Modal and Edit States
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    title: "",
    body: "",
    category: "",
    author: "",
    date: "",
  });
  const [content, setContent] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch news list
  const fetchNews = useCallback(async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        ...(debouncedSearch && { title: debouncedSearch }),
      });

      const response = await fetch(
        `${API_ENDPOINT}/?${queryParams}`,
      );

      if (!response.ok) throw new Error("Failed to fetch news");

      const data = await response.json();

      if (data.status === "OK") {
        if (currentPage === 1) {
          setNewsList(data.news);
        } else {
          setNewsList((prev) => [...prev, ...data.news]);
        }
        setHasMore(data.news.length === 10);
      }
    } catch (err) {
      console.error("Error fetching news:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, debouncedSearch]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // Handle search input change
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Load more news (pagination)
  const handleLoadMore = () => {
    setCurrentPage((prev) => prev + 1);
  };

  // Open modal and fetch full news details
  const handleEditClick = async (news: NewsItem) => {
    setSelectedNews(news);
    setIsModalOpen(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${API_ENDPOINT}/${news._id}`,
      );
      const data = await response.json();

      if (data.status === "OK") {
        setEditFormData({
          title: data.news.title,
          body: data.news.body,
          category: data.news.category,
          author: data.news.author,
          date: data.news.date.split("T")[0],
        });
        setContent(data.news.body || "");
      }
    } catch (err) {
      console.error("Error fetching news details:", err);
      setError("Failed to load news details");
    }
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNews(null);
    setEditFormData({
      title: "",
      body: "",
      category: "",
      author: "",
      date: "",
    });
    setContent("");
    setError("");
    setSuccess("");
  };

  // Handle form input changes
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle content change
  const handleContentChange = (value: string) => {
    setContent(value);
    setEditFormData((prev) => ({
      ...prev,
      body: value,
    }));
  };

  // Submit edited news
  const handleSubmit = async () => {
    if (!selectedNews) return;

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const params = new URLSearchParams();
      params.append("title", editFormData.title);
      params.append("body", content);
      params.append("category", editFormData.category);
      params.append("author", editFormData.author);
      params.append("date", editFormData.date);

      const response = await fetch(
        `${API_ENDPOINT}/${selectedNews._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: params.toString(),
        },
      );

      const data = await response.json();

      if (response.ok && data.status === "OK") {
        setSuccess("✅ Xəbər uğurla yeniləndi!");

        setNewsList((prev) =>
          prev.map((item) =>
            item._id === selectedNews._id ? { ...item, ...editFormData } : item,
          ),
        );

        setTimeout(() => {
          handleCloseModal();
        }, 2000);
      } else {
        setError(data.message || "Xəbər yenilənmədi");
      }
    } catch (err) {
      setError("Xəta baş verdi. Yenidən cəhd edin.");
      console.error("Error updating news:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen pt-3">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Xəbərləri Redaktə Et
            </h1>
            <p className="text-gray-600">Xəbərləri axtarın və redaktə edin</p>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Xəbər başlığına görə axtar..."
                className="w-full px-5 py-3 pl-12 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 outline-none"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* News List */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {isLoading && currentPage === 1 ? (
              <div className="flex justify-center items-center py-20">
                <Loader className="animate-spin h-10 w-10 text-orange-500" />
              </div>
            ) : newsList.length === 0 ? (
              <div className="text-center py-20">
                <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg">Xəbər tapılmadı</p>
              </div>
            ) : (
              <>
                <div className="divide-y divide-gray-200">
                  {newsList.map((news) => (
                    <div
                      key={news._id}
                      className="p-6 hover:bg-gray-50 transition-colors duration-150"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            {news.title}
                          </h3>
                          <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                            <span className="flex items-center">
                              <Tag className="w-4 h-4 mr-1" />
                              {news.category}
                            </span>
                            <span className="flex items-center">
                              <User className="w-4 h-4 mr-1" />
                              {news.author}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(news.date).toLocaleDateString("az-AZ")}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleEditClick(news)}
                          className="ml-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 flex items-center gap-2"
                        >
                          <Pencil className="w-4 h-4" />
                          Redaktə
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Load More Button */}
                {hasMore && (
                  <div className="p-6 bg-gray-50 border-t border-gray-200">
                    <button
                      onClick={handleLoadMore}
                      disabled={isLoading}
                      className="w-full py-3 px-4 bg-white border-2 border-orange-500 text-orange-500 font-semibold rounded-lg hover:bg-orange-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center">
                          <Loader className="animate-spin -ml-1 mr-3 h-5 w-5" />
                          Yüklənir...
                        </span>
                      ) : (
                        "Daha çox yüklə"
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20 p-4">
            <div className="bg-white rounded-md shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl">
                <h2 className="text-2xl font-bold text-gray-800">
                  Xəbəri Redaktə Et
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                {/* Alert Messages */}
                {error && (
                  <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm">
                    <div className="flex items-center">
                      <CircleX className="h-5 w-5 text-red-500 shrink-0" />
                      <p className="ml-3 text-sm text-red-700 font-medium">
                        {error}
                      </p>
                    </div>
                  </div>
                )}

                {success && (
                  <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg shadow-sm">
                    <div className="flex items-center">
                      <CircleCheck className="h-5 w-5 text-green-500 shrink-0" />
                      <p className="ml-3 text-sm text-green-700 font-medium">
                        {success}
                      </p>
                    </div>
                  </div>
                )}

                {/* Edit Form */}
                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Başlıq <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={editFormData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 outline-none"
                      placeholder="Xəbər başlığı"
                    />
                  </div>

                  {/* Author and Category */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Müəllif <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="author"
                        value={editFormData.author}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 outline-none appearance-none bg-white cursor-pointer"
                      >
                        <option value="">Müəllif seçin</option>
                        {AUTHORS.map((author) => (
                          <option key={author} value={author}>
                            {author}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Kateqoriya <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="category"
                        value={editFormData.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 outline-none appearance-none bg-white cursor-pointer"
                      >
                        <option value="">Kateqoriya seçin</option>
                        {CATEGORIES.map((category) => (
                          <option key={category.label} value={category.label}>
                            {category.value}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tarix <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={editFormData.date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 outline-none"
                    />
                  </div>

                  {/* Rich Text Editor */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Məzmun <span className="text-red-500">*</span>
                    </label>
                    <div
                      className="rounded-lg border border-gray-300"
                    >
                      <ReactQuill
                        theme="snow"
                        value={content}
                        onChange={handleContentChange}
                        modules={modules}
                        formats={formats}
                        className="z-40"
                        placeholder="Xəbər məzmununu yazın..."
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-16">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      disabled={isSubmitting}
                      className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      Ləğv et
                    </button>

                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="flex-1 bg-linear-to-r from-orange-500 to-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                          Yenilənir...
                        </span>
                      ) : (
                        "Yadda saxla"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EditNews;
