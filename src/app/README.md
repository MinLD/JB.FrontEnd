# app

Đây là folder chứa các trang, layout và style chung của ứng dụng, tổ chức theo App Router của Next.js. Khi thêm một trang hoặc thay đổi bố cục bao quanh các trang, thực hiện tại đây.

Folder `api/` dùng để khai báo API chạy trên Next.js server, làm lớp trung gian giữa giao diện và backend Jobbod. `auth/` xử lý đăng nhập và phiên tài khoản.

Các trang và root layout nằm trong `[locale]/`, hỗ trợ `vi` và `en`. Proxy redirect các URL cũ sang URL có ngôn ngữ; API ở `/api/...` độc lập với ngôn ngữ. Favicon dùng `icon.png` và biểu tượng màn hình chính dùng `apple-icon.png`, cùng lấy từ logo robot mới. Xem [hướng dẫn i18n](../i18n/README.md).

SEO: root layout khai báo metadataBase; mỗi page dùng `pageMetadata` với khóa trang từ [cấu hình SEO](../config/seo.ts). `/sitemap.xml` liệt kê 10 URL canonical Anh–Việt kèm hreflang; `/robots.txt` công khai sitemap và chặn crawl `/api/`. Các trang tài khoản có noindex; lỗi 404 giữ status và noindex mặc định của Next.js. Trang chủ xuất Organization/WebSite/WebPage bằng JSON-LD đã escape, không thêm rating hay thông tin doanh nghiệp chưa được xác nhận.

Sau khi triển khai lên domain chính, gửi `https://jobbod.net/sitemap.xml` trong Google Search Console và dùng URL Inspection để kiểm tra `/vi`, `/en`. Việc xác minh sở hữu domain và gửi sitemap cần quyền tài khoản Search Console; không lưu mã xác minh hay token vào source nếu chưa được cung cấp.

## api/backend — Server proxy dùng chung

`api/backend/[...path]/route.ts` nhận request từ giao diện rồi gọi API tương ứng trên backend Jobbod. `[...path]` nhận nhiều đoạn đường dẫn, nên không cần tạo một route Next.js riêng cho mỗi endpoint nghiệp vụ.

Ví dụ:

```text
Giao diện gọi: GET /api/backend/profile/me
Server gọi:   GET {JOBBOD_API_URL}/api/profile/me
```

Proxy xử lý:

- Giữ method, query và body; hỗ trợ GET, POST, PUT, PATCH, DELETE.
- Đọc token từ cookie HttpOnly và gắn Authorization Bearer khi gọi backend; giao diện không phải tự đọc hoặc gửi token.
- Tự refresh khi access token sắp hết hạn hoặc bị từ chối bằng 401, sau đó thử lại một lần và cập nhật cookie.
- Trả dữ liệu/lỗi theo JSON chuẩn. Phiên bị từ chối bằng 401 thì xóa cookie; lỗi mạng/5xx giữ phiên để có thể thử lại.

Khi giao diện cần API nghiệp vụ có xác thực, dùng `clientApi("/api/...")`; hàm tự chuyển sang `/api/backend/...`. Các API `/auth/*` bị chặn ở proxy này và phải dùng route trong `api/auth/`. Request thay đổi dữ liệu được kiểm tra Origin.

Proxy hiện dành cho API JSON; upload file hoặc streaming cần handler riêng.

Các handler dùng chung `apiRoute` để validate input, bắt lỗi và trả ApiResult. Không tự tạo JSON response riêng trong từng route.
