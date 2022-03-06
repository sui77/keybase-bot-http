const Router = require('koa-router');
const Koa = require('koa');
const koaBody = require('koa-body');
const log = require('./log.js');

const WebServer = class {

    constructor(httpPort, apiKey) {
        this.apiKey = apiKey;
        this.httpPort = httpPort;
        this.onChatMessageHandler = [];
    }

    onChatMessage( cb ) {
        this.onChatMessageHandler.push(cb);
    }

    triggerOnChatMessage( msg) {
        for (let n in this.onChatMessageHandler) {
            this.onChatMessageHandler[n]( msg );
        }
    }

    init() {
        const router = new Router();
        router.get( '/sendmessage', require('./WebServer/sendmessage.js')((msg) => this.triggerOnChatMessage(msg) ));
        router.post( '/grafana', require('./WebServer/grafana.js')((msg) => this.triggerOnChatMessage(msg) ));
        const app = new Koa();
        app
            .use(koaBody())
            .use( async(ctx, next) => {
                if (typeof(ctx.query.apikey) == 'undefined' || ctx.query.apikey != this.apiKey) {
                    ctx.response.status = 403;
                    ctx.body = '403 forbidden';
                }
                await next();
            })
            .use(router.routes())
            .use(router.allowedMethods())
            .use( require('./WebServer/catchall.js')({registry: this.registry, config: this.config}) )
            .use( async(ctx, next) => {
                let ip = typeof ctx.request.headers['x-forwarded-for'] == 'undefined' ? ctx.ip : ctx.request.headers['x-forwarded-for'];
                log.info(ip + ' ' + ctx.response.status + ' ' + ctx.request.method + ' ' + ctx.request.url);
                await next();
            })
            .listen(this.httpPort)
            .setTimeout(15000);

    }

}

module.exports = WebServer;