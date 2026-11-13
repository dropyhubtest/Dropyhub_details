export interface PartnerApplication {
  id: string;
  application_reference: string;
  application_type: 'DELIVERY_PARTNER' | 'WAREHOUSE_ASSOCIATE';
  source: string;
  full_name: string;
  mobile_number: string;
  email?: string;
  age?: number;
  city: string;
  area?: string;
  has_bike?: string;
  has_license?: string;
  preferred_companies: string[];
  job_types: string[];
  experience?: string;
  employment_status?: string;
  message?: string;
  application_status: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  total: number;
  deliveryCount: number;
  warehouseCount: number;
  active: number;
  cityDistribution: Record<string, number>;
}

export interface FilterParams {
  search?: string;
  type?: string;
  city?: string;
  company?: string;
  bike?: string;
  license?: string;
  dateRange?: string;
  page?: number;
  limit?: number;
}

const API_BASE = '/api/v1';

const getHeaders = () => {
  const token = localStorage.getItem('dropyhub_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  async login(email: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Session invalid');
    return res.json();
  },

  async logout() {
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: getHeaders(),
    });
    localStorage.removeItem('dropyhub_token');
  },

  async getStats(): Promise<DashboardStats> {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch metrics');
    return data.stats;
  },

  async getPartners(params: FilterParams) {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.type && params.type !== 'ALL') query.set('type', params.type);
    if (params.city && params.city !== 'ALL') query.set('city', params.city);
    if (params.company && params.company !== 'ALL') query.set('company', params.company);
    if (params.bike && params.bike !== 'ALL') query.set('bike', params.bike);
    if (params.license && params.license !== 'ALL') query.set('license', params.license);
    if (params.dateRange && params.dateRange !== 'ALL') query.set('dateRange', params.dateRange);
    if (params.page) query.set('page', params.page.toString());
    if (params.limit) query.set('limit', params.limit.toString());

    const res = await fetch(`${API_BASE}/admin/partners?${query.toString()}`, {
      headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch partners');
    return data;
  },

  async getPartner(id: string) {
    const res = await fetch(`${API_BASE}/admin/partners/${id}`, {
      headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch partner');
    return data.data;
  },

  async exportFilteredCSV(params: FilterParams) {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.type && params.type !== 'ALL') query.set('type', params.type);
    if (params.city && params.city !== 'ALL') query.set('city', params.city);
    if (params.company && params.company !== 'ALL') query.set('company', params.company);
    if (params.bike && params.bike !== 'ALL') query.set('bike', params.bike);
    if (params.license && params.license !== 'ALL') query.set('license', params.license);
    if (params.dateRange && params.dateRange !== 'ALL') query.set('dateRange', params.dateRange);

    const token = localStorage.getItem('dropyhub_token');
    const res = await fetch(`${API_BASE}/admin/export?${query.toString()}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!res.ok) throw new Error('Failed to generate export file');

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dropyhub_filtered_${params.type || 'all'}_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  },
};
