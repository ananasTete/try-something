const Koa = require('koa')
const Router = require('koa-router');
const cors = require('@koa/cors')
const { koaBody } = require('koa-body')

const app = new Koa()
const router = new Router()

app.use(cors())

router.post('/upload', koaBody({ multipart: true }), async (ctx) => {
    const { fileName, index, chunkLength } = ctx.request.body;


    console.log(ctx.request.files.file);
    console.log('fileName:', fileName);
    console.log('index:', index);
    console.log('chunkLength:', chunkLength);
    console.log('------------->');

    // const tmpDir = path.join(__dirname, 'tmp', fileName);
    // const tmpFile = path.join(tmpDir, chunk);

    // if (!fs.existsSync(tmpDir)) {
    //     fs.mkdirSync(tmpDir);
    // }

    // fs.renameSync(chunk.path, tmpFile);

    ctx.response.body = JSON.stringify('ok')
})

app.use(router.routes());
app.listen(3000)