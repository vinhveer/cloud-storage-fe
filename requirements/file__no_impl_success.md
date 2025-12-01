## File Management

### Chưa implement trong UI chính thức
- List Files - Chỉ có trong test pages, chưa có UI chính thức để list files với pagination, search, filter
- Get File Preview - Chỉ có trong test pages, chưa có UI để preview file
- Delete File Version - Chỉ có trong test pages, chưa có UI để xóa version cụ thể của file

### Upload File
- File
    - Bắt buộc phải chọn file
    - File phải hợp lệ (không bị corrupt)
    - File size phải trong giới hạn cho phép
- Folder ID
    - Có thể để trống (upload vào root)
    - Nếu có giá trị, phải là số nguyên hợp lệ
    - Folder phải tồn tại và thuộc quyền sở hữu của user

- Khi upload thành công, có hiển thị thông báo thành công không?
- Khi upload thất bại, có hiển thị lý do cụ thể không (file quá lớn, folder không tồn tại, không có quyền)?
- Có hiển thị progress bar khi đang upload không?
- Có hỗ trợ upload nhiều files cùng lúc không?
- Sau khi upload thành công, có tự động refresh danh sách files không?
- Có validate file size trước khi upload không?
- Có hỗ trợ drag and drop để upload không?

### List Files
- Folder ID
    - Có thể để trống (lấy files ở root)
    - Nếu có giá trị, phải là số nguyên hợp lệ
- Search
    - Có thể để trống
    - Tìm kiếm theo display_name
- Extension
    - Có thể để trống
    - Filter theo file extension
- Page
    - Mặc định page 1
    - Phải là số nguyên dương
- Per Page
    - Mặc định số lượng items mỗi trang
    - Phải là số nguyên dương

- Khi load danh sách files, có hiển thị loading state không?
- Khi có lỗi xảy ra, có hiển thị thông báo lỗi rõ ràng không?
- Có hiển thị pagination (current_page, total_pages, total_items) không?
- Khi search, có debounce để tránh gọi API quá nhiều không?
- Khi không có kết quả, có hiển thị thông báo "No files found" không?
- Có hiển thị đầy đủ thông tin file không (file_id, display_name, file_size, mime_type, file_extension, folder_id, user_id, is_deleted, created_at)?

### Get File Detail
- File ID
    - Bắt buộc phải có giá trị
    - Phải là số nguyên hợp lệ
    - File phải tồn tại và thuộc quyền sở hữu của user

- Khi file không tồn tại, có hiển thị thông báo lỗi không?
- Khi load file detail, có hiển thị loading state không?
- Có hiển thị đầy đủ thông tin không (file_id, display_name, file_size, mime_type, file_extension, folder_id, user_id, is_deleted, created_at, last_opened_at)?
- Khi có lỗi xảy ra, có hiển thị thông báo lỗi rõ ràng không?
- Có hỗ trợ phân quyền không (chỉ user sở hữu file mới xem được)?

### Download File
- File ID
    - Bắt buộc phải có giá trị
    - Phải là số nguyên hợp lệ
    - File phải tồn tại và thuộc quyền sở hữu của user

- Khi download thành công, có tự động tải file về không?
- Khi download thất bại, có hiển thị thông báo lỗi không?
- Có hiển thị loading state khi đang download không?
- Có hỗ trợ download nhiều files cùng lúc không?
- File name khi download có giữ nguyên tên gốc không?

### Update File
- File ID
    - Bắt buộc phải có giá trị
    - Phải là số nguyên hợp lệ
    - File phải tồn tại và thuộc quyền sở hữu của user
- Display Name
    - Có thể để trống (không đổi tên)
    - Nếu có giá trị, phải là string hợp lệ
    - Tên không được trùng với file khác trong cùng folder
- Folder ID
    - Có thể để trống (không đổi folder)
    - Nếu có giá trị, phải là số nguyên hợp lệ
    - Folder phải tồn tại và thuộc quyền sở hữu của user

- Khi cập nhật thành công, có hiển thị thông báo thành công không?
- Khi cập nhật thất bại, có hiển thị lý do cụ thể không (file không tồn tại, tên trùng, folder không hợp lệ)?
- Sau khi cập nhật thành công, có tự động refresh danh sách files không?
- Có hiển thị loading state khi đang cập nhật không?
- Có hỗ trợ phân quyền không (chỉ user sở hữu file mới cập nhật được)?

