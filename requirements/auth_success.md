## Auth

### Register
- Full Name
    - Không được nhập chỉ số
    - Tên không quá dài
    - Tên không được bỏ trống
- Email
    - Email phải đúng định dạng
- Password và Confirm Password
    - Tối thiểu 8 ký tự, tối đa 16 ký tự
    - Phải có ít nhất 1 chữ cái
    - Phải có ít nhất 1 số
    - Phải có ít nhất 1 ký tự đặc biệt
    - Confirm Password phải khớp với Password

- Trường hợp tạo tài khoản thành công và không thành công, thông báo có rõ ràng không?
- Sau khi đăng ký thành công, có chuyển đến trang verify email không?

### Login
- Email
    - Email phải đúng định dạng
- Password
    - Tối thiểu 8 ký tự, tối đa 16 ký tự
    - Phải có ít nhất 1 chữ cái
    - Phải có ít nhất 1 số
    - Phải có ít nhất 1 ký tự đặc biệt
- Device Name
    - Có thể để trống (optional)

- Khi sai email hoặc mật khẩu, hiện thông báo có rõ ràng không?
- Khi email chưa được xác thực, có chuyển đến trang verify email không?
- Sau khi đăng nhập thành công, có lưu email vào sessionStorage không?

### Logout
- Khi bấm vào thì nó có đăng xuất không, token có còn trong máy không
- Khi token sai hoặc không tồn tại, logout có xử lý đúng không (Tức là đăng xuất và về trang chủ)

### Logout All
- Khi logout all, có đăng xuất tất cả các thiết bị không
- Token có được xóa khỏi máy không
- Có hiển thị thông báo thành công/thất bại không

### Get Profile
- Thông tin người dùng có được lấy ra đầy đủ, chính xác không

### Resend Verification Email
- Email
    - Email phải đúng định dạng
    - Email có thể tự động lấy từ query params hoặc sessionStorage

- Email xác thực có được gửi đến người dùng không
- Khi vào trang verify email, có tự động gửi email xác thực một lần không
- Khi bấm resend, có hiển thị thông báo thành công/thất bại không
- Có thể resend nhiều lần không

### Verify Email (Click Link)
- Khi click vào link xác thực trong email, có hiển thị trang kết quả không
- Trang kết quả có hiển thị thành công/thất bại rõ ràng không
- Có link để quay về trang login không
- Khi xác thực thành công, có tự động chuyển về trang login không

### Forgot Password
- Email
    - Email phải đúng định dạng

- Email reset password có được gửi đến người dùng không
- Khi gửi email thành công/thất bại, có hiển thị thông báo rõ ràng không
- Link reset password có chứa token và email trong query params không

### Reset Password
- Email
    - Email phải đúng định dạng
    - Email lấy từ query params
- Token
    - Token lấy từ query params
    - Token phải hợp lệ và chưa hết hạn
- Password và Confirm Password
    - Tối thiểu 8 ký tự, tối đa 16 ký tự
    - Phải có ít nhất 1 chữ cái
    - Phải có ít nhất 1 số
    - Phải có ít nhất 1 ký tự đặc biệt
    - Confirm Password phải khớp với Password

- Khi token hoặc email không hợp lệ, có hiển thị thông báo lỗi không
- Nếu mật khẩu trùng với mật khẩu cũ thì sao
- Nếu đặt lại mật khẩu thất bại / thành công thì sao
- Sau khi reset thành công, có tự động chuyển về trang login không

### Update Profile
- Full Name
    - Không được nhập chỉ số
    - Tên không quá dài
    - Tên không được bỏ trống
- Email
    - Email phải đúng định dạng
    - Email có thể thay đổi được

- Khi cập nhật profile thành công/thất bại, có hiển thị thông báo rõ ràng không
- Thông tin profile có được cập nhật ngay lập tức trên UI không

### Change Password
- Current Password
    - Phải khớp với mật khẩu hiện tại
    - Không được để trống
- New Password và Confirm Password
    - Tối thiểu 8 ký tự, tối đa 16 ký tự
    - Phải có ít nhất 1 chữ cái
    - Phải có ít nhất 1 số
    - Phải có ít nhất 1 ký tự đặc biệt
    - Confirm Password phải khớp với New Password

- Khi nhập sai current password, có hiển thị thông báo lỗi không
- Nếu mật khẩu mới trùng với mật khẩu cũ thì sao
- Nếu đổi mật khẩu thất bại / thành công thì sao
- Sau khi đổi mật khẩu thành công, có yêu cầu đăng nhập lại không
