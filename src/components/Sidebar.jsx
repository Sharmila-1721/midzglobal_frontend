import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Package, MessageSquare, ShoppingCart, Truck, Users, ShieldCheck } from 'lucide-react';

const navItems = {
  admin:     [{ to:'/dashboard',icon:LayoutDashboard,label:'Dashboard'},{to:'/admin/users',icon:Users,label:'All Users'},{to:'/admin/pending',icon:ShieldCheck,label:'Pending Approvals'},{to:'/products',icon:Package,label:'Products'}],
  exporter:  [{ to:'/dashboard',icon:LayoutDashboard,label:'Dashboard'},{to:'/products',icon:Package,label:'My Products'},{to:'/inquiries',icon:MessageSquare,label:'Inquiries'},{to:'/orders',icon:ShoppingCart,label:'Orders'}],
  importer:  [{ to:'/dashboard',icon:LayoutDashboard,label:'Dashboard'},{to:'/products',icon:Package,label:'Browse Products'},{to:'/inquiries',icon:MessageSquare,label:'My Inquiries'},{to:'/orders',icon:ShoppingCart,label:'My Orders'}],
  logistics: [{ to:'/dashboard',icon:LayoutDashboard,label:'Dashboard'},{to:'/shipments',icon:Truck,label:'Shipments'}],
};

export default function Sidebar() {
  const { user } = useAuth();
  const items = navItems[user?.role] || [];
  return (
    <aside className="w-56 shrink-0 min-h-screen bg-[#3a2e1a] flex flex-col py-6 px-3">
      <nav className="flex flex-col gap-1">
        {items.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/dashboard'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive ? 'bg-[#6b5a2e] text-[#faf7f2] shadow-sm' : 'text-[#c4b090] hover:bg-[#4a3f20] hover:text-[#faf7f2]'
              }`}>
            <Icon size={17} />{label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto px-4 pt-6 border-t border-[#4a3f20]">
        <p className="text-[#6b5a2e] text-xs font-semibold tracking-widest uppercase">MidzGlobal</p>
        <p className="text-[#5a4a30] text-xs mt-0.5">B2B Trade Platform</p>
      </div>
    </aside>
  );
}
