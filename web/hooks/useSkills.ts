import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSkills,
  getUserSkills,
  addUserSkill,
  analyzeJobMatch,
} from "@/api";
import { handleError } from "@/features/auth/lib/utils";

// Get all skills
export const useGetSkills = () => {
  return useQuery({
    queryKey: ["skills"],
    queryFn: getSkills,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Get user skills
export const useGetUserSkills = () => {
  return useQuery({
    queryKey: ["userSkills"],
    queryFn: getUserSkills,
    staleTime: 1000 * 60 * 5,
  });
};

// Add user skill
export const useAddUserSkill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (skillData: { skill_id: string; proficiency_level: string }) =>
      addUserSkill(skillData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userSkills"] });
    },
    onError: (error: Error) => handleError("Failed to add skill", error),
  });
};

// Analyze job match
export const useAnalyzeJobMatch = () => {
  return useMutation({
    mutationFn: (jobUrl: string) => analyzeJobMatch(jobUrl),
    onError: (error: Error) => handleError("Job analysis failed", error),
  });
};
