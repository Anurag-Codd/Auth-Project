import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import FloatingShape from "./components/FloatingShape";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import EmailVerification from "./pages/EmailVerification";
import ForgetPass from "./pages/ForgetPass";
import { useAuthStore } from "./store/AuthStore";
import { useEffect } from "react";
import ResetPass from "./pages/ResetPass";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isVerified } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
};

const ActiveUser = ({ children }) => {
  const { isAuthenticated, isVerified } = useAuthStore();

  if (isAuthenticated && isVerified) {
    return <Navigate to="/home" replace />;
  }
  return children;
};

function App() {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: (
        <ActiveUser>
          <SignUp />
        </ActiveUser>
      ),
    },
    {
      path: "/home",
      element: (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: "/forgot-pass",
      element: (
        <ActiveUser>
          <ForgetPass />{" "}
        </ActiveUser>
      ),
    },
    {
      path: "/login",
      element: (
        <ActiveUser>
          <LogIn />
        </ActiveUser>
      ),
    },
    {
      path: "/verify-email",
      element: (
        <ActiveUser>
          <EmailVerification />
        </ActiveUser>
      ),
    },
    { path: "*", element: <Navigate to="/" replace /> },
    {
      path: "/reset-password/:token",
      element: (
        <ActiveUser>
          <ResetPass />
        </ActiveUser>
      ),
    },
  ]);

  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-pink-950 flex items-center justify-center relative overflow-hidden">
      <FloatingShape
        color="bg-pink-600"
        size="w-64 h-64"
        top="-5%"
        left="10%"
        delay={0}
      />
      <FloatingShape
        color="bg-pink-600"
        size="w-44 h-44"
        top="70%"
        left="80%"
        delay={5}
      />
      <FloatingShape
        color="bg-gray-400"
        size="w-36 h-36"
        top="40%"
        left="30%"
        delay={2}
      />
      <FloatingShape
        color="bg-gray-500"
        size="w-36 h-36"
        top="10%"
        left="85%"
        delay={3}
      />
      <RouterProvider router={routes} />
    </div>
  );
}

export default App;
