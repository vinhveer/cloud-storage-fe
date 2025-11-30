## Folder Management

### Chưa implement trong UI chính thức
- Create Folder - Chỉ có trong test pages, chưa có UI chính thức để tạo folder mới
- List Folders - Chỉ có trong test pages, chưa có UI chính thức để list folders với pagination
- Get Folder Detail - Chỉ có trong test pages, chưa có UI chính thức để xem chi tiết folder

### Create Folder
- Folder Name
    - Bắt buộc phải có giá trị
    - Phải là string không rỗng
    - Tên không được trùng với folder khác trong cùng parent folder
- Parent Folder ID
    - Có thể để trống (tạo ở root)
    - Nếu có giá trị, phải là số nguyên hợp lệ
    - Folder phải tồn tại và thuộc quyền sở hữu của user

- Khi tạo folder thành công, có hiển thị thông báo thành công không?
- Khi tạo folder thất bại, có hiển thị lý do cụ thể không (tên trùng, parent folder không tồn tại, không có quyền)?
- Response có trả về folder mới với folder_id không?
- Sau khi tạo folder thành công, có tự động refresh danh sách folders không?
- Có hiển thị loading state khi đang tạo không?
- Có hỗ trợ phân quyền không (chỉ user đã đăng nhập mới tạo được)?

### List Folders
- Parent ID
    - Có thể để trống (lấy folders ở root)
    - Nếu có giá trị, phải là số nguyên hợp lệ
- Page
    - Mặc định page 1
    - Phải là số nguyên dương
- Per Page
    - Mặc định số lượng items mỗi trang
    - Phải là số nguyên dương

- Khi load danh sách folders, có hiển thị loading state không?
- Khi có lỗi xảy ra, có hiển thị thông báo lỗi rõ ràng không?
- Có hiển thị pagination (current_page, total_pages, total_items) không?
- Khi không có kết quả, có hiển thị thông báo "No folders found" không?
- Có hiển thị đầy đủ thông tin không (folder_id, folder_name, fol_folder_id, created_at)?

### Get Folder Detail
- Folder ID
    - Bắt buộc phải có giá trị
    - Phải là số nguyên hợp lệ
    - Folder phải tồn tại và thuộc quyền sở hữu của user

- Khi folder không tồn tại, có hiển thị thông báo lỗi không?
- Khi load folder detail, có hiển thị loading state không?
- Có hiển thị đầy đủ thông tin không (folder_id, folder_name, fol_folder_id, user_id, created_at, is_deleted, deleted_at)?
- Khi có lỗi xảy ra, có hiển thị thông báo lỗi rõ ràng không?
- Có hỗ trợ phân quyền không (chỉ user sở hữu folder mới xem được)?

### Get Folder Contents
- Folder ID
    - Bắt buộc phải có giá trị
    - Phải là số nguyên hợp lệ (0 = root)
    - Folder phải tồn tại và thuộc quyền sở hữu của user

- Khi load folder contents, có hiển thị loading state không?
- Khi có lỗi xảy ra, có hiển thị thông báo lỗi rõ ràng không?
- Có hiển thị đầy đủ thông tin folders và files không?
- Folders có hiển thị (folder_id, folder_name, created_at) không?
- Files có hiển thị (file_id, display_name, file_size, mime_type, file_extension, last_opened_at) không?
- Khi folder rỗng, có hiển thị thông báo "Folder is empty" không?
- Có hỗ trợ phân quyền không (chỉ user sở hữu folder mới xem được)?

### Get Folder Breadcrumb
- Folder ID
    - Bắt buộc phải có giá trị
    - Phải là số nguyên hợp lệ
    - Folder phải tồn tại và thuộc quyền sở hữu của user

- Khi load breadcrumb, có hiển thị loading state không?
- Khi có lỗi xảy ra, có hiển thị thông báo lỗi rõ ràng không?
- Breadcrumb có được sắp xếp từ root đến folder hiện tại không?
- Có hiển thị đầy đủ thông tin không (folder_id, folder_name) cho mỗi item?
- Có hỗ trợ phân quyền không (chỉ user sở hữu folder mới xem được)?

