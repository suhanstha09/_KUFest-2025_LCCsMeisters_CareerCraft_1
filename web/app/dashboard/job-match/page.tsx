'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Target,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Zap,
  Download,
} from 'lucide-react';

export default function JobMatch() {
  const [jobUrl, setJobUrl] = useState('');
  const [analyzed, setAnalyzed] = useState(false);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    setAnalyzed(true);
  };

  if (!analyzed) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Job Match Analyzer</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Paste a job posting link to see how well you match and what gaps to fill
          </p>
        </div>

        <form onSubmit={handleAnalyze} className="max-w-2xl">
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-purple-500/20 p-8 transition-colors">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-3">
              Job Posting URL
            </label>
            <input
              type="url"
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              placeholder="https://linkedin.com/jobs/... or any job posting link"
              className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none transition mb-6"
              required
            />
            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium"
            >
              Analyze Job Match
            </Button>
          </div>
        </form>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 transition-colors">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">What You'll Get</h3>
            <ul className="space-y-2 text-slate-700 dark:text-slate-300 text-sm">
              <li>✓ Overall job match percentage</li>
              <li>✓ Critical, important, and minor skill gaps</li>
              <li>✓ Hiring probability prediction</li>
              <li>✓ Personalized learning roadmap</li>
            </ul>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 transition-colors">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Supported Platforms</h3>
            <ul className="space-y-2 text-slate-700 dark:text-slate-300 text-sm">
              <li>✓ LinkedIn</li>
              <li>✓ Indeed</li>
              <li>✓ GitHub Jobs</li>
              <li>✓ Any company careers page</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with Back Button */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Senior React Developer</h1>
          <p className="text-slate-600 dark:text-slate-400">Google • San Francisco, CA</p>
        </div>
        <Button
          onClick={() => setAnalyzed(false)}
          variant="outline"
          className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          Analyze Another Job
        </Button>
      </div>

      {/* Overall Match Score */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/50 dark:to-pink-900/50 rounded-lg border border-purple-200 dark:border-purple-500/20 p-8 transition-colors">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Overall Match</h2>
          <Target className="h-8 w-8 text-purple-600 dark:text-purple-400" />
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="rgba(100, 116, 139, 0.2)"
                  strokeWidth="10"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="10"
                  strokeDasharray="141 282"
                  transform="rotate(-90 50 50)"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient
                    id="gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-slate-900 dark:text-white">75%</span>
              </div>
            </div>
            <p className="text-slate-700 dark:text-slate-300 font-medium">Overall Match</p>
          </div>

          <div className="flex flex-col justify-center">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Technical Skills</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: '85%' }} />
                  </div>
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">85%</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Experience</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500" style={{ width: '70%' }} />
                  </div>
                  <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">70%</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Education</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: '75%' }} />
                  </div>
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">75%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center col-span-2">
            <div className="space-y-3">
              <div className="flex items-center gap-3 bg-green-50 dark:bg-slate-800/50 rounded-lg p-3 border border-green-200 dark:border-transparent">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                <span className="text-sm text-slate-700 dark:text-slate-200">
                  <strong>Ready to apply:</strong> You meet 75% of requirements
                </span>
              </div>
              <div className="flex items-center gap-3 bg-purple-50 dark:bg-slate-800/50 rounded-lg p-3 border border-purple-200 dark:border-transparent">
                <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                <span className="text-sm text-slate-700 dark:text-slate-200">
                  <strong>Hiring probability:</strong> 68% chance of interview
                </span>
              </div>
              <div className="flex items-center gap-3 bg-yellow-50 dark:bg-slate-800/50 rounded-lg p-3 border border-yellow-200 dark:border-transparent">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                <span className="text-sm text-slate-700 dark:text-slate-200">
                  <strong>Recommendation:</strong> Close 2 gaps to increase to 90%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skill Gaps */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Critical Gaps */}
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 transition-colors">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Critical Gaps (2)</h3>
          </div>
          <div className="space-y-3">
            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-lg p-3">
              <p className="font-medium text-red-700 dark:text-red-300 mb-1">System Design</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Missing 65% of requirement
              </p>
            </div>
            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-lg p-3">
              <p className="font-medium text-red-700 dark:text-red-300 mb-1">AWS/Cloud</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Missing 45% of requirement
              </p>
            </div>
          </div>
        </div>

        {/* Important Gaps */}
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 transition-colors">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Important Gaps (3)</h3>
          </div>
          <div className="space-y-3">
            <div className="bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/30 rounded-lg p-3">
              <p className="font-medium text-yellow-700 dark:text-yellow-300 mb-1">Testing (Jest/RTL)</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Missing 30% of requirement
              </p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/30 rounded-lg p-3">
              <p className="font-medium text-yellow-700 dark:text-yellow-300 mb-1">GraphQL</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Missing 35% of requirement
              </p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/30 rounded-lg p-3">
              <p className="font-medium text-yellow-700 dark:text-yellow-300 mb-1">Docker</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Missing 25% of requirement
              </p>
            </div>
          </div>
        </div>

        {/* Your Strengths */}
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 transition-colors">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Your Strengths (5)</h3>
          </div>
          <div className="space-y-3">
            <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded-lg p-3">
              <p className="font-medium text-green-700 dark:text-green-300">React.js</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                100% match ✓
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded-lg p-3">
              <p className="font-medium text-green-700 dark:text-green-300">TypeScript</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                95% match ✓
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded-lg p-3">
              <p className="font-medium text-green-700 dark:text-green-300">REST APIs</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                92% match ✓
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 border border-purple-200 dark:border-purple-500/20 rounded-lg p-8 transition-colors">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Next Steps</h2>
        <p className="text-slate-700 dark:text-slate-300 mb-6">
          Get a personalized learning roadmap to close your critical gaps and increase
          your chances of landing this role.
        </p>
        <Button className="bg-purple-600 hover:bg-purple-700 gap-2">
          <Download className="h-4 w-4" />
          Generate Personalized Roadmap
        </Button>
      </div>
    </div>
  );
}
