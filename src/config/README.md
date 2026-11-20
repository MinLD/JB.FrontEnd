# config

Đây là folder chứa cấu hình và nội dung tĩnh dùng trong ứng dụng, như endpoint API, menu, FAQ, thông tin đội ngũ và danh sách ảnh giao diện.

Khi cần thay các giá trị này, sửa tại đây để các nơi sử dụng cùng được cập nhật. Không đặt thông tin bí mật vì cấu hình có thể được dùng phía client.

`seo.ts` là nguồn chuẩn cho domain canonical `https://jobbod.net`, danh sách trang được index, metadata, hreflang, sitemap và dữ liệu Organization/WebSite. Domain cố định giúp bản preview và query quảng cáo không tạo canonical theo host hoặc tham số người truy cập. Chỉ các trang công khai được đưa vào sitemap; login/register/forgot/user dùng noindex. Không chặn crawl các trang cần đọc noindex bằng robots.txt.

## Giai đoạn 2: Search Console và đo lường

`measurement.ts` validate các định danh công khai; cấu hình thiếu/sai để analytics ở trạng thái tắt. Không đưa private key, OAuth token hay mật khẩu vào source hoặc trình duyệt.

### Google Search Console

1. Trong tài khoản Google sở hữu website, tạo Domain property `jobbod.net` và thêm TXT do Google cung cấp tại DNS. Cách này bao phủ các URL/ngôn ngữ và không cần sửa code. Giữ bản ghi xác minh sau khi thành công.
2. Nếu không có quyền DNS, dùng URL-prefix property `https://jobbod.net/` và HTML tag. Cấp **giá trị content**, không phải cả thẻ meta, vào `JOBBOD_GOOGLE_SITE_VERIFICATION` tại **build time**. Trang static cần rebuild/redeploy khi đổi mã; chỉ cấp env lúc chạy container sẽ không cập nhật metadata đã prerender. Việc truyền env build thuộc cấu hình deploy trung tâm, không tự sửa CI trong task frontend.
3. Kiểm tra source HTML của cả `/vi` và `/en` có tag nếu dùng HTML; chọn Verify trong Search Console.
4. Khi sitemap live trả 200 và đúng 10 URL, gửi `https://jobbod.net/sitemap.xml`. Dùng URL Inspection cho `/vi` và `/en`, kiểm tra canonical và khả năng index; yêu cầu index trang chủ khi phù hợp.
5. Theo dõi Pages/Sitemaps/Performance hàng tuần. Gửi sitemap hoặc yêu cầu index không bảo đảm được index hay có thứ hạng ngay.

Nếu robots.txt còn bản cũ từ CDN sau release, đối chiếu response cache MISS với URL thường và purge đúng URL robots.txt bằng tài khoản CDN của chủ sở hữu hoặc đợi TTL hết; không đổi robots rules để né cache. Sitemap có thể gửi trực tiếp qua Search Console trong lúc chờ cache cập nhật.

### GA4

1. Tạo GA4 property và Web data stream cho `https://jobbod.net`. Lấy Measurement ID dạng `G-…`.
2. **Tắt toàn bộ Enhanced measurement trong data stream trước khi bật tích hợp**, nhất là history-based page views, form interactions và site search. Ứng dụng tự gửi page_view, tắt `send_page_view` và lọc URL; đo tự động của Google có thể đếm trùng hoặc đọc query URL ngoài các sự kiện do ứng dụng kiểm soát. Không bật Google Signals, user-provided data hay advertising features cho tích hợp này.
3. Cấp `JOBBOD_GA_MEASUREMENT_ID` vào **runtime environment** của frontend container qua cấu hình deploy trung tâm. Không cần NEXT_PUBLIC/build arg hay thay Dockerfile. ID là công khai; endpoint `/api/measurement` chỉ trả ID hợp lệ. Bỏ env/restart để tắt tích hợp. Không gắn thêm GA/GTM/Firebase Analytics song song để tránh trùng sự kiện.
4. Mở website: trước khi chọn cho phép, không được có request đến Google tag/collect. Chọn “Cho phép phân tích”, kiểm tra Realtime/DebugView bằng thiết bị test; chọn “Chỉ cần thiết” để kiểm tra dừng đo. Người từ chối, ad blocker và storage bị chặn có thể làm báo cáo thấp hơn số thao tác thực tế.
5. Đánh dấu `sign_up` là key event. Tạo funnel theo các bước: `page_view` trang chủ → `sign_up_click` → `page_view` trang register → `sign_up_attempt` → `sign_up`. Người vào thẳng register không đi qua tất cả bước; dùng open funnel khi phân tích nhóm này.

| Event | Thời điểm |
| --- | --- |
| page_view | Mở trang hoặc đổi pathname Anh–Việt, không phát lại cho cùng pathname khi rerender/query/hash đổi |
| sign_up_click | Khách chưa đăng nhập bấm CTA bắt đầu để đến register |
| sign_up_attempt | Form đăng ký hợp lệ được gửi đến API |
| sign_up | API đăng ký thành công; lỗi/validation không được tính chuyển đổi |
| login | API đăng nhập và tải session đều thành công |
| auth_error | Lỗi request register/login hoặc tải session; chỉ loại lỗi cố định |
| app_error | JavaScript error/unhandled rejection; chỉ nhóm lỗi, không có message/stack |

Các event chỉ nhận method/action/error_type cố định, locale và các URL trang đã allowlist. Query/hash bị bỏ, referrer chỉ giữ origin; hiện chưa giữ UTM. Không gửi user_id, email, họ tên, mật khẩu hoặc nội dung form. Ads storage/data/personalization bị từ chối; cookie analytics được đặt cho host hiện tại. Đây là theo dõi lỗi cơ bản, chưa thay hệ thống stack trace, cảnh báo hay server error monitoring.

### Bàn giao và kiểm chứng

- Local unit/E2E dùng ID giả và chặn script Google; PASS chứng minh hành vi ứng dụng, không chứng minh tài khoản Google đã nhận event.
- Hoàn thành kích hoạt khi domain đã verify, sitemap đã submit thành công, env runtime đã có ID thật và GA4 Realtime ghi nhận một hành trình test đúng một conversion.
- Chưa có tài khoản/ID/quyền DNS: code có thể hoàn tất nhưng các bước tài khoản vẫn chờ chủ sở hữu. Không ghi trạng thái đã xác minh/đã nhận dữ liệu khi chưa có bằng chứng.
- Nguồn chính thức: [xác minh sở hữu](https://support.google.com/webmasters/answer/9008080), [page views](https://developers.google.com/analytics/devguides/collection/ga4/views), [events](https://developers.google.com/analytics/devguides/collection/ga4/events), [basic consent](https://developers.google.com/tag-platform/security/guides/consent).
