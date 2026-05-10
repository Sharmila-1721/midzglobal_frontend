import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { MessageSquare, X, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const inp = 'w-full bg-[#faf7f2] border border-[#d4c4a0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6b5a2e] placeholder-[#c4b090]';
const lbl = 'block text-sm font-medium text-[#5a4a2a] mb-1.5';

const statusConfig = {
  pending:   { label:'Pending',   color:'bg-amber-100 text-amber-700',     icon:Clock },
  responded: { label:'Responded', color:'bg-[#6b5a2e]/10 text-[#6b5a2e]', icon:AlertCircle },
  accepted:  { label:'Accepted',  color:'bg-green-100 text-green-700',     icon:CheckCircle },
  rejected:  { label:'Rejected',  color:'bg-red-100 text-red-700',         icon:XCircle },
};

export default function Inquiries() {
  const { user } = useAuth();
  const [inquiries, setInquiries]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [selected, setSelected]     = useState(null);
  const [responseForm, setResponseForm] = useState({ exporterResponse:'', status:'responded' });
  const [submitting, setSubmitting] = useState(false);
  const [orderSubmitting, setOrderSubmitting] = useState(false);

  const fetchInquiries = () => {
    setLoading(true);
    api.get(user?.role === 'exporter' ? `/inquiries/exporter/${user._id}` : `/inquiries/importer/${user._id}`)
      .then((r) => setInquiries(r.data))
      .catch(() => toast.error('Failed to load inquiries'))
      .finally(() => setLoading(false));
  };
  useEffect(() => { if (user) fetchInquiries(); }, [user]);

  const handleRespond = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try { await api.put(`/inquiries/${selected._id}`, responseForm); toast.success('Response sent'); setSelected(null); fetchInquiries(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSubmitting(false); }
  };

  const handleCreateOrder = async (id) => {
    setOrderSubmitting(true);
    try { await api.post('/orders', { inquiryId: id }); toast.success('Order created'); fetchInquiries(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setOrderSubmitting(false); }
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-[#6b5a2e] text-xs font-semibold tracking-widest uppercase mb-1">• Inquiries</p>
        <h1 className="text-3xl font-bold text-[#3a2e1a]">{user?.role === 'exporter' ? 'Received Inquiries' : 'My Inquiries'}</h1>
        <p className="text-[#a89060] text-sm mt-1">{inquiries.length} total</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-24"><div className="w-8 h-8 border-4 border-[#6b5a2e] border-t-transparent rounded-full animate-spin" /></div>
      ) : inquiries.length === 0 ? (
        <div className="text-center py-24 text-[#c4b090]">
          <MessageSquare size={52} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-semibold text-[#6b5a2e]">No inquiries yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inq) => {
            const sc = statusConfig[inq.status] || statusConfig.pending;
            const StatusIcon = sc.icon;
            return (
              <div key={inq._id} className="bg-white border border-[#e8dfc8] rounded-2xl p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-bold text-[#3a2e1a] text-sm">{inq.product?.productName || 'Product'}</h3>
                      <span className={`flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-medium ${sc.color}`}><StatusIcon size={11} />{sc.label}</span>
                    </div>
                    <p className="text-xs text-[#a89060] mb-2">
                      {user?.role === 'exporter' ? `From: ${inq.importer?.name}${inq.importer?.companyName ? ` · ${inq.importer.companyName}` : ''}` : `To: ${inq.exporter?.name}${inq.exporter?.companyName ? ` · ${inq.exporter.companyName}` : ''}`}
                    </p>
                    <p className="text-sm text-[#5a4a30] mb-3 line-clamp-2">{inq.message}</p>
                    <div className="flex gap-4 text-xs text-[#a89060] flex-wrap">
                      <span>Qty: <strong className="text-[#6b5a2e]">{inq.quantity}</strong></span>
                      {inq.offerPrice > 0 && <span>Offer: <strong className="text-[#6b5a2e]">₹{inq.offerPrice?.toLocaleString()}</strong></span>}
                      <span>{new Date(inq.createdAt).toLocaleDateString()}</span>
                    </div>
                    {inq.exporterResponse && (
                      <div className="mt-3 bg-[#f5f0e8] border border-[#e8dfc8] rounded-xl p-3">
                        <p className="text-xs font-semibold text-[#6b5a2e] mb-1">Exporter Response</p>
                        <p className="text-sm text-[#5a4a30]">{inq.exporterResponse}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    {user?.role === 'exporter' && inq.status === 'pending' && (
                      <button onClick={() => { setSelected(inq); setResponseForm({ exporterResponse:'', status:'responded' }); }}
                        className="text-xs bg-[#6b5a2e] hover:bg-[#4a3f20] text-white font-medium px-4 py-2 rounded-full transition-colors">Respond</button>
                    )}
                    {user?.role === 'exporter' && inq.status === 'responded' && (
                      <button onClick={() => handleCreateOrder(inq._id)} disabled={orderSubmitting}
                        className="text-xs bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white font-medium px-4 py-2 rounded-full transition-colors">
                        {orderSubmitting ? '…' : 'Accept & Order'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-[#3a2e1a]/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#faf7f2] rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#e8dfc8]">
              <h2 className="text-lg font-bold text-[#3a2e1a]">Respond to Inquiry</h2>
              <button onClick={() => setSelected(null)} className="text-[#a89060] hover:text-[#6b5a2e]"><X size={20} /></button>
            </div>
            <div className="px-6 pt-4 pb-2">
              <div className="bg-[#f5f0e8] rounded-xl p-3">
                <p className="text-sm font-bold text-[#3a2e1a]">{selected.product?.productName}</p>
                <p className="text-xs text-[#a89060]">From: {selected.importer?.name}</p>
              </div>
            </div>
            <form onSubmit={handleRespond} className="p-6 space-y-4">
              <div>
                <label className={lbl}>Status</label>
                <select value={responseForm.status} onChange={(e) => setResponseForm({ ...responseForm, status: e.target.value })} className={inp + ' bg-[#faf7f2]'}>
                  <option value="responded">Responded</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label className={lbl}>Your Response *</label>
                <textarea value={responseForm.exporterResponse} onChange={(e) => setResponseForm({ ...responseForm, exporterResponse: e.target.value })}
                  required rows={4} placeholder="Write your response…" className={inp + ' resize-none'} />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setSelected(null)} className="flex-1 border border-[#d4c4a0] text-[#6b5a2e] font-medium py-2.5 rounded-xl hover:bg-[#f5f0e8] text-sm">Cancel</button>
                <button type="submit" disabled={submitting} className="flex-1 bg-[#6b5a2e] hover:bg-[#4a3f20] disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl text-sm">
                  {submitting ? 'Sending…' : 'Send Response'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