### Delete File
- File ID
    - Bắt buộc phải có giá trị
    - Phải là số nguyên hợp lệ
    - File phải tồn tại và thuộc quyền sở hữu của user

- Khi xóa thành công, có hiển thị thông báo thành công không?
- Khi xóa thất bại, có hiển thị lý do cụ thể không (file không tồn tại, không có quyền)?
- Có dialog xác nhận trước khi xóa không?
- File bị xóa có được chuyển vào trash không?
- Sau khi xóa thành công, có tự động refresh danh sách files không?
- Có hiển thị loading state khi đang xóa không?
- Có hỗ trợ phân quyền không (chỉ user sở hữu file mới xóa được)?

### Move File
- File ID
    - Bắt buộc phải có giá trị
    - Phải là số nguyên hợp lệ
    - File phải tồn tại và thuộc quyền sở hữu của user
- Destination Folder ID
    - Có thể để trống (move về root)
    - Nếu có giá trị, phải là số nguyên hợp lệ
    - Folder phải tồn tại và thuộc quyền sở hữu của user
    - Không được move file vào chính folder hiện tại của nó

- Khi move thành công, có hiển thị thông báo thành công không?
- Khi move thất bại, có hiển thị lý do cụ thể không (file không tồn tại, folder không hợp lệ, không có quyền)?
- Sau khi move thành công, có tự động refresh danh sách files không?
- Có hiển thị loading state khi đang move không?
- Có hỗ trợ phân quyền không (chỉ user sở hữu file mới move được)?

### Copy File
- File ID
    - Bắt buộc phải có giá trị
    - Phải là số nguyên hợp lệ
    - File phải tồn tại và thuộc quyền sở hữu của user
- Destination Folder ID
    - Có thể để trống (copy vào root)
    - Nếu có giá trị, phải là số nguyên hợp lệ
    - Folder phải tồn tại và thuộc quyền sở hữu của user
- Only Latest
    - Mặc định true
    - Nếu true, chỉ copy version mới nhất
    - Nếu false, copy tất cả versions

- Khi copy thành công, có hiển thị thông báo thành công không?
- Khi copy thất bại, có hiển thị lý do cụ thể không (file không tồn tại, folder không hợp lệ, không có quyền)?
- Response có trả về new_file với file_id mới không?
- Sau khi copy thành công, có tự động refresh danh sách files không?
- Có hiển thị loading state khi đang copy không?
- Có hỗ trợ phân quyền không (chỉ user sở hữu file mới copy được)?

### Get Recent Files
- Limit
    - Có thể để trống (lấy tất cả)
    - Nếu có giá trị, phải là số nguyên dương
    - Giới hạn số lượng files trả về

- Khi load recent files, có hiển thị loading state không?
- Khi có lỗi xảy ra, có hiển thị thông báo lỗi rõ ràng không?
- Có hiển thị đầy đủ thông tin không (file_id, display_name, last_opened_at)?
- Khi không có recent files, có hiển thị thông báo "No recent files" không?
- Files có được sắp xếp theo last_opened_at giảm dần không?

### Get File Preview
- File ID
    - Bắt buộc phải có giá trị
    - Phải là số nguyên hợp lệ
    - File phải tồn tại và thuộc quyền sở hữu của user

- Khi file không tồn tại, có hiển thị thông báo lỗi không?
- Khi load preview, có hiển thị loading state không?
- Response có trả về preview_url và expires_in không?
- Preview URL có hợp lệ và có thể truy cập được không?
- Có hiển thị preview trong iframe hoặc modal không?
- Khi preview URL hết hạn, có tự động refresh không?
- Có hỗ trợ phân quyền không (chỉ user sở hữu file mới xem được)?

### Delete File Version
- File ID
    - Bắt buộc phải có giá trị
    - Phải là số nguyên hợp lệ
    - File phải tồn tại và thuộc quyền sở hữu của user
- Version ID
    - Bắt buộc phải có giá trị
    - Phải là số nguyên hợp lệ
    - Version phải tồn tại và thuộc về file

- Khi xóa version thành công, có hiển thị thông báo thành công không?
- Khi xóa version thất bại, có hiển thị lý do cụ thể không (version không tồn tại, không có quyền)?
- Có dialog xác nhận trước khi xóa version không?
- Sau khi xóa version thành công, có tự động refresh danh sách versions không?
- Có hiển thị loading state khi đang xóa không?
- Có hỗ trợ phân quyền không (chỉ user sở hữu file mới xóa được)?
- Có cho phép xóa version mới nhất không?

