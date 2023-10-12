/**
 * 云端模块，提供存取数据库的方法
 * @module cloud
 */

import * as dataTypes from './types'
import { cloud } from '@tarojs/taro'
import path from 'path'

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
    },
    /**
     * 增加胜场数
     * @param {string?} id 用户ID，若为null则表示当前用户
     */
    async incWinCount(id = null) {
        let info = await this.getUserInfo(id)
        await cloud.callFunction({
            name: 'updateUserInfo',
            data: { id, data: {
                    winCount: info.winCount + 1
                } 
            }
        })
        if (id === null) this._currentUserInfo = null
    },
    /**
     * 增加负场数
     * @param {string?} id 用户ID，若为null则表示当前用户
     */
    async incLoseCount(id = null) {
        let info = await this.getUserInfo(id)
        await cloud.callFunction({
            name: 'updateUserInfo',
            data: { id, data: {
                    loseCount: info.loseCount + 1
                } 
            }
        })
        if (id === null) this._currentUserInfo = null
    },
    /**
     * 上传头像
     * @param {string} avatarPath 头像路径
     * @param {string?} id 用户ID，若为null则表示当前用户
     */
    async uploadAvatar(avatarPath, id = null) {
        await this.getUserInfo(id)
        let res = await cloud.uploadFile({
            cloudPath: `user${path.extname(avatarPath)}`,
            filePath: avatarPath
        })
        await cloud.callFunction({
            name: 'updateUserInfo',
            data: { id, data: {
                    avatar: res.fileID
                } 
            }
        })
        if (id === null) this._currentUserInfo = null
    },
    /**
     * 更新用户基本信息
     * @param {string?} nickname 昵称，若为null则表示不变
     * @param {string?} bio 个性签名，若为null则表示不变
     * @param {string?} id 用户ID，若为null则表示当前用户
     */
    async updateUserProfile(nickname = null, bio = null, id = null) {
        let info = await this.getUserInfo(id)
        await cloud.callFunction({
            name: 'updateUserInfo',
            data: { id, data: {
                    nickname: nickname ?? info.nickname,
                    bio: bio ?? info.bio
                } 
            }
        })
        if (id === null) this._currentUserInfo = null
    }
}

const db = cloud.database({
    throwOnNotFound: false
})

const mdb = db.collection('match_db')

const MatchDB = {
    async findMatch() {
        let userRecord = await UserDB.getUserInfo()
        let roomId = await cloud.callFunction({
            name: 'findMatch',
            data: {
                id: userRecord.id,
                name: userRecord.nickname,
                avatar: userRecord.avatar
            }
        })
        return roomId
    },
    async watchMatchDescriptors() {
        
    }
}

export default {
    UserDB,
    MatchDB
}