# lib

Đây là folder chứa logic dùng chung cho cả giao diện và server, chẳng hạn kiểm tra dữ liệu phản hồi từ API.

Folder `validations/` chứa schema kiểm tra dữ liệu form và request. Dùng chung schema giúp giao diện và API áp dụng cùng quy tắc cho email, mật khẩu và các trường nhập khác.

`analytics.ts` sở hữu các sự kiện đo lường và allowlist đường dẫn/tham số. Không truyền tên, email, token, form values, error message/stack hay URL thô vào analytics. Gọi `trackAnalytics` tại kết quả thật; đăng ký chỉ phát `sign_up` sau API thành công. Lỗi tag bị cô lập để không ảnh hưởng thao tác của người dùng.
