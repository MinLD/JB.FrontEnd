# public

Đây là folder chứa ảnh và tài nguyên được trình duyệt truy cập trực tiếp. Ví dụ, ảnh trong `public/jobbod/` được sử dụng qua đường dẫn `/jobbod/`.

Trong `jobbod/`, tài nguyên được chia thành `design/` cho ảnh Figma, `illustrations/` cho các lớp SVG đã tách để responsive, `workflow/` cho minh họa các bước, `team/` cho chân dung, `partners/` cho logo, `video/` cho video và ảnh bìa, `footer/` cho ảnh trang trí cuối trang.

Nền kính trong `illustrations/` có bản tablet/mobile, dùng chung cho landing và trang xác thực qua `frostedBackgroundStyle` trong `src/config/design-assets.ts`.

Logo hiển thị trên landing lấy từ website chính thức: [NTTU](https://ntt.edu.vn/), [NJEC](https://njec.vn/), [NIIC](https://nttu.startup.niic.vn/). Video Jobbod do chủ dự án cung cấp từ `Jobbod team_Full_150s.mp4`: bản đầy đủ 2 phút 30 giây giữ hình Full HD và âm thanh, được đóng gói faststart để phát trên web. Bản xem trước 8 giây không có âm thanh và ảnh bìa được lấy từ chính video này. Video đầy đủ chỉ tải khi bấm phát; người dùng bật giảm chuyển động chỉ thấy ảnh bìa đến khi chủ động phát.
