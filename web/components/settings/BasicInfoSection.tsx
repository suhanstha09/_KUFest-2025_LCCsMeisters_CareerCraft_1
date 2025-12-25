'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { getUserProfile, updateUserProfile } from '@/api';

export function BasicInfoSection() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    dateOfBirth: '',
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Fetch user profile
  const { data: profile, isLoading: isFetchingProfile, error: fetchError } = useQuery({
    queryKey: ['userProfile'],
    queryFn: getUserProfile,
  });

  // Update profile mutation
  const updateMutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    },
  });

  // Populate form when profile data is loaded
  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        phoneNumber: profile.phone_number || '',
        dateOfBirth: profile.date_of_birth || '',
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Convert form data to API format (snake_case)
    const apiData = {
      username: formData.username,
      first_name: formData.firstName,
      last_name: formData.lastName,
      phone_number: formData.phoneNumber,
      date_of_birth: formData.dateOfBirth,
    };

    updateMutation.mutate(apiData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Show loading state while fetching profile
  if (isFetchingProfile) {
    return (
      <Card className="p-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-purple-600 dark:text-purple-400" />
        <p className="text-slate-500 dark:text-slate-400 mt-4">Loading profile...</p>
      </Card>
    );
  }

  // Show error state if profile fetch fails
  if (fetchError) {
    return (
      <Card className="p-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-center">
        <AlertCircle className="h-8 w-8 mx-auto text-red-600 dark:text-red-400 mb-4" />
        <p className="text-red-600 dark:text-red-400">
          Unable to load profile. Please try again later.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
      {/* Success Message */}
      {saveSuccess && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded-lg flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
          <p className="text-green-700 dark:text-green-300 font-medium">
            Profile updated successfully!
          </p>
        </div>
      )}

      {/* Error Message */}
      {updateMutation.isError && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-lg flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
          <p className="text-red-700 dark:text-red-300 font-medium">
            Failed to update profile. Please try again.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Personal Information
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="e.g., johndoe"
                value={formData.username}
                onChange={(e) => handleChange('username', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="e.g., John"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="e.g., Doe"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="e.g., +1234567890"
                value={formData.phoneNumber}
                onChange={(e) => handleChange('phoneNumber', e.target.value)}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleChange('dateOfBirth', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
          <Button
            type="submit"
            disabled={updateMutation.isPending}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
