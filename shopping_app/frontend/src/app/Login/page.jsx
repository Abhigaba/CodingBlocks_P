"use client"
import { useState } from 'react';
import { Eye, EyeOff, LogIn, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '../contexts/useAuthContext';
import Link from 'next/link';

const page = () => {

  const router = useRouter()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const {info, setinfo} = useAuthContext() ;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
    
      setinfo((prev) => ({name: data.data.name, email: data.data.email, isAdmin: data.data.isAdmin, _id : data.data.user_id }));
      router.push('/')
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  const formContent = (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 text-sm sm:text-base transition-colors duration-200"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="mt-1 relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 text-sm sm:text-base transition-colors duration-200"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
            Remember me
          </label>
        </div>

        <div className="text-sm">
          <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
            Forgot password?
          </a>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 sm:py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <LogIn className="h-5 w-5 mr-2" />
              Sign in
            </>
          )}
        </button>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen">
      {/* Mobile/Tablet View */}
      <div className="lg:hidden min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6">
        <div className="max-w-md w-full space-y-8 bg-white p-6 sm:p-8 rounded-2xl shadow-xl">
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 relative mb-6">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <path
                  d="M20,80 Q30,95 50,80 Q70,95 80,80 Q90,65 80,50 Q70,35 50,50 Q30,35 20,50 Q10,65 20,80"
                  fill="#4F46E5"
                  className="drop-shadow-md"
                />
                <path
                  d="M30,70 Q50,85 70,70"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2"
                  className="drop-shadow-sm"
                />
              </svg>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              SoleStyle
            </h1>
            <h2 className="mt-2 text-center text-xl font-semibold text-gray-900">
              Welcome Back
            </h2>
            <p className="mt-2 text-center text-sm sm:text-base text-gray-600">
              Sign in to continue your shopping journey
            </p>
          </div>

          {formContent}

          <p className="text-center text-sm sm:text-base text-gray-600">
            Don't have an account?{' '}
            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
              Sign up now
            </a>
          </p>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:flex min-h-screen flex-row">
        {/* Left Side - Logo and Brand */}
        <div className="w-1/2 bg-gradient-to-br from-indigo-500 to-indigo-700 p-8 flex flex-col items-center justify-center">
          <div className="w-64 h-64 relative mb-6">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <path
                d="M20,80 Q30,95 50,80 Q70,95 80,80 Q90,65 80,50 Q70,35 50,50 Q30,35 20,50 Q10,65 20,80"
                fill="white"
                className="drop-shadow-lg"
              />
              <path
                d="M30,70 Q50,85 70,70"
                fill="none"
                stroke="#E0E7FF"
                strokeWidth="2"
                className="drop-shadow-md"
              />
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-white tracking-tight mb-4">
            SoleStyle
          </h1>
          <p className="text-indigo-100 text-2xl text-center max-w-md">
            Step into comfort, walk with style
          </p>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-1/2 bg-gray-50 p-16 flex items-center justify-center">
          <div className="max-w-md w-full space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
              <p className="mt-2 text-gray-600">Sign in to continue your shopping journey</p>
            </div>

            {formContent}

            <p className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/Signup" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
                Sign up now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;