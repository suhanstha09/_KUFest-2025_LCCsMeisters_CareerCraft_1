import axios, { AxiosError } from "axios";

export const handleError = (message: string, error: Error | AxiosError) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ detail?: string }>;
    console.error(
      `${message}:`,
      axiosError.response?.data?.detail || axiosError.message
    );
    return {
      message,
      status: axiosError.response?.status,
      details: axiosError.response?.data?.detail,
    };
  }

  console.error(`${message}:`, error.message);
  return {
    message,
    details: error.message,
  };
};

export const getErrorMessage = (error: Error | AxiosError): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ detail?: string }>;
    return axiosError.response?.data?.detail || axiosError.message;
  }
  return error.message;
};
