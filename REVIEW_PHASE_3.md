# Phase 3: Bracket Engine Review

**Trạng thái:** ✅ Đã hoàn thành
**Mục tiêu:** Triển khai hệ thống tạo nhánh đấu loại trực tiếp (Single Elimination), quản lý trận đấu, và tự động đưa người thắng vào vòng trong.

## 1. Các thay đổi đã thực hiện

### Database Schema (`prisma/schema.prisma`)
- [x] **Enum mới**: `MatchStatus` (PENDING, SCHEDULED, IN_PROGRESS, COMPLETED).
- [x] **Cập nhật Model `Match`**:
    - `winnerId` (String?): ID người thắng trận.
    - `status` (MatchStatus): Trạng thái trận đấu.
    - `matchIndex` (Int): Số thứ tự trận trong vòng đó (0, 1, 2...).
    - `nextMatchId` (String?): Self-relation trỏ đến trận đấu tiếp theo.
    - `nextMatchSlot` (String?): Xác định người thắng vào slot `P1` hay `P2` của trận tiếp theo.
    - `previousMatches` (Match[]): Relation ngược để Prisma hiểu self-relation.

### Backend Logic (`app/actions/bracket.ts`)
- [x] **`generateBracket(tournamentId)`**:
    - Kiểm tra bracket đã tồn tại chưa (ngăn tạo trùng).
    - Lấy danh sách người chơi đã duyệt (approved).
    - **Validate**: Số lượng phải là lũy thừa 2 (4, 8, 16, 32).
    - **Thuật toán Top-down**: Tạo trận Chung Kết trước → đệ quy tạo Bán Kết → Tứ Kết... → gán player ở Vòng 1.
    - Mỗi trận con set `nextMatchId` + `nextMatchSlot` (`P1` = con trái, `P2` = con phải).
    - Toàn bộ insert trong `prisma.$transaction` (tạo hết hoặc không tạo gì).
- [x] **`advanceWinner(matchId, winnerId)`**:
    - Cập nhật trận hiện tại: `status=COMPLETED`, `winnerId`.
    - Dùng `nextMatchSlot` để đặt winner vào đúng vị trí (P1/P2) của trận kế tiếp.
- [x] **`updateMatchScore(matchId, scoreP1, scoreP2)`**: Cập nhật tỉ số, đánh dấu `IN_PROGRESS`.
- [x] **`deleteBracket(tournamentId)`**: Xóa toàn bộ bracket để tạo lại.
- [x] **`getBracketData(tournamentId)`**: Lấy dữ liệu bracket, nhóm theo vòng đấu.
- [x] **`getPlayerNames(playerIds)`**: Lấy tên hiển thị từ Profile.

### UI Components

#### `components/bracket/match-card.tsx`
- [x] Hiển thị tên 2 người chơi, tỉ số.
- [x] Badge trạng thái (Chờ / Sắp diễn ra / Đang đấu / LIVE / Kết thúc).
- [x] Highlight người thắng (màu xanh lá, icon ▶).
- [x] Click để mở dialog cập nhật (chỉ cho Organizer).

#### `components/bracket/match-update-dialog.tsx`
- [x] Form nhập tỉ số cho Player 1 và Player 2.
- [x] 2 nút chọn người thắng (tự động lưu tỉ số + advance winner).
- [x] Nút "Lưu Tỉ Số" riêng (không kết thúc trận).
- [x] Hiển thị kết quả nếu trận đã kết thúc (chỉ xem).

#### `components/bracket/bracket-view-client.tsx`
- [x] Render nhánh đấu theo layout Flexbox: mỗi vòng 1 cột.
- [x] Tiêu đề vòng thông minh: "Vòng 1", "Tứ Kết", "Bán Kết", "Chung Kết".
- [x] Đường nối CSS giữa các vòng.
- [x] Tích hợp `MatchUpdateDialog` cho Organizer.

#### `components/bracket/generate-bracket-button.tsx`
- [x] Nút "Tạo Bracket Tự Động" (khi chưa có bracket).
- [x] Nút "Xóa Bracket & Tạo Lại" (khi đã có bracket).
- [x] Hiển thị số lượng người chơi đã duyệt.
- [x] Hiển thị lỗi nếu số lượng không hợp lệ.

#### `components/bracket-view.tsx` (Server Wrapper)
- [x] Server Component: Fetch bracket data + player names.
- [x] Truyền dữ liệu xuống `BracketViewClient`.

### Tích hợp vào trang chi tiết (`app/tournaments/[id]/page.tsx`)
- [x] Import `BracketView` và `GenerateBracketButton`.
- [x] Kiểm tra bracket đã tồn tại (`matchCount > 0`).
- [x] Tab "Sơ Đồ & Lịch Đấu":
    - Nếu **có bracket** → Hiển thị `BracketView` + nút "Xóa & Tạo Lại" (cho Organizer).
    - Nếu **chưa có** → Organizer thấy nút "Tạo Bracket", Guest thấy placeholder.

## 2. Hướng dẫn kiểm thử (Verification)

### Kịch bản 1: Tạo Bracket (4 người chơi)
1. Tạo giải đấu mới.
2. Đăng ký **4 tài khoản** và duyệt hết (Approved).
3. Vào tab **"Sơ Đồ & Lịch Đấu"** → Bấm **"Tạo Bracket Tự Động"**.
4. **Kết quả mong đợi**: 2 trận Bán Kết + 1 trận Chung Kết.

### Kịch bản 2: Cập nhật kết quả & Advance
1. Click vào trận Bán Kết 1 → Nhập tỉ số → Bấm **"[Tên] Thắng"**.
2. **Kiểm tra**: Trận Chung Kết → Player 1 hiện tên người thắng.
3. Làm tương tự cho Bán Kết 2.
4. **Kiểm tra**: Trận Chung Kết → Player 2 hiện tên người thắng.
5. Click Chung Kết → Chọn nhà vô địch → Giải đấu hoàn tất.

### Kịch bản 3: Số lượng không hợp lệ
1. Duyệt 5 hoặc 7 người chơi (không phải lũy thừa 2).
2. Bấm "Tạo Bracket Tự Động".
3. **Kết quả mong đợi**: Hiện thông báo lỗi yêu cầu số lượng 4, 8, 16, 32.

### Kịch bản 4: Xóa & Tạo lại
1. Sau khi đã tạo bracket, bấm **"Xóa Bracket & Tạo Lại"**.
2. Confirm dialog xuất hiện → Xác nhận.
3. **Kết quả mong đợi**: Bracket cũ bị xóa, có thể tạo bracket mới.

## 3. Lưu ý & Bước tiếp theo

### Giới hạn hiện tại
- **Chỉ hỗ trợ Single Elimination** (Loại trực tiếp). Double Elimination chưa có.
- **Bắt buộc lũy thừa 2**: Số người chơi phải là 4, 8, 16, 32. Xử lý Byes (miễn đấu) sẽ bổ sung ở phase sau.
- **Chưa có Realtime**: Kết quả cần reload trang để cập nhật.

### Next Phase
- **Phase 4: Real-time & Live Updates** — Tích hợp Supabase Realtime để cập nhật bracket trực tiếp không cần reload.
