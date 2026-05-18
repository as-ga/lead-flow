"use client";
import { useAuthStore } from "@/lib/store";

export default function Setting() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <p>Welcome, {user?.name}! This is your settings page.</p>
    </div>
  );
}
