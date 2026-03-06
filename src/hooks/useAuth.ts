import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const initializedRef = useRef(false);

  const checkAdmin = async (userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from("admin_users")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();
      if (error) {
        console.error("Admin check error:", error.message);
        return false;
      }
      return !!data;
    } catch (e) {
      console.error("Admin check exception:", e);
      return false;
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        // Only update state, don't make DB calls in the callback
        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          // Use setTimeout to avoid blocking the auth callback
          setTimeout(async () => {
            const admin = await checkAdmin(newSession.user.id);
            setIsAdmin(admin);
            setLoading(false);
          }, 0);
        } else {
          setIsAdmin(false);
          setLoading(false);
        }
      }
    );

    // Then get the initial session
    if (!initializedRef.current) {
      initializedRef.current = true;
      supabase.auth.getSession().then(async ({ data: { session: initSession }, error }) => {
        if (error) {
          console.error("getSession error:", error.message);
          setLoading(false);
          return;
        }
        setSession(initSession);
        setUser(initSession?.user ?? null);
        if (initSession?.user) {
          const admin = await checkAdmin(initSession.user.id);
          setIsAdmin(admin);
        }
        setLoading(false);
      }).catch(() => {
        setLoading(false);
      });
    }

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setLoading(false);
    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    return { error };
  };

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
  };

  return { user, session, loading, isAdmin, signIn, signUp, signOut };
};
