export async function GET() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Marsa (مرسى) — OpenAPI Documentation</title>
  <link rel="icon" href="/icon">
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.18.2/swagger-ui.css" />
  <style>
    body {
      margin: 0;
      padding: 0;
      background: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    .top-bar {
      background: #0F4C5C;
      color: #ffffff;
      padding: 16px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }
    .top-bar .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 20px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    .top-bar .badge {
      background: #F2B01E;
      color: #0A2F38;
      font-size: 11px;
      font-weight: 800;
      padding: 3px 8px;
      border-radius: 6px;
      text-transform: uppercase;
    }
    .top-bar .links {
      display: flex;
      gap: 16px;
      align-items: center;
    }
    .top-bar a {
      color: #ffffff;
      text-decoration: none;
      font-size: 13px;
      font-weight: 500;
      opacity: 0.9;
      transition: opacity 0.2s;
    }
    .top-bar a:hover {
      opacity: 1;
      text-decoration: underline;
    }
    .swagger-ui .topbar { display: none; }
    .swagger-ui .info { margin: 24px 0; }
    .swagger-ui .info .title { color: #0F4C5C; }
    .swagger-ui .scheme-container { background: #ffffff; box-shadow: none; border-bottom: 1px solid #e2e8f0; }
    .swagger-ui .btn.authorize { color: #0F4C5C; border-color: #0F4C5C; }
    .swagger-ui .btn.authorize svg { fill: #0F4C5C; }
    .swagger-ui .opblock.opblock-post { border-color: #10b981; background: rgba(16, 185, 129, 0.05); }
    .swagger-ui .opblock.opblock-get { border-color: #0F4C5C; background: rgba(15, 76, 92, 0.05); }
  </style>
</head>
<body>
  <div class="top-bar">
    <div class="brand">
      <span>⚓ MARSA (مرسى)</span>
      <span class="badge">OpenAPI 3.1</span>
    </div>
    <div class="links">
      <a href="/api/openapi.json" target="_blank">📄 Raw OpenAPI JSON</a>
      <a href="/ar" target="_blank">🌐 Marsa Platform</a>
    </div>
  </div>

  <div id="swagger-ui"></div>

  <script src="https://unpkg.com/swagger-ui-dist@5.18.2/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5.18.2/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = () => {
      window.ui = SwaggerUIBundle({
        url: '/api/openapi.json',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        layout: "BaseLayout",
        defaultModelsExpandDepth: 2,
        defaultModelExpandDepth: 2,
        docExpansion: "list",
        filter: true,
        showExtensions: true,
        showCommonExtensions: true,
      });
    };
  </script>
</body>
</html>`;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}
