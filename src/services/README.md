# services

Chỉ dùng ba hàm sau khi viết chức năng gọi API:

| Nơi gọi | Hàm | Import |
| --- | --- | --- |
| Client Component, hook, sự kiện browser | clientApi | `@/services/client-api` |
| Server Component / SSR | serverApi | `@/services/server-api` |
| Bên trong Server Action | serverActionApi | `@/services/server-action-api` |

Cả ba dùng cùng đường dẫn backend, ví dụ `/api/profile/me`, và nhận body là object JSON. clientApi tự chuyển request qua Next.js proxy; serverApi/serverActionApi gọi backend trực tiếp bằng session cookie.

Mọi kết quả đều là `ApiResult<T>` từ types/api.ts:

```ts
{ success, status, code, message, data }
```

Lỗi HTTP, mạng hoặc JSON sai dạng trả `success: false`, `data: null`; không cần tự try/catch hoặc tạo response khác.

```tsx
const result = await clientApi<AuthUser>("/api/auth/me");
if (!result.success) {
  setError(result.message);
  return;
}
setUser(result.data);
```

Với Server Action, đặt endpoint cố định trong action có `"use server"`, rồi gọi serverActionApi; không cho client truyền tùy ý đường dẫn API. Body truyền trực tiếp: `{ method: "PUT", body: values }`, không JSON.stringify tại nơi gọi.

SSR chỉ đọc dữ liệu và không xoay token vì [Next.js không cho ghi cookie khi render](https://nextjs.org/docs/app/api-reference/functions/cookies). Proxy làm mới phiên trước render; route được bảo vệ mới cần thêm matcher. Server Action được cập nhật cookie và dùng chung logic refresh.

Proxy chỉ kiểm tra cookie và dùng hạn token để quyết định refresh, không gọi `/me` mỗi lần chuyển trang. Đây là bước điều hướng, không xác thực chữ ký hoặc quyền truy cập; mỗi API và Server Action vẫn phải xác thực tại backend. `auth-service` gộp các request `/me` đồng thời, không cache user toàn cục.

Các hàm còn lại là hạ tầng nội bộ. Route handler dùng `apiRoute` từ route-response để tự validate, chuẩn hóa kết quả/lỗi và ghi cookie; không tự viết NextResponse.json hay lặp try/catch. Ví dụ: `export const GET = apiRoute(({ api }) => api<Profile>("/api/profile/me"));` Redirect/notFound của Next.js vẫn giữ cơ chế điều hướng của framework.

ESLint chặn fetch trực tiếp ngoài transport dùng chung. Không tạo thêm hàm gọi HTTP hoặc kiểu response riêng cho từng tính năng.
