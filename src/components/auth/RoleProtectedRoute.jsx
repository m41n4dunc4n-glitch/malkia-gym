import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import { getProfile } from "../../services/profile";

function RoleProtectedRoute({ role, children }) {
  const { user, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkRole() {
      if (authLoading) {
        return;
      }

      if (!user) {
        if (mounted) {
          setAllowed(false);
          setLoading(false);
        }

        return;
      }

      const { data, error } = await getProfile(user.id);

      if (!mounted) {
        return;
      }

      if (error || !data) {
        console.error("Role check failed:", error);

        setAllowed(false);
        setLoading(false);

        return;
      }

      setAllowed(data.role === role);
      setLoading(false);
    }

    checkRole();

    return () => {
      mounted = false;
    };
  }, [user, role, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-pink-600" />

          <p className="font-semibold text-gray-700">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowed) {
    /*
      If a member tries /trainer,
      they go back to their dashboard.

      If a trainer tries /admin,
      they go back to their dashboard.

      If an admin tries /member,
      they go back to their dashboard.
    */

    if (role === "admin") {
      return <Navigate to="/admin" replace />;
    }

    if (role === "trainer") {
      return <Navigate to="/trainer" replace />;
    }

    return <Navigate to="/member" replace />;
  }

  return children;
}

export default RoleProtectedRoute;