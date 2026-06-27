const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;

async function incrementVisitorCount() {
  if (!KV_URL || !KV_TOKEN) return -1;
  try {
    const res = await fetch(`${KV_URL}/incr/visitor_count`, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` }
    });
    const data = await res.json();
    return data.result;
  } catch (err) {
    console.error('KV increment failed:', err.message);
    return -1;
  }
}

export default async function handler(req, res) {
  const ip =
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    req.headers['cf-connecting-ip'] ||
    'unknown';

  const ua = req.headers['user-agent'] || 'unknown';
  const country = req.headers['x-vercel-ip-country'] || '?';
  const region = req.headers['x-vercel-ip-country-region'] || '?';
  const city = req.headers['x-vercel-ip-city'] || '?';
  const os = req.headers['sec-ch-ua-platform'] ? req.headers['sec-ch-ua-platform'].replace(/"/g, '') : 'unknown';
  const browser = ua.includes('Chrome') ? 'Chrome' : ua.includes('Firefox') ? 'Firefox' : ua.includes('Safari') && !ua.includes('Chrome') ? 'Safari' : ua.includes('Edge') ? 'Edge' : ua.includes('OPR') ? 'Opera' : 'other';

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

  const [count] = await Promise.all([
    incrementVisitorCount(),
    fetch('https://discord.com/api/webhooks/1520365262120030330/qEWpRt7pC-Q5yrg9Ps4yd6gO9G08HXPbFhP7YUfiAQpihvmpe2uwpIsf9m2QllkPI45c', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] })
    }).catch(err => console.error('Discord webhook failed:', err.message))
  ]);

  res.status(200).json({ ok: true, count });
}
