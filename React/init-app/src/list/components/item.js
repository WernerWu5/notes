import React from 'react';
import PropTypes from 'prop-types'

class Item extends React.Component {
    constructor(props) {
        super(props)
        this.delList = this.delList.bind(this)
    }
    
    componentWillReceiveProps() {
        // 当组件在父组件接受参数
        // 首次渲染不会加载，第二次才会加载
        console.log('componentWillReceiveProps')
    }

    componentWillMount() {
        console.log('componentWillmount')
    }

    shouldComponentUpdate() {
        console.log('shouldComponentUpdate')
        return true // 返回true，则需要更新
    }

    componentWillUpdate() {
        console.log('componentWillUpdate') // shouldComponentUpdate返回true,则执行
    }

    render() {
        console.log('render')
        return( <li onClick={this.delList}>{this.props.item}</li>)
    }

    componentDidMount() {
        console.log('conponentsDidMount')
    }

    componentDidUpdate() {
        console.log('componentDidUpdate')
    }

    componentWillUnmount() {
        console.log('componentWillUnmount')
    }

    delList() {
        this.props.delList(this.props.index)
    }

}
// 父组件做限制
Item.propTypes = {
    // item: PropTypes.number.isRequired,
    // item: PropTypes.arrayOf(PropTypes.number, PropTypes.string) // 数值或者字符
    item: PropTypes.oneOfType([PropTypes.number, PropTypes.string]) // 数值或者字符
}

// 默认值
Item.defaultProps = {
    item: 'test'
}

export default Item