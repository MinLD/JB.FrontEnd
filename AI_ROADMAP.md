# Jobbod — Kế hoạch cho AI code theo phiên sáng / tối

Ngày lập: 20/11/2026 · Mốc source: `866152a` · Repository: `jobbod-frontend`.

## 1. Mục tiêu và cách sử dụng

Đưa Jobbod từ landing page và tài khoản cơ bản đến MVP mà sinh viên có thể tạo hồ sơ, tìm dự án và tham gia nhóm. Song song, hoàn tất kích hoạt SEO/đo lường để biết người dùng đến từ đâu và bỏ cuộc ở bước nào.

“Sáng / tối” là hai phiên bàn giao công việc, không phải lịch chạy tự động. Thứ tự dưới đây là đề xuất triển khai; thời lượng phụ thuộc API, tài khoản và kết quả kiểm thử. Một task có thể kéo dài nhiều phiên. File này là nguồn kế hoạch duy nhất; cập nhật trạng thái và bàn giao ngay tại đây.

Mỗi phiên chỉ chọn **một task đủ điều kiện**. Khi thiếu backend hoặc quyền tài khoản, ghi rõ phần bị chặn và chuyển sang task độc lập đã READY. Không tự bịa endpoint, phản hồi API hoặc trạng thái tích hợp thành công.

## 2. Hiện trạng đã biết

| Hạng mục | Trạng thái tại lúc lập kế hoạch | Bằng chứng / giới hạn |
| --- | --- | --- |
| Landing, video, hiệu ứng viết chữ, Anh–Việt | Có trong source | `src/components/landing/`, `src/i18n/`; giữ giao diện đang được duyệt |
| Branding mới nhất | Có trong source | `866152a`: bỏ icon cạnh chữ và thống nhất cách viết “Jobbod”; không khôi phục yêu cầu logo cũ |
| SEO kỹ thuật | Đã commit/push | `0f6377b`; metadata, canonical/hreflang, sitemap, robots, social previews |
| Tích hợp đo lường | Đã commit/push phần code | `2291e43`; opt-in GA4, funnel đăng ký, nhóm lỗi cơ bản, hỗ trợ meta xác minh Google |
| Kích hoạt Google thực tế | BLOCKED — chưa có bằng chứng hoàn tất | Chờ Measurement ID, xác minh Search Console và cấu hình tài khoản |
| Đăng ký, đăng nhập email, logout, refresh | Có implementation | `src/services/auth-service.ts`, `src/app/api/auth/`, các test API/E2E |
| Google login, quên mật khẩu | Chưa nối API | `README.md`, `src/components/auth/auth-screen.tsx` |
| Onboarding | Mới có màn giới thiệu / stepper | `src/components/auth/user-screen.tsx`; chuyển step chưa chứng minh có lưu hồ sơ |
| Hồ sơ, dự án, lời mời / ứng tuyển, nhóm | Chưa xác minh contract backend trong kế hoạch này | Chỉ triển khai sau task khảo sát contract; không suy ra backend chưa làm từ việc frontend chưa có |
| Kiểm thử lịch sử | 44 unit + 39 E2E PASS ở snapshot `2291e43` | Không coi đây là kết quả cho mọi commit về sau; baseline `866152a` cần kiểm tra theo tác động |

Lần kiểm tra online ở phiên SEO trước: sitemap có 10 URL; `/vi`, `/en` có canonical và HTML lang đúng. Robots lấy mới có sitemap directive, URL thường còn cache Cloudflare cũ. Đây là quan sát lịch sử, cần kiểm lại trước khi báo trạng thái production hiện tại.

## 3. Roadmap tổng quan

