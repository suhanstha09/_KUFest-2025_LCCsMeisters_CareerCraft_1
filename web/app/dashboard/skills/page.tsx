'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  TrendingDown,
  TrendingUp,
  Zap,
  ChevronRight,
} from 'lucide-react';

export default function SkillAnalysis() {
  const [selectedCategory, setSelectedCategory] = useState('frontend');

  const categories = [
    { id: 'frontend', name: 'Frontend Development' },
    { id: 'backend', name: 'Backend Development' },
    { id: 'devops', name: 'DevOps' },
    { id: 'data', name: 'Data Science' },
  ];

  const skillsData = {
    frontend: [
      {
        name: 'React.js',
        yourLevel: 92,
        industryAvg: 85,
        percentile: 85,
        trend: 'up',
      },
      {
        name: 'TypeScript',
        yourLevel: 85,
        industryAvg: 78,
        percentile: 72,
        trend: 'up',
      },
      {
        name: 'Vue.js',
        yourLevel: 45,
        industryAvg: 72,
        percentile: 28,
        trend: 'down',
      },
      {
        name: 'Tailwind CSS',
        yourLevel: 90,
        industryAvg: 80,
        percentile: 88,
        trend: 'up',
      },
      {
        name: 'HTML/CSS',
        yourLevel: 95,
        industryAvg: 88,
        percentile: 92,
        trend: 'stable',
      },
    ],
  };

  const currentSkills = skillsData[selectedCategory as keyof typeof skillsData] || skillsData.frontend;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Skill Gap Analysis</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Compare your skills with industry averages and see where you stand
        </p>
      </div>

      {/* Category Selection */}
      <div className="flex flex-wrap gap-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              selectedCategory === cat.id
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Overall Comparison */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 transition-colors">
          <p className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-2">Your Average</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">82.5%</p>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">Across all skills</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 transition-colors">
          <p className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-2">Industry Average</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">80.6%</p>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">Among professionals</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 transition-colors">
          <p className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-2">Your Percentile</p>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">73rd</p>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">Better than 73% of peers</p>
        </div>
      </div>

      {/* Skills Comparison Table */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Detailed Skill Breakdown
          </h2>
        </div>

        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          {currentSkills.map((skill, idx) => (
            <div key={idx} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    {skill.name}
                  </h3>
                  <div className="flex gap-4 text-sm">
                    <div>
                      <p className="text-slate-600 dark:text-slate-400">Your Level</p>
                      <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                        {skill.yourLevel}%
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-600 dark:text-slate-400">Industry Avg</p>
                      <p className="text-xl font-bold text-slate-700 dark:text-slate-300">
                        {skill.industryAvg}%
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-600 dark:text-slate-400">Your Percentile</p>
                      <p className="text-xl font-bold text-green-600 dark:text-green-400">
                        {skill.percentile}th
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {skill.trend === 'up' && (
                    <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                  )}
                  {skill.trend === 'down' && (
                    <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
                  )}
                  {skill.trend === 'stable' && (
                    <Zap className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  )}
                </div>
              </div>

              {/* Comparison Bar */}
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                    <span>Your Level</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${skill.yourLevel}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                    <span>Industry Average</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-slate-500 rounded-full"
                      style={{ width: `${skill.industryAvg}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Gap Status */}
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                {skill.yourLevel > skill.industryAvg ? (
                  <p className="text-sm text-green-600 dark:text-green-400">
                    ✓ You're above industry average by{' '}
                    <strong>{skill.yourLevel - skill.industryAvg}%</strong>
                  </p>
                ) : (
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">
                    Gap identified: You're{' '}
                    <strong>{skill.industryAvg - skill.yourLevel}%</strong> below
                    industry average
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-r from-blue-50 to-orange-50 dark:from-blue-900/30 dark:to-orange-900/30 rounded-lg border border-blue-200 dark:border-blue-500/20 p-8 transition-colors">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Recommendations</h2>
        <ul className="space-y-3">
          <li className="flex gap-3">
            <ChevronRight className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <span className="text-slate-700 dark:text-slate-300">
              Focus on improving Vue.js (28th percentile) - critical gap in your toolkit
            </span>
          </li>
          <li className="flex gap-3">
            <ChevronRight className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <span className="text-slate-700 dark:text-slate-300">
              Leverage your strength in React and HTML/CSS to expand into full-stack
              development
            </span>
          </li>
          <li className="flex gap-3">
            <ChevronRight className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <span className="text-slate-700 dark:text-slate-300">
              Consider learning backend technologies to increase job market opportunities
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
