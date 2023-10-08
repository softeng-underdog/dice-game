/**
 * 游戏数据层模块，提供存储和操纵游戏数据的相关类及方法
 * @module gameData
 */

import * as dataTypes from './types.js'

/**
 * GameData类存储一场游戏的所有状态数据，同时对数据提供基本的操作方法
 * @class
 * @constructor
 * @public
 */
class GameData {
    /**
     * 构造GameData类的一个实例
     */
    constructor() {
        /**
         * 这局游戏的倍率
         * @type {number}
         * @private
         */
        this.multiplier = 1;
        /**
         * 当前游戏局号
         * @type {number}
         * @private
         */
        this.currentGame = 1;
        /**
         * 游戏局数
         * @type {number}
         * @private
         */
        this.games = 1;
        /**
         * 这局游戏轮号
         * @type {number}
         * @private
         */
        this.currentRound = 1;
        /**
         * 当前玩家的数据索引
         * @type {number}
         * @private
         */
        this.currentPlayerIndex = 0;
        /**
         * 所有玩家的游戏数据
         * @type {dataTypes.PlayerData[]}
         * @private
         */
        this.playerData = []
    }

    /**
     * 初始化整盘游戏的状态
     * @param {number} games 游戏局数
     * @param {number} playerChips 玩家初始持有的筹码数
     * @param {dataTypes.PlayerDescriptor[]} playerDescriptors 每个玩家的描述符列表
     */
    initMatch(games, playerChips, playerDescriptors) {
        this.playerData = []
        this.games = games;
        let length = playerDescriptors.length;
        for(let i = 0;i < length;i ++){
            let playerdata = {
                id : playerDescriptors[i].id,
                name : playerDescriptors[i].name,
                avatar : playerDescriptors[i].avatar,
                isCPU : playerDescriptors[i].isCPU,
                diceData : [1,1,1,1,1],
                diceLockedBitmap : 0,
                chips : playerChips
            };
            this.playerData.push(playerdata);
        }
    }

    /**
     * 获取全局游戏信息
     * @returns {dataTypes.GlobalInfo} 全局游戏信息
     */
    getGlobalInfo() {
        return {
            multiplier : this.multiplier,
            currentGame : this.currentGame,
            games : this.games,
            currentRound : this.currentRound,
            currentPlayerIndex : this.currentPlayerIndex
        };
    }

    /**
     * 获取指定玩家游戏数据（及其引用）
     * @param {number} playerIndex 玩家数据索引，若为-1，则选取当前玩家
     * @returns {dataTypes.PlayerData} 游戏数据
     */
    getPlayerData(playerIndex = -1) {
        if(playerIndex >= this.playerData.length || playerIndex < -1){
            throw new Error("Index out of range")
        }
        else if(playerIndex == -1){
            playerIndex = this.currentPlayerIndex
        }
        return this.playerData[playerIndex];
    }

    /**
     * 获取整个玩家游戏数据的数组
     * @returns {dataTypes.PlayerData[]} 游戏数据数组
     */
    getPlayerDataAll() {
        return this.playerData;
    }

    /**
     * 切换当前玩家的数据索引
     * @param {number} playerIndex 玩家数据索引，若为-1，则循环选取下一位玩家
     */
    switchPlayer(playerIndex = -1) {
        if(playerIndex >= this.playerData.length || playerIndex < -1){
            throw new Error("Index out of range")
        }
        else if(playerIndex == -1){
            let length = this.playerData.length;
            playerIndex = (this.currentPlayerIndex + 1) % length;
        }
        this.currentPlayerIndex = playerIndex;
    }

