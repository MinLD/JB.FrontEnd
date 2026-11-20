# config

Đây là folder chứa cấu hình và nội dung tĩnh dùng trong ứng dụng, như endpoint API, menu, FAQ, thông tin đội ngũ và danh sách ảnh giao diện.

Khi cần thay các giá trị này, sửa tại đây để các nơi sử dụng cùng được cập nhật. Không đặt thông tin bí mật vì cấu hình có thể được dùng phía client.

`seo.ts` là nguồn chuẩn cho domain canonical `https://jobbod.net`, danh sách trang được index, metadata, hreflang, sitemap và dữ liệu Organization/WebSite. Domain cố định giúp bản preview và query quảng cáo không tạo canonical theo host hoặc tham số người truy cập. Chỉ các trang công khai được đưa vào sitemap; login/register/forgot/user dùng noindex. Không chặn crawl các trang cần đọc noindex bằng robots.txt.
