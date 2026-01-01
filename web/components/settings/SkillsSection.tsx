'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Edit, Save, X } from 'lucide-react';

interface Skill {
  id?: string;
  name: string;
  skillType: string;
  proficiencyLevel: string;
  yearsOfExperience: string;
}

export function SkillsSection() {
  const [skillsList, setSkillsList] = useState<Skill[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Skill>({
    name: '',
    skillType: 'TECHNICAL',
    proficiencyLevel: 'INTERMEDIATE',
    yearsOfExperience: '',
  });

  const skillTypes = [
    { value: 'TECHNICAL', label: 'Technical Skill' },
    { value: 'SOFT', label: 'Soft Skill' },
    { value: 'LANGUAGE', label: 'Language' },
    { value: 'TOOL', label: 'Tool/Software' },
    { value: 'FRAMEWORK', label: 'Framework/Library' },
    { value: 'DOMAIN', label: 'Domain Knowledge' },
  ];

  const proficiencyLevels = [
    { value: 'BEGINNER', label: 'Beginner', color: 'bg-slate-500' },
    { value: 'INTERMEDIATE', label: 'Intermediate', color: 'bg-blue-500' },
    { value: 'ADVANCED', label: 'Advanced', color: 'bg-blue-500' },
    { value: 'EXPERT', label: 'Expert', color: 'bg-green-500' },
  ];

  const handleAdd = () => {
    setIsAdding(true);
    setFormData({
      name: '',
      skillType: 'TECHNICAL',
      proficiencyLevel: 'INTERMEDIATE',
      yearsOfExperience: '',
    });
  };

  const handleSave = () => {
    if (editingId) {
      setSkillsList(prev =>
        prev.map(skill => (skill.id === editingId ? { ...formData, id: editingId } : skill))
      );
      setEditingId(null);
    } else {
      const newSkill = { ...formData, id: Date.now().toString() };
      setSkillsList(prev => [...prev, newSkill]);
    }
    setIsAdding(false);
  };

  const handleEdit = (skill: Skill) => {
    setFormData(skill);
    setEditingId(skill.id || null);
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    setSkillsList(prev => prev.filter(skill => skill.id !== id));
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
  };

  const handleChange = (field: keyof Skill, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getProficiencyColor = (level: string) => {
    return proficiencyLevels.find(p => p.value === level)?.color || 'bg-slate-500';
  };

  const getProficiencyWidth = (level: string) => {
    const widths = {
      BEGINNER: 'w-1/4',
      INTERMEDIATE: 'w-1/2',
      ADVANCED: 'w-3/4',
      EXPERT: 'w-full',
    };
    return widths[level as keyof typeof widths] || 'w-1/2';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Skills</h2>
        {!isAdding && (
          <Button
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Skill
          </Button>
        )}
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              {editingId ? 'Edit Skill' : 'Add Skill'}
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Skill Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., React, Python, Leadership"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skillType">Skill Type *</Label>
                <select
                  id="skillType"
                  value={formData.skillType}
                  onChange={(e) => handleChange('skillType', e.target.value)}
                  className="flex h-10 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2 text-slate-900 dark:text-slate-50"
                >
                  {skillTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="proficiencyLevel">Proficiency Level *</Label>
                <select
                  id="proficiencyLevel"
                  value={formData.proficiencyLevel}
                  onChange={(e) => handleChange('proficiencyLevel', e.target.value)}
                  className="flex h-10 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2 text-slate-900 dark:text-slate-50"
                >
                  {proficiencyLevels.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                <Input
                  id="yearsOfExperience"
                  type="number"
                  step="0.5"
                  placeholder="e.g., 3.5"
                  value={formData.yearsOfExperience}
                  onChange={(e) => handleChange('yearsOfExperience', e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <Button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Save className="mr-2 h-4 w-4" />
                {editingId ? 'Update' : 'Save'}
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="border-slate-300 dark:border-slate-700"
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Skills List - Grouped by Type */}
      <div className="space-y-6">
        {skillTypes.map(type => {
          const typeSkills = skillsList.filter(skill => skill.skillType === type.value);
          if (typeSkills.length === 0) return null;

          return (
            <div key={type.value}>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                {type.label}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {typeSkills.map(skill => (
                  <Card
                    key={skill.id}
                    className="p-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 dark:text-white">
                          {skill.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-600 dark:text-slate-400">
                            {proficiencyLevels.find(p => p.value === skill.proficiencyLevel)?.label}
                          </span>
                          {skill.yearsOfExperience && (
                            <>
                              <span className="text-slate-400 dark:text-slate-600">•</span>
                              <span className="text-xs text-slate-600 dark:text-slate-400">
                                {skill.yearsOfExperience} years
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1 ml-2">
                        <Button
                          onClick={() => handleEdit(skill)}
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 border-slate-300 dark:border-slate-700"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(skill.id!)}
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Proficiency Bar */}
                    <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getProficiencyColor(
                          skill.proficiencyLevel
                        )} ${getProficiencyWidth(skill.proficiencyLevel)} transition-all`}
                      />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {skillsList.length === 0 && !isAdding && (
        <Card className="p-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-center">
          <p className="text-slate-500 dark:text-slate-400">
            No skills yet. Click "Add Skill" to get started.
          </p>
        </Card>
      )}
    </div>
  );
}

