import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import StatCard from '../components/dashboard/StatCard';
import { 
  ShieldAlert, 
  Users, 
  Database, 
  Cpu, 
  Trash2, 
  Search, 
  CheckCircle2, 
  AlertTriangle,
  History,
  Layers,
  Sparkles
} from 'lucide-react';
import { getCategoryMeta } from '../utils/wasteCategories';

const AdminPage = () => {
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [classifications, setClassifications] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'users', 'scans'
  const [loading, setLoading] = useState(true);
  const [userSearch, setUserSearch] = useState('');

  const fetchOverview = async () => {
    try {
      const res = await adminAPI.getOverview();
      setOverview(res.data);
    } catch (err) {
      console.error('[Admin Overview Error]:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await adminAPI.getUsers({ search: userSearch || undefined });
      setUsers(res.data.users || []);
    } catch (err) {
      console.error('[Admin Users Error]:', err);
    }
  };

  const fetchClassifications = async () => {
    try {
      const res = await adminAPI.getAllClassifications({ limit: 50 });
      setClassifications(res.data.items || []);
    } catch (err) {
      console.error('[Admin Scans Error]:', err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchOverview(), fetchUsers(), fetchClassifications()]);
      setLoading(false);
    };
    init();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await adminAPI.deleteUser(userId);
      fetchUsers();
      fetchOverview();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to delete user.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold mb-2">
            <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
            <span>Administrator Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            System & Operations Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Global monitoring of waste stream data, user accounts, and neural network inference performance
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Registered Users"
          value={overview?.total_users ?? 0}
          subtitle="Active community members"
          icon={Users}
          color="emerald"
        />
        <StatCard
          title="Global Waste Classifications"
          value={overview?.total_classifications ?? 0}
          subtitle="Processed through neural net"
          icon={Layers}
          color="blue"
        />
        <StatCard
          title="Database Persistence"
          value={overview?.database_mode?.includes('MongoDB') ? 'MongoDB Atlas' : 'Motor Fallback'}
          subtitle="High-availability storage"
          icon={Database}
          color="purple"
        />
        <StatCard
          title="Neural AI Model Engine"
          value="MobileNetV2"
          subtitle="ImageNet Transfer Weights"
          icon={Cpu}
          color="amber"
        />
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex p-1 bg-slate-100 rounded-2xl max-w-md">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'overview' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
          }`}
        >
          Stream Overview
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'users' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
          }`}
        >
          User Accounts ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('scans')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'scans' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
          }`}
        >
          All Scans Audit ({classifications.length})
        </button>
      </div>

      {/* Tab 1: Overview Breakdown */}
      {activeTab === 'overview' && overview && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Global Waste Stream Volume
            </h3>
            <div className="space-y-3 pt-2">
              {Object.entries(overview.category_counts || {}).map(([catName, count]) => {
                const meta = getCategoryMeta(catName);
                const percent = overview.total_classifications > 0
                  ? Math.round((count / overview.total_classifications) * 100)
                  : 0;
                return (
                  <div key={catName} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="flex items-center space-x-2 text-slate-700">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: meta.binColor }} />
                        <span>{catName}</span>
                      </span>
                      <span className="font-bold text-slate-600">{count} scans ({percent}%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: meta.binColor }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              AI Model & Inference Health
            </h3>
            <div className="space-y-3 text-xs pt-2">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 font-medium">Model Status:</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">Online & Loaded</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 font-medium">Audited Precision:</span>
                <span className="font-bold text-slate-800">{overview.feedback_accuracy}% Validated</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 font-medium">Input Preprocessing:</span>
                <span className="font-bold text-slate-800">OpenCV 224x224 RGB Normalizer</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 font-medium">Active Database Connection:</span>
                <span className="font-bold text-emerald-700">{overview.database_mode}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: User Accounts Directory */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Registered Community Users</h3>
            <span className="text-xs text-slate-400">{users.length} Total Users</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4 rounded-l-xl">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Eco Points</th>
                  <th className="py-3 px-4">Scans</th>
                  <th className="py-3 px-4">Joined</th>
                  <th className="py-3 px-4 rounded-r-xl text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{u.full_name || 'No Name'}</div>
                      <div className="text-[11px] text-slate-400">{u.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-amber-700">{u.eco_points} pts</td>
                    <td className="py-3 px-4 font-medium text-slate-700">{u.scans_count}</td>
                    <td className="py-3 px-4 text-slate-400">
                      {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'Recent'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                          title="Delete user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Global Classifications Audit Log */}
      {activeTab === 'scans' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Global Classifications Audit</h3>
            <span className="text-xs text-slate-400">Showing recent 50 scans</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4 rounded-l-xl">Item Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Confidence</th>
                  <th className="py-3 px-4">Bin Assigned</th>
                  <th className="py-3 px-4">Feedback</th>
                  <th className="py-3 px-4 rounded-r-xl">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {classifications.map((s) => {
                  const meta = getCategoryMeta(s.category);
                  return (
                    <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">{s.item_name}</td>
                      <td className="py-3 px-4">
                        <span 
                          className="px-2 py-0.5 rounded-full font-bold text-[10px] uppercase"
                          style={{ backgroundColor: `${meta.binColor}15`, color: meta.binColor }}
                        >
                          {s.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-600">{Math.round(s.confidence * 100)}%</td>
                      <td className="py-3 px-4 font-medium text-slate-700">{s.disposal_guide?.bin_color || 'Bin'}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          s.feedback === 'accurate' ? 'bg-emerald-100 text-emerald-800' :
                          s.feedback === 'inaccurate' ? 'bg-red-100 text-red-800' :
                          'text-slate-400'
                        }`}>
                          {s.feedback || 'unrated'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {s.timestamp ? new Date(s.timestamp).toLocaleString() : 'Recent'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPage;
