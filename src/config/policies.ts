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
      { title: "Bạn có thể quản lý thế nào?", text: "Bạn có thể đăng xuất hoặc xóa cookie trong cài đặt trình duyệt. Nếu chặn cookie xác thực, bạn có thể không đăng nhập được hoặc phải đăng nhập lại khi truy cập." },
    ],
  },
} as const;

export type PolicyKind = keyof typeof POLICIES;
