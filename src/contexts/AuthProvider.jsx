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

    const { data: profile, error } = await getProfile(
      session.user.id
    );

    if (error) {
      console.error("Auth profile error:", error);

      setUser(null);
      setLoading(false);

      return;
    }

    if (!profile) {
      console.error("No profile found for authenticated user.");

      await supabase.auth.signOut();

      setUser(null);
      setLoading(false);

      return;
    }

    /*
      Suspended accounts cannot use the system.
    */

    if (profile.status === "Suspended") {
      await supabase.auth.signOut();

      alert(
        "Your account has been suspended.\nPlease contact the gym administrator."
      );

      setUser(null);
      setLoading(false);

      return;
    }

    /*
      Deleted accounts cannot use the system.
    */

    if (profile.status === "Deleted") {
      await supabase.auth.signOut();

      alert("This account has been deleted.");

      setUser(null);
      setLoading(false);

      return;
    }

    /*
      Everything is valid.

      We keep the Supabase auth user here.
      The role is retrieved from profiles whenever
      authorization needs to be checked.
    */

    setUser(session.user);
    setLoading(false);
  }

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) {
        return;
      }

      await validateSession(session);
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) {
          return;
        }

        /*
          Ignore token refresh noise.
          The current authenticated user remains valid.
        */

        if (event === "TOKEN_REFRESHED") {
          if (session?.user) {
            setUser(session.user);
          }

          setLoading(false);

          return;
        }

        await validateSession(session);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
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