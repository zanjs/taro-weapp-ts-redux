import Taro, { Component } from '@tarojs/taro'
import cEnv from '../../const/env'

const LIFE_CYCLE_MAP = ['willMount', 'didMount', 'didShow']

function _autoLogin() {
  console.log('$_autoLogin()')
  return 'data'
}

/**
 *
 * 登录鉴权
 * @param {string} [lifecycle] 需要等待的鉴权完再执行的生命周期 willMount didMount didShow
 * @returns 包装后的Component
 *
 */
function withLogin(lifecycle: string = 'willMount') {
  console.log('withLogin')
  // 异常规避提醒
  if (LIFE_CYCLE_MAP.indexOf(lifecycle) < 0) {
    console.warn(
      `传入的生命周期不存在, 鉴权判断异常 ===========> $_{lifecycle}`
    );
    return Component => Component;
  }
    
  return function withLoginComponent(Component) {
    // 避免H5兼容异常
    if (cEnv.isH5()) {
      return Component;
    }
      
    // 这里还可以通过redux来获取本地用户信息，在用户一次登录之后，其他需要鉴权的页面可以用判断跳过流程
    // @connect(({ user }) => ({
    //   userInfo: user.userInfo,
    // }))
    class WithLogin extends Component {
      constructor(props) {
        super(props);
      }

      async componentWillMount() {
        if (super.componentWillMount) {
          if (lifecycle === LIFE_CYCLE_MAP[0]) {
            const res = await _autoLogin();
            if (!res) return;
          }

          super.componentWillMount();
        }
      }

      async componentDidMount() {
        if (super.componentDidMount) {
          if (lifecycle === LIFE_CYCLE_MAP[1]) {
            const res = await _autoLogin();
            if (!res) return;
          }

          super.componentDidMount();
        }
      }

      async componentDidShow() {
        if (super.componentDidShow) {
          if (lifecycle === LIFE_CYCLE_MAP[2]) {
            const res = await _autoLogin();
            if (!res) return;
          }

          super.componentDidShow();
        }
      }
    }
  }
}

export default withLogin;
