'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

const INDUSTRIES = ['Tech', 'Finance', 'Healthcare', 'E-commerce', 'Education', 'Other'];
const LEVELS = ['Entry', 'Mid-level', 'Senior', 'Lead'];

export default function DreamJobForm() {
  const [step, setStep] = useState<'role' | 'details' | 'analyzing'>('role');
  const [roleDescription, setRoleDescription] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleRoleSubmit = () => {
    if (roleDescription.trim()) {
      setStep('details');
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setStep('analyzing');
    
    // Simulate API call
    setTimeout(() => {
      setIsAnalyzing(false);
      // Reset form
      setStep('role');
      setRoleDescription('');
      setSelectedIndustry('');
      setSelectedLevel('');
    }, 2000);
  };

  return (
    <div className="space-y-4">
      {step === 'role' && (
        <>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold uppercase">
            What's your dream job?
          </p>
          <textarea
            value={roleDescription}
            onChange={(e) => setRoleDescription(e.target.value)}
            placeholder="e.g., Product Manager at a tech startup..."
            className="w-full p-2 text-sm rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
          />
          <Button
            onClick={handleRoleSubmit}
            disabled={!roleDescription.trim()}
            size="sm"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Next
          </Button>
        </>
      )}

      {step === 'details' && (
        <>
          <div className="space-y-2">
            <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold uppercase">
              Industry
            </p>
            <div className="grid grid-cols-2 gap-1">
              {INDUSTRIES.map((industry) => (
                <button
                  key={industry}
                  onClick={() => setSelectedIndustry(industry)}
                  className={`p-2 text-xs rounded border transition ${
                    selectedIndustry === industry
                      ? 'border-blue-500 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                      : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                  }`}
                >
                  {industry}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold uppercase">
              Level
            </p>
            <div className="space-y-1">
              {LEVELS.map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`w-full p-2 text-xs rounded border transition text-left ${
                    selectedLevel === level
                      ? 'border-blue-500 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                      : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={!selectedIndustry || !selectedLevel || isAnalyzing}
            size="sm"
            className="w-full bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-700 hover:to-orange-700 text-white"
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="h-3 w-3 mr-1 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="h-3 w-3 mr-1" />
                Analyze Fit
              </>
            )}
          </Button>
        </>
      )}

      {step === 'analyzing' && (
        <div className="flex flex-col items-center justify-center py-6">
          <div className="relative mb-3">
            <Sparkles className="h-8 w-8 text-blue-600 dark:text-blue-400 animate-spin" />
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 text-center">
            Analyzing your fit...
          </p>
        </div>
      )}
    </div>
  );
}

