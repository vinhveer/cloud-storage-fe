## Trash Management

### Chưa implement trong UI chính thức
- Get Trash Folder Contents - Chỉ có trong test pages, chưa có UI chính thức để xem nội dung của folder trong trash

### List Trash
- Search
    - Có thể để trống
    - Tìm kiếm theo tên file/folder
- Page
    - Mặc định page 1
    - Phải là số nguyên dương
- Per Page
    - Mặc định số lượng items mỗi trang
    - Phải là số nguyên dương

- Khi load danh sách trash, có hiển thị loading state không?
- Khi có lỗi xảy ra, có hiển thị thông báo lỗi rõ ràng không?
- Có hiển thị pagination (current_page, per_page, total_pages, total_items) không?
- Có hiển thị đầy đủ thông tin không (id, type, title, deleted_at, file_size, mime_type, file_extension, parent_id)?
- Có phân biệt file và folder trong UI không?
- Khi search, có debounce để tránh gọi API quá nhiều không?
- Khi không có items, có hiển thị thông báo "Trash is empty" không?
- Có hỗ trợ phân quyền không (chỉ user đã đăng nhập mới xem được trash của mình)?

### Get Trash Folder Contents
- Folder ID
    - Bắt buộc phải có giá trị
    - Phải là số nguyên hợp lệ
    - Folder phải tồn tại trong trash
- Search
    - Có thể để trống
    - Tìm kiếm theo tên file/folder
- Page
    - Mặc định page 1
    - Phải là số nguyên dương
- Per Page
    - Mặc định số lượng items mỗi trang
    - Phải là số nguyên dương

- Khi load folder contents, có hiển thị loading state không?
- Khi có lỗi xảy ra, có hiển thị thông báo lỗi rõ ràng không?
- Có hiển thị đầy đủ thông tin folders và files không?
- Folders có hiển thị (folder_id, folder_name, deleted_at) không?
- Files có hiển thị (file_id, display_name, file_size, mime_type, file_extension, deleted_at) không?
- Có hiển thị pagination riêng cho folders và files không (folders_pagination, files_pagination)?
- Khi folder rỗng, có hiển thị thông báo "Folder is empty" không?
- Có hỗ trợ phân quyền không (chỉ user sở hữu folder mới xem được)?

### Restore Trash Item
- Item ID
    - Bắt buộc phải có giá trị
    - Phải là số nguyên hợp lệ
    - Item phải tồn tại trong trash
- Type
    - Bắt buộc phải có giá trị
    - Phải là 'file' hoặc 'folder'
    - Phải khớp với type của item trong trash

- Khi restore thành công, có hiển thị thông báo thành công không?
- Response có trả về restored_item với id, type, display_name không?
- Khi restore thất bại, có hiển thị lý do cụ thể không (item không tồn tại, không có quyền)?
- Sau khi restore thành công, có tự động refresh danh sách trash không?
- Có hiển thị loading state khi đang restore không?
- Có hỗ trợ restore nhiều items cùng lúc không?
- Có hỗ trợ phân quyền không (chỉ user sở hữu item mới restore được)?

### Delete Trash Item
- Item ID
    - Bắt buộc phải có giá trị
    - Phải là số nguyên hợp lệ
    - Item phải tồn tại trong trash
- Type
    - Bắt buộc phải có giá trị
    - Phải là 'file' hoặc 'folder'
    - Phải khớp với type của item trong trash

- Khi xóa thành công, có hiển thị thông báo thành công không?
- Khi xóa thất bại, có hiển thị lý do cụ thể không (item không tồn tại, không có quyền, folder không rỗng)?
- Có dialog xác nhận trước khi xóa vĩnh viễn không?
- Có cảnh báo khi xóa folder không rỗng (có files/folders bên trong) không?
- Sau khi xóa thành công, có tự động refresh danh sách trash không?
- Có hiển thị loading state khi đang xóa không?
- Có hỗ trợ phân quyền không (chỉ user sở hữu item mới xóa được)?

### Empty Trash
- Không có input parameters

- Khi empty trash thành công, có hiển thị thông báo thành công không?
- Response có trả về deleted_count với số lượng files và folders đã xóa không?
- Khi empty trash thất bại, có hiển thị thông báo lỗi không?
- Có dialog xác nhận trước khi empty trash không?
- Có cảnh báo rằng hành động này không thể hoàn tác không?
- Sau khi empty trash thành công, có tự động refresh danh sách trash không?
- Có hiển thị loading state khi đang empty trash không?
- Có hỗ trợ phân quyền không (chỉ user đã đăng nhập mới empty được trash của mình)?

