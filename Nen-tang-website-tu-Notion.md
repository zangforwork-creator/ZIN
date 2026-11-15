# Nền tảng website học tập của Zin từ Notion

Ngày xác lập: **16/11/2026**.

Đây là tài liệu yêu cầu để xây website, chưa phải một website đã triển khai. Nguồn chính: [nghiên cứu mục tiêu trong Notion](Tham-khao-thiet-ke/Notion/Thong-ke-muc-tieu.md), [dữ liệu có nguồn](Tham-khao-thiet-ke/Notion/muc-tieu-notion.json), [kho học liệu](Kho-tai-lieu-mon-hoc/README.md), [tham khảo thiết kế](Tham-khao-thiet-ke-website.md) và [AGENTS.md](AGENTS.md).

## Website cần giúp Zin làm được gì?

1. Biết hôm nay nên học gì và bắt đầu ngay.
2. Học từ giáo trình bằng tóm tắt, sơ đồ, ví dụ và luyện nhớ có nguồn.
3. Nhìn thấy tiến bộ học tập thật qua thời gian.
4. Theo dõi GPA hệ 4, chứng chỉ, ngoại ngữ, hoạt động và dự án trong cùng một nơi.
5. Đọc sách điện tử với cảm giác đơn giản, hấp dẫn mà Zin thích ở Khoaverse.

## Các quyết định đã có căn cứ

| Nội dung | Quyết định / dữ liệu |
|---|---|
| GPA | Hệ 4, Zin xác nhận; chưa có điểm đích hoặc hạn đạt |
| Học kỳ | Xanh lá: kỳ 1 năm 1; cam: kỳ 2 năm 1; trắng: kỳ 1 năm 2 đang học, chưa có kết quả |
| Môn học | Kho hiện có tài liệu cho 10 môn; Logistics Management là tên đã sửa trên Notion |
| Giáo trình nhập môn | Marketing: An Introduction thuộc Introduction to Marketing Career, Zin xác nhận |
| Business Management | Đã có Modern Management bản 578 trang, thay bản trích cũ |
| Cá nhân hoá | Tiếng Việt, xanh dương, điểm nhấn màu kẹo, ảnh mèo |
| Chỉ tiêu khác | 6 mục khoá/chứng chỉ; IELTS có mốc kế hoạch tới 7.5; HSK tới cấp 5 |
| Mức độ khẳng định | Trạng thái Notion là dữ liệu tự ghi; thành tích chính thức cần minh chứng |

## Bố cục chức năng đề xuất

### Trang Hôm nay

- Nút “Bắt đầu phiên học”; chọn 5, 15 hoặc 25 phút.
- Bài ôn đến hạn và nội dung yếu; cho phép bỏ qua khởi động.
- Một việc quan trọng tiếp theo từ môn học/chứng chỉ/dự án.
- Thẻ GPA hệ 4; nếu chưa đủ dữ liệu hiển thị “Chưa đủ dữ liệu”, không điền số mẫu.
- Thẻ mục tiêu ở trạng thái thật; tiến độ nào dựa vào checklist phải được ghi nhãn.

### Kho sách và không gian học

Môn → sách → chương → chủ đề → khái niệm → hoạt động luyện tập. Thư viện bìa sách gợi cảm hứng từ Khoaverse; luôn có danh sách/lưới đơn giản tương đương.

Nội dung từ tài liệu phải dẫn trang/slide nguồn. Tách kiến thức gốc, giải thích thêm và ví dụ giả định. Không tự tạo nội dung từ tài liệu lỗi.

### Góc kết quả và mục tiêu

| Khu vực | Số liệu và bằng chứng cần có |
|---|---|
| GPA | Kỳ, môn, tín chỉ, điểm hệ 4 đã xác nhận, GPA kỳ/tích luỹ, đích và hạn nếu được đặt |
| Chứng chỉ | Khoá học, tiến độ, đơn vị cấp, ngày cấp, file/link minh chứng |
| IELTS / HSK | Mốc học, kết quả kiểm tra thử và điểm thi chính thức tách riêng |
| DRL / cộng đồng | Hoạt động, kỳ, ngày, vai trò, minh chứng, điểm được duyệt |
| Nghiên cứu | Đề tài, tác vụ, mốc nội bộ/hạn nộp cuối, kết quả/sản phẩm |
| Kinh nghiệm | Công việc, vai trò, thời gian, kỹ năng, sản phẩm |
| Dự án / CLB | Mục tiêu riêng; thành viên, bài đăng và views/reactions có dữ liệu |

### Market Pulse

Tin ngắn có nguồn, ngày đăng và thời điểm cập nhật; tách tin đọc khỏi kết quả học. Không có nguồn thật thì ghi demo hoặc trạng thái chưa kết nối.

## Định nghĩa số liệu cần giữ nhất quán

