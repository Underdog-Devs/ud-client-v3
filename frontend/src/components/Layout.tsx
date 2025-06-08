import { Outlet } from 'react-router-dom'
import { Navigation } from './Navigation'
import { Footer } from './Footer'

export function Layout() {
  return (
    <>
      <Navigation />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}