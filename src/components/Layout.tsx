import { Outlet, Navigate } from 'react-router-dom'
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/AppSidebar'
import { useAuthStore } from '@/stores/useAuthStore'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { useLocation } from 'react-router-dom'

export default function Layout() {
  const { isAuthenticated } = useAuthStore()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard'
      case '/quotation':
        return 'Nova Cotação'
      case '/history':
        return 'Histórico'
      case '/admin':
        return 'Administração'
      default:
        return 'Vectra Cargo'
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Vectra Cargo</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{getPageTitle()}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <main className="flex-1 p-4 md:p-8 pt-6">
          <Outlet />
        </main>
        <footer className="border-t py-4 px-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Vectra Cargo. Todos os direitos
          reservados.
        </footer>
      </SidebarInset>
    </SidebarProvider>
  )
}
