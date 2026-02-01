import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { formats, modules } from "../utilites/quillConfig.ts";
import { useState, type FormEvent, type ChangeEvent } from "react";
import { API_ENDPOINT, AUTHORS, CATEGORIES } from "../constants/createNews";

const getInitialFormData = (): NewsFormData => ({
  title: "",
  body: "",
  description: "",
  date: new Date().toISOString().split("T")[0],
  category: "",
  author: "",
});

const App = () => {
  const [formData, setFormData] = useState<NewsFormData>(getInitialFormData());
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // ==================== HANDLERS ====================

  /**
   * Handle input change for text inputs and select elements
   */
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ): void => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  /**
   * Handle rich text editor content change
   */
  const handleContentChange = (value: string): void => {
    setContent(value);

    if (formErrors.body) {
      setFormErrors((prev) => ({
        ...prev,
        body: undefined,
      }));
    }
  };

  /**
   * Validate form data before submission
   */
  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.title.trim()) {
      errors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }

    // description
    if (!formData.author) {
      errors.author = "Please select an author";
    }

    if (!formData.category) {
      errors.category = "Please select a category";
    }

    if (!content.trim() || content === "<p><br></p>") {
      errors.body = "Article content is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Reset form to initial state
   */
  /*   const resetForm = (): void => {
    setFormData(getInitialFormData());
    setContent("");
    setFormErrors({});
  }; */

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    // Clear previous messages
    setError("");
    setSuccess("");

    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          body: content,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Server error: ${response.status}`,
        );
      }

      setSuccess("✅ News article created successfully!");
      // resetForm();

      // Auto-hide success message after 5 seconds
      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again.";

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ==================== RENDER ====================
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Create News Article
          </h1>
          <p className="text-gray-600">
            Share the latest news with your audience
          </p>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm">
            <div className="flex items-center">
              <div className="shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="ml-3 text-sm text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg shadow-sm">
            <div className="flex items-center">
              <div className="shrink-0">
                <svg
                  className="h-5 w-5 text-green-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="ml-3 text-sm text-green-700 font-medium">
                {success}
              </p>
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Input */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Article Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border ${
                  formErrors.title ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none`}
                placeholder="Enter an engaging title for your article"
              />
              {formErrors.title && (
                <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
              )}
            </div>

            {/* Title Input */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Article Description <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border ${
                  formErrors.description ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none`}
                placeholder="Enter an engaging title for your article"
              />
              {formErrors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.description}
                </p>
              )}
            </div>

            {/* Author and Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Author Select */}
              <div>
                <label
                  htmlFor="author"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Author <span className="text-red-500">*</span>
                </label>
                <select
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border ${
                    formErrors.author ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none appearance-none bg-white cursor-pointer`}
                >
                  <option value="">Select an author</option>
                  {AUTHORS.map((author) => (
                    <option key={author} value={author}>
                      {author}
                    </option>
                  ))}
                </select>
                {formErrors.author && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.author}
                  </p>
                )}
              </div>

              {/* Category Select */}
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border ${
                    formErrors.category ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none appearance-none bg-white cursor-pointer`}
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((category) => (
                    <option key={category.label} value={category.label}>
                      {category.value}
                    </option>
                  ))}
                </select>
                {formErrors.category && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.category}
                  </p>
                )}
              </div>
            </div>

            {/* Date Input */}
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Publication Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
              />
            </div>

            {/* Rich Text Editor */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Article Content <span className="text-red-500">*</span>
              </label>
              <div
                className={`rounded-lg overflow-hidden border ${
                  formErrors.body ? "border-red-500" : "border-gray-300"
                }`}
              >
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={handleContentChange}
                  modules={modules}
                  formats={formats}
                  placeholder="Write your article content here... Share the full story with rich formatting."
                  className="bg-white"
                  style={{ height: "350px" }}
                />
              </div>
              {formErrors.body && (
                <p className="mt-14 text-sm text-red-600">{formErrors.body}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 mt-16">
              <button
                type="button"
                // onClick={resetForm}
                disabled={loading}
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Reset Form
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-linear-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Publishing...
                  </span>
                ) : (
                  "Publish Article"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            All fields marked with <span className="text-red-500">*</span> are
            required
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
