const _ = require('lodash');

module.exports = function (cb) {


    return async (ctx, next) => {

        if (ctx.response.status == 404) {

            try {
                let params = ctx.request.query;

                let ok = true;
                let validate = ['message', 'team', 'topic'];
                for (n in validate) {
                    let key = validate[n];
                    if (_.isNil(params[key]) || !_.isString(params[key]) || params[key] == '') {
                        ok = false;
                    }
                }

                if (ok) {
                    ctx.response.body = 'ok';
                    cb({message: params.message, team: params.team, topic: params.topic})
                } else {
                    ctx.response.body = 'failed';
                }

                ctx.set('Access-Control-Allow-Origin', '*');
                ctx.set('Content-type', 'application/json');
                ctx.response.status = 200;

            } catch (e) {
                ctx.response.status = 500;
                ctx.response.body = "500 Internal Server Error (" + e.message + ")";
            }
        }
        await next();
    }
};