    /**
     * 获取玩家目前的分数情况
     * @param {number} playerIndex 玩家数据索引，若为-1，则选取当前玩家
     * @returns {dataTypes.ScoreInfo} 分数信息
     */
    getPlayerScoreInfo(playerIndex = -1) {
        if(playerIndex >= this.playerData.length || playerIndex < -1){
            throw new Error("Index out of range")
        }
        else if(playerIndex == -1){
            playerIndex = this.currentPlayerIndex
        }
        let bonustype = 0;
        let bonusscore = 0;
        let dicescore = 0;
        let totalscore = 0;
        /**
         * 计算骰子点数和
         */
        for(let i = 0;i < 5;i ++){//骰子点数和
            dicescore += this.playerData[playerIndex].diceData[i];
        }

        /**
         * 接下来判断奖励分
         */
        let diceTypeNum = [0,0,0,0,0,0,0];//用于记录每种骰子的数量
        for(let i = 0;i < 5;i ++){
            diceTypeNum[this.playerData[playerIndex].diceData[i]] += 1;
        }
        let sum1 = 0;//用于判断是否大顺子
        for(let i = 1;i < 6;i ++){
            if(diceTypeNum[i] == 1){
                sum1 ++;
                continue;
            }
            else {
                break;
            }
        }
        let sum2 = 0
        for(let i = 2;i < 7;i ++){
            if(diceTypeNum[i] == 1){
                sum2 ++;
                continue;
            }
            else {
                break;
            }
        }
        if(sum1 == 5 || sum2 == 5){
            bonustype = dataTypes.BonusType.BIG_STRAIGHT;
            bonusscore = 60;
            totalscore = bonusscore + dicescore;
            return {
                bonusType : bonustype,
                bonusScore : bonusscore,
                diceScore : dicescore,
                totalScore : totalscore
            };
        }
        for(let i = 1;i < 7;i ++){//其他奖励分类型
            if(diceTypeNum[i] == 5){//五连
                bonustype = dataTypes.BonusType.QUINTUPLE;
                bonusscore = 100;
                break;
            }
            else if(diceTypeNum[i] == 4){//四连
                bonustype = dataTypes.BonusType.QUADRUPLE;
                bonusscore = 40;
                break;
            }
            else if(diceTypeNum[i] == 3){//三连或葫芦
                let flag = false;
                for(let j = 1;j < 7;j ++){
                    if(diceTypeNum[j] == 2){//葫芦
                        bonustype = dataTypes.BonusType.GOURD;
                        bonusscore = 20;
                        flag = true;
                    }
                }
                if(flag){
                    break;
                }
                bonustype = dataTypes.BonusType.TRIPLE;//三连
                bonusscore = 10;
                break;
            }
            else if(diceTypeNum[i] == 2){//双对或其他
                for(let j = i + 1;j < 7;j ++){
                    if(diceTypeNum[j] == 2){//双对
                        bonustype = dataTypes.BonusType.DOUBLE_PAIR;
                        bonusscore = 10;
                        break;
                    }
                }
            }
            else{
                let sum1 = 0;//小顺子1
                let sum2 = 0;//小顺子2
                let sum3 = 0;//小顺子3
                for(let k = 1;k < 5;k++){//小顺子1
                    if(diceTypeNum[k] >= 1){
                        sum1 ++;
                    }
                };
                for(let k = 2;k < 6;k++){//小顺子2
                    if(diceTypeNum[k] >= 1){
                        sum2 ++;
                    }
                };
                for(let k = 3;k < 7;k++){//小顺子3
                    if(diceTypeNum[k] >= 1){
                        sum3 ++;
                    }
                };
                if(sum1 == 4 || sum2 == 4 || sum3 == 4){
                    bonustype = dataTypes.BonusType.SMALL_STRAIGHT;
                    bonusscore = 30;
                    break;
                }
            }
        }
        
        totalscore = bonusscore + dicescore;
        return {
            bonusType : bonustype,
            bonusScore : bonusscore,
            diceScore : dicescore,
            totalScore : totalscore
        };
    }

    /**
     * 完成本局游戏，根据目前的分数分配筹码，局号+1，重置倍率，重置轮数
     * @returns {dataTypes.AllocateInfo} 筹码分配结果
     */
    finishGame() {
        let length = this.playerData.length;
        let totalscore = [];//储存每位玩家的分数情况
        for(let i = 0;i < length;i++){
            let scoreinfo = this.getPlayerScoreInfo(i);
            totalscore.push(scoreinfo);
        }
        let maxScore = totalscore[0].totalScore;
        let topPlayerIndex = [];
        let topPlayerData = [];
        let chipDifference = [];
        let knockoutPlayerIndex = [];
        let getchips = 0;//最高分玩家赢得的筹码数
        for(let i = 1;i < length;i ++){//寻找最高分
            if(totalscore[i].totalScore > maxScore){
                maxScore = totalscore[i].totalScore;
            }
        }
        for(let i = 0;i < length;i ++){//是否有重复的
            if(totalscore[i].totalScore == maxScore){//将所有分数为最高分的玩家索引都加入数组
                topPlayerIndex.push(i);
                let playerdata = {
                    id : this.playerData[i].id,
                    name : this.playerData[i].name,
                    avatar : this.playerData[i].avatar,
                    isCPU : this.playerData[i].isCPU,
                    diceData : this.playerData[i].diceData,
                    diceLockedBitmap : this.playerData[i].diceLockedBitmap,
                    chips : this.playerData[i].chips
                };
                topPlayerData.push(playerdata)
            }
        }

        for(let i = 0;i < length;i++){//获取最高分玩家从每个玩家手中赢得的的筹码数、被击飞玩家索引，扣除其他玩家的筹码
            chipDifference.push((maxScore-totalscore[i].totalScore) * this.multiplier);
            getchips += chipDifference[i];
            this.playerData[i].chips -= chipDifference[i] * topPlayerData.length;
            if((this.playerData[i].chips) <= 0){//如果被击飞
                knockoutPlayerIndex.push(i);
            }
        }

        for(let i = 0;i < length;i++){//给最高分玩家加上赢得的筹码
            if(totalscore[i].totalScore == maxScore){
                this.playerData[i].chips += getchips;
            }
        }

        this.multiplier = 1;
        this.currentRound = 1;
        this.currentGame ++;
        return {
            topPlayerIndex,
            topPlayerData,
            chipDifference,
            knockoutPlayerIndex
        };
    }

