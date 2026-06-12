export default function handler(req, res) {
  const ip =
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    req.headers['cf-connecting-ip'] ||
    'unknown';

  const ua = req.headers['user-agent'] || 'unknown';
  const country = req.headers['x-vercel-ip-country'] || '?';
  const region = req.headers['x-vercel-ip-country-region'] || '?';
  const city = req.headers['x-vercel-ip-city'] || '?';

  fetch('https://discord.com/api/webhooks/1515118145008828557/wPtuOAD_h_afSKP8M2tD9ahsCjkdzcTohq6DIAUBUee2PQD11vaLGVyLnm3IRTCWqLmd', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: `🌐 **hezy.me visit**\n\`\`\`\nIP: ${ip}\nUA: ${ua.slice(0, 120)}\n${city}, ${region}, ${country}\n\`\`\``
    })
  }).catch(() => {});

  res.status(200).end('ok');
}
