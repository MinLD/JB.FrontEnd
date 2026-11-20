# scripts

Đây là folder chứa các công cụ hỗ trợ phát triển dự án, gồm chạy môi trường dev, sinh/kiểm tra tài liệu UI và chuẩn bị tài nguyên cho kiểm thử E2E.

Docs UI được lấy từ JSDoc và Props cạnh component, tự cập nhật khi chạy dev/build và gộp tại components/ui/README.md. Không cần tạo README cho từng folder con.

`node --experimental-strip-types scripts/generate-story-lettering.mjs` tạo đường nét SVG cho hai dòng tiêu đề video từ bản dịch Anh–Việt. Chạy lại khi sửa `story.heading_line1` hoặc `story.heading_line2`. Font Allura và giấy phép OFL nằm trong `scripts/assets/story-lettering/`; nguồn font: https://fonts.google.com/specimen/Allura. Font/parser chỉ dùng để sinh asset, không tải vào trình duyệt. Trang chỉ gửi đường nét của ngôn ngữ hiện tại. Hiệu ứng viết một lần khi vào khung nhìn và hiện chữ đầy đủ nếu giảm chuyển động hoặc không bật JavaScript.
