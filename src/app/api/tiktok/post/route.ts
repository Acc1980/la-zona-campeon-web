import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get('tiktok_token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { videoUrl, title } = await req.json();

  const res = await fetch('https://open.tiktokapis.com/v2/post/publish/video/init/', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({
      post_info: {
        title: title || 'Entrenamiento mental para deportistas — La Zona Campeón',
        privacy_level: 'SELF_ONLY',
        disable_duet: true,
        disable_comment: false,
        disable_stitch: true,
        video_cover_timestamp_ms: 1000,
      },
      source_info: {
        source: 'PULL_FROM_URL',
        video_url: videoUrl,
      },
    }),
  });

  const data = await res.json();
  return NextResponse.json(data);
}

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get('tiktok_token')?.value;

  if (!token) {
    return NextResponse.json({ connected: false });
  }

  const publishId = req.nextUrl.searchParams.get('publish_id');
  if (!publishId) {
    return NextResponse.json({ connected: true });
  }

  const res = await fetch('https://open.tiktokapis.com/v2/post/publish/status/fetch/', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({ publish_id: publishId }),
  });

  const data = await res.json();
  return NextResponse.json(data);
}
