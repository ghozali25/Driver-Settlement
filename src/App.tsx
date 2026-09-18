import React, { useState } from 'react';
import { User, DollarSign, MapPin, FileText, TrendingUp, TrendingDown, Search, Filter } from 'lucide-react';

type Driver = {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'on-route';
  earnings: number;
  expenses: number;
  route: string;
  lastPayment: string;
  documents: number;
};

const mockDrivers: Driver[] = [
  { id: 'DRV-001', name: 'John Smith', status: 'active', earnings: 2500, expenses: 450, route: 'NYC-Washington', lastPayment: '2024-01-15', documents: 3 },
  { id: 'DRV-002', name: 'Maria Garcia', status: 'on-route', earnings: 1800, expenses: 320, route: 'Boston-Philadelphia', lastPayment: '2024-01-14', documents: 2 },
  { id: 'DRV-003', name: 'Robert Chen', status: 'inactive', earnings: 3200, expenses: 600, route: 'Chicago-Miami', lastPayment: '2024-01-10', documents: 5 },
  { id: 'DRV-004', name: 'Sarah Johnson', status: 'active', earnings: 2100, expenses: 380, route: 'Seattle-Portland', lastPayment: '2024-01-16', documents: 1 },
];

export default function App() {
  const [drivers, setDrivers] = useState<Driver[]>(mockDrivers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || driver.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalEarnings = filteredDrivers.reduce((sum, d) => sum + d.earnings, 0);
  const totalExpenses = filteredDrivers.reduce((sum, d) => sum + d.expenses, 0);
  const netSettlement = totalEarnings - totalExpenses;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-gradient-to-r from-green-400 to-green-500 text-white shadow-lg shadow-green-200';
      case 'on-route': return 'bg-gradient-to-r from-blue-400 to-blue-500 text-white shadow-lg shadow-blue-200';
      case 'inactive': return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg shadow-gray-200';
      default: return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg shadow-gray-200';
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 relative">
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl -z-10"></div>
          <div className="relative p-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                  Driver Settlement Management System
                </h1>
                <p className="text-gray-600 text-lg">Manage driver settlements, routes, and payments efficiently.</p>
              </div>
              <div className="hidden md:block">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 opacity-90"></div>
            <div className="relative p-8 text-white">
              <div className="flex items-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                  <DollarSign className="h-8 w-8 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-green-100">Total Earnings</p>
                  <p className="text-3xl font-bold">${totalEarnings.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-red-600 opacity-90"></div>
            <div className="relative p-8 text-white">
              <div className="flex items-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                  <TrendingDown className="h-8 w-8 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-red-100">Total Expenses</p>
                  <p className="text-3xl font-bold">${totalExpenses.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 opacity-90"></div>
            <div className="relative p-8 text-white">
              <div className="flex items-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-blue-100">Net Settlement</p>
                  <p className="text-3xl font-bold">${netSettlement.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl mb-10 overflow-hidden border border-gray-200/50">
          <div className="p-8 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200/50">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Driver Directory</h2>
                <p className="text-gray-600">Manage and monitor all driver settlements and activities</p>
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Search drivers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm w-full md:w-64"
                  />
                </div>
                <div className="relative group">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="pl-12 pr-8 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm appearance-none w-full md:w-40"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="on-route">On Route</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
                <tr>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Driver ID</th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Route</th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Earnings</th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Expenses</th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Last Payment</th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Documents</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDrivers.map((driver) => (
                  <tr key={driver.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 transform hover:scale-[1.02]">
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="text-sm font-mono font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-lg inline-block">
                        {driver.id}
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{driver.name}</div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <span className={`inline-flex px-4 py-2 text-sm font-bold rounded-full ${getStatusColor(driver.status)} transform transition-all duration-300 hover:scale-110`}>{driver.status}</span>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-blue-100 rounded-full p-2 mr-3">
                          <MapPin className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="text-sm text-gray-900 font-medium">{driver.route}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="text-sm text-green-700 font-bold bg-green-100 px-3 py-2 rounded-lg inline-block">
                        ${driver.earnings.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="text-sm text-red-700 font-bold bg-red-100 px-3 py-2 rounded-lg inline-block">
                        ${driver.expenses.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium bg-gray-100 px-3 py-2 rounded-lg inline-block">
                        {driver.lastPayment}
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-purple-100 rounded-full p-2 mr-2">
                          <FileText className="h-4 w-4 text-purple-600" />
                        </div>
                        <span className="text-sm font-bold text-gray-900">{driver.documents}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredDrivers.length === 0 && (
            <div className="p-16 text-center">
              <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <div className="text-xl font-semibold text-gray-500 mb-2">No drivers found matching your criteria.</div>
              <div className="text-gray-400">Try adjusting your search or filter settings.</div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
