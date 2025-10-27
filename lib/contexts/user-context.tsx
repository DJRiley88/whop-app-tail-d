"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";

interface User {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  isAdmin: boolean;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  refetch: () => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  refetch: () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      console.log("[UserContext] Fetching user data...");
      const response = await fetch("/api/user");
      console.log("[UserContext] Response status:", response.status);
      if (response.ok) {
        const data = await response.json();
        console.log("[UserContext] User data:", data.user);
        setUser(data.user);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("[UserContext] Failed to fetch user:", errorData);
        // Set a default non-admin user on failure to prevent infinite loading
        setUser({
          id: "default",
          username: "user",
          displayName: "User",
          isAdmin: false,
        });
      }
    } catch (error) {
      console.error("[UserContext] Error fetching user:", error);
      // Set a default non-admin user on failure
      setUser({
        id: "default",
        username: "user",
        displayName: "User",
        isAdmin: false,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (user) {
      console.log("[UserContext] User updated:", user);
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, loading, refetch: fetchUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}

