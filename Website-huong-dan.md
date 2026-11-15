# Website của Zin

Đã triển khai mã nguồn bản đầu tại [zin-study-studio](zin-study-studio/README.md), theo yêu cầu mới nhất: **giao diện tiếng Anh**, dark/light mode, tin tức + chỉ số mục tiêu + tiến độ học tập trên trang chính.

## Mở website riêng tư

**[Zin's Study Studio](https://zin-study-studio.taupeperiwinkle4.chatgpt.site)** đã triển khai thành công ngày 16/11/2026, sau khi Zin cho phép đưa dữ liệu đã liệt kê lên Sites riêng tư. Chỉ tài khoản chủ sở hữu được truy cập; đăng nhập bằng tài khoản đang dùng trong cuộc trò chuyện này.

[Biên nhận triển khai](zin-study-studio-publication.json) lưu phiên bản và mã nguồn đã phát hành. Tiến độ ở địa chỉ localhost và địa chỉ online là hai vùng lưu riêng của trình duyệt: nếu đã học ở localhost, xuất backup rồi nhập vào bản online để chuyển tiến độ; gắn lại file sách gốc khi cần.

## Chạy trên máy

```powershell
cd D:\ZinGPT\zin-study-studio
npm.cmd ci
npm.cmd run build
npm.cmd run dev
```

Mở **http://127.0.0.1:4173**. Không cần API key.

Trên máy hiện tại, các thư viện và bản dựng đã sẵn sàng: có thể chạy trực tiếp [Start-Website.cmd](zin-study-studio/Start-Website.cmd), rồi mở địa chỉ trên. Giữ cửa sổ chạy server trong lúc dùng website.

- **The Daily:** tin tức có nguồn, mục tiêu và việc học tiếp theo.
- **My Bookshelf:** 10 môn thật, bìa mèo từ thư mục Image; chọn môn và Add document để gắn sách gốc.
- **Study Room:** 2 bài học mở đầu có trang nguồn, luyện nhớ và lịch ôn được lưu.
- **Goals & Growth:** bảng điểm 17 môn, mục tiêu GPA hệ 4, kế hoạch chứng chỉ và ngoại ngữ.
- **Studio Settings:** đổi giao diện, xuất/nhập bản sao lưu.

Tài liệu và tiến độ lưu trên trình duyệt đang dùng; chưa đồng bộ giữa các thiết bị. Bản sao lưu gồm ghi chú, nội dung trích, thẻ và lịch sử ôn; giữ riêng các file sách gốc.

Tin tức là bản tuyển chọn đã kiểm tra ngày 16/11/2026, chưa tự cập nhật mỗi ngày. Hỗ trợ đọc PDF có chữ, DOCX và PPTX; chưa có OCR hoặc tổng hợp AI tự động. File Logistics dạng `.ppt` cần xuất sang `.pptx` hoặc PDF. GPA chưa tự quy đổi khi thiếu tín chỉ và quy tắc chính thức.

Chi tiết chức năng, nguồn và kiểm thử: [README của website](zin-study-studio/README.md).
