## Share Management

### Create Share
- Shareable Type
    - Bắt buộc phải có giá trị
    - Phải là 'file' hoặc 'folder'
- Shareable ID
    - Bắt buộc phải có giá trị
    - Phải là số nguyên hợp lệ
    - File/folder phải tồn tại và thuộc quyền sở hữu của user
- User IDs
    - Bắt buộc phải có ít nhất một user ID
    - Phải là mảng số nguyên hợp lệ
    - Mỗi user ID phải tồn tại trong hệ thống
- Permission
    - Bắt buộc phải có giá trị
    - Phải là string hợp lệ (ví dụ: 'view', 'edit')

- Khi tạo share thành công, có hiển thị thông báo thành công không?
- Response có trả về share_created, added_user_ids, updated_user_ids, skipped_user_ids không?
- Khi tạo share thất bại, có hiển thị lý do cụ thể không (file/folder không tồn tại, user không tồn tại, không có quyền)?
- Có hiển thị loading state khi đang tạo không?
- Sau khi tạo share thành công, có tự động refresh danh sách shares không?
- Có hỗ trợ phân quyền không (chỉ user sở hữu file/folder mới share được)?
- Có validate user IDs trước khi gọi API không?

### List Shares
- Page
    - Mặc định page 1
    - Phải là số nguyên dương
- Per Page
    - Mặc định số lượng items mỗi trang
    - Phải là số nguyên dương

- Khi load danh sách shares, có hiển thị loading state không?
- Khi có lỗi xảy ra, có hiển thị thông báo lỗi rõ ràng không?
- Có hiển thị pagination (current_page, total_pages, total_items) không?
- Có hiển thị đầy đủ thông tin không (share_id, shareable_type, shareable_name, shared_with_count, created_at)?
- Khi không có shares, có hiển thị thông báo "No shares found" không?
- Có hỗ trợ phân quyền không (chỉ user đã đăng nhập mới xem được shares của mình)?

### Get Share Detail
- Share ID
    - Bắt buộc phải có giá trị
    - Phải là số nguyên hợp lệ
    - Share phải tồn tại và thuộc quyền sở hữu của user

- Khi share không tồn tại, có hiển thị thông báo lỗi không?
- Khi load share detail, có hiển thị loading state không?
- Có hiển thị đầy đủ thông tin không (share_id, shareable_type, shareable_name, created_at, shared_by, shared_with)?
- Có hiển thị thông tin owner (shared_by: user_id, name) không?
- Có hiển thị danh sách recipients (shared_with: user_id, name, permission) không?
- Khi có lỗi xảy ra, có hiển thị thông báo lỗi rõ ràng không?
- Có hỗ trợ phân quyền không (chỉ owner mới xem được detail)?

### Delete Share
- Share ID
    - Bắt buộc phải có giá trị
    - Phải là số nguyên hợp lệ
    - Share phải tồn tại và thuộc quyền sở hữu của user

- Khi xóa share thành công, có hiển thị thông báo thành công không?
- Khi xóa share thất bại, có hiển thị lý do cụ thể không (share không tồn tại, không có quyền)?
- Có dialog xác nhận trước khi xóa không?
- Sau khi xóa share thành công, có tự động refresh danh sách shares không?
- Có hiển thị loading state khi đang xóa không?
- Có hỗ trợ phân quyền không (chỉ owner mới xóa được)?

### Remove Share User
- Share ID
    - Bắt buộc phải có giá trị
    - Phải là số nguyên hợp lệ
    - Share phải tồn tại và thuộc quyền sở hữu của user
- User ID
    - Bắt buộc phải có giá trị
    - Phải là số nguyên hợp lệ
    - User phải tồn tại và đang trong danh sách shared_with

- Khi remove user thành công, có hiển thị thông báo thành công không?
- Khi remove user thất bại, có hiển thị lý do cụ thể không (share không tồn tại, user không tồn tại, không có quyền)?
- Có dialog xác nhận trước khi remove user không?
- Sau khi remove user thành công, có tự động refresh share detail không?
- Có hiển thị loading state khi đang remove không?
- Có hỗ trợ phân quyền không (chỉ owner mới remove được)?

### Get Received Shares
- Page
    - Mặc định page 1
    - Phải là số nguyên dương
- Per Page
    - Mặc định số lượng items mỗi trang
    - Phải là số nguyên dương

- Khi load received shares, có hiển thị loading state không?
- Khi có lỗi xảy ra, có hiển thị thông báo lỗi rõ ràng không?
- Có hiển thị pagination (current_page, total_pages, total_items) không?
- Có hiển thị đầy đủ thông tin không (share_id, shareable_type, shareable_name, owner, permission, shared_at)?
- Có hiển thị thông tin owner (user_id, name) không?
- Khi không có received shares, có hiển thị thông báo "No received shares" không?
- Có hỗ trợ phân quyền không (chỉ user đã đăng nhập mới xem được)?

