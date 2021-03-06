import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import { add, minus, asyncAdd } from '../../actions/counter'
import { Pages } from '../../config/pages'
import withLogin from '../../components/wxEmitter/withLogin'

import './index.scss'
import { PageOwnProps, PageState, IProps } from '../../props/index';

interface Index {
  props: IProps;
}

@withLogin()
@connect(({ counter }) => ({
  counter
}), (dispatch) => ({
  add () {
    dispatch(add())
  },
  dec () {
    dispatch(minus())
  },
  asyncAdd () {
    dispatch(asyncAdd())
  }
}))
class Index extends Component {

    /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
    config: Config = {
    navigationBarTitleText: '首页'
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentDidShow () {
    Taro.showLoading({
      title: '加载中...'
    });
   }

  componentDidHide () { }

  onGotUserInfo (e) {
    console.log(e)
    Taro.login().then((r) => {
      console.log(r)

      Taro.getUserInfo().then((d) => {
        console.log(d)
      })
    })
  }

  onGoList () {
    console.log('s')
    Taro.navigateTo({
      url: '/' + Pages.list
    })
  }

  render () {
    return (
      <View className='index'>
        <Button className='add_btn' onClick={this.props.add}>+</Button>
        <Button className='dec_btn' onClick={this.props.dec}>-</Button>
        <Button className='dec_btn' onClick={this.props.asyncAdd}>async</Button>
        <View><Text>{this.props.counter.num}</Text></View>
        <View onClick={ this.onGoList }><Text>World</Text></View>
        <Button id='login-btn' openType="getUserInfo" 
        lang="zh_CN" 
        onGetUserInfo={this.onGotUserInfo} 
        type='primary' >微信用户快速登录</Button>
      </View>
    )
  }
}

// #region 导出注意
//
// 经过上面的声明后需要将导出的 Taro.Component 子类修改为子类本身的 props 属性
// 这样在使用这个子类时 Ts 才不会提示缺少 JSX 类型参数错误
//
// #endregion

export default Index as ComponentClass<PageOwnProps, PageState>
