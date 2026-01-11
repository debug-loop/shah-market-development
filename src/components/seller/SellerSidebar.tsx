import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  Package,
  Clock,
  ShoppingCart,
  DollarSign,
  MessageSquare,
  User,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const menuItems = [
  { title: 'Dashboard', url: '/seller/dashboard', icon: LayoutDashboard },
  { title: 'Add Product', url: '/seller/add-product', icon: PlusCircle },
  { title: 'Approved Products', url: '/seller/products/approved', icon: Package },
  { title: 'Pending Products', url: '/seller/products/pending', icon: Clock },
  { title: 'Orders', url: '/seller/orders', icon: ShoppingCart },
  { title: 'Earnings', url: '/seller/earnings', icon: DollarSign },
  { title: 'Messages', url: '/seller/messages', icon: MessageSquare },
  { title: 'Profile & Verification', url: '/seller/profile', icon: User },
  { title: 'Support', url: '/seller/support', icon: HelpCircle },
];

export function SellerSidebar() {
  const location = useLocation();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar
      className={cn(
        'border-r border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64'
      )}
      collapsible="icon"
    >
      <SidebarContent className="py-4">
        <div className="flex items-center justify-between px-4 mb-6">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold gradient-text">Seller Panel</h2>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className={cn('px-4 text-xs text-muted-foreground', isCollapsed && 'sr-only')}>
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.url || 
                  (item.url !== '/seller' && location.pathname.startsWith(item.url));
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={cn(
                          'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200',
                          'hover:bg-accent/50',
                          isActive && 'bg-primary/10 text-primary border-l-2 border-primary'
                        )}
                      >
                        <item.icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-primary')} />
                        {!isCollapsed && (
                          <span className={cn('font-medium', isActive && 'text-primary')}>
                            {item.title}
                          </span>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