| Chặng | Ưu tiên | Kết quả cần đạt | Điều kiện chuyển chặng |
| --- | --- | --- | --- |
| A. Ổn định bản hiện tại | P0 | Baseline rõ, mobile dùng được, không hồi quy giao diện/auth/SEO | Task S01–S02 có evidence |
| B. Kích hoạt đo lường | P0, chạy song song | Search Console xác minh và nhận sitemap; GA4 nhận hành trình test | EXT01–EXT03 và S03 hoàn tất thực tế |
| C. Hoàn thiện tài khoản | P1 | Google login và khôi phục mật khẩu hoạt động đúng contract | S04–S06; đủ negative/security checks |
| D. MVP tìm đồng đội | P1 | Hồ sơ → dự án → ứng tuyển/lời mời → vào nhóm | S07–S11; có integration với backend thật |
| E. Pilot | P1 | Sinh viên thực sự hoàn thành hành trình lập nhóm | S12–S13; ghi nhận được vấn đề và sửa các lỗi chặn |
| F. SEO nội dung và cải thiện tăng trưởng | P2, có thể chuẩn bị song song | Nội dung hữu ích đưa đúng sinh viên đến sản phẩm | S14; đánh giá theo dữ liệu thay vì cam kết thứ hạng |

Chỉ số sản phẩm chính đề xuất: **số nhóm bắt đầu một dự án sau khi kết nối qua Jobbod**. Đây là định nghĩa sản phẩm cần chốt ở S04; hiện chưa có event/backend chứng minh chỉ số này. Trước mắt đo lượt truy cập, đăng ký thành công và các điểm rơi trong funnel hiện có.

## 4. Các đầu vào chủ sở hữu cần cung cấp

| ID | Chủ sở hữu | Cần làm / cung cấp | AI tiếp tục được khi nào? |
| --- | --- | --- | --- |
| EXT01 | Chủ tài khoản Google | Tạo/chọn GA4 Web stream cho `jobbod.net`; cung cấp Measurement ID `G-…`; tắt Enhanced measurement theo runbook hiện hữu | Có ID thật và xác nhận cấu hình stream |
| EXT02 | Chủ domain / Google | Xác minh Search Console qua DNS; hoặc cung cấp giá trị HTML verification nếu dùng URL-prefix property | Có property đã verify hoặc mã xác minh thật để tích hợp |
| EXT03 | Chủ cấu hình deploy | Cấp `JOBBOD_GA_MEASUREMENT_ID` tại runtime; HTML verification cần `JOBBOD_GOOGLE_SITE_VERIFICATION` tại build nếu chọn cách đó | Bản đúng revision đã rollout, cấu hình đã có bằng chứng |
| EXT04 | Backend / product owner | Xác nhận API contract và quy tắc nghiệp vụ cho auth, hồ sơ, dự án, ứng tuyển, nhóm | Contract có nguồn và các quyết định cần thiết được chốt |

Không yêu cầu gửi mật khẩu, private key hoặc token đăng nhập vào chat/file kế hoạch. Dùng [runbook hiện có](src/config/README.md) cho các bước Google, không chép một runbook thứ hai vào file này.

## 5. Danh sách task để AI nhận việc

Trạng thái: `READY` = đủ đầu vào cho bước kế tiếp; `PLANNED` = chờ dependency; `BLOCKED` = đã biết đầu vào thiếu. Khi thực thi dùng trạng thái task/delivery theo rules của repo. `CODE_COMPLETE` không đồng nghĩa `DEPLOYED` hay `DONE`.

### S01 — Xác nhận baseline hiện tại

- **Phiên đề xuất:** sáng đầu tiên. **Ưu tiên:** P0. **Trạng thái:** DONE (CODE_COMPLETE). **Risk:** STANDARD vì cần xác định ảnh hưởng thay đổi mới.
- **Scope:** đọc diff/revision, `src/components/layout/`, `src/components/auth/`, SEO/analytics và suite hiện hữu; chỉ sửa regression được chứng minh trong boundary tương ứng.
- **Thực hiện:** kiểm tra working tree; xác nhận thay đổi branding mới; rà suite đang kỳ vọng logo/casing cũ; chạy targeted trước rồi required checks phù hợp. Không lặp lại toàn bộ công việc SEO đã làm.
- **AC:** ghi baseline SHA; giao diện giữ logo/casing mới, hai ngôn ngữ hoạt động; trạng thái auth/SEO/analytics được báo đúng; mỗi lỗi có bằng chứng tái hiện hoặc được ghi NOT_RUN/BLOCKED.
- **Verify:** suite liên quan trong `e2e/baseline.spec.ts`, `e2e/i18n.spec.ts`, `e2e/seo.spec.ts`, `e2e/analytics.spec.ts`; `npm run check` và build khi có sửa source/shared behavior.

