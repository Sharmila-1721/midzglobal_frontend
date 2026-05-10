import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Globe2 } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const HERO_BG    = 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=1600&q=80';
const ABOUT_IMG  = 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80';
const PROCESS_1  = 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=700&q=80';
const PROCESS_2  = 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=700&q=80';
const PROCESS_3  = 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=700&q=80';
const CTA_BG     = 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=1600&q=80';
const AUTH_IMG   = 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&q=80';
const SIGNIN_IMG = 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=800&q=80';

const SERVICES = [
  { img:'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600&q=80', title:'Global Sourcing',    desc:'Connect with verified exporters worldwide and source products at competitive prices.' },
  { img:'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&q=80', title:'Trade Inquiries',    desc:'Send structured inquiries and negotiate directly with exporters.' },
  { img:'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&q=80', title:'Order Management',  desc:'Track every order from confirmation to delivery in real time.' },
  { img:'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=600&q=80', title:'Shipment Tracking', desc:'Full visibility on shipments — air, sea, road or rail.' },
];
const PARTNERS = ['TradeLink','GlobalPort','CargoNet','SwiftFreight','ExportHub','LogiChain'];
const STATS     = [{ value:'12k+', label:'Active Traders' },{ value:'50+', label:'Countries Covered' },{ value:'98%', label:'On-Time Delivery' }];
const PROCESS_STEPS = [
  { num:'1', img:PROCESS_1, title:'Register & Get Approved',  desc:'Sign up as an importer, exporter, or logistics provider. Our admin team reviews and approves your account within 24 hours.' },
  { num:'2', img:PROCESS_2, title:'Browse & Send Inquiries',  desc:'Importers browse verified products, send trade inquiries with quantity and offer price, and negotiate directly with exporters.' },
  { num:'3', img:PROCESS_3, title:'Ship & Track Globally',    desc:'Once an order is confirmed, our logistics partners create shipments and provide real-time tracking until delivery.' },
];

const inp = 'w-full bg-[#faf7f2] border border-[#d4c4a0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6b5a2e] placeholder-gray-400';
const lbl = 'block text-sm font-medium text-[#5a4a2a] mb-1.5';

function RegisterForm({ onSwitchToLogin }) {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]     = useState({ name:'',email:'',password:'',role:'importer',companyName:'',country:'',phone:'' });
  const [loading, setLoading] = useState(false);
  const ch = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault(); setLoading(true);
    try { await api.post('/auth/register', form); toast.success('Registration successful! Awaiting admin approval.'); onSwitchToLogin(); }
    catch (err) { toast.error(err.response?.data?.message || 'Registration failed'); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div><label className={lbl}>Full Name</label><input name="name" value={form.name} onChange={ch} required placeholder="John Doe" className={inp} /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className={lbl}>Email Address</label><input type="email" name="email" value={form.email} onChange={ch} required placeholder="you@company.com" className={inp} /></div>
        <div><label className={lbl}>Phone Number</label><input type="tel" name="phone" value={form.phone} onChange={ch} placeholder="+91 9876543210" className={inp} /></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className={lbl}>Role</label>
          <select name="role" value={form.role} onChange={ch} className={inp+' bg-[#faf7f2]'}>
            <option value="importer">Importer</option>
            <option value="exporter">Exporter</option>
            <option value="logistics">Logistics Provider</option>
          </select>
        </div>
        <div><label className={lbl}>Country</label><input name="country" value={form.country} onChange={ch} placeholder="India" className={inp} /></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className={lbl}>Company Name</label><input name="companyName" value={form.companyName} onChange={ch} placeholder="Acme Corp" className={inp} /></div>
        <div><label className={lbl}>Password</label><input type="password" name="password" value={form.password} onChange={ch} required placeholder="••••••••" className={inp} /></div>
      </div>
      <button type="submit" disabled={loading} className="w-full bg-[#6b5a2e] hover:bg-[#4a3f20] disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-colors mt-1">
        {loading ? 'Creating account…' : 'Register Now'}
      </button>
      <p className="text-center text-sm text-gray-500 pt-1">
        Already have an account?{' '}
        <button type="button" onClick={onSwitchToLogin} className="text-[#6b5a2e] font-semibold hover:underline">Sign In</button>
      </p>
    </form>
  );
}

function SignInForm({ onSwitchToRegister }) {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]     = useState({ email:'', password:'' });
  const [loading, setLoading] = useState(false);
  const ch = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault(); setLoading(true);
    try { const { data } = await api.post('/auth/login', form); login(data.token, data.user); toast.success('Welcome back!'); navigate('/dashboard'); }
    catch (err) { toast.error(err.response?.data?.message || 'Login failed'); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div><label className={lbl}>Email Address</label><input type="email" name="email" value={form.email} onChange={ch} required placeholder="you@company.com" className={inp} /></div>
      <div><label className={lbl}>Password</label><input type="password" name="password" value={form.password} onChange={ch} required placeholder="••••••••" className={inp} /></div>
      <button type="submit" disabled={loading} className="w-full bg-[#6b5a2e] hover:bg-[#4a3f20] disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-colors">
        {loading ? 'Signing in…' : 'Sign In'}
      </button>
      <p className="text-center text-sm text-gray-500">
        Don't have an account?{' '}
        <button type="button" onClick={onSwitchToRegister} className="text-[#6b5a2e] font-semibold hover:underline">Register</button>
      </p>
    </form>
  );
}

