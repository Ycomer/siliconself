export interface Env {
  DB: D1Database;
  ALLOWED_ORIGINS: string;
  API_KEY?: string; // 用于保护管理接口
}

// 简单的邮箱验证
function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// CORS 头
function corsHeaders(origin: string, allowedOrigins: string): HeadersInit {
  const origins = allowedOrigins.split(',').map(o => o.trim());
  const isAllowed = origins.includes(origin) || origins.includes('*');

  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : origins[0],
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}

// JSON 响应
function jsonResponse(data: object, status: number, origin: string, allowedOrigins: string): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(origin, allowedOrigins),
    },
  });
}

// 基于 IP 的简单速率限制（使用内存，Worker 重启后重置）
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5; // 每个 IP 每分钟最多 5 次请求
const RATE_WINDOW = 60 * 1000; // 1 分钟

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

// 验证 API Key
function verifyApiKey(request: Request, env: Env): boolean {
  if (!env.API_KEY) return true; // 如果没配置 API_KEY，跳过验证

  const authHeader = request.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7) === env.API_KEY;
  }

  const url = new URL(request.url);
  const keyParam = url.searchParams.get('key');
  return keyParam === env.API_KEY;
}

// 检查请求来源是否合法
function isAllowedOrigin(origin: string, allowedOrigins: string): boolean {
  if (!origin) return false; // 直接 API 调用没有 Origin
  const origins = allowedOrigins.split(',').map(o => o.trim());
  return origins.includes(origin) || origins.includes('*');
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';

    // 处理 CORS 预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders(origin, env.ALLOWED_ORIGINS),
      });
    }

    // POST /subscribe - 订阅（需要防护）
    if (request.method === 'POST' && url.pathname === '/subscribe') {
      // 1. 检查来源（只允许配置的域名）
      if (!isAllowedOrigin(origin, env.ALLOWED_ORIGINS)) {
        return jsonResponse(
          { success: false, error: 'Forbidden' },
          403,
          origin,
          env.ALLOWED_ORIGINS
        );
      }

      // 2. 速率限制
      if (!checkRateLimit(ip)) {
        return jsonResponse(
          { success: false, error: 'Too many requests, please try again later' },
          429,
          origin,
          env.ALLOWED_ORIGINS
        );
      }

      try {
        const body = await request.json() as { email?: string; source?: string };
        const { email, source = 'website' } = body;

        // 3. 邮箱格式验证
        if (!email || !isValidEmail(email)) {
          return jsonResponse(
            { success: false, error: 'Invalid email address' },
            400,
            origin,
            env.ALLOWED_ORIGINS
          );
        }

        // 4. 邮箱长度限制（防止超长字符串攻击）
        if (email.length > 254) {
          return jsonResponse(
            { success: false, error: 'Email too long' },
            400,
            origin,
            env.ALLOWED_ORIGINS
          );
        }

        // 获取请求元数据
        const userAgent = request.headers.get('User-Agent') || '';
        const referrer = request.headers.get('Referer') || '';

        // 插入数据库（重复邮箱会被忽略）
        const result = await env.DB.prepare(`
          INSERT INTO subscribers (email, source, ip, user_agent, referrer)
          VALUES (?, ?, ?, ?, ?)
          ON CONFLICT(email) DO UPDATE SET
            source = excluded.source,
            referrer = excluded.referrer
        `).bind(email.toLowerCase().trim(), source, ip, userAgent, referrer).run();

        return jsonResponse(
          {
            success: true,
            message: 'Subscribed successfully',
            isNew: result.meta.changes > 0
          },
          200,
          origin,
          env.ALLOWED_ORIGINS
        );
      } catch (error) {
        console.error('Subscribe error:', error);
        return jsonResponse(
          { success: false, error: 'Internal server error' },
          500,
          origin,
          env.ALLOWED_ORIGINS
        );
      }
    }

    // GET /subscribers - 获取订阅者列表（需要 API Key）
    if (request.method === 'GET' && url.pathname === '/subscribers') {
      if (!verifyApiKey(request, env)) {
        return jsonResponse(
          { success: false, error: 'Unauthorized' },
          401,
          origin,
          env.ALLOWED_ORIGINS
        );
      }

      try {
        const { results } = await env.DB.prepare(`
          SELECT id, email, source, created_at, confirmed_at, unsubscribed_at
          FROM subscribers
          WHERE unsubscribed_at IS NULL
          ORDER BY created_at DESC
        `).all();

        return jsonResponse(
          { success: true, count: results.length, subscribers: results },
          200,
          origin,
          env.ALLOWED_ORIGINS
        );
      } catch (error) {
        console.error('List error:', error);
        return jsonResponse(
          { success: false, error: 'Internal server error' },
          500,
          origin,
          env.ALLOWED_ORIGINS
        );
      }
    }

    // GET /stats - 统计（需要 API Key）
    if (request.method === 'GET' && url.pathname === '/stats') {
      if (!verifyApiKey(request, env)) {
        return jsonResponse(
          { success: false, error: 'Unauthorized' },
          401,
          origin,
          env.ALLOWED_ORIGINS
        );
      }

      try {
        const total = await env.DB.prepare(`
          SELECT COUNT(*) as count FROM subscribers WHERE unsubscribed_at IS NULL
        `).first<{ count: number }>();

        const today = await env.DB.prepare(`
          SELECT COUNT(*) as count FROM subscribers
          WHERE date(created_at) = date('now') AND unsubscribed_at IS NULL
        `).first<{ count: number }>();

        return jsonResponse(
          {
            success: true,
            total: total?.count || 0,
            today: today?.count || 0
          },
          200,
          origin,
          env.ALLOWED_ORIGINS
        );
      } catch (error) {
        console.error('Stats error:', error);
        return jsonResponse(
          { success: false, error: 'Internal server error' },
          500,
          origin,
          env.ALLOWED_ORIGINS
        );
      }
    }

    // 404
    return jsonResponse(
      { success: false, error: 'Not found' },
      404,
      origin,
      env.ALLOWED_ORIGINS
    );
  },
};
