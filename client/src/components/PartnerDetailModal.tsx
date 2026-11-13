import React, { useState } from 'react';
import { PartnerApplication } from '../api/client';
import {
  X,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Bike,
  Building2,
  Package,
  Copy,
  Check,
  MessageSquare,
} from 'lucide-react';

interface ModalProps {
  partner: PartnerApplication | null;
  onClose: () => void;
}

export const PartnerDetailModal: React.FC<ModalProps> = ({
  partner,
  onClose,
}) => {
  if (!partner) return null;

  const isWarehouse = partner.application_type === 'WAREHOUSE_ASSOCIATE';
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const copyToClipboard = (text: string, type: 'phone' | 'email') => {
    navigator.clipboard.writeText(text);
    if (type === 'phone') {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    } else {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#121212] border border-white/[0.12] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
        {/* Signature DropyHub Gradient Line */}
        <div className="h-[3px] bg-dropy-cta w-full" />

        {/* Modal Header */}
        <div className="p-6 sm:p-7 border-b border-white/[0.08] flex items-start justify-between bg-[#161616]">
          <div>
            <div className="flex items-center space-x-3 mb-2 flex-wrap gap-2">
              <span
                className={`inline-flex items-center gap-1.5 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-[4px] border uppercase tracking-wider ${
                  isWarehouse
                    ? 'bg-amber-500/10 text-amber-300 border-amber-500/25'
                    : 'bg-sky-500/10 text-sky-300 border-sky-500/25'
                }`}
              >
                {isWarehouse ? <Building2 className="w-3.5 h-3.5" /> : <Bike className="w-3.5 h-3.5" />}
                <span>{isWarehouse ? 'WAREHOUSE & STORES CANDIDATE' : 'DELIVERY FLEET CANDIDATE'}</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight uppercase">
              {partner.full_name}
            </h2>

            <p className="text-xs font-mono text-[#807f7f] mt-1">
              Ref ID: <span className="text-white font-semibold">{partner.application_reference}</span> • Source:{' '}
              <span className="text-dropy-accentPink">{partner.source}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-[4px] bg-[#272727] hover:bg-[#353333] text-[#807f7f] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content - Read Only Data Viewer */}
        <div className="p-6 sm:p-7 space-y-6">
          {/* Quick Contact & Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#181818] border border-white/[0.06] p-5 rounded-xl">
            {/* Phone */}
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <Phone className="w-4 h-4 text-dropy-accentPink mt-0.5 shrink-0" />
                <div>
                  <div className="text-[10px] font-mono tracking-[0.12em] text-[#807f7f] uppercase">Mobile Number</div>
                  <div className="text-sm font-bold text-white font-mono mt-0.5">{partner.mobile_number}</div>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(partner.mobile_number, 'phone')}
                className="px-2 py-1 rounded-[4px] bg-[#252525] hover:bg-[#333333] text-[#807f7f] hover:text-white transition-colors text-[10px] font-mono flex items-center space-x-1"
                title="Copy phone number"
              >
                {copiedPhone ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedPhone ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Email */}
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <Mail className="w-4 h-4 text-dropy-accentPink mt-0.5 shrink-0" />
                <div>
                  <div className="text-[10px] font-mono tracking-[0.12em] text-[#807f7f] uppercase">Email Address</div>
                  <div className="text-sm font-semibold text-white truncate max-w-[150px] mt-0.5">
                    {partner.email || 'None provided'}
                  </div>
                </div>
              </div>
              {partner.email && (
                <button
                  onClick={() => copyToClipboard(partner.email || '', 'email')}
                  className="px-2 py-1 rounded-[4px] bg-[#252525] hover:bg-[#333333] text-[#807f7f] hover:text-white transition-colors text-[10px] font-mono flex items-center space-x-1"
                  title="Copy email address"
                >
                  {copiedEmail ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>

            {/* Location */}
            <div className="flex items-start space-x-3">
              <MapPin className="w-4 h-4 text-dropy-accentPink mt-0.5 shrink-0" />
              <div>
                <div className="text-[10px] font-mono tracking-[0.12em] text-[#807f7f] uppercase">Hub Location</div>
                <div className="text-sm font-bold text-white mt-0.5">
                  {partner.city} {partner.area ? `• ${partner.area}` : ''}
                </div>
              </div>
            </div>

            {/* Age & Date */}
            <div className="flex items-start space-x-3">
              <Calendar className="w-4 h-4 text-dropy-accentPink mt-0.5 shrink-0" />
              <div>
                <div className="text-[10px] font-mono tracking-[0.12em] text-[#807f7f] uppercase">Registered On</div>
                <div className="text-xs font-mono text-dropy-textSecondary mt-0.5">
                  {new Date(partner.created_at).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Role-Specific Qualifications */}
          {isWarehouse ? (
            /* WAREHOUSE ASSOCIATE DETAILS */
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="bg-[#181818] border border-white/[0.06] p-4 rounded-xl">
                  <span className="text-[10px] font-mono tracking-[0.12em] text-[#807f7f] uppercase flex items-center gap-1.5 mb-2">
                    <Package className="w-3.5 h-3.5 text-amber-400" />
                    Prior Warehouse / Packing Experience
                  </span>
                  <p className="text-xs text-white leading-relaxed font-medium">
                    {partner.experience || 'Fresher (No prior warehouse experience noted)'}
                  </p>
                </div>

                <div className="bg-[#181818] border border-white/[0.06] p-4 rounded-xl">
                  <span className="text-[10px] font-mono tracking-[0.12em] text-[#807f7f] uppercase block mb-2">
                    Target Dark Stores &amp; Fulfillment Centers
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(partner.preferred_companies || []).length > 0 ? (
                      partner.preferred_companies.map((store, i) => (
                        <span key={i} className="text-xs px-2.5 py-1 rounded-[4px] bg-[#252525] text-amber-300 font-medium">
                          {store}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-[#807f7f]">Any available store</span>
                    )}
                  </div>
                </div>
              </div>

              {partner.age && (
                <div className="bg-[#181818] border border-white/[0.06] p-3 rounded-lg flex items-center justify-between text-xs">
                  <span className="font-mono text-[#807f7f] uppercase tracking-wider">Candidate Age:</span>
                  <span className="font-bold text-white font-mono">{partner.age} years old</span>
                </div>
              )}
            </div>
          ) : (
            /* DELIVERY PARTNER DETAILS */
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-[#181818] border border-white/[0.06] p-3.5 rounded-lg">
                  <span className="text-[10px] font-mono tracking-[0.12em] text-[#807f7f] uppercase block">Two-Wheeler</span>
                  <p className="text-xs font-bold text-white mt-1">{partner.has_bike || 'No'}</p>
                </div>
                <div className="bg-[#181818] border border-white/[0.06] p-3.5 rounded-lg">
                  <span className="text-[10px] font-mono tracking-[0.12em] text-[#807f7f] uppercase block">Driving License</span>
                  <p className="text-xs font-bold text-white mt-1">{partner.has_license || 'No'}</p>
                </div>
                <div className="bg-[#181818] border border-white/[0.06] p-3.5 rounded-lg">
                  <span className="text-[10px] font-mono tracking-[0.12em] text-[#807f7f] uppercase block">Age</span>
                  <p className="text-xs font-bold text-white mt-1 font-mono">{partner.age ? `${partner.age} yrs` : 'Unspecified'}</p>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-mono tracking-[0.12em] text-[#807f7f] uppercase block mb-2 font-semibold">
                  Preferred Delivery Platforms
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(partner.preferred_companies || []).map((c, i) => (
                    <span
                      key={i}
                      className="text-xs px-3 py-1 rounded-[4px] bg-[#202020] border border-white/10 text-white font-medium"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {partner.employment_status && (
                <div className="bg-[#181818] border border-white/[0.06] p-3.5 rounded-lg">
                  <span className="text-[10px] font-mono tracking-[0.12em] text-[#807f7f] uppercase block mb-1">
                    Current Employment Status
                  </span>
                  <p className="text-xs text-white font-medium">{partner.employment_status}</p>
                </div>
              )}

              {partner.experience && (
                <div className="bg-[#181818] border border-white/[0.06] p-3.5 rounded-lg">
                  <span className="text-[10px] font-mono tracking-[0.12em] text-[#807f7f] uppercase block mb-1">
                    Candidate Statement / Prior Delivery Experience
                  </span>
                  <p className="text-xs text-dropy-textSecondary leading-relaxed">{partner.experience}</p>
                </div>
              )}
            </div>
          )}

          {partner.message && (
            <div className="bg-[#181818] border border-white/[0.06] p-4 rounded-xl">
              <span className="text-[10px] font-mono tracking-[0.12em] text-[#807f7f] uppercase flex items-center gap-1.5 mb-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-dropy-accentPink" />
                Applicant Direct Message
              </span>
              <p className="text-xs text-dropy-textSecondary leading-relaxed">{partner.message}</p>
            </div>
          )}

          {/* Close Action */}
          <div className="flex items-center justify-end pt-3 border-t border-white/[0.06]">
            <button
              type="button"
              onClick={onClose}
              className="px-6 h-[40px] rounded-[4px] bg-[#272727] hover:bg-[#353333] text-white text-xs font-body font-semibold tracking-[0.05em] uppercase transition-colors"
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
