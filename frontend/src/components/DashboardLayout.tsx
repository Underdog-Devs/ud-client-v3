import { Outlet } from 'react-router-dom'
import { Navigation } from './Navigation'
import { AsideNavbar } from './dashboard/AsideNavbar'

export function DashboardLayout() {
  return (
    <>
      <Navigation />
      <div className="flex">
        <AsideNavbar />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </>
  )
}