- **GPA:** tổng (điểm hệ 4 đã xác nhận × tín chỉ hợp lệ) / tổng tín chỉ hợp lệ. Xác nhận quy tắc trường về đổi điểm, học lại và môn được tính trước khi tính tự động.
- **Kỳ hiện tại:** kỳ 1 năm 2 có 6 môn chưa có kết quả. Lưu điểm là null và trạng thái awaiting_results; không hiển thị F/điểm 0 như kết quả thật và không đưa các môn này vào tử số hoặc mẫu số GPA. Một điểm 0/F thật đã xác nhận vẫn xử lý theo quy tắc điểm chính thức, không tự loại chỉ vì giá trị bằng 0.
- **Nguồn điểm:** 11 điểm nhìn thấy trong ảnh Zin gửi là thang 10; [bảng theo kỳ](Tham-khao-thiet-ke/Notion/GPA-theo-hoc-ky.md) lưu riêng điểm gốc, điểm hệ 4 và tín chỉ. Không tính GPA từ màu bìa hoặc tự suy quy tắc quy đổi.
- **Phạm vi GPA:** toàn bộ học phần hợp lệ trên bảng điểm. Việc Zin ẩn toán/kế toán khỏi kho học không được xoá chúng khỏi lịch sử GPA.
- **Hoàn thành nội dung:** số bài đã học / số bài đã xác định; không coi đây là hiểu bài.
- **Luyện tập:** câu trả lời, đúng/sai, gợi ý đã dùng và phản hồi; không đánh giá chỉ bằng tốc độ.
- **Nắm vững:** bằng chứng trả lời độc lập qua nhiều lần ôn cách nhau; thiếu bằng chứng thì ghi “Chưa đủ dữ liệu”.
- **Ôn tập:** lưu lịch ở cấp khái niệm/flashcard, gồm ngày trước/sau, kết quả, trợ giúp và lịch sử.
- **Chứng chỉ:** tách khoá hoàn thành, tự đánh dấu đạt và chứng chỉ có minh chứng; không nhập 6 mục kế hoạch thành 6 chứng chỉ đã đạt.
- **IELTS/HSK:** không biến tỷ lệ mục Done thành điểm thi hoặc tỷ lệ thành thạo.
- **Dự án:** checklist có thể hiển thị 16/16 mục Done, nhưng không thay cho kết luận nghiên cứu hoàn thành/công bố.
- **Không gộp:** GPA, XP, đọc tin, thời gian online và kết quả luyện nhớ không thay thế lẫn nhau.

## Dữ liệu nền đề xuất

Tách các nhóm: courses, documents, document_versions, source_sections, topics, concepts, practice_attempts, review_items, review_history, transcript_courses, gpa_targets, qualifications, language_milestones, activities, projects, tasks, evidence và news_activity.

Mỗi bản ghi cần ID ổn định, nguồn, ngày cập nhật và trạng thái xác minh. Lưu riêng source_status và verified_result. Có khoá chống ghi trùng cho nộp bài, ôn tập và nhập dữ liệu.

Lưu và tính toán trong ứng dụng phải độc lập với ảnh chụp Notion; ảnh chỉ phục vụ tham khảo. Dữ liệu gốc nghiên cứu ở muc-tieu-notion.json không phải đồng bộ thời gian thực.

## Phạm vi bản đầu và cách kiểm chứng

1. Khai báo rõ dữ liệu được lưu cục bộ hay có tài khoản đồng bộ. Nếu cục bộ phải có xuất/nhập bản sao lưu.
2. Hoàn thành một luồng thật: tài liệu → chọn chương → tổng hợp có nguồn → tự nhớ → phản hồi → lịch ôn đã lưu.
3. Sau đó thêm bảng kết quả, GPA hệ 4 và danh mục mục tiêu; chưa có GPA đích vẫn dùng được.
4. Nhập có xem trước; lọc quan hệ sai và bản ghi trống mà không tự sửa Notion.
5. Cuối cùng nối tin tức thật; lỗi tin không ảnh hưởng học tập.
6. Kiểm tra tải lại vẫn giữ dữ liệu, nộp lặp không ghi đôi, thay giáo trình không xoá lịch sử.
7. Kiểm tra mobile/desktop, bàn phím, focus, giảm chuyển động và tương phản.

## Chưa được chốt

- GPA đích và thời hạn; quy tắc điểm chính thức.
- Điểm thi thật và thời hạn mới cho IELTS/HSK; 7.5 và HSK 5 hiện chỉ được đọc từ các mốc kế hoạch.
- DRL đích/quy tắc; minh chứng thành tích và kết quả từng dự án.
- Cách lưu trữ, đồng bộ tài khoản và xử lý tài liệu bằng AI. Nếu cần gửi tài liệu ra dịch vụ ngoài, giải thích luồng dữ liệu trước khi người dùng tải lên.

Các mục chưa chốt được giữ trống hoặc cấu hình được; không tự tạo số liệu để trang trông hoàn chỉnh.

## Bản triển khai đầu tiên — 16/11/2026

Theo yêu cầu mới nhất của Zin, giao diện bản đầu sử dụng **tiếng Anh**, có dark/light mode. Mã nguồn và hướng dẫn tại [zin-study-studio/README.md](zin-study-studio/README.md); [hướng dẫn nhanh tiếng Việt](Website-huong-dan.md). Đây là bản chạy được trên máy, với hai bài học dẫn nguồn, lịch ôn lưu cục bộ, dashboard, bảng điểm và tin tuyển chọn có ngày. Các phần đồng bộ Notion, OCR, tổng hợp AI và cập nhật tin tự động vẫn chưa được nối.
