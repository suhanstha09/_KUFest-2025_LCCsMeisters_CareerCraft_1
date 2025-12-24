'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Button } from '@/components/ui/button';
import { Zap, Mail, Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { ModeToggle } from '@/components/ToggleButton';
import { useLogin } from '@/hooks/useAuth';
import { getErrorMessage } from '@/features/auth/lib/utils';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { mutate: login, isPending, isError, error } = useLogin();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    login(
      { email: formData.email, password: formData.password },
      {
        onSuccess: (response) => {
          // Store the access token in cookies
          if (response.access_token || response.access) {
            const token = response.access_token || response.access;
            Cookies.set('access_token', token, { expires: 7 }); // 7 days

            // Store refresh token if available
            if (response.refresh_token || response.refresh) {
              const refreshToken = response.refresh_token || response.refresh;
              Cookies.set('refresh_token', refreshToken, { expires: 30 }); // 30 days
            }
          }

          // Redirect to onboarding
          router.push('/onboarding');
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 sm:px-12 bg-white/5 dark:bg-slate-900/50 backdrop-blur-sm border-b border-white/10">
        <Link href="/" className="flex items-center gap-2">
          <Zap className="h-8 w-8 text-purple-400" />
          <span className="text-2xl font-bold text-white">SkillSetz</span>
        </Link>
        <div className="flex gap-4 items-center">
          <ModeToggle />
          <Link href="/signup">
            <Button className="bg-purple-600 hover:bg-purple-700">Sign Up</Button>
          </Link>
        </div>
      </nav>

      <div className="flex items-center justify-center py-12 px-4 sm:px-6">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-purple-500/20 p-8 sm:p-10 shadow-lg dark:shadow-none">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome Back</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              Sign in to continue your journey
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Message */}
              {isError && error && (
                <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800 dark:text-red-300">
                    {getErrorMessage(error)}
                  </p>
                </div>
              )}

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400 dark:text-slate-500" />
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isPending}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-purple-500 focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400 dark:text-slate-500" />
                  <input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isPending}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-purple-500 focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                  />
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 cursor-pointer"
                  />
                  <span className="text-slate-600 dark:text-slate-400">Remember me</span>
                </label>
                <a href="#" className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300">
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium transition mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Sign Up Link */}
            <p className="text-center text-slate-600 dark:text-slate-400 mt-6">
              Don't have an account?{' '}
              <Link href="/signup" className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
