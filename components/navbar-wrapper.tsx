'use client'

import { usePathname } from 'next/navigation'

export default function NavbarWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Define routes where Navbar should be hidden
  const hiddenRoutes = ['/login', '/register', '/forgot-password', '/auth']
  
  // Check if current path starts with any of the hidden routes
  // We use startsWith to catch sub-routes if any, though explicit exact match might be safer for strict control.
  // Converting to boolean for clarity.
  const shouldHide = hiddenRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))

  if (shouldHide) {
    return null
  }

  return <>{children}</>
}
