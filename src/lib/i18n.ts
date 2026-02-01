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
  all_customer_reviews: {
    EN: "Customer Reviews",
    VI: "Đánh giá của khách hàng",
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
    EN: "Your gateway to unforgettable adventures across Hanoi, Vietnam. Discover the beauty and culture of Hanoi with expert-guided tours.",
    VI: "Cánh cửa dẫn đến những cuộc phiêu lưu khó quên khắp Hà Nội, Việt Nam. Khám phá vẻ đẹp và văn hóa của Hà Nội với các tour có hướng dẫn viên chuyên nghiệp.",
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
  idx_with_this_offer: {
    EN: "with this offer",
    VI: "với ưu đãi này",
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
  contact_error: {
    EN: "Failed to submit. Please try again.",
    VI: "Gửi yêu cầu thất bại. Vui lòng thử lại.",
  },
  contact_submitting: {
    EN: "Submitting...",
    VI: "Đang gửi...",
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
  photo_frame_frame_ornamental: {
    EN: "Ornamental Frame",
    VI: "Khung Trang Trí",
  },
  photo_frame_frame_floral: {
    EN: "Floral Frame",
    VI: "Khung Hoa",
  },
  photo_frame_demo: {
    EN: "Demo Frame",
    VI: "Khung Demo",
  },
  photo_frame_happy_new_year_1: {
    EN: "Happy New Year 1",
    VI: "Chúc Mừng Năm Mới 1",
  },
  photo_frame_banh_keo_1: {
    EN: "Candy Frame",
    VI: "Khung Bánh Kẹo",
  },
  photo_frame_happy_new_year_2: {
    EN: "Happy New Year 2",
    VI: "Chúc Mừng Năm Mới 2",
  },

  // About Us Page
  about_hero_title: {
    EN: "About Joigo",
    VI: "Về Joigo",
  },
  about_hero_subtitle: {
    EN: "A team of 5 students dedicated to bringing traditional Vietnamese culture to middle and high school students through immersive cultural heritage tours.",
    VI: "Nhóm 5 sinh viên tâm huyết mang văn hóa truyền thống Việt Nam đến với học sinh cấp 2, cấp 3 thông qua các tour di sản văn hóa trải nghiệm.",
  },
  about_story_title: {
    EN: "Our Story",
    VI: "Câu Chuyện Của Chúng Tôi",
  },
  about_story_p1: {
    EN: "Joigo was born from the passion of 5 university students who share a common vision: to preserve and promote Vietnam's rich cultural heritage, especially for the younger generation. We believe that understanding and experiencing traditional culture is essential for students in middle and high school, as it helps them connect with their roots and develop a deeper appreciation for their homeland.",
    VI: "Joigo được sinh ra từ niềm đam mê của 5 sinh viên đại học cùng chung một tầm nhìn: bảo tồn và phát huy di sản văn hóa phong phú của Việt Nam, đặc biệt là cho thế hệ trẻ. Chúng tôi tin rằng việc hiểu và trải nghiệm văn hóa truyền thống là điều cần thiết cho học sinh cấp 2, cấp 3, giúp các em kết nối với cội nguồn và phát triển sự trân trọng sâu sắc hơn đối với quê hương.",
  },
  about_story_p2: {
    EN: "Our journey began when we noticed that many students in Hanoi had limited opportunities to explore and understand the traditional craft villages, historical sites, and cultural landmarks that surround them. We saw a gap between the rich cultural heritage of Vietnam and the educational experiences available to students. This inspired us to create Joigo - a platform that bridges this gap through carefully designed cultural tours.",
    VI: "Hành trình của chúng tôi bắt đầu khi chúng tôi nhận thấy nhiều học sinh tại Hà Nội có ít cơ hội khám phá và hiểu về các làng nghề truyền thống, di tích lịch sử và địa danh văn hóa xung quanh. Chúng tôi thấy có khoảng cách giữa di sản văn hóa phong phú của Việt Nam và trải nghiệm giáo dục dành cho học sinh. Điều này đã truyền cảm hứng cho chúng tôi tạo ra Joigo - một nền tảng kết nối khoảng cách này thông qua các tour văn hóa được thiết kế cẩn thận.",
  },
  about_story_p3: {
    EN: "Today, Joigo offers a diverse range of cultural heritage tours across Hanoi, including visits to traditional craft villages like Van Phuc Silk Village, Bat Trang Pottery Village, and Chuong Conical Hat Village. We also organize educational tours to historical sites such as the Temple of Literature (Van Mieu - Quoc Tu Giam) and cultural experiences like making traditional toys (To He), green rice (Com), and participating in folk games. Each tour is designed to be both educational and engaging, allowing students to learn through hands-on experiences while preserving Vietnam's cultural traditions.",
    VI: "Ngày nay, Joigo cung cấp nhiều tour di sản văn hóa đa dạng khắp Hà Nội, bao gồm tham quan các làng nghề truyền thống như Làng Lụa Vạn Phúc, Làng Gốm Bát Tràng, và Làng Nón Chuông. Chúng tôi cũng tổ chức các tour giáo dục đến các di tích lịch sử như Văn Miếu - Quốc Tử Giám và các trải nghiệm văn hóa như làm đồ chơi truyền thống (Tò He), cốm, và tham gia các trò chơi dân gian. Mỗi tour được thiết kế vừa giáo dục vừa hấp dẫn, cho phép học sinh học hỏi thông qua trải nghiệm thực tế trong khi bảo tồn truyền thống văn hóa Việt Nam.",
  },
  about_mission_title: {
    EN: "Our Mission & Vision",
    VI: "Sứ Mệnh & Tầm Nhìn",
  },
  about_mission_subtitle: {
    EN: "We are committed to making cultural education accessible and engaging for students",
    VI: "Chúng tôi cam kết làm cho giáo dục văn hóa trở nên dễ tiếp cận và hấp dẫn cho học sinh",
  },
  about_mission_card_title: {
    EN: "Our Mission",
    VI: "Sứ Mệnh",
  },
  about_mission_card_content: {
    EN: "To connect middle and high school students with Vietnam's rich cultural heritage through immersive, hands-on experiences. We aim to preserve traditional crafts, historical knowledge, and cultural values by making them accessible and engaging for the younger generation.",
    VI: "Kết nối học sinh cấp 2, cấp 3 với di sản văn hóa phong phú của Việt Nam thông qua các trải nghiệm thực tế, tương tác. Chúng tôi hướng đến việc bảo tồn nghề thủ công truyền thống, kiến thức lịch sử và giá trị văn hóa bằng cách làm cho chúng dễ tiếp cận và hấp dẫn cho thế hệ trẻ.",
  },
  about_vision_card_title: {
    EN: "Our Vision",
    VI: "Tầm Nhìn",
  },
  about_vision_card_content: {
    EN: "To become the leading platform for cultural education tours in Vietnam, inspiring thousands of students to appreciate and preserve their cultural heritage. We envision a future where every student has the opportunity to experience and understand the beauty of Vietnamese traditions.",
    VI: "Trở thành nền tảng hàng đầu về tour giáo dục văn hóa tại Việt Nam, truyền cảm hứng cho hàng nghìn học sinh trân trọng và bảo tồn di sản văn hóa của mình. Chúng tôi hình dung một tương lai nơi mọi học sinh đều có cơ hội trải nghiệm và hiểu về vẻ đẹp của truyền thống Việt Nam.",
  },
  about_offer_title: {
    EN: "What We Offer",
    VI: "Những Gì Chúng Tôi Cung Cấp",
  },
  about_offer_subtitle: {
    EN: "Comprehensive cultural experiences designed specifically for students",
    VI: "Trải nghiệm văn hóa toàn diện được thiết kế đặc biệt cho học sinh",
  },
  about_offer_1_title: {
    EN: "Traditional Craft Villages",
    VI: "Làng Nghề Truyền Thống",
  },
  about_offer_1_desc: {
    EN: "Hands-on experiences at traditional craft villages including silk weaving, pottery making, conical hat crafting, and bamboo weaving.",
    VI: "Trải nghiệm thực tế tại các làng nghề truyền thống bao gồm dệt lụa, làm gốm, làm nón lá và đan mây tre.",
  },
  about_offer_2_title: {
    EN: "Historical & Cultural Sites",
    VI: "Di Tích Lịch Sử & Văn Hóa",
  },
  about_offer_2_desc: {
    EN: "Educational tours to iconic landmarks like the Temple of Literature, ancient pagodas, and cultural heritage sites that tell the story of Vietnam's rich history.",
    VI: "Tour giáo dục đến các địa danh biểu tượng như Văn Miếu - Quốc Tử Giám, chùa cổ và các di sản văn hóa kể câu chuyện về lịch sử phong phú của Việt Nam.",
  },
  about_offer_3_title: {
    EN: "Interactive Workshops",
    VI: "Workshop Tương Tác",
  },
  about_offer_3_desc: {
    EN: "Engaging workshops where students can create traditional toys, make green rice, participate in folk games, and learn traditional crafts from master artisans.",
    VI: "Các workshop hấp dẫn nơi học sinh có thể tạo đồ chơi truyền thống, làm cốm, tham gia trò chơi dân gian và học nghề thủ công từ các nghệ nhân.",
  },
  about_tours_title: {
    EN: "Our Featured Tours",
    VI: "Tour Nổi Bật",
  },
  about_tours_subtitle: {
    EN: "Explore our most popular cultural heritage experiences",
    VI: "Khám phá các trải nghiệm di sản văn hóa phổ biến nhất của chúng tôi",
  },
  about_tour_1_title: {
    EN: "Temple of Literature",
    VI: "Văn Miếu - Quốc Tử Giám",
  },
  about_tour_1_desc: {
    EN: "Discover Vietnam's first university and explore the rich educational traditions of ancient Vietnam.",
    VI: "Khám phá trường đại học đầu tiên của Việt Nam và tìm hiểu truyền thống giáo dục phong phú của Việt Nam cổ đại.",
  },
  about_tour_2_title: {
    EN: "Van Phuc Silk Village",
    VI: "Làng Lụa Vạn Phúc",
  },
  about_tour_2_desc: {
    EN: "Experience the art of silk weaving and learn about this thousand-year-old traditional craft.",
    VI: "Trải nghiệm nghệ thuật dệt lụa và tìm hiểu về nghề thủ công truyền thống hàng nghìn năm tuổi này.",
  },
  about_tour_3_title: {
    EN: "Phu Vinh Bamboo Village",
    VI: "Làng Mây Tre Phú Vinh",
  },
  about_tour_3_desc: {
    EN: "Learn the intricate art of bamboo and rattan weaving from skilled artisans.",
    VI: "Học nghệ thuật đan mây tre tinh xảo từ các nghệ nhân lành nghề.",
  },
  about_tour_4_title: {
    EN: "Ban Xoi Waterfall",
    VI: "Thung Lũng Bản Xôi",
  },
  about_tour_4_desc: {
    EN: "Enjoy nature activities, folk games, and team building in a beautiful natural setting.",
    VI: "Tận hưởng hoạt động thiên nhiên, trò chơi dân gian và team building trong khung cảnh thiên nhiên tuyệt đẹp.",
  },
  about_cta_title: {
    EN: "Ready to Explore?",
    VI: "Sẵn Sàng Khám Phá?",
  },
  about_cta_subtitle: {
    EN: "Join us on a journey through Vietnam's rich cultural heritage. Book a tour today and create unforgettable memories!",
    VI: "Tham gia cùng chúng tôi trong hành trình khám phá di sản văn hóa phong phú của Việt Nam. Đặt tour ngay hôm nay và tạo những kỷ niệm khó quên!",
  },
  about_cta_button_tours: {
    EN: "View All Tours",
    VI: "Xem Tất Cả Tour",
  },
  about_cta_button_contact: {
    EN: "Contact Us",
    VI: "Liên Hệ",
  },

  // How to Book Page
  howto_hero_title: {
    EN: "How to Book a Tour",
    VI: "Cách Đặt Tour",
  },
  howto_hero_subtitle: {
    EN: "Follow our simple step-by-step guide to book your perfect cultural heritage tour",
    VI: "Làm theo hướng dẫn từng bước đơn giản của chúng tôi để đặt tour di sản văn hóa phù hợp với bạn",
  },
  howto_steps_title: {
    EN: "Booking Process",
    VI: "Quy Trình Đặt Tour",
  },
  howto_steps_subtitle: {
    EN: "5 simple steps to book your tour",
    VI: "5 bước đơn giản để đặt tour của bạn",
  },
  howto_step1_title: {
    EN: "Browse & Select Your Tour",
    VI: "Tìm Kiếm & Chọn Tour",
  },
  howto_step1_desc: {
    EN: "Explore our collection of cultural heritage tours and find the one that interests you most.",
    VI: "Khám phá bộ sưu tập tour di sản văn hóa của chúng tôi và tìm tour phù hợp nhất với bạn.",
  },
  howto_step1_details: {
    EN: "• Visit the 'All Tours' page to see all available tours\n• Use filters to narrow down by type, destination, or price\n• Read tour descriptions, view photos, and check reviews\n• Click on a tour to see detailed information",
    VI: "• Truy cập trang 'Tất Cả Tour' để xem tất cả các tour có sẵn\n• Sử dụng bộ lọc để thu hẹp theo loại, điểm đến hoặc giá\n• Đọc mô tả tour, xem ảnh và kiểm tra đánh giá\n• Nhấp vào tour để xem thông tin chi tiết",
  },
  howto_step2_title: {
    EN: "Check Tour Details",
    VI: "Kiểm Tra Chi Tiết Tour",
  },
  howto_step2_desc: {
    EN: "Review all the important information about your chosen tour before booking.",
    VI: "Xem xét tất cả thông tin quan trọng về tour bạn đã chọn trước khi đặt.",
  },
  howto_step2_details: {
    EN: "• Review the itinerary and included activities\n• Check the price and what's included\n• Read about the tour type (family, school, weekend)\n• Verify departure location and transportation method\n• Check available dates and duration",
    VI: "• Xem lại lịch trình và các hoạt động bao gồm\n• Kiểm tra giá và những gì được bao gồm\n• Đọc về loại tour (gia đình, trường học, cuối tuần)\n• Xác nhận điểm khởi hành và phương tiện di chuyển\n• Kiểm tra ngày có sẵn và thời lượng",
  },
  howto_step3_title: {
    EN: "Fill Out Booking Form",
    VI: "Điền Form Đặt Tour",
  },
  howto_step3_desc: {
    EN: "Provide your contact information and any special requests.",
    VI: "Cung cấp thông tin liên hệ và bất kỳ yêu cầu đặc biệt nào.",
  },
  howto_step3_details: {
    EN: "• Enter your full name (required)\n• Provide your email address (required)\n• Add your phone number for contact\n• Optionally include a message with special requests or questions\n• If you're logged in, your user information will be automatically filled",
    VI: "• Nhập họ và tên đầy đủ (bắt buộc)\n• Cung cấp địa chỉ email (bắt buộc)\n• Thêm số điện thoại để liên hệ\n• Tùy chọn thêm tin nhắn với yêu cầu đặc biệt hoặc câu hỏi\n• Nếu bạn đã đăng nhập, thông tin người dùng sẽ được điền tự động",
  },
  howto_step4_title: {
    EN: "Submit & Wait for Confirmation",
    VI: "Gửi & Chờ Xác Nhận",
  },
  howto_step4_desc: {
    EN: "Submit your booking request and our team will contact you to confirm.",
    VI: "Gửi yêu cầu đặt tour và đội ngũ của chúng tôi sẽ liên hệ với bạn để xác nhận.",
  },
  howto_step4_details: {
    EN: "• Click 'Submit' or 'Book Now' button\n• Your booking will be saved with status 'pending'\n• Our team will review your request within 24 hours\n• You will receive a confirmation email or phone call\n• Check your 'My Bookings' page to track your booking status",
    VI: "• Nhấp vào nút 'Gửi' hoặc 'Đặt Ngay'\n• Đặt tour của bạn sẽ được lưu với trạng thái 'đang chờ'\n• Đội ngũ của chúng tôi sẽ xem xét yêu cầu trong vòng 24 giờ\n• Bạn sẽ nhận được email hoặc cuộc gọi xác nhận\n• Kiểm tra trang 'Đặt Tour Của Tôi' để theo dõi trạng thái đặt tour",
  },
  howto_step5_title: {
    EN: "Confirm & Prepare for Your Tour",
    VI: "Xác Nhận & Chuẩn Bị Cho Tour",
  },
  howto_step5_desc: {
    EN: "Once confirmed, prepare for an amazing cultural experience!",
    VI: "Sau khi được xác nhận, hãy chuẩn bị cho một trải nghiệm văn hóa tuyệt vời!",
  },
  howto_step5_details: {
    EN: "• Receive final confirmation with tour details\n• Review meeting point and departure time\n• Prepare necessary items (camera, comfortable clothes, etc.)\n• Arrive on time at the designated meeting point\n• Enjoy your cultural heritage tour experience!",
    VI: "• Nhận xác nhận cuối cùng với chi tiết tour\n• Xem lại điểm hẹn và giờ khởi hành\n• Chuẩn bị các vật dụng cần thiết (máy ảnh, quần áo thoải mái, v.v.)\n• Đến đúng giờ tại điểm hẹn được chỉ định\n• Tận hưởng trải nghiệm tour di sản văn hóa của bạn!",
  },
  howto_methods_title: {
    EN: "Booking Methods",
    VI: "Phương Thức Đặt Tour",
  },
  howto_methods_subtitle: {
    EN: "Choose the booking method that works best for you",
    VI: "Chọn phương thức đặt tour phù hợp nhất với bạn",
  },
  howto_method1_title: {
    EN: "Online Booking Form",
    VI: "Form Đặt Tour Trực Tuyến",
  },
  howto_method1_desc: {
    EN: "The easiest and fastest way to book your tour. Fill out our online form and submit your request.",
    VI: "Cách đặt tour dễ dàng và nhanh chóng nhất. Điền form trực tuyến của chúng tôi và gửi yêu cầu.",
  },
  howto_method1_item1: {
    EN: "Available 24/7 on our website",
    VI: "Có sẵn 24/7 trên trang web của chúng tôi",
  },
  howto_method1_item2: {
    EN: "Instant submission and confirmation",
    VI: "Gửi và xác nhận ngay lập tức",
  },
  howto_method1_item3: {
    EN: "Track your booking status online",
    VI: "Theo dõi trạng thái đặt tour trực tuyến",
  },
  howto_method1_button: {
    EN: "Book Online Now",
    VI: "Đặt Tour Trực Tuyến",
  },
  howto_method2_title: {
    EN: "Contact Us Directly",
    VI: "Liên Hệ Trực Tiếp",
  },
  howto_method2_desc: {
    EN: "Prefer to speak with someone? Contact us via phone, email, or social media for personalized assistance.",
    VI: "Muốn nói chuyện trực tiếp? Liên hệ với chúng tôi qua điện thoại, email hoặc mạng xã hội để được hỗ trợ cá nhân hóa.",
  },
  howto_method2_item1: {
    EN: "Phone: +84 984 698 782",
    VI: "Điện thoại: +84 984 698 782",
  },
  howto_method2_item2: {
    EN: "Email: joigochamsockhachhang@gmail.com",
    VI: "Email: joigochamsockhachhang@gmail.com",
  },
  howto_method2_item3: {
    EN: "Chat via Zalo or Messenger",
    VI: "Chat qua Zalo hoặc Messenger",
  },
  howto_method2_button: {
    EN: "View Contact Info",
    VI: "Xem Thông Tin Liên Hệ",
  },
  howto_important_title: {
    EN: "Important Information",
    VI: "Thông Tin Quan Trọng",
  },
  howto_important_item1_title: {
    EN: "Booking Status",
    VI: "Trạng Thái Đặt Tour",
  },
  howto_important_item1_desc: {
    EN: "After submitting, your booking status will be 'pending'. Our team will review and confirm within 24 hours. You can check your booking status in the 'My Bookings' section.",
    VI: "Sau khi gửi, trạng thái đặt tour của bạn sẽ là 'đang chờ'. Đội ngũ của chúng tôi sẽ xem xét và xác nhận trong vòng 24 giờ. Bạn có thể kiểm tra trạng thái đặt tour trong phần 'Đặt Tour Của Tôi'.",
  },
  howto_important_item2_title: {
    EN: "Required Information",
    VI: "Thông Tin Bắt Buộc",
  },
  howto_important_item2_desc: {
    EN: "To complete your booking, you must provide: full name, email address, and phone number. If you're logged in, your user information will be automatically included.",
    VI: "Để hoàn tất đặt tour, bạn phải cung cấp: họ tên đầy đủ, địa chỉ email và số điện thoại. Nếu bạn đã đăng nhập, thông tin người dùng sẽ được tự động bao gồm.",
  },
  howto_important_item3_title: {
    EN: "Confirmation Process",
    VI: "Quy Trình Xác Nhận",
  },
  howto_important_item3_desc: {
    EN: "Once we receive your booking request, our team will contact you via email or phone to confirm the tour details, date, and finalize the booking. Please respond promptly to ensure your spot.",
    VI: "Sau khi chúng tôi nhận được yêu cầu đặt tour, đội ngũ của chúng tôi sẽ liên hệ với bạn qua email hoặc điện thoại để xác nhận chi tiết tour, ngày và hoàn tất đặt tour. Vui lòng phản hồi nhanh chóng để đảm bảo chỗ của bạn.",
  },
  howto_important_item4_title: {
    EN: "Cancellation & Changes",
    VI: "Hủy & Thay Đổi",
  },
  howto_important_item4_desc: {
    EN: "If you need to cancel or modify your booking, please contact us as soon as possible. Changes are subject to availability and our cancellation policy.",
    VI: "Nếu bạn cần hủy hoặc thay đổi đặt tour, vui lòng liên hệ với chúng tôi càng sớm càng tốt. Thay đổi phụ thuộc vào tình trạng có sẵn và chính sách hủy của chúng tôi.",
  },
  howto_cta_title: {
    EN: "Ready to Book Your Tour?",
    VI: "Sẵn Sàng Đặt Tour?",
  },
  howto_cta_subtitle: {
    EN: "Now that you know how to book, explore our tours and start your cultural heritage journey!",
    VI: "Bây giờ bạn đã biết cách đặt tour, hãy khám phá các tour của chúng tôi và bắt đầu hành trình di sản văn hóa của bạn!",
  },
  howto_cta_button_tours: {
    EN: "View All Tours",
    VI: "Xem Tất Cả Tour",
  },
  howto_cta_button_book: {
    EN: "Book a Tour Now",
    VI: "Đặt Tour Ngay",
  },

  // Chat page
  chat_back_to_home: {
    EN: "Return to homepage",
    VI: "Quay lại trang chủ",
  },
  chat_ai_powered_assistant: {
    EN: "AI-Powered Travel Assistant",
    VI: "Trợ Lý Du Lịch AI",
  },
  chat_title: {
    EN: "JOIGO Virtual Assistant",
    VI: "Trợ Lý Ảo JOIGO",
  },
  chat_subtitle: {
    EN: "Ask me anything about cultural tours in Hanoi. I will help you find the most suitable tour!",
    VI: "Hỏi tôi bất cứ điều gì về các tour du lịch văn hóa tại Hà Nội. Tôi sẽ giúp bạn tìm tour phù hợp nhất!",
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
