import axiosInstance from "@/services/axios";

// Auth APIs
export const loginUser = async (email: string, password: string) => {
  const { data } = await axiosInstance.post("/users/auth/login/", { email, password });
  return data;
};

export const signupUser = async (userData: {
  email: string;
  password: string;
  username?: string;
}) => {
  const { data } = await axiosInstance.post("/auth/signup/", userData);
  return data;
};

export const logoutUser = async () => {
  const { data } = await axiosInstance.post("/auth/logout/");
  return data;
};

export const getCurrentUser = async () => {
  const { data } = await axiosInstance.get("/auth/me/");
  return data;
};

// File Upload APIs
export const uploadFiles = async (files: File[]) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  const { data } = await axiosInstance.post("/upload/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

// Skills APIs
export const getSkills = async () => {
  const { data } = await axiosInstance.get("/skills/");
  return data;
};

export const getUserSkills = async () => {
  const { data } = await axiosInstance.get("/skills/user/");
  return data;
};

export const addUserSkill = async (skillData: {
  skill_id: string;
  proficiency_level: string;
}) => {
  const { data } = await axiosInstance.post("/skills/user/", skillData);
  return data;
};

// Job Match APIs
export const analyzeJobMatch = async (jobUrl: string) => {
  const { data } = await axiosInstance.post("/job-match/analyze/", {
    job_url: jobUrl,
  });
  return data;
};

// Roadmap APIs
export const getRoadmap = async () => {
  const { data } = await axiosInstance.get("/roadmap/");
  return data;
};

export const updateRoadmapProgress = async (weekId: string) => {
  const { data } = await axiosInstance.patch(`/roadmap/${weekId}/`, {
    completed: true,
  });
  return data;
};

// Profile APIs
export const getUserProfile = async () => {
  const { data } = await axiosInstance.get("/profile/");
  return data;
};

export const updateUserProfile = async (profileData: Record<string, any>) => {
  const { data } = await axiosInstance.patch("/profile/", profileData);
  return data;
};

// Onboarding API - Upload resume and build profile
export const uploadResumeOnboard = async (resumeFile: File) => {
  const formData = new FormData();
  formData.append("resume", resumeFile);

  console.log("Uploading resume:", {
    name: resumeFile.name,
    type: resumeFile.type,
    size: resumeFile.size,
  });

  // Extended timeout for AI processing (5 minutes)
  const { data } = await axiosInstance.post("/profiles/profile/onboard/", formData, {
    timeout: 300000, // 5 minutes
  });
  return data;
};

// Job Analysis APIs
export const analyzeDreamJob = async (jobData: {
  job_description: string;
  additional_context?: string;
  save_job?: boolean;
}) => {
  // Extended timeout for AI processing (5 minutes)
  const { data } = await axiosInstance.post("/jobs/analyses/analyze_dream_job/", jobData, {
    timeout: 300000, // 5 minutes
  });
  return data;
};