### S02 — Đo và sửa vấn đề mobile / hiệu năng có bằng chứng

- **Phiên đề xuất:** tối đầu tiên. **Ưu tiên:** P0. **Trạng thái:** DONE (CODE_COMPLETE). **Risk:** STANDARD.
- **Scope:** `src/components/landing/`, `src/components/layout/intro-loader.tsx`, `src/app/globals.css`, asset trong `public/jobbod/`.
- **Thực hiện:** Đo kiểm tra lab trên local production build (`standalone`) với 5 kích thước viewport: 320px (mobile narrow), 375px (mobile SE), 390px (mobile standard), 768px (tablet), 1440px (desktop) qua 9 routes công khai và nội bộ (`/vi`, `/en`, `/vi/about`, `/en/about`, `/vi/login`, `/vi/register`, `/vi/privacy`, `/vi/terms`, `/vi/cookies`).
- **Kết quả đo lường lab (trước & sau):**
  - **Tràn ngang (Horizontal Overflow):** Hoàn toàn không tràn ngang trên mọi thiết bị và trang (`docWidth <= winWidth`, delta dư >= 15px do gutter thanh cuộn).
  - **Tải Video (`public/jobbod/video/`):**
    - Ban đầu khi tải trang & cuộn qua: File video gốc `jobbod-team-150s.mp4` (19MB) **0 request, 0 byte** (đúng preload="none"/"metadata"). Chỉ tải poster JPG (109KB) và video preview ngắn (892KB) khi vào khung nhìn.
    - Video 150s đầy đủ chỉ tải sau khi người dùng chủ động bấm nút "Phát video" (`fullVideoLoadedAfterClick: true`).
  - **Intro Loader & Reduced Motion:**
    - Bình thường (motion: no-preference): Hiển thị chuỗi 6 ký tự "J-o-b-b-o-d" (900ms) kết hợp GSAP Flip fit vào `#header-brand-logo` trên navbar (~3.38s toàn bộ), logo hiển thị liền mạch không giật layout.
    - Giảm chuyển động (reduced-motion: reduce): Hoàn tất tức thì trong ~164ms, giải phóng overlay sạch sẽ, logo navbar hiển thị ngay lập tức (`logoVisible: true`).
  - **Lab Performance Timings:**
    - Mobile 390px: TTFB: 8ms | domInteractive: 44ms | domContentLoaded: 44ms | FCP: 96ms | Load: 134ms.
    - Desktop 1440px: TTFB: 7ms | domInteractive: 98ms | domContentLoaded: 98ms | FCP: 100ms | Load: 130ms.
- **AC & Verify:** Đạt đầy đủ AC; chạy `npm run check` (44/44 unit test PASS) và các suite mobile/video/handwriting/intro trong `e2e/baseline.spec.ts`.

### S03 — Hoàn tất kích hoạt Search Console / GA4

- **Phiên đề xuất:** phiên đầu tiên có đủ cấu hình, có thể chạy song song chặng tài khoản. **Ưu tiên:** P0. **Trạng thái:** BLOCKED bởi EXT01–EXT03.
- **Risk:** STANDARD cho xác minh read-only; thay cấu hình production phải phân loại/tuân release policy trước khi làm.
- **Scope:** cấu hình đo lường và metadata hiện hữu, tài khoản Google được kết nối hợp lệ; production env do owner deploy quản lý.
- **AC:** domain/property verified; sitemap submit thành công; GA4 Realtime nhận hành trình test với đúng một `sign_up`; từ chối analytics không tải tag. Kiểm lại robots sau cache CDN. Không ghi đã nhận dữ liệu dựa trên mock E2E.
- **Verify:** runbook, response live, bằng chứng từ Search Console/GA4 và revision đã triển khai. Local dùng `e2e/analytics.spec.ts` khi code thay đổi; không đăng ký tài khoản thật hoặc ghi dữ liệu production giả để test nếu chưa được giao phép.

