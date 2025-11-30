## User Dashboard

### Dashboard Overview
- API: GET /api/dashboard
- Không có input parameters

- Khi load dashboard overview, có hiển thị loading state không?
- Khi có lỗi xảy ra, có hiển thị thông báo lỗi rõ ràng không?
- Có hiển thị đầy đủ các thông tin sau không:
    - files_count (số lượng files)
    - folders_count (số lượng folders)
    - storage_used (dung lượng đã sử dụng)
    - storage_limit (dung lượng giới hạn)
    - storage_usage_percent (phần trăm sử dụng)
    - recent_activity_count (số lượng hoạt động gần đây)
- Có format số liệu cho dễ đọc không (ví dụ: bytes -> GB, số có dấu phẩy)?
- Có hiển thị progress bar hoặc visual indicator cho storage_usage_percent không?
- Có tự động refresh dữ liệu định kỳ không?
- Có hỗ trợ phân quyền không (chỉ user đã đăng nhập mới xem được)?

### Dashboard Stats
- API: GET /api/dashboard/stats
- Start Date
    - Có thể để trống
    - Nếu có giá trị, phải là định dạng date hợp lệ (YYYY-MM-DD)
    - Phải nhỏ hơn hoặc bằng end_date
- End Date
    - Có thể để trống
    - Nếu có giá trị, phải là định dạng date hợp lệ (YYYY-MM-DD)
    - Phải lớn hơn hoặc bằng start_date

- Khi load dashboard stats, có hiển thị loading state không?
- Khi có lỗi xảy ra, có hiển thị thông báo lỗi rõ ràng không?
- Có hiển thị đầy đủ các thông tin sau không:
    - file_type_stats (thống kê theo loại file: extension, count, total_size)
    - storage_timeline (timeline dung lượng: date, uploaded)
    - total_storage_used (tổng dung lượng đã sử dụng)
    - total_files (tổng số files)
- Có hiển thị biểu đồ hoặc chart cho storage_timeline không?
- Có hiển thị bảng hoặc list cho file_type_stats không?
- Khi không có start_date và end_date, có lấy stats cho toàn bộ thời gian không?
- Khi chỉ có start_date hoặc chỉ có end_date, có xử lý đúng không?
- Có validate định dạng date trước khi gọi API không?
- Có format số liệu cho dễ đọc không (ví dụ: bytes -> GB, số có dấu phẩy)?
- Có hỗ trợ phân quyền không (chỉ user đã đăng nhập mới xem được)?

