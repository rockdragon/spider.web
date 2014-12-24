var Router = require('koa-router'),
    router = new Router();
var parse = require('co-body');
var getAbsolutePath = require('../../../modules/other/pathUtils').getAbsolutePath;
var model = require(getAbsolutePath('spiders/model'));
var util = require('util');

router.post('/', function *() {
    var houses = (yield parse.json(this));

    var j = 0;
    for (var i = 0, len = houses.length; i < len; i++) {
        var house = houses[i];
        yield model.bulkCreate(house);
        j++;
    }

    this.status = 201;
    this.body = util.format('%d records created', j);
});