### Get Folder Tree
- Không có input parameters

- Khi load folder tree, có hiển thị loading state không?
- Khi có lỗi xảy ra, có hiển thị thông báo lỗi rõ ràng không?
- Tree có được hiển thị dạng nested structure không?
- Có hiển thị đầy đủ thông tin không (folder_id, folder_name, children) cho mỗi node?
- Có hỗ trợ phân quyền không (chỉ user đã đăng nhập mới xem được)?

### Update Folder
- Folder ID
    - Bắt buộc phải có giá trị
    - Phải là số nguyên hợp lệ
    - Folder phải tồn tại và thuộc quyền sở hữu của user
- Folder Name
    - Bắt buộc phải có giá trị
    - Phải là string không rỗng
    - Tên không được trùng với folder khác trong cùng parent folder

- Khi cập nhật thành công, có hiển thị thông báo thành công không?
- Khi cập nhật thất bại, có hiển thị lý do cụ thể không (folder không tồn tại, tên trùng, không có quyền)?
- Sau khi cập nhật thành công, có tự động refresh danh sách folders không?
- Có hiển thị loading state khi đang cập nhật không?
- Có hỗ trợ phân quyền không (chỉ user sở hữu folder mới cập nhật được)?

### Delete Folder
- Folder ID
    - Bắt buộc phải có giá trị
    - Phải là số nguyên hợp lệ
    - Folder phải tồn tại và thuộc quyền sở hữu của user

- Khi xóa thành công, có hiển thị thông báo thành công không?
- Khi xóa thất bại, có hiển thị lý do cụ thể không (folder không tồn tại, không có quyền, folder không rỗng)?
- Có dialog xác nhận trước khi xóa không?
- Folder bị xóa có được chuyển vào trash không?
- Có cảnh báo khi folder không rỗng (có files/folders bên trong) không?
- Sau khi xóa thành công, có tự động refresh danh sách folders không?
- Có hiển thị loading state khi đang xóa không?
- Có hỗ trợ phân quyền không (chỉ user sở hữu folder mới xóa được)?

### Move Folder
- Folder ID
    - Bắt buộc phải có giá trị
    - Phải là số nguyên hợp lệ
    - Folder phải tồn tại và thuộc quyền sở hữu của user
- Target Folder ID
    - Có thể để trống (move về root)
    - Nếu có giá trị, phải là số nguyên hợp lệ
    - Folder phải tồn tại và thuộc quyền sở hữu của user
    - Không được move folder vào chính nó hoặc vào folder con của nó

- Khi move thành công, có hiển thị thông báo thành công không?
- Khi move thất bại, có hiển thị lý do cụ thể không (folder không tồn tại, target folder không hợp lệ, không có quyền)?
- Sau khi move thành công, có tự động refresh danh sách folders không?
- Có hiển thị loading state khi đang move không?
- Có hỗ trợ phân quyền không (chỉ user sở hữu folder mới move được)?

### Copy Folder
- Folder ID
    - Bắt buộc phải có giá trị
    - Phải là số nguyên hợp lệ
    - Folder phải tồn tại và thuộc quyền sở hữu của user
- Target Folder ID
    - Có thể để trống (copy vào root)
    - Nếu có giá trị, phải là số nguyên hợp lệ
    - Folder phải tồn tại và thuộc quyền sở hữu của user

- Khi copy thành công, có hiển thị thông báo thành công không?
- Khi copy thất bại, có hiển thị lý do cụ thể không (folder không tồn tại, target folder không hợp lệ, không có quyền)?
- Response có trả về new_folder_id không?
- Có copy recursive (copy cả files và folders bên trong) không?
- Sau khi copy thành công, có tự động refresh danh sách folders không?
- Có hiển thị loading state khi đang copy không?
- Có hỗ trợ phân quyền không (chỉ user sở hữu folder mới copy được)?

