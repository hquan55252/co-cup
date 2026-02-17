# Phase 1: Registration Flow Review

**Trạng thái:** ✅ Đã hoàn thành
**Mục tiêu:** Xây dựng luồng đăng ký tham gia giải đấu và công cụ quản lý cho chủ giải.

## 1. Các thay đổi đã thực hiện

### Backend (`app/actions/tournaments.ts`)
- [x] **`registerForTournament`**:
    - Thêm logic kiểm tra hạn đăng ký (`deadline`).
    - Thêm logic kiểm tra số lượng hiện tại (`approvedCount < maxPlayers`) để tránh race condition cơ bản.
    - Cập nhật trạng thái đăng ký mặc định là `pending`.
- [x] **`manageRegistration`**:
    - **Security Fix**: Đã thêm bước kiểm tra `registration.tournament.creatorId === user.id`. Chỉ chủ giải mới có quyền duyệt/từ chối.
    - Cập nhật trạng thái `approved` hoặc `rejected`.

### UI Components
- [x] **`RegisterButton`** (`app/tournaments/[id]/register-button.tsx`):
    - Tự động hiển thị trạng thái phù hợp:
        - Guest -> Yêu cầu đăng nhập.
        - Pending -> "Đang chờ duyệt" (Disabled).
        - Approved -> "Đã tham gia" (Success).
        - Rejected -> "Bị từ chối" (Error).
        - Full -> "Giải đã đủ" (Disabled).
- [x] **`ParticipantManager`** (`app/tournaments/[id]/participant-manager.tsx`):
    - Dành riêng cho **Chủ giải**.
    - Hiển thị danh sách "Chờ duyệt" và "Đã duyệt" riêng biệt.
    - Nút thao tác nhanh (Approve/Reject).
- [x] **`PublicParticipantList`** (`app/tournaments/[id]/public-participant-list.tsx`):
    - Dành cho **Khách/VĐV**.
    - Chỉ hiển thị danh sách những người đã được duyệt (`status === 'approved'`).

### Integration (`app/tournaments/[id]/page.tsx`)
- [x] Thực hiện phân quyền hiển thị (Rendering Logic):
    - Nếu là Chủ giải -> Hiển thị `ParticipantManager`.
    - Nếu là người khác -> Hiển thị `PublicParticipantList`.
- [x] Cập nhật số lượng VĐV hiển thị trên UI theo số lượng đã duyệt (`approvedCount`).

### UI Refinements & Bug Fixes (Update)
- [x] **Landing Page**:
    - Thay nút "Chi Tiết" thành **"Đăng Ký Ngay"**.
    - Card giải đấu có thể click toàn bộ (Pointer cursor).
- [x] **Details Page**:
    - Fix chiều cao nút "Đăng Ký Ngay" (`h-14`) để bằng với nút "Chia Sẻ".
    - Fix lỗi overflow nút "Chia Sẻ" trên màn hình nhỏ (Responsive width & Flex wrap).
- [x] **Bug Fixes**:
    - Fix lỗi ảnh 404 trong dữ liệu mẫu (Seed Data).
    - Cập nhật lại đường dẫn ảnh Unsplash hợp lệ.

## 2. Hướng dẫn kiểm thử (Verification)

1.  **Đăng ký (User)**:
    - Đăng nhập user thường.
    - Vào giải đấu đang mở -> Bấm "Đăng ký".
    - Thấy nút chuyển sang "Đang chờ duyệt".
2.  **Duyệt (Organizer)**:
    - Đăng nhập user chủ giải.
    - Vào giải đấu đó -> Tab "Vận Động Viên".
    - Thấy user vừa đăng ký ở mục "Yêu cầu chờ duyệt".
    - Bấm nút (V) để duyệt.
    - User chuyển xuống mục "Danh sách thi đấu".
3.  **Kiểm tra lại (User)**:
    - Quay lại view của User thường.
    - Refresh trang -> Thấy nút chuyển sang "Đã tham gia".
    - Thấy tên mình trong danh sách "Vận Động Viên".

## 3. Lưu ý & Bước tiếp theo
- Hiện tại logic Race Condition đang ở mức MVP (kiểm tra count trước khi insert). Trong tương lai khi lượng user lớn, cần nâng cấp lên Database Transaction hoặc Atomic Update.
- **Next Phase:** User Dashboard (Để user xem lại các giải đã đăng ký/tổ chức).
