var Router = require('koa-router'),
    router = new Router();

router.get('/', function *() {
    yield this.render('index', {title: 'index'});
});
module.exports = router;