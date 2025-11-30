## Config Management

### List Configs
- Search
    - Có thể để trống
    - Tìm kiếm theo config_key hoặc config_value
- Page
    - Mặc định page 1
    - Phải là số nguyên dương
- Per Page
    - Mặc định số lượng items mỗi trang
    - Phải là số nguyên dương

- Khi load danh sách configs, có hiển thị loading state không?
- Khi có lỗi xảy ra, có hiển thị thông báo lỗi rõ ràng không?
- Có hiển thị pagination (current_page, total_pages, total_items) không?
- Khi search, có debounce để tránh gọi API quá nhiều không?
- Khi không có kết quả, có hiển thị thông báo "No configs found" không?
- Có hỗ trợ phân quyền admin không (chỉ admin mới xem được)?

### Get Config By Key
- Config Key
    - Bắt buộc phải có giá trị
    - Phải là string hợp lệ
    - Key phải tồn tại trong hệ thống

- Khi config key không tồn tại, có hiển thị thông báo lỗi không?
- Khi load config detail, có hiển thị loading state không?
- Có hiển thị đầy đủ thông tin (config_id, config_key, config_value) không?
- Khi có lỗi xảy ra, có hiển thị thông báo lỗi rõ ràng không?
- Có hỗ trợ phân quyền admin không (chỉ admin mới xem được)?

### Update Config By Key
- Config Key
    - Bắt buộc phải có giá trị
    - Phải là string hợp lệ
    - Key phải tồn tại trong hệ thống
- Config Value
    - Bắt buộc phải có giá trị
    - Phải là string không rỗng (min 1 ký tự)
    - Giá trị phải hợp lệ theo từng loại config

- Khi cập nhật thành công, có hiển thị thông báo thành công không?
- Khi cập nhật thất bại, có hiển thị lý do cụ thể không (config không tồn tại, giá trị không hợp lệ, không có quyền)?
- Sau khi cập nhật thành công, có tự động refresh danh sách configs không?
- Có hiển thị loading state khi đang cập nhật không?
- Có dialog xác nhận trước khi cập nhật không?
- Có hỗ trợ phân quyền admin không (chỉ admin mới cập nhật được)?
- Có validate giá trị config theo từng loại config không (ví dụ: số, boolean, JSON)?

