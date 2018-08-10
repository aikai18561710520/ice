import request from 'request-promise'

const base = 'https://api.weixin.qq.com/cgi-bin'
const api = {
    accessToken: base + '/token?grant_type=client_credential'
}
export default class Wechat {
    constructor(options) {
        this.options = Object.assign({}, options)
        this.appId = options.appId
        this.appSecret = options.appSecret
        this.getAccessToken = options.getAccessToken
        this.saveAccessToken = options.saveAccessToken

        this.fetchAccessToken()
    }

    async request(opts) {
        opts = Object.assign({}, opts, { json: true })
        try {
            const response = await request(opts)
            console.log(response)
            return response
        } catch (error) {
            console.error(error)
        }
    }

    async fetchAccessToken() {
        let data = this.getAccessToken()
        if (!this.isValidAccessToken(data)) {
            data = await this.updateAccessToken()
        }

        await this.saveAccessToken(data)

        return data

    }

    async updateAccessToken() {
        const url = `${api.accessToken}&appid=${this.appId}&secret=${this.appSecret}`
        const data = this.request({ url: url })

        const now = (new Date().getTime())

        const expiresIn = now + (data.expires_in - 20) * 1000

        data.expires_in = expiresIn

        return data
    }

    isValidAccessToken(data) {
        if (!data || !data.accessToken || !data.expires_in) {
            return false
        }
        const expiresIn = data.expires_in

        const now = (new Date().getTime())

        if (now < expiresIn) {
            return true
        } else {
            return false
        }
    }
}