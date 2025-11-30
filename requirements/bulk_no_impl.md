## Bulk Operations

### Bulk Copy
- File IDs
    - Phải là mảng số nguyên hợp lệ
    - Có thể để trống nếu chỉ copy folders
    - Mỗi ID phải tồn tại và thuộc quyền sở hữu của user
- Folder IDs
    - Phải là mảng số nguyên hợp lệ
    - Có thể để trống nếu chỉ copy files
    - Mỗi ID phải tồn tại và thuộc quyền sở hữu của user
- Destination Folder ID
    - Có thể là null (copy vào root)
    - Nếu có giá trị, phải là số nguyên hợp lệ
    - Không được copy folder vào chính nó hoặc vào folder con của nó

- Khi copy thành công, có hiển thị thông báo rõ ràng không?
- Khi copy thất bại, có hiển thị lý do cụ thể không (file/folder không tồn tại, không có quyền, destination không hợp lệ)?
- Khi copy một phần thành công một phần thất bại, có hiển thị chi tiết từng item không?
- Response có trả về original_id và new_id của các items đã copy không?
- UI có cập nhật danh sách files sau khi copy thành công không?

### Bulk Delete
- File IDs
    - Phải là mảng số nguyên hợp lệ
    - Có thể để trống nếu chỉ xóa folders
    - Mỗi ID phải tồn tại và thuộc quyền sở hữu của user
- Folder IDs
    - Phải là mảng số nguyên hợp lệ
    - Có thể để trống nếu chỉ xóa files
    - Mỗi ID phải tồn tại và thuộc quyền sở hữu của user

- Khi xóa thành công, có hiển thị thông báo rõ ràng không?
- Khi xóa thất bại, có hiển thị lý do cụ thể không (file/folder không tồn tại, không có quyền, đã bị xóa rồi)?
- Response có trả về chi tiết các trạng thái không (requested, found, not_found, not_owned, already_deleted, deleted)?
- Khi xóa folder, có hiển thị số lượng files bên trong folder cũng bị xóa không?
- Khi xóa một phần thành công một phần thất bại, có hiển thị chi tiết từng item không?
- Items bị xóa có được chuyển vào trash không?
- UI có cập nhật danh sách files sau khi xóa thành công không?
- Có dialog xác nhận trước khi xóa không?

### Bulk Move
- File IDs
    - Phải là mảng số nguyên hợp lệ
    - Có thể để trống nếu chỉ move folders
    - Mỗi ID phải tồn tại và thuộc quyền sở hữu của user
- Folder IDs
    - Phải là mảng số nguyên hợp lệ
    - Có thể để trống nếu chỉ move files
    - Mỗi ID phải tồn tại và thuộc quyền sở hữu của user
- Destination Folder ID
    - Bắt buộc phải có giá trị (không được null)
    - Phải là số nguyên hợp lệ
    - Phải tồn tại và thuộc quyền sở hữu của user
    - Không được move folder vào chính nó hoặc vào folder con của nó

- Khi move thành công, có hiển thị thông báo rõ ràng không?
- Khi move thất bại, có hiển thị lý do cụ thể không (file/folder không tồn tại, không có quyền, destination không hợp lệ)?
- Khi move một phần thành công một phần thất bại, có hiển thị chi tiết từng item không?
- Response có trả về danh sách files và folders đã move thành công không?
- UI có cập nhật danh sách files sau khi move thành công không?
- Có hiển thị progress bar khi đang xử lý nhiều items không?

