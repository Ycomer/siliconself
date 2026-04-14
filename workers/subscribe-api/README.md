# Subscribe API

基于 Cloudflare Workers + D1 的邮箱订阅服务。

## 功能

- **邮箱订阅**：收集用户邮箱，存储到 D1 数据库
- **防重复**：相同邮箱只记录一次，更新来源信息
- **统计接口**：查看订阅总数和当日新增
- **CORS 支持**：支持跨域请求，可配置允许的域名

## 安全防护

| 防护措施 | 说明 |
|---------|------|
| **Origin 验证** | `/subscribe` 只接受配置的域名请求，拒绝直接 API 调用 |
| **速率限制** | 每个 IP 每分钟最多 5 次订阅请求 |
| **API Key 保护** | `/stats` 和 `/subscribers` 需要 API Key 认证 |
| **邮箱验证** | 格式验证 + 长度限制（最大 254 字符） |
| **邮箱标准化** | 自动转小写、去空格，防止重复注册 |

## API 端点

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | `/subscribe` | 订阅邮箱 | Origin 验证 |
| GET | `/stats` | 获取统计数据 | API Key |
| GET | `/subscribers` | 获取订阅者列表 | API Key |

### POST /subscribe

只能从配置的前端域名调用，直接 curl 会返回 403。

```bash
# 前端调用示例（自动带 Origin 头）
fetch('https://silicon-self-subscribe.ycomer.workers.dev/subscribe', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@example.com' })
})
```

**响应：**
```json
{
  "success": true,
  "message": "Subscribed successfully",
  "isNew": true
}
```

### GET /stats（需要 API Key）

```bash
# 方式1: Authorization Header
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://silicon-self-subscribe.ycomer.workers.dev/stats

# 方式2: URL 参数
curl "https://silicon-self-subscribe.ycomer.workers.dev/stats?key=YOUR_API_KEY"
```

**响应：**
```json
{
  "success": true,
  "total": 42,
  "today": 5
}
```

### GET /subscribers（需要 API Key）

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://silicon-self-subscribe.ycomer.workers.dev/subscribers
```

## 本地开发

```bash
# 安装依赖
npm install

# 复制环境变量配置
cp .dev.vars.example .dev.vars
# 编辑 .dev.vars 设置你的 API_KEY

# 初始化本地数据库
npm run db:init:local

# 启动本地开发服务器 (端口 8787)
npm run dev
```

## 部署

```bash
# 1. 首次部署前，创建 D1 数据库
npm run db:create

# 2. 将返回的 database_id 填入 wrangler.toml

# 3. 初始化远程数据库表
npm run db:init

# 4. 设置 API Key（密钥存储在 Cloudflare，不会暴露）
npx wrangler secret put API_KEY
# 输入你的密钥（建议使用: openssl rand -hex 32 生成）

# 5. 部署 Worker
npm run deploy
```

## 配置

编辑 `wrangler.toml`：

```toml
[vars]
ALLOWED_ORIGINS = "https://siliconself.me,http://localhost:5173"
```

**注意**：`API_KEY` 使用 `wrangler secret` 设置，不要写在 `wrangler.toml` 中。

## 数据库结构

```sql
CREATE TABLE subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  source TEXT DEFAULT 'website',
  ip TEXT,
  user_agent TEXT,
  referrer TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  confirmed_at TEXT,
  unsubscribed_at TEXT
);
```

## 文件结构

```
subscribe-api/
├── src/
│   └── index.ts        # Worker 主代码
├── schema.sql          # 数据库表结构
├── wrangler.toml       # Cloudflare 配置
├── .dev.vars.example   # 本地环境变量示例
├── package.json
└── tsconfig.json
```
