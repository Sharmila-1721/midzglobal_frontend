import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Globe2 } from 'lucide-react';

const roleBadge = {
  admin:     'bg-[#3a2e1a] text-[#d4b896]',
  exporter:  'bg-[#6b5a2e]/15 text-[#6b5a2e]',
  importer:  'bg-[#6b5a2e]/15 text-[#6b5a2e]',
  logistics: 'bg-[#6b5a2e]/15 text-[#6b5a2e]',
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-[#faf7f2] border-b border-[#e8dfc8] sticky top-0 z-50 h-16 flex items-center">
      <div className="w-full px-6 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2">
          <Globe2 size={22} className="text-[#6b5a2e]" />
          <span className="text-lg font-bold text-gray-900">
            Midz<span className="text-[#6b5a2e]">Global</span>
          </span>
        </Link>
        {user && (
          <div className="flex items-center gap-4">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${roleBadge[user.role] || 'bg-[#6b5a2e]/10 text-[#6b5a2e]'}`}>
              {user.role}
            </span>
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-semibold text-[#3a2e1a]">{user.name}</span>
              {user.companyName && <span className="text-xs text-[#a89060]">{user.companyName}</span>}
            </div>
            <button
              onClick={() => { logout(); navigate('/'); }}
              className="flex items-center gap-1.5 text-sm text-[#a89060] hover:text-[#6b5a2e] transition-colors border border-[#e8dfc8] hover:border-[#6b5a2e] px-3 py-1.5 rounded-full"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
