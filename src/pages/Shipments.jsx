import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Truck, X, Plus, MapPin, Clock } from 'lucide-react';

const inp = 'w-full bg-[#faf7f2] border border-[#d4c4a0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6b5a2e] placeholder-[#c4b090]';
const lbl = 'block text-sm font-medium text-[#5a4a2a] mb-1.5';
const STEPS = ['created','picked-up','in-transit','customs-clearance','out-for-delivery','delivered'];
const shippingMethods = ['Air Cargo','Sea Freight','Road Transport','Rail Transport'];
const statusColors = { 'created':'bg-[#6b5a2e]/10 text-[#6b5a2e]','picked-up':'bg-blue-100 text-blue-700','in-transit':'bg-indigo-100 text-indigo-700','customs-clearance':'bg-amber-100 text-amber-700','out-for-delivery':'bg-purple-100 text-purple-700','delivered':'bg-green-100 text-green-700' };

export default function Shipments() {
  const { user } = useAuth();
  const [shipments, setShipments]         = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [showCreate, setShowCreate]       = useState(false);
  const [showUpdate, setShowUpdate]       = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [createForm, setCreateForm] = useState({ order:'', shippingMethod:'Air Cargo', estimatedDelivery:'', shippingCost:'' });
  const [updateForm, setUpdateForm] = useState({ shipmentStatus:'', currentLocation:'' });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = () => {
    setLoading(true);
    Promise.all([api.get('/shipments'), api.get('/orders/pending-shipments')])
      .then(([s,o]) => { setShipments(s.data); setPendingOrders(o.data); })
      .catch(() => toast.error('Failed to load data'))
      .finally(() => setLoading(false));
  };
  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try { await api.post('/shipments', { ...createForm, logisticsProvider:user._id, shippingCost:Number(createForm.shippingCost)||0 }); toast.success('Shipment created'); setShowCreate(false); setCreateForm({ order:'', shippingMethod:'Air Cargo', estimatedDelivery:'', shippingCost:'' }); fetchData(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSubmitting(false); }
  };

  const handleUpdate = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try { await api.put(`/shipments/${selectedShipment._id}`, updateForm); toast.success('Shipment updated'); setShowUpdate(false); fetchData(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSubmitting(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[#6b5a2e] text-xs font-semibold tracking-widest uppercase mb-1">• Logistics</p>
          <h1 className="text-3xl font-bold text-[#3a2e1a]">Shipments</h1>
          <p className="text-[#a89060] text-sm mt-1">{shipments.length} shipment{shipments.length !== 1 ? 's' : ''}</p>
        </div>
        {user?.role === 'logistics' && (
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 bg-[#6b5a2e] hover:bg-[#4a3f20] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors">
            <Plus size={16} /> Create Shipment
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-24"><div className="w-8 h-8 border-4 border-[#6b5a2e] border-t-transparent rounded-full animate-spin" /></div>
      ) : shipments.length === 0 ? (
        <div className="text-center py-24 text-[#c4b090]">
          <Truck size={52} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-semibold text-[#6b5a2e]">No shipments yet</p>
        </div>
      ) : (
        <div className="space-y-5">
          {shipments.map((s) => {
            const stepIdx = STEPS.indexOf(s.shipmentStatus);
            return (
              <div key={s._id} className="bg-white border border-[#e8dfc8] rounded-2xl p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-mono font-bold text-[#3a2e1a] text-sm">{s.trackingId}</span>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium capitalize ${statusColors[s.shipmentStatus] || 'bg-gray-100 text-gray-600'}`}>{s.shipmentStatus?.replace(/-/g,' ')}</span>
                    </div>
                    <p className="text-sm text-[#5a4a30]">{s.order?.product?.productName} — {s.order?.importer?.name}</p>
                    <div className="flex gap-4 text-xs text-[#a89060] mt-1 flex-wrap">
                      <span>{s.shippingMethod}</span>
                      <span className="flex items-center gap-1"><MapPin size={11} />{s.currentLocation}</span>
                      {s.estimatedDelivery && <span className="flex items-center gap-1"><Clock size={11} />ETA: {s.estimatedDelivery}</span>}
                      {s.shippingCost > 0 && <span>Cost: ₹{s.shippingCost?.toLocaleString()}</span>}
                    </div>
                    {s.deliveredAt && <p className="text-xs text-green-700 mt-1 font-medium">✓ Delivered {new Date(s.deliveredAt).toLocaleDateString()}</p>}
                  </div>
                  {user?.role === 'logistics' && s.shipmentStatus !== 'delivered' && (
                    <button onClick={() => { setSelectedShipment(s); setUpdateForm({ shipmentStatus:s.shipmentStatus, currentLocation:s.currentLocation }); setShowUpdate(true); }}
                      className="text-xs bg-[#6b5a2e] hover:bg-[#4a3f20] text-white font-medium px-4 py-2 rounded-full transition-colors shrink-0">Update Status</button>
                  )}
                </div>
                {/* Progress bar */}
                <div className="flex items-center">
                  {STEPS.map((step, i) => (
                    <div key={step} className="flex items-center flex-1 min-w-0">
                      <div className={`w-3 h-3 rounded-full shrink-0 border-2 transition-colors ${i === stepIdx ? 'bg-[#6b5a2e] border-[#6b5a2e] scale-125' : i < stepIdx ? 'bg-[#6b5a2e] border-[#6b5a2e]' : 'bg-white border-[#d4c4a0]'}`} />
                      {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 ${i < stepIdx ? 'bg-[#6b5a2e]' : 'bg-[#e8dfc8]'}`} />}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-1">
                  {STEPS.map((step) => <span key={step} className="text-[10px] text-[#c4b090] capitalize" style={{width:`${100/STEPS.length}%`}}>{step.replace(/-/g,' ')}</span>)}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-[#3a2e1a]/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#faf7f2] rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#e8dfc8]">
              <h2 className="text-lg font-bold text-[#3a2e1a]">Create Shipment</h2>
              <button onClick={() => setShowCreate(false)} className="text-[#a89060] hover:text-[#6b5a2e]"><X size={20} /></button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div><label className={lbl}>Order *</label>
                <select value={createForm.order} onChange={(e)=>setCreateForm({...createForm,order:e.target.value})} required className={inp+' bg-[#faf7f2]'}>
                  <option value="">Select an order</option>
                  {pendingOrders.map((o) => <option key={o._id} value={o._id}>{o.product?.productName} — {o.importer?.name} (#{o._id.slice(-6)})</option>)}
                </select>
              </div>
              <div><label className={lbl}>Shipping Method *</label>
                <select value={createForm.shippingMethod} onChange={(e)=>setCreateForm({...createForm,shippingMethod:e.target.value})} className={inp+' bg-[#faf7f2]'}>
                  {shippingMethods.map((m) => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={lbl}>Estimated Delivery</label><input type="text" value={createForm.estimatedDelivery} onChange={(e)=>setCreateForm({...createForm,estimatedDelivery:e.target.value})} placeholder="e.g. 15 Jan 2026" className={inp} /></div>
                <div><label className={lbl}>Shipping Cost (₹)</label><input type="number" value={createForm.shippingCost} onChange={(e)=>setCreateForm({...createForm,shippingCost:e.target.value})} min="0" className={inp} /></div>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowCreate(false)} className="flex-1 border border-[#d4c4a0] text-[#6b5a2e] font-medium py-2.5 rounded-xl hover:bg-[#f5f0e8] text-sm">Cancel</button>
                <button type="submit" disabled={submitting} className="flex-1 bg-[#6b5a2e] hover:bg-[#4a3f20] disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl text-sm">{submitting ? 'Creating…' : 'Create Shipment'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {showUpdate && selectedShipment && (
        <div className="fixed inset-0 bg-[#3a2e1a]/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#faf7f2] rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#e8dfc8]">
              <h2 className="text-lg font-bold text-[#3a2e1a]">Update Shipment</h2>
              <button onClick={() => setShowUpdate(false)} className="text-[#a89060] hover:text-[#6b5a2e]"><X size={20} /></button>
            </div>
            <div className="px-6 pt-4 pb-2"><div className="bg-[#f5f0e8] rounded-xl p-3"><p className="font-mono font-bold text-[#3a2e1a] text-sm">{selectedShipment.trackingId}</p></div></div>
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div><label className={lbl}>Shipment Status *</label>
                <select value={updateForm.shipmentStatus} onChange={(e)=>setUpdateForm({...updateForm,shipmentStatus:e.target.value})} required className={inp+' bg-[#faf7f2]'}>
                  {STEPS.map((s) => <option key={s} value={s} className="capitalize">{s.replace(/-/g,' ')}</option>)}
                </select>
              </div>
              <div><label className={lbl}>Current Location *</label><input type="text" value={updateForm.currentLocation} onChange={(e)=>setUpdateForm({...updateForm,currentLocation:e.target.value})} required placeholder="e.g. Mumbai Port" className={inp} /></div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowUpdate(false)} className="flex-1 border border-[#d4c4a0] text-[#6b5a2e] font-medium py-2.5 rounded-xl hover:bg-[#f5f0e8] text-sm">Cancel</button>
                <button type="submit" disabled={submitting} className="flex-1 bg-[#6b5a2e] hover:bg-[#4a3f20] disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl text-sm">{submitting ? 'Updating…' : 'Update'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
