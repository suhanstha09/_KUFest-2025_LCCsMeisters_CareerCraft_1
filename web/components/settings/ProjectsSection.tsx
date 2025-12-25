'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Edit, Save, X, ExternalLink, Github, Loader2 } from 'lucide-react';
import { getProjects, createProject, updateProject, deleteProject } from '@/api';

interface Project {
  id?: string;
  title: string;
  projectType: string;
  description: string;
  technologies: string;
  projectUrl: string;
  githubUrl: string;
  demoUrl: string;
  startDate: string;
  endDate: string;
  isOngoing: boolean;
}

export function ProjectsSection() {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Project>({
    title: '',
    projectType: 'PERSONAL',
    description: '',
    technologies: '',
    projectUrl: '',
    githubUrl: '',
    demoUrl: '',
    startDate: '',
    endDate: '',
    isOngoing: false,
  });

  // Fetch projects
  const { data, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  });

  // Extract projects list from response - handle both array and object responses
  const projectsList = Array.isArray(data) ? data : (data?.results || data?.data || []);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setIsAdding(false);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setIsAdding(false);
      setEditingId(null);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const projectTypes = [
    { value: 'PERSONAL', label: 'Personal' },
    { value: 'WORK', label: 'Work' },
    { value: 'ACADEMIC', label: 'Academic' },
    { value: 'OPEN_SOURCE', label: 'Open Source' },
  ];

  const handleAdd = () => {
    setIsAdding(true);
    setFormData({
      title: '',
      projectType: 'PERSONAL',
      description: '',
      technologies: '',
      projectUrl: '',
      githubUrl: '',
      demoUrl: '',
      startDate: '',
      endDate: '',
      isOngoing: false,
    });
  };

  const handleSave = () => {
    // Convert form data to API format (snake_case)
    const apiData = {
      title: formData.title,
      project_type: formData.projectType,
      description: formData.description,
      technologies_used: formData.technologies ? formData.technologies.split(',').map(t => t.trim()) : [],
      project_url: formData.projectUrl,
      github_url: formData.githubUrl,
      demo_url: formData.demoUrl,
      start_date: formData.startDate,
      end_date: formData.isOngoing ? undefined : formData.endDate,
      is_ongoing: formData.isOngoing,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: apiData });
    } else {
      createMutation.mutate(apiData);
    }
  };

  const handleEdit = (project: Project) => {
    setFormData(project);
    setEditingId(project.id || null);
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
  };

  const handleChange = (field: keyof Project, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Projects</h2>
        {!isAdding && (
          <Button
            onClick={handleAdd}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Project
          </Button>
        )}
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              {editingId ? 'Edit Project' : 'Add Project'}
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="title">Project Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., E-commerce Platform"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectType">Project Type *</Label>
                <select
                  id="projectType"
                  value={formData.projectType}
                  onChange={(e) => handleChange('projectType', e.target.value)}
                  className="flex h-10 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 dark:focus-visible:ring-purple-400 focus-visible:ring-offset-2 text-slate-900 dark:text-slate-50"
                >
                  {projectTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="technologies">Technologies</Label>
                <Input
                  id="technologies"
                  placeholder="e.g., React, Node.js, PostgreSQL"
                  value={formData.technologies}
                  onChange={(e) => handleChange('technologies', e.target.value)}
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
                  disabled={formData.isOngoing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectUrl">Project URL</Label>
                <Input
                  id="projectUrl"
                  type="url"
                  placeholder="https://project.com"
                  value={formData.projectUrl}
                  onChange={(e) => handleChange('projectUrl', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="githubUrl">GitHub URL</Label>
                <Input
                  id="githubUrl"
                  type="url"
                  placeholder="https://github.com/username/repo"
                  value={formData.githubUrl}
                  onChange={(e) => handleChange('githubUrl', e.target.value)}
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="demoUrl">Demo URL</Label>
                <Input
                  id="demoUrl"
                  type="url"
                  placeholder="https://demo.com"
                  value={formData.demoUrl}
                  onChange={(e) => handleChange('demoUrl', e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isOngoing"
                  checked={formData.isOngoing}
                  onChange={(e) => handleChange('isOngoing', e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                />
                <Label htmlFor="isOngoing" className="cursor-pointer">
                  Ongoing project
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the project, your role, and key features..."
                rows={4}
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
          <p className="text-slate-500 dark:text-slate-400 mt-4">Loading projects...</p>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="p-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-center">
          <p className="text-red-600 dark:text-red-400">
            Unable to load projects. Please try again later.
          </p>
        </Card>
      )}

      {/* Projects List */}
      {!isLoading && !error && (
        <div className="space-y-4">
          {projectsList.map(project => (
          <Card
            key={project.id}
            className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {project.title}
                    </h4>
                    <span className="text-sm px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded inline-block mt-2">
                      {projectTypes.find(t => t.value === project.projectType)?.label}
                    </span>
                  </div>
                </div>

                <p className="text-slate-500 dark:text-slate-500 text-sm mt-3">
                  {new Date(project.startDate).toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric',
                  })}{' '}
                  -{' '}
                  {project.isOngoing
                    ? 'Present'
                    : new Date(project.endDate).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric',
                      })}
                </p>

                {project.technologies && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {project.technologies.split(',').map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded"
                      >
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                )}

                {project.description && (
                  <p className="text-slate-600 dark:text-slate-400 text-sm mt-3">
                    {project.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-3 mt-4">
                  {project.projectUrl && (
                    <a
                      href={project.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Project Link
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                    >
                      <Github className="h-4 w-4" />
                      GitHub
                    </a>
                  )}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>

              <div className="flex gap-2 ml-4">
                <Button
                  onClick={() => handleEdit(project)}
                  variant="outline"
                  size="sm"
                  className="border-slate-300 dark:border-slate-700"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => handleDelete(project.id!)}
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

        {projectsList.length === 0 && !isAdding && (
          <Card className="p-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-center">
            <p className="text-slate-500 dark:text-slate-400">
              No projects yet. Click "Add Project" to get started.
            </p>
          </Card>
        )}
      </div>
      )}
    </div>
  );
}
