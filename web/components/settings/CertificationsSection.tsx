'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Edit, Save, X, ExternalLink, Award, Loader2 } from 'lucide-react';
import { getCertifications, createCertification, updateCertification, deleteCertification } from '@/api';

interface Certification {
  id?: string;
  name: string;
  issuingOrganization: string;
  credentialId: string;
  credentialUrl: string;
  issueDate: string;
  expiryDate: string;
  doesNotExpire: boolean;
}

export function CertificationsSection() {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Certification>({
    name: '',
    issuingOrganization: '',
    credentialId: '',
    credentialUrl: '',
    issueDate: '',
    expiryDate: '',
    doesNotExpire: false,
  });

  // Fetch certifications
  const { data, isLoading, error } = useQuery({
    queryKey: ['certifications'],
    queryFn: getCertifications,
  });

  // Extract certifications list from response - handle both array and object responses
  const certificationsList = Array.isArray(data) ? data : (data?.results || data?.data || []);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createCertification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certifications'] });
      setIsAdding(false);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateCertification(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certifications'] });
      setIsAdding(false);
      setEditingId(null);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteCertification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certifications'] });
    },
  });

  const handleAdd = () => {
    setIsAdding(true);
    setFormData({
      name: '',
      issuingOrganization: '',
      credentialId: '',
      credentialUrl: '',
      issueDate: '',
      expiryDate: '',
      doesNotExpire: false,
    });
  };

  const handleSave = () => {
    // Convert form data to API format (snake_case)
    const apiData = {
      name: formData.name,
      issuing_organization: formData.issuingOrganization,
      credential_id: formData.credentialId,
      credential_url: formData.credentialUrl,
      issue_date: formData.issueDate,
      expiry_date: formData.doesNotExpire ? undefined : formData.expiryDate,
      does_not_expire: formData.doesNotExpire,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: apiData });
    } else {
      createMutation.mutate(apiData);
    }
  };

  const handleEdit = (certification: Certification) => {
    setFormData(certification);
    setEditingId(certification.id || null);
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this certification?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
  };

  const handleChange = (field: keyof Certification, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Certifications</h2>
        {!isAdding && (
          <Button
            onClick={handleAdd}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Certification
          </Button>
        )}
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              {editingId ? 'Edit Certification' : 'Add Certification'}
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="name">Certification Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., AWS Certified Solutions Architect"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="issuingOrganization">Issuing Organization *</Label>
                <Input
                  id="issuingOrganization"
                  placeholder="e.g., Amazon Web Services"
                  value={formData.issuingOrganization}
                  onChange={(e) => handleChange('issuingOrganization', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="credentialId">Credential ID</Label>
                <Input
                  id="credentialId"
                  placeholder="e.g., ABC123XYZ"
                  value={formData.credentialId}
                  onChange={(e) => handleChange('credentialId', e.target.value)}
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="credentialUrl">Credential URL</Label>
                <Input
                  id="credentialUrl"
                  type="url"
                  placeholder="https://certification-verify.com/credential"
                  value={formData.credentialUrl}
                  onChange={(e) => handleChange('credentialUrl', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="issueDate">Issue Date *</Label>
                <Input
                  id="issueDate"
                  type="date"
                  value={formData.issueDate}
                  onChange={(e) => handleChange('issueDate', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => handleChange('expiryDate', e.target.value)}
                  disabled={formData.doesNotExpire}
                />
              </div>

              <div className="flex items-center space-x-2 sm:col-span-2">
                <input
                  type="checkbox"
                  id="doesNotExpire"
                  checked={formData.doesNotExpire}
                  onChange={(e) => handleChange('doesNotExpire', e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                />
                <Label htmlFor="doesNotExpire" className="cursor-pointer">
                  This certification does not expire
                </Label>
              </div>
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
          <p className="text-slate-500 dark:text-slate-400 mt-4">Loading certifications...</p>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="p-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-center">
          <p className="text-red-600 dark:text-red-400">
            Unable to load certifications. Please try again later.
          </p>
        </Card>
      )}

      {/* Certifications List */}
      {!isLoading && !error && (
        <div className="space-y-4">
          {certificationsList.map(certification => {
          const isExpired =
            !certification.doesNotExpire &&
            certification.expiryDate &&
            new Date(certification.expiryDate) < new Date();

          return (
            <Card
              key={certification.id}
              className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {certification.name}
                      </h4>
                      <p className="text-purple-600 dark:text-purple-400 font-medium">
                        {certification.issuingOrganization}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          Issued:{' '}
                          {new Date(certification.issueDate).toLocaleDateString('en-US', {
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                        {!certification.doesNotExpire && certification.expiryDate && (
                          <>
                            <span className="text-slate-400 dark:text-slate-600">•</span>
                            <span
                              className={`text-sm ${
                                isExpired
                                  ? 'text-red-600 dark:text-red-400'
                                  : 'text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              {isExpired ? 'Expired: ' : 'Expires: '}
                              {new Date(certification.expiryDate).toLocaleDateString('en-US', {
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                          </>
                        )}
                        {certification.doesNotExpire && (
                          <>
                            <span className="text-slate-400 dark:text-slate-600">•</span>
                            <span className="text-sm text-green-600 dark:text-green-400">
                              No expiration
                            </span>
                          </>
                        )}
                      </div>

                      {certification.credentialId && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                          Credential ID: {certification.credentialId}
                        </p>
                      )}

                      {certification.credentialUrl && (
                        <a
                          href={certification.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 mt-2"
                        >
                          <ExternalLink className="h-4 w-4" />
                          View Credential
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <Button
                    onClick={() => handleEdit(certification)}
                    variant="outline"
                    size="sm"
                    className="border-slate-300 dark:border-slate-700"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(certification.id!)}
                    variant="outline"
                    size="sm"
                    className="border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}

        {certificationsList.length === 0 && !isAdding && (
          <Card className="p-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-center">
            <p className="text-slate-500 dark:text-slate-400">
              No certifications yet. Click "Add Certification" to get started.
            </p>
          </Card>
        )}
      </div>
      )}
    </div>
  );
}
