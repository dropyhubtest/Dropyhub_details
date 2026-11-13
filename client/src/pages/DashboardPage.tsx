import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { StatsCards } from '../components/StatsCards';
import { PartnerTable } from '../components/PartnerTable';
import { PartnerDetailModal } from '../components/PartnerDetailModal';
import { api, PartnerApplication, DashboardStats, FilterParams } from '../api/client';
import { RefreshCw } from 'lucide-react';

const DEFAULT_FILTERS: FilterParams = {
  search: '',
  type: 'ALL',
  city: 'ALL',
  company: 'ALL',
  bike: 'ALL',
  license: 'ALL',
  dateRange: 'ALL',
  page: 1,
  limit: 15,
};

export const DashboardPage: React.FC = () => {
  const [partners, setPartners] = useState<PartnerApplication[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<FilterParams>(DEFAULT_FILTERS);
  const [selectedPartner, setSelectedPartner] = useState<PartnerApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [partnersRes, statsRes] = await Promise.all([
        api.getPartners(filters),
        api.getStats(),
      ]);

      setPartners(partnersRes.data || []);
      setTotal(partnersRes.pagination?.total || 0);
      setTotalPages(partnersRes.pagination?.totalPages || 1);
      setStats(statsRes);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [
    filters.page,
    filters.type,
    filters.city,
    filters.company,
    filters.bike,
    filters.license,
    filters.dateRange,
    filters.search,
  ]);

  const handleFilterChange = (newFilters: Partial<FilterParams>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white flex flex-col font-body relative">
      {/* Signature DropyHub Side Rails (Matching Hero & Section layout) */}
      <div className="dropy-side-rail-left" />
      <div className="dropy-side-rail-right" />

      <Navbar />

      <main className="flex-1 w-full max-w-[1360px] mx-auto px-6 sm:px-12 py-10 relative z-20">
        {/* Page Heading & Controls */}
        <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.14em] uppercase text-[#888888] font-medium mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-dropy-accentPink inline-block" />
              CANDIDATE INTELLIGENCE &amp; DATA DIRECTORY
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-[-0.03em] uppercase">
              PARTNER &amp; FLEET ROSTER
            </h1>
          </div>

          <button
            onClick={() => fetchDashboardData(true)}
            disabled={refreshing}
            className="inline-flex items-center space-x-2 text-xs font-body font-semibold tracking-[0.05em] uppercase px-4 h-[38px] rounded-[4px] bg-[#272727] hover:bg-[#353333] border border-white/[0.08] text-white transition-all shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-dropy-accentPink ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'SYNCING DATA...' : 'LIVE REFRESH'}</span>
          </button>
        </div>

        {/* High-level metrics block */}
        <StatsCards stats={stats} loading={loading} />

        {/* Comprehensive Filterable Partner Data Table */}
        <PartnerTable
          partners={partners}
          total={total}
          page={filters.page || 1}
          totalPages={totalPages}
          loading={loading}
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          onSelectPartner={setSelectedPartner}
        />
      </main>

      {/* Full Candidate Details Modal (Read-Only Dossier) */}
      <PartnerDetailModal
        partner={selectedPartner}
        onClose={() => setSelectedPartner(null)}
      />
    </div>
  );
};
