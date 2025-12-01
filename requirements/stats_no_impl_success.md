## Admin Stats

### Chưa implement trong UI chính thức
- Get Admin User Stats - Chỉ có trong test pages, chưa có UI chính thức để xem thống kê users
- Get Admin File Stats - Chỉ có trong test pages, chưa có UI chính thức để xem thống kê files
- Get Admin Storage Stats - Chỉ có trong test pages, chưa có UI chính thức để xem thống kê storage với timeline

### Get Admin User Stats
- Không có input parameters

- Khi load user stats, có hiển thị loading state không?
- Khi có lỗi xảy ra, có hiển thị thông báo lỗi rõ ràng không?
- Có hiển thị đầy đủ thông tin không:
    - roles (phân bổ users theo role: admin, user, viewer)
    - storage_usage_distribution (phân bổ users theo storage usage buckets: range, users)
    - new_users_last_7_days (số lượng users mới trong 7 ngày qua)
- Có hiển thị biểu đồ hoặc chart cho roles distribution không?
- Có hiển thị biểu đồ hoặc chart cho storage usage distribution không?
- Có format số liệu cho dễ đọc không (ví dụ: số có dấu phẩy)?
- Có hỗ trợ phân quyền admin không (chỉ admin mới xem được)?

### Get Admin File Stats
- Không có input parameters

- Khi load file stats, có hiển thị loading state không?
- Khi có lỗi xảy ra, có hiển thị thông báo lỗi rõ ràng không?
- Có hiển thị đầy đủ thông tin không:
    - file_extension_stats (thống kê theo extension: extension, count)
    - deleted_files (số lượng files đã xóa)
    - total_storage_used (tổng dung lượng storage đã sử dụng)
- Có hiển thị biểu đồ hoặc chart cho file extension stats không?
- Có format số liệu cho dễ đọc không (ví dụ: bytes -> GB, số có dấu phẩy)?
- Có hỗ trợ phân quyền admin không (chỉ admin mới xem được)?

### Get Admin Storage Stats
- Start Date
    - Có thể để trống (lấy tất cả thời gian)
    - Nếu có giá trị, phải là định dạng date hợp lệ (YYYY-MM-DD)
    - Phải nhỏ hơn hoặc bằng end_date
- End Date
    - Có thể để trống (lấy đến hiện tại)
    - Nếu có giá trị, phải là định dạng date hợp lệ (YYYY-MM-DD)
    - Phải lớn hơn hoặc bằng start_date

- Khi load storage stats, có hiển thị loading state không?
- Khi có lỗi xảy ra, có hiển thị thông báo lỗi rõ ràng không?
- Có hiển thị đầy đủ thông tin không:
    - storage_timeline (timeline storage: date, total_storage_used)
    - average_growth_per_day (tăng trưởng trung bình mỗi ngày)
- Có hiển thị biểu đồ hoặc chart cho storage timeline không?
- Khi không có start_date và end_date, có lấy stats cho toàn bộ thời gian không?
- Khi chỉ có start_date hoặc chỉ có end_date, có xử lý đúng không?
- Có validate định dạng date trước khi gọi API không?
- Có format số liệu cho dễ đọc không (ví dụ: bytes -> GB, số có dấu phẩy)?
- Có hỗ trợ phân quyền admin không (chỉ admin mới xem được)?

