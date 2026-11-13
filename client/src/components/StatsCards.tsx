import React from 'react';
import { DashboardStats } from '../api/client';
import { Users, Bike, Building2, MapPin } from 'lucide-react';

interface StatsProps {
  stats: DashboardStats | null;
  loading: boolean;
}

export const StatsCards: React.FC<StatsProps> = ({ stats, loading }) => {
  const citiesCount = stats?.cityDistribution
    ? Object.keys(stats.cityDistribution).filter(c => c && c !== 'Unknown').length
    : 0;

  const metrics = [
    {
      title: 'TOTAL INBOUND LEADS',
      value: stats?.total ?? 0,
      icon: Users,
      label: 'All Portal Submissions',
      badge: 'Master Pool',
      color: 'text-white',
    },
    {
      title: 'DELIVERY FLEET',
      value: stats?.deliveryCount ?? 0,
      icon: Bike,
      label: 'Two-Wheeler & EV Riders',
      badge: 'Fleet Candidates',
      color: 'text-sky-400',
    },
    {
      title: 'WAREHOUSE ROSTER',
      value: stats?.warehouseCount ?? 0,
      icon: Building2,
      label: 'Store & Fulfillment Staff',
      badge: 'Hub Candidates',
      color: 'text-amber-400',
    },
    {
      title: 'COVERED METROS',
      value: citiesCount > 0 ? citiesCount : 1,
      icon: MapPin,
      label: 'Active Delivery Hubs',
      badge: 'Geographic Scale',
      color: 'text-dropy-accentPink',
    },
  ];

  return (
    <div className="w-full mb-10">
      {/* Unified Stats Grid inspired by StatsWhySection in dropyhub-website */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-[#141414] border border-white/[0.08] rounded-xl overflow-hidden shadow-2xl">
        {metrics.map((item, idx) => {
          const Icon = item.icon;
          const isLast = idx === metrics.length - 1;
          return (
            <div
              key={idx}
              className={`p-6 sm:p-7 relative group hover:bg-[#181818] transition-colors duration-200 ${
                !isLast ? 'border-b sm:border-b-0 sm:border-r border-white/[0.08]' : ''
              }`}
            >
              {/* Subtle top brand hairline on hover */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-transparent group-hover:bg-gradient-to-r group-hover:from-transparent group-hover:via-dropy-accent group-hover:to-transparent transition-all duration-300" />

              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono tracking-[0.14em] uppercase text-[#888888] font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-dropy-accent inline-block" />
                  {item.title}
                </span>
                <div className="w-8 h-8 rounded bg-[#1e1e1e] border border-white/5 flex items-center justify-center text-[#9797aa] group-hover:text-white transition-colors">
                  <Icon className={`w-4 h-4 ${item.color}`} />
                </div>
              </div>

              <div className="text-[38px] font-display font-extrabold text-white tracking-[-0.03em] leading-none mb-2">
                {loading ? (
                  <div className="h-10 w-20 bg-white/5 rounded animate-pulse" />
                ) : (
                  item.value
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-[#807f7f] font-body">
                <span>{item.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
