# Zin Studio — GitHub Pages

Website tĩnh: Home, Bookshelf, Courses, lịch thi, ghi chú, sao lưu và đọc PDF/DOCX/PPTX ngay trong trình duyệt. Không cần backend, API key hay bước build.

## Xem trên máy

Mở thư mục dự án này trong VS Code. Chạy `node scripts/serve.mjs` hoặc mở `Start-Website.cmd`, sau đó truy cập http://127.0.0.1:4176. Không mở `index.html` bằng cách nhấp đúp vì trình duyệt cần HTTP để nạp dữ liệu và đọc tài liệu.

## Publish from ZIN

Repository: https://github.com/zangforwork-creator/ZIN
Website: https://zangforwork-creator.github.io/ZIN/

Studio is at the repository root. GitHub Pages uses **Settings / Pages / Deploy from a branch / main / (root)**. Push updates to `main`; no build step, extra hosting or API key is needed. `.nojekyll` publishes the checked-in files directly. A deployment can take a few minutes after a push.

Open a checkout of this repository for local edits. Run `node scripts/serve.mjs` and visit http://127.0.0.1:4176. The older source under `zin-study-studio/` has been replaced by this root website.

Official guide: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site

## Dữ liệu và giới hạn

- Tin tức là thư viện bài đã lưu trong `data/reading-seed.json`, có ngày nguồn và ngày lưu. **Reload library** nạp lại file đã xuất bản, không tự lấy RSS mới. Muốn thêm bài, sửa file dữ liệu và push lại.
- Tài liệu gốc được chọn trên máy và lưu bằng IndexedDB. Chúng không được đưa vào mã nguồn hay gửi lên GitHub. Không còn đường dẫn tải tài liệu riêng từ server.
- Lịch thi, ghi chú và dữ liệu cá nhân lưu trong trình duyệt. Không tự đồng bộ giữa thiết bị; xoá dữ liệu trình duyệt có thể làm mất chúng.
- Để chuyển dữ liệu từ Studio cũ, mở web cũ, chọn **Local data & backups → Export backup**. Trên web mới chọn **Import backup**, sau đó đính kèm lại các file gốc. JSON không chứa file gốc. Địa chỉ localhost, Sites và GitHub Pages có kho lưu trình duyệt khác nhau.
- Liên kết Consumer Behavior Lab, Digital Marketing Lab và khoá học bên ngoài vẫn dẫn tới các website riêng, có thể yêu cầu đăng nhập. Chỉ Studio được chuyển sang Pages.

## Kiểm tra mã nguồn

Node 22 trở lên. `npm run check` và `npm test` không cần cài dependency. Kiểm tra trình duyệt cần `npm ci` rồi `npm run qa`, sử dụng Chrome hoặc Edge đã cài; có thể đặt biến `STUDIO_BROWSER` tới executable. Kết quả và ảnh được ghi vào `.preview/`, không đưa lên Git.

Thư viện PDF.js và fflate cùng giấy phép đã nằm trong `vendor/`. Không cần npm để website hoạt động trên GitHub Pages.
