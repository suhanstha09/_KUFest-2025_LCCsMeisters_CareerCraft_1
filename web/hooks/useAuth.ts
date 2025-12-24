import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  loginUser,
  signupUser,
  logoutUser,
  getCurrentUser,
  getUserProfile,
  updateUserProfile,
} from "@/api";
import { handleError } from "@/features/auth/lib/utils";

// Get current user
export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Login mutation
export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginUser(email, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (error: Error) => handleError("Login failed", error),
  });
};

// Signup mutation
export const useSignup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userData: {
      email: string;
      password: string;
      username?: string;
    }) => signupUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (error: Error) => handleError("Signup failed", error),
  });
};

// Logout mutation
export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.clear();
    },
    onError: (error: Error) => handleError("Logout failed", error),
  });
};

// Get user profile
export const useGetUserProfile = () => {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
    staleTime: 1000 * 60 * 5,
  });
};

// Update user profile
export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (profileData: Record<string, any>) =>
      updateUserProfile(profileData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
    onError: (error: Error) => handleError("Profile update failed", error),
  });
};
