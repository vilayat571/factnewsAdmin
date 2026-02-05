import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, AlertCircle } from "lucide-react";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="text-center">
          {/* Animated Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-red-400 rounded-full blur-2xl opacity-20 animate-pulse"></div>
              <AlertCircle className="w-24 h-24 text-red-500 relative animate-bounce" />
            </div>
          </div>

          {/* 404 Text */}
          <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-black mb-4 animate-pulse">
            404
          </h1>

          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Səhifə Tapılmadı
          </h2>

          {/* Message */}
          <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
            Axtardığınız səhifə mövcud deyil və ya köçürülüb. Zəhmət olmasa əsas səhifəyə qayıdın.
          </p>

          {/* Divider */}
          <div className="flex items-center justify-center mb-8">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-64"></div>
          </div>

          {/* Button */}
          <button
            onClick={handleGoHome}
            className="group relative inline-flex items-center gap-2 bg-orange-600 cursor-pointer text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            <span className="absolute inset-0  opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <Home className="w-5 h-5 relative z-10" />
            <span className="relative z-10">Ana Səhifəyə Qayıt</span>
          </button>

        </div>
      </div>
    </div>
  );
};

export default NotFound;