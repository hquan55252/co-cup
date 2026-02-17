import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Phone, MapPin } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Hồ Sơ Cá Nhân</h1>
        <p className="text-slate-400">Quản lý thông tin tài khoản và hiển thị công khai.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Avatar Section */}
        <Card className="bg-slate-900 border-slate-800 md:col-span-1">
            <CardHeader>
                <CardTitle className="text-white">Ảnh Đại Diện</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
                <div className="w-32 h-32 bg-slate-800 rounded-full mb-6 border-4 border-slate-700 flex items-center justify-center overflow-hidden">
                     {/* Placeholder for avatar */}
                     <span className="text-4xl font-bold text-slate-500">
                        {user?.email?.[0].toUpperCase()}
                     </span>
                </div>
                <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                    Thay Đổi Ảnh
                </Button>
            </CardContent>
        </Card>

        {/* Info Form */}
        <Card className="bg-slate-900 border-slate-800 md:col-span-2">
            <CardHeader>
                <CardTitle className="text-white">Thông Tin Cơ Bản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-slate-300">Họ và Tên</Label>
                    <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                        <Input 
                            className="bg-slate-950 border-slate-800 pl-10 text-slate-200" 
                            defaultValue={user?.user_metadata.full_name || ""} 
                            placeholder="Nhập họ tên đầy đủ"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-slate-300">Email</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                        <Input 
                            className="bg-slate-950 border-slate-800 pl-10 text-slate-200" 
                            defaultValue={user?.email || ""} 
                            disabled
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-slate-300">Số Điện Thoại</Label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                        <Input 
                            className="bg-slate-950 border-slate-800 pl-10 text-slate-200" 
                            placeholder="Thêm số điện thoại liên hệ"
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <Button className="bg-yellow-500 text-slate-950 hover:bg-yellow-400 font-bold">
                        Lưu Thay Đổi
                    </Button>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
