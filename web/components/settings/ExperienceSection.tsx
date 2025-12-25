'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Edit, Save, X, Loader2 } from 'lucide-react';
import { getWorkExperience, createWorkExperience, updateWorkExperience, deleteWorkExperience } from '@/api';

interface WorkExperience {
  id?: string;
  jobTitle: string;
  company: string;
  employmentType: string;
  location: string;
  isRemote: boolean;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
}

export function ExperienceSection() {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<WorkExperience>({
    jobTitle: '',
    company: '',
    employmentType: 'FULL_TIME',
    location: '',
    isRemote: false,
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: '',
  });

  // Fetch work experience records
  const { data, isLoading, error } = useQuery({
    queryKey: ['workExperience'],
    queryFn: getWorkExperience,
  });

  // Extract experience list from response - handle both array and object responses
  const experienceList = Array.isArray(data) ? data : (data?.results || data?.data || []);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createWorkExperience,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workExperience'] });
      setIsAdding(false);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateWorkExperience(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workExperience'] });
      setIsAdding(false);
      setEditingId(null);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteWorkExperience,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workExperience'] });
    },
  });

  const employmentTypes = [
    { value: 'FULL_TIME', label: 'Full-time' },
    { value: 'PART_TIME', label: 'Part-time' },
    { value: 'CONTRACT', label: 'Contract' },
    { value: 'FREELANCE', label: 'Freelance' },
    { value: 'INTERNSHIP', label: 'Internship' },
  ];

  const handleAdd = () => {
    setIsAdding(true);
    setFormData({
      jobTitle: '',
      company: '',
      employmentType: 'FULL_TIME',
      location: '',
      isRemote: false,
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: '',
    });
  };

  const handleSave = () => {
    // Convert form data to API format (snake_case)
    const apiData = {
      job_title: formData.jobTitle,
      company: formData.company,
      employment_type: formData.employmentType,
      location: formData.location,
      is_remote: formData.isRemote,
      start_date: formData.startDate,
      end_date: formData.isCurrent ? undefined : formData.endDate,
      is_current: formData.isCurrent,
      description: formData.description,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: apiData });
    } else {
      createMutation.mutate(apiData);
    }
  };

  const handleEdit = (experience: WorkExperience) => {
    setFormData(experience);
    setEditingId(experience.id || null);
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this work experience?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
  };

  const handleChange = (field: keyof WorkExperience, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Work Experience</h2>
        {!isAdding && (
          <Button
            onClick={handleAdd}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Experience
          </Button>
        )}
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              {editingId ? 'Edit Experience' : 'Add Experience'}
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title *</Label>
                <Input
                  id="jobTitle"
                  placeholder="e.g., Senior Software Engineer"
                  value={formData.jobTitle}
                  onChange={(e) => handleChange('jobTitle', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company *</Label>
                <Input
                  id="company"
                  placeholder="Company name"
                  value={formData.company}
                  onChange={(e) => handleChange('company', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employmentType">Employment Type *</Label>
                <select
                  id="employmentType"
                  value={formData.employmentType}
                  onChange={(e) => handleChange('employmentType', e.target.value)}
                  className="flex h-10 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 dark:focus-visible:ring-purple-400 focus-visible:ring-offset-2 text-slate-900 dark:text-slate-50"
                >
                  {employmentTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., San Francisco, CA"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleChange('endDate', e.target.value)}
                  disabled={formData.isCurrent}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isRemote"
                  checked={formData.isRemote}
                  onChange={(e) => handleChange('isRemote', e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                />
                <Label htmlFor="isRemote" className="cursor-pointer">
                  Remote position
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isCurrent"
                  checked={formData.isCurrent}
                  onChange={(e) => handleChange('isCurrent', e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                />
                <Label htmlFor="isCurrent" className="cursor-pointer">
                  I currently work here
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description & Responsibilities</Label>
              <Textarea
                id="description"
                placeholder="Describe your role, responsibilities, and achievements..."
                rows={5}
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
              />
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <Button
                onClick={handleSave}
                disabled={createMutation.isPending || updateMutation.isPending}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {editingId ? 'Update' : 'Save'}
                  </>
                )}
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="border-slate-300 dark:border-slate-700"
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <Card className="p-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-purple-600 dark:text-purple-400" />
          <p className="text-slate-500 dark:text-slate-400 mt-4">Loading work experience...</p>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="p-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-center">
          <p className="text-red-600 dark:text-red-400">
            Unable to load work experience. Please try again later.
          </p>
        </Card>
      )}

      {/* Experience List */}
      {!isLoading && !error && (
        <div className="space-y-4">
          {experienceList.map(experience => (
          <Card
            key={experience.id}
            className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {experience.jobTitle}
                </h4>
                <p className="text-purple-600 dark:text-purple-400 font-medium">
                  {experience.company}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-sm px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded">
                    {employmentTypes.find(t => t.value === experience.employmentType)?.label}
                  </span>
                  {experience.isRemote && (
                    <span className="text-sm px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
                      Remote
                    </span>
                  )}
                </div>
                <p className="text-slate-500 dark:text-slate-500 text-sm mt-2">
                  {new Date(experience.startDate).toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric',
                  })}{' '}
                  -{' '}
                  {experience.isCurrent
                    ? 'Present'
                    : new Date(experience.endDate).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric',
                      })}
                </p>
                {experience.location && (
                  <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                    {experience.location}
                  </p>
                )}
                {experience.description && (
                  <p className="text-slate-600 dark:text-slate-400 text-sm mt-3 whitespace-pre-line">
                    {experience.description}
                  </p>
                )}
              </div>
              <div className="flex gap-2 ml-4">
                <Button
                  onClick={() => handleEdit(experience)}
                  variant="outline"
                  size="sm"
                  className="border-slate-300 dark:border-slate-700"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => handleDelete(experience.id!)}
                  variant="outline"
                  size="sm"
                  className="border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {experienceList.length === 0 && !isAdding && (
          <Card className="p-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-center">
            <p className="text-slate-500 dark:text-slate-400">
              No work experience records yet. Click "Add Experience" to get started.
            </p>
          </Card>
        )}
      </div>
      )}
    </div>
  );
}