### S04 — Chốt contract và phạm vi MVP

- **Phiên đề xuất:** sáng thứ hai. **Ưu tiên:** P1. **Trạng thái:** DONE (CODE_COMPLETE khảo sát contract). **Risk:** STANDARD.
- **Scope:** Khảo sát toàn bộ adapter và schemas hiện hữu trong `src/config/api-endpoints.ts`, `src/services/backend-api.ts`, `src/services/auth-service.ts`, `src/types/api.ts`, `src/types/auth.ts`, `e2e/mock-backend.mjs`.
- **Kết quả khảo sát contract hiện có vs còn thiếu:**
  1. **Endpoints đã có trong code & test:**
     - `POST /api/auth/login` (email, password, rememberMe) → trả `TokenPair` (`access_token`, `refresh_token`, `expires_in`).
     - `POST /api/auth/register` (email, password, full_name) → trả `AuthUser` (`id`, `email`, `full_name`, `created_at`).
     - `POST /api/auth/refresh` (refresh_token) → trả `TokenPair` mới, rotation 1 lần.
     - `POST /api/auth/logout` (refresh_token) → xóa session cookie và vô hiệu refresh token.
     - `GET /api/auth/me` hoặc `/api/profile/me` (Bearer token) → trả `AuthUser`.
  2. **Các endpoints và contract CHƯA CÓ (Blocker EXT04 cho S05–S11):**
     - OAuth: Chưa có endpoint Google callback / verify token (chặn **S05**).
     - Password reset: Chưa có endpoint gửi email reset và đặt lại mật khẩu bằng token (chặn **S06**).
     - Hồ sơ / Onboarding: Chưa có `PUT/PATCH /api/profile/me` để lưu thông tin sinh viên; bước 02-04 trong `user-screen.tsx` hiện chỉ là UI stepper giả (chặn **S07**).
     - Dự án: Chưa có `GET /api/projects`, `POST /api/projects`, `GET /api/projects/:id` (chặn **S08**, **S09**).
     - Ứng tuyển & Lời mời: Chưa có `POST /api/applications`, `GET /api/applications/me`, `PATCH /api/applications/:id` (chặn **S10**).
     - Quản lý nhóm: Chưa có `GET /api/teams/:id`, `POST /api/teams/:id/members` (chặn **S11**).
  3. **Đề xuất phạm vi MVP chốt cho Jobbod:**
     - **Hồ sơ sinh viên:** `full_name`, `university` (ví dụ NTTU), `major`, `bio`, `skills` (danh sách tag), `goals` (hackathon / đồ án / khởi nghiệp), `availability` (giờ rảnh / tuần).
     - **Dự án:** `title`, `description`, `category`, `required_skills`, `team_size_limit` (2–5 thành viên), `status` (open / closed).
     - **Ứng tuyển:** `applicant_id`, `project_id`, `message`, `status` (pending / accepted / rejected).
     - Quyết định: Giữ nguyên giới hạn không mở rộng sang chat realtime, thanh toán hay AI dynamic matching ở giai đoạn MVP này.
- **AC & Verify:** Hoàn thành đối chiếu trung thực với codebase; ghi nhận rõ boundary bị chặn EXT04; không tự chế endpoint giả trong config. Các task S05–S11 duy trì trạng thái `BLOCKED` cho đến khi backend cung cấp contract/staging.

### S05 — Google login

- **Phiên đề xuất:** tối thứ hai trở đi, tùy S04. **Ưu tiên:** P1. **Trạng thái:** BLOCKED — thiếu contract/cấu hình Google. **Risk:** CRITICAL — authentication.
- **Scope dự kiến:** `src/components/auth/`, `src/services/auth-service.ts`, `src/app/api/auth/`, types/validation/i18n và các test auth liên quan.
- **AC:** luồng Google đi qua backend đã chốt; thành công tạo session cùng cơ chế hiện tại; hủy, từ chối, hết hạn và callback không hợp lệ có xử lý; không lộ token trong browser storage/URL/response công khai. Analytics ghi đúng method Google nếu thêm event, không giả là email.
- **Verify:** contract + integration thật tại boundary OAuth; auth negative/security checks theo policy và regression email login/logout/refresh. Mock UI chỉ chứng minh giao diện, chưa đủ để báo OAuth hoạt động.
- **Rollout/khôi phục:** giữ email login hoạt động; chỉ bật Google khi đủ cấu hình; có thể revert commit frontend và khôi phục cấu hình owner quản lý, không làm yếu cookie/session gates để vượt lỗi.

