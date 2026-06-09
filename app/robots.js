export default function robots() {
  return {
    rules: [
      // ── Block all crawlers from admin and internal API ──────────────────────
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      // ── Explicitly welcome every major AI crawler ───────────────────────────
      // OpenAI / ChatGPT
      { userAgent: 'GPTBot',             allow: '/' },
      // Anthropic / Claude
      { userAgent: 'ClaudeBot',          allow: '/' },
      { userAgent: 'anthropic-ai',       allow: '/' },
      // Google Gemini & AI Overviews
      { userAgent: 'Google-Extended',    allow: '/' },
      // Perplexity
      { userAgent: 'PerplexityBot',      allow: '/' },
      // Meta AI
      { userAgent: 'meta-externalagent', allow: '/' },
      // Microsoft Copilot / Bing AI
      { userAgent: 'Bingbot',            allow: '/' },
      // Amazon Alexa
      { userAgent: 'Amazonbot',          allow: '/' },
      // You.com
      { userAgent: 'YouBot',             allow: '/' },
      // Common Crawl (powers many AI training datasets)
      { userAgent: 'CCBot',              allow: '/' },
      // Cohere
      { userAgent: 'cohere-ai',          allow: '/' },
    ],
    sitemap: 'https://www.kingsfordsleep.co.uk/sitemap.xml',
    host: 'https://www.kingsfordsleep.co.uk',
  }
}