export interface CustomApiError extends Error {
  status: number;
  code: string;
  message: string;
  error?: { [key: string]: string | undefined }; // Properti 'error' yang berisi detail validasi
}
