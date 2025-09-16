import axios, { AxiosResponse } from 'axios';
import { 
  AuthResponse, 
  User, 
  Case, 
  Quote, 
  Payment, 
  PaginatedResponse,
  CreateCaseData,
  CreateQuoteData,
  SignUpData,
  SignInData
} from '../types';

const API_BASE_URL = (import.meta as any).env?.VITE_APP_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  signUp: (data: SignUpData): Promise<AxiosResponse<AuthResponse>> =>
    api.post('/auth/signup', data),
  
  signIn: (data: SignInData): Promise<AxiosResponse<AuthResponse>> =>
    api.post('/auth/signin', data),
};

export const casesApi = {
  create: (data: CreateCaseData): Promise<AxiosResponse<Case>> =>
    api.post('/cases', data),
  
  getAll: (params?: {
    category?: string;
    createdSince?: string;
    page?: number;
    limit?: number;
  }): Promise<AxiosResponse<PaginatedResponse<Case>>> =>
    api.get('/cases', { params }),
  
  getById: (id: string): Promise<AxiosResponse<Case>> =>
    api.get(`/cases/${id}`),
  
  update: (id: string, data: Partial<CreateCaseData>): Promise<AxiosResponse<Case>> =>
    api.patch(`/cases/${id}`, data),
  
  uploadFiles: (id: string, files: FileList): Promise<AxiosResponse<any[]>> => {
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append('files', file);
    });
    return api.post(`/cases/${id}/files`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  acceptQuote: (caseId: string, quoteId: string): Promise<AxiosResponse<any>> =>
    api.post(`/cases/${caseId}/accept-quote`, { quoteId }),
  
  getQuotes: (caseId: string): Promise<AxiosResponse<Quote[]>> =>
    api.get(`/quotes/cases/${caseId}`),
};

export const quotesApi = {
  create: (caseId: string, data: CreateQuoteData): Promise<AxiosResponse<Quote>> =>
    api.post(`/quotes/cases/${caseId}`, data),
  
  getAll: (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<AxiosResponse<PaginatedResponse<Quote>>> =>
    api.get('/quotes', { params }),
  
  getById: (id: string): Promise<AxiosResponse<Quote>> =>
    api.get(`/quotes/${id}`),
  
  update: (id: string, data: Partial<CreateQuoteData>): Promise<AxiosResponse<Quote>> =>
    api.patch(`/quotes/${id}`, data),
  
  delete: (id: string): Promise<AxiosResponse<void>> =>
    api.delete(`/quotes/${id}`),
};

export const paymentsApi = {
  createIntent: (quoteId: string): Promise<AxiosResponse<{ clientSecret: string; paymentId: string }>> =>
    api.post(`/payments/create-intent/${quoteId}`),
  
  confirm: (paymentIntentId: string): Promise<AxiosResponse<Payment>> =>
    api.post(`/payments/confirm/${paymentIntentId}`),
  
  getStatus: (paymentId: string): Promise<AxiosResponse<Payment>> =>
    api.get(`/payments/${paymentId}/status`),
};

export const filesApi = {
  getSecureUrl: (fileId: string): Promise<AxiosResponse<{ url: string }>> =>
    api.get(`/files/${fileId}/secure-url`),
  
  download: (fileId: string, token: string): Promise<Blob> =>
    api.get(`/files/secure/${fileId}?token=${token}`, { responseType: 'blob' }),
};

export default api;