// 引入 Koa 框架
const Koa = require('koa');
const Router = require('@koa/router');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const qs = require('qs');

// 创建 Koa 实例
const app = new Koa();
const router = new Router();

// 启用 CORS 中间件
app.use(cors());

// 启用 bodyParser 中间件
app.use(bodyParser());

// 定义 /something 路由
router.post('/something', (ctx) => {
    console.log('请求体:', ctx.request.body);
    ctx.body = ctx.request.body;
});

// 使用路由中间件
app
    .use(router.routes())
    .use(router.allowedMethods());

// 设置服务器端口
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
