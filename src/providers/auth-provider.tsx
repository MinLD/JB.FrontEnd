"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  getCurrentUser,
  onSessionExpired,
} from "@/services/auth-service";
import type { AuthUser } from "@/types/auth";
import type { ApiResult } from "@/types/api";
type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  reload: () => Promise<ApiResult<AuthUser>>;
};
const AuthContext = createContext<AuthContextValue | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestVersion = useRef(0);
  const invalidateRequests = useCallback(() => {
    requestVersion.current++;
  }, []);
  const reload = useCallback(async () => {
    const version = ++requestVersion.current;
    const result = await getCurrentUser();
    if (version !== requestVersion.current) return result;
    if (result.success) {
      setUser(result.data);
      setError(null);
    } else if (result.status === 401) {
      setUser(null);
      setError(null);
    } else {
      setError(result.message);
    }
    setLoading(false);
    return result;
  }, []);
  useEffect(() => {
    const unsubscribe = onSessionExpired(() => {
      invalidateRequests();
      setUser(null);
      setError(null);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void reload();
    return () => {
      invalidateRequests();
      unsubscribe();
    };
  }, [reload, invalidateRequests]);
  return (
    <AuthContext.Provider value={{ user, loading, error, reload }}>
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth requires AuthProvider");
  return value;
}
