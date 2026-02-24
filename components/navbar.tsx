import { createClient } from "@/utils/supabase/server"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { NavbarSearch } from "@/components/navbar-search"

export default async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header
      className="
        app-navbar
        fixed top-4 inset-x-0 z-50
        mx-auto
        w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)]
        max-w-7xl
        rounded-full border border-slate-800
        bg-slate-950/80 backdrop-blur-md shadow-2xl
        transition-colors transition-shadow duration-300
      "
    >
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
