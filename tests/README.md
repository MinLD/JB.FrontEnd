# tests

Đây là folder chứa unit test, dùng để kiểm tra từng phần logic độc lập mà không cần mở ứng dụng trên trình duyệt.

Hiện kiểm tra xử lý dữ liệu API, quy tắc xác thực và công cụ sinh tài liệu UI. Chạy bằng `npm test`; kiểm thử trình duyệt được đặt riêng trong e2e.

Test API chạy trực tiếp các service/handler với Fetch và cookie context giả lập; kiểm tra chung response, refresh và giới hạn ghi cookie SSR mà không cần mở port.
