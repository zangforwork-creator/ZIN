# Những thống kê Zin đang theo dõi trong Notion

Đối chiếu ngày **16/11/2026**, múi giờ Asia/Bangkok. Đã đọc 18 trang/cơ sở dữ liệu liên quan, bảng Task có 42 dòng, danh mục 6 khoá/chứng chỉ và 3 học kỳ GPA.

**GPA dùng hệ 4 theo xác nhận của Zin. Mức điểm đích và thời hạn chưa được chốt.**

## Tổng quan để xây website

| Nhóm | Điều tìm thấy trong Notion | Chỉ số phù hợp để hiển thị |
|---|---|---|
| GPA | 11 môn đã có điểm hiển thị; 6 môn kỳ 1 năm 2 đang học, chưa có kết quả | GPA hệ 4 từng kỳ/tích luỹ; loại kết quả chưa có khỏi phép tính, không coi 0/F tạm là điểm trượt |
| Chứng chỉ chuyên môn | 6 khoá/chứng chỉ dự kiến; cả 6 đang “Not started” | Khoá đang học/đã xong; chứng chỉ có minh chứng; mốc tiếp theo |
| IELTS | 7 mốc từ 1.0 đến 7.5; 5 mốc được đánh dấu Done, cao nhất là mục “Ielts 5.5” | Mốc kế hoạch cao nhất 7.5; kết quả thi thật và tiến độ học tách riêng |
| HSK | 5 mốc HSK 1–5; đều “Not started” | Mốc kế hoạch cao nhất HSK 5; cấp đã có kết quả xác nhận |
| Điểm rèn luyện | Ghi chú hiến máu/tiểu cầu, workshop, lớp trưởng, GPA giỏi và CLB | Hoạt động theo kỳ, minh chứng và điểm chính thức; không cộng thành tổng khi chưa rõ quy tắc |
| Nghiên cứu khoa học | Academic Report cũ: 16/16 tác vụ Done; một ghi chú mới hơn nói tới 2 đề tài | Tiến độ từng đề tài, phần việc, blocker và mốc nộp đã xác nhận |
| Kinh nghiệm làm việc | “Marketing - Menteelogy” được đánh dấu Done; còn 1 dòng trống | Kinh nghiệm có tên, vai trò, thời gian và sản phẩm/minh chứng |
| Hoạt động cộng đồng | Hiến máu và Teaching certificate đều Done | Hoạt động đã ghi nhận, thời gian, minh chứng và đóng góp |
| Dự án, CLB, truyền thông | Tuyển 2 thành viên kỹ thuật/web; theo dõi views/reactions hằng ngày; kế hoạch truyền thông CLB | Thành viên thực tế/mục tiêu, lượt xem/tương tác có dữ liệu, tiến độ chiến dịch |

Các số trên là **trạng thái được ghi trong Notion**, chưa tự chứng minh năng lực, điểm thi hoặc chứng chỉ chính thức. 7.5 và HSK 5 là mốc cao nhất đang có trong kế hoạch; chưa được Zin xác nhận lại là mục tiêu cuối cùng.

## 1. GPA hệ 4

