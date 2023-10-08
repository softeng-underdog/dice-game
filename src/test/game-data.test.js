import { describe, it, beforeEach } from "vitest"
import GameData from '../game-data'
import * as types from '../game-data/types'

/**
 * 测试用玩家描述符列表
 * @type {types.PlayerDescriptor[]}
 */
const testPlayerDescriptors = [
    {
        id: 0,
        name: 'Foo',
        avatar: 'https://example.com/avatar.png',
        isCPU: false
    },
    {
        id: 1,
        name: 'Bar',
        avatar: 'https://example.com/avatar.png',
        isCPU: true
    },
    {
        id: 2,
        name: 'Sweet',
        avatar: 'https://example.com/avatar.png',
        isCPU: true
    }
]

/**
 * 测试用局数
 */
const testGames = 5

/**
 * 测试用筹码数
 */
const testChips = 10

/**
 * 测试用双对数据
 */
const testDoublePair = [
    [2, 2, 4, 4, 5],
    [2, 2, 3, 4, 4],
    [1, 2, 2, 6, 6]
]

/**
 * 测试用三连数据
 */
const testTriple = [
    [2, 2, 2, 3, 4],
    [1, 2, 2, 2, 4],
    [1, 2, 3, 3, 3]
]

/**
 * 测试用葫芦数据
 */
const testGourd = [
    [5, 5, 5, 6, 6],
    [4, 4, 6, 6, 6]
]

/**
 * 测试用四连数据
 */
const testQuadruple = [
    [1, 6, 6, 6, 6],
    [4, 4, 4, 4, 5]
]

/**
 * 测试用五连数据
 */
const testQuintuple = [
    [1, 1, 1, 1, 1],
    [6, 6, 6, 6, 6]
]

/**
 * 测试用小顺子数据
 */
const testSmallStraight = [
    [1, 2, 3, 4, 6],
    [1, 3, 4, 5, 6]
]

/**
 * 测试用大顺子数据
 */
const testBigStraight = [
    [1, 2, 3, 4, 5],
    [2, 3, 4, 5, 6]
]

/**
 * 测试用普通组合数据
 */
const testNormalComb = [
    [1, 3, 4, 6, 6],
    [2, 2, 3, 4, 6]
]


beforeEach(ctx => {
    ctx.gd = new GameData()
    ctx.gd.initMatch(testGames, testChips, testPlayerDescriptors)
})

