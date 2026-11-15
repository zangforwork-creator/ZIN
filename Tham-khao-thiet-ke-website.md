# Tham khảo thiết kế website

Cập nhật: **16/11/2026**.

## Nguồn chính

- Website: [Khoaverse — khoaverse.fun](https://khoaverse.fun/).
- [Ảnh trang chủ đã quan sát](Tham-khao-thiet-ke/Khoaverse-trang-chu.png), chụp ở kích thước 1440 × 1100.
- Trạng thái: tài liệu định hướng thiết kế cho ZinGPT; chưa triển khai vào website.

## Điều Zin muốn học từ website này

Zin rất ấn tượng với cách website hấp dẫn người đọc sách điện tử và sự đơn giản khi trình bày sách. Ưu tiên giữ cảm giác muốn mở sách, dễ bắt đầu đọc và ít thao tác gây phân tâm.

Đây là sở thích do Zin cung cấp, không phải kết quả đo lường mức độ hiệu quả của website.

## Những điểm đã quan sát

Nguồn cho các quan sát dưới đây: [trang Khoaverse](https://khoaverse.fun/) và ảnh tham chiếu.

- Kệ sách 3D chiếm vị trí trung tâm; cuốn đang chọn được phóng lớn, kèm tên sách và tác giả.
- Có bộ lọc sách, ô tìm kiếm và khu vực sách của người dùng.
- Nền minh hoạ thiên nhiên, màu dịu và khoảng trống quanh phần đầu trang.
- Thanh điều khiển phía dưới khá gọn.
- Giao diện đọc có mục lục, điều hướng trang và lựa chọn giao diện.
- Có luồng thêm PDF, nhập tên sách/tác giả và kiểm tra mục lục trước khi lưu.

Đã quan sát trang chủ trên desktop và đọc nội dung giao diện. Chưa kiểm thử thao tác đọc sách, nhập PDF hay bố cục mobile trên website nguồn.

## Định hướng áp dụng cho ZinGPT

Các mục dưới đây là đề xuất cho dự án, không phải khẳng định Khoaverse đã triển khai chúng.

| Mục tiêu | Hướng áp dụng |
|---|---|
| Muốn mở sách để học | Thư viện theo môn; bìa sách nổi bật; hiển thị tên, tác giả và nút “Đọc tiếp” |
| Bắt đầu nhanh | Trang chủ có “Bắt đầu phiên học”; mở lại bài/chương gần nhất |
| Giữ trải nghiệm đơn giản | Khi đọc chỉ ưu tiên nội dung, mục lục, tiến/lùi và các tuỳ chọn cần thiết |
| Đọc dễ chịu | Chọn cỡ chữ, độ rộng cột, giãn dòng và nền đọc; ưu tiên tiếng Việt |
| Học bằng hình ảnh | Từ sách chuyển sang tổng quan, sơ đồ và ví dụ có dẫn trang nguồn |
| Thu hút nhưng dễ sử dụng | Có thể dùng hiệu ứng kệ sách ở desktop; luôn có danh sách/lưới đơn giản tương đương, dùng được bằng bàn phím |
| Phù hợp sở thích của Zin | Xanh dương chủ đạo, điểm nhấn màu kẹo và ảnh mèo từ thư mục Image |
| Trở lại việc học | Lưu vị trí đọc, đánh dấu, ghi chú và bài ôn đến hạn; tách tiến độ đọc khỏi bằng chứng hiểu bài |

## Phác thảo luồng mong muốn

**Chọn môn → chọn sách → đọc chương → xem sơ đồ/ý chính → tự nhớ lại → nhận phản hồi → lưu lịch ôn.**

- Thư viện: lọc theo môn, tìm theo tên sách/tác giả, đọc tiếp.
- Trình đọc: mục lục thu gọn được, dấu trang, nguồn trang gốc.
- Khu học: chuyển rõ ràng giữa đọc tài liệu, học trực quan và luyện nhớ.
- Mobile: một cột, nút dễ chạm; không phụ thuộc hiệu ứng 3D để tìm hoặc mở sách.

## Tiêu chí khi triển khai sau này

- Tìm và mở tài liệu bằng chuột, cảm ứng hoặc bàn phím.
- Có focus rõ ràng; chế độ giảm chuyển động.
- Nút và chữ dễ đọc, tương phản phù hợp; không dùng màu làm dấu hiệu duy nhất.
- Luôn đọc được tài liệu gốc; bảng, biểu đồ hoặc công thức không bị chuyển thành văn bản sai.
- Giao diện gọn nhưng vẫn có trạng thái tải, lỗi và cách thử lại.
- Chỉ đánh giá khả năng thu hút hoặc hiệu năng sau khi có kiểm thử thực tế.

## Mục tiêu và thống kê từ Notion của Zin

Đã đối chiếu 18 trang/cơ sở dữ liệu liên quan ngày 16/11/2026. Nguồn này bổ sung yêu cầu dữ liệu cho website, còn Khoaverse là nguồn cảm hứng trải nghiệm đọc.

- [9 nhóm thống kê tìm thấy trong Notion](Tham-khao-thiet-ke/Notion/Thong-ke-muc-tieu.md): GPA, khoá/chứng chỉ, IELTS, HSK, DRL, nghiên cứu, kinh nghiệm, cộng đồng và dự án/CLB/truyền thông.
- [Ảnh chụp Notion và giới hạn hiển thị](Tham-khao-thiet-ke/Notion/README.md): 7 ảnh trang nguồn; một số bảng không hiện trong trình duyệt chưa đăng nhập.
- [Ảnh tổng hợp desktop](Tham-khao-thiet-ke/Notion/08-Bang-tong-hop-desktop.png) và [mobile](Tham-khao-thiet-ke/Notion/09-Bang-tong-hop-mobile.png): bản tổng hợp có ghi nhãn, không phải giao diện Notion.
- [Nền tảng yêu cầu website](Nen-tang-website-tu-Notion.md): bố cục, định nghĩa số liệu, dữ liệu cần lưu và cách kiểm chứng.

GPA dùng **hệ 4** theo xác nhận của Zin; điểm đích còn trống. Mốc IELTS 7.5 và HSK 5 hiện đọc từ kế hoạch, không được coi là kết quả thi. Giao diện phải tách trạng thái tác vụ, kết quả có minh chứng và mức độ nắm vững kiến thức.

GPA đã được bổ sung [bảng điểm theo học kỳ](Tham-khao-thiet-ke/Notion/GPA-theo-hoc-ky.md) từ 3 ảnh Zin gửi: xanh lá là kỳ 1 năm 1, cam là kỳ 2 năm 1, trắng là kỳ 1 năm 2 đang học. 6 môn kỳ hiện tại chưa có kết quả; giao diện dùng “Chưa có kết quả”, không coi số 0/F tạm là điểm trượt hoặc đưa vào GPA.

Tài liệu môn học nằm trong [Kho-tai-lieu-mon-hoc](Kho-tai-lieu-mon-hoc/README.md). Quy tắc sản phẩm và học tập tiếp tục theo [AGENTS.md](AGENTS.md).

## Website đã triển khai từ tài liệu tham khảo

Bản đầu: [Zin's Study Studio](zin-study-studio/README.md), giao diện tiếng Anh theo yêu cầu mới nhất, light/dark mode, trang chủ theo phong cách tạp chí, kệ sách với bìa mèo từ Image. [Ánh xạ ảnh nguồn](zin-study-studio/ASSET-SOURCES.json) ghi lại file gốc cho mỗi ảnh được dùng.

Ảnh kiểm thử giao diện: [desktop light](zin-study-studio/.preview/desktop-light.png), [desktop dark](zin-study-studio/.preview/desktop-dark.png), [mobile light](zin-study-studio/.preview/mobile-light.png), [mobile dark](zin-study-studio/.preview/mobile-dark.png). Đây là ảnh website đã chạy trên trình duyệt, không phải ảnh mockup.
