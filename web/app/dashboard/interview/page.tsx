'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  MessageSquare,
  ThumbsUp,
  MessageCircle,
  Bookmark,
  Share2,
  Filter,
  Search,
  TrendingUp,
} from 'lucide-react';

export default function InterviewPrep() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['All', 'React', 'System Design', 'Behavioral', 'AWS'];

  const interviews = [
    {
      id: 1,
      company: 'Google',
      role: 'Senior React Developer',
      difficulty: 'Hard',
      category: 'React',
      rating: 4.8,
      reviews: 234,
      date: '2 weeks ago',
      questions: [
        'Explain React fiber architecture',
        'Optimize a large list rendering',
        'State management best practices',
      ],
      insights: [
        'They focus heavily on performance optimization',
        'Have system design questions in later rounds',
        'Mock interviews help - they expect real-world problem solving',
      ],
      bookmarked: true,
    },
    {
      id: 2,
      company: 'Meta',
      role: 'Senior React Developer',
      difficulty: 'Hard',
      category: 'React',
      rating: 4.6,
      reviews: 189,
      date: '3 weeks ago',
      questions: [
        'Virtual DOM implementation details',
        'Handle concurrent rendering',
        'React Hooks deep dive',
      ],
      insights: [
        'Very technical interviews',
        'Focus on understanding fundamentals, not memorization',
        'Code review round is important',
      ],
      bookmarked: false,
    },
    {
      id: 3,
      company: 'Amazon',
      role: 'Backend Engineer',
      difficulty: 'Hard',
      category: 'System Design',
      rating: 4.7,
      reviews: 312,
      date: '1 week ago',
      questions: [
        'Design Amazon recommendation system',
        'Handle millions of transactions',
        'Database scaling strategies',
      ],
      insights: [
        'Heavy emphasis on scalability',
        'Leadership principles are important',
        'Ask clarifying questions before designing',
      ],
      bookmarked: false,
    },
    {
      id: 4,
      company: 'Microsoft',
      role: 'Full Stack Engineer',
      difficulty: 'Medium',
      category: 'AWS',
      rating: 4.5,
      reviews: 156,
      date: '4 days ago',
      questions: [
        'AWS services selection',
        'Cost optimization',
        'Infrastructure as code',
      ],
      insights: [
        'Very collaborative interview process',
        'They value learning ability',
        'Hands-on Azure experience helpful',
      ],
      bookmarked: true,
    },
  ];

  const filteredInterviews = interviews.filter((interview) => {
    const matchesCategory =
      selectedCategory === 'all' || interview.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      interview.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interview.role.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Interview Prep Hub</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Learn from real interview experiences of professionals who've been through the process
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by company or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat.toLowerCase())}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedCategory === cat.toLowerCase()
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Interview Cards */}
      <div className="space-y-4">
        {filteredInterviews.map((interview) => (
          <div
            key={interview.id}
            className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 hover:border-blue-500/50 transition"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {interview.company} • {interview.role}
                  </h3>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    interview.difficulty === 'Hard'
                      ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300'
                      : interview.difficulty === 'Medium'
                      ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300'
                      : 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300'
                  }`}>
                    {interview.difficulty}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">{interview.date}</p>
              </div>
              <button
                className={`p-2 rounded-lg transition ${
                  interview.bookmarked
                    ? 'text-yellow-500 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Bookmark className="h-5 w-5" fill={interview.bookmarked ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-sm ${
                      i < Math.round(interview.rating)
                        ? 'text-yellow-400'
                        : 'text-slate-300 dark:text-slate-600'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {interview.rating}
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400">
                ({interview.reviews} reviews)
              </span>
            </div>

            {/* Questions */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Key Questions Asked:
              </h4>
              <div className="flex flex-wrap gap-2">
                {interview.questions.slice(0, 2).map((q, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-xs"
                  >
                    {q}
                  </span>
                ))}
                {interview.questions.length > 2 && (
                  <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-xs">
                    +{interview.questions.length - 2} more
                  </span>
                )}
              </div>
            </div>

            {/* Insights */}
            <div className="bg-slate-100 dark:bg-slate-800/50 rounded-lg p-4 mb-4 border border-slate-200 dark:border-slate-700">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                Key Insights
              </h4>
              <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
                {interview.insights.slice(0, 2).map((insight, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="text-blue-600 dark:text-blue-400">•</span>
                    {insight}
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                <MessageSquare className="h-4 w-4 mr-2" />
                View Full Experience
              </Button>
              <Button
                variant="outline"
                className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredInterviews.length === 0 && (
        <div className="text-center py-12">
          <MessageCircle className="h-12 w-12 text-slate-400 mx-auto mb-4 opacity-50" />
          <p className="text-slate-600 dark:text-slate-400">No interviews found. Try adjusting your filters.</p>
        </div>
      )}

      {/* CTA for Contributing */}
      <div className="bg-gradient-to-r from-blue-50 to-orange-50 dark:from-blue-900/30 dark:to-orange-900/30 rounded-lg border border-blue-200 dark:border-blue-500/20 p-8 transition-colors">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Share Your Experience</h2>
        <p className="text-slate-700 dark:text-slate-300 mb-6">
          Have you been through an interview? Share your experience to help others prepare!
        </p>
        <Button className="bg-blue-600 hover:bg-blue-700">
          Submit Your Interview
        </Button>
      </div>
    </div>
  );
}
