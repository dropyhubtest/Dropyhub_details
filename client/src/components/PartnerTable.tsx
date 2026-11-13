import React, { useState } from 'react';
import { PartnerApplication, FilterParams, api } from '../api/client';
import {
  Search,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Bike,
  Building2,
  Calendar,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';

interface TableProps {
  partners: PartnerApplication[];
  total: number;
  page: number;
  totalPages: number;
  loading: boolean;
  filters: FilterParams;
  onFilterChange: (newFilters: Partial<FilterParams>) => void;
  onResetFilters: () => void;
  onSelectPartner: (p: PartnerApplication) => void;
}

export const PartnerTable: React.FC<TableProps> = ({
  partners,
  total,
  page,
  totalPages,
  loading,
  filters,
  onFilterChange,
  onResetFilters,
  onSelectPartner,
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const typeTabs = [
    { id: 'ALL', label: 'ALL CANDIDATES', icon: null },
    { id: 'DELIVERY_PARTNER', label: 'DELIVERY FLEET', icon: Bike },
    { id: 'WAREHOUSE_ASSOCIATE', label: 'WAREHOUSE & STORES', icon: Building2 },
  ];

  const cities = ['ALL', 'Bengaluru', 'Hyderabad', 'Chennai', 'Mumbai', 'Delhi NCR', 'Pune', 'Kolkata'];

  const platforms = [
    'ALL',
    'Swiggy',
    'Zepto',
    'Amazon',
    'Amazon Warehouse',
    'Zepto Stores',
    'Blinkit',
    'Blinkit Stores',
    'Rapido',
    'Flipkart',
  ];

  const bikeOptions = [
    { id: 'ALL', label: 'All Two-Wheelers' },
    { id: 'Yes', label: 'Owns Two-Wheeler' },
    { id: 'Rental Needed', label: 'Needs Vehicle Rental' },
    { id: 'No', label: 'No Two-Wheeler' },
  ];

  const licenseOptions = [
    { id: 'ALL', label: 'All Licenses' },
    { id: 'Yes', label: 'Has Driving License' },
    { id: 'No', label: 'No License' },
  ];

  const dateOptions = [
    { id: 'ALL', label: 'All Time' },
    { id: 'TODAY', label: 'Today (24h)' },
    { id: '7DAYS', label: 'Last 7 Days' },
    { id: '30DAYS', label: 'Last 30 Days' },
  ];

  const hasActiveFilters =
    (filters.type && filters.type !== 'ALL') ||
    (filters.city && filters.city !== 'ALL') ||
    (filters.company && filters.company !== 'ALL') ||
    (filters.bike && filters.bike !== 'ALL') ||
    (filters.license && filters.license !== 'ALL') ||
    (filters.dateRange && filters.dateRange !== 'ALL') ||
    Boolean(filters.search);

  const handleExportFiltered = async () => {
    setIsExporting(true);
    try {
      await api.exportFilteredCSV(filters);
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-[#141414] border border-white/[0.08] rounded-xl overflow-hidden shadow-2xl">
      {/* Operations Deck: Search & Multi-Filters */}
      <div className="p-6 sm:p-7 border-b border-white/[0.08] space-y-5">
        {/* Top Cohort Switcher & Export */}
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/[0.06] pb-5">
          <div className="flex items-center space-x-1.5 bg-[#0c0c0c] p-1 rounded-[6px] border border-white/[0.06]">
            {typeTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = (filters.type || 'ALL') === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onFilterChange({ type: tab.id, page: 1 })}
                  className={`flex items-center space-x-2 text-xs font-body tracking-[0.05em] px-4 py-2 rounded-[4px] transition-all duration-150 ${
                    isActive
                      ? 'bg-[#272727] text-white font-bold border border-white/10 shadow-sm'
                      : 'text-[#807f7f] hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center space-x-3">
            {hasActiveFilters && (
              <button
                onClick={onResetFilters}
                className="inline-flex items-center space-x-1.5 text-xs font-body text-[#807f7f] hover:text-white px-3 h-[38px] rounded-[4px] border border-white/[0.08] hover:bg-white/[0.04] transition-colors"
                title="Clear all active filters"
              >
                <RotateCcw className="w-3.5 h-3.5 text-dropy-accentPink" />
                <span>Reset Filters</span>
              </button>
            )}

            <button
              onClick={handleExportFiltered}
              disabled={isExporting || total === 0}
              className="inline-flex items-center justify-center space-x-2 h-[38px] px-5 rounded-[4px] bg-dropy-cta hover:bg-dropy-cta-hover text-white text-xs font-body font-bold tracking-[0.05em] uppercase transition-all shadow-md shadow-[#b6005d]/25 disabled:opacity-40"
              title="Download currently filtered candidate dataset"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? 'EXPORTING...' : `EXPORT CSV (${total})`}</span>
            </button>
          </div>
        </div>

        {/* Search Input matching dropy-input in ContactHeroForm */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#666666] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search candidates by name, mobile number, reference code, email, area..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ search: e.target.value, page: 1 })}
            className="w-full dropy-input pl-10 pr-4 h-[46px] text-[13.5px] font-body text-white placeholder-[#666666]"
          />
        </div>

        {/* Detailed Multi-Filter Controls */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 pt-1">
          {/* City Filter */}
          <div>
            <span className="text-[10px] font-mono tracking-[0.12em] text-[#888888] uppercase block mb-1.5 font-medium">
              Hub City
            </span>
            <select
              value={filters.city || 'ALL'}
              onChange={(e) => onFilterChange({ city: e.target.value, page: 1 })}
              className="w-full dropy-select px-3.5 h-[42px] text-xs font-body text-white cursor-pointer"
            >
              <option value="ALL">All Hub Cities</option>
              {cities.filter(c => c !== 'ALL').map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Platform / Store Filter */}
          <div>
            <span className="text-[10px] font-mono tracking-[0.12em] text-[#888888] uppercase block mb-1.5 font-medium">
              Target Company / Store
            </span>
            <select
              value={filters.company || 'ALL'}
              onChange={(e) => onFilterChange({ company: e.target.value, page: 1 })}
              className="w-full dropy-select px-3.5 h-[42px] text-xs font-body text-white cursor-pointer"
            >
              <option value="ALL">All Companies &amp; Stores</option>
              {platforms.filter(p => p !== 'ALL').map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Two-Wheeler Filter */}
          <div>
            <span className="text-[10px] font-mono tracking-[0.12em] text-[#888888] uppercase block mb-1.5 font-medium">
              Two-Wheeler
            </span>
            <select
              value={filters.bike || 'ALL'}
              onChange={(e) => onFilterChange({ bike: e.target.value, page: 1 })}
              className="w-full dropy-select px-3.5 h-[42px] text-xs font-body text-white cursor-pointer"
            >
              {bikeOptions.map((b) => (
                <option key={b.id} value={b.id}>{b.label}</option>
              ))}
            </select>
          </div>

          {/* Driving License Filter */}
          <div>
            <span className="text-[10px] font-mono tracking-[0.12em] text-[#888888] uppercase block mb-1.5 font-medium">
              Driving License
            </span>
            <select
              value={filters.license || 'ALL'}
              onChange={(e) => onFilterChange({ license: e.target.value, page: 1 })}
              className="w-full dropy-select px-3.5 h-[42px] text-xs font-body text-white cursor-pointer"
            >
              {licenseOptions.map((l) => (
                <option key={l.id} value={l.id}>{l.label}</option>
              ))}
            </select>
          </div>

          {/* Registration Date Filter */}
          <div className="col-span-2 sm:col-span-1">
            <span className="text-[10px] font-mono tracking-[0.12em] text-[#888888] uppercase block mb-1.5 font-medium">
              Registered Time
            </span>
            <select
              value={filters.dateRange || 'ALL'}
              onChange={(e) => onFilterChange({ dateRange: e.target.value, page: 1 })}
              className="w-full dropy-select px-3.5 h-[42px] text-xs font-body text-white cursor-pointer"
            >
              {dateOptions.map((d) => (
                <option key={d.id} value={d.id}>{d.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Candidates Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-body text-dropy-textSecondary">
          <thead className="bg-[#0c0c0c] text-[11px] font-mono uppercase tracking-[0.12em] text-[#807f7f] border-b border-white/[0.08]">
            <tr>
              <th className="py-4 px-6 font-semibold">Cohort</th>
              <th className="py-4 px-6 font-semibold">Candidate / Ref ID</th>
              <th className="py-4 px-6 font-semibold">Contact Info</th>
              <th className="py-4 px-6 font-semibold">Location</th>
              <th className="py-4 px-6 font-semibold">Qualifications</th>
              <th className="py-4 px-6 font-semibold">Target Company / Store</th>
              <th className="py-4 px-6 font-semibold">Date Registered</th>
              <th className="py-4 px-6 font-semibold text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={8} className="py-5 px-6">
                    <div className="h-5 bg-white/5 rounded w-full" />
                  </td>
                </tr>
              ))
            ) : partners.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-20 text-center text-[#807f7f]">
                  <Sparkles className="w-7 h-7 mx-auto mb-2.5 text-dropy-accentPink" />
                  <p className="font-display font-bold text-white text-base">No candidates match this specific filter criteria.</p>
                  <p className="text-xs mt-1 text-[#807f7f]">Adjust filters or clear your search keyword to view all registrations.</p>
                </td>
              </tr>
            ) : (
              partners.map((partner) => {
                const isWarehouse = partner.application_type === 'WAREHOUSE_ASSOCIATE';
                return (
                  <tr
                    key={partner.id}
                    onClick={() => onSelectPartner(partner)}
                    className="hover:bg-[#1a1a1a] cursor-pointer transition-colors duration-150 group"
                  >
                    {/* Role Pill */}
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[10px] font-mono font-bold px-2.5 py-1 rounded-[4px] border uppercase tracking-wider ${
                          isWarehouse
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/25'
                            : 'bg-sky-500/10 text-sky-300 border-sky-500/25'
                        }`}
                      >
                        {isWarehouse ? <Building2 className="w-3 h-3" /> : <Bike className="w-3 h-3" />}
                        <span>{isWarehouse ? 'WAREHOUSE' : 'DELIVERY'}</span>
                      </span>
                    </td>

                    {/* Name & Reference */}
                    <td className="py-4 px-6">
                      <div className="font-display font-bold text-white text-[14px] group-hover:text-dropy-accentPink transition-colors">
                        {partner.full_name}
                      </div>
                      <div className="font-mono text-[11px] text-[#807f7f] tracking-wider mt-0.5">
                        {partner.application_reference}
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-4 px-6">
                      <div className="font-mono text-white text-[13px] font-semibold">{partner.mobile_number}</div>
                      <div className="text-[11px] text-[#807f7f] truncate max-w-[160px] mt-0.5">
                        {partner.email || '—'}
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-4 px-6">
                      <div className="font-medium text-white text-xs">{partner.city}</div>
                      <div className="text-[11px] text-[#807f7f]">{partner.area || 'Metro District'}</div>
                    </td>

                    {/* Qualifications based on role */}
                    <td className="py-4 px-6">
                      {isWarehouse ? (
                        <div className="text-[11px] text-dropy-textSecondary">
                          <span className="text-[#807f7f]">Experience: </span>
                          <span className="font-medium text-white">{partner.experience || 'Fresher'}</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span
                            className={`text-[10px] font-medium px-2 py-0.5 rounded-[4px] ${
                              partner.has_bike === 'Yes'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : partner.has_bike === 'Rental Needed'
                                ? 'bg-[#b6005d]/20 text-[#ff70b8]'
                                : 'bg-[#222222] text-[#807f7f]'
                            }`}
                          >
                            Bike: {partner.has_bike || 'No'}
                          </span>
                          <span className="text-[10px] font-mono text-[#807f7f]">
                            DL: {partner.has_license || 'No'}
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Target Platforms / Stores */}
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {(partner.preferred_companies || []).slice(0, 2).map((comp, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 rounded-[4px] bg-[#222222] border border-white/5 text-dropy-textSecondary font-medium"
                          >
                            {comp}
                          </span>
                        ))}
                        {(partner.preferred_companies || []).length > 2 && (
                          <span className="text-[10px] px-1.5 py-0.5 text-[#807f7f] font-mono">
                            +{(partner.preferred_companies || []).length - 2}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Date Registered */}
                    <td className="py-4 px-6">
                      <div className="text-[11px] font-mono text-[#807f7f] flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-[#666666]" />
                        <span>{new Date(partner.created_at).toLocaleDateString()}</span>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectPartner(partner);
                        }}
                        className="inline-flex items-center justify-center p-2 rounded-[4px] bg-[#222222] hover:bg-dropy-accent/20 hover:text-dropy-accentPink text-[#807f7f] border border-white/5 transition-all"
                        title="View Full Candidate Dossier"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="p-5 sm:p-6 border-t border-white/[0.08] flex items-center justify-between text-xs text-[#807f7f] font-body">
        <div>
          Showing <span className="text-white font-bold">{partners.length}</span> of{' '}
          <span className="text-white font-bold">{total}</span> matching records
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onFilterChange({ page: page - 1 })}
            disabled={page <= 1}
            className="p-2 rounded-[4px] bg-[#272727] hover:bg-[#333333] border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-mono text-dropy-textSecondary px-2">
            Page {page} of {totalPages || 1}
          </span>
          <button
            onClick={() => onFilterChange({ page: page + 1 })}
            disabled={page >= totalPages}
            className="p-2 rounded-[4px] bg-[#272727] hover:bg-[#333333] border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
