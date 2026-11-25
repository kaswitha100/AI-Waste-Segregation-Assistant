import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { analyticsAPI, historyAPI } from '../services/api';
import StatCard from '../components/dashboard/StatCard';
import { 
  Camera, 
  Recycle, 
  Award, 
  Leaf, 
  TrendingUp, 
  Clock, 
  ChevronRight, 
  Sparkles,
  Droplets,
  ArrowUpRight
} from 'lucide-react';
import { getCategoryMeta } from '../utils/wasteCategories';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentScans, setRecentScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, historyRes] = await Promise.all([
          analyticsAPI.getSummary(),
          historyAPI.getHistory({ page: 1, limit: 5 })
        ]);
        setStats(statsRes.data);
        setRecentScans(historyRes.data.items || []);
      } catch (err) {
        console.error('[Dashboard Error]:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner: User Eco Profile */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-white">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sustainable Champion Status</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Hello, {user?.full_name || 'Eco Warrior'}! 👋
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm max-w-xl leading-relaxed">
            Every piece of waste you scan and segregate reduces greenhouse emissions and keeps municipal landfills clean.
          </p>
        </div>

        <div className="flex items-center space-x-3 z-10">
          <Link
            to="/scan"
            className="px-5 py-3 rounded-2xl bg-white text-emerald-800 font-bold text-sm shadow-md hover:bg-emerald-50 transition-all flex items-center space-x-2 hover:scale-105"
          >
            <Camera className="w-4 h-4 text-emerald-600" />
            <span>Scan Waste Item</span>
          </Link>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Scans Logged"
          value={stats?.total_scans ?? user?.scans_count ?? 0}
          subtitle="Processed by AI Engine"
          icon={Camera}
          color="emerald"
          trend="+18%"
        />
        <StatCard
          title="Eco Points Earned"
          value={user?.eco_points ?? stats?.eco_points ?? 0}
          subtitle="Redeemable Eco Rewards"
          icon={Award}
          color="amber"
          trend="+40 pts"
        />
        <StatCard
          title="CO₂ Emissions Avoided"
          value={`${stats?.total_co2_saved_kg ?? 0} kg`}
          subtitle="Landfill Methane Diverted"
          icon={Leaf}
          color="blue"
          trend="+1.2 kg"
        />
        <StatCard
          title="Landfill Diversion Rate"
          value={`${stats?.landfill_diversion_rate ?? 0}%`}
          subtitle="Recyclable & Compost Streams"
          icon={Recycle}
          color="purple"
          trend="Optimal"
        />
      </div>

      {/* Two Column Layout: Category Distribution & Recent Scans */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Category Breakdown Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Waste Stream Distribution
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Breakdown of your scanned items by category
            </p>
          </div>

          <div className="space-y-4">
            {stats?.category_distribution?.map((cat) => {
              const meta = getCategoryMeta(cat.category);
              const percentage = stats.total_scans > 0 
                ? Math.round((cat.count / stats.total_scans) * 100) 
                : 0;

              return (
                <div key={cat.category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-700 flex items-center space-x-1.5">
                      <span 
                        className="w-2.5 h-2.5 rounded-full" 
                        style={{ backgroundColor: meta.binColor }}
                      />
                      <span>{cat.category}</span>
                    </span>
                    <span className="text-slate-500 font-bold">
                      {cat.count} items ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${percentage}%`, 
                        backgroundColor: meta.binColor 
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100">
            <Link
              to="/analytics"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center justify-between group"
            >
              <span>View full analytics & weekly trends</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Recent Scans Activity List */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Recent Classification History
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Latest items processed through the AI pipeline
              </p>
            </div>
            <Link
              to="/history"
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center space-x-1"
            >
              <span>See All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentScans.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-3">
              <Camera className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-xs font-medium">No items scanned yet.</p>
              <Link
                to="/scan"
                className="inline-block px-4 py-2 bg-emerald-600 text-white font-semibold text-xs rounded-lg shadow-sm"
              >
                Scan Your First Item
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentScans.map((scan) => {
                const meta = getCategoryMeta(scan.category);
                return (
                  <div key={scan.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center space-x-3.5 min-w-0">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                        style={{ backgroundColor: meta.binColor }}
                      >
                        {scan.category.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">
                          {scan.item_name}
                        </p>
                        <p className="text-xs text-slate-400 flex items-center space-x-2">
                          <span className="font-medium" style={{ color: meta.binColor }}>
                            {scan.category}
                          </span>
                          <span>•</span>
                          <span>{Math.round(scan.confidence * 100)}% AI Match</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0 text-xs">
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 font-semibold text-slate-600 block mb-1">
                        {scan.disposal_guide?.bin_color || 'Bin'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {scan.timestamp ? new Date(scan.timestamp).toLocaleDateString() : 'Recent'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default DashboardPage;
