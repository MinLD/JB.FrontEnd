export const LANDING_NAV = [
  { id: "gioi-thieu", label: "Giới thiệu" },
  { id: "cach-hoat-dong", label: "Cách hoạt động" },
  { id: "faq", label: "FAQ" },
] as const;

export const LANDING_FAQ = [
  { question: "Jobbod AI dành cho ai?", answer: "Jobbod AI dành cho sinh viên muốn tìm đồng đội, tham gia hackathon, làm đồ án hoặc triển khai dự án. Bạn cũng có thể ghi lại kỹ năng và đóng góp qua từng dự án." },
  { question: "Bob giúp tôi làm gì?", answer: "Bob là trợ lý AI giúp bạn tạo hồ sơ từ cuộc trò chuyện, tìm đồng đội phù hợp và hỗ trợ sắp xếp kết nối theo quyền bạn cho phép." },
  { question: "Bob tìm đồng đội dựa trên những thông tin nào?", answer: "Bob sử dụng mục tiêu dự án, kỹ năng, lịch rảnh và cách làm việc trong hồ sơ của bạn. Mỗi đề xuất có lý do phù hợp để bạn xem trước khi quyết định." },
  { question: "Sau khi kết nối, tôi có thể làm gì?", answer: "Bạn có thể trao đổi, tạo nhóm và triển khai dự án cùng đồng đội. Trong quá trình làm việc, bạn ghi lại sản phẩm và phần đóng góp của mình." },
  { question: "Career DNA là gì?", answer: "Career DNA là hồ sơ năng lực tổng hợp kỹ năng, dự án đã tham gia, sản phẩm và đóng góp của bạn. Hồ sơ được bổ sung qua kết quả dự án và phản hồi từ đồng đội." },
  { question: "Bob có tự quyết định thay tôi không?", answer: "Bạn kiểm soát thông tin và quyền hoạt động của Bob. Bạn tự quyết định tham gia nhóm hoặc dự án; việc sắp xếp cuộc hẹn tuân theo quyền bạn đã chọn." },
] as const;

// Team information and portraits supplied by the Jobbod project.
export const TEAM_GROUPS = [
  {
    "id": "advisors",
    "number": "01",
    "title": "Cố vấn",
    "description": "Định hướng khởi nghiệp và chuyên môn AI cho Jobbod.",
    "members": [
      {
        "id": "huynh-hong-mai",
        "name": "Huynh Hong Mai",
        "role": "Cố vấn khởi nghiệp · NIIC",
        "description": "Phó Giám đốc NIIC (NTTU), đồng trưởng Làng Tư duy thiết kế Techfest. Cố vấn khởi nghiệp quốc gia, giảng viên được chứng nhận bởi IPP và WISE.",
        "portrait": "/jobbod/team/huynh-hong-mai.webp"
      },
      {
        "id": "linh-nguyen",
        "name": "Linh Nguyen",
        "role": "Cố vấn AI/ML · Google Developer Expert",
        "description": "Head of AI tại Obello, hơn 13 năm kinh nghiệm AI/NLP tại IBM, Shopee và A*STAR. Thạc sĩ AI tại Đại học Quốc gia Singapore (NUS).",
        "portrait": "/jobbod/team/linh-nguyen.webp"
      }
    ]
  },
  {
    "id": "founders",
    "number": "02",
    "title": "Nhà sáng lập",
    "description": "Định hướng sản phẩm, kinh doanh và công nghệ.",
    "members": [
      {
        "id": "le-thanh-hieu",
        "name": "Le Thanh Hieu",
        "role": "CEO & Founder",
        "description": "Hơn 3 năm kinh nghiệm quản trị kinh doanh và phát triển dự án. Phụ trách mô hình kinh doanh, hệ sinh thái sản phẩm và chiến lược đưa sản phẩm ra thị trường.",
        "portrait": "/jobbod/team/le-thanh-hieu.webp"
      },
      {
        "id": "kieu-thi-kim-ngan",
        "name": "Kieu Thi Kim Ngan",
        "role": "CFO & Co-Founder",
        "description": "Hơn 2 năm kinh nghiệm ngân hàng và FinTech. Từng quản lý dự án AI tại IFSS cho các ứng dụng ngân hàng và chứng khoán.",
        "portrait": "/jobbod/team/kieu-thi-kim-ngan.webp"
      },
      {
        "id": "bui-hoang-vuong",
        "name": "Bui Hoang Vuong",
        "role": "CTO & Co-Founder",
        "description": "Kỹ sư AI, tập trung vào hệ thống đa tác tử. Hơn 2 năm kinh nghiệm thực tế trong phát triển phần mềm và các dự án AI.",
        "portrait": "/jobbod/team/bui-hoang-vuong.webp"
      }
    ]
  },
  {
    "id": "development",
    "number": "03",
    "title": "Đội ngũ phát triển",
    "description": "Thiết kế trải nghiệm, xây dựng hệ thống và phát triển AI.",
    "members": [
      {
        "id": "nguyen-huu-tan",
        "name": "Nguyen Huu Tan",
        "role": "Head of Engineering",
        "description": "Chuyên về Python và framework FastAPI. Xây dựng hệ thống hiệu năng cao cho vòng đời sản phẩm Jobbod.",
        "portrait": "/jobbod/team/nguyen-huu-tan.webp"
      },
      {
        "id": "do-dang-minh-quan",
        "name": "Do Dang Minh Luan",
        "role": "UI/UX Designer · Fullstack Developer",
        "description": "Thiết kế sản phẩm từ đầu đến cuối, từ trải nghiệm và giao diện người dùng đến phát triển ứng dụng web và app.",
        "portrait": "/jobbod/team/do-dang-minh-quan.webp"
      },
      {
        "id": "nguyen-le-minh",
        "name": "Nguyen Le Minh",
        "role": "AI / Deep Learning",
        "description": "Data Science tại USTH, chuyên về LLM, hệ thống đa tác tử và NLP với PyTorch và Hugging Face.",
        "portrait": "/jobbod/team/nguyen-le-minh.webp"
      }
    ]
  }
] as const;
