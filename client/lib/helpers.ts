import { useEffect, useState } from "react";

// Token Management
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("refreshToken");
}

export function setAccessToken(token: string): void {
  localStorage.setItem("accessToken", token);
}

export function setRefreshToken(token: string): void {
  localStorage.setItem("refreshToken", token);
}

export function clearTokens(): void {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

// Format utilities
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

// CSV Export
export function exportToCSV(
  data: Record<string, any>[],
  filename: string = "export.csv"
): void {
  if (data.length === 0) return;

  // Get headers from first object
  const headers = Object.keys(data[0]);

  // Create CSV content
  let csv = headers.map((h) => `"${h}"`).join(",") + "\n";

  data.forEach((row) => {
    const values = headers.map((header) => {
      const value = row[header];
      // Escape quotes in values
      return `"${String(value).replace(/"/g, '""')}"`;
    });
    csv += values.join(",") + "\n";
  });

  // Create blob and download
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Debounce hook
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// Status color utilities
export function getStatusColor(
  status: string
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "new":
      return "default";
    case "contacted":
      return "secondary";
    case "qualified":
      return "outline";
    case "lost":
      return "destructive";
    default:
      return "default";
  }
}

// Status badge text
export function getStatusLabel(status: string): string {
  switch (status) {
    case "new":
      return "New";
    case "contacted":
      return "Contacted";
    case "qualified":
      return "Qualified";
    case "lost":
      return "Lost";
    default:
      return status;
  }
}

// Source label
export function getSourceLabel(source: string): string {
  switch (source) {
    case "website":
      return "Website";
    case "instagram":
      return "Instagram";
    case "referral":
      return "Referral";
    default:
      return source;
  }
}

// Truncate text
export function truncateText(text: string, length: number = 30): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
}
