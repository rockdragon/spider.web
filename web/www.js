var koa = require('koa');
var mount = require('koa-mount');
var router = require('koa-router');
var render = require('koa-ejs');
var serve = require('koa-static');
var getAbsolutePath = require('../modules/other/pathUtils').getAbsolutePath;

//settings
var app = koa();
app.use(router(app));
app.use(serve(getAbsolutePath('public'), {
    maxAge: 1000 * 86400 * 30
}));
app.use(serve(getAbsolutePath('bower_components'), {
    maxAge: 1000 * 86400 * 30
}));
render(app, {
    root: getAbsolutePath('web/views'),
    layout: false,
    viewExt: 'ejs',
    cache: false,
    debug: true
});

//routes
var index = require(getAbsolutePath('web/routes/index'));
var data = require(getAbsolutePath('web/routes/data'));
app.use(mount('/data', data.middleware()));
app.use(mount('/admin', index.middleware()));

//listen
app.listen(3000);