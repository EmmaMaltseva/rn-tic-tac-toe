import Koa from 'koa';

const app =  new Koa();

app.use(async ctx => {
  ctx.body = 'Hell World'
});

app.listen(3000);



