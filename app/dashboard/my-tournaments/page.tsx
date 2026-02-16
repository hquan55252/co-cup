import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Image from "next/image";

export default async function MyTournamentsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const tournaments = await prisma.tournament.findMany({
    where: {
      creatorId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Giải đấu của tôi</h1>
          <p className="text-muted-foreground">
            Quản lý các giải đấu bạn đã tạo.
          </p>
        </div>
        <Button asChild>
          <Link href="/tournaments/new">
            <Plus className="mr-2 h-4 w-4" />
            Tạo giải đấu
          </Link>
        </Button>
      </div>

      {tournaments.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
            <Plus className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">Chưa có giải đấu nào</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground max-w-sm">
            Bạn chưa tạo giải đấu nào. Hãy bắt đầu tạo giải đấu đầu tiên của bạn ngay bây giờ!
          </p>
          <Button asChild>
            <Link href="/tournaments/new">Tạo giải đấu ngay</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tournaments.map((tournament) => (
            <Link
              key={tournament.id}
              href={`/tournaments/${tournament.id}`}
              className="group relative flex flex-col overflow-hidden rounded-lg border bg-background hover:shadow-lg transition-all"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-muted">
                {tournament.bannerUrl ? (
                  <Image
                    src={tournament.bannerUrl}
                    alt={tournament.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-secondary text-muted-foreground">
                    No Banner
                  </div>
                )}
                <div className="absolute top-2 right-2 rounded bg-black/70 px-2 py-1 text-xs font-medium text-white uppercase">
                  {tournament.status}
                </div>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="font-semibold tracking-tight text-xl mb-2 line-clamp-1">
                  {tournament.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {tournament.description || "Chưa có mô tả"}
                </p>
                <div className="mt-auto flex items-center text-sm text-muted-foreground">
                    <span className="flex items-center">
                        {new Date(tournament.startDate).toLocaleDateString('vi-VN')}
                    </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
