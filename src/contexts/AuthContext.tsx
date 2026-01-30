import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User, Session } from "@supabase/supabase-js";

export type AuthUser = {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  role?: 'admin' | 'user';
  gender?: 'male' | 'female' | 'other';
  birthdate?: string;
  city?: string;
  mobileNumber?: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  getAccessToken: () => string | null;
  updateUser: (data: Partial<AuthUser>) => Promise<void>;
  fetchUserProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Hàm lấy profile từ Supabase profiles table
  const fetchUserProfile = async () => {
    try {
      const { data: { user: supabaseUser } } = await supabase.auth.getUser();
      if (!supabaseUser) {
        setUser(null);
        return;
      }

      // Lấy profile từ profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      setUser({
        id: supabaseUser.id,
        email: supabaseUser.email || "",
        name: profile?.name || supabaseUser.user_metadata?.name || supabaseUser.user_metadata?.full_name || supabaseUser.email?.split("@")[0] || "User",
        avatarUrl: supabaseUser.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(supabaseUser.email || "U")}`,
        role: profile?.role || 'user',
        gender: profile?.gender,
        birthdate: profile?.birthdate,
        city: profile?.city,
        mobileNumber: profile?.mobile_number,
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  // Hàm chuyển đổi Supabase User → AuthUser (deprecated, sử dụng fetchUserProfile)
  const mapUser = (supabaseUser: User | null): AuthUser | null => {
    if (!supabaseUser) return null;
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || "",
      name: supabaseUser.user_metadata?.name || supabaseUser.user_metadata?.full_name || supabaseUser.email?.split("@")[0] || "User",
      avatarUrl: supabaseUser.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(supabaseUser.email || "U")}`,
      role: 'user',
    };
  };

  // Lắng nghe thay đổi auth state
  useEffect(() => {
    // Lấy session hiện tại
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile();
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Lắng nghe sự kiện auth thay đổi
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile();
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Đăng ký
  const signUp = async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
          full_name: name,
        },
      },
    });

    if (error) throw error;

    // Nếu cần xác thực email, Supabase sẽ gửi email
    // User chỉ được đăng nhập sau khi xác thực
    return;
  };

  // Đăng nhập
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  };

  // Đăng nhập bằng Google
  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) throw error;
  };

  // Đăng xuất
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  // Lấy access token (để gửi xuống backend)
  const getAccessToken = () => {
    return session?.access_token || null;
  };

  // Cập nhật thông tin user
  const updateUser = async (data: Partial<AuthUser>) => {
    if (!user) throw new Error('No user logged in');
    
    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.gender) updateData.gender = data.gender;
    if (data.birthdate) updateData.birthdate = data.birthdate;
    if (data.city) updateData.city = data.city;
    if (data.mobileNumber) updateData.mobile_number = data.mobileNumber;

    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id);

    if (error) throw error;

    // Reload user profile
    await fetchUserProfile();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        getAccessToken,
        updateUser,
        fetchUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}