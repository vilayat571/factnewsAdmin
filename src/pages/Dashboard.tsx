import { useState, useEffect } from "react";
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

// ─── Stat Card ───────────────────────────────────────────────
const StatCard = ({
  title,
  value,
  icon,
  color,
  sub,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  sub: string;
}) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-4">
    <div className={`${color} w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0`}>
      {icon}
    </div>
    <div>
      <p className="text-xs text-gray-400 font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-800 mt-0.5">{value}</p>
      <p className="text-xs text-gray-400 mt-1">{sub}</p>
    </div>
  </div>
);

// ─── Dashboard Component ────────────────────────────────────
const Dashboard = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // ─── Fetch all news ──────────────────────────────────────
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`${API_URL}?limit=100`);
        const data = await response.json();
        if (data.status === "OK") {
          setNews(data.news);
        }
      } catch (error) {
        console.error("Failed to fetch news:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  // ─── Derive stats ────────────────────────────────────────
  const totalNews = news.length;

  const categoryMap: Record<string, number> = {};
  news.forEach((item) => {
    categoryMap[item.category] = (categoryMap[item.category] || 0) + 1;
  });
  const categories = Object.keys(categoryMap).length;

  const today = new Date().toDateString();
  const todayNews = news.filter(
    (item) => new Date(item.date).toDateString() === today
  ).length;

  const sortedCategories = Object.entries(categoryMap).sort(
    (a, b) => b[1] - a[1]
  );

  const recentNews = news.slice(0, 5);

  // ─── Format date ─────────────────────────────────────────
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // ─── Render ──────────────────────────────────────────────
  return (
    <Layout>
        <div className="xl:w-3/4 lg:w-3/4 md:w-full sm:w-full mx-auto p-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">
            Xəbər panelinin ümumi baxışı
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-24">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-gray-400 text-sm">Yüklənir...</span>
            </div>
          </div>
        )}

        {/* Content */}
        {!loading && (
          <>
            {/* ─── Stats Row ───────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard
                title="Ümumi Xəbər"
                value={totalNews}
                color="bg-orange-50"
                sub="Cəmi xəbər sayı"
                icon={
                  <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                }
              />

              <StatCard
                title="Kateqoriya"
                value={categories}
                color="bg-blue-50"
                sub="Müxtəlif kateqoriyalar"
                icon={
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                }
              />

              <StatCard
                title="Bu Gün"
                value={todayNews}
                color="bg-green-50"
                sub="Bugün əlave edilən"
                icon={
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                }
              />

              <StatCard
                title="Populyar Kateqoriya"
                value={sortedCategories.length > 0 ? sortedCategories[0][0] : "—"}
                color="bg-purple-50"
                sub={sortedCategories.length > 0 ? `${sortedCategories[0][1]} xəbər` : "Məlumat yoxdu"}
                icon={
                  <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                }
              />
            </div>

            {/* ─── Bottom: Recent News + Categories ────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Recent News */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-base font-bold text-gray-800">Son Xəbərler</h2>
                  <span className="text-xs text-orange-500 font-semibold bg-orange-50 px-3 py-1 rounded-full">
                    Son 5
                  </span>
                </div>

                {recentNews.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-8">Xəbər tapılmadı</p>
                ) : (
                  <div className="flex flex-col gap-4">
                    {recentNews.map((item, index) => (
                      <div
                        key={item._id}
                        className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                      >
                        {/* Number */}
                        <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center">
                          <span className="text-xs font-bold text-gray-500">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">
                              {item.category}
                            </span>
                            <span className="text-xs text-gray-400">{formatDate(item.date)}</span>
                          </div>
                          <p className="text-sm font-semibold text-gray-800 truncate">
                            {item.title}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Category Breakdown */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-base font-bold text-gray-800">Kateqoriyalar</h2>
                  <span className="text-xs text-blue-500 font-semibold bg-blue-50 px-3 py-1 rounded-full">
                    {categories} Eded
                  </span>
                </div>

                {sortedCategories.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-8">Kateqoriya tapılmadı</p>
                ) : (
                  <div className="flex flex-col gap-4">
                    {sortedCategories.map(([category, count]) => {
                      const percentage = totalNews > 0 ? (count / totalNews) * 100 : 0;
                      return (
                        <div key={category}>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-sm font-medium text-gray-700">{category}</span>
                            <span className="text-xs font-semibold text-gray-400">{count}</span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-orange-500 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;