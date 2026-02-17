import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// This check can be removed, it is just for tutorial purposes
export const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export function getTournamentStatusLabel(status: string) {
  switch (status) {
    case 'REGISTERING':
      return 'Đang Mở Đăng Ký';
    case 'CONFIRMED':
      return 'Đã Chốt Danh Sách';
    case 'ON_GOING':
      return 'Đang Diễn Ra';
    case 'COMPLETED':
      return 'Đã Kết Thúc';
    case 'CANCELLED':
      return 'Đã Hủy';
    case 'PENDING_CONFIRMATION':
        return 'Chờ Xác Nhận';
    default:
      return status;
  }
}

export function getRegistrationStatusLabel(status: string) {
    switch (status) {
        case 'pending':
            return 'Đang Chờ Duyệt';
        case 'approved':
            return 'Đã Tham Gia';
        case 'rejected':
            return 'Bị Từ Chối';
        default:
            return status;
    }
}