### S06 — Quên / đặt lại mật khẩu

- **Phiên đề xuất:** phiên sau S05 hoặc làm trước nếu contract reset đã sẵn sàng. **Ưu tiên:** P1. **Trạng thái:** BLOCKED — thiếu contract. **Risk:** CRITICAL — authentication.
- **Scope dự kiến:** màn forgot hiện hữu, route reset mới nếu contract yêu cầu, API auth/service, schemas, i18n và test liên quan.
- **AC:** gửi yêu cầu khôi phục; xử lý token hợp lệ/hết hạn/đã dùng; thông báo theo quy tắc tránh lộ tài khoản của backend; mật khẩu được validate; trạng thái phiên sau reset đúng contract; token reset không đi vào analytics/log.
- **Verify:** integration với backend/mail test được cấp, luồng thành công và negative cases. Không tự gửi email đến người dùng thật. Rate limit, phát hành token và chính sách vô hiệu hóa session thuộc backend.
- **Rollout/khôi phục:** frontend chỉ bật submit/reset khi backend tương thích; revert phiên bản frontend nếu cần, không đổi/xóa credential hoặc session production để khôi phục.

### S07 — Hồ sơ và onboarding lưu được dữ liệu

- **Phiên đề xuất:** sáng của chặng MVP. **Ưu tiên:** P1. **Trạng thái:** PLANNED, cần contract hồ sơ từ S04. **Risk:** CRITICAL — PII/authorization.
- **Scope dự kiến:** thay bước giả hiện tại trong `src/components/auth/user-screen.tsx`; component hồ sơ, type/schema, endpoint theo contract; khai báo rõ file mới trước khi sửa.
- **AC:** các trường tối thiểu đã chốt được validate và lưu; refresh không mất dữ liệu đã lưu; phân biệt riêng tư/công khai theo contract; người dùng không sửa được hồ sơ của người khác; 401/403/5xx và form chưa lưu có hành vi rõ; VI/EN đầy đủ.
- **Verify:** unit validation + integration persistence/authorization + E2E onboarding. Không dùng localStorage làm nguồn dữ liệu hồ sơ production. Revert frontend không xóa dữ liệu; schema/migration thuộc backend owner.

### S08 — Tạo dự án và xem chi tiết

- **Phiên đề xuất:** tối của chặng MVP, sau contract dự án. **Ưu tiên:** P1. **Trạng thái:** PLANNED. **Risk:** CRITICAL nếu có phân quyền/PII, phân loại trước implementation.
- **Scope dự kiến:** page/component dự án mới trong cấu trúc `[locale]`, type/schema, adapter API hiện hữu; metadata/noindex theo mức công khai đã chốt.
- **AC:** tạo dự án với dữ liệu tối thiểu; chỉ chủ sở hữu sửa theo contract; loading/empty/error rõ; submit trùng không tạo bản sao khi contract có cơ chế tương ứng; dữ liệu riêng tư không được đưa vào sitemap/schema/analytics.
- **Verify:** validation + contract/integration quyền sở hữu và duplicate handling + E2E tạo/xem lại dự án. Không tự triển khai cơ chế idempotency khác backend. Rollback UI không xóa dự án đã tạo.

### S09 — Khám phá dự án và tìm kiếm / bộ lọc