Nguồn: [Tổng GPA](https://www.notion.so/2efcecd58d5780ca8e2ddbe980c434cb).

- Xanh lá: Kỳ 1 – Năm 1, 6 môn có điểm. Cam: Kỳ 2 – Năm 1, 5 môn có điểm. Trắng: Kỳ 1 – Năm 2, kỳ Zin đang học, 6 môn chưa có kết quả.
- Màu cam đã được Zin xác nhận lại là kỳ 2 năm 1. Màu và trạng thái luôn cần nhãn chữ đi kèm.
- Ba ảnh mới Zin gửi cung cấp điểm hiển thị thang 10 của 11 môn. Xem [bảng điểm theo kỳ](GPA-theo-hoc-ky.md) và [dữ liệu có nguồn](gpa-theo-hoc-ky.json).
- Các số 0/F tạm của kỳ đang học được chuẩn hoá thành null/“Chưa có kết quả”, không tính vào cả tử số và mẫu số GPA. Không áp dụng quy tắc này cho điểm 0/F thật đã được xác nhận.
- Chưa ghi GPA hệ 4 hiện tại: cần tín chỉ hợp lệ và quy tắc điểm hệ 4 đã xác nhận; không tự quy đổi điểm 10 sang điểm 4.
- GPA đích và hạn đạt: **Chưa thiết lập**. Không tự điền 3.2, 3.6 hay 4.0.
- Cách tính đề xuất: tổng (điểm hệ 4 đã xác nhận × tín chỉ hợp lệ) / tổng tín chỉ hợp lệ.
- Cần xác nhận quy tắc đổi điểm, học lại/cải thiện và các môn được tính bằng dữ liệu chính thức của trường.
- **10 môn trong kho học liệu không phải phạm vi tính GPA.** Những môn toán hoặc kế toán đã bỏ khỏi góc học vẫn có thể thuộc bảng điểm và phải được tính nếu hợp lệ.

## 2. Chứng chỉ chuyên môn

Nguồn: [Course Certificate](https://www.notion.so/327cecd58d57802ebb05f3a71ae4928c).

1. Fundamentals of Digital Marketing.
2. Power BI.
3. Inbound Marketing Certification.
4. SEO Fundamentals Course.
5. Google Analytics 4 (GA4) Certification.
6. LinkedIn Marketing Strategy.

Cả 6 mục hiện có trạng thái Not started. Đây là danh mục khoá học/mục tiêu, không khẳng định mọi mục đều cấp một chứng chỉ chính thức. Website cần tách “hoàn thành khoá” khỏi “đã nhận chứng chỉ”; lưu đơn vị cấp, ngày cấp, liên kết hoặc file minh chứng và hạn hiệu lực nếu có.

## 3. Ngoại ngữ

Nguồn: [IELTS](https://www.notion.so/2e0cecd58d5780cdb92be0e0e8d41b41), [HSK](https://www.notion.so/2e0cecd58d578085808cc5fc8bc64139).

- IELTS: 1.0, 2.0, 3.0, 4.0, 5.5 là các mục Done; 6.5 và 7.5 là Not started. Mốc 6.5 có ngày cũ 16/07/2026; không tự chuyển hạn.
- Không gọi 5.5 là điểm IELTS chính thức khi chưa có kết quả thi. Không dùng “5/7 mục xong” làm phần trăm năng lực ngoại ngữ.
- HSK: 1, 2, 3, 4, 5 đều Not started. Không suy ra trình độ hiện tại bằng 0.
- Có 2 mục hiến máu gắn nhầm vào dự án IELTS. Khi thống kê phải loại chúng khỏi tiến độ ngoại ngữ; chưa sửa các quan hệ trong Notion.

## 4. Điểm rèn luyện và hoạt động cộng đồng

Nguồn: [Note DRL](https://www.notion.so/2efcecd58d5780baa6f5d22c28259da1), [Volunteer Activities](https://www.notion.so/2e0cecd58d57802081b6e24c9a38634e).

Ghi chú DRL có những khoản cộng theo hoạt động; chưa thấy tổng điểm chính thức hoặc điểm đích. Một số nhãn kỳ/năm cần đối chiếu trước khi đưa lên biểu đồ.

Volunteer Activities có 2 mục Done: Hiến máu và Teaching certificate. Không tự kết luận Teaching certificate là chứng chỉ nghiệp vụ được công nhận: tên file đính kèm đang gợi tới hoạt động tình nguyện; cần kiểm tra nội dung minh chứng.

## 5. Nghiên cứu, công việc và dự án

- [Academic Report](https://www.notion.so/2b0cecd58d5780e98160f5374c9c451d): 16/16 tác vụ trong danh sách cũ được đánh dấu Done. Đây là tiến độ checklist, không phải số bài báo đã công bố.
- [Rà soát 2 đề tài](https://www.notion.so/3facecd58d5781e2bb79d34a8f00d5f6): ghi rõ mốc nội bộ, chưa có hạn nộp cuối. Không dùng checklist cũ để kết luận cả 2 đề tài đã hoàn thành.
- [Work Experience](https://www.notion.so/2e0cecd58d57800fa9e8ccdc3ab61774): 1 mục có tên và Done, 1 dòng trống Not started. Dòng trống không phải kinh nghiệm thứ hai hoặc mẫu số mặc định.
- [Startup 2027](https://www.notion.so/3facecd58d57811da603ddfdbae7ecc6): mục tiêu tuyển 2 thành viên kỹ thuật/web. Chưa có danh sách thành viên để xác minh số hiện tại.
- [Theo dõi tuyển dụng](https://www.notion.so/3facecd58d57810b82c7dc31e0fc45a3): ghi views/reactions hằng ngày, chưa có chuỗi số liệu trong nguồn đã đọc.
- [Kế hoạch CLB](https://www.notion.so/3facecd58d57815386b2c016ff8dcf51): thông điệp, kênh, timeline nội dung, tuyển thành viên và phân công.

## Những chỗ dữ liệu cần làm rõ

- GPA: thiếu giá trị điểm đích, thời hạn và giá trị hiện tại đọc được trực tiếp từ kết nối.
- Quan hệ IELTS lẫn hiến máu; Work Experience có dòng trống.
- Ảnh trang School hiển thị các thẻ 0%, trong khi bảng Task qua kết nối có các nhóm đã Done. Trình duyệt không truy cập được một số bảng nhúng; chưa thể phân biệt lỗi công thức, quan hệ hay giới hạn hiển thị công khai. Không lấy 0% trên ảnh làm kết quả thực tế.
- Cần tách mục tiêu, trạng thái việc làm, kết quả thực tế và minh chứng. Không gom chúng thành một “điểm thành công” chung.
- Chưa có chỉ tiêu cụ thể cho tổng DRL, số kinh nghiệm, số bài công bố hoặc lượng views/reactions đích.

## Nguồn và ảnh

- [Dữ liệu nền có dẫn nguồn](muc-tieu-notion.json).
- [Danh mục ảnh và giới hạn hiển thị](README.md).
- [Nền tảng yêu cầu website](../../Nen-tang-website-tu-Notion.md).

Không sửa nội dung, quan hệ hoặc trạng thái trong Notion ở lượt nghiên cứu này.
