import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { ShoppingCart, Clock, CheckCircle, Truck, XCircle, Package } from 'lucide-react';

const statusConfig = {
  pending:    { color: 'bg-amber-100 text-amber-700',           icon: Clock,        label: 'Pending' },
  confirmed:  { color: 'bg-[#6b5a2e]/10 text-[#6b5a2e]',       icon: CheckCircle,  label: 'Confirmed' },
  processing: { color: 'bg-blue-100 text-blue-700',             icon: Package,      label: 'Processing' },
  shipped:    { color: 'bg-indigo-100 text-indigo-700',         icon: Truck,        label: 'Shipped' },
  delivered:  { color: 'bg-green-100 text-green-700',           icon: CheckCircle,  label: 'Delivered' },
  cancelled:  { color: 'bg-red-100 text-red-700',               icon: XCircle,      label: 'Cancelled' },
};
const paymentColors = { pending:'bg-amber-100 text-amber-700', paid:'bg-green-100 text-green-700', failed:'bg-red-100 text-red-700', refunded:'bg-gray-100 text-gray-600' };

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    api.get(user.role === 'exporter' ? `/orders/exporter/${user._id}` : `/orders/importer/${user._id}`)
      .then((r) => setOrders(r.data))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div>
      <div className="mb-8">
        <p className="text-[#6b5a2e] text-xs font-semibold tracking-widest uppercase mb-1">• Orders</p>
        <h1 className="text-3xl font-bold text-[#3a2e1a]">{user?.role === 'exporter' ? 'Received Orders' : 'My Orders'}</h1>
        <p className="text-[#a89060] text-sm mt-1">{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-24"><div className="w-8 h-8 border-4 border-[#6b5a2e] border-t-transparent rounded-full animate-spin" /></div>
      ) : orders.length === 0 ? (
        <div className="text-center py-24 text-[#c4b090]">
          <ShoppingCart size={52} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-semibold text-[#6b5a2e]">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const sc = statusConfig[order.status] || statusConfig.pending;
            const StatusIcon = sc.icon;
            return (
              <div key={order._id} className="bg-white border border-[#e8dfc8] rounded-2xl p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-bold text-[#3a2e1a] text-sm">{order.product?.productName}</h3>
                  <span className={`flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-medium ${sc.color}`}><StatusIcon size={11} />{sc.label}</span>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium capitalize ${paymentColors[order.paymentStatus]}`}>{order.paymentMethod?.replace('-',' ')} · {order.paymentStatus}</span>
                </div>
                <p className="text-xs text-[#a89060] mb-3">
                  {user?.role === 'exporter' ? `Importer: ${order.importer?.name}${order.importer?.companyName ? ` · ${order.importer.companyName}` : ''}` : `Exporter: ${order.exporter?.name}${order.exporter?.companyName ? ` · ${order.exporter.companyName}` : ''}`}
                </p>
                <div className="flex gap-5 text-xs text-[#a89060] flex-wrap">
                  <span>Qty: <strong className="text-[#6b5a2e]">{order.quantity}</strong></span>
                  <span>Total: <strong className="text-[#6b5a2e]">₹{order.totalAmount?.toLocaleString()}</strong></span>
                  <span>Placed: {new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
