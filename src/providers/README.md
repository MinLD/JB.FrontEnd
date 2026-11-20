# providers

Đây là folder chứa state và tiện ích cần dùng chung giữa nhiều trang, được gắn vào layout chung của ứng dụng.

Hiện có thông tin tài khoản qua useAuth, quản lý ngôn ngữ qua useI18n và thông báo toast. Các component có thể sử dụng chung những dữ liệu này mà không phải truyền qua nhiều tầng props.

I18nProvider nhận locale và một từ điển từ server. URL quyết định ngôn ngữ; cookie/localStorage chỉ nhớ lựa chọn và đồng bộ tab. Dùng `t` để dịch, `href` để tạo đường dẫn và `setLocale` để chuyển ngôn ngữ, kể cả khi storage bị chặn. Xem [i18n](../i18n/README.md).

AuthProvider tải user một lần khi khởi tạo; các lần gọi đồng thời dùng chung request. Chuyển trang dùng lại state, không polling `/me`. Sau đăng nhập hoặc khi chủ động tải lại tài khoản mới gọi lại; làm mới token không tải lại user.