    /**
     * 完成本轮游戏，轮数+1
     */
    finishRound() {
        this.currentRound ++;
    }

    /**
     * 投掷未被锁定的骰子，或直接设置投掷结果
     * @param {number[]?} rollResult 投掷结果，若不为null，则直接设置骰子数据为指定结果
     * @param {number} playerIndex 玩家数据索引，若为-1，则选取当前玩家
     * @returns {number[]} 投掷结果
     */
    rollDice(rollResult = null, playerIndex = -1) {
        if(rollResult != null && rollResult.length != 5){
            throw new Error("rollResult length error")
        }
        else if(rollResult != null){
            for(let i = 0;i < 5;i++){
                if(rollResult[i] > 6 || rollResult[i] < 1){
                    throw new Error("rollResult content error")
                }
            }
        }
        if(playerIndex >= this.playerData.length || playerIndex < -1){
            throw new Error("playerIndex out of range")
        }
        if(playerIndex == -1){
            playerIndex = this.currentPlayerIndex;
        }
        if (rollResult !== null){
            this.playerData[playerIndex].diceData = rollResult;
        }
        else {
            for(let i = 0;i < 5;i++){
                if((this.playerData[playerIndex].diceLockedBitmap & (1 << i)) == 0){//未锁定状态
                    this.playerData[playerIndex].diceData[i] = Math.round(Math.random()*5+1);
                }
            }
        }
        this.playerData[playerIndex].diceData.sort();
        return [...this.playerData[playerIndex].diceData];
    }

    /**
     * 切换指定索引骰子的锁定状态
     * @param {number} index 骰子索引
     * @param {number} playerIndex 玩家数据索引，若为-1，则选取当前玩家
     * @returns {boolean} 切换后的锁定状态
     */
    toggleLockedByIndex(index, playerIndex = -1) {
        if(playerIndex >= this.playerData.length || playerIndex < -1){
            throw new Error("playerIndex out of range")
        }
        else if(index > 4 || index < 0){
            throw new Error("Index out of range")
        }
        else if(playerIndex == -1){
            playerIndex = this.currentPlayerIndex;
        }
        this.playerData[playerIndex].diceLockedBitmap = this.playerData[playerIndex].diceLockedBitmap ^ (1 << index);
        return ((this.playerData[playerIndex].diceLockedBitmap & (1 << index)) !== 0);
    }

    /**
     * 获取指定索引骰子的锁定状态
     * @param {number} index 骰子索引
     * @param {number} playerIndex 玩家数据索引，若为-1，则选取当前玩家
     * @returns {boolean} 锁定状态
     */
    getLockedByIndex(index, playerIndex = -1) {
        if(playerIndex >= this.playerData.length || playerIndex < -1){
            throw new Error("playerIndex out of range")
        }
        else if(index > 4 || index < 0){
            throw new Error("Index out of range")
        }
        else if(playerIndex == -1){
            playerIndex = this.currentPlayerIndex;
        }
        return ((this.playerData[playerIndex].diceLockedBitmap & (1 << index)) !== 0);//该位为1返回true，否则返回false
    }

    /**
     * 设置骰子锁定状态位图
     * @param {number} bitmap 骰子锁定状态位图
     * @param {number} playerIndex 玩家数据索引，若为-1，则选取当前玩家
     */
    setLockedBitmap(bitmap, playerIndex = -1) {
        if(playerIndex >= this.playerData.length || playerIndex < -1){
            throw new Error("playerIndex out of range")
        }
        else if(bitmap > 31 || bitmap < 0){
            throw new Error("bitmap out of range")
        }
        if(playerIndex == -1){
            playerIndex = this.currentPlayerIndex;
        }
        this.playerData[playerIndex].diceLockedBitmap = bitmap;
    }

    /**
     * 增加倍率
     * @param {number} times 增加的倍率
     */
    double(times) {
        this.multiplier += times;
    }
}
export default GameData;
