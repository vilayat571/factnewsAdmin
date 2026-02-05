import { useState, useEffect } from "react";
import Layout from "../layout/Layout";
import { Trash2, Mail, Search, RefreshCw, MessageSquare, Eye, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";

interface Contact {
  _id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const Contacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalContacts, setTotalContacts] = useState(0);
  const [filterRead, setFilterRead] = useState<string>("all");
  const limit = 10;

  // Fetch contacts
  const fetchContacts = async () => {
    setLoading(true);
    try {
      const params: any = {
        page: currentPage,
        limit: limit,
      };

      if (filterRead !== "all") {
        params.isRead = filterRead === "read";
      }

      const response = await axios.get("https://agsanews-production.up.railway.app/api/v1/contacts", { params });

      setContacts(response.data.contacts);
      setTotalContacts(response.data.total);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Xəta baş verdi");
    } finally {
      setLoading(false);
    }
  };

  // Mark as read
  const handleMarkAsRead = async (id: string) => {
    try {
      await axios.put(`https://agsanews-production.up.railway.app/api/v1/contact/${id}/read`);
      toast.success("Oxundu olaraq işarələndi");
      fetchContacts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Xəta baş verdi");
    }
  };

  // Delete contact
  const handleDelete = async (id: string) => {
    if (!window.confirm("Silmək istədiyinizdən əminsiniz?")) {
      return;
    }

    try {
      await axios.delete(`https://agsanews-production.up.railway.app/api/v1/contact/${id}`);
      toast.success("Mesaj silindi");
      fetchContacts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Silinmə zamanı xəta baş verdi");
    }
  };

  // Filter contacts by search
  const filteredContacts = contacts && contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(totalContacts / limit);

  useEffect(() => {
    fetchContacts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filterRead]);

  return (
    <Layout>
      <div className="p-6 w-3/4 mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Əlaqə Mesajları</h1>
          <p className="text-gray-600">Bütün əlaqə mesajlarını idarə edin</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm mb-1">Ümumi Mesaj</p>
                <h3 className="text-3xl font-bold">{totalContacts}</h3>
              </div>
              <MessageSquare className="w-12 h-12 text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm mb-1">Oxunmuş</p>
                <h3 className="text-3xl font-bold">
                  {contacts.filter((c) => c.isRead).length}
                </h3>
              </div>
              <Eye className="w-12 h-12 text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm mb-1">Oxunmamış</p>
                <h3 className="text-3xl font-bold">
                  {contacts.filter((c) => !c.isRead).length}
                </h3>
              </div>
              <AlertCircle className="w-12 h-12 text-orange-200" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Ad və ya email axtar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilterRead("all")}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filterRead === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Hamısı
              </button>
              <button
                onClick={() => setFilterRead("unread")}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filterRead === "unread"
                    ? "bg-orange-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Oxunmamış
              </button>
              <button
                onClick={() => setFilterRead("read")}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filterRead === "read"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Oxunmuş
              </button>
            </div>

            {/* Refresh */}
            <button
              onClick={fetchContacts}
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
          ) : filteredContacts.length === 0 ? (
            <div className="text-center py-20">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Heç bir mesaj tapılmadı</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      #
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      Ad
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      Mesaj
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      Tarix
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">
                      Əməliyyat
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredContacts.map((contact, index) => (
                    <tr
                      key={contact._id}
                      className={`hover:bg-gray-50 transition ${
                        !contact.isRead ? "bg-blue-50" : ""
                      }`}
                    >
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {(currentPage - 1) * limit + index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">
                        {contact.name}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-800">{contact.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {contact.message}
                      </td>
                      <td className="px-6 py-4">
                        {contact.isRead ? (
                          <span className="px-3 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                            Oxunub
                          </span>
                        ) : (
                          <span className="px-3 py-1 text-xs font-semibold text-orange-800 bg-orange-100 rounded-full">
                            Yeni
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(contact.createdAt).toLocaleDateString("az-AZ")}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          {!contact.isRead && (
                            <button
                              onClick={() => handleMarkAsRead(contact._id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                              title="Oxundu"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(contact._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
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
                className={`px-4 py-2 rounded-lg transition ${
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

export default Contacts;