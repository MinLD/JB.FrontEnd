import type { Locale } from "@/i18n/types.ts";

export const LANDING_NAV = [
  { id: "gioi-thieu", label: "Giới thiệu" },
  { id: "cach-hoat-dong", label: "Cách hoạt động" },
  { id: "faq", label: "FAQ" },
] as const;

export interface FaqItem {
  question: string;
  answer: string;
}

export const LANDING_FAQ: readonly FaqItem[] = [
  { question: "JobBod ghép cặp người dùng như thế nào?", answer: "Bob đối chiếu mục tiêu, kỹ năng và lịch rảnh để gợi ý những người có thể bổ trợ cho nhau. Bạn xem lý do phù hợp và tự quyết định kết nối." },
  { question: "JobBod hoạt động như thế nào?", answer: "Bạn chia sẻ mong muốn với Bob, tạo hồ sơ và xem gợi ý đồng đội. Khi tìm được người phù hợp, cả nhóm thống nhất cách trao đổi và bắt đầu dự án." },
  { question: "Tôi sẽ biết gì về người được ghép trước khi gặp gỡ?", answer: "Bạn có thể xem các thông tin hồ sơ được chia sẻ, như kỹ năng, mục tiêu và vai trò mong muốn. Hãy trao đổi thêm để hiểu nhau trước khi hẹn gặp." },
  { question: "Nếu tôi không thích người ghép cặp đó thì sao?", answer: "Bạn có thể bỏ qua đề xuất và tiếp tục tìm người khác. Chia sẻ thêm với Bob về điều bạn mong muốn để điều chỉnh tiêu chí phù hợp hơn." },
  { question: "Ai sẽ tham gia?", answer: "JobBod hướng đến sinh viên muốn tìm đồng đội làm đồ án, tham gia hackathon, cuộc thi học thuật hoặc cùng xây dựng một dự án thực tế." },
  { question: "Nếu tôi không thể đến vào phút cuối thì sao?", answer: "Hãy báo sớm cho đồng đội và cùng thống nhất một lịch hẹn khác. Tôn trọng thời gian của nhau là bước đầu cho một nhóm làm việc tốt." },
  { question: "Thông thường mất bao lâu?", answer: "Bạn có thể bắt đầu bằng một cuộc trò chuyện ngắn với Bob. Thời gian tìm được đồng đội tùy vào nhu cầu, kỹ năng và lịch rảnh của những người tham gia." },
  { question: "Nếu tôi không nhận được phản hồi từ JobBod thì sao?", answer: "Hãy kiểm tra lại thông tin hồ sơ, thông báo và các tiêu chí bạn đã chọn. Bạn có thể bổ sung kỹ năng hoặc mở rộng lịch rảnh để có thêm cơ hội kết nối." },
  { question: "Các buổi gặp gỡ thường diễn ra ở đâu?", answer: "Các thành viên cùng chọn địa điểm thuận tiện, ưu tiên khuôn viên trường hoặc không gian công cộng. Bạn cũng có thể bắt đầu bằng một buổi trao đổi trực tuyến." },
  { question: "Bob giúp tôi làm gì?", answer: "Bob là trợ lý AI giúp bạn tạo hồ sơ từ cuộc trò chuyện, tìm đồng đội phù hợp và hỗ trợ sắp xếp kết nối theo quyền bạn cho phép." },
  { question: "Career DNA là gì?", answer: "Career DNA là hồ sơ năng lực tổng hợp kỹ năng, dự án đã tham gia, sản phẩm và đóng góp của bạn. Hồ sơ được bổ sung qua kết quả dự án và phản hồi từ đồng đội." },
  { question: "Bob có tự quyết định thay tôi không?", answer: "Bạn kiểm soát thông tin và quyền hoạt động của Bob. Bạn tự quyết định tham gia nhóm hoặc dự án; việc sắp xếp cuộc hẹn tuân theo quyền bạn đã chọn." },
] as const;

