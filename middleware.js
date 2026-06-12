export default async function middleware(request) {
  const url = new URL(request.url);
  const path = url.pathname;

  if (
    path.startsWith('/assets/') ||
    path.startsWith('/node_modules/') ||
    path === '/favicon.ico' ||
    /\.(js|css|png|jpg|jpeg|gif|webp|svg|ico|mp3|mp4|woff2?|ttf|otf|conf)$/i.test(path)
  ) {
    return Response.next();
  }

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    request.headers.get('cf-connecting-ip') ||
    'unknown';

  const ua = request.headers.get('user-agent') || 'unknown';
  const ref = request.headers.get('referer') || 'direct';
  const country = request.headers.get('x-vercel-ip-country') || '?';
  const region = request.headers.get('x-vercel-ip-country-region') || '?';
  const city = request.headers.get('x-vercel-ip-city') || '?';

  fetch('https://discord.com/api/webhooks/1515118145008828557/wPtuOAD_h_afSKP8M2tD9ahsCjkdzcTohq6DIAUBUee2PQD11vaLGVyLnm3IRTCWqLmd', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: `🌐 **hezy.me visit**\n\`\`\`\nIP: ${ip}\nPath: ${path}\nUA: ${ua.slice(0, 120)}\nRef: ${ref.slice(0, 120)}\n${city}, ${region}, ${country}\n\`\`\``
    })
  }).catch(() => {});

  return Response.next();
}
