import axios, { AxiosInstance, AxiosError, isAxiosError } from "axios";
import {
  AuthResponse,
  Lead,
  LeadsResponse,
  LeadFilters,
  CreateLeadPayload,
  UpdateLeadPayload,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Response interceptor to handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        // return Promise.reject(error);
        if (isAxiosError(error) && error.response) {
          const { status, data } = error.response;
          const message = [
            "Access token is required",
            "Invalid or expired access token",
          ];
          if (status === 401 && message.includes(data.message)) {
            try {
              await this.client.post("/auth/refresh-tokens");
              window.location.reload();
              return Promise.resolve();
            } catch (error) {
              if (isAxiosError(error)) {
                localStorage.clear();
              }
              return Promise.reject(error);
            }
          }
        }
      }
    );
  }

  private setAuthToken(token: string) {
    if (token) {
      this.client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("accessToken", token);
    }
  }

  private getAuthToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
  }

  // Auth Endpoints
  async register(
    name: string,
    email: string,
    password: string
  ): Promise<AuthResponse> {
    const response = await this.client.post("/auth/register", {
      name,
      email,
      password,
    });
    if (response.data.data) {
      this.setAuthToken(response.data.data.accessToken);
      localStorage.setItem("refreshToken", response.data.data.refreshToken);
    }
    return response.data.data;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.client.post("/auth/login", {
      email,
      password,
    });
    if (response.data.data) {
      this.setAuthToken(response.data.data.accessToken);
      localStorage.setItem("refreshToken", response.data.data.refreshToken);
    }
    return response.data.data;
  }

  async logout(): Promise<void> {
    try {
      await this.client.get("/auth/logout");
      localStorage.clear();
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  async logoutAllSessions(): Promise<void> {
    try {
      await this.client.post("/auth/logout-all");
      localStorage.clear();
    } catch (error) {
      console.error("Logout all sessions error:", error);
    }
  }

  async loadUser(setUser: (user: AuthResponse["user"] | null) => void) {
    const response = await this.client.get("/auth/me");
    setUser(response.data.data);
  }
  async getUserById(id: string): Promise<AuthResponse["user"]> {
    const response = await this.client.get(`/auth/users/${id}`);
    return response.data.data;
  }

  // Lead Endpoints
  async createLead(payload: CreateLeadPayload): Promise<Lead> {
    const response = await this.client.post("/lead/create", payload);
    return response.data.data;
  }

  async updateLead(id: string, payload: UpdateLeadPayload): Promise<Lead> {
    const response = await this.client.put(`/lead/update/${id}`, payload);
    return response.data.data;
  }

  async deleteLead(id: string): Promise<void> {
    await this.client.delete(`/lead/delete/${id}`);
  }

  async getLeadById(id: string): Promise<Lead> {
    const response = await this.client.get(`/lead/get/${id}`);
    return response.data.data;
  }

  async getLeads(filters: Partial<LeadFilters>): Promise<LeadsResponse> {
    const params = new URLSearchParams();

    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.search) params.append("search", filters.search);
    if (filters.status) params.append("status", filters.status);
    if (filters.source) params.append("source", filters.source);
    if (filters.sort) params.append("sort", filters.sort);

    const response = await this.client.get(`/lead/get?${params.toString()}`);
    return response.data.data;
  }
}

export const apiClient = new ApiClient();
export { AxiosError };
