// User Types

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "sales";
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// Lead Types
export type LeadStatus = "new" | "contacted" | "qualified" | "lost";
export type LeadSource = "website" | "instagram" | "referral";

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  remarks?: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
    role: "admin" | "sales";
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeadPayload {
  name: string;
  email: string;
  source: LeadSource;
  remarks?: string;
}

export interface UpdateLeadPayload {
  name?: string;
  email?: string;
  status?: LeadStatus;
  source?: LeadSource;
  remarks?: string;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  statusCode: number;
  message: string;
  data?: T;
}

export interface LeadsMetadata {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface LeadsResponse {
  leads: Lead[];
  meta: LeadsMetadata;
}

// Query Filters
export interface LeadFilters {
  page: number;
  limit: number;
  search?: string;
  status?: LeadStatus;
  source?: LeadSource;
  sort?: "latest" | "oldest";
}
