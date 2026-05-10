import { useEffect, useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { Users, Search } from 'lucide-react';

const roleBadge   = { admin:'bg-[#3a2e1a] text-[#d4b896]', importer:'bg-[#6b5a2e]/10 text-[#6b5a2e]', exporter:'bg-[#6b5a2e]/10 text-[#6b5a2e]', logistics:'bg-[#6b5a2e]/10 text-[#6b5a2e]' };
const statusBadge = { approved:'bg-green-100 text-green-700', pending:'bg-amber-100 text-amber-700', rejected:'bg-red-100 text-red-700' };

export default function AllUsers() {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');

  useEffect(() => {
    api.get('/admin/users').then((r) => setUsers(r.data)).catch(() => toast.error('Failed')).finally(() => setLoading(false));
  }, []);

  const filtered = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.companyName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <p className="text-[#6b5a2e] text-xs font-semibold tracking-widest uppercase mb-1">• Admin</p>
          <h1 className="text-3xl font-bold text-[#3a2e1a]">All Users</h1>
          <p className="text-[#a89060] text-sm mt-1">{users.length} registered users</p>
        </div>
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a89060]" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users…"
            className="pl-9 pr-4 py-2.5 bg-white border border-[#e8dfc8] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#6b5a2e] w-64 placeholder-[#c4b090]" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-24"><div className="w-8 h-8 border-4 border-[#6b5a2e] border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="bg-white border border-[#e8dfc8] rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#f5f0e8] border-b border-[#e8dfc8]">
              <tr>
                {['User','Role','Company','Country','Status','Joined'].map((h, i) => (
                  <th key={h} className={`text-left px-5 py-3.5 text-xs font-semibold text-[#a89060] uppercase tracking-wide ${i === 2 || i === 3 ? 'hidden md:table-cell' : ''} ${i === 5 ? 'hidden lg:table-cell' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f5f0e8]">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-16 text-[#c4b090]"><Users size={36} className="mx-auto mb-3 opacity-30" />No users found</td></tr>
              ) : filtered.map((u) => (
                <tr key={u._id} className="hover:bg-[#faf7f2] transition-colors">
                  <td className="px-5 py-4"><p className="font-semibold text-[#3a2e1a]">{u.name}</p><p className="text-xs text-[#a89060]">{u.email}</p></td>
                  <td className="px-5 py-4"><span className={`text-xs px-2.5 py-0.5 rounded-full font-medium capitalize ${roleBadge[u.role] || 'bg-[#6b5a2e]/10 text-[#6b5a2e]'}`}>{u.role}</span></td>
                  <td className="px-5 py-4 hidden md:table-cell text-[#5a4a30]">{u.companyName || '—'}</td>
                  <td className="px-5 py-4 hidden md:table-cell text-[#5a4a30]">{u.country || '—'}</td>
                  <td className="px-5 py-4"><span className={`text-xs px-2.5 py-0.5 rounded-full font-medium capitalize ${statusBadge[u.status] || 'bg-gray-100 text-gray-600'}`}>{u.status}</span></td>
                  <td className="px-5 py-4 hidden lg:table-cell text-xs text-[#a89060]">{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
