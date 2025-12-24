import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadFiles, getRoadmap, updateRoadmapProgress } from "@/api";
import { handleError } from "@/features/auth/lib/utils";

// File upload
export const useFileUpload = () => {
  return useMutation({
    mutationFn: (files: File[]) => uploadFiles(files),
    onError: (error: Error) => handleError("File upload failed", error),
  });
};

// Get roadmap
export const useGetRoadmap = () => {
  return useQuery({
    queryKey: ["roadmap"],
    queryFn: getRoadmap,
    staleTime: 1000 * 60 * 10,
  });
};

// Update roadmap progress
export const useUpdateRoadmapProgress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (weekId: string) => updateRoadmapProgress(weekId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roadmap"] });
    },
    onError: (error: Error) => handleError("Failed to update progress", error),
  });
};
