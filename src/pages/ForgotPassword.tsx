import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // TODO: Call forgot-password API
      await new Promise((r) => setTimeout(r, 700));
      setSent(true);
    } catch (err) {
      setError("Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại.");
    } finally {
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
              <CardTitle className="text-2xl">Quên mật khẩu</CardTitle>
            </CardHeader>
            <CardContent>
              {sent ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Nếu email tồn tại trong hệ thống, chúng tôi đã gửi hướng dẫn
                    đặt lại mật khẩu đến {email}.
                  </p>
                  <Link
                    to="/login"
                    className="text-primary hover:underline text-sm"
                  >
                    ← Quay lại đăng nhập
                  </Link>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={onSubmit}>
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="you@example.com"
                    />
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Đang gửi..." : "Gửi liên kết đặt lại"}
                  </Button>
                  <div className="text-right">
                    <Link
                      to="/login"
                      className="text-primary hover:underline text-sm"
                    >
                      ← Quay lại đăng nhập
                    </Link>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ForgotPassword;
