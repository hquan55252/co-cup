import { createClient } from "@/utils/supabase/server"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"

export default async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur supports-[backdrop-filter]:bg-slate-950/60">
      <div className="container flex h-16 items-center justify-between">
        <MainNav />
        <div className="flex items-center gap-4">
             <UserNav user={user} />
        </div>
      </div>
    </header>
  )
}
