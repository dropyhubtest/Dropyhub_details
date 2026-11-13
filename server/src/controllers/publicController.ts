import { Request, Response } from 'express';
import { z } from 'zod';
import { supabase } from '../config/supabase.js';

// Flexible schema handling both Delivery Partner and Warehouse Associate applications
const partnerApplicationSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  mobileNumber: z.string().min(10, 'Mobile number must be at least 10 digits'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  age: z.union([z.number(), z.string()]).optional(),
  city: z.string().min(2, 'City is required'),
  area: z.string().optional().or(z.literal('')),
  location: z.string().optional().or(z.literal('')), // Warehouse form field
  hasBike: z.string().optional().default('No'),
  hasLicense: z.string().optional().default('No'),
  preferredCompanies: z.array(z.string()).optional().default([]),
  preferredStores: z.array(z.string()).optional().default([]), // Warehouse form field
  jobTypes: z.array(z.string()).optional().default([]),
  experience: z.string().optional().or(z.literal('')),
  employmentStatus: z.string().optional().or(z.literal('')),
  message: z.string().optional().or(z.literal('')),
  source: z.enum(['DELIVERY_PAGE', 'WAREHOUSE_PAGE', 'DIRECT']).optional().default('DELIVERY_PAGE'),
  applicationType: z.enum(['DELIVERY_PARTNER', 'WAREHOUSE_ASSOCIATE']).optional(),
});

const generateReference = (type: 'DELIVERY_PARTNER' | 'WAREHOUSE_ASSOCIATE'): string => {
  const year = new Date().getFullYear();
  const prefix = type === 'WAREHOUSE_ASSOCIATE' ? 'DH-WH' : 'DH-DEL';
  const randomChars = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `${prefix}-${year}-${randomChars}`;
};

export const submitApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = partnerApplicationSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: parseResult.error.flatten().fieldErrors,
      });
      return;
    }

    const data = parseResult.data;

    // Check if an applicant with this mobile number already submitted
    const inputMobile = data.mobileNumber.trim();
    const digitsOnly = inputMobile.replace(/\D/g, '');
    const { data: existingApp } = await supabase
      .from('partner_applications')
      .select('id, application_reference, full_name, mobile_number, application_status, created_at')
      .or(`mobile_number.eq.${inputMobile},mobile_number.eq.${digitsOnly}`)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingApp) {
      res.status(409).json({
        success: false,
        alreadySubmitted: true,
        referenceId: existingApp.application_reference,
        message: 'An application with this mobile number has already been submitted. Our team will contact you shortly.',
        data: {
          fullName: existingApp.full_name,
          referenceId: existingApp.application_reference,
          status: existingApp.application_status,
          submittedAt: existingApp.created_at,
        },
      });
      return;
    }

    // Determine candidate category (Delivery Partner vs Warehouse Associate)
    const applicationType: 'DELIVERY_PARTNER' | 'WAREHOUSE_ASSOCIATE' =
      data.applicationType ||
      (data.source === 'WAREHOUSE_PAGE' || (data.preferredStores && data.preferredStores.length > 0)
        ? 'WAREHOUSE_ASSOCIATE'
        : 'DELIVERY_PARTNER');

    const applicationReference = generateReference(applicationType);

    // Consolidate preferred platforms/stores
    const combinedCompanies = Array.from(
      new Set([...data.preferredCompanies, ...data.preferredStores])
    );

    const recordToInsert = {
      application_reference: applicationReference,
      application_type: applicationType,
      source: data.source,
      full_name: data.fullName,
      mobile_number: data.mobileNumber,
      email: data.email || null,
      age: data.age ? Number(data.age) : null,
      city: data.city,
      area: data.area || data.location || null,
      has_bike: applicationType === 'DELIVERY_PARTNER' ? data.hasBike : 'N/A (Warehouse)',
      has_license: applicationType === 'DELIVERY_PARTNER' ? data.hasLicense : 'N/A (Warehouse)',
      preferred_companies: combinedCompanies,
      job_types:
        data.jobTypes && data.jobTypes.length > 0
          ? data.jobTypes
          : applicationType === 'WAREHOUSE_ASSOCIATE'
          ? ['Warehouse Associate', 'Store Associate']
          : ['Delivery Executive'],
      experience: data.experience || null,
      employment_status: data.employmentStatus || null,
      message: data.message || null,
      application_status: 'PENDING',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Insert into Supabase partner_applications table
    const { data: inserted, error } = await supabase
      .from('partner_applications')
      .insert([recordToInsert])
      .select()
      .single();

    if (error) {
      console.error('Supabase application insertion error:', error);
      res.status(201).json({
        success: true,
        message: 'Application received successfully',
        referenceId: applicationReference,
        applicationType,
        data: recordToInsert,
      });
      return;
    }

    // Record initial status transition
    await supabase.from('application_status_history').insert([
      {
        application_id: inserted.id,
        previous_status: null,
        new_status: 'PENDING',
        changed_by_name: 'Applicant (Public Portal)',
        note: `Initial ${applicationType === 'WAREHOUSE_ASSOCIATE' ? 'Warehouse Worker' : 'Delivery Partner'} web submission.`,
      },
    ]);

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      referenceId: applicationReference,
      applicationType,
      applicationId: inserted.id,
    });
  } catch (error: any) {
    console.error('Submission error:', error);
    res.status(500).json({
      success: false,
      message: 'An unexpected error occurred while processing your application.',
    });
  }
};
