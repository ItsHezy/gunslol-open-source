const recent = new Map();

export default function handler(req, res) {
  const ip =
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    req.headers['cf-connecting-ip'] ||
    'unknown';

  const now = Date.now();
  for (const [k, t] of recent) {
    if (now - t > 1000) recent.delete(k);
  }

  if (recent.has(ip) && now - recent.get(ip) < 1000) {
    res.status(200).end('ok');
    return;
  }
  recent.set(ip, now);

  const ua = req.headers['user-agent'] || 'unknown';
  const country = req.headers['x-vercel-ip-country'] || '?';
  const region = req.headers['x-vercel-ip-country-region'] || '?';
  const city = req.headers['x-vercel-ip-city'] || '?';

  const flags = [];
  if (req.headers['sec-ch-ua-platform']) flags.push(req.headers['sec-ch-ua-platform'].replace(/"/g, ''));
  const os = flags[0] || 'unknown';
  const browser = (ua.includes('Chrome') ? 'Chrome' : ua.includes('Firefox') ? 'Firefox' : ua.includes('Safari') ? 'Safari' : ua.includes('Edge') ? 'Edge' : ua.includes('OPR') ? 'Opera' : 'other');

  const embed = {
    title: '🌐 hezy.me Visitor',
    color: 0x5865F2,
    fields: [
      { name: 'IP Address', value: `\`${ip}\``, inline: true },
      { name: 'Location', value: `${city}, ${region}, ${country}`.replace(/\?, \?, \?/g, 'Unknown'), inline: true },
      { name: 'OS', value: os, inline: true },
      { name: 'Browser', value: browser, inline: true },
    ],
    footer: { text: `hezy.me · ${new Date().toLocaleString('en-US', { timeZone: 'UTC' })} UTC` }
  };

  fetch('https://discord.com/api/webhooks/1515118145008828557/wPtuOAD_h_afSKP8M2tD9ahsCjkdzcTohq6DIAUBUee2PQD11vaLGVyLnm3IRTCWqLmd', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ embeds: [embed] })
  }).catch(() => {});

  res.status(200).end('ok');
}
