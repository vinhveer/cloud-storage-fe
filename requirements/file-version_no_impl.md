## File Version Management

### Chưa implement trong UI chính thức
- Upload File Version - Chỉ có trong test pages, chưa có UI chính thức để upload version mới của file
- List File Versions - Chỉ có trong test pages, chưa có UI chính thức để xem danh sách versions của file
- Get File Version Detail - Chỉ có trong test pages, chưa có UI chính thức để xem chi tiết một version
- Restore File Version - Chỉ có trong test pages, chưa có UI chính thức để restore version về làm version hiện tại
- Download File Version - Chỉ có trong test pages, chưa có UI chính thức để download một version cụ thể

### Upload File Version
- File ID
    - Bắt buộc phải có giá trị
    - Phải là số nguyên hợp lệ
    - File phải tồn tại và thuộc quyền sở hữu của user
- Action
    - Bắt buộc phải có giá trị
    - Phải là string không rỗng
    - Mô tả hành động (ví dụ: "update", "upload", "revision")
- Notes
    - Có thể để trống
    - Nếu có giá trị, phải là string hợp lệ
    - Ghi chú về version này
- File
    - Bắt buộc phải chọn file
    - File phải hợp lệ (không bị corrupt)
    - File size phải trong giới hạn cho phép

- Khi upload version thành công, có hiển thị thông báo thành công không?
- Khi upload version thất bại, có hiển thị lý do cụ thể không (file không tồn tại, file quá lớn, không có quyền)?
- Response có trả về version mới với version_id và version_number không?
- Có hiển thị progress bar khi đang upload không?
- Sau khi upload version thành công, có tự động refresh danh sách versions không?
- Có validate file size trước khi upload không?
- Có hỗ trợ phân quyền không (chỉ user sở hữu file mới upload version được)?

### List File Versions
- File ID
    - Bắt buộc phải có giá trị
    - Phải là số nguyên hợp lệ
    - File phải tồn tại và thuộc quyền sở hữu của user
- Page
    - Mặc định page 1
    - Phải là số nguyên dương
- Per Page
    - Mặc định số lượng items mỗi trang
    - Phải là số nguyên dương

- Khi load danh sách versions, có hiển thị loading state không?
- Khi có lỗi xảy ra, có hiển thị thông báo lỗi rõ ràng không?
- Có hiển thị pagination (current_page, total_pages, total_items) không?
- Có hiển thị đầy đủ thông tin không (version_id, version_number, action, notes, file_size, created_at)?
- Versions có được sắp xếp theo version_number hoặc created_at giảm dần không?
- Khi không có versions, có hiển thị thông báo "No versions found" không?
- Có đánh dấu version nào là version hiện tại (latest) không?
- Có hỗ trợ phân quyền không (chỉ user sở hữu file mới xem được)?

### Get File Version Detail
- File ID
    - Bắt buộc phải có giá trị
    - Phải là số nguyên hợp lệ
    - File phải tồn tại và thuộc quyền sở hữu của user
- Version ID
    - Bắt buộc phải có giá trị
    - Phải là số nguyên hợp lệ
    - Version phải tồn tại và thuộc về file

- Khi version không tồn tại, có hiển thị thông báo lỗi không?
- Khi load version detail, có hiển thị loading state không?
- Có hiển thị đầy đủ thông tin không (version_id, file_id, version_number, uuid, file_extension, mime_type, file_size, action, notes, created_at, uploaded_by)?
- Khi có lỗi xảy ra, có hiển thị thông báo lỗi rõ ràng không?
- Có hiển thị thông tin user đã upload version (uploaded_by) không?
- Có hỗ trợ phân quyền không (chỉ user sở hữu file mới xem được)?

### Restore File Version
- File ID
    - Bắt buộc phải có giá trị
    - Phải là số nguyên hợp lệ
    - File phải tồn tại và thuộc quyền sở hữu của user
- Version ID
    - Bắt buộc phải có giá trị
    - Phải là số nguyên hợp lệ
    - Version phải tồn tại và thuộc về file

- Khi restore thành công, có hiển thị thông báo thành công không?
- Khi restore thất bại, có hiển thị lý do cụ thể không (version không tồn tại, không có quyền)?
- Response có trả về restored_to_version với version_id và restored_at không?
- Có dialog xác nhận trước khi restore không?
- Sau khi restore thành công, có tự động refresh danh sách versions không?
- Có hiển thị loading state khi đang restore không?
- Có hỗ trợ phân quyền không (chỉ user sở hữu file mới restore được)?
- Có cảnh báo khi restore sẽ tạo version mới từ version cũ không?

### Download File Version
- File ID
    - Bắt buộc phải có giá trị
    - Phải là số nguyên hợp lệ
    - File phải tồn tại và thuộc quyền sở hữu của user
- Version ID
    - Bắt buộc phải có giá trị
    - Phải là số nguyên hợp lệ
    - Version phải tồn tại và thuộc về file

- Khi download thành công, có tự động tải file về không?
- Khi download thất bại, có hiển thị thông báo lỗi không?
- Có hiển thị loading state khi đang download không?
- File name khi download có bao gồm version number không?
- File name khi download có giữ nguyên tên gốc không?
- Có hỗ trợ phân quyền không (chỉ user sở hữu file mới download được)?

