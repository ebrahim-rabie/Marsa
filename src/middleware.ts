import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { createServerClient } from '@supabase/ssr';
import { routing } from './i18n/routing';

const handleI18nRouting = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const response = handleI18nRouting(request);

  const isProtectedRoute = request.nextUrl.pathname.match(/^\/(ar|en)\/(dashboard|admin|supplier-portal)/);
  const demoUser = request.cookies.get('marsa_demo_user')?.value;

  let hasValidAuth = Boolean(demoUser);

  if (!hasValidAuth && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
          cookies: {
            getAll() {
              return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value, options }) => {
                request.cookies.set(name, value);
                response.cookies.set({ name, value, ...options });
              });
            },
          },
        }
      );

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        hasValidAuth = true;
      }
    } catch {
      hasValidAuth = false;
    }
  }

  if (isProtectedRoute && !hasValidAuth) {
    const locale = request.nextUrl.pathname.split('/')[1] || 'ar';
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = `/${locale}/auth/login`;
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|icon|robots.txt|sitemap.xml|.*\\..*).*)']
};