export const LANDING_FAQ_EN: readonly FaqItem[] = [
  { question: "How does JobBod match users?", answer: "Bob compares goals, skills, and free schedules to suggest people who complement each other. You review the match reasons and decide whether to connect." },
  { question: "How does JobBod work?", answer: "You share your aspirations with Bob, create a profile, and explore teammate recommendations. When you find the right people, the team agrees on how to collaborate and starts the project." },
  { question: "What will I know about a match before meeting?", answer: "You can see shared profile details such as skills, goals, and desired roles. Reach out to chat and get to know each other before meeting up." },
  { question: "What if I don't like a suggested match?", answer: "You can simply skip the recommendation and keep exploring. Tell Bob more about your preferences to refine future match criteria." },
  { question: "Who will participate?", answer: "JobBod is designed for students seeking teammates for course projects, hackathons, academic contests, or building real-world ventures together." },
  { question: "What if I can't make it at the last minute?", answer: "Notify your teammates promptly and reschedule. Respecting each other's time is the foundation of effective teamwork." },
  { question: "How long does it usually take?", answer: "You can get started with a brief chat with Bob. Finding teammates depends on your project needs, skill sets, and matching availability." },
  { question: "What if I don't hear back from JobBod?", answer: "Review your profile details, notifications, and selected preferences. Adding more skills or expanding your schedule can unlock more connections." },
  { question: "Where do meetups typically take place?", answer: "Team members choose convenient spots, prioritizing campus areas or public spaces. You can also start with an online video call." },
  { question: "What does Bob help me do?", answer: "Bob is an AI assistant that builds your profile from a conversation, finds suitable teammates, and helps arrange connections within your chosen permissions." },
  { question: "What is Career DNA?", answer: "Career DNA is a comprehensive portfolio showcasing your verified skills, projects, deliverables, and contributions, updated with project results and peer feedback." },
  { question: "Does Bob make decisions for me?", answer: "You remain in full control of your information and Bob's permissions. You decide which teams or projects to join; meetings are scheduled according to your preferences." },
] as const;

export function getLandingFaq(locale: Locale): readonly FaqItem[] {
  return locale === "en" ? LANDING_FAQ_EN : LANDING_FAQ;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  description: string;
  portrait: string;
}

export interface TeamGroup {
  id: string;
  number: string;
  title: string;
  description: string;
  members: TeamMember[];
}

export const TEAM_GROUPS: TeamGroup[] = [
  {
    id: "founders",
    number: "01",
    title: "Nhà sáng lập",
    description: "Định hướng sản phẩm, kinh doanh và công nghệ.",
    members: [
      {
        id: "le-thanh-hieu",
        name: "Le Thanh Hieu",
        role: "CEO & Founder",
        description: "Hơn 3 năm kinh nghiệm quản trị kinh doanh và phát triển dự án. Phụ trách mô hình kinh doanh, hệ sinh thái sản phẩm và chiến lược đưa sản phẩm ra thị trường.",
        portrait: "/jobbod/team/le-thanh-hieu.webp"
      },
      {
        id: "kieu-thi-kim-ngan",
        name: "Kieu Thi Kim Ngan",
        role: "CFO & Co-Founder",
        description: "Hơn 2 năm kinh nghiệm ngân hàng và FinTech. Từng quản lý dự án AI tại IFSS cho các ứng dụng ngân hàng và chứng khoán.",
        portrait: "/jobbod/team/kieu-thi-kim-ngan.webp"
      },
      {
        id: "bui-hoang-vuong",
        name: "Bui Hoang Vuong",
        role: "CTO & Co-Founder",
        description: "Kỹ sư AI, tập trung vào hệ thống đa tác tử. Hơn 2 năm kinh nghiệm thực tế trong phát triển phần mềm và các dự án AI.",
        portrait: "/jobbod/team/bui-hoang-vuong.webp"
      }
    ]
  },
  {
    id: "development",
    number: "02",
    title: "Đội ngũ phát triển",
    description: "Thiết kế trải nghiệm, xây dựng hệ thống và phát triển AI.",
    members: [
      {
        id: "nguyen-huu-tan",
        name: "Nguyen Huu Tan",
        role: "Head of Engineering",
        description: "Chuyên về Python và framework FastAPI. Xây dựng hệ thống hiệu năng cao cho vòng đời sản phẩm Jobbod.",
        portrait: "/jobbod/team/nguyen-huu-tan.webp"
      },
      {
        id: "do-dang-minh-quan",
        name: "Do Dang Minh Luan",
        role: "UI/UX Designer · Fullstack Developer",
        description: "Thiết kế sản phẩm từ đầu đến cuối, từ trải nghiệm và giao diện người dùng đến phát triển ứng dụng web và app.",
        portrait: "/jobbod/team/do-dang-minh-quan.webp"
      },
      {
        id: "nguyen-le-minh",
        name: "Nguyen Le Minh",
        role: "AI / Deep Learning",
        description: "Data Science tại USTH, chuyên về LLM, hệ thống đa tác tử và NLP với PyTorch và Hugging Face.",
        portrait: "/jobbod/team/nguyen-le-minh.webp"
      }
    ]
  },
  {
    id: "advisors",
    number: "03",
    title: "Cố vấn",
    description: "Định hướng khởi nghiệp và chuyên môn AI cho Jobbod.",
    members: [
      {
        id: "huynh-hong-mai",
        name: "Huynh Hong Mai",
        role: "Cố vấn khởi nghiệp · NIIC",
        description: "Phó Giám đốc NIIC (NTTU), đồng trưởng Làng Tư duy thiết kế Techfest. Cố vấn khởi nghiệp quốc gia, giảng viên được chứng nhận bởi IPP và WISE.",
        portrait: "/jobbod/team/huynh-hong-mai.webp"
      },
      {
        id: "linh-nguyen",
        name: "Linh Nguyen",
        role: "Cố vấn AI/ML · Google Developer Expert",
        description: "Head of AI tại Obello, hơn 13 năm kinh nghiệm AI/NLP tại IBM, Shopee và A*STAR. Thạc sĩ AI tại Đại học Quốc gia Singapore (NUS).",
        portrait: "/jobbod/team/linh-nguyen.webp"
      }
    ]
  }
];

