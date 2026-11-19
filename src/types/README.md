# types

Đây là folder chứa các kiểu TypeScript mô tả dữ liệu trao đổi với backend và dữ liệu dùng chung trong ứng dụng.

Các phần giao diện và service sử dụng cùng kiểu để biết dữ liệu có những trường nào, giúp tránh khai báo lặp và phát hiện dùng sai dữ liệu khi viết code.

`api.ts` định nghĩa ApiResult và ApiOptions dùng xuyên suốt client, SSR, Server Action và route handler. `auth.ts` chứa kiểu dữ liệu tài khoản/token.
