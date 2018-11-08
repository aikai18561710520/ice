const tip = '兽人，永不为奴!点击<a href="https://17mei.com">查看</a>'

export default async(ctx, next) => {
    const message = ctx.weixin
    console.log(message)
    eventHash[message.MsgType](ctx, message)
}

const eventHash = {
    event: (ctx, message) => {
        if (message.Event === 'subscribe') {
            ctx.body = tip
        } else if (message.Event === 'unsubscribe') {
            console.log('用户取消关注')
        } else if (message.Event === 'LOCATION') {
            ctx.body = message.Latitude + ' : ' + message.Longitude
        }
    },
    text: (ctx, message) => {
        ctx.body = message.Content
    },
    image: (ctx, message) => {
        ctx.body = {
            type: 'image',
            mediaId: message.MediaId
        }
    },
    voice: (ctx, message) => {
        ctx.body = {
            type: 'voice',
            mediaId: message.MediaId
        }
    },
    video: (ctx, message) => {
        ctx.body = {
            title: message.thumbMediaId,
            type: 'video',
            mediaId: message.MediaId
        }
    },
    location: (ctx, message) => {
        ctx.body = message.Location_X + ' : ' + message.Location_Y + ' : ' + message.Label
    },
    link: (ctx, message) => {
        ctx.body = [{}]
    }
}