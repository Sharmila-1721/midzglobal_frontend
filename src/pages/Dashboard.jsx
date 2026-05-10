import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Package, MessageSquare, ShoppingCart, Users, Clock, TrendingUp } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="bg-white border border-[#e8dfc8] rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
    <div className="w-12 h-12 rounded-xl bg-[#6b5a2e]/10 flex items-center justify-center shrink-0">
      <Icon size={22} className="text-[#6b5a2e]" />
    </div>
    <div>
      <p className="text-xs text-[#a89060] font-medium uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold text-[#3a2e1a] mt-0.5">{value ?? '—'}</p>
    </div>
  </div>
);

const guideItems = {
  admin:     ['Review and approve pending user registrations from Pending Approvals.','View all registered users under All Users.','Browse all listed products in the Products section.'],
  exporter:  ['Add and manage your products under My Products.','Review incoming inquiries from importers in Inquiries.','Accept inquiries to create orders and track them in Orders.'],
  importer:  ['Browse available products and send inquiries from Browse Products.','Track your sent inquiries and their responses in My Inquiries.','View confirmed orders and shipment status in My Orders.'],
  logistics: ['Create shipments for confirmed orders in Shipments.','Update shipment status and current location as the package moves.'],
};

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (user?.role === 'admin') api.get('/admin/analytics').then((r) => setStats(r.data)).catch(() => {});
  }, [user]);

  const greeting = () => { const h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'; };

  return (
    <div>
      <div className="mb-8">
        <p className="text-[#6b5a2e] text-xs font-semibold tracking-widest uppercase mb-1">• Dashboard</p>
        <h1 className="text-3xl font-bold text-[#3a2e1a]">{greeting()}, {user?.name?.split(' ')[0]}</h1>
        <p className="text-[#a89060] text-sm mt-1">
          {user?.companyName && `${user.companyName} · `}<span className="capitalize">{user?.role}</span>{user?.country && ` · ${user.country}`}
        </p>
      </div>

      {user?.role === 'admin' && stats && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <StatCard icon={Users}         label="Total Users"       value={stats.totalUsers} />
          <StatCard icon={Clock}         label="Pending Approvals" value={stats.pendingUsers} />
          <StatCard icon={TrendingUp}    label="Approved Users"    value={stats.approvedUsers} />
          <StatCard icon={Package}       label="Total Products"    value={stats.totalProducts} />
          <StatCard icon={ShoppingCart}  label="Total Orders"      value={stats.totalOrders} />
          <StatCard icon={MessageSquare} label="Total Inquiries"   value={stats.totalInquiries} />
        </div>
      )}

      <div className="bg-white border border-[#e8dfc8] rounded-2xl p-6">
        <p className="text-[#6b5a2e] text-xs font-semibold tracking-widest uppercase mb-4">• Quick Guide</p>
        <ul className="space-y-3">
          {(guideItems[user?.role] || []).map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-[#5a4a30]">
              <span className="w-5 h-5 rounded-full bg-[#6b5a2e]/10 text-[#6b5a2e] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
