'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Edit, Save, X, Loader2 } from 'lucide-react';
import { getEducation, createEducation, updateEducation, deleteEducation } from '@/api';

interface Education {
  id?: string;
  institution: string;
  degree: string;
  degreeLevel: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  grade: string;
  description: string;
}

export function EducationSection() {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Education>({
    institution: '',
    degree: '',
    degreeLevel: 'BACHELOR',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    grade: '',
    description: '',
  });

  // Fetch education records
  const { data, isLoading, error } = useQuery({
    queryKey: ['education'],
    queryFn: getEducation,
  });

  // Extract education list from response - handle both array and object responses
  const educationList = Array.isArray(data) ? data : (data?.results || data?.data || []);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createEducation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['education'] });
      setIsAdding(false);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateEducation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['education'] });
      setIsAdding(false);
      setEditingId(null);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteEducation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['education'] });
    },
  });

  const degreeLevels = [
    { value: 'HIGH_SCHOOL', label: 'High School' },
    { value: 'ASSOCIATE', label: 'Associate Degree' },
    { value: 'BACHELOR', label: "Bachelor's Degree" },
    { value: 'MASTER', label: "Master's Degree" },
    { value: 'PHD', label: 'PhD' },
    { value: 'CERTIFICATE', label: 'Certificate' },
    { value: 'BOOTCAMP', label: 'Bootcamp' },
  ];

  const handleAdd = () => {
    setIsAdding(true);
    setFormData({
      institution: '',
      degree: '',
      degreeLevel: 'BACHELOR',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      grade: '',
      description: '',
    });
  };

  const handleSave = () => {
    // Convert form data to API format (snake_case)
    const apiData = {
      institution: formData.institution,
      degree: formData.degree,
      degree_level: formData.degreeLevel,
      field_of_study: formData.fieldOfStudy,
      start_date: formData.startDate,
      end_date: formData.isCurrent ? undefined : formData.endDate,
      is_current: formData.isCurrent,
      grade: formData.grade,
      description: formData.description,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: apiData });
    } else {
      createMutation.mutate(apiData);
    }
  };

  const handleEdit = (education: Education) => {
    setFormData(education);
    setEditingId(education.id || null);
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this education record?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
  };

  const handleChange = (field: keyof Education, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Education</h2>
        {!isAdding && (
          <Button
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Education
          </Button>
        )}
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              {editingId ? 'Edit Education' : 'Add Education'}
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="institution">Institution *</Label>
                <Input
                  id="institution"
                  placeholder="University name"
                  value={formData.institution}
                  onChange={(e) => handleChange('institution', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="degree">Degree *</Label>
                <Input
                  id="degree"
                  placeholder="e.g., Bachelor of Science"
                  value={formData.degree}
                  onChange={(e) => handleChange('degree', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="degreeLevel">Degree Level *</Label>
                <select
                  id="degreeLevel"
                  value={formData.degreeLevel}
                  onChange={(e) => handleChange('degreeLevel', e.target.value)}
                  className="flex h-10 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2 text-slate-900 dark:text-slate-50"
                >
                  {degreeLevels.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fieldOfStudy">Field of Study</Label>
                <Input
                  id="fieldOfStudy"
                  placeholder="e.g., Computer Science"
                  value={formData.fieldOfStudy}
                  onChange={(e) => handleChange('fieldOfStudy', e.target.value)}
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

              <div className="space-y-2">
                <Label htmlFor="grade">Grade/GPA</Label>
                <Input
                  id="grade"
                  placeholder="e.g., 3.8/4.0 or 85%"
                  value={formData.grade}
                  onChange={(e) => handleChange('grade', e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isCurrent"
                  checked={formData.isCurrent}
                  onChange={(e) => handleChange('isCurrent', e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <Label htmlFor="isCurrent" className="cursor-pointer">
                  I currently study here
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Key achievements, activities, coursework..."
                rows={3}
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
              />
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <Button
                onClick={handleSave}
                disabled={createMutation.isPending || updateMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700 text-white"
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
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600 dark:text-blue-400" />
          <p className="text-slate-500 dark:text-slate-400 mt-4">Loading education records...</p>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="p-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-center">
          <p className="text-red-600 dark:text-red-400">
            Unable to load education records. Please try again later.
          </p>
        </Card>
      )}

      {/* Education List */}
      {!isLoading && !error && (
        <div className="space-y-4">
          {educationList.map(education => (
          <Card
            key={education.id}
            className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {education.degree}
                </h4>
                <p className="text-blue-600 dark:text-blue-400 font-medium">
                  {education.institution}
                </p>
                {education.fieldOfStudy && (
                  <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                    {education.fieldOfStudy}
                  </p>
                )}
                <p className="text-slate-500 dark:text-slate-500 text-sm mt-2">
                  {new Date(education.startDate).toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric',
                  })}{' '}
                  -{' '}
                  {education.isCurrent
                    ? 'Present'
                    : new Date(education.endDate).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric',
                      })}
                </p>
                {education.grade && (
                  <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
                    Grade: {education.grade}
                  </p>
                )}
                {education.description && (
                  <p className="text-slate-600 dark:text-slate-400 text-sm mt-3">
                    {education.description}
                  </p>
                )}
              </div>
              <div className="flex gap-2 ml-4">
                <Button
                  onClick={() => handleEdit(education)}
                  variant="outline"
                  size="sm"
                  className="border-slate-300 dark:border-slate-700"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => handleDelete(education.id!)}
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

        {educationList.length === 0 && !isAdding && (
          <Card className="p-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-center">
            <p className="text-slate-500 dark:text-slate-400">
              No education records yet. Click "Add Education" to get started.
            </p>
          </Card>
        )}
      </div>
      )}
    </div>
  );
}

