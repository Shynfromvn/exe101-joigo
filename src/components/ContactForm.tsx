import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useTours } from "@/contexts/TourContext";
import { t } from "@/lib/i18n";
import { QRCodeSVG } from "qrcode.react";
import vanMieu from "@/assets/van-mieu.jpg";

const ContactForm = () => {
  const { language } = useTours();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(t(language, "contact_success"));
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  // QR Code content - có thể là link Zalo, Facebook, hoặc website
  const qrCodeValue = "https://zalo.me/0971769862"; // Có thể thay đổi thành link khác

  return (
    <div className="relative rounded-2xl overflow-hidden border border-border">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${vanMieu})`,
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-8 md:p-12">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* Left Side - Form */}
          <div className="bg-background/95 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-lg">
            <h2 className="text-3xl font-bold mb-3">
              {t(language, "contact_more_to_explore")}
            </h2>
            <p className="text-muted-foreground mb-6">
              {t(language, "contact_desc")}
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block text-foreground">
                  {t(language, "contact_name")}
                </label>
                <Input
                  type="text"
                  placeholder={t(language, "contact_name_placeholder")}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="h-11 bg-background"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block text-foreground">
                    {t(language, "contact_email")}
                  </label>
                  <Input
                    type="email"
                    placeholder={t(language, "contact_email_placeholder")}
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    className="h-11 bg-background"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block text-foreground">
                    {t(language, "contact_phone")}
                  </label>
                  <Input
                    type="tel"
                    placeholder={t(language, "contact_phone_placeholder")}
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    required
                    className="h-11 bg-background"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block text-foreground">
                  {t(language, "contact_message")}
                </label>
                <Textarea
                  placeholder={t(language, "contact_message_placeholder")}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  required
                  className="min-h-32 resize-none bg-background"
                />
              </div>
              <Button 
                type="submit" 
                variant={"hero"} 
                size={"lg"} 
                className="w-full"
              >
                {t(language, "contact_submit")}
              </Button>
            </form>
          </div>

          {/* Right Side - QR Code */}
          <div className="flex flex-col items-center justify-center">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="mb-4 flex justify-center">
                <QRCodeSVG
                  value={qrCodeValue}
                  size={200}
                  level="H"
                  includeMargin={false}
                  fgColor="#000000"
                  bgColor="#ffffff"
                />
              </div>
              <p className="text-center text-sm font-medium text-gray-800">
                {t(language, "contact_scan_qr")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;