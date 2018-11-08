import request from 'request-promise'
import fs from 'fs'
import * as _ from 'lodash'
import path from 'path'

const base = 'https://api.weixin.qq.com/cgi-bin'
const api = {
    accessToken: `${base}/token?grant_type=client_credential`,
    tempoaray: {
        upload: `${base}/media/upload?`,
        fetch: `${base}/media/get?`
    },
    permanent: { // 上传永久素材
        upload: `${base}/material/add_material?`, // 上传永久素材
        uploadNewsPic: `${base}/media/uploadimg?`, // 上传永久素材图文图片
        uploadNews: `${base}/material/add_news?`, // 上传图文
        fetch: `${base}material/get_material?`, // 获取素材
        del: `${base}/material/del_material?`, // 删除素材
        updateNews: `${base}/material/update_news?`, // 更新图文素材
        count: `${base}/material/get_materialcount?`, // 获取永久素材总数
        getMaterialList: `${base}/material/batchget_material?` // 获取素材列表
    }
}

function statFile(filepath) {
    return new Promise((resolve, reject) => {
        fs.stat(filepath, (err, stat) => {
            if (err)
                reject(err)
            else
                resolve(stat)
        })
    })
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

    uploadMaterial(token, type, material, permanent) {
        let form = {}
        let url = api.tempoaray.upload
        if (permanent) {
            url = api.permanent.upload
            _.extend(form, permanent)
        }

        if (type === 'pic') {
            url = api.permanent.uploadNewsPic
        }

        if (type === 'news') {
            url = api.permanent.uploadNews
            form = material
        } else {
            form.media = fs.createReadStream(material)
                // const stat = await statFile(material) form.file('media', material,
                // path.basename(material), stat.size)
        }
        let uploadUrl = `${url}access_token=${token}`

        if (!permanent) {
            uploadUrl += '&type=' + type
        } else {
            if (type !== 'news') {
                form.access_token = token
            }
        }

        const options = {
            method: 'post',
            url: uploadUrl,
            json: true
        }
        console.log(options)
        if (type === 'news') {
            options.body = form
        } else {
            options.formData = form
        }
        return options
    }

    async handleOperation(operation, ...args) { //上传素材
        const tokenData = await this.fetchAccessToken()
        const options = this[operation](tokenData.access_token, ...args)
        const data = await this.request(options)
        return data
    }

    fetchMaterial(token, mediaId, type, permanent) { // 获取素材
        let form = {}
        let fetchUrl = api.tempoaray.fetch
        if (permanent) {
            fetchUrl = api.permanent.fetch
        }

        let url = `${fetchUrl}access_token=${token}`
        const options = {
            method: 'POST',
            url: url
        }

        if (permanent) {
            form.access_token = token
            form.media_id = mediaId
            options.body = form
        } else {
            if (type === 'video') {
                url = url.replace('https', 'http')
            }
            url += '&media_id=' + mediaId
        }
        return options
    }

    delMaterial(token, mediaId) { // 删除素材
        let form = {
            media_id: mediaId
        }

        let url = `${api.permanent.del}access_token=${token}&media_id=${mediaId}`
        return { method: 'POST', url: url, body: form }
    }

    updateMaterial(token, mediaId, news) { // 修改素材
        let form = {
            media_id: mediaId
        }
        _.extend(form, news)

        let url = `${api.permanent.updateNews}access_token=${token}&media_id=${mediaId}`

        return { method: 'POST', url: url, body: form }
    }

    getMaterialCount(token) { // 获取素材总数
        let url = `${api.permanent.count}access_token=${token}`
        return { method: 'POST', url: url }
    }
    batchMaterial(token, options) { // 获取素材列表
        options.type = options.type || 'image'
        options.offset = options.offset || 0
        options.count = options.count || 10

        return { method: 'POST', url: `${api.permanent.batchMaterial}access_token=${token}`, body: options }
    }
}