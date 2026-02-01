import thachthat from "@/assets/thach-that.jpg"
import langgomBatTrang from "@/assets/lang-gom-bat-trang.webp";
import langnghe from "@/assets/lang-non-chuong-4.jpg";
import langtrePhuVinh from "@/assets/lang-nghe-may-tre-dan-phu-vinh.jpg";
import langnonchuong from "@/assets/lang-non-chuong.webp";
import thunglungbanxoi from "@/assets/thung-lung-ban-xoi.jpg";
import hanoi from "@/assets/hanoi.jpg";
import tourThachThat from "@/assets/tour-thach-that.jpg";

export type Blog = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  location: string;
  externalUrl?: string; // Optional external link
};

export const hanoiBlogs: Blog[] = [
  {
    slug: "Cam-nang-Ha-Noi",
    title: "Cẩm nang du lịch Hà Nội",
    excerpt:
      "Blog sẽ cung cấp những thông tin hữu ích cho du khách muốn tham quan Hà Nội.",
    content: "Cẩm nang du lịch Hà Nội từ A đến Z với những thông tin hữu ích về ẩm thực, địa điểm tham quan, lưu trú và di chuyển.",
    image: hanoi,
    location: "Hà Nội",
    externalUrl: "https://www.ivivu.com/blog/2013/10/du-lich-ha-noi-cam-nang-tu-a-den-z/",
  },

  {
    slug: "thach-that",
    title: "Thạch Thất và những điểm hẹn",
    excerpt:
      "Thạch Thất, nơi giao hòa giữa làng nghề truyền thống, núi non và không gian văn hóa xứ Đoài.",
    content: "Trải nghiệm Thạch Thất và những địa điểm du lịch thú vị nhất tại đây.",
    image: thachthat,
    location: "Thạch Thất, Hà Nội",
    externalUrl: "https://viettopreview.vn/khu-du-lich-o-thach-that.html",
  },

  {
    slug: "lang-nghe-truyen-thong",
    title: "Top 10 Làng nghề truyền thống khu vực Bắc Bộ",
    excerpt:
      "Khám phá 10 làng nghề truyền thống nổi bật nhất khu vực Bắc Bộ, nơi lưu giữ những giá trị văn hóa lâu đời và tinh hoa thủ công Việt Nam. Từ làng gốm Bát Tràng, làng lụa Vạn Phúc đến làng mây tre đan Phú Vinh, mỗi làng nghề đều mang một câu chuyện riêng, gắn liền với đời sống và lịch sử địa phương.",
    content: "Làng nghề Việt Nam",
    image: langnghe,
    location: "Hà Đông, Hà Nội",
    externalUrl: "https://www.traveloka.com/vi-vn/explore/destination/lang-nghe-truyen-thong/434339",
  },

];

export function getBlogBySlug(slug: string): Blog | undefined {
  return hanoiBlogs.find((b) => b.slug === slug);
}
