import React from 'react';
import Item from './components/item'
import store from '../store'
// import { changeList, ajax } from '../store/actionCreators.js'
// import { ajax } from '../store/actionCreators.js' // redux-thunk
import { changeList } from '../store/actionCreators.js'

import { connect } from 'react-redux'

class List extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            inputValue: '',
            list: [],
            ...store.getState()
        }
        console.log('store.getState()', store.getState())
        // store.subscribe()
        this.inputChange = this.inputChange.bind(this)
        this.addList = this.addList.bind(this)
        this.renderList = this.renderList.bind(this)
        this.delList = this.delList.bind(this)
    }
    render() {
        return (
            <React.Fragment>
                <section className="input-box">
                    <input onChange={this.inputChange} value={this.props.inputValue}></input>
                    <button onClick={this.props.change}>添加</button>
                </section>

                <section>
                    <ul>
                        {this.renderList()}
                    </ul>
                </section>
            </React.Fragment>
        )

    }
    inputChange(e) {
        this.setState((pre) => {
            return {
                inputValue: e.target.value
            }
        })
    }
    addList() {
        this.setState((pre) => (
            {
                list: [...pre.list, pre.inputValue]
            }
        ), () => {
            // let value = changeList(this.state.list[this.state.list.length - 1])
            
            // store.dispatch(value)
            // store.dispatch(ajax())

            // store.dispatch(value)
        })
    }
    delList(index) {
        let list = [...this.state.list]
        list.splice(index, 1)
        this.setState(() => (
            {
                list
            }
        ))
    }
    renderList() {
        return this.state.list.map((item, index) => {
            return <Item item={item} key={item} delList={this.delList}></Item>
        })
    }
}

const mapStateToPros = (state) => {
    return {
        inputValue: state.inputValue
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        change() {
            console.log('mapDispatch')
            dispatch(changeList('mapDispatch'))
        }
    }
}

export default connect(mapStateToPros, mapDispatchToProps)(List)