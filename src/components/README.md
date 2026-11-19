# components

Đây là folder chứa các thành phần giao diện được ghép vào các trang. Tách component giúp tái sử dụng và chỉnh sửa giao diện mà không làm code trang quá dài.

- [ui/](./ui/README.md): component dùng lại ở nhiều nơi như nút, ô nhập và checkbox; có tài liệu cách dùng riêng.

Landing page giữ bố cục desktop 1440px và thu nhỏ đồng bộ trong `landing-canvas`. Các khối ngang không chuyển thành danh sách dọc trên màn hình nhỏ; `ScaledScene` tiếp tục giữ tỷ lệ các hình minh họa bên trong.
