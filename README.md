# Jobbod

Frontend dùng Next.js App Router, React, TypeScript và Tailwind CSS.
Hiện có landing page, đăng nhập, đăng ký và trang tài khoản. Google login và quên mật khẩu chưa nối API.

## Cấu trúc source

```text
src/
  app/          Các trang, layout, style chung và API handler Next.js
  components/   Giao diện: auth, landing, layout và UI tái sử dụng
  services/     Gọi API, quản lý cookie và refresh phiên
  providers/    State tài khoản và thông báo toast dùng chung
  config/       Endpoint API, nội dung landing và danh sách ảnh
  lib/          Logic dùng chung; validations/ chứa schema kiểm tra dữ liệu
  types/        Kiểu TypeScript cho dữ liệu
  utils/        Hàm tiện ích
public/         Ảnh và tài nguyên giao diện
scripts/        Công cụ hỗ trợ dev, tài liệu và kiểm thử
tests/          Unit test
e2e/            Kiểm thử trình duyệt với backend giả lập
```

Giao diện gọi service → API Next.js → backend Jobbod. Token được server quản lý qua cookie HttpOnly; proxy kiểm tra cookie và refresh khi cần trước khi vào trang tài khoản. Backend xác thực token và quyền khi gọi API.

## Chạy local

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Đặt URL backend tại `JOBBOD_API_URL`. Chạy `npm run check` để kiểm tra code.

[Runbook Search Console và GA4](./src/config/README.md) hướng dẫn kích hoạt đo lường, kiểm tra chuyển đổi và theo dõi SEO. Analytics mặc định tắt khi chưa có cấu hình thật; khi bật, chỉ tải sau lựa chọn cho phép của người dùng.

[Danh mục UI](./src/components/ui/README.md) ghi công dụng và cách dùng component; tự cập nhật khi chạy dev/build.

## Tích hợp repo

Nhánh `frontend/develop` tự tạo/cập nhật PR tích hợp vào `staging`; kiểm tra Integration CI trước khi merge. Luồng phát hành là `staging` → `main`. Không merge trực tiếp cây service này vào monorepo hoặc sửa nhánh `promote/*`.
