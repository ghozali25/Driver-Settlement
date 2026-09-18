import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Settings, Search, Plus, LogOut, Bell } from 'lucide-react';

type Driver = {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'on-route';
  earnings: number;
  expenses: number;
  route: string;
  lastPayment: string;
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'drivers' | 'settings'>('dashboard');
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const res = await fetch('/api/drivers');
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        setDrivers(data.drivers);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchDrivers();
  }, []);

  const filtered = drivers.filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getBadge = (status: string) => {
    const base = "px-2 py-1 text-xs rounded";
    switch (status) {
      case 'active':
        return <span className={`${base} bg-emerald-50 text-emerald-600`}>Active</span>;
      case 'on-route':
        return <span className={`${base} bg-blue-50 text-blue-600`}>On Route</span>;
      case 'inactive':
        return <span className={`${base} bg-slate-100 text-slate-600`}>Inactive</span>;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800">
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="p-6 border-b">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold">
            DS
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-2 px-3 py-2 rounded ${activeTab === 'dashboard' ? 'bg-blue-100' : ''}`}>
            <LayoutDashboard className="w-4 h-4"/> Dashboard
          </button>
          <button onClick={() => setActiveTab('drivers')} className={`w-full flex items-center gap-2 px-3 py-2 rounded ${activeTab === 'drivers' ? 'bg-blue-100' : ''}`}>
            <Users className="w-4 h-4"/> Drivers
          </button>
          <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-2 px-3 py-2 rounded ${activeTab === 'settings' ? 'bg-blue-100' : ''}`}>
            <Settings className="w-4 h-4"/> Settings
          </button>
        </nav>
        <div className="p-4">
          <button className="flex items-center gap-2 w-full text-red-600">
            <LogOut className="w-4 h-4"/> Log Out
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6 overflow-auto">
        <header className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
              <input type="text" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-8 pr-2 py-1 border rounded"/>
            </div>
            <Plus className="w-5 h-5 text-blue-600"/>
            <Bell className="w-5 h-5 text-slate-400"/>
          </div>
        </header>
        {activeTab === 'drivers' && (
          <div>
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-600">{error}</p>}
            {!loading && !error && (
              <table className="min-w-full border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">Driver</th>
                    <th className="p-2 text-left">Status</th>
                    <th className="p-2 text-left">Route</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(d => (
                    <tr key={d.id} className="border-t">
                      <td className="p-2 flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm">
                          {d.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{d.name}</p>
                          <p className="text-xs text-slate-500">{d.id}</p>
                        </div>
                      </td>
                      <td className="p-2">{getBadge(d.status)}</td>
                      <td className="p-2">{d.route}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
        {/* Dashboard and Settings tabs can be added later */}
      </main>
    </div>
  );
}
