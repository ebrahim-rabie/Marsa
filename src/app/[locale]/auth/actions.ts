'use server';

import {
  createServerSupabaseClient,
  createSupabaseAdminClient,
  getUserProfile,
  createCompanyRecord,
  createUserRecord,
  createSupplierRecord,
} from '@/lib/database';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export interface AuthActionResult {
  success: boolean;
  error?: string;
  redirectTo?: string;
}

export async function loginAction(formData: FormData): Promise<AuthActionResult> {
  const email = (formData.get('email') as string)?.trim();
  const password = formData.get('password') as string;
  const locale = (formData.get('locale') as string) || 'ar';
  const role = (formData.get('demoRole') as string) || '';

  // Quick Demo Login Handler
  if (role) {
    const cookieStore = await cookies();
    cookieStore.set('marsa_demo_user', role, { path: '/', maxAge: 60 * 60 * 24 * 7 });
    if (role === 'admin') {
      return { success: true, redirectTo: `/${locale}/admin` };
    } else if (role === 'supplier') {
      return { success: true, redirectTo: `/${locale}/supplier-portal` };
    } else {
      return { success: true, redirectTo: `/${locale}/dashboard` };
    }
  }

  if (!email || !password) {
    return {
      success: false,
      error: locale === 'ar' ? 'يرجى إدخال البريد الإلكتروني وكلمة المرور' : 'Email and password are required',
    };
  }

  // If Supabase is configured, use it
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // Check user role from profile
      const userProfile = await getUserProfile(data.user.id);
      const userRole = userProfile?.role || 'buyer';
      let targetPath = `/${locale}/dashboard`;
      if (userRole === 'admin') targetPath = `/${locale}/admin`;
      else if (userRole === 'supplier') targetPath = `/${locale}/supplier-portal`;

      return { success: true, redirectTo: targetPath };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      return { success: false, error: msg };
    }
  }

  // Fallback demo login when credentials not yet set in .env
  const cookieStore = await cookies();
  cookieStore.set('marsa_demo_user', 'buyer', { path: '/', maxAge: 60 * 60 * 24 * 7 });
  return { success: true, redirectTo: `/${locale}/dashboard` };
}

export async function registerAction(formData: FormData): Promise<AuthActionResult> {
  const fullName = (formData.get('fullName') as string)?.trim();
  const companyName = (formData.get('companyName') as string)?.trim();
  const email = (formData.get('email') as string)?.trim();
  const phone = (formData.get('phone') as string)?.trim();
  const password = formData.get('password') as string;
  const role = (formData.get('role') as string) || 'buyer';
  const country = (formData.get('country') as string) || 'EG';
  const locale = (formData.get('locale') as string) || 'ar';

  if (!fullName || !companyName || !email || !password || !phone) {
    return {
      success: false,
      error: locale === 'ar' ? 'يرجى ملء جميع الحقول الإلزامية' : 'Please fill all required fields',
    };
  }

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const supabase = await createServerSupabaseClient();
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone,
            role,
          },
        },
      });

      if (authError) {
        return { success: false, error: authError.message };
      }

      if (authData.user && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        // Create company
        const comp = await createCompanyRecord({
          name: companyName,
          type: role === 'supplier' ? (country === 'CN' ? 'supplier_cn' : 'supplier_eg') : 'buyer',
          country,
          phone,
        });

        // Create user record
        await createUserRecord({
          id: authData.user.id,
          email,
          phone,
          full_name: fullName,
          role: role as 'buyer' | 'supplier' | 'admin',
          locale,
          company_id: comp?.id || null,
        });

        // If supplier, create supplier entry
        if (role === 'supplier' && comp?.id) {
          await createSupplierRecord({
            company_id: comp.id,
            verification_level: 0,
            active: true,
          });
        }
      }

      let dest = `/${locale}/dashboard`;
      if (role === 'supplier') dest = `/${locale}/supplier-portal`;

      return { success: true, redirectTo: dest };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      return { success: false, error: msg };
    }
  }

  // Sandbox fallback
  const cookieStore = await cookies();
  cookieStore.set('marsa_demo_user', role, { path: '/', maxAge: 60 * 60 * 24 * 7 });
  const dest = role === 'supplier' ? `/${locale}/supplier-portal` : `/${locale}/dashboard`;
  return { success: true, redirectTo: dest };
}

export async function logoutAction(locale: string = 'ar') {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const supabase = await createServerSupabaseClient();
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
  }

  const cookieStore = await cookies();
  cookieStore.delete('marsa_demo_user');
  redirect(`/${locale}`);
}

export async function switchRoleAction(role: 'buyer' | 'supplier' | 'admin', locale: string = 'ar') {
  const cookieStore = await cookies();
  cookieStore.set('marsa_demo_user', role, { path: '/', maxAge: 60 * 60 * 24 * 7 });
  let dest = `/${locale}/dashboard`;
  if (role === 'supplier') dest = `/${locale}/supplier-portal`;
  if (role === 'admin') dest = `/${locale}/admin`;
  redirect(dest);
}
