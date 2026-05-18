"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { setCookie, deleteCookie, getCookie } from "cookies-next";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isAdmin: false,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }
      
      const { data, error } = await supabaseBrowser
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();
      
      setIsAdmin(data?.role === "admin");
    };

    checkAdmin();
  }, [user]);

  useEffect(() => {
    // Check session on mount
    supabaseBrowser.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session) {
        setCookie("access_token", session.access_token, { maxAge: 60 * 60 * 24 * 7 });
        setCookie("refresh_token", session.refresh_token, { maxAge: 60 * 60 * 24 * 7 });
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabaseBrowser.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session) {
          setCookie("access_token", session.access_token, { maxAge: 60 * 60 * 24 * 7 });
          setCookie("refresh_token", session.refresh_token, { maxAge: 60 * 60 * 24 * 7 });
        } else {
          deleteCookie("access_token");
          deleteCookie("refresh_token");
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabaseBrowser.auth.signOut();
    deleteCookie("access_token");
    deleteCookie("refresh_token");
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, isAdmin, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
