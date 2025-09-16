import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User, AuthResponse } from "../types";
import { authApi } from "../services/api";
import toast from "react-hot-toast";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: any) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.signIn({ email, password });
      const { access_token, user: userData } = response.data;

      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(userData));

      setToken(access_token);
      setUser(userData);

      toast.success(`Welcome back, ${userData.name || userData.email}!`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
      throw error;
    }
  };

  const signup = async (data: any) => {
    try {
      const response = await authApi.signUp(data);
      const { access_token, user: userData } = response.data;

      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(userData));

      setToken(access_token);
      setUser(userData);

      toast.success(
        `Welcome to Legal Marketplace, ${userData.name || userData.email}!`
      );
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Signup failed");
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    toast.success("Logged out successfully");
  };

  const value = {
    user,
    token,
    login,
    signup,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
