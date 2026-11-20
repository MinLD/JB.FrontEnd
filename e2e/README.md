# e2e

Đây là folder chứa kiểm thử ứng dụng trên trình duyệt, mô phỏng các thao tác như đăng nhập, đăng ký và sử dụng giao diện.

Có backend giả lập để kiểm tra mà không ảnh hưởng dữ liệu thật. Chạy `npm run test:e2e`; máy cần Chromium và quyền mở port localhost 3005/4319.

`analytics.spec.ts` chặn Google tag bằng script rỗng và giả lập ID, không gửi dữ liệu thật đến Google. Kiểm tra default-off, consent/revoke, chuyển đổi thành công/thất bại, lọc dữ liệu, locale/mobile và storage bị chặn. Bộ test mặc định cần `JOBBOD_GA_MEASUREMENT_ID` không được đặt ở môi trường server E2E để chứng minh cấu hình thiếu vẫn tắt.
