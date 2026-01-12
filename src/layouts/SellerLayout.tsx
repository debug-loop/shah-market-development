import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { SellerSidebar } from '@/components/seller/SellerSidebar';
import { SellerHeader } from '@/components/seller/SellerHeader';

export function SellerLayout() {
  return (
    <SidebarProvider defaultOpen>
      <div className="min-h-screen flex flex-col w-full bg-background">
        <SellerHeader />
        <div className="flex flex-1 w-full">
          {/* <SellerSidebar /> */}
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
