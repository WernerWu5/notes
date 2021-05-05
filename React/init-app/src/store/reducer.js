
const defaultState = {
    list: [1, 2, 3],
    inputValue: 'store'
} 

const fun = (state = defaultState, action) => {
     console.log('action', action)
    return state
}

export default  fun