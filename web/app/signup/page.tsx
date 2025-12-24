'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Zap, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { ModeToggle } from '@/components/ToggleButton';

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic here
    console.log('Form submitted:', formData);
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
          <Link href="/login">
            <Button variant="ghost" className="text-white hover:bg-purple-800">
              Login
            </Button>
          </Link>
        </div>
      </nav>

      <div className="flex items-center justify-center py-12 px-4 sm:px-6">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-purple-500/20 p-8 sm:p-10 shadow-lg dark:shadow-none">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Create Account</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              Start your skill-building journey today
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Input */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-slate-400 dark:text-slate-500" />
                  <input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-purple-500 focus:outline-none transition"
                    required
                  />
                </div>
              </div>

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
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-purple-500 focus:outline-none transition"
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
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-purple-500 focus:outline-none transition"
                    required
                  />
                </div>
              </div>

              {/* Confirm Password Input */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400 dark:text-slate-500" />
                  <input
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-purple-500 focus:outline-none transition"
                    required
                  />
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-3 py-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 w-4 h-4 rounded bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 cursor-pointer"
                  required
                />
                <label htmlFor="terms" className="text-sm text-slate-600 dark:text-slate-400">
                  I agree to the{' '}
                  <a href="#" className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300">
                    Privacy Policy
                  </a>
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium transition mt-6"
              >
                Create Account <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            {/* Login Link */}
            <p className="text-center text-slate-600 dark:text-slate-400 mt-6">
              Already have an account?{' '}
              <Link href="/login" className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
