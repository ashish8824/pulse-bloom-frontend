import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setCredentials, logout } from "@/features/auth/authSlice";
import { Spinner } from "@/components/ui/Spinner";

export function ProtectedRoute() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const restore = async () => {
      // Already authenticated (e.g. navigating between pages) — nothing to do
      if (isAuthenticated) {
        setChecking(false);
        return;
      }

      // Read directly from localStorage — never trust Redux state on hard refresh
      // because Redux may not have hydrated yet when this effect first runs
      const storedToken = localStorage.getItem("refreshToken");

      if (!storedToken) {
        setChecking(false);
        return;
      }

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/auth/refresh-token`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken: storedToken }),
          },
        );

        if (res.ok) {
          const data = await res.json();
          dispatch(setCredentials(data));
        } else {
          dispatch(logout());
        }
      } catch {
        dispatch(logout());
      } finally {
        setChecking(false);
      }
    };

    restore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Spinner size="lg" className="text-brand-400" />
          <p className="text-sm text-gray-500">Restoring session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
