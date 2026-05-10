import { useEffect, useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { ShieldCheck, CheckCircle, XCircle, Clock, Building2, Globe2 } from 'lucide-react';

export default function PendingUsers() {
  const [users, setUsers]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [processing, setProcessing] = useState({});

  const fetchPending = () => {
    setLoading(true);
    api.get('/admin/pending-users').then((r) => setUsers(r.data)).catch(() => toast.error('Failed')).finally(() => setLoading(false));
  };
  useEffect(() => { fetchPending(); }, []);

  const handleAction = async (id, action) => {
    setProcessing((p) => ({ ...p, [id]: action }));
    try { await api.put(`/admin/${action}/${id}`); toast.success(`User ${action === 'approve' ? 'approved' : 'rejected'}`); setUsers((prev) => prev.filter((u) => u._id !== id)); }
    catch (err) { toast.error(err.response?.data?.message || 'Action failed'); }
    finally { setProcessing((p) => ({ ...p, [id]: null })); }
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-[#6b5a2e] text-xs font-semibold tracking-widest uppercase mb-1">• Admin</p>
        <h1 className="text-3xl font-bold text-[#3a2e1a]">Pending Approvals</h1>
        <p className="text-[#a89060] text-sm mt-1">{users.length} awaiting review</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-24"><div className="w-8 h-8 border-4 border-[#6b5a2e] border-t-transparent rounded-full animate-spin" /></div>
      ) : users.length === 0 ? (
        <div className="text-center py-24 text-[#c4b090]">
          <ShieldCheck size={52} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-semibold text-[#6b5a2e]">All caught up!</p>
          <p className="text-sm mt-1">No pending registrations.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {users.map((u) => (
            <div key={u._id} className="bg-white border border-[#e8dfc8] rounded-2xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-bold text-[#3a2e1a]">{u.name}</h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-medium capitalize bg-[#6b5a2e]/10 text-[#6b5a2e]">{u.role}</span>
                    <span className="flex items-center gap-1 text-xs text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full font-medium"><Clock size={11} /> Pending</span>
                  </div>
                  <p className="text-sm text-[#5a4a30] mb-2">{u.email}</p>
                  <div className="flex gap-4 text-xs text-[#a89060] flex-wrap">
                    {u.companyName && <span className="flex items-center gap-1"><Building2 size={12} />{u.companyName}</span>}
                    {u.country    && <span className="flex items-center gap-1"><Globe2 size={12} />{u.country}</span>}
                    {u.phone      && <span>📞 {u.phone}</span>}
                    <span>Registered: {new Date(u.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => handleAction(u._id,'approve')} disabled={!!processing[u._id]}
                    className="flex items-center gap-1.5 text-sm bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white font-medium px-4 py-2 rounded-full transition-colors">
                    <CheckCircle size={15} />{processing[u._id] === 'approve' ? 'Approving…' : 'Approve'}
                  </button>
                  <button onClick={() => handleAction(u._id,'reject')} disabled={!!processing[u._id]}
                    className="flex items-center gap-1.5 text-sm bg-red-700 hover:bg-red-800 disabled:opacity-60 text-white font-medium px-4 py-2 rounded-full transition-colors">
                    <XCircle size={15} />{processing[u._id] === 'reject' ? 'Rejecting…' : 'Reject'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
