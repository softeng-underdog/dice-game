/**
 * 云端模块，提供存取数据库的方法
 * @module cloud
 */

import * as dataTypes from './types'
import { cloud } from '@tarojs/taro'

cloud.init({
    env: 'cloud1-2gum4le1e2076a50'
})

const UserDB = {
    /**
     * 当前用户信息缓存
     * @type {dataTypes.UserRecord?}
     */
    _currentUserInfo: null,
    /**
     * 获取用户信息
     * @param {string?} id 用户ID，若为null则表示当前用户
     * @returns {dataTypes.UserRecord} 用户信息
     */
    async getUserInfo(id = null) {
        if (id === null && this._currentUserInfo !== null) {
            return this._currentUserInfo
        }
        let res = await cloud.callFunction({
            name: 'getUserInfo',
            data: { id }
        })
        if (id === null)
            this._currentUserInfo = res.result
        return res.result
    }
}

export default {
    UserDB
}