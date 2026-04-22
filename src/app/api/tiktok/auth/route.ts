import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const params = new URLSearchParams({
    client_key: process.env.TIKTOK_CLIENT_KEY!,
    scope: 'user.info.basic,video.publish,video.upload',
    response_type: 'code',
    redirect_uri: 'https://lazonacampeon.com/api/tiktok/callback',
    state: 'demo',
  });

  return NextResponse.redirect(
    `https://www.tiktok.com/v2/auth/authorize/?${params.toString()}`
  );
}