export const TEAM_GROUPS_EN: TeamGroup[] = [
  {
    id: "founders",
    number: "01",
    title: "Founders",
    description: "Steering product, business, and technology strategy.",
    members: [
      {
        id: "le-thanh-hieu",
        name: "Le Thanh Hieu",
        role: "CEO & Founder",
        description: "Over 3 years of experience in business administration and project development. Oversees business model, product ecosystem, and go-to-market strategy.",
        portrait: "/jobbod/team/le-thanh-hieu.webp"
      },
      {
        id: "kieu-thi-kim-ngan",
        name: "Kieu Thi Kim Ngan",
        role: "CFO & Co-Founder",
        description: "Over 2 years of experience in banking and FinTech. Former AI project manager at IFSS for banking and securities applications.",
        portrait: "/jobbod/team/kieu-thi-kim-ngan.webp"
      },
      {
        id: "bui-hoang-vuong",
        name: "Bui Hoang Vuong",
        role: "CTO & Co-Founder",
        description: "AI Engineer focusing on multi-agent systems. Over 2 years of practical experience in software development and AI initiatives.",
        portrait: "/jobbod/team/bui-hoang-vuong.webp"
      }
    ]
  },
  {
    id: "development",
    number: "02",
    title: "Development Team",
    description: "Designing user experiences, engineering systems, and developing AI.",
    members: [
      {
        id: "nguyen-huu-tan",
        name: "Nguyen Huu Tan",
        role: "Head of Engineering",
        description: "Specializing in Python and FastAPI. Building high-performance systems across the Jobbod product lifecycle.",
        portrait: "/jobbod/team/nguyen-huu-tan.webp"
      },
      {
        id: "do-dang-minh-quan",
        name: "Do Dang Minh Luan",
        role: "UI/UX Designer · Fullstack Developer",
        description: "End-to-end product design, from user interface and experience to web and mobile app development.",
        portrait: "/jobbod/team/do-dang-minh-quan.webp"
      },
      {
        id: "nguyen-le-minh",
        name: "Nguyen Le Minh",
        role: "AI / Deep Learning",
        description: "Data Science at USTH, specializing in LLMs, multi-agent systems, and NLP using PyTorch and Hugging Face.",
        portrait: "/jobbod/team/nguyen-le-minh.webp"
      }
    ]
  },
  {
    id: "advisors",
    number: "03",
    title: "Advisors",
    description: "Guiding entrepreneurship direction and AI expertise for Jobbod.",
    members: [
      {
        id: "huynh-hong-mai",
        name: "Huynh Hong Mai",
        role: "Startup Advisor · NIIC",
        description: "Vice Director of NIIC (NTTU), co-head of Techfest Design Thinking Village. National startup mentor, certified by IPP and WISE.",
        portrait: "/jobbod/team/huynh-hong-mai.webp"
      },
      {
        id: "linh-nguyen",
        name: "Linh Nguyen",
        role: "AI/ML Advisor · Google Developer Expert",
        description: "Head of AI at Obello, over 13 years of AI/NLP experience at IBM, Shopee, and A*STAR. Master's in AI from National University of Singapore (NUS).",
        portrait: "/jobbod/team/linh-nguyen.webp"
      }
    ]
  }
];

export function getTeamGroups(locale: Locale): TeamGroup[] {
  return locale === "en" ? TEAM_GROUPS_EN : TEAM_GROUPS;
}
