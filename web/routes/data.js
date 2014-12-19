var getAbsolutePath = require('../../modules/other/pathUtils').getAbsolutePath;
var model = require(getAbsolutePath('spiders/model'));
var Router = require('koa-router'),
    router = new Router();

router.post('/', function *() {
    this.type = 'application/json';
    this.body = yield model.countBySource(['soufun', '58', 'anjuke']);
});
module.exports = router;