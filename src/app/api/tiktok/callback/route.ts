import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  const error = req.nextUrl.searchParams.get('error');

  if (error || !code) {
    return NextResponse.redirect(
      `https://lazonacampeon.com/tiktok-demo?error=${error || 'no_code'}`
    );
  }

  const res = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_key: process.env.TIKTOK_CLIENT_KEY!,
      client_secret: process.env.TIKTOK_CLIENT_SECRET!,
      code,
      grant_type: 'authorization_code',
      redirect_uri: 'https://lazonacampeon.com/api/tiktok/callback',
    }),
  });

  const data = await res.json();

  if (data.access_token) {
    const cookieStore = await cookies();
    cookieStore.set('tiktok_token', data.access_token, {
      httpOnly: true,
      maxAge: 86400,
      path: '/',
    });
    return NextResponse.redirect('https://lazonacampeon.com/tiktok-demo?connected=1');
  }

  return NextResponse.redirect(
    `https://lazonacampeon.com/tiktok-demo?error=auth_failed&detail=${encodeURIComponent(JSON.stringify(data))}`
  );
}
