import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { getProfile } from "../services/profile";
import { AuthContext } from "./AuthContext";

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function validateSession(session) {
    if (!session?.user) {
      setUser(null);
      setLoading(false);
      return;
    }

    const { data: profile } = await getProfile(session.user.id);

    if (profile?.status === "Suspended") {
      await supabase.auth.signOut();

      alert(
        "Your account has been suspended.\nPlease contact the gym administrator."
      );

      setUser(null);
      setLoading(false);
      return;
    }

    setUser(session.user);
    setLoading(false);
  }

  useEffect(() => {
    async function loadSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      await validateSession(session);
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        await validateSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;