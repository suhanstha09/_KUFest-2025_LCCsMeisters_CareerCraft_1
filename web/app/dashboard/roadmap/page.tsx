'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  CheckCircle,
  Clock,
  Target,
  ChevronRight,
  Play,
  FileText,
  Code,
} from 'lucide-react';

export default function RoadmapPage() {
  const [selectedWeek, setSelectedWeek] = useState(1);

  const roadmapData = {
    title: 'System Design & AWS Mastery',
    duration: '12 weeks',
    goal: 'Close critical gaps for Senior React Developer role at Google',
    weeks: [
      {
        week: 1,
        title: 'System Design Fundamentals',
        topics: [
          'Scalability basics',
          'Load balancing',
          'Database sharding',
          'Caching strategies',
        ],
        resources: [
          {
            type: 'course',
            title: 'System Design Interview Course',
            platform: 'Educative',
            duration: '8 hours',
          },
          {
            type: 'article',
            title: 'Designing Data-Intensive Applications (Ch 1-3)',
            platform: 'Book',
            duration: '6 hours',
          },
        ],
        project: 'Design a URL shortening service',
        completed: true,
      },
      {
        week: 2,
        title: 'Advanced System Design Patterns',
        topics: [
          'Microservices architecture',
          'Message queues',
          'API design',
          'Rate limiting',
        ],
        resources: [
          {
            type: 'course',
            title: 'Microservices Architecture Deep Dive',
            platform: 'Udemy',
            duration: '10 hours',
          },
          {
            type: 'article',
            title: 'Building Microservices - Newman',
            platform: 'Book',
            duration: '5 hours',
          },
        ],
        project: 'Design an e-commerce platform',
        completed: true,
      },
      {
        week: 3,
        title: 'AWS Fundamentals',
        topics: ['EC2', 'S3', 'RDS', 'Lambda', 'VPC'],
        resources: [
          {
            type: 'course',
            title: 'AWS Solutions Architect Associate',
            platform: 'A Cloud Guru',
            duration: '12 hours',
          },
          {
            type: 'lab',
            title: 'Hands-on AWS Labs',
            platform: 'Linux Academy',
            duration: '8 hours',
          },
        ],
        project: 'Deploy a Node.js app on EC2 with RDS',
        completed: false,
      },
      {
        week: 4,
        title: 'Advanced AWS Services',
        topics: ['CloudFront', 'ElastiCache', 'Auto-scaling', 'CloudWatch'],
        resources: [
          {
            type: 'course',
            title: 'Advanced AWS Architecture',
            platform: 'Udemy',
            duration: '10 hours',
          },
        ],
        project: 'Build a scalable application with auto-scaling',
        completed: false,
      },
    ],
  };

  const currentWeek = roadmapData.weeks[selectedWeek - 1];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Your Learning Roadmap</h1>
        <p className="text-slate-600 dark:text-slate-400">{roadmapData.title}</p>
      </div>

      {/* Overview */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 transition-colors">
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">Total Duration</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{roadmapData.duration}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 transition-colors">
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">Progress</p>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                  style={{ width: '50%' }} />
              </div>
            </div>
            <p className="text-xl font-bold text-slate-900 dark:text-white">50%</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 transition-colors">
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">Weeks Remaining</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">8 weeks</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Sidebar - Week Selection */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 sticky top-20 transition-colors">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Learning Path</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {roadmapData.weeks.map((week) => (
                <button
                  key={week.week}
                  onClick={() => setSelectedWeek(week.week)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition flex items-center justify-between ${
                    selectedWeek === week.week
                      ? 'bg-purple-600 text-white'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div>
                    <p className="font-medium">Week {week.week}</p>
                    <p className="text-xs opacity-75">{week.title}</p>
                  </div>
                  {week.completed && (
                    <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Week Header */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/50 dark:to-pink-900/50 rounded-lg border border-purple-200 dark:border-purple-500/20 p-8 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-purple-700 dark:text-purple-300 text-sm font-medium mb-2">
                  Week {currentWeek.week} of 12
                </p>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
                  {currentWeek.title}
                </h2>
                <p className="text-slate-700 dark:text-slate-300 mb-4">
                  {currentWeek.topics.join(' • ')}
                </p>
              </div>
              {currentWeek.completed ? (
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400 flex-shrink-0" />
              ) : (
                <Target className="h-8 w-8 text-purple-600 dark:text-purple-400 flex-shrink-0" />
              )}
            </div>
            {!currentWeek.completed && (
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <Play className="h-4 w-4 mr-2" />
                Start This Week
              </Button>
            )}
          </div>

          {/* Topics */}
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 transition-colors">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              Topics to Master
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {currentWeek.topics.map((topic, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700"
                >
                  <p className="text-slate-700 dark:text-slate-200 font-medium text-sm">{topic}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 transition-colors">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Recommended Resources</h3>
            <div className="space-y-3">
              {currentWeek.resources.map((resource, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-purple-500/50 transition cursor-pointer"
                >
                  <div className="flex-shrink-0 pt-1">
                    {resource.type === 'course' && (
                      <Play className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    )}
                    {resource.type === 'article' && (
                      <FileText className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    )}
                    {resource.type === 'lab' && (
                      <Code className="h-5 w-5 text-green-600 dark:text-green-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-white">{resource.title}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {resource.platform}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-xs whitespace-nowrap">
                    <Clock className="h-4 w-4" />
                    {resource.duration}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Project */}
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 transition-colors">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Hands-on Project</h3>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
              <p className="text-slate-700 dark:text-slate-200 text-lg font-medium mb-4">
                {currentWeek.project}
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                Build a real-world project to apply what you've learned. Push it to
                GitHub and add it to your portfolio.
              </p>
              {!currentWeek.completed && (
                <Button variant="outline" className="border-purple-600 dark:border-purple-500 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                  View Project Details
                </Button>
              )}
            </div>
          </div>

          {/* Milestones */}
          {selectedWeek === 4 && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg border border-green-200 dark:border-green-500/20 p-6 transition-colors">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">🎉 Milestone Complete</h3>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                You've completed the first phase! You're now 50% closer to your goal.
              </p>
              <Button className="bg-green-600 hover:bg-green-700">
                Celebrate & Continue
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
