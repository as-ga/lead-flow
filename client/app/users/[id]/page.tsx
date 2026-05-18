"use client";
import { useAuthStore } from "@/lib/store";
import { use, useEffect, useState } from "react";
import { User } from "@/types";
import { apiClient } from "@/lib/api";
import { Loader2 } from "lucide-react";

type Props = {
  params: Promise<{ id: string }>;
};

export default function UserById({ params }: Props) {
  const [userData, serUserData] = useState<User | null>(null);
  const { id } = use(params);

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user) {
      apiClient.getUserById(id).then((data) => {
        serUserData(data);
      });
    }
  }, [id, user]);

  if (user?.role !== "admin") {
    return <p>Access denied. Admins only.</p>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <nav className="bg-indigo-500 p-4 shadow mb-4 flex items-center justify-between">
        <h1 className="text-lg font-bold">User Details</h1>

        <div className="mt-2">
          <p>
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 inline-block mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </span>
            {user?.name} ({user?.email})
          </p>
        </div>
      </nav>
      <main className="container mx-auto p-4 grow">
        <div className="bg-white p-6 rounded shadow mb-6">
          <h1 className="text-2xl font-bold mb-4">User Details</h1>
          {userData ? (
            <div className="space-y-2">
              <p>Name: {userData.name}</p>
              <p>Email: {userData.email}</p>
              <p>Role: {userData.role}</p>
              <p>Created At: {new Date(userData.createdAt).toLocaleString()}</p>
            </div>
          ) : (
            <p className="flex">
              <Loader2 className="animate-spin mr-2" />
              Loading user details...
            </p>
          )}
        </div>
      </main>
      <footer className="bg-gray-100 p-4 text-center text-sm text-gray-600">
        &copy; {new Date().getFullYear()} Lead Management System. All rights
        reserved.
      </footer>
    </div>
  );
}
