import {takeEvery} from 'redux-saga/effects'
import {CHANGE_LIST} from './actionTypes'

function* getInit() {
    yield console.log('redux-saga触发')
}

function* mySage() {
    yield takeEvery(CHANGE_LIST, getInit)
}

export default mySage