## Search

### Chưa implement trong UI chính thức
- Global Search - Chỉ có trong test pages, chưa có UI chính thức để search với nhiều filter options (type, extension, size, date)

### Global Search
- Query (q)
    - Có thể để trống
    - Tìm kiếm theo tên file/folder
- Type
    - Có thể để trống (tìm cả file và folder)
    - Nếu có giá trị, phải là 'file' hoặc 'folder'
- Extension
    - Có thể để trống
    - Filter theo file extension (ví dụ: 'pdf', 'jpg')
- Size Min
    - Có thể để trống
    - Nếu có giá trị, phải là số nguyên dương (bytes)
    - Phải nhỏ hơn hoặc bằng size_max
- Size Max
    - Có thể để trống
    - Nếu có giá trị, phải là số nguyên dương (bytes)
    - Phải lớn hơn hoặc bằng size_min
- Date From
    - Có thể để trống
    - Nếu có giá trị, phải là định dạng date hợp lệ
    - Phải nhỏ hơn hoặc bằng date_to
- Date To
    - Có thể để trống
    - Nếu có giá trị, phải là định dạng date hợp lệ
    - Phải lớn hơn hoặc bằng date_from
- Page
    - Mặc định page 1
    - Phải là số nguyên dương
- Per Page
    - Mặc định số lượng items mỗi trang
    - Phải là số nguyên dương

- Khi search, có hiển thị loading state không?
- Khi có lỗi xảy ra, có hiển thị thông báo lỗi rõ ràng không?
- Có hiển thị pagination (current_page, total_pages, total_items) không?
- Có hiển thị đầy đủ thông tin kết quả không?
- Files có hiển thị (type, id, display_name, file_size, mime_type, file_extension, owner, created_at) không?
- Folders có hiển thị (type, id, folder_name, owner, created_at) không?
- Có phân biệt kết quả file và folder trong UI không?
- Khi không có kết quả, có hiển thị thông báo "No results found" không?
- Có debounce khi user đang gõ query không?
- Có hỗ trợ phân quyền không (chỉ search trong files/folders mà user có quyền truy cập)?

### Search Suggestions
- Query (q)
    - Bắt buộc phải có giá trị
    - Phải là string không rỗng sau khi trim
    - Tối thiểu 1 ký tự
- Type
    - Có thể để trống (tìm cả file và folder)
    - Nếu có giá trị, phải là 'file', 'folder' hoặc 'all'
- Limit
    - Có thể để trống (dùng default)
    - Nếu có giá trị, phải là số nguyên dương
    - Giới hạn số lượng suggestions trả về

- Khi load suggestions, có hiển thị loading state không?
- Khi có lỗi xảy ra, có hiển thị thông báo lỗi rõ ràng không?
- Có hiển thị đầy đủ thông tin không (type, id, name, full_path)?
- Suggestions có được sắp xếp theo relevance không?
- Có debounce khi user đang gõ query không?
- Có tự động gọi API khi query thay đổi không?
- Có hỗ trợ phân quyền không (chỉ suggest files/folders mà user có quyền truy cập)?
- Có highlight phần text match trong suggestions không?

