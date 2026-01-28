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
import { t } from "@/lib/i18n_temp";
import { toast } from "sonner";

const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();
  const { language } = useTours();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signUp(email, password, name);
      toast.success("Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản. 📧", {
        duration: 6000,
      });
      navigate("/login");
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || "Đăng ký thất bại. Email có thể đã được sử dụng.");
    } finally {
      setLoading(false);
    }
  };

  const onGoogleSignUp = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      // Redirect sẽ được xử lý tự động
    } catch (error: any) {
      console.error("Google signup error:", error);
      toast.error(error.message || "Đăng ký Google thất bại");
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
                {t(language, "auth_sign_up")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={onSubmit}>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    {t(language, "auth_full_name")}
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder={
                      language === "VI" ? "Nguyễn Văn A" : "John Doe"
                    }
                  />
                </div>
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
                    minLength={6}
                    placeholder="••••••••"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Mật khẩu tối thiểu 6 ký tự
                  </p>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading
                    ? t(language, "auth_processing")
                    : t(language, "auth_create_account")}
                </Button>
              </form>

              <div className="my-6">
                <Separator />
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={onGoogleSignUp}
                disabled={loading}
              >
                {t(language, "auth_sign_up_with_google")}
              </Button>

              <div className="flex items-center justify-between mt-6 text-sm">
                <div>
                  {t(language, "auth_already_have_account")}{" "}
                  <Link to="/login" className="text-primary hover:underline">
                    {t(language, "auth_sign_in")}
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

export default SignUp;