function AuthSection({ mode, onSwitch }) {
  const isRegister = mode === 'register';
  return (
    <section id="auth" className="bg-[#f5f0e8] py-14">
      <div className="max-w-6xl mx-auto px-6 flex gap-8 items-stretch">
        <div className="w-full md:w-3/5 bg-[#ede8dc] rounded-2xl px-8 md:px-12 py-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-[#3a2e1a] mb-8">{isRegister ? 'Create Your Account' : 'Welcome Back'}</h2>
          {isRegister ? <RegisterForm onSwitchToLogin={() => onSwitch('signin')} /> : <SignInForm onSwitchToRegister={() => onSwitch('register')} />}
        </div>
        <div className="hidden md:flex md:w-2/5 flex-col gap-4">
          <div className="relative rounded-2xl overflow-hidden flex-1">
            <img src={isRegister ? AUTH_IMG : SIGNIN_IMG} alt="trade" className="w-full h-full object-cover transition-all duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#3a2e1a]/60 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5">
              <p className="text-[#d4b896] text-xs font-semibold tracking-widest uppercase mb-1">{isRegister ? '• Join the Network' : '• Welcome Back'}</p>
              <p className="text-white font-bold text-lg leading-snug">{isRegister ? 'Connect with global importers & exporters' : 'Continue your global trade journey'}</p>
            </div>
          </div>
          <div className="bg-[#6b5a2e] rounded-2xl px-6 py-4 flex justify-between items-center">
            {STATS.map((s, i) => (
              <div key={s.label} className="flex items-center gap-3">
                {i > 0 && <div className="w-px h-8 bg-white/20" />}
                <div className="text-center">
                  <p className="text-white font-bold text-xl">{s.value}</p>
                  <p className="text-[#d4b896] text-xs">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Landing() {
  const [authMode, setAuthMode] = useState('none');
  const authRef = useRef(null);

  const openAuth = (mode) => {
    setAuthMode(mode);
    setTimeout(() => authRef.current?.scrollIntoView({ behavior:'smooth', block:'start' }), 50);
  };

  return (
    <div className="font-sans text-gray-900 bg-[#faf7f2]">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-[#faf7f2]/95 backdrop-blur border-b border-[#e8dfc8]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => { setAuthMode('none'); window.scrollTo({ top:0, behavior:'smooth' }); }} className="flex items-center gap-2">
            <Globe2 size={24} className="text-[#6b5a2e]" />
            <span className="text-lg font-bold text-gray-900">Midz<span className="text-[#6b5a2e]">Global</span></span>
          </button>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
            <a href="#services" className="hover:text-[#6b5a2e] transition-colors">Services</a>
            <a href="#about"    className="hover:text-[#6b5a2e] transition-colors">About Us</a>
            <a href="#process"  className="hover:text-[#6b5a2e] transition-colors">How It Works</a>
            <button onClick={() => openAuth('signin')} className="hover:text-[#6b5a2e] transition-colors">Sign In</button>
          </div>
          <button onClick={() => openAuth('register')} className="bg-[#6b5a2e] hover:bg-[#4a3f20] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors">Get Started</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-[88vh] flex items-end overflow-hidden">
        <img src={HERO_BG} alt="Global trade port" className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2a1f0e]/85 via-[#3a2e1a]/55 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20 pt-32">
          <p className="text-[#d4b896] text-xs font-semibold tracking-widest uppercase mb-4">• Global B2B Trade Platform</p>
          <h1 className="text-white text-5xl md:text-6xl lg:text-7xl font-bold leading-tight max-w-2xl mb-8">
            Connect. Trade.{' '}<em className="font-serif italic font-normal">Deliver globally.</em>
          </h1>
          <div className="flex flex-wrap gap-4">
            <button onClick={() => openAuth('register')} className="flex items-center gap-2 bg-[#6b5a2e] hover:bg-[#4a3f20] text-white font-semibold px-6 py-3 rounded-full transition-colors">
              Start Trading <ArrowUpRight size={16} />
            </button>
            <a href="#services" className="flex items-center gap-2 border border-white/60 text-white hover:bg-white/10 font-semibold px-6 py-3 rounded-full transition-colors">Explore Services</a>
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="bg-[#faf7f2] py-10 border-b border-dashed border-[#d4c4a0]">
        <p className="text-center text-sm text-gray-500 mb-6">Trusted by leading trade organisations worldwide</p>
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap items-center justify-center gap-10">
          {PARTNERS.map((p) => (
            <div key={p} className="flex items-center gap-2 text-[#a89060] font-semibold text-sm opacity-70 hover:opacity-100 transition-opacity">
              <Globe2 size={16} />{p}
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-20 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICES.map((s, i) => (
            <div key={s.title} className="relative rounded-2xl overflow-hidden group cursor-pointer">
              <img src={s.img} alt={s.title} className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <h3 className="font-bold text-lg mb-1">{s.title}</h3>
                {i === 0 && <p className="text-sm text-gray-200 leading-relaxed">{s.desc}</p>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="bg-[#f5f0e8] py-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-14 items-center">
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <img src={ABOUT_IMG} alt="Trade partnership" className="w-full h-[420px] object-cover" />
          </div>
          <div>
            <p className="text-[#6b5a2e] text-xs font-semibold tracking-widest uppercase mb-4">• About Us</p>
            <p className="text-3xl md:text-4xl font-bold text-[#3a2e1a] leading-snug mb-8">
              At MidzGlobal, we believe international trade should be simple, transparent, and accessible to every business.
            </p>
            <button onClick={() => openAuth('register')} className="inline-flex items-center gap-2 bg-[#6b5a2e] hover:bg-[#4a3f20] text-white font-semibold px-6 py-3 rounded-full transition-colors mb-10">
              Join the Platform <ArrowUpRight size={16} />
            </button>
            <div className="grid grid-cols-3 gap-6 border-t border-[#d4c4a0] pt-8">
              {STATS.map((s) => (
                <div key={s.label}>
                  <p className="text-4xl font-bold text-[#6b5a2e]">{s.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="process" className="bg-[#6b5a2e] py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[#d4b896] text-xs font-semibold tracking-widest uppercase mb-3">• How It Works</p>
            <h2 className="text-white text-4xl md:text-5xl font-bold leading-tight">
              Transforming your trade into{' '}<em className="font-serif italic font-normal">seamless commerce.</em>
            </h2>
          </div>
          <div className="relative">
            <div className="hidden md:block absolute top-0 bottom-0 w-px bg-white/25" style={{ left:'calc(55% - 1px)' }} />
            <div className="space-y-16">
              {PROCESS_STEPS.map((step) => (
                <div key={step.num} className="flex flex-col md:flex-row items-center">
                  <div className="w-full md:w-[55%] flex justify-end pr-8">
                    <div className="rounded-2xl overflow-hidden shadow-2xl w-full max-w-sm">
                      <img src={step.img} alt={step.title} className="w-full h-52 object-cover" />
                    </div>
                  </div>
                  <div className="hidden md:flex shrink-0 z-10 justify-center" style={{ width:'2.75rem' }}>
                    <div className="w-11 h-11 rounded-full bg-[#8a7545] border-2 border-[#c4a96a] flex items-center justify-center text-white font-bold text-base shadow-lg">{step.num}</div>
                  </div>
                  <div className="flex-1 pl-8 mt-6 md:mt-0">
                    <div className="flex items-center gap-3 mb-3 md:hidden">
                      <div className="w-9 h-9 rounded-full bg-[#8a7545] border border-[#c4a96a] flex items-center justify-center text-white font-bold text-sm">{step.num}</div>
                    </div>
                    <h3 className="text-white text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-[#d4c4a8] text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AUTH SECTION */}
      <div ref={authRef}>
        {authMode !== 'none' && <AuthSection mode={authMode} onSwitch={(m) => { setAuthMode(m); setTimeout(() => authRef.current?.scrollIntoView({ behavior:'smooth', block:'start' }), 50); }} />}
      </div>

      {/* CTA */}
      <section className="relative py-32 overflow-hidden">
        <img src={CTA_BG} alt="Warehouse" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 flex items-center justify-center">
          <div className="bg-white/95 backdrop-blur rounded-3xl px-10 py-12 max-w-xl mx-6 text-center shadow-2xl">
            <p className="text-[#6b5a2e] text-xs font-semibold tracking-widest uppercase mb-3">• Get Started</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#3a2e1a] leading-snug mb-8">Ready to Begin Your Global Trade Journey?</h2>
            <div className="flex flex-wrap gap-4 justify-center">
              <button onClick={() => openAuth('register')} className="flex items-center gap-2 bg-[#6b5a2e] hover:bg-[#4a3f20] text-white font-semibold px-6 py-3 rounded-full transition-colors">
                Start Trading <ArrowUpRight size={16} />
              </button>
              <a href="#services" className="flex items-center gap-2 border-2 border-[#6b5a2e] text-[#6b5a2e] hover:bg-[#6b5a2e] hover:text-white font-semibold px-6 py-3 rounded-full transition-colors">Explore Services</a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#3a2e1a] text-[#c4b090] py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Globe2 size={20} className="text-[#d4b896]" />
            <span className="font-bold text-white text-lg">Midz<span className="text-[#d4b896]">Global</span></span>
          </div>
          <p className="text-sm text-center">© {new Date().getFullYear()} MidzGlobal. Connecting importers, exporters & logistics worldwide.</p>
          <div className="flex gap-6 text-sm">
            <button onClick={() => openAuth('signin')}   className="hover:text-white transition-colors">Sign In</button>
            <button onClick={() => openAuth('register')} className="hover:text-white transition-colors">Register</button>
          </div>
        </div>
      </footer>

    </div>
  );
}
