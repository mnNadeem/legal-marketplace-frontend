export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'client' | 'lawyer';
  jurisdiction?: string;
  barNumber?: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface Case {
  id: string;
  title: string;
  category: string;
  description: string;
  status: 'open' | 'engaged' | 'closed' | 'cancelled';
  clientId: string;
  client?: User;
  quotes?: Quote[];
  files?: CaseFile[];
  createdAt: string;
  updatedAt: string;
}

export interface Quote {
  id: string;
  amount: number;
  expectedDays: number;
  note?: string;
  status: 'proposed' | 'accepted' | 'rejected';
  caseId: string;
  lawyerId: string;
  lawyer?: User;
  case?: Case;
  createdAt: string;
  updatedAt: string;
}

export interface CaseFile {
  id: string;
  originalName: string;
  filename: string;
  mimetype: string;
  size: number;
  path: string;
  caseId: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  amount: number;
  stripePaymentIntentId?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  clientId: string;
  lawyerId: string;
  caseId: string;
  quoteId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateCaseData {
  title: string;
  category: string;
  description: string;
}

export interface CreateQuoteData {
  amount: number;
  expectedDays: number;
  note?: string;
}

export interface SignUpData {
  email: string;
  password: string;
  name?: string;
  role: 'client' | 'lawyer';
  jurisdiction?: string;
  barNumber?: string;
}

export interface SignInData {
  email: string;
  password: string;
}