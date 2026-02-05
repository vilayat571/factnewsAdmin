import  { useState, useEffect } from "react";
import Layout from "../layout/Layout";
import { Trash2, Mail, Search, RefreshCw, Users, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";

interface Subscriber {
  _id: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const Emails = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalSubscribers, setTotalSubscribers] = useState(0);
  const [filterActive, setFilterActive] = useState<string>("all");
  const limit = 10;

  // Fetch subscribers
  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const params: any = {
        page: currentPage,
        limit: limit,
      };

      if (filterActive !== "all") {
        params.isActive = filterActive === "active";
      }

      const response = await axios.get("https://agsanews-production.up.railway.app/api/v1/subscribers", { params });

      setSubscribers(response.data.subscribers);
      setTotalSubscribers(response.data.total);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Xəta baş verdi");
    } finally {
      setLoading(false);
    }
  };

  // Delete subscriber
  const handleDelete = async (id: string, email: string) => {
    if (!window.confirm(`"${email}" silmək istədiyinizdən əminsiniz?`)) {
      return;
    }

    try {
      await axios.delete(`https://agsanews-production.up.railway.app/api/v1/subscribers/${id}`);
      toast.success("Abunəçi silindi");
      fetchSubscribers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Silinmə zamanı xəta baş verdi");
    }
  };

  // Filter subscribers by search
  const filteredSubscribers = subscribers.filter((subscriber) =>
    subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(totalSubscribers / limit);

  // Load subscribers on mount and when filters change
  useEffect(() => {
    fetchSubscribers();
  }, [currentPage, filterActive]);

  return (
    <Layout>
      <div className="p-6 w-3/4 mx-auto bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Email Abunəçiləri</h1>
          <p className="text-gray-600">Bütün email abunəçilərini idarə edin</p>
        </div>

        {/* Stats Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm mb-1">Ümumi Abunəçi</p>
                <h3 className="text-3xl font-bold">{totalSubscribers}</h3>
              </div>
              <Users className="w-12 h-12 text-blue-200" />
            </div>
          </div>

          <div className="bg-green-500 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm mb-1">Aktiv</p>
                <h3 className="text-3xl font-bold">
                  {subscribers.filter((s) => s.isActive).length}
                </h3>
              </div>
              <Mail className="w-12 h-12 text-green-200" />
            </div>
          </div>

          <div className="bg-gray-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-100 text-sm mb-1">Deaktiv</p>
                <h3 className="text-3xl font-bold">
                  {subscribers.filter((s) => !s.isActive).length}
                </h3>
              </div>
              <AlertCircle className="w-12 h-12 text-gray-200" />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Email axtar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilterActive("all")}
                className={`px-4 cursor-pointer py-2 rounded-lg font-medium transition ${
                  filterActive === "all"
                    ? "bg-orange-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Hamısı
              </button>
              <button
                onClick={() => setFilterActive("active")}
                className={`px-4 cursor-pointer py-2 rounded-lg font-medium transition ${
                  filterActive === "active"
                    ? "bg-orange-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Aktiv
              </button>
              <button
                onClick={() => setFilterActive("inactive")}
                className={`px-4 cursor-pointer py-2 rounded-lg font-medium transition ${
                  filterActive === "inactive"
                    ? "bg-orange-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Deaktiv
              </button>
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchSubscribers}
              disabled={loading}
              className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : filteredSubscribers.length === 0 ? (
            <div className="text-center py-20">
              <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Heç bir abunəçi tapılmadı</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Tarix
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Əməliyyat
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredSubscribers.map((subscriber, index) => (
                    <tr
                      key={subscriber._id}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {(currentPage - 1) * limit + index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-800">
                            {subscriber.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {subscriber.isActive ? (
                          <span className="px-3 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                            Aktiv
                          </span>
                        ) : (
                          <span className="px-3 py-1 text-xs font-semibold text-gray-800 bg-gray-100 rounded-full">
                            Deaktiv
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(subscriber.createdAt).toLocaleDateString("az-AZ")}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <button
                            onClick={() => handleDelete(subscriber._id, subscriber.email)}
                            className="p-2 cursor-pointer text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Sil"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Əvvəlki
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 cursor-pointer py-2 rounded-lg transition ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Sonrakı
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Emails;