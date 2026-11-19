# components

Đây là folder chứa các thành phần giao diện được ghép vào các trang. Tách component giúp tái sử dụng và chỉnh sửa giao diện mà không làm code trang quá dài.

- [ui/](./ui/README.md): component dùng lại ở nhiều nơi như nút, ô nhập và checkbox; có tài liệu cách dùng riêng.

Landing page dùng breakpoint để bố trí lại nội dung trên tablet/mobile. `ScaledScene` giữ cùng tỷ lệ cho nhân vật Bob, vòng tròn nền và các hình minh họa.

`landing/` chứa FAQ, video và footer; đội ngũ được tách sang trang `/about`. Các trang `/terms`, `/privacy`, `/cookies` dùng chung `layout/policy-page` và nội dung trong `config/policies`.
