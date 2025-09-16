import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import "./index.css";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ClientDashboard from "./pages/ClientDashboard";
import LawyerMarketplace from "./pages/LawyerMarketplace";
import CreateCasePage from "./pages/CreateCasePage";
import MyQuotesPage from "./pages/MyQuotesPage";
import CaseDetailPage from "./pages/CaseDetailPage";
import SubmitQuotePage from "./pages/SubmitQuotePage";
import MyCasesPage from "./pages/MyCasesPage";
import CheckoutPage from "./pages/CheckoutPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  allowedRoles?: string[];
}> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route
                path="/"
                element={
                  <PublicRoute>
                    <LandingPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/signup/:role"
                element={
                  <PublicRoute>
                    <SignupPage />
                  </PublicRoute>
                }
              />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <ClientDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/marketplace"
                element={
                  <ProtectedRoute allowedRoles={["lawyer"]}>
                    <LawyerMarketplace />
                  </ProtectedRoute>
                }
              />
              {/* Add the new route for My Quotes */}
              <Route
                path="/my-quotes"
                element={
                  <ProtectedRoute allowedRoles={["lawyer"]}>
                    <MyQuotesPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/create-case"
                element={
                  <ProtectedRoute allowedRoles={["client"]}>
                    <CreateCasePage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/my-cases"
                element={
                  <ProtectedRoute allowedRoles={["client"]}>
                    <MyCasesPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/cases/:id"
                element={
                  <ProtectedRoute>
                    <CaseDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cases/:id/quote"
                element={
                  <ProtectedRoute allowedRoles={["lawyer"]}>
                    <SubmitQuotePage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/cases/:id/checkout/:quoteId"
                element={
                  <ProtectedRoute allowedRoles={["client"]}>
                    <CheckoutPage />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "#363636",
                  color: "#fff",
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: "#10B981",
                    secondary: "#fff",
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: "#EF4444",
                    secondary: "#fff",
                  },
                },
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
