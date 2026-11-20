import type { Locale } from "../i18n/types.ts";

export const POLICIES = {
  terms: {
    title: "Điều khoản sử dụng",
    introduction: "Một vài nguyên tắc để cùng xây dựng cộng đồng tìm đồng đội văn minh, đáng tin cậy.",
    sections: [
      { title: "Cùng tham gia có trách nhiệm", text: "Cung cấp thông tin chính xác, giữ an toàn cho tài khoản và tôn trọng người khác. Không mạo danh, quấy rối, phát tán nội dung trái pháp luật hoặc sử dụng JobBod để gây hại." },
      { title: "Bạn quyết định kết nối", text: "Gợi ý của Bob giúp bạn tham khảo, không thay thế quyết định của bạn. Hãy trao đổi rõ về mục tiêu, lịch rảnh và trách nhiệm trước khi bắt đầu làm việc cùng nhau." },
      { title: "Nội dung và sản phẩm của bạn", text: "Bạn chịu trách nhiệm về nội dung mình chia sẻ. Hãy thống nhất với đồng đội về quyền sử dụng sản phẩm, phần đóng góp và việc công khai thông tin dự án." },
      { title: "Khi có thay đổi", text: "JobBod có thể cập nhật tính năng và các điều khoản này. Những thay đổi sẽ được phản ánh trên trang này để bạn xem lại khi cần." },
    ],
  },
  privacy: {
    title: "Chính sách quyền riêng tư",
    introduction: "Thông tin của bạn giúp việc kết nối có ý nghĩa. Đây là cách JobBod sử dụng những dữ liệu bạn cung cấp.",
    sections: [
      { title: "Thông tin bạn cung cấp", text: "Khi tạo tài khoản, bạn cung cấp họ tên, email và thông tin đăng nhập. Khi sử dụng các tính năng hồ sơ, bạn có thể bổ sung kỹ năng, mục tiêu, lịch rảnh và nội dung dự án." },
      { title: "Thông tin được dùng để làm gì?", text: "JobBod sử dụng thông tin để quản lý tài khoản, duy trì phiên đăng nhập và hỗ trợ những tính năng kết nối bạn sử dụng. Chỉ chia sẻ thông tin cá nhân với người khác khi bạn thấy phù hợp." },
      { title: "Bảo vệ tài khoản", text: "Phiên đăng nhập được quản lý bằng cookie HttpOnly. Bạn nên giữ bí mật mật khẩu, đăng xuất trên thiết bị dùng chung và tránh đưa thông tin nhạy cảm vào hồ sơ công khai." },
      { title: "Lựa chọn của bạn", text: "Bạn có thể xem lại thông tin mình đã cung cấp và điều chỉnh các thông tin hồ sơ khi tính năng tương ứng khả dụng. Với yêu cầu hỗ trợ về dữ liệu, hãy liên hệ đội ngũ JobBod qua kênh hỗ trợ bạn đang sử dụng." },
    ],
  },
  cookies: {
    title: "Chính sách Cookie",
    introduction: "JobBod sử dụng cookie để phiên đăng nhập hoạt động ổn định và thuận tiện hơn.",
    sections: [
      { title: "Cookie là gì?", text: "Cookie là những dữ liệu nhỏ được trình duyệt lưu khi bạn sử dụng một trang web. Chúng giúp hệ thống nhận biết phiên làm việc giữa các lần truy cập." },
      { title: "Cookie nào đang được sử dụng?", text: "JobBod dùng cookie xác thực để duy trì và làm mới phiên đăng nhập. Lựa chọn “Ghi nhớ tôi” quyết định việc giữ phiên giữa các lần mở trình duyệt. Các cookie phiên được đặt bởi server và không cho JavaScript đọc trực tiếp." },
      { title: "Lựa chọn ngôn ngữ", text: "Cookie jobbod_lang ghi nhớ ngôn ngữ của bạn trong một năm. Lựa chọn này cũng được lưu trong localStorage để đồng bộ giữa các tab. Các URL theo ngôn ngữ vẫn hoạt động khi bộ nhớ này bị chặn." },
      { title: "Bạn có thể quản lý thế nào?", text: "Bạn có thể đăng xuất hoặc xóa cookie trong cài đặt trình duyệt. Nếu chặn cookie xác thực, bạn có thể không đăng nhập được hoặc phải đăng nhập lại khi truy cập." },
    ],
  },
} as const;

export type PolicyKind = keyof typeof POLICIES;
export type PolicyDocument = {
  title: string;
  introduction: string;
  sections: readonly { title: string; text: string }[];
};

const POLICIES_EN: Record<PolicyKind, PolicyDocument> = {
  "terms": {
    "title": "Terms of service",
    "introduction": "A few principles for building a respectful, trustworthy community for finding teammates.",
    "sections": [
      {
        "title": "Participate responsibly",
        "text": "Provide accurate information, keep your account secure, and respect others. Do not impersonate, harass, distribute unlawful content, or use JobBod to harm others."
      },
      {
        "title": "You decide who to connect with",
        "text": "Bob’s recommendations are a reference, not a substitute for your decision. Discuss goals, availability, and responsibilities before working together."
      },
      {
        "title": "Your content and work",
        "text": "You are responsible for the content you share. Agree with your teammates on rights to use the work, individual contributions, and public disclosure of project information."
      },
      {
        "title": "When things change",
        "text": "JobBod may update its features and these terms. Changes will be reflected on this page for you to review."
      }
    ]
  },
  "privacy": {
    "title": "Privacy policy",
    "introduction": "Your information helps make connections meaningful. Here is how JobBod uses the data you provide.",
    "sections": [
      {
        "title": "Information you provide",
        "text": "When you create an account, you provide your name, email, and login information. When using profile features, you may add skills, goals, availability, and project content."
      },
      {
        "title": "How your information is used",
        "text": "JobBod uses information to manage your account, maintain your session, and support the connection features you use. Only share personal information with others when you feel comfortable."
      },
      {
        "title": "Protecting your account",
        "text": "Login sessions are managed with HttpOnly cookies. Keep your password private, log out on shared devices, and avoid including sensitive information in your public profile."
      },
      {
        "title": "Your choices",
        "text": "You can review the information you have provided and update your profile when the corresponding features are available. For requests about your data, contact the JobBod team through the support channel you use."
      }
    ]
  },
  "cookies": {
    "title": "Cookie policy",
    "introduction": "JobBod uses cookies to keep login sessions stable and convenient.",
    "sections": [
      {
        "title": "What are cookies?",
        "text": "Cookies are small pieces of data stored by your browser when you use a website. They help the system recognize your session between visits."
      },
      {
        "title": "Which cookies are used?",
        "text": "JobBod uses authentication cookies to maintain and refresh login sessions. “Remember me” determines whether your session persists between browser sessions. Session cookies are set by the server and cannot be read directly by JavaScript."
      },
      {
        "title": "Language preferences",
        "text": "The jobbod_lang cookie remembers your language for one year. This preference is also stored in localStorage to synchronize language changes across tabs. Language-specific URLs work even when this storage is blocked."
      },
      {
        "title": "How you can manage cookies",
        "text": "You can log out or delete cookies in your browser settings. If you block authentication cookies, you may be unable to log in or may need to sign in again when visiting."
      }
    ]
  }
};

export function getPolicy(kind: PolicyKind, locale: Locale): PolicyDocument {
  return locale === "en" ? POLICIES_EN[kind] : POLICIES[kind];
}
