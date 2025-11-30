## User Management

### Chưa implement trong UI chính thức
- Get User Detail - UI hiện tại đang hiển thị thông tin từ list, chưa dùng API `getUserById` để lấy chi tiết đầy đủ
- Get User Storage Usage - UI hiện tại đang hiển thị storage usage từ list, chưa dùng API `getUserStorageUsage` để lấy thông tin chi tiết

### List Users
- Search
    - Có thể để trống
    - Tìm kiếm theo tên hoặc email
- Page
    - Mặc định page 1
    - Phải là số nguyên dương
- Per Page
    - Mặc định số lượng users mỗi trang
    - Phải là số nguyên dương

- Khi load danh sách users, có hiển thị loading state không?
- Khi có lỗi xảy ra, có hiển thị thông báo lỗi rõ ràng không?
- Có hiển thị pagination (current_page, per_page, total_pages, total_items) không?
- Có hiển thị đầy đủ thông tin không (user_id, name, email, role, storage_limit, storage_used)?
- Có hỗ trợ infinite scroll không?
- Khi search, có debounce để tránh gọi API quá nhiều không?
- Khi không có users, có hiển thị thông báo "No users found" không?
- Có hỗ trợ phân quyền không (chỉ admin mới xem được danh sách users)?
- Có hỗ trợ sort theo các cột không (name, email, role)?

### Create User
- Name
    - Bắt buộc phải có giá trị
    - Tối thiểu 1 ký tự
    - Không được chỉ chứa số
- Email
    - Bắt buộc phải có giá trị
    - Email phải đúng định dạng
    - Email phải unique (chưa tồn tại trong hệ thống)
- Password
    - Bắt buộc phải có giá trị
    - Tối thiểu 8 ký tự
- Role
    - Bắt buộc phải có giá trị
    - Phải là 'user' hoặc 'admin'
    - Mặc định là 'user'

- Khi tạo user thành công, có hiển thị thông báo thành công không?
- Response có trả về user mới tạo với đầy đủ thông tin không?
- Khi tạo user thất bại, có hiển thị lý do cụ thể không (email đã tồn tại, validation lỗi)?
- Sau khi tạo thành công, có tự động refresh danh sách users không?
- Có hiển thị loading state khi đang tạo không?
- Có hỗ trợ phân quyền không (chỉ admin mới tạo được user)?
- Có validate password mạnh không (tối thiểu 8 ký tự, có chữ cái, số, ký tự đặc biệt)?

### Update User
- User ID
    - Bắt buộc phải có giá trị
    - Phải là số nguyên hợp lệ
    - User phải tồn tại trong hệ thống
- Name
    - Có thể để trống (optional)
    - Nếu có giá trị, tối thiểu 1 ký tự
    - Không được chỉ chứa số
- Storage Limit
    - Có thể để trống (optional)
    - Nếu có giá trị, phải là số nguyên không âm
    - Đơn vị là bytes

- Khi cập nhật user thành công, có hiển thị thông báo thành công không?
- Response có trả về user đã cập nhật với đầy đủ thông tin không?
- Khi cập nhật user thất bại, có hiển thị lý do cụ thể không (user không tồn tại, validation lỗi)?
- Sau khi cập nhật thành công, có tự động refresh danh sách users không?
- Có hiển thị loading state khi đang cập nhật không?
- Có hỗ trợ phân quyền không (chỉ admin mới cập nhật được user)?
- Email có được phép cập nhật không (hiện tại API không hỗ trợ cập nhật email)?

### Delete User
- User ID
    - Bắt buộc phải có giá trị
    - Phải là số nguyên hợp lệ
    - User phải tồn tại trong hệ thống

- Khi xóa user thành công, có hiển thị thông báo thành công không?
- Response có trả về message xác nhận không?
- Khi xóa user thất bại, có hiển thị lý do cụ thể không (user không tồn tại, không có quyền)?
- Có dialog xác nhận trước khi xóa không?
- Có cảnh báo khi xóa user đang có dữ liệu (files, folders) không?
- Sau khi xóa thành công, có tự động refresh danh sách users không?
- Có hiển thị loading state khi đang xóa không?
- Có hỗ trợ xóa nhiều users cùng lúc không?
- Có hỗ trợ phân quyền không (chỉ admin mới xóa được user)?
- Có ngăn xóa chính user đang đăng nhập không?

### Get User Detail
- User ID
    - Bắt buộc phải có giá trị
    - Phải là số nguyên hợp lệ
    - User phải tồn tại trong hệ thống

- Khi load user detail, có hiển thị loading state không?
- Khi có lỗi xảy ra, có hiển thị thông báo lỗi rõ ràng không?
- Có hiển thị đầy đủ thông tin user không (user_id, name, email, role, storage_limit, storage_used)?
- Có hiển thị thông tin bổ sung không (created_at, updated_at)?
- Khi user không tồn tại, có hiển thị thông báo "User not found" không?
- Có hỗ trợ phân quyền không (chỉ admin mới xem được chi tiết user)?

### Update User Role
- User ID
    - Bắt buộc phải có giá trị
    - Phải là số nguyên hợp lệ
    - User phải tồn tại trong hệ thống
- Role
    - Bắt buộc phải có giá trị
    - Phải là 'user' hoặc 'admin'

- Khi cập nhật role thành công, có hiển thị thông báo thành công không?
- Response có trả về user đã cập nhật role không?
- Khi cập nhật role thất bại, có hiển thị lý do cụ thể không (user không tồn tại, không có quyền)?
- Sau khi cập nhật thành công, có tự động refresh danh sách users không?
- Có hiển thị loading state khi đang cập nhật không?
- Có hỗ trợ phân quyền không (chỉ admin mới cập nhật được role)?
- Có ngăn cập nhật role của chính user đang đăng nhập không?
- Có cảnh báo khi thay đổi role từ admin sang user không?

### Get User Storage Usage
- User ID
    - Bắt buộc phải có giá trị
    - Phải là số nguyên hợp lệ
    - User phải tồn tại trong hệ thống

- Khi load storage usage, có hiển thị loading state không?
- Khi có lỗi xảy ra, có hiển thị thông báo lỗi rõ ràng không?
- Có hiển thị đầy đủ thông tin không (user_id, storage_used, storage_limit, usage_percent)?
- Có hiển thị storage usage dưới dạng progress bar không?
- Có hiển thị storage usage với đơn vị phù hợp không (GB, MB, bytes)?
- Khi user không tồn tại, có hiển thị thông báo "User not found" không?
- Có hỗ trợ phân quyền không (chỉ admin mới xem được storage usage của user khác)?

