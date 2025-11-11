import { createContext, useContext, useState, ReactNode } from "react";
import vanMieu from "@/assets/van-mieu.jpg";
import vanMieu1 from "@/assets/van-mieu-1.jpg";
import vanMieu2 from "@/assets/van-mieu-2.jpg";
import vanMieu3 from "@/assets/van-mieu-3.jpg";
import vanMieu4 from "@/assets/van-mieu-4.jpg";
import vanMieu5 from "@/assets/van-mieu-5.jpg";
import vanMieu6 from "@/assets/van-mieu-6.jpg";

import langgomBatTrang from "@/assets/lang-gom-bat-trang.webp";
import langgomBatTrang1 from "@/assets/lang-gom-bat-trang-1.jpg";
import langgomBatTrang2 from "@/assets/lang-gom-bat-trang-2.jpg";
import langgomBatTrang3 from "@/assets/lang-gom-bat-trang-3.webp";
import langgomBatTrang4 from "@/assets/lang-gom-bat-trang-4.jpg";
import langgomBatTrang5 from "@/assets/lang-gom-bat-trang-5.jpg";
import langgomBatTrang6 from "@/assets/lang-gom-bat-trang-6.webp";

import langluaVanPhuc from "@/assets/lang-lua-van-phuc.jpeg";
import langluaVanPhuc1 from "@/assets/lang-lua-van-phuc-1.webp";
import langluaVanPhuc2 from "@/assets/lang-lua-van-phuc-2.jpg";
import langluaVanPhuc3 from "@/assets/lang-lua-van-phuc-3.jpg";
import langluaVanPhuc4 from "@/assets/lang-lua-van-phuc-4.jpg";
import langluaVanPhuc5 from "@/assets/lang-lua-van-phuc-5.jpg";
import langluaVanPhuc6 from "@/assets/lang-lua-van-phuc-6.jpg";

import langtrePhuVinh from "@/assets/lang-nghe-may-tre-dan-phu-vinh.jpg";
import langtrePhuVinh1 from "@/assets/lang-tre-phu-vinh-1.jpg";
import langtrePhuVinh2 from "@/assets/lang-tre-phu-vinh-2.jpg";
import langtrePhuVinh3 from "@/assets/lang-tre-phu-vinh-3.jpg";
import langtrePhuVinh4 from "@/assets/lang-tre-phu-vinh-4.jpg";
import langtrePhuVinh5 from "@/assets/lang-tre-phu-vinh-5.jpg";
import langtrePhuVinh6 from "@/assets/lang-tre-phu-vinh-6.jpg";

import langnonchuong from "@/assets/lang-non-chuong.webp";
import langnonchuong1 from "@/assets/lang-non-chuong-1.jpg";
import langnonchuong2 from "@/assets/lang-non-chuong-2.jpg";
import langnonchuong3 from "@/assets/lang-non-chuong-3.jpg";
import langnonchuong4 from "@/assets/lang-non-chuong-4.jpg";
import langnonchuong5 from "@/assets/lang-non-chuong-5.jpg";
import langnonchuong6 from "@/assets/lang-non-chuong-6.jpg";

import thunglungbanxoi from "@/assets/thung-lung-ban-xoi.jpg";
import thunglungbanxoi1 from "@/assets/thung-lung-ban-xoi-1.jpg";
import thunglungbanxoi2 from "@/assets/thung-lung-ban-xoi-2.jpg";
import thunglungbanxoi3 from "@/assets/thung-lung-ban-xoi-3.jpg";
import thunglungbanxoi4 from "@/assets/thung-lung-ban-xoi-4.jpg";
import thunglungbanxoi5 from "@/assets/thung-lung-ban-xoi-5.jpg";
import thunglungbanxoi6 from "@/assets/thung-lung-ban-xoi-6.jpg";

import tourThachThat from "@/assets/tour-thach-that.jpg";
import tourThachThat1 from "@/assets/tour-thach-that-1.jpg";
import tourThachThat2 from "@/assets/tour-thach-that-2.jpg";
import tourThachThat3 from "@/assets/tour-thach-that-3.jpg";
import tourThachThat4 from "@/assets/tour-thach-that-4.jpg";
import tourThachThat5 from "@/assets/tour-thach-that-5.jpg";
import tourThachThat6 from "@/assets/tour-thach-that-6.jpg";

