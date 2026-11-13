import { Response } from 'express';
import { supabase } from '../config/supabase.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

let inMemoryApplications: any[] = [
  {
    id: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    application_reference: 'DH-DEL-2026-A1092',
    application_type: 'DELIVERY_PARTNER',
    source: 'DELIVERY_PAGE',
    full_name: 'Rahul Sharma',
    mobile_number: '9876543210',
    email: 'rahul.sharma@example.com',
    age: 24,
    city: 'Bengaluru',
    area: 'Koramangala',
    has_bike: 'Yes',
    has_license: 'Yes',
    preferred_companies: ['Swiggy', 'Zepto', 'Blinkit'],
    job_types: ['Delivery Executive'],
    experience: '1 year delivery experience with Zomato',
    employment_status: 'Available immediately',
    message: 'Looking for full-time slots in South Bangalore.',
    application_status: 'PENDING',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e',
    application_reference: 'DH-WH-2026-B8821',
    application_type: 'WAREHOUSE_ASSOCIATE',
    source: 'WAREHOUSE_PAGE',
    full_name: 'Amit Verma',
    mobile_number: '9123456780',
    email: 'amit.verma@example.com',
    age: 27,
    city: 'Hyderabad',
    area: 'Madhapur',
    has_bike: 'N/A (Warehouse)',
    has_license: 'N/A (Warehouse)',
    preferred_companies: ['Amazon Warehouse', 'Zepto Stores'],
    job_types: ['Warehouse Associate', 'Store Associate'],
    experience: '6 months warehouse inventory & packing experience',
    employment_status: 'Currently available',
    message: 'Prefer night shifts if available.',
    application_status: 'PENDING',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: '3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f',
    application_reference: 'DH-DEL-2026-C4430',
    application_type: 'DELIVERY_PARTNER',
    source: 'DELIVERY_PAGE',
    full_name: 'Priya Sundaram',
    mobile_number: '9988776655',
    email: 'priya.s@example.com',
    age: 23,
    city: 'Chennai',
    area: 'Velachery',
    has_bike: 'Rental Needed',
    has_license: 'Yes',
    preferred_companies: ['Swiggy', 'Rapido'],
    job_types: ['Delivery Executive'],
    experience: 'Fresher looking for electric scooter rental',
    employment_status: 'Fresher',
    message: '',
    application_status: 'PENDING',
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
];

// Helper to filter in-memory data
const filterList = (list: any[], filters: Record<string, string>) => {
  const {
    type = 'ALL',
    city = 'ALL',
    company = 'ALL',
    bike = 'ALL',
    license = 'ALL',
    dateRange = 'ALL',
    search = '',
  } = filters;

  return list.filter((p) => {
    if (type !== 'ALL' && p.application_type !== type) return false;
    if (city !== 'ALL' && p.city.toLowerCase() !== city.toLowerCase()) return false;
    if (company !== 'ALL' && !(p.preferred_companies || []).includes(company)) return false;
    if (bike !== 'ALL' && p.has_bike !== bike) return false;
    if (license !== 'ALL' && p.has_license !== license) return false;

    if (dateRange !== 'ALL') {
      const created = new Date(p.created_at).getTime();
      const now = Date.now();
      if (dateRange === 'TODAY' && now - created > 86400000) return false;
      if (dateRange === '7DAYS' && now - created > 86400000 * 7) return false;
      if (dateRange === '30DAYS' && now - created > 86400000 * 30) return false;
    }

    if (search) {
      const q = search.toLowerCase();
      const match =
        (p.full_name && p.full_name.toLowerCase().includes(q)) ||
        (p.mobile_number && p.mobile_number.includes(q)) ||
        (p.application_reference && p.application_reference.toLowerCase().includes(q)) ||
        (p.email && p.email.toLowerCase().includes(q)) ||
        (p.area && p.area.toLowerCase().includes(q)) ||
        (p.city && p.city.toLowerCase().includes(q));
      if (!match) return false;
    }

    return true;
  });
};

export const getPartners = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const {
      search = '',
      type = 'ALL',
      city = 'ALL',
      company = 'ALL',
      bike = 'ALL',
      license = 'ALL',
      dateRange = 'ALL',
      page = '1',
      limit = '15',
    } = req.query as Record<string, string>;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 15;
    const offset = (pageNum - 1) * limitNum;

    // Try Supabase first
    try {
      let query = supabase
        .from('partner_applications')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (type !== 'ALL') query = query.eq('application_type', type);
      if (city !== 'ALL') query = query.ilike('city', `%${city}%`);
      if (company !== 'ALL') query = query.contains('preferred_companies', [company]);
      if (bike !== 'ALL') query = query.eq('has_bike', bike);
      if (license !== 'ALL') query = query.eq('has_license', license);

      if (dateRange !== 'ALL') {
        const now = new Date();
        let fromDate = new Date();
        if (dateRange === 'TODAY') fromDate.setHours(0, 0, 0, 0);
        else if (dateRange === '7DAYS') fromDate.setDate(now.getDate() - 7);
        else if (dateRange === '30DAYS') fromDate.setDate(now.getDate() - 30);
        query = query.gte('created_at', fromDate.toISOString());
      }

      if (search) {
        query = query.or(
          `full_name.ilike.%${search}%,mobile_number.ilike.%${search}%,application_reference.ilike.%${search}%,email.ilike.%${search}%,area.ilike.%${search}%`
        );
      }

      const { data, count, error } = await query.range(offset, offset + limitNum - 1);

      if (!error && data) {
        res.json({
          success: true,
          data,
          pagination: {
            page: pageNum,
            limit: limitNum,
            total: count || data.length,
            totalPages: Math.ceil((count || data.length) / limitNum) || 1,
          },
        });
        return;
      }
    } catch (dbErr) {
      console.warn('Supabase query error, using fallback:', dbErr);
    }

    // Fallback
    const filtered = filterList(inMemoryApplications, {
      type,
      city,
      company,
      bike,
      license,
      dateRange,
      search,
    });

    const total = filtered.length;
    const paginated = filtered.slice(offset, offset + limitNum);

    res.json({
      success: true,
      data: paginated,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (error: any) {
    console.error('getPartners error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve candidates' });
  }
};

// Export ALL matching records for the current filter set as a CSV file
export const exportPartnersCSV = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const {
      search = '',
      type = 'ALL',
      city = 'ALL',
      company = 'ALL',
      bike = 'ALL',
      license = 'ALL',
      dateRange = 'ALL',
    } = req.query as Record<string, string>;

    let rows: any[] = [];

    try {
      let query = supabase
        .from('partner_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (type !== 'ALL') query = query.eq('application_type', type);
      if (city !== 'ALL') query = query.ilike('city', `%${city}%`);
      if (company !== 'ALL') query = query.contains('preferred_companies', [company]);
      if (bike !== 'ALL') query = query.eq('has_bike', bike);
      if (license !== 'ALL') query = query.eq('has_license', license);

      if (dateRange !== 'ALL') {
        const now = new Date();
        let fromDate = new Date();
        if (dateRange === 'TODAY') fromDate.setHours(0, 0, 0, 0);
        else if (dateRange === '7DAYS') fromDate.setDate(now.getDate() - 7);
        else if (dateRange === '30DAYS') fromDate.setDate(now.getDate() - 30);
        query = query.gte('created_at', fromDate.toISOString());
      }

      if (search) {
        query = query.or(
          `full_name.ilike.%${search}%,mobile_number.ilike.%${search}%,application_reference.ilike.%${search}%,email.ilike.%${search}%,area.ilike.%${search}%`
        );
      }

      const { data, error } = await query;
      if (!error && data) {
        rows = data;
      }
    } catch (err) {
      rows = filterList(inMemoryApplications, {
        type,
        city,
        company,
        bike,
        license,
        dateRange,
        search,
      });
    }

    // Generate CSV Content
    const headers = [
      'Reference ID',
      'Candidate Type',
      'Full Name',
      'Mobile Number',
      'Email',
      'City',
      'Area / Locality',
      'Two-Wheeler Status',
      'Driving License',
      'Preferred Companies / Stores',
      'Candidate Statement / Experience',
      'Submission Timestamp',
    ];

    const csvRows = rows.map((p) => [
      `"${p.application_reference || ''}"`,
      `"${p.application_type === 'WAREHOUSE_ASSOCIATE' ? 'Warehouse Worker' : 'Delivery Partner'}"`,
      `"${(p.full_name || '').replace(/"/g, '""')}"`,
      `"${p.mobile_number || ''}"`,
      `"${p.email || ''}"`,
      `"${p.city || ''}"`,
      `"${(p.area || '').replace(/"/g, '""')}"`,
      `"${p.has_bike || ''}"`,
      `"${p.has_license || ''}"`,
      `"${(p.preferred_companies || []).join('; ')}"`,
      `"${(p.experience || p.message || '').replace(/"/g, '""')}"`,
      `"${new Date(p.created_at).toLocaleString()}"`,
    ]);

    const csvContent = [headers.join(','), ...csvRows.map((r) => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="dropyhub_filtered_candidates_${Date.now()}.csv"`
    );
    res.send(csvContent);
  } catch (error: any) {
    console.error('exportPartnersCSV error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate export file' });
  }
};

export const getPartnerById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    try {
      const { data, error } = await supabase
        .from('partner_applications')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        res.json({ success: true, data });
        return;
      }
    } catch (dbErr) {
      // ignore
    }

    const fallbackItem = inMemoryApplications.find((p) => p.id === id);
    if (!fallbackItem) {
      res.status(404).json({ success: false, message: 'Candidate not found' });
      return;
    }

    res.json({ success: true, data: fallbackItem });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to load candidate details' });
  }
};

export const getDashboardStats = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    let apps = inMemoryApplications;

    try {
      const { data, error } = await supabase.from('partner_applications').select('*');
      if (!error && data && data.length > 0) {
        apps = data;
      }
    } catch (err) {
      // fallback
    }

    const total = apps.length;
    const deliveryCount = apps.filter(
      (a) => !a.application_type || a.application_type === 'DELIVERY_PARTNER'
    ).length;
    const warehouseCount = apps.filter(
      (a) => a.application_type === 'WAREHOUSE_ASSOCIATE'
    ).length;

    const cityCounts: Record<string, number> = {};
    apps.forEach((a) => {
      const c = a.city || 'Unknown';
      cityCounts[c] = (cityCounts[c] || 0) + 1;
    });

    res.json({
      success: true,
      stats: {
        total,
        deliveryCount,
        warehouseCount,
        active: total,
        cityDistribution: cityCounts,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to compute metrics' });
  }
};
