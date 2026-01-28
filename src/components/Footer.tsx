import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react";
import { useTours } from "@/contexts/TourContext";
import { t } from "@/lib/i18n";

const Footer = () => {
  const { language } = useTours();
  return (
    <footer id="contact" className="bg-secondary/50 border-t border-border mt-20 scroll-mt-24">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/icon_joigo.svg"
                alt="Joigo Logo"
                className="w-10 h-10"
              />
              <span className="text-xl font-bold bg-ocean-gradient bg-clip-text text-transparent">
                Joigo
              </span>
            </div>
            <p className="text-muted-foreground mb-4">
              {t(language, "ft_company_desc")}
            </p>
          </div>

          {/* About Joigo */}
          <div>
            <h3 className="font-semibold text-lg mb-4">
              {t(language, "ft_about_joigo")}
            </h3>
            <div className="space-y-3">
              <a
                href="#"
                className="block text-muted-foreground hover:text-primary transition-colors"
              >
                {t(language, "ft_about_us")}
              </a>
              <a
                href="#"
                className="block text-muted-foreground hover:text-primary transition-colors"
              >
                {t(language, "ft_sustainable_tourism")}
              </a>
              <a
                href="#"
                className="block text-muted-foreground hover:text-primary transition-colors"
              >
                {t(language, "ft_voucher_joigo")}
              </a>
              <a
                href="#"
                className="block text-muted-foreground hover:text-primary transition-colors"
              >
                {t(language, "ft_help_center")}
              </a>
              <a
                href="#"
                className="block text-muted-foreground hover:text-primary transition-colors"
              >
                {t(language, "ft_how_to_book")}
              </a>
            </div>
          </div>

          {/* Partners */}
          <div>
            <h3 className="font-semibold text-lg mb-4">
              {t(language, "ft_partners")}
            </h3>
            <div className="space-y-3">
              <a
                href="#"
                className="block text-muted-foreground hover:text-primary transition-colors"
              >
                {t(language, "ft_register_supplier")}
              </a>
              <a
                href="#"
                className="block text-muted-foreground hover:text-primary transition-colors"
              >
                {t(language, "ft_technology_partner")}
              </a>
              <a
                href="#"
                className="block text-muted-foreground hover:text-primary transition-colors"
              >
                {t(language, "ft_affiliate_partner")}
              </a>
              <a
                href="#"
                className="block text-muted-foreground hover:text-primary transition-colors"
              >
                {t(language, "ft_agent_program")}
              </a>
              <a
                href="#"
                className="block text-muted-foreground hover:text-primary transition-colors"
              >
                {t(language, "ft_partner_with_joigo")}
              </a>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="font-semibold text-lg mb-4">
              {t(language, "ft_contact_us")}
            </h3>
            <div className="space-y-3">
              <a
                href="mailto:info@joigo.com"
                className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="w-5 h-5 text-primary" />
                <span>info@joigo.com</span>
              </a>
              <a
                href="tel:+84971769862"
                className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="w-5 h-5 text-primary" />
                <span>+84 971 769 862</span>
              </a>
              <div className="flex items-start gap-3 text-muted-foreground">
                <MapPin className="w-5 h-5 text-primary mt-1" />
                <span>
                  Thach Hoa, Thach That, Ha Noi, Vietnam
                  <br />
                </span>
              </div>
            </div>
          </div>

          {/* Map Placeholder */}
          <div>
            <h3 className="font-semibold text-lg mb-4">
              {t(language, "ft_find_us")}
            </h3>
            <div className="w-full h-48 rounded-lg overflow-hidden border border-border">
              <iframe
                src="https://www.google.com/maps?q=Thach+Hoa,+Thach+That,+Ha+Noi,+Vietnam&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        {/* Payment Methods & Social Media */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Payment Methods */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {t(language, "ft_we_accept")}
              </span>
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 bg-gradient-to-br from-[#1A1F71] to-[#1434CB] rounded-md shadow-sm">
                  <span className="text-sm font-bold text-white">VISA</span>
                </div>
                <div className="px-4 py-2 bg-gradient-to-br from-[#EB001B] to-[#F79E1B] rounded-md shadow-sm">
                  <span className="text-sm font-bold text-white">
                    Mastercard
                  </span>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {t(language, "ft_follow_us")}
              </span>
              <div className="flex gap-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-[#1877F2] rounded-lg flex items-center justify-center hover:bg-[#166FE5] hover:scale-110 transition-all shadow-sm"
                >
                  <Facebook className="w-5 h-5 text-white" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gradient-to-br from-[#F56040] via-[#E1306C] to-[#C13584] rounded-lg flex items-center justify-center hover:scale-110 transition-all shadow-sm"
                >
                  <Instagram className="w-5 h-5 text-white" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-[#1DA1F2] rounded-lg flex items-center justify-center hover:bg-[#1A91DA] hover:scale-110 transition-all shadow-sm"
                >
                  <Twitter className="w-5 h-5 text-white" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-[#FF0000] rounded-lg flex items-center justify-center hover:bg-[#E60000] hover:scale-110 transition-all shadow-sm"
                >
                  <Youtube className="w-5 h-5 text-white" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-8 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            © 2025 Joigo. {t(language, "ft_copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