export interface Tour {
  id: string;
  image: string;
  images?: string[]; // Optional array of images for gallery
  title: string; // Keep for backward compatibility
  titleKey?: string; // Key for i18n translation
  rating: number;
  reviews: number;
  price: number;
  type: string | string[]; // Can be single type or array of types/tags
  departure: string;
  destination: string;
  transportation: string;
  description: string;
  // New fields for journey details
  detailedDescription?: string; // Mô tả chi tiết về tour
  introduction?: string; // Giới thiệu
  itinerary?: string; // Lịch trình
  regulations?: string; // Quy định
  additionalInfo?: string; // Thông tin bổ sung hiển thị ở Tour Details
}

interface TourContextType {
  tours: Tour[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currency: "USD" | "VND";
  setCurrency: (currency: "USD" | "VND") => void;
  language: "EN" | "VI";
  setLanguage: (language: "EN" | "VI") => void;
  filters: {
    tourType: string;
    departure: string;
    destination: string;
    transportation: string;
  };
  setFilters: (filters: any) => void;
  filteredTours: Tour[];
}

const TourContext = createContext<TourContextType | undefined>(undefined);

const allTours: Tour[] = [
  {
    id: "1",
    image: vanMieu,
    images: [
      vanMieu1,
      vanMieu2,
      vanMieu3,
      vanMieu4,
      vanMieu5,
      vanMieu6,
    ],
    title: "Trải nghiệm Văn Miếu - Quốc Tử Giám",
    titleKey: "tour_title_1",
    rating: 4.8,
    reviews: 342,
    price: 19,
    type: [
      "Tour chill cuối tuần",
      "Tour gia đình",
      "Tour trường học",
      "Tour chill thu Hà Nội",
    ],
    departure: "hanoi",
    destination: "vietnam",
    transportation: "bus",
    description: `
• Biểu tượng của tinh thần hiếu học, tôn sư trọng đạo của dân tộc Việt.
• Kiến trúc cổ kính, vườn cây xanh mát, bia tiến sĩ và không gian học đường xưa.
• Gợi nhắc thời kỳ vàng son của nền giáo dục Nho học Việt Nam.
• Điểm đến lý tưởng cho những ai yêu thích văn hóa, lịch sử, nghệ thuật thư pháp.
• Không gian rộng rãi, yên bình, thích hợp tham quan, học tập, trải nghiệm văn hóa.
`,
    additionalInfo: `
• Khám phá kiến trúc và bia tiến sĩ: Đi dạo giữa các dãy nhà cổ và bia tiến sĩ, nghe câu chuyện về những bậc hiền tài và truyền thống hiếu học Việt Nam.
• Trải nghiệm viết thư pháp: Thử viết chữ trên giấy đỏ cùng ông đồ, nhận chữ may mắn để treo hoặc làm kỷ niệm.
• Hoạt cảnh “Sĩ tử ngày xưa”: Hóa thân thành học trò phong kiến, tham gia mini quiz Nho học, trải nghiệm đời sống học tập xưa.
• Góc ảnh kỷ niệm “Nét học xưa”: Chụp ảnh cùng áo dài, sách bút và không gian cổ kính, lưu giữ kỷ niệm chuyến tham quan.
`,
  },
  {
    id: "2",
    image: langluaVanPhuc,
    images: [
      langluaVanPhuc1,
      langluaVanPhuc2,
      langluaVanPhuc3,
      langluaVanPhuc4,
      langluaVanPhuc5,
      langluaVanPhuc6,
    ],
    title: "Trải nghiệm làng lụa Vạn Phúc",
    titleKey: "tour_title_2",
    rating: 4.9,
    reviews: 267,
    price: 25,
    type: [
      "Tour chill cuối tuần",
      "Tour gia đình",
      "Tour trường học",
      "Tour đông lạnh",
    ],
    departure: "hanoi",
    destination: "vietnam",
    transportation: "motorbike",
    description: `
• Nằm tại phường Vạn Phúc, quận Hà Đông, Hà Nội, cách trung tâm Hà Nội khoảng ~10 km.
• Làng nghề lụa tơ tằm có lịch sử hơn 1.000 năm, từng tên là “Vạn Bảo” rồi đổi thành “Vạn Phúc”.
• Gợi nhắc thời kỳ vàng son của nền giáo dục Nho học Việt Nam.
• Sản phẩm lụa Vạn Phúc từng được giới thiệu quốc tế (Marseille 1931, Paris…) và được đánh giá là dòng lụa tinh xảo nhất Đông Dương.
`,
    additionalInfo: `
• Tham quan xưởng hoặc gia đình truyền thống đang duy trì nghề dệt: quan sát các công đoạn kéo tơ, dệt, nhuộm vải.
• Dạo quanh “chợ lụa Vạn Phúc”: lựa chọn vải lụa tơ tằm, lụa gấm, túi lụa, bộ đồ làm từ lụa – đa dạng mẫu mã.
• Khám phá kiến trúc làng nghề: cổng làng, con đường ô treo màu sắc, bức tường bích họa, đình làng – pha trộn giữa truyền thống và điểm “check-in”. 
`,
  },
  {
    id: "3",
    image: langtrePhuVinh,
    images: [
      langtrePhuVinh1,
      langtrePhuVinh2,
      langtrePhuVinh3,
      langtrePhuVinh4,
      langtrePhuVinh5,
      langtrePhuVinh6,
    ],
    title: "Trải nghiệm làng nghề mây tre đan Phú Vinh",
    titleKey: "tour_title_3",
    rating: 4.7,
    reviews: 521,
    price: 22,
    type: [
      "Tour gia đình",
      "Tour trường học",
      "Tour ngày hè",
    ],
    departure: "hanoi",
    destination: "vietnam",
    transportation: "motorbike",
    description: `
• Nằm tại thôn Phú Vinh, xã Phú Nghĩa, huyện Chương Mỹ, Hà Nội, cách trung tâm Hà Nội khoảng ~27-30 km về phía Tây Nam.
• Làng nghề có xuất phát từ khoảng năm 1700, tên ban đầu là “Phú Hoa Trang” (ý nghĩa “trời phú cho dân có bàn tay lụa”) – nghề mây tre đan truyền thống đã tồn tại gần 400 năm.
• Gợi nhắc thời kỳ vàng son của nền giáo dục Nho học Việt Nam.
• Làng được gọi là “xứ mây” của Thủ đô.
`,
    additionalInfo: `
• Tham quan khu trưng bày sản phẩm mây tre đan: thắt/chẻ mây – thiết kế – hoàn thiện.
• Xem quy trình sản xuất: chọn cây mây/tre, xử lý, đan kết sản phẩm.
• Giao lưu với nghệ nhân: nghe họ kể lịch sử làng nghề, cách làm, bí quyết truyền thống.
• Tham quan khung cảnh làng quê: mái nhà, lũy tre, làng nghề và môi trường xung quanh.
`,
  },
  {
    id: "4",
    image: langnonchuong,
    images: [
      langnonchuong1,
      langnonchuong2,
      langnonchuong3,
      langnonchuong4,
      langnonchuong5,
      langnonchuong6,
    ],
    title: "Trải nghiệm làng nón Chuông",
    titleKey: "tour_title_4",
    rating: 4.6,
    reviews: 198,
    price: 20,
    type: [
      "Tour gia đình",
      "Tour trường học",
      "Tour chill thu Hà Nội",
    ],
    departure: "hanoi",
    destination: "vietnam",
    transportation: "bus",
    description: `
• Làng Chuông là một làng nghề truyền thống nổi tiếng với nghề làm nón lá lâu đời – nằm cách trung tâm Hà Nội khoảng 30–40 km, tại xã Phương Trung, huyện Thanh Oai. 
• Nón lá làng Chuông nổi bật bởi 5 đặc tính: chắc, khỏe, bền, thanh, đẹp. 
• Mỗi chiếc nón phải trải qua khoảng 10 công đoạn thủ công như: vò lá, phơi nắng, phơi sương, là lá, rẽ lá, bứt vòng, quay mo, khâu nón, lồng nhồi, nứt cạp. 
• Làng cổ vẫn giữ được khung cảnh bình dị: sân phơi lá, sân phơi nón trắng, những gia đình nghề truyền thống… 
• Làng được gọi là “xứ mây” của Thủ đô.
• Làng nghề không chỉ là sản xuất – mà còn là điểm du lịch văn hóa, trải nghiệm cho khách tham quan.
`,
    additionalInfo: `
• Tham quan xưởng làm nón: Du khách được dẫn vào trực tiếp xưởng hoặc sân phơi, quan sát các nghệ nhân làm từng công đoạn từ chọn lá đến khâu nón – từ đó hiểu rõ hơn về nghề cổ truyền.
• Tự tay làm chiếc nón: Bạn sẽ thử cắt lá, lợp khung, khâu quai để tạo ra một chiếc nón nhỏ – lưu giữ làm kỷ niệm hoặc làm quà.
• Mua sắm và chụp ảnh: Dạo quanh phiên chợ nón (họp vào các ngày 4, 10, 14, 20, 24, 30 âm lịch) – nơi bày bán nón truyền thống và nguyên liệu làm nón
• Giao lưu với nghệ nhân, nghe họ kể chuyện nghề và đời sống làng nghề: Từ lịch sử nghề làm nón đến việc gìn giữ nghề truyền thống trong thời hiện đại.
• Thưởng thức không gian làng quê: Đi bộ quanh làng, ngắm cảnh sân phơi nón trắng, mái ngói cổ, những con đường nhỏ – cảm nhận nhịp sống chậm và giản dị.
`,
  },
  {
    id: "5",
    image: thunglungbanxoi,
    images: [
      thunglungbanxoi1,
      thunglungbanxoi2,
      thunglungbanxoi3,
      thunglungbanxoi4,
      thunglungbanxoi5,
      thunglungbanxoi6,
    ],
    title: "Trải nghiệm Thung lung Bản xôi",
    titleKey: "tour_title_5",
    rating: 4.9,
    reviews: 156,
    price: 25,
    type: [
      "Tour gia đình",
      "Tour trường học",
      "Tour chill thu Hà Nội",
      "Tour chill cuối tuần",
    ],
    departure: "hanoi",
    destination: "vietnam",
    transportation: "motorbike",
    description: `
• Nằm giữa vùng núi Ba Vì, sở hữu không gian xanh mát, hồ nước phẳng lặng và cảnh quan tự nhiên thơ mộng. 
• Có khu cắm trại, nhà sàn, bãi cỏ rộng, thích hợp cho hoạt động team building, sinh hoạt tập thể.
• Mang đậm nét văn hóa dân tộc Mường và Thái với kiến trúc nhà sàn, ẩm thực truyền thống và rượu cần đặc trưng.
• Dịch vụ du lịch phong phú: chèo thuyền kayak, tiệc BBQ, lửa trại, nghỉ dưỡng giữa thiên nhiên.
• Cách trung tâm Hà Nội chỉ khoảng 50 km, thuận tiện cho tour 1 ngày hoặc tour cuối tuần.
`,
    additionalInfo: `
• Tham quan nhà sàn, tìm hiểu văn hóa người Mường: Du khách được nghe kể về đời sống, phong tục và trải nghiệm không gian sinh hoạt đặc trưng của đồng bào nơi đây.
• Trải nghiệm nấu cơm lam, làm đồ thủ công, chơi trò dân gian: Cùng người dân địa phương nướng cơm lam, đan lát, tham gia kéo co, ném còn, nhảy bao bố... đầy vui nhộn.
• Tổ chức team building và đốt lửa trại: Tham gia các trò chơi đồng đội sôi động, cùng nhau hát múa, múa sạp và thưởng thức tiệc BBQ giữa thiên nhiên.
• Chèo thuyền kayak, check-in bên hồ Bản Xôi: Du khách có thể chèo thuyền thư giãn trên mặt hồ phẳng lặng, chụp ảnh lưu niệm giữa khung cảnh núi non hùng vĩ.
• Dạo bộ, ngắm hoàng hôn và nghỉ dưỡng giữa thiên nhiên: Tản bộ quanh hồ, tận hưởng không khí trong lành và khung cảnh thơ mộng khi chiều buông.
`,
  },
  {
    id: "6",
    image: langgomBatTrang,
    images: [
      langgomBatTrang1,
      langgomBatTrang2,
      langgomBatTrang3,
      langgomBatTrang4,
      langgomBatTrang5,
      langgomBatTrang6,
    ],
    title: "Trải nghiệm làng gốm Bát Tràng",
    titleKey: "tour_title_6",
    rating: 4.5,
    reviews: 423,
    price: 15,
    type: [
      "Tour gia đình",
      "Tour trường học",
      "Tour chill cuối tuần",
    ],
    departure: "hanoi",
    destination: "vietnam",
    transportation: "bus",
    description: `
• Làng gốm hơn 500 năm tuổi, nổi tiếng với tinh hoa nghề gốm Việt.
• Không gian yên bình, cổ kính ven sông Hồng, hài hòa giữa truyền thống và sáng tạo.
• Sản phẩm gốm thủ công tinh xảo, từ bình, lọ đến đồ trang trí.
• Văn hóa nghề gốm lâu đời, phản ánh nghệ thuật và tâm hồn người thợ.
Điểm đến lý tưởng cho trải nghiệm tự tay làm gốm, tìm hiểu nghề truyền thống và mua sắm quà lưu niệm.
`,
    additionalInfo: `
• Tham quan xưởng gốm thủ công: Đi thăm xưởng, quan sát nghệ nhân tạo hình, nung và vẽ men, tìm hiểu từng công đoạn tinh xảo.
• Workshop “Nặn gốm – gửi hồn vào đất”:Tự tay nặn, trang trí sản phẩm gốm và mang về kỷ niệm riêng của mình.
• Khám phá chợ gốm cổ: Dạo quanh chợ, tìm hiểu câu chuyện và ý nghĩa từng họa tiết truyền thống.
• Check-in “Con đường gốm sứ”: Chụp ảnh với những bức tường gốm đầy màu sắc ven sông Hồng, lưu giữ trải nghiệm nghệ thuật.
`,
  },
  {
    id: "7",
    image: tourThachThat,
    images: [
      tourThachThat1,
      tourThachThat2,
      tourThachThat3,
      tourThachThat4,
      tourThachThat5,
      tourThachThat6,
    ],
    title: "Hơi thở Xứ Đoài",
    titleKey: "tour_title_7",
    rating: 5.0,
    reviews: 678,
    price: 10.8,
    type: [
      "Tour gia đình",
      "Tour trường học",
      "Tour chill cuối tuần",
    ],
    departure: "hanoi",
    destination: "vietnam",
    transportation: "motorbike",
    description: `
Cách trung tâm Hà Nội chỉ hơn 30km, Thạch Thất là vùng đất lưu giữ tinh hoa văn hoá lâu đời. Nơi đây nổi tiếng với những làng nghề truyền thống như làng quạt Chàng Sơn, làng mộc Canh Nậu, cùng những di tích tâm linh cổ kính như chùa Tây Phương – “đệ nhất cổ tự” của miền Bắc.

Tour “Hơi Thở Làng Nghề – Một Ngày Ở Thạch Thất” đưa bạn nhỏ và gia đình đến gần hơn với giá trị truyền thống qua hoạt động trải nghiệm làm quạt, khám phá nghệ thuật điêu khắc gỗ, thưởng thức ẩm thực địa phương, và chiêm bái chùa cổ trong không gian thanh tịnh.
`,
    additionalInfo: `
<h3>🕒 Thời gian: 07h30 – 16h30</h3>
<ul>
  <li><b>07h30:</b> Xe và hướng dẫn viên JOIGO đón đoàn tại điểm hẹn ở Hà Nội, khởi hành đi Thạch Thất – vùng đất Xứ Đoài giàu truyền thống.</li>
  <li><b>08h45:</b> Tham quan <b>chùa Tây Phương</b> – ngôi chùa gỗ cổ nổi tiếng với 18 pho tượng La Hán độc đáo, chiêm ngưỡng kiến trúc nghệ thuật tinh xảo và lắng nghe những truyền thuyết dân gian vùng Xứ Đoài.</li>
  <li><b>10h00:</b> Di chuyển đến <b>làng quạt Chàng Sơn</b>, nơi lưu giữ nghề thủ công truyền thống hơn 200 năm tuổi.</li>
  <li><b>10h30:</b> Gặp gỡ nghệ nhân địa phương, tham quan xưởng sản xuất và tìm hiểu quy trình làm quạt thủ công tinh tế.</li>
  <li><b>11h30:</b> Thưởng thức <b>bữa trưa món quê dân dã</b>, đậm hương vị vùng đồng bằng Bắc Bộ.</li>
  <li><b>13h30:</b> Tham gia hoạt động trải nghiệm: <b>workshop làm và trang trí quạt</b>, trò chơi dân gian, mini game gắn kết tập thể.</li>
  <li><b>15h30:</b> Tự do chụp ảnh lưu niệm cùng bạn bè và nghệ nhân trong khung cảnh làng nghề truyền thống.</li>
  <li><b>16h00:</b> Lên xe trở về Hà Nội.</li>
  <li><b>17h15:</b> Đoàn về đến điểm hẹn ban đầu, <b>kết thúc hành trình</b>, hẹn gặp lại trong những chuyến trải nghiệm tiếp theo!</li>
</ul>

<hr />

<h3>🎟 Quy định đặt tour</h3>

<h4>1. Quy định dành cho trẻ em và em bé</h4>
<p>👶 <b>Em bé (dưới 5 tuổi):</b></p>
<ul>
  <li>Miễn phí dịch vụ, bố mẹ tự lo các chi phí phát sinh và không chiếm chỗ trên xe.</li>
  <li>Hai người lớn chỉ được kèm tối đa 01 trẻ miễn phí; từ trẻ thứ 2 tính <b>50% giá tour</b> (bao gồm nửa suất ăn và chỗ ngồi riêng trên xe).</li>
  <li>Nếu <b>01 người lớn đi kèm 01 trẻ dưới 5 tuổi</b>, trẻ cần mua <b>50% giá tour người lớn</b> để đảm bảo tiêu chuẩn phục vụ.</li>
</ul>

<p>🧒 <b>Trẻ em (5 – 10 tuổi):</b></p>
<ul>
  <li>Từ <b>5 đến dưới 10 tuổi</b>: tính <b>75% giá tour người lớn</b>, bao gồm suất ăn riêng và chỗ ngồi riêng.</li>
  <li>Từ <b>10 tuổi trở lên</b>: tính như người lớn.</li>
</ul>

<h4>2. Quy định huỷ hoặc đổi tour</h4>
<ul>
  <li>Sau khi hoàn tất đặt dịch vụ, <b>khách hàng không được hoàn, huỷ hoặc đổi dịch vụ</b>.</li>
  <li>Trong trường hợp bất khả kháng (thiên tai, dịch bệnh, thay đổi lịch trình do điều kiện khách quan), JOIGO sẽ linh hoạt hỗ trợ sắp xếp tour khác tương đương.</li>
</ul>

<hr />

<h3>🌿 Thông tin bổ sung</h3>
<ul>
  <li><b>Địa điểm nổi bật:</b> Chùa Tây Phương – "Đệ nhất cổ tự" miền Bắc, làng nghề quạt Chàng Sơn, làng mộc Canh Nậu.</li>
  <li><b>Trải nghiệm đặc sắc:</b> Workshop làm quạt giấy thủ công, nghe nghệ nhân kể chuyện nghề, trò chơi dân gian, và ẩm thực làng quê.</li>
  <li><b>Phù hợp cho:</b> Học sinh, gia đình, nhóm bạn yêu văn hoá truyền thống.</li>
  <li><b>Gợi ý trang phục:</b> Trang phục thoải mái, giày thể thao, mũ nón hoặc ô chống nắng.</li>
  <li><b>Quà lưu niệm:</b> Quạt handmade do chính tay bạn làm – món quà mang đậm dấu ấn Xứ Đoài.</li>
</ul>
`,
  },
];

export const TourProvider = ({ children }: { children: ReactNode }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currency, setCurrency] = useState<"USD" | "VND">("USD");
  const [language, setLanguage] = useState<"EN" | "VI">("EN");
  const [filters, setFilters] = useState({
    tourType: "all",
    departure: "all",
    destination: "all",
    transportation: "all",
  });