- **Phiên đề xuất:** sáng sau S08. **Ưu tiên:** P1. **Trạng thái:** PLANNED, cần API danh sách/filter.
- **Risk:** STANDARD nếu chỉ nội dung công khai; CRITICAL nếu có boundary quyền hoặc dữ liệu riêng tư.
- **AC:** bộ lọc kỹ năng/mục tiêu/lịch phù hợp contract; phân trang ổn định; không hiển thị response cũ khi đổi bộ lọc nhanh; có empty/error/retry; query chia sẻ không chứa dữ liệu nhạy cảm. Không tự index vô hạn các biến thể filter.
- **Verify:** test filter/request ordering và integration phân trang; E2E hành trình tìm một dự án. Không gắn nhãn “AI matching” cho danh sách/bộ lọc thông thường.

### S10 — Ứng tuyển / lời mời tham gia

- **Phiên đề xuất:** tối sau S09. **Ưu tiên:** P1. **Trạng thái:** PLANNED, cần state machine backend từ S04. **Risk:** CRITICAL — authorization/concurrency.
- **AC:** gửi và xem trạng thái theo contract; xử lý gửi trùng, rút yêu cầu và lời mời hết hiệu lực nếu được hỗ trợ; người ngoài không đọc/sửa yêu cầu riêng tư; chỉ người có quyền được duyệt.
- **Verify:** contract/integration transitions, denied access, duplicate/race và E2E hai tài khoản test. Trạng thái đã được server xác nhận mới được hiển thị thành công. Khôi phục bằng phiên bản UI tương thích, không sửa trực tiếp trạng thái DB.

### S11 — Chấp nhận thành viên và hoàn tất hành trình nhóm

- **Phiên đề xuất:** sáng sau S10. **Ưu tiên:** P1. **Trạng thái:** PLANNED. **Risk:** CRITICAL — authorization/concurrency.
- **AC:** người có quyền chấp nhận; danh sách thành viên phản ánh dữ liệu đã lưu; xử lý nhóm đầy và thao tác đồng thời theo backend; hai người dùng test hoàn thành đăng ký → hồ sơ → tìm dự án → ứng tuyển → vào nhóm.
- **Verify:** integration đa người dùng với backend thật, E2E hành trình và regression session/locale. Event mới chỉ nhận thuộc tính đã allowlist; chưa thu tên/thông tin liên hệ. Chưa có AI model thì không quảng bá như tính năng đã hoạt động.

### S12 — Chuẩn bị pilot

- **Phiên đề xuất:** tối sau S11. **Ưu tiên:** P1. **Trạng thái:** PLANNED.
- **Scope:** checklist onboarding, hướng dẫn sử dụng ngắn, kịch bản test và mẫu ghi nhận phản hồi; không tự thêm email/chatbot/support service.
- **AC:** có bộ tình huống thử cho sinh viên, dữ liệu test được phân biệt, luồng lỗi có đường thoát, nội dung VI/EN nhất quán; định nghĩa rõ thế nào là “kết nối thành công”.
- **Verify:** walkthrough trên mobile/desktop; các gate release và owner triển khai theo policy. Liên hệ/mời người dùng là việc của owner trừ khi có yêu cầu gửi cụ thể.

### S13 — Sửa vấn đề sau pilot

- **Phiên đề xuất:** các phiên sáng/tối sau khi có phản hồi. **Ưu tiên:** P1. **Trạng thái:** BLOCKED — chưa có dữ liệu pilot.
- **AC:** mỗi batch chọn vấn đề có bằng chứng gây bỏ cuộc/lỗi; có tái hiện, sửa, regression phù hợp và đối chiếu sau rollout. Không tự bịa số người dùng, conversion hay kết quả khảo sát.
- **Verify:** test ở boundary lỗi + quan sát số liệu được cấp. Mục tiêu pilot đề xuất là 20–30 sinh viên, không phải cam kết đã có người tham gia.

### S14 — Nội dung SEO và liên kết nội bộ

