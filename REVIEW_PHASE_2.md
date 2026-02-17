# Phase 2: User Dashboard Review

**Trạng thái:** ✅ Đã hoàn thành
**Mục tiêu:** Cung cấp trang quản lý cá nhân cho cả chủ giải (Organizer) và vận động viên (Participant).

## 1. Các thay đổi đã thực hiện

### Dashboard Shell (`app/dashboard/*`)
- [x] **New Layout** (`app/dashboard/layout.tsx`):
    - Thanh điều hướng bên trái (Sidebar) cố định.
    - Hiển thị Avatar và tên người dùng (lấy từ Supabase Auth).
    - Links điều hướng: Tổng quan, Giải của tôi, Giải đã tham gia, Hồ sơ.
    - Nút Đăng xuất.
- [x] **Overview Page** (`app/dashboard/page.tsx`):
    - Hiển thị thống kê nhanh (Số giải đã tạo, Số giải tham gia).
    - Layout mẫu cho các hoạt động gần đây và lịch thi đấu sắp tới.

### Organizer View (`app/dashboard/hosted/*`)
- [x] **Server Action**: `getHostedTournaments(userId)`
    - Lấy danh sách giải đấu do user hiện tại tạo (`creatorId`).
    - Bao gồm số lượng người đăng ký (`_count.registrations`).
- [x] **Component**: `HostedTournamentCard`
    - Hiển thị Banner, Tên giải, Ngày bắt đầu, Địa điểm.
    - Badge trạng thái (Đang mở đăng ký, Đã xác nhận, ...).
    - Nút "Quản Lý" (Link tới `/tournaments/[id]`).

### Participant View (`app/dashboard/joined/*`)
- [x] **Server Action**: `getJoinedTournaments(userId)`
    - Lấy danh sách đăng ký của user (`userId`).
    - Bao gồm thông tin giải đấu và trạng thái duyệt (`status`).
- [x] **Component**: `JoinedTournamentCard`
    - Hiển thị thông tin giải đấu.
    - **Quan trọng**: Badge trạng thái đăng ký cá nhân:
        - `Pending`: Đang chờ duyệt (Màu vàng).
        - `Approved`: Đã tham gia (Màu xanh).
        - `Rejected`: Bị từ chối (Màu đỏ).
    - Nút "Xem Chi Tiết".

### Profile (`app/dashboard/profile/*`)
- [x] **Placeholder Page**:
    - Giao diện xem trước thông tin cá nhân.
    - Form mock-up để cập nhật Avatar, Tên, SĐT.

## 2. Hướng dẫn kiểm thử (Verification)

1.  **Truy cập Dashboard**:
    - Đăng nhập -> Vào đường dẫn `/dashboard`.
    - Kiểm tra Sidebar và thông tin user hiển thị đúng.
2.  **Kiểm tra Host View**:
    - Nếu tài khoản đã tạo giải -> Vào tab "Giải Đấu Của Tôi".
    - Thấy danh sách các giải đã tạo.
    - Click "Quản Lý" -> Chuyển sang trang chi tiết giải đấu.
3.  **Kiểm tra Participant View**:
    - Dùng 1 tài khoản khác đăng ký tham gia giải.
    - Vào tab "Giải Đã Tham Gia".
    - Thấy giải vừa đăng ký có trạng thái "Đang Chờ Duyệt".
    - (Optional) Dùng tài khoản chủ giải duyệt đơn -> Reload trang này -> Thấy trạng thái chuyển sang "Đã Tham Gia".

## 3. Lưu ý & Bước tiếp theo
- Dữ liệu thống kê ở trang chủ Dashboard hiện tại đang là **Mock Data** (số liệu giả). Cần tích hợp query thật trong các phase sau.
- Trang Profile chưa có chức năng lưu (Save) thật sự, mới chỉ hiển thị dữ liệu từ Auth.
- **Next Phase:** Phase 3 - Bracket Engine (Tạo lịch thi đấu & Sơ đồ giải).
