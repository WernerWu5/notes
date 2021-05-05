import { CHANGE_LIST } from './actionTypes.js'

export const changeList = (value) => ({
    type: CHANGE_LIST,
    value
})

export const ajax = () => {
    return (dispatch) => {
        console.log('我是请求')
        dispatch(changeList('我是异步'))
    }
}