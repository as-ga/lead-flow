import { create } from "zustand";
import { User, Lead } from "@/types";

// Auth Store
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  setUser: (user: User | null) => void;
  setIsAuthenticated: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setIsAuthenticated: (value) => set({ isAuthenticated: value }),
  setIsLoading: (value) => set({ isLoading: value }),
  setError: (error) => set({ error }),

  logout: () => set({ user: null, isAuthenticated: false, error: null }),
  reset: () =>
    set({ user: null, isAuthenticated: false, isLoading: true, error: null }),
}));

// Leads Store
interface LeadsState {
  leads: Lead[];
  selectedLead: Lead | null;
  isLoading: boolean;
  error: string | null;
  totalLeads: number;
  currentPage: number;
  totalPages: number;

  setLeads: (leads: Lead[]) => void;
  setSelectedLead: (lead: Lead | null) => void;
  setIsLoading: (value: boolean) => void;
  setError: (error: string | null) => void;
  setMeta: (meta: { total: number; page: number; pages: number }) => void;
  addLead: (lead: Lead) => void;
  removeLead: (id: string) => void;
  updateLead: (id: string, lead: Lead) => void;
  reset: () => void;
}

export const useLeadsStore = create<LeadsState>((set) => ({
  leads: [],
  selectedLead: null,
  isLoading: false,
  error: null,
  totalLeads: 0,
  currentPage: 1,
  totalPages: 0,

  setLeads: (leads) => set({ leads }),
  setSelectedLead: (lead) => set({ selectedLead: lead }),
  setIsLoading: (value) => set({ isLoading: value }),
  setError: (error) => set({ error }),
  setMeta: (meta) =>
    set({
      totalLeads: meta.total,
      currentPage: meta.page,
      totalPages: meta.pages,
    }),

  addLead: (lead) =>
    set((state) => ({
      leads: [lead, ...state.leads],
      totalLeads: state.totalLeads + 1,
    })),

  removeLead: (id) =>
    set((state) => ({
      leads: state.leads.filter((lead) => lead._id !== id),
      totalLeads: state.totalLeads - 1,
    })),

  updateLead: (id, lead) =>
    set((state) => ({
      leads: state.leads.map((l) => (l._id === id ? lead : l)),
      selectedLead: state.selectedLead?._id === id ? lead : state.selectedLead,
    })),

  reset: () =>
    set({
      leads: [],
      selectedLead: null,
      isLoading: false,
      error: null,
      totalLeads: 0,
      currentPage: 1,
      totalPages: 0,
    }),
}));
