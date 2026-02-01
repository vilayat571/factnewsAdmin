import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * LoginPage Component
 * Handles user authentication with username and password
 * Sends credentials to API and stores token on success
 */
const LoginPage: React.FC = () => {
  // Navigation hook to redirect after successful login
  const navigate = useNavigate();
  
  // Form state - stores username and password
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  
  // Loading state - shows when API request is in progress
  const [isLoading, setIsLoading] = useState(false);
  
  // Error state - stores error messages to show user
  const [error, setError] = useState('');
  
  /**
   * Handles input field changes
   * Updates formData state when user types
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };
  
  /**
   * Handles form submission
   * Sends login request to API
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload
    
    // Validate inputs
    if (!formData.username || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Send POST request to login API
      const response = await fetch('http://localhost:3000/api/v1/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      });
      
      const data = await response.json();
      
      // Check if login was successful
      if (response.ok && data.token) {
        // Store token in localStorage
        localStorage.setItem('authToken', data.token);
        
        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        // Show error message from API or default message
        setError(data.message || 'Invalid username or password');
      }
    } catch (err) {
      // Handle network errors
      setError('Unable to connect to server. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-linear-to-br from-black via-zinc-800 to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-orange-700 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>
      
      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-black/40 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-orange-500/20 animate-fadeIn">
          {/* Logo/Title Section */}
          <div className="text-center mb-8 animate-slideDown">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-orange-500 to-orange-500 rounded-full mb-4 shadow-lg shadow-orange-500/50">
              <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-orange-300">Sign in to your account</p>
          </div>
          
          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Input */}
            <div className="animate-slideUp animation-delay-200">
              <label htmlFor="username" className="block text-sm font-medium text-orange-200 mb-2">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-black/50 border border-orange-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                placeholder="Enter your username"
                disabled={isLoading}
              />
            </div>
            
            {/* Password Input */}
            <div className="animate-slideUp animation-delay-400">
              <label htmlFor="password" className="block text-sm font-medium text-orange-200 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-black/50 border border-orange-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                placeholder="Enter your password"
                disabled={isLoading}
              />
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 animate-shake">
                <p className="text-red-200 text-sm text-center">{error}</p>
              </div>
            )}
            
            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-linear-to-r from-orange-600 to-orange-500 text-black font-semibold rounded-lg shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none animate-slideUp animation-delay-600"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
          
          {/* Footer */}
          <div className="mt-6 text-center animate-fadeIn animation-delay-800">
            <p className="text-orange-300/70 text-sm">
              Secure login with encrypted credentials
            </p>
          </div>
        </div>
      </div>
      
      {/* Custom CSS for animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          10%, 30%, 50%, 70%, 90% {
            transform: translateX(-5px);
          }
          20%, 40%, 60%, 80% {
            transform: translateX(5px);
          }
        }
        
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        
        .animate-slideDown {
          animation: slideDown 0.6s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-out;
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
        
        .animation-delay-800 {
          animation-delay: 0.8s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;