var Router = require('koa-router'),
    router = new Router();
var getAbsolutePath = require('../../modules/other/pathUtils').getAbsolutePath;
var model = require(getAbsolutePath('spiders/model'));

router.get('/', function *() {
    yield this.render('index', {title: 'index'});
});

router.post('/stat', function *() {
    this.type = 'application/json';
    this.body = yield model.countBySource(['soufun', '58', 'anjuke']);
});

router.get('/source/:source', function*(){
    this.body = this.params.source;
});

module.exports = router;