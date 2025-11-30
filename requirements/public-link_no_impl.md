## Public Link Management

### Chưa implement trong UI chính thức
- Create Public Link - Chỉ có trong test pages, chưa có UI chính thức để tạo public link cho file/folder
- List Public Links - Chỉ có trong test pages, chưa có UI chính thức để xem danh sách public links của user
- Get Public Link Detail - Chỉ có trong test pages, chưa có UI chính thức để xem chi tiết một public link
- Update Public Link - Chỉ có trong test pages, chưa có UI chính thức để cập nhật permission hoặc expired_at
- Revoke Public Link - Chỉ có trong test pages, chưa có UI chính thức để revoke public link
- Get Public Link Preview - Chỉ có trong test pages, chưa có UI chính thức để preview file qua public link
- Get Public Link Download - Chỉ có trong test pages, chưa có UI chính thức để download file qua public link
- Get File Public Links - Chỉ có trong test pages, chưa có UI chính thức để xem tất cả public links của một file

### Create Public Link
- Shareable Type
    - Bắt buộc phải có giá trị
    - Phải là 'file' hoặc 'folder'
- Shareable ID
    - Bắt buộc phải có giá trị
    - Phải là số nguyên hoặc string hợp lệ
    - File/folder phải tồn tại và thuộc quyền sở hữu của user
- Permission
    - Bắt buộc phải có giá trị
    - Phải là string hợp lệ (ví dụ: 'view', 'edit', 'download')
- Expired At
    - Có thể để trống (không hết hạn)
    - Nếu có giá trị, phải là định dạng datetime hợp lệ
    - Phải lớn hơn thời điểm hiện tại

- Khi tạo public link thành công, có hiển thị thông báo thành công không?
- Response có trả về public_link với token và url không?
- URL có thể copy được không?
- Khi tạo public link thất bại, có hiển thị lý do cụ thể không (file/folder không tồn tại, không có quyền)?
- Có hiển thị loading state khi đang tạo không?
- Có hỗ trợ phân quyền không (chỉ user sở hữu file/folder mới tạo được)?

### List Public Links
- Page
    - Mặc định page 1
    - Phải là số nguyên dương
- Per Page
    - Mặc định số lượng items mỗi trang
    - Phải là số nguyên dương

- Khi load danh sách public links, có hiển thị loading state không?
- Khi có lỗi xảy ra, có hiển thị thông báo lỗi rõ ràng không?
- Có hiển thị pagination (current_page, total_pages, total_items) không?
- Có hiển thị đầy đủ thông tin không (public_link_id, shareable_type, shareable_name, permission, token, url, expired_at, revoked_at, created_at)?
- Có đánh dấu link nào đã expired hoặc revoked không?
- Khi không có public links, có hiển thị thông báo "No public links found" không?
- Có hỗ trợ phân quyền không (chỉ user đã đăng nhập mới xem được)?

### Get Public Link Detail
- Token
    - Bắt buộc phải có giá trị
    - Phải là string hợp lệ
    - Public link phải tồn tại và chưa bị revoked

- Khi public link không tồn tại hoặc đã revoked, có hiển thị thông báo lỗi không?
- Khi load public link detail, có hiển thị loading state không?
- Có hiển thị đầy đủ thông tin không (public_link_id, shareable_type, shareable_name, permission, token, expired_at, revoked_at, created_at, owner)?
- Có hiển thị thông tin owner (user_id, name) không?
- Khi có lỗi xảy ra, có hiển thị thông báo lỗi rõ ràng không?
- Có hỗ trợ phân quyền không (chỉ owner mới xem được detail)?

### Update Public Link
- Public Link ID
    - Bắt buộc phải có giá trị
    - Phải là số nguyên hợp lệ
    - Public link phải tồn tại và thuộc quyền sở hữu của user
- Permission
    - Có thể để trống (không đổi permission)
    - Nếu có giá trị, phải là string hợp lệ
- Expired At
    - Có thể để trống (không đổi expired_at)
    - Có thể là null (xóa expired_at)
    - Nếu có giá trị, phải là định dạng datetime hợp lệ
    - Phải lớn hơn thời điểm hiện tại

- Khi cập nhật thành công, có hiển thị thông báo thành công không?
- Khi cập nhật thất bại, có hiển thị lý do cụ thể không (public link không tồn tại, không có quyền)?
- Response có trả về public_link đã cập nhật không?
- Sau khi cập nhật thành công, có tự động refresh danh sách public links không?
- Có hiển thị loading state khi đang cập nhật không?
- Có hỗ trợ phân quyền không (chỉ owner mới cập nhật được)?

### Revoke Public Link
- Public Link ID
    - Bắt buộc phải có giá trị
    - Phải là số nguyên hợp lệ
    - Public link phải tồn tại và thuộc quyền sở hữu của user

- Khi revoke thành công, có hiển thị thông báo thành công không?
- Khi revoke thất bại, có hiển thị lý do cụ thể không (public link không tồn tại, không có quyền)?
- Có dialog xác nhận trước khi revoke không?
- Sau khi revoke thành công, có tự động refresh danh sách public links không?
- Có hiển thị loading state khi đang revoke không?
- Có hỗ trợ phân quyền không (chỉ owner mới revoke được)?

### Get Public Link Preview
- Token
    - Bắt buộc phải có giá trị
    - Phải là string hợp lệ
    - Public link phải tồn tại, chưa expired, chưa revoked và có permission 'view'

- Khi public link không hợp lệ, có hiển thị thông báo lỗi không?
- Khi load preview, có hiển thị loading state không?
- Response có trả về file info (file_id, display_name, mime_type, size, url) không?
- Preview URL có hợp lệ và có thể truy cập được không?
- Có hiển thị preview trong iframe hoặc modal không?
- Có hỗ trợ preview cho các loại file khác nhau không (image, pdf, text)?
- Có kiểm tra permission 'view' không?

### Get Public Link Download
- Token
    - Bắt buộc phải có giá trị
    - Phải là string hợp lệ
    - Public link phải tồn tại, chưa expired, chưa revoked và có permission 'download'

- Khi public link không hợp lệ, có hiển thị thông báo lỗi không?
- Khi load download URL, có hiển thị loading state không?
- Response có trả về download_url không?
- Download URL có hợp lệ và có thể truy cập được không?
- Có tự động redirect đến download URL không?
- Có kiểm tra permission 'download' không?

### Get File Public Links
- File ID
    - Bắt buộc phải có giá trị
    - Phải là số nguyên hợp lệ
    - File phải tồn tại và thuộc quyền sở hữu của user

- Khi file không tồn tại, có hiển thị thông báo lỗi không?
- Khi load file public links, có hiển thị loading state không?
- Response có trả về file_id, file_name và danh sách public_links không?
- Có hiển thị đầy đủ thông tin mỗi public link không (public_link_id, permission, token, url, expired_at, revoked_at)?
- Có đánh dấu link nào đã expired hoặc revoked không?
- Khi file không có public links, có hiển thị thông báo "No public links" không?
- Có hỗ trợ phân quyền không (chỉ user sở hữu file mới xem được)?

