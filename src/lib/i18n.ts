type Language = "EN" | "VI";

type Dictionary = Record<string, { EN: string; VI: string }>;

const dictionary: Dictionary = {
  // Navbar
  nav_login: { EN: "Log In", VI: "Đăng nhập" },
  nav_signup: { EN: "Sign Up", VI: "Đăng ký" },
  // Auth
  auth_sign_up: { EN: "Sign Up", VI: "Đăng ký" },
  auth_sign_in: { EN: "Sign In", VI: "Đăng nhập" },
  auth_sign_up_with_google: {
    EN: "Sign up with Google",
    VI: "Đăng ký với Google",
  },
  auth_sign_in_with_google: {
    EN: "Sign in with Google",
    VI: "Đăng nhập với Google",
  },
  auth_full_name: { EN: "Full Name", VI: "Họ và tên" },
  auth_email: { EN: "Email", VI: "Email" },
  auth_password: { EN: "Password", VI: "Mật khẩu" },
  auth_create_account: { EN: "Create Account", VI: "Tạo tài khoản" },
  auth_processing: { EN: "Processing...", VI: "Đang xử lý..." },
  auth_already_have_account: {
    EN: "Already have an account?",
    VI: "Đã có tài khoản?",
  },
  auth_no_account: { EN: "Don't have an account?", VI: "Chưa có tài khoản?" },
  auth_forgot_password: { EN: "Forgot password?", VI: "Quên mật khẩu?" },
  auth_signup_error: {
    EN: "Sign up failed. Please try again.",
    VI: "Đăng ký thất bại. Vui lòng thử lại.",
  },
  auth_login_error: {
    EN: "Login failed. Please try again.",
    VI: "Đăng nhập thất bại. Vui lòng thử lại.",
  },
  auth_google_signup_error: {
    EN: "Google sign up failed. Please try again.",
    VI: "Đăng ký Google thất bại. Vui lòng thử lại.",
  },
  auth_google_login_error: {
    EN: "Google login failed. Please try again.",
    VI: "Đăng nhập Google thất bại. Vui lòng thử lại.",
  },
  // Profile
  profile_user_info: { EN: "User Information", VI: "Thông tin người dùng" },
  profile_not_logged_in: {
    EN: "You are not logged in",
    VI: "Bạn chưa đăng nhập",
  },
  profile_full_name: { EN: "Full Name:", VI: "Họ và tên:" },
  profile_email: { EN: "Email:", VI: "Email:" },
  profile_gender: { EN: "Gender:", VI: "Giới tính:" },
  profile_birthdate: { EN: "Birthdate:", VI: "Ngày sinh:" },
  profile_city: { EN: "City of Residence:", VI: "Thành phố:" },
  profile_mobile: { EN: "Mobile Number:", VI: "Số điện thoại:" },
  profile_add_mobile: {
    EN: "+ Add Mobile Number",
    VI: "+ Thêm số điện thoại",
  },
  profile_edit: { EN: "Edit Profile", VI: "Chỉnh sửa hồ sơ" },
  profile_save: { EN: "Save Changes", VI: "Lưu thay đổi" },
  profile_cancel: { EN: "Cancel", VI: "Hủy" },
  profile_select_gender: {
    EN: "Select gender",
    VI: "Chọn giới tính",
  },
  profile_male: { EN: "Male", VI: "Nam" },
  profile_female: { EN: "Female", VI: "Nữ" },
  profile_other: { EN: "Other", VI: "Khác" },
  profile_select_birthdate: {
    EN: "Select birthdate",
    VI: "Chọn ngày sinh",
  },
  profile_select_city: {
    EN: "Select city",
    VI: "Chọn thành phố",
  },
  profile_update_success: {
    EN: "Profile updated successfully",
    VI: "Cập nhật hồ sơ thành công",
  },
  profile_update_error: {
    EN: "Failed to update profile",
    VI: "Cập nhật hồ sơ thất bại",
  },
  nav_popular_searches: { EN: "Popular Searches", VI: "Tìm kiếm phổ biến" },
  nav_search_placeholder: {
    EN: "Search destinations, tours...",
    VI: "Tìm điểm đến, tour...",
  },
  nav_search_mobile_placeholder: {
    EN: "Search destinations...",
    VI: "Tìm điểm đến...",
  },

  // Hero Slider
  hero_slide_0_title: {
    EN: "Van Mieu - Temple of Literature",
    VI: "Văn Miếu - Quốc Tử Giám",
  },
  hero_slide_0_subtitle: {
    EN: "Discover the ancient temples and history of Vietnam",
    VI: "Khám phá các ngôi chùa cổ và lịch sử Việt Nam",
  },
  hero_slide_1_title: {
    EN: "Van Phuc Silk Village",
    VI: "Làng lụa Vạn Phúc",
  },
  hero_slide_1_subtitle: {
    EN: "Explore the famous ancient traditional craft villages",
    VI: "Khám phá làng nghề truyền thống lâu đời nổi tiếng",
  },
  hero_slide_2_title: {
    EN: "Phu Vinh Bamboo Weaving Village",
    VI: "Làng mây tre đan Phú Vinh",
  },
  hero_slide_2_subtitle: {
    EN: "Explore the history and culture of Vietnam",
    VI: "Khám phá lịch sử và văn hóa Việt Nam",
  },
  hero_slide_3_title: {
    EN: "Bamboo Dragonfly",
    VI: "Chuồn Chuồn Tre",
  },
  hero_slide_3_subtitle: {
    EN: "Create beautiful bamboo dragonfly and traditional crafts",
    VI: "Tạo ra chuồn chuồn tre đẹp mắt và đồ thủ công truyền thống",
  },
  hero_slide_4_title: {
    EN: "Experience Games",
    VI: "Trò chơi trải nghiệm",
  },
  hero_slide_4_subtitle: {
    EN: "Fun activities and interactive games for all ages",
    VI: "Hoạt động vui chơi và trò chơi tương tác cho mọi lứa tuổi",
  },

  // Index page
  idx_where_to_go: { EN: "Where do you want to go?", VI: "Bạn muốn đi đâu?" },
  idx_search: { EN: "Search", VI: "Tìm kiếm" },
  idx_featured_tours: { EN: "Joigo's highlights", VI: "Tour nổi bật của Joigo" },
  idx_featured_sub: {
    EN: "Handpicked experiences for your next adventure",
    VI: "Những trải nghiệm được tuyển chọn cho chuyến đi kế tiếp",
  },
  idx_view_all: { EN: "View All Tours", VI: "Xem tất cả tour" },
  idx_landmarks: { EN: "Famous Landmarks", VI: "Địa danh nổi tiếng" },
  idx_landmarks_sub: {
    EN: "Discover iconic destinations across Hanoi city",
    VI: "Khám phá các điểm đến biểu tượng khắp thành phố Hà Nội",
  },
  idx_landmark_ho_chi_minh: {
    EN: "Ho Chi Minh Mausoleum, Vietnam",
    VI: "Lăng Chủ tịch Hồ Chí Minh, Việt Nam",
  },
  idx_landmark_nha_hat_lon: {
    EN: "Nha Hat Lon, Vietnam",
    VI: "Nhà hát Lớn, Việt Nam",
  },
  idx_landmark_lang_non_chuong: {
    EN: "Chuong Conical Hat Village, Vietnam",
    VI: "Làng Nón Chuông, Việt Nam",
  },
  idx_landmark_thung_lung_ban_xoi: {
    EN: "Ban Xoi Valley, Vietnam",
    VI: "Thung Lũng Bản Xôi, Việt Nam",
  },
  idx_landmark_tour_thach_that: {
    EN: "Thach That Tour, Vietnam",
    VI: "Tour Thạch Thất, Việt Nam",
  },

  // AllTours page
  all_home: { EN: "Home", VI: "Trang chủ" },
  all_all_tours: { EN: "All Tours", VI: "Tất cả tour" },
  all_filter_tours: { EN: "Filter Tours", VI: "Lọc tour" },
  all_tour_type: { EN: "Tour Type", VI: "Loại tour" },
  all_departure: { EN: "Departure Point", VI: "Điểm khởi hành" },
  all_destination: { EN: "Destination", VI: "Điểm đến" },
  all_transportation: { EN: "Transportation", VI: "Phương tiện" },
  all_all_types: { EN: "All types", VI: "Tất cả" },
  all_all_cities: { EN: "All cities", VI: "Tất cả thành phố" },
  all_any_destination: { EN: "Any destination", VI: "Bất kỳ điểm đến" },
  all_tours_for: { EN: "Tours for", VI: "Tour cho" },
  all_found_singular: { EN: "tour found", VI: "tour" },
  all_found_plural: { EN: "tours found", VI: "tour" },
  all_no_tours: {
    EN: "No tours found matching your criteria",
    VI: "Không tìm thấy tour phù hợp",
  },
  all_try_adjust: {
    EN: "Try adjusting your filters or search query",
    VI: "Hãy thử thay đổi bộ lọc hoặc từ khóa",
  },

  // Footer
  ft_about_joigo: { EN: "About Joigo", VI: "Về Joigo" },
  ft_about_us: { EN: "About us", VI: "Về chúng tôi" },
  ft_sustainable_tourism: {
    EN: "Sustainable tourism",
    VI: "Du lịch bền vững",
  },
  ft_voucher_joigo: { EN: "Voucher Joigo", VI: "Voucher Joigo" },
  ft_help_center: { EN: "Help Center", VI: "Trung tâm trợ giúp" },
  ft_how_to_book: { EN: "How to Book", VI: "Cách đặt tour" },
  ft_partners: { EN: "Partners", VI: "Đối tác" },
  ft_register_supplier: {
    EN: "Register as Supplier",
    VI: "Đăng ký nhà cung cấp",
  },
  ft_technology_partner: {
    EN: "Technology Partners",
    VI: "Đối tác công nghệ",
  },
  ft_affiliate_partner: {
    EN: "Affiliate Partners",
    VI: "Đối tác liên kết",
  },
  ft_agent_program: {
    EN: "Agent Program",
    VI: "Chương trình cho đại lý",
  },
  ft_partner_with_joigo: {
    EN: "Partner with Joigo",
    VI: "Hợp tác với Joigo",
  },
  ft_contact_us: { EN: "Contact Us", VI: "Liên hệ" },
  ft_find_us: { EN: "Find Us", VI: "Tìm chúng tôi" },
  ft_we_accept: { EN: "We accept:", VI: "Chấp nhận:" },
  ft_follow_us: { EN: "Follow us:", VI: "Theo dõi chúng tôi:" },
  ft_copyright: { EN: "All rights reserved.", VI: "Bảo lưu mọi quyền." },
  ft_company_desc: {
    EN: "Your gateway to unforgettable adventures across Vietnam. Discover the beauty, culture, and wonders of Vietnam with expert-guided tours.",
    VI: "Cánh cửa dẫn đến những cuộc phiêu lưu khó quên khắp Việt Nam. Khám phá vẻ đẹp, văn hóa và kỳ quan của Việt Nam với các tour có hướng dẫn viên chuyên nghiệp.",
  },

  // Special Offers
  idx_special_offers: { EN: "Special Offers", VI: "Ưu đãi đặc biệt" },
  idx_offers_desc: {
    EN: "Promotions, deals and special offers for you",
    VI: "Khuyến mãi, ưu đãi và các chương trình đặc biệt dành cho bạn",
  },
  idx_select_date: { EN: "Select date", VI: "Chọn ngày đi" },
  idx_view_offer: { EN: "View Offer", VI: "Xem ưu đãi" },
  idx_offer_early_bird: {
    EN: "Early Bird Special",
    VI: "Ưu đãi đặt sớm",
  },
  idx_offer_early_bird_desc: {
    EN: "Book 30 days in advance and save up to 25% on selected tours",
    VI: "Đặt trước 30 ngày và tiết kiệm đến 25% cho các tour được chọn",
  },
  idx_offer_weekend: { EN: "Weekend Getaway", VI: "Du lịch cuối tuần" },
  idx_offer_weekend_desc: {
    EN: "Perfect weekend tours with special discounts for groups",
    VI: "Tour cuối tuần hoàn hảo với ưu đãi đặc biệt cho nhóm",
  },
  idx_offer_cultural: {
    EN: "Cultural Heritage",
    VI: "Di sản văn hóa",
  },
  idx_offer_cultural_desc: {
    EN: "Explore ancient temples and historical sites with exclusive offers",
    VI: "Khám phá các ngôi chùa cổ và di tích lịch sử với ưu đãi độc quyền",
  },
  idx_tour_available: {
    EN: "tour available",
    VI: "tour có sẵn",
  },
  idx_tours_available: {
    EN: "tours available",
    VI: "tour có sẵn",
  },
  idx_with_offer: {
    EN: "with this offer",
    VI: "với ưu đãi này",
  },

  // Tour Detail
  td_tour_not_found: { EN: "Tour not found", VI: "Không tìm thấy tour" },
  td_tour_not_found_desc: {
    EN: "The tour you're looking for doesn't exist or has been removed.",
    VI: "Tour bạn đang tìm không tồn tại hoặc đã bị xóa.",
  },
  td_go_back: { EN: "Go Back", VI: "Quay lại" },
  td_home: { EN: "Home", VI: "Trang chủ" },
  td_tours: { EN: "Tours", VI: "Tour" },
  td_reviews: { EN: "reviews", VI: "đánh giá" },
  td_about_tour: { EN: "About this tour", VI: "Về tour này" },
  td_tour_details: { EN: "Tour Details", VI: "Chi tiết tour" },
  td_destination: { EN: "Destination", VI: "Điểm đến" },
  td_departure: { EN: "Departure", VI: "Điểm khởi hành" },
  td_tour_type: { EN: "Tour Type", VI: "Loại tour" },
  td_transportation: { EN: "Transportation", VI: "Phương tiện" },
  td_per_person: { EN: "/ person", VI: "/ người" },
  td_price_includes: {
    EN: "Price includes all taxes and fees",
    VI: "Giá đã bao gồm tất cả thuế và phí",
  },
  td_book_now: { EN: "Book Now", VI: "Đặt ngay" },
  td_add_wishlist: {
    EN: "Add to Wishlist",
    VI: "Thêm vào yêu thích",
  },
  td_whats_included: {
    EN: "What's included",
    VI: "Bao gồm những gì",
  },
  td_guide: {
    EN: "Professional tour guide",
    VI: "Hướng dẫn viên chuyên nghiệp",
  },
  td_transport: { EN: "Transportation and transfers", VI: "Phương tiện đưa đón, di chuyển" },
  td_tickets: { EN: "Entrance tickets to attractions as per the itinerary", VI: "Vé tham quan các địa điểm theo chương trình" },
  td_insurance: { EN: "Travel insurance", VI: "Bảo hiểm du lịch" },
  td_meals: { EN: "Lunch according to itinerary", VI: "Bữa ăn (trưa) theo chương trình" },
  td_support: { EN: "24/7 support", VI: "Hỗ trợ 24/7" },
  td_see_all_photos: {
    EN: "See all photos",
    VI: "Xem tất cả ảnh",
  },
  td_all_photos: { EN: "All Photos", VI: "Tất cả ảnh" },
  td_photo_of: { EN: "photo", VI: "ảnh" },
  td_photos_of: { EN: "photos", VI: "ảnh" },
  // Tour Titles
  tour_title_1: {
    EN: "Van Mieu - Quoc Tu Giam experience",
    VI: "Trải nghiệm Văn Miếu - Quốc Tử Giám",
  },
  tour_title_2: {
    EN: "Van Phuc Silk Village experience",
    VI: "Trải nghiệm làng lụa Vạn Phúc",
  },
  tour_title_3: {
    EN: "Phu Vinh Bamboo and Rattan Craft Village experience",
    VI: "Trải nghiệm làng mây tre đan Phú Vinh",
  },
  tour_title_4: {
    EN: "Chuong Conical Hat Village experience",
    VI: "Trải nghiệm nón lá làng Chuông",
  },
  tour_title_5: {
    EN: "Ban Xoi Valley experience",
    VI: "Trải nghiệm thung lũng bản Xôi",
  },
  tour_title_6: {
    EN: "Bat Trang Pottery Village experience",
    VI: "Trải nghiệm làng gốm sứ Bát Tràng",
  },
  tour_title_7: {
    EN: "Thach That Discovery",
    VI: "Hơi thở Xứ Đoài",
  },

  // Index page additional
  idx_travel_blog: {
    EN: "Câu chuyện của Joigo",
    VI: "Joigo's story",
  },
  idx_blog_desc: {
    EN: "Blog stories, guides, and feedback",
    VI: "Blog câu chuyện, cẩm nang và đánh giá",
  },
  idx_view_all_blog: { EN: "View All", VI: "Xem tất cả" },

  // Blog pages
  blog_not_found: {
    EN: "Blog post not found or has been moved.",
    VI: "Bài viết không tồn tại hoặc đã được di chuyển.",
  },
  blog_back_to_list: {
    EN: "← Back to list",
    VI: "← Quay về danh sách",
  },

  // Blog content translations
  blog_Cam_nang_Ha_Noi_title: {
    EN: "Hanoi Travel Guide",
    VI: "Cẩm nang du lịch Hà Nội",
  },
  blog_Cam_nang_Ha_Noi_excerpt: {
    EN: "A complete Hanoi travel guide from A to Z with useful information about cuisine, attractions, accommodation, and transportation.",
    VI: "Cẩm nang du lịch Hà Nội từ A đến Z với những thông tin hữu ích về ẩm thực, địa điểm tham quan, lưu trú và di chuyển.",
  },
  blog_thach_that_title: {
    EN: "Thach That and its attractions",
    VI: "Thạch Thất và những điểm hẹn",
  },
  blog_thach_that_excerpt: {
    EN: "Thach That – a charming district in the west of Hanoi, offers a serene blend of nature, traditional craft villages, and timeless cultural heritage. Exploring Thach That takes you through peaceful destinations such as the ancient Tay Phuong Pagoda, the majestic Thay Mountain, and the famous craft villages of Chang Son and Thach Xa.",
    VI: "Thạch Thất – vùng đất phía Tây Hà Nội mang trong mình vẻ đẹp mộc mạc của làng quê xứ Đoài, nơi hội tụ giữa thiên nhiên, làng nghề truyền thống và di sản văn hóa lâu đời. Hành trình khám phá Thạch Thất đưa bạn đến những điểm hẹn bình yên, từ chùa Tây Phương cổ kính, núi Thầy hùng vĩ đến các làng nghề nổi tiếng như Chàng Sơn, Thạch Xá.",
  },
  blog_lang_nghe_truyen_thong_title: {
    EN: "Top 10 Traditional Craft Villages in Vietnam",
    VI: "Top 10 Làng nghề truyền thống Việt Nam",
  },
  blog_lang_nghe_truyen_thong_excerpt: {
    EN: "Discover the top 10 traditional craft villages in Northern Vietnam, preserving long-standing cultural values and the excellence of Vietnamese handicrafts. From Bat Trang pottery village, Van Phuc silk village to Phu Vinh bamboo-weaving village, each craft village tells its own story, deeply connected to local life and history.",
    VI: "Khám phá 10 làng nghề truyền thống nổi bật nhất khu vực Bắc Bộ, nơi lưu giữ những giá trị văn hóa lâu đời và tinh hoa thủ công Việt Nam. Từ làng gốm Bát Tràng, làng lụa Vạn Phúc đến làng mây tre đan Phú Vinh, mỗi làng nghề đều mang một câu chuyện riêng, gắn liền với đời sống và lịch sử địa phương.",
  },
  idx_why_joigo: {
    EN: "Why choose Joigo?",
    VI: "Tại sao chọn Joigo?",
  },
  idx_why_joigo_desc: {
    EN: "Let JOIGO GO with you on every journey",
    VI: "Hãy để JOIGO cùng bạn GO trên mọi hành trình",
  },
  idx_trust: {
    EN: "Trust & Transparency",
    VI: "Uy tín & minh bạch",
  },
  idx_trust_desc: {
    EN: "Service quality commitment, clear information, no hidden costs.",
    VI: "Cam kết chất lượng dịch vụ, thông tin rõ ràng, không chi phí ẩn.",
  },
  idx_experience: {
    EN: "Curated Experiences",
    VI: "Trải nghiệm chọn lọc",
  },
  idx_experience_desc: {
    EN: "Streamlined itineraries, unique destinations, optimized travel time.",
    VI: "Lịch trình tinh gọn, điểm đến đặc sắc, tối ưu thời gian di chuyển.",
  },
  idx_support_247: { EN: "24/7 Support", VI: "Hỗ trợ 24/7" },
  idx_support_247_desc: {
    EN: "Accompanying before, during and after the trip through multiple communication channels.",
    VI: "Đồng hành trước – trong – sau chuyến đi qua nhiều kênh liên lạc.",
  },
  idx_local: {
    EN: "Local Hanoi Knowledge",
    VI: "Hiểu Hà Nội bản địa",
  },
  idx_local_desc: {
    EN: "Food, culture and history suggestions from a Hanoi local's perspective.",
    VI: "Gợi ý ẩm thực – văn hóa – lịch sử từ góc nhìn của người Hà Nội.",
  },

  // Contact Form
  contact_more_to_explore: {
    EN: "Book Your Tour Now",
    VI: "Đặt tour ngay",
  },
  contact_desc: {
    EN: "Leave your contact information and we'll help you plan your perfect adventure",
    VI: "Để lại thông tin liên hệ và chúng tôi sẽ giúp bạn lập kế hoạch cho chuyến phiêu lưu hoàn hảo",
  },
  contact_name: { EN: "Name", VI: "Tên" },
  contact_name_placeholder: { EN: "Your name", VI: "Tên của bạn" },
  contact_email: { EN: "Email", VI: "Email" },
  contact_phone: { EN: "Phone", VI: "Số điện thoại" },
  contact_message: { EN: "Message", VI: "Tin nhắn" },
  contact_email_placeholder: {
    EN: "your.email@example.com",
    VI: "email.cua.ban@example.com",
  },
  contact_phone_placeholder: {
    EN: "+84 123 456 789",
    VI: "+84 123 456 789",
  },
  contact_message_placeholder: {
    EN: "Tell us about your travel plans...",
    VI: "Hãy cho chúng tôi biết về kế hoạch du lịch của bạn...",
  },
  contact_submit: {
    EN: "Request Consultation",
    VI: "Yêu cầu tư vấn",
  },
  contact_success: {
    EN: "Thank you! We'll contact you soon.",
    VI: "Cảm ơn bạn! Chúng tôi sẽ liên hệ với bạn sớm.",
  },
  contact_scan_qr: {
    EN: "Scan QR code to get consultation",
    VI: "Quét mã QR để nhận tư vấn",
  },

  // Photo Frame
  photo_frame_banner_title: {
    EN: "Create Beautiful Framed Photos",
    VI: "Tạo Ảnh Có Khung Đẹp",
  },
  photo_frame_banner_desc: {
    EN: "Upload your photos and choose from many beautiful frames. Create unique photos for your travel memories!",
    VI: "Tải ảnh lên và chọn từ nhiều khung ảnh đẹp mắt. Tạo những bức ảnh độc đáo cho kỷ niệm du lịch của bạn!",
  },
  photo_frame_banner_cta: {
    EN: "Explore Now",
    VI: "Khám Phá Ngay",
  },
  photo_frame_title: {
    EN: "Create Framed Photos",
    VI: "Tạo Ảnh Có Khung",
  },
  photo_frame_subtitle: {
    EN: "Upload your photo and choose a beautiful frame",
    VI: "Tải ảnh lên và chọn khung đẹp cho ảnh của bạn",
  },
  photo_frame_upload: {
    EN: "Upload Photo",
    VI: "Tải ảnh lên",
  },
  photo_frame_upload_click: {
    EN: "Click to upload image",
    VI: "Click để tải ảnh lên",
  },
  photo_frame_select_frame: {
    EN: "Select Frame",
    VI: "Chọn khung ảnh",
  },
  photo_frame_apply: {
    EN: "Apply Frame",
    VI: "Áp dụng khung",
  },
  photo_frame_download: {
    EN: "Download",
    VI: "Tải xuống",
  },
  photo_frame_preview: {
    EN: "Preview",
    VI: "Xem trước",
  },
  photo_frame_preview_placeholder: {
    EN: "Framed photo will appear here",
    VI: "Ảnh có khung sẽ hiển thị ở đây",
  },
  photo_frame_success: {
    EN: "Frame applied successfully!",
    VI: "Đã áp dụng khung thành công!",
  },
  photo_frame_download_success: {
    EN: "Photo downloaded successfully!",
    VI: "Đã tải ảnh xuống thành công!",
  },
  photo_frame_download_error: {
    EN: "Please select a photo and frame first!",
    VI: "Vui lòng chọn ảnh và khung trước!",
  },
  photo_frame_frame_classic: {
    EN: "Classic Frame",
    VI: "Khung Cổ Điển",
  },
  photo_frame_frame_modern: {
    EN: "Modern Frame",
    VI: "Khung Hiện Đại",
  },
  photo_frame_frame_elegant: {
    EN: "Elegant Frame",
    VI: "Khung Thanh Lịch",
  },
  photo_frame_frame_minimal: {
    EN: "Minimal Frame",
    VI: "Khung Tối Giản",
  },
  photo_frame_frame_vintage: {
    EN: "Vintage Frame",
    VI: "Khung Cổ Kính",
  },
  photo_frame_frame_bold: {
    EN: "Bold Frame",
    VI: "Khung Nổi Bật",
  },
};

export function t(
  language: Language,
  key: keyof typeof dictionary,
  params?: Record<string, string | number>
) {
  const entry = dictionary[key];
  let text = entry ? entry[language] : key;
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(new RegExp(`{${k}}`, "g"), String(v));
    });
  }
  return text;
}

export type { Language };
