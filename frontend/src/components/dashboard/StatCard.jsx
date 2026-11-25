import React from 'react';

const StatCard = ({ title, value, subtitle, icon: Icon, color = 'emerald', trend }) => {
  const colorStyles = {
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      iconBg: 'bg-emerald-500',
      pill: 'bg-emerald-100 text-emerald-800'
    },
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      iconBg: 'bg-blue-500',
      pill: 'bg-blue-100 text-blue-800'
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      iconBg: 'bg-amber-500',
      pill: 'bg-amber-100 text-amber-800'
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      border: 'border-purple-200',
      iconBg: 'bg-purple-500',
      pill: 'bg-purple-100 text-purple-800'
    }
  };

  const currentTheme = colorStyles[color] || colorStyles.emerald;

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {title}
          </p>
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-400 font-medium pt-1">
              {subtitle}
            </p>
          )}
        </div>

        <div className={`w-12 h-12 rounded-2xl ${currentTheme.bg} flex items-center justify-center text-white shadow-inner group-hover:scale-110 transition-transform`}>
          <div className={`w-8 h-8 rounded-xl ${currentTheme.iconBg} flex items-center justify-center shadow-xs`}>
            {Icon && <Icon className="w-4 h-4 text-white" />}
          </div>
        </div>
      </div>

      {trend && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-400">vs. last week</span>
          <span className={`px-2 py-0.5 rounded-full font-bold ${currentTheme.pill}`}>
            {trend}
          </span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
