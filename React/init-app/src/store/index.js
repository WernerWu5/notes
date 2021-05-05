import { createStore, applyMiddleware } from 'redux'
import reducer from './reducer'

// import thunk from 'redux-thunk'
import createSagaMiddleWare from 'redux-saga'
import saga from './saga'

// const compo = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
// const enhancer = compo(applyMiddleware(thunk))

const sagaMiddle = createSagaMiddleWare()

const store = createStore(
    reducer,
    // applyMiddleware(thunk)
    applyMiddleware(sagaMiddle)
)

sagaMiddle.run(saga)

export default store;