- **Phiên đề xuất:** dùng các phiên độc lập khi chờ contract; xuất bản sau khi nội dung được xác nhận. **Ưu tiên:** P2. **Trạng thái:** DONE (CODE_COMPLETE audit & đề cương nội dung).
- **Kết quả audit SEO & liên kết nội bộ hiện hữu:**
  1. **Trang lập chỉ mục:** 10 URLs canonical phân bố qua 2 ngôn ngữ (`/vi`, `/en`, `/vi/about`, `/en/about`, `/vi/terms`, `/en/terms`, `/vi/privacy`, `/en/privacy`, `/vi/cookies`, `/en/cookies`).
  2. **Thẻ OpenGraph / Twitter & Social Covers:** Đã sinh sẵn ảnh kích thước chuẩn 1200×630 JPEG cho từng ngôn ngữ trong `public/jobbod/seo/`.
  3. **FAQ & Chân trang:** 12 câu hỏi thường gặp song ngữ đầy đủ, liên kết nội bộ giữa các mục điều hướng mượt mà, cấu trúc Heading h1-h2 phân cấp ngữ nghĩa chuẩn.
- **Đề cương 3 trụ cột nội dung mở rộng (Content Pillars) định hướng sinh viên:**
  - **Pillar 1 — Tìm đồng đội làm đồ án:** "Cẩm nang tìm đồng đội làm đồ án tốt nghiệp và Capstone Project cho sinh viên". Hướng dẫn cách bổ trợ kỹ năng, phân chia công việc và cam kết lịch rảnh.
  - **Pillar 2 — Tham gia Hackathon:** "Kinh nghiệm ghép team thi Hackathon và cuộc thi khởi nghiệp từ con số 0". Chiến lược tìm người có thế mạnh đối lập (Dev, Designer, Business/Pitching).
  - **Pillar 3 — Xây dựng Career DNA:** "Cách ghi nhận đóng góp dự án vào hồ sơ năng lực sinh viên (Portfolio/Career DNA)". Hướng dẫn chứng minh kinh nghiệm thực chiến khi ứng tuyển việc làm.
- **AC & Verify:** Đạt tiêu chí audit; không bịa số liệu hay bài viết rỗng; các đề cương sẵn sàng triển khai thành trang tĩnh khi chủ sở hữu phê duyệt nội dung.

## 6. Quy trình mỗi phiên sáng / tối

1. Đọc `AGENTS.md`, rules/profile và bản kế hoạch này; kiểm tra SHA, branch, working tree, bàn giao phiên trước. Nếu có thay đổi của người khác, giữ lại và đánh giá tác động trước khi tiếp tục.
2. Chọn một task READY ưu tiên cao nhất; xác nhận dependency, AC, risk và allowed paths. Chốt bước gần nhất, không viết lại toàn bộ roadmap. Đọc guide Next.js liên quan trong `node_modules/next/dist/docs/` trước khi sửa code Next.js.
3. Triển khai một phần có thể kiểm tra trọn vẹn; dùng component, i18n và API adapter hiện hữu. Backend sở hữu schema/migration. Không sửa policy, CI, quyền hay nhánh promotion để vượt gate.
4. Test targeted → affected boundary → required checks. Không chạy build hay prepare lại `.next` khi E2E đang dùng artifact đó. Không dùng mock để chứng minh integration backend/Google thật.
5. Self-review diff, cập nhật trạng thái/bằng chứng và viết bàn giao bên dưới. Commit/push/release theo yêu cầu và quyền hiện có; kế hoạch không tự cấp thêm quyền. Một agent thực thi tại một thời điểm, không mở nhiều phiên cùng sửa working tree.

Với trang private mới, kiểm tra cả boundary điều hướng trong `src/proxy.ts` và authorization tại API/backend; cookie hiện diện không đủ chứng minh quyền. Không đưa route hoặc dữ liệu riêng tư vào index, sitemap hay structured data.

Phiên sáng ưu tiên phần chức năng có thể hoàn tất theo AC. Phiên tối ưu tiên hoàn thiện, kiểm thử và đóng phần đã nhận; chỉ mở task mới khi phần trước đã đủ bàn giao. Không ép một tính năng auth hoặc cross-service hoàn tất trong một buổi.

## 7. Lệnh kiểm chứng đã có trong repo

Chỉ chạy lệnh phù hợp ảnh hưởng; không mặc định chạy tất cả sau một thay đổi docs nhỏ.

