# i18n

Thư mục quản lý đa ngôn ngữ (quốc tế hóa) cho giao diện JobBod.

Hỗ trợ hai ngôn ngữ:
- `vi`: Tiếng Việt (mặc định)
- `en`: Tiếng Anh (English)

Các trang nằm trong `src/app/[locale]`. URL `/vi/...` và `/en/...` quyết định ngôn ngữ của HTML, metadata và nội dung ngay trên server. Hai phiên bản được prerender; các URL cũ vẫn được Proxy redirect theo cookie hợp lệ hoặc mặc định `vi`. Response của URL cũ dùng `private, no-store` và `Vary: Cookie` để tránh trộn ngôn ngữ trong cache.

`server.ts` đọc root parameter theo API của Next.js và chỉ nạp từ điển được chọn. Layout truyền từ điển đó vào provider; các component dùng `useI18n().t(...)` với key có kiểu TypeScript và tham số nội suy dạng văn bản. FAQ, đội ngũ và chính sách cũng chỉ gửi nội dung của ngôn ngữ hiện tại xuống trình duyệt.

Dùng `LocalizedLink` cho link nội bộ và `useI18n().href(...)` cho điều hướng bằng router. Link ngoài và anchor giữ nguyên. Khi đổi ngôn ngữ, đường dẫn, query và hash được giữ lại; URL có locale luôn ưu tiên hơn cookie.

`jobbod_lang` được lưu trong cookie một năm và localStorage để nhớ lựa chọn, đồng bộ giữa các tab. Hai thao tác lưu độc lập; URL vẫn cho phép chuyển ngôn ngữ và reload khi một hoặc cả hai cơ chế lưu trữ bị chặn. Không dùng storage của trình duyệt trong lần render đầu nên HTML và hydration dùng cùng một từ điển.

Thêm key đồng thời vào `types.ts`, `locales/vi.ts` và `locales/en.ts`. Thông báo kiểm tra form dùng chung giới hạn với API qua `createAuthSchemas`; nội dung chính sách ở `src/config/policies.ts`. `config.ts` giữ helper dành cho server/test, không import nó từ client vì nó chứa cả hai từ điển.

Kiểm chứng: `npm run check` kiểm key, fallback, validation và đường dẫn. `npm run test:e2e` kiểm SSR, favicon, metadata, storage bị chặn, nhiều tab và hành trình đăng nhập bằng hai ngôn ngữ.
