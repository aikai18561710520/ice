import Router from 'koa-router'
import path from 'path'
import config from '../config'
import reply from '../wechat/reply'
import wechatMiddle from '../wechat-lib/middleware'

export const router = app => {
    const router = new Router()

    router.all('/wechat-hear', wechatMiddle(config.wechat, reply))

    router.get('/upload', async(ctx, next) => {
        let wechat = require('../wechat')
        let client = wechat.getWechat()
        const news = {
            "articles": [{
                "title": 'kobe_bryant',
                "thumb_media_id": 'uPo-AfR59xEfwlfroEgVf_-hxUlmC5yWfQkwThpNYZM',
                "author": 'Irvint',
                "digest": '啥都没有',
                "show_cover_pic": 1,
                "content": '没有内容',
                "content_source_url": 'https://baidu.com'
            }, {
                "title": 'leberon',
                "thumb_media_id": 'uPo-AfR59xEfwlfroEgVf_-hxUlmC5yWfQkwThpNYZM',
                "author": 'Irvint',
                "digest": '啥都没有',
                "show_cover_pic": 0,
                "content": '没有内容',
                "content_source_url": 'https://baidu.com'
            }]
        }
        const data = await client.handleOperation('uploadMaterial', 'news', news, {})
        console.log(data)
    })
    app
        .use(router.routes())
        .use(router.allowedMethods())
}