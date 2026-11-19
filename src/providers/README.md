# providers

Đây là folder chứa state và tiện ích cần dùng chung giữa nhiều trang, được gắn vào layout chung của ứng dụng.

Hiện có thông tin tài khoản qua useAuth và thông báo toast. Các component có thể sử dụng chung những dữ liệu này mà không phải truyền qua nhiều tầng props.

AuthProvider tải user một lần khi khởi tạo; các lần gọi đồng thời dùng chung request. Chuyển trang dùng lại state, không polling `/me`. Sau đăng nhập hoặc khi chủ động tải lại tài khoản mới gọi lại; làm mới token không tải lại user.