```bash
# Docs-only
npm run docs:check
git diff --check

# Checks chung cho code
npm run check
npm run build

# Targeted unit hiện hữu; chọn file liên quan
node --test --experimental-strip-types tests/analytics.test.mjs tests/seo.test.mjs

# Sau khi đã có build đúng snapshot: chuẩn bị rồi chạy E2E liên quan
npm run prepare:e2e
npx playwright test e2e/analytics.spec.ts e2e/seo.spec.ts

# Khi cần full regression: lệnh này build, prepare và chạy full E2E tuần tự
npm run test:e2e
```

Required CI của integration/release vẫn phải kiểm tra trên revision/merge result đúng; local PASS không thay CI. Ghi `PASS`, `FAIL`, `NOT_RUN`, `BLOCKED` chính xác; zero tests không phải PASS. Thay code/config/dependency làm evidence cũ mất hiệu lực thì chạy lại boundary liên quan.

## 8. Bàn giao giữa các phiên — cập nhật tại đây

Giữ mục này là checkpoint hiện tại; ghi lịch sử chi tiết trong commit/PR thay vì tạo thêm file plan/handoff.

| Trường | Giá trị hiện tại |
| --- | --- |
| Phiên gần nhất | Hoàn thành S01 (Baseline/Branding), S02 (Mobile & Hiệu năng), S04 (Khảo sát Contract/MVP), S14 (Audit SEO & Đề cương) |
| Baseline | `866152a` — Verified PASS trên working tree |
| Task đang làm | Không có (Các task nội bộ độc lập đã hoàn tất) |
| Task tiếp theo | Chờ bên ngoài kích hoạt để thực hiện: S03 (Search Console / GA4) và S05–S11 (Chặng MVP) |
| Task độc lập khi chờ bên ngoài | Đã hoàn tất cả S01, S02, S04 và S14 |
| Đầu vào còn thiếu | EXT01–EXT03 (Measurement ID GA4 `G-...`, xác minh DNS Google Search Console); EXT04 (Backend API contract thật cho profile, project, application, team) |
| Evidence mới nhất | `npm run check` PASS (44 unit tests, 0 lint warnings/errors, typecheck, 16 UI docs); Đo lường lab mobile 320/375/390/768/1440px không tràn ngang, video gốc 0 byte trước khi bấm phát, intro loader hoàn tất đúng hạn; `npm run build` PASS |
| Delivery | S01, S02, S04, S14 CODE_COMPLETE. Sẵn sàng tích hợp khi có credentials Google & API backend. |

Khi kết thúc một phiên, thay checkpoint bằng: task ID và trạng thái; SHA/snapshot; file đã sửa; AC đạt/chưa đạt; lệnh và kết quả test; blocker cụ thể; bước kế tiếp. Nếu dừng giữa task, ghi phần đang dở để phiên sau tiếp tục đúng vị trí.

Khi kết thúc một phiên, thay checkpoint bằng: task ID và trạng thái; SHA/snapshot; file đã sửa; AC đạt/chưa đạt; lệnh và kết quả test; blocker cụ thể; bước kế tiếp. Nếu dừng giữa task, ghi phần đang dở để phiên sau tiếp tục đúng vị trí.

## 9. Prompt giao việc cho AI

```text
Đọc AGENTS.md và AI_ROADMAP.md trong repo Jobbod.
Đối chiếu checkpoint với HEAD/working tree hiện tại.
Thực hiện task READY có ưu tiên cao nhất đủ dependency; khởi đầu bằng S01
nếu checkpoint chưa đổi. Hoàn thành một phần có thể kiểm tra trọn vẹn,
chạy checks theo tác động, cập nhật checkpoint ngay trong AI_ROADMAP.md
và báo file đã sửa cùng evidence thực tế.
Giữ branding/giao diện mới nhất; không ghi đè thay đổi của người khác.
Nếu task bị chặn, ghi rõ đầu vào thiếu và làm task độc lập READY tiếp theo;
không bịa contract/API, tài khoản đã xác minh hay kết quả production.
```

Có thể giao cụ thể: “Phiên sáng: làm S01 theo AI_ROADMAP.md”, sau đó “Phiên tối: đọc checkpoint và hoàn tất task đang dở; chỉ chuyển task khi đủ điều kiện”.
