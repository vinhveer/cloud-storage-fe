## Admin Dashboard

### Dashboard Overview
- API: GET /api/admin/dashboard
- Không có input parameters

- Khi load dashboard overview, có hiển thị loading state không?
- Khi có lỗi xảy ra, có hiển thị thông báo lỗi rõ ràng không?
- Có hiển thị đầy đủ các thông tin sau không:
    - total_users (tổng số users)
    - total_files (tổng số files)
    - total_storage_used (tổng dung lượng đã sử dụng)
    - average_storage_per_user (dung lượng trung bình mỗi user)
    - active_public_links (số lượng public links đang hoạt động)
    - recent_users (danh sách users gần đây: user_id, name, email, created_at)
- Có format số liệu cho dễ đọc không (ví dụ: bytes -> GB, số có dấu phẩy)?
- Có hiển thị metrics cards hoặc visual indicators không?
- Có hiển thị table hoặc list cho recent_users không?
- Có tự động refresh dữ liệu định kỳ không?
- Có hỗ trợ phân quyền không (chỉ admin mới xem được)?

