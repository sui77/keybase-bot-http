const _ = require('lodash');

module.exports = function (options) {

    return async (ctx, next) => {

        if (ctx.response.status == 404) {
            ctx.set('Content-type', 'text/html');
            ctx.response.body = '404 not found :(';
            ctx.response.status = 404;
        }

        await next();
    }

};

