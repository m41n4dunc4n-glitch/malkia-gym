import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import { getProfile } from "../../services/profile";

function RoleProtectedRoute({ role, children }) {
  const { user, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    async function checkRole() {
      if (authLoading) return;

      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await getProfile(user.id);

      setAllowed(data?.role === role);
      setLoading(false);
    }

    checkRole();
  }, [user, role, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-xl font-semibold">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowed) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RoleProtectedRoute;