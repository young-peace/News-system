const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
      createProxyMiddleware({
        // 每次取数据都会代理到端口为5000的主机上
      target: 'http://localhost:5000',
      changeOrigin: true,
    })
  );
};