  const filteredTours = allTours.filter((tour) => {
    const matchesSearch =
      searchQuery === "" ||
      tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.destination.toLowerCase().includes(searchQuery.toLowerCase());

    // Handle both string and array types
    const matchesType =
      filters.tourType === "all" ||
      (Array.isArray(tour.type)
        ? tour.type.includes(filters.tourType)
        : tour.type === filters.tourType);
    
    const matchesDeparture =
      filters.departure === "all" || tour.departure === filters.departure;
    const matchesDestination =
      filters.destination === "all" || tour.destination === filters.destination;
    const matchesTransportation =
      filters.transportation === "all" ||
      tour.transportation === filters.transportation;

    return (
      matchesSearch &&
      matchesType &&
      matchesDeparture &&
      matchesDestination &&
      matchesTransportation
    );
  });

  return (
    <TourContext.Provider
      value={{
        tours: allTours,
        searchQuery,
        setSearchQuery,
        currency,
        setCurrency,
        language,
        setLanguage,
        filters,
        setFilters,
        filteredTours,
      }}
    >
      {children}
    </TourContext.Provider>
  );
};

export const useTours = () => {
  const context = useContext(TourContext);
  if (context === undefined) {
    throw new Error("useTours must be used within a TourProvider");
  }
  return context;
};
