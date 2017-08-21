'use strict'

const test = require('ava')
const requestBuilder = require('../helpers/request_builder')
const TestableBotBuilder = require('../helpers/testable_bot_builder')
const User = require('../../lib/user')

const TODAY = '2017-08-17'
const TESTUSER = new User(
    'xpeppers.user',
    'toggltoken1023jrwdfsd9v',
    9243852,
    'MPOS'
)

const DAY_OFF = {
    id: "8352044",
    description: "Assenza"
}

test('track past day in current month as day off', t => {
    const testableBotBuilder = new TestableBotBuilder()
    const request = requestBuilder()
        .withUsername(TESTUSER.username)
        .withText('ferie 16')
    const expectedMorningEntry = entry(DAY_OFF.id, DAY_OFF.description, '2017-08-16T09:00:00+02:00')
    const expectedAfternoonEntry = entry(DAY_OFF.id, DAY_OFF.description, '2017-08-16T14:00:00+02:00')
    const bot = testableBotBuilder
        .withTodayDate(TODAY)
        .withAlreadySavedUsers([TESTUSER])
        .withExpectedCallsOnCreateTimeEntry([expectedMorningEntry, expectedAfternoonEntry])
        .build()

    const response = bot(request)

    return response.then(res => {
        t.is('Ciao ' + TESTUSER.username + '. Ho tracciato la giornata di mercoledì 16 agosto sul progetto Assenza (8352044).', res)
        testableBotBuilder.verifyMocksExpectations()
    })
})

function entry(pid, description, startTime) {
    return {
        pid: pid,
        description: description,
        created_with: 'TrackerBot',
        duration: 4 * 60 * 60,
        billable: true,
        start: startTime,
        tags: ["Ferie"]
    }
}
