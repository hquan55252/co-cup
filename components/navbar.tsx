import { createClient } from "@/utils/supabase/server"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { NavbarSearch } from "@/components/navbar-search"

export default async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full container rounded-full border border-slate-800 bg-slate-950/80 backdrop-blur-md shadow-2xl transition-all duration-300">
      <div className="flex h-16 items-center justify-between px-6">
        <MainNav />
        <div className="flex items-center gap-4">
             <NavbarSearch />
             <UserNav user={user} />
        </div>
      </div>
    </header>
  )
}