describe('GameData', () => {
    it('initMatch', ({expect, gd}) => {
        expect(gd).toMatchObject({
            multiplier: 1,
            currentGame: 1,
            games: testGames,
            currentRound: 1,
            currentPlayerIndex: 0
        })
        expect(gd.playerData).toBeInstanceOf(Array)
        expect(gd.playerData).toHaveLength(testPlayerDescriptors.length)
        for (let i = 0; i < testPlayerDescriptors.length; i++) {
            expect(gd.playerData[i]).toMatchObject({
                id: testPlayerDescriptors[i].id,
                name: testPlayerDescriptors[i].name,
                avatar: testPlayerDescriptors[i].avatar,
                isCPU: testPlayerDescriptors[i].isCPU,
                diceData: [1, 1, 1, 1, 1],
                diceLockedBitmap: 0,
                chips: testChips
            })
        }
    })

    it('getGlobalInfo', ({expect, gd}) => {
        /**
         * @type {types.GlobalInfo}
         */
        let globalInfo = gd.getGlobalInfo()
        expect(globalInfo).toStrictEqual({
            multiplier: 1,
            currentGame: 1,
            games: testGames,
            currentRound: 1,
            currentPlayerIndex: 0
        })
    })

    it('switchPlayer', ({expect, gd}) => {
        expect(() => gd.switchPlayer(10)).toThrowError()
        //测试正常功能
        gd.switchPlayer(1)
        expect(gd.currentPlayerIndex).toBe(1)
        //测试当前玩家
        gd.switchPlayer()
        expect(gd.currentPlayerIndex).toBe(2)
        //测试轮转
        gd.switchPlayer()
        expect(gd.currentPlayerIndex).toBe(0)
    })

    it('getPlayerData', ({expect, gd}) => {
        expect(() => gd.getPlayerData(10)).toThrowError()
        //测试正常功能
        /**
         * @type {types.PlayerData}
         */
        let playerData;
        for (let i = 0; i < testPlayerDescriptors.length; i++) {
            playerData = gd.getPlayerData(i)
            expect(playerData).toStrictEqual({
                id: testPlayerDescriptors[i].id,
                name: testPlayerDescriptors[i].name,
                avatar: testPlayerDescriptors[i].avatar,
                isCPU: testPlayerDescriptors[i].isCPU,
                diceData: [1, 1, 1, 1, 1],
                diceLockedBitmap: 0,
                chips: testChips
            })
        }
        //测试当前玩家
        gd.switchPlayer(1)
        playerData = gd.getPlayerData()
            expect(playerData).toStrictEqual({
                id: testPlayerDescriptors[1].id,
                name: testPlayerDescriptors[1].name,
                avatar: testPlayerDescriptors[1].avatar,
                isCPU: testPlayerDescriptors[1].isCPU,
                diceData: [1, 1, 1, 1, 1],
                diceLockedBitmap: 0,
                chips: testChips
            })
    })

    it('getPlayerDataAll', ({expect, gd}) => {
        expect(gd.getPlayerDataAll()).toStrictEqual(gd.playerData)
    })

    it('finishRound', ({expect, gd}) => {
        gd.finishRound()
        expect(gd.getGlobalInfo().currentRound).toBe(2)
    })

    it('toggleLockedByIndex', ({expect, gd}) => {
        expect(() => gd.toggleLockedByIndex(0, 10)).toThrowError()
        expect(() => gd.toggleLockedByIndex(5, 0)).toThrowError()
        //测试正常功能
        gd.toggleLockedByIndex(0, 0)
        gd.toggleLockedByIndex(1, 0)
        expect(gd.getPlayerData(0).diceLockedBitmap).toBe(0b11)
        gd.toggleLockedByIndex(0, 0)
        expect(gd.getPlayerData(0).diceLockedBitmap).toBe(0b10)
        //测试当前玩家
        gd.switchPlayer(1)
        gd.toggleLockedByIndex(0)
        gd.toggleLockedByIndex(1)
        expect(gd.getPlayerData(1).diceLockedBitmap).toBe(0b11)
    })

    it('getLockedByIndex', ({expect, gd}) => {
        expect(() => gd.getLockedByIndex(0, 10)).toThrowError()
        expect(() => gd.getLockedByIndex(5, 0)).toThrowError()
        //测试正常功能
        gd.toggleLockedByIndex(0, 0)
        gd.toggleLockedByIndex(1, 0)
        expect(gd.getLockedByIndex(0, 0)).toBeTruthy()
        expect(gd.getLockedByIndex(1, 0)).toBeTruthy()
        gd.toggleLockedByIndex(0, 0)
        expect(gd.getLockedByIndex(0, 0)).toBeFalsy()
        //测试当前玩家
        gd.switchPlayer(1)
        gd.toggleLockedByIndex(0)
        expect(gd.getLockedByIndex(0)).toBeTruthy()
    })

    it('setLockedBitmap', ({expect, gd}) => {
        expect(() => gd.setLockedBitmap(0, 10)).toThrowError()
        expect(() => gd.setLockedBitmap(0b100000, 0)).toThrowError()
        //测试锁定位图是否设置成功
        gd.setLockedBitmap(0b111, 0)
        expect(gd.getPlayerData(0).diceLockedBitmap).toBe(0b111)
        //测试当前玩家
        gd.switchPlayer(1)
        gd.setLockedBitmap(0b111)
        expect(gd.getPlayerData().diceLockedBitmap).toBe(0b111)
    })

    it('double', ({expect, gd}) => {
        gd.double(3)
        expect(gd.getGlobalInfo().multiplier).toBe(4)
    })

    it('rollDice', ({expect, gd}) => {
        expect(() => gd.rollDice(null, 10)).toThrowError()
        expect(() => gd.rollDice([1, 1, 1, 1, 1, 1], 0)).toThrowError()
        expect(() => gd.rollDice([0, 0, 0, 0, 0], 0)).toThrowError()
        //测试投掷结果是否设置成功，两次投掷结果是否不同
        let rollResult = gd.rollDice(null, 0)
        expect(gd.getPlayerData(0).diceData).toStrictEqual(rollResult)
        expect(gd.rollDice(null, 0)).not.toStrictEqual(rollResult)
        //测试当前玩家，锁定骰子功能
        gd.switchPlayer(1)
        gd.setLockedBitmap(0b111)
        rollResult = gd.rollDice(null)
        expect([rollResult[0], rollResult[1], rollResult[2]]).toStrictEqual([1, 1, 1])
        //测试结果锁定功能
        rollResult = gd.rollDice(testNormalComb[0])
        expect(rollResult).toStrictEqual(testNormalComb[0])
    })

    it('getPlayerScoreInfo', ({expect, gd}) => {
        expect(() => gd.getPlayerScoreInfo(10)).toThrowError()
        /**
         * @type {types.ScoreInfo}
         */
        let scoreInfo;
        let diceScore;
        //普通组合
        testNormalComb.forEach(diceData => {
            diceScore = 0;
            diceData.forEach(dice => diceScore += dice)
            gd.rollDice(diceData)
            scoreInfo = gd.getPlayerScoreInfo()
            expect(scoreInfo).toStrictEqual({
                bonusType: types.BonusType.NONE,
                bonusScore: 0,
                diceScore,
                totalScore: diceScore
            })
        })
        //双对
        testDoublePair.forEach(diceData => {
            diceScore = 0;
            diceData.forEach(dice => diceScore += dice)
            gd.rollDice(diceData)
            scoreInfo = gd.getPlayerScoreInfo()
            expect(scoreInfo).toStrictEqual({
                bonusType: types.BonusType.DOUBLE_PAIR,
                bonusScore: 10,
                diceScore,
                totalScore: diceScore + 10
            })
        })
        //三连
        testTriple.forEach(diceData => {
            gd.rollDice(diceData)
            scoreInfo = gd.getPlayerScoreInfo()
            expect(scoreInfo).toMatchObject({
                bonusType: types.BonusType.TRIPLE,
                bonusScore: 10,
            })
        })
        //葫芦
        testGourd.forEach(diceData => {
            gd.rollDice(diceData)
            scoreInfo = gd.getPlayerScoreInfo()
            expect(scoreInfo).toMatchObject({
                bonusType: types.BonusType.GOURD,
                bonusScore: 20,
            })
        })
        //四连
        testQuadruple.forEach(diceData => {
            gd.rollDice(diceData)
            scoreInfo = gd.getPlayerScoreInfo()
            expect(scoreInfo).toMatchObject({
                bonusType: types.BonusType.QUADRUPLE,
                bonusScore: 40,
            })
        })
        //五连
        testQuintuple.forEach(diceData => {
            gd.rollDice(diceData)
            scoreInfo = gd.getPlayerScoreInfo()
            expect(scoreInfo).toMatchObject({
                bonusType: types.BonusType.QUINTUPLE,
                bonusScore: 100,
            })
        })
        //小顺子
        testSmallStraight.forEach(diceData => {
            gd.rollDice(diceData)
            scoreInfo = gd.getPlayerScoreInfo()
            expect(scoreInfo).toMatchObject({
                bonusType: types.BonusType.SMALL_STRAIGHT,
                bonusScore: 30,
            })
        })
        //大顺子
        testBigStraight.forEach(diceData => {
            gd.rollDice(diceData)
            scoreInfo = gd.getPlayerScoreInfo()
            expect(scoreInfo).toMatchObject({
                bonusType: types.BonusType.BIG_STRAIGHT,
                bonusScore: 60,
            })
        })
    })

    it('finishGame', ({expect, gd}) => {
        gd.rollDice(testDoublePair[0], 0)
        gd.rollDice(testDoublePair[1], 1)
        gd.rollDice(testDoublePair[2], 2)
        gd.double(1)
        /**
         * @type {types.AllocateInfo}
         */
        let allocateInfo = gd.finishGame()
        let globalInfo = gd.getGlobalInfo()
        expect(globalInfo).toMatchObject({
            multiplier: 1,
            currentGame: 2,
            currentRound: 1,
            currentPlayerIndex: 0
        })
        expect(allocateInfo).toMatchObject({
            topPlayerIndex: [0, 2],
            chipDifference: [0, 4, 0],
            knockoutPlayerIndex: []
        })
        expect(allocateInfo.topPlayerData[0]).toMatchObject({
            id: testPlayerDescriptors[0].id,
            chips: testChips
        })
        expect(allocateInfo.topPlayerData[1]).toMatchObject({
            id: testPlayerDescriptors[2].id,
            chips: testChips
        })
        expect(gd.getPlayerData(0)).toMatchObject({
            id: testPlayerDescriptors[0].id,
            chips: testChips + 4
        })
        expect(gd.getPlayerData(1)).toMatchObject({
            id: testPlayerDescriptors[1].id,
            chips: testChips - 8
        })
        expect(gd.getPlayerData(2)).toMatchObject({
            id: testPlayerDescriptors[2].id,
            chips: testChips + 4
        })

        gd.initMatch(testGames, testChips, testPlayerDescriptors)
        gd.rollDice(testGourd[0], 0)
        gd.rollDice(testDoublePair[0], 1)
        gd.rollDice(testDoublePair[1], 2)
        allocateInfo = gd.finishGame()
        expect(allocateInfo).toMatchObject({
            topPlayerIndex: [0],
            chipDifference: [0, 20, 22],
            knockoutPlayerIndex: [1, 2]
        })
        expect(gd.getPlayerData(0)).toMatchObject({
            id: testPlayerDescriptors[0].id,
            chips: testChips + 42
        })
    })
})
