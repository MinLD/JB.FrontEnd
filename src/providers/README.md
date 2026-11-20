# providers

Đây là folder chứa state và tiện ích cần dùng chung giữa nhiều trang, được gắn vào layout chung của ứng dụng.

Hiện có thông tin tài khoản qua useAuth, quản lý ngôn ngữ qua useI18n và thông báo toast. Các component có thể sử dụng chung những dữ liệu này mà không phải truyền qua nhiều tầng props.

I18nProvider nhận locale và một từ điển từ server. URL quyết định ngôn ngữ; cookie/localStorage chỉ nhớ lựa chọn và đồng bộ tab. Dùng `t` để dịch, `href` để tạo đường dẫn và `setLocale` để chuyển ngôn ngữ, kể cả khi storage bị chặn. Xem [i18n](../i18n/README.md).

AuthProvider tải user một lần khi khởi tạo; các lần gọi đồng thời dùng chung request. Chuyển trang dùng lại state, không polling `/me`. Sau đăng nhập hoặc khi chủ động tải lại tài khoản mới gọi lại; làm mới token không tải lại user.

AnalyticsProvider đọc cấu hình công khai qua `/api/measurement` một lần khi mount. Không có GA4 ID hợp lệ thì không tải script và không hiện lựa chọn phân tích. Khi được cấu hình, chỉ tải tag sau lựa chọn cho phép; lựa chọn được lưu và đồng bộ giữa các tab. Người dùng có thể đổi lại bằng nút quyền riêng tư; rút lại đồng ý sẽ dừng đo, xóa cookie analytics và reload. Query, hash, nội dung form và lỗi chi tiết không được đưa vào các sự kiện của ứng dụng. Xem [cấu hình và runbook](../config/README.md).
