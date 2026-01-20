import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTours } from "@/contexts/TourContext";
import { t } from "@/lib/i18n";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();
  const { language } = useTours();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      toast.success("Đăng nhập thành công! 🎉");
      navigate("/");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Đăng nhập thất bại. Vui lòng kiểm tra email và mật khẩu.");
    } finally {
      setLoading(false);
    }
  };

  const onGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      // Redirect sẽ được xử lý tự động bởi Supabase
    } catch (error: any) {
      console.error("Google login error:", error);
      toast.error(error.message || "Đăng nhập Google thất bại");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-10">
        <div className="max-w-md mx-auto">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-2xl">
                {t(language, "auth_sign_in")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={onSubmit}>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    {t(language, "auth_email")}
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    {t(language, "auth_password")}
                  </label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading
                    ? t(language, "auth_processing")
                    : t(language, "auth_sign_in")}
                </Button>
              </form>

              <div className="my-6">
                <Separator />
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={onGoogleLogin}
                disabled={loading}
              >
                {t(language, "auth_sign_in_with_google")}
              </Button>

              <div className="flex items-center justify-between mt-6 text-sm">
                <Link
                  to="/forgot-password"
                  className="text-primary hover:underline"
                >
                  {t(language, "auth_forgot_password")}
                </Link>
                <div>
                  {t(language, "auth_no_account")}{" "}
                  <Link to="/signup" className="text-primary hover:underline">
                    {t(language, "auth_sign_up")}
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;