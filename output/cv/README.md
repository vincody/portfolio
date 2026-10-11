# CV LaTeX - Nguyễn Phú Vinh

Source: `nguyen-phu-vinh-cv.tex`. Bản PDF: `../pdf/nguyen-phu-vinh-cv.pdf`.

CV dùng bố cục một cột, font serif, tiêu đề có đường kẻ theo phong cách Harvard.

## Chỉnh nội dung

- Thông tin cá nhân nằm trong các `\newcommand` ở đầu file.
- Header có icon email, portfolio, GitHub và LinkedIn từ gói `fontawesome5`, kèm chữ và liên kết bấm được. Portfolio đặt tại `\portfoliourl` (`https://vinhnp.tech`).
- CV hiển thị bằng tiếng Anh. Summary, Education, Certifications và Technical Skills đã điền từ thông tin bạn cung cấp.
- Experience chưa có dữ liệu nên đang ẩn; bật `\showexperiencetrue` sau khi điền thông tin thật. Projects đang hiển thị `None`; thay dòng này bằng nội dung dự án khi có. Đổi `\showprojectstrue` thành `\showprojectsfalse` nếu muốn ẩn mục Projects.
- Education đã có University of Information Technology (UIT) - VNU-HCM và ngành Computer Networks and Data Communications. Điền thời gian học vào `\educationdates`. Chưa thêm số điện thoại, bằng cấp, GPA, thời gian làm việc hay ngày cấp chứng chỉ vì bạn chưa cung cấp.
- Đổi `a4paper` thành `letterpaper` nếu muốn khổ US Letter.
- Trong nội dung LaTeX, viết `\&`, `\%`, `\_` để hiển thị `&`, `%`, `_`.

## Biên dịch

**Overleaf:** tạo project, upload file `.tex`, chọn Compiler **XeLaTeX**, rồi Recompile. Font tự chuyển sang TeX Gyre Termes khi máy không có Times New Roman.

**Máy có TeX Live/MiKTeX:** chạy `xelatex nguyen-phu-vinh-cv.tex` hai lần để cập nhật liên kết.

**Tectonic:** cài Tectonic theo https://tectonic-typesetting.github.io/book/latest/installation/, rồi từ thư mục gốc portfolio chạy:

```powershell
tectonic --keep-logs --outdir output\pdf output\cv\nguyen-phu-vinh-cv.tex
```

Tectonic có thể tải các gói TeX cần thiết ở lần chạy đầu. Tài liệu: https://tectonic-typesetting.github.io/book/latest/getting-started/first-document.html

CV đã được tích hợp tại `public/resume.pdf`, với `profile.resume` là `/resume.pdf`. Sau khi chỉnh và biên dịch, copy bản PDF mới vào `public/resume.pdf` và build lại website. Có thể thay bằng URL PDF công khai trên R2.

Tên trường được đối chiếu với trang chính thức: https://en.uit.edu.vn/overview-vnuhcm-university-information-technology

Header không có dòng quốc gia. Tên chứng chỉ AWS là hyperlink trực tiếp tới Credly.

Thứ tự cuối CV: Languages → Technical Skills → Projects. Languages và Projects hiện hiển thị `None`; thay bằng dữ liệu thật khi có.
