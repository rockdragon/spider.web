var auth = require('koa-basic-auth');
var koa = require('koa');
var mount = require('koa-mount');
var router = require('koa-router');
var render = require('koa-ejs');
var serve = require('koa-static');
var getAbsolutePath = require('../modules/other/pathUtils').getAbsolutePath;
var config = require("../modules/config/configUtils").getConfigs();
var logger = require("../modules/logger/logUtils");

var app = koa();
app.use(router(app));

app.use(function *(next){
    try {
        yield next;
    } catch (err) {
        if (401 == err.status) {
            this.status = 401;
            this.set('WWW-Authenticate', 'Basic');
            this.body = 'Your operation been prohibited';
        } else {
            throw err;
        }
    }
});

app.use(auth(config.auth));

/*
* API routers
* */
var houses = require(getAbsolutePath('web/rest/routes/houses'));
app.use(mount('/houses', houses.middleware()));

app.use(function *(){
    this.body = 'Authorized.';
});

app.listen(config.rest_port);
console.log('listening on port', config.rest_port);
