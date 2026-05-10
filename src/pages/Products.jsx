import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Plus, X, Package, Star } from 'lucide-react';

const inp = 'w-full bg-[#faf7f2] border border-[#d4c4a0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6b5a2e] placeholder-[#c4b090]';
const lbl = 'block text-sm font-medium text-[#5a4a2a] mb-1.5';
const statusBadge = { approved:'bg-[#6b5a2e]/10 text-[#6b5a2e]', pending:'bg-amber-100 text-amber-700', rejected:'bg-red-100 text-red-700' };
const emptyForm = { productName:'',description:'',category:'',subCategory:'',price:'',moq:'',stock:'',country:'',image:'',leadTime:'',productionCapacity:'' };

export default function Products() {
  const { user } = useAuth();
  const [products, setProducts]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showModal, setShowModal]   = useState(false);
  const [form, setForm]             = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [inquiryModal, setInquiryModal]       = useState(false);
  const [inquiryForm, setInquiryForm] = useState({ message:'', quantity:'', offerPrice:'' });

  const fetchProducts = () => {
    setLoading(true);
    api.get('/products').then((r) => setProducts(r.data)).catch(() => toast.error('Failed to load products')).finally(() => setLoading(false));
  };
  useEffect(() => { fetchProducts(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try { await api.post('/products', { ...form, exporter: user._id }); toast.success('Product added'); setShowModal(false); setForm(emptyForm); fetchProducts(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSubmitting(false); }
  };

  const handleInquiry = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try {
      await api.post('/inquiries', { importer:user._id, exporter:selectedProduct.exporter._id, product:selectedProduct._id, message:inquiryForm.message, quantity:Number(inquiryForm.quantity), offerPrice:Number(inquiryForm.offerPrice)||0 });
      toast.success('Inquiry sent'); setInquiryModal(false); setInquiryForm({ message:'', quantity:'', offerPrice:'' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSubmitting(false); }
  };

  const displayProducts = user?.role === 'exporter' ? products.filter((p) => p.exporter?._id === user._id) : products;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[#6b5a2e] text-xs font-semibold tracking-widest uppercase mb-1">• Products</p>
          <h1 className="text-3xl font-bold text-[#3a2e1a]">{user?.role === 'importer' ? 'Browse Products' : 'My Products'}</h1>
          <p className="text-[#a89060] text-sm mt-1">{displayProducts.length} listed</p>
        </div>
        {user?.role === 'exporter' && (
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-[#6b5a2e] hover:bg-[#4a3f20] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors">
            <Plus size={16} /> Add Product
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-24"><div className="w-8 h-8 border-4 border-[#6b5a2e] border-t-transparent rounded-full animate-spin" /></div>
      ) : displayProducts.length === 0 ? (
        <div className="text-center py-24 text-[#c4b090]">
          <Package size={52} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-semibold text-[#6b5a2e]">No products yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayProducts.map((p) => (
            <div key={p._id} className="bg-white border border-[#e8dfc8] rounded-2xl overflow-hidden hover:shadow-lg transition-shadow group">
              {p.image ? <img src={p.image} alt={p.productName} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500" />
                : <div className="w-full h-44 bg-[#f5f0e8] flex items-center justify-center"><Package size={40} className="text-[#d4c4a0]" /></div>}
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-[#3a2e1a] text-sm leading-tight">{p.productName}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 capitalize ${statusBadge[p.status]}`}>{p.status}</span>
                </div>
                <p className="text-xs text-[#a89060] mb-3 line-clamp-2">{p.description}</p>
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="font-bold text-base text-[#6b5a2e]">₹{p.price?.toLocaleString()}</span>
                  <span className="text-[#a89060]">MOQ: {p.moq}</span>
                  <span className="text-[#a89060]">{p.country}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-[#a89060] mb-4">
                  <Star size={12} className="text-[#c4a96a] fill-[#c4a96a]" />
                  <span>{p.rating || 0} ({p.totalReviews || 0} reviews)</span>
                </div>
                {p.exporter && <p className="text-xs text-[#c4b090] mb-4">By {p.exporter.companyName || p.exporter.name}</p>}
                {user?.role === 'importer' && (
                  <button onClick={() => { setSelectedProduct(p); setInquiryModal(true); }}
                    className="w-full bg-[#6b5a2e] hover:bg-[#4a3f20] text-white text-xs font-semibold py-2.5 rounded-xl transition-colors">
                    Send Inquiry
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-[#3a2e1a]/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#faf7f2] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#e8dfc8]">
              <h2 className="text-lg font-bold text-[#3a2e1a]">Add New Product</h2>
              <button onClick={() => setShowModal(false)} className="text-[#a89060] hover:text-[#6b5a2e]"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><label className={lbl}>Product Name *</label><input name="productName" value={form.productName} onChange={(e)=>setForm({...form,[e.target.name]:e.target.value})} required className={inp} /></div>
                <div className="col-span-2"><label className={lbl}>Description *</label><textarea name="description" value={form.description} onChange={(e)=>setForm({...form,[e.target.name]:e.target.value})} required rows={3} className={inp+' resize-none'} /></div>
                <div><label className={lbl}>Category *</label><input name="category" value={form.category} onChange={(e)=>setForm({...form,[e.target.name]:e.target.value})} required className={inp} /></div>
                <div><label className={lbl}>Sub Category</label><input name="subCategory" value={form.subCategory} onChange={(e)=>setForm({...form,[e.target.name]:e.target.value})} className={inp} /></div>
                <div><label className={lbl}>Price (₹) *</label><input type="number" name="price" value={form.price} onChange={(e)=>setForm({...form,[e.target.name]:e.target.value})} required min="0" className={inp} /></div>
                <div><label className={lbl}>MOQ *</label><input type="number" name="moq" value={form.moq} onChange={(e)=>setForm({...form,[e.target.name]:e.target.value})} required min="1" className={inp} /></div>
                <div><label className={lbl}>Stock *</label><input type="number" name="stock" value={form.stock} onChange={(e)=>setForm({...form,[e.target.name]:e.target.value})} required min="0" className={inp} /></div>
                <div><label className={lbl}>Country *</label><input name="country" value={form.country} onChange={(e)=>setForm({...form,[e.target.name]:e.target.value})} required className={inp} /></div>
                <div className="col-span-2"><label className={lbl}>Image URL</label><input name="image" value={form.image} onChange={(e)=>setForm({...form,[e.target.name]:e.target.value})} placeholder="https://…" className={inp} /></div>
                <div><label className={lbl}>Lead Time</label><input name="leadTime" value={form.leadTime} onChange={(e)=>setForm({...form,[e.target.name]:e.target.value})} placeholder="e.g. 7-10 days" className={inp} /></div>
                <div><label className={lbl}>Production Capacity</label><input name="productionCapacity" value={form.productionCapacity} onChange={(e)=>setForm({...form,[e.target.name]:e.target.value})} placeholder="e.g. 1000 units/month" className={inp} /></div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-[#d4c4a0] text-[#6b5a2e] font-medium py-2.5 rounded-xl hover:bg-[#f5f0e8] text-sm">Cancel</button>
                <button type="submit" disabled={submitting} className="flex-1 bg-[#6b5a2e] hover:bg-[#4a3f20] disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl text-sm">{submitting ? 'Adding…' : 'Add Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {inquiryModal && selectedProduct && (
        <div className="fixed inset-0 bg-[#3a2e1a]/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#faf7f2] rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#e8dfc8]">
              <h2 className="text-lg font-bold text-[#3a2e1a]">Send Inquiry</h2>
              <button onClick={() => setInquiryModal(false)} className="text-[#a89060] hover:text-[#6b5a2e]"><X size={20} /></button>
            </div>
            <div className="px-6 pt-4 pb-2">
              <div className="bg-[#f5f0e8] rounded-xl p-4">
                <p className="text-sm font-bold text-[#3a2e1a]">{selectedProduct.productName}</p>
                <p className="text-xs text-[#a89060] mt-0.5">₹{selectedProduct.price?.toLocaleString()} · MOQ: {selectedProduct.moq}</p>
              </div>
            </div>
            <form onSubmit={handleInquiry} className="p-6 space-y-4">
              <div><label className={lbl}>Quantity *</label><input type="number" value={inquiryForm.quantity} onChange={(e)=>setInquiryForm({...inquiryForm,quantity:e.target.value})} required min={selectedProduct.moq} placeholder={`Min: ${selectedProduct.moq}`} className={inp} /></div>
              <div><label className={lbl}>Offer Price (₹)</label><input type="number" value={inquiryForm.offerPrice} onChange={(e)=>setInquiryForm({...inquiryForm,offerPrice:e.target.value})} placeholder="Optional" className={inp} /></div>
              <div><label className={lbl}>Message *</label><textarea value={inquiryForm.message} onChange={(e)=>setInquiryForm({...inquiryForm,message:e.target.value})} required rows={3} placeholder="Describe your requirements…" className={inp+' resize-none'} /></div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setInquiryModal(false)} className="flex-1 border border-[#d4c4a0] text-[#6b5a2e] font-medium py-2.5 rounded-xl hover:bg-[#f5f0e8] text-sm">Cancel</button>
                <button type="submit" disabled={submitting} className="flex-1 bg-[#6b5a2e] hover:bg-[#4a3f20] disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl text-sm">{submitting ? 'Sending…' : 'Send Inquiry'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
