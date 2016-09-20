# react-native-ex-route-redux
react native NavigationExperimental redux

#react-native >= 0.32


uses NavigationExperimental && redux

#thanks
router by https://github.com/jarredwitt/react-native-router-ex
    当我发现这个组件后，发现非常合适我目前的项目，可是因为原作者近期没有更新，而rn 0.31 NavigationExperimental 改变了很多参数，我在原文基础上
    更新到0.33。非常感谢原作者。
    遗留：动画部分还没有完成
&&

redux by https://github.com/alinz/example-react-native-redux/tree/master/Counter

整合redux Demo到页面中，可参考学习redux用法。


##已知问题
tab切换时有过场动画，多个场景快速切换。

##example
https://github.com/mayacger/react-native-ex-route-redux-example


![demo gif](https://github.com/mayacger/react-native-ex-route-redux/blob/master/demo.gif)

##Sample Configuration
```
npm install --save react-native-ex-route-redux
```
### Provider
```
import React,{ Component } from 'react';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

//in your reducers
import * as reducers from '../reducers';
import Root from './root';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const reducer = combineReducers(reducers);
const store = createStoreWithMiddleware(reducer);

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Root />
      </Provider>
    );
  }
}

```

### root

```
import icon from '../bullsEye@2x.png';
const tabIcon = (tab, index, key, selectedIndex) => {
  let color = index === selectedIndex ? 'rgba(0, 0, 255, 0.6)' : '#979797';

  return (
    <View index={index} key={key} style={{ flex: 1, alignItems: 'center' }}>

      <Image source={icon} />
      <Text style={{ color }}>{tab.title}</Text>
    </View>
  );
};

const renderBackButton = (props, navigate, dispatch) => {
  let handleNavigation = () => dispatch(navigate.pop());

  return (
    <TouchableOpacity style={styles.buttonContainer} onPress={handleNavigation}>
      <Text style={styles.button}>Back</Text>
    </TouchableOpacity>
  );
};

const renderLeftButton = (props, navigate, dispatch) => {
  let handleNavigation = () => dispatch(navigate.modal('login', { title: 'Modal Login', data: 'Some data from the home tab',renderRightButton:modalPopButton }));

  return (
    <TouchableOpacity style={styles.buttonContainer} onPress={handleNavigation}>
      <Text style={styles.button}>Login</Text>
    </TouchableOpacity>
  );
};

const renderRightButton = () => {
  let handleNavigation = () => Alert.alert('Alert', 'You pressed the right button', [{ text: 'OK' }]);

  return (
    <TouchableOpacity style={styles.buttonContainer} onPress={handleNavigation}>
      <Text style={styles.button}>Alert</Text>
    </TouchableOpacity>
  );
};
const modalPopButton = (props, navigate, dispatch) => {
  let handleNavigation = () => dispatch(navigate.modalPop());

  return (
    <TouchableOpacity style={styles.buttonContainer} onPress={handleNavigation}>
      <Text style={styles.button}>关闭</Text>
    </TouchableOpacity>
  );
};


const renderTitle = (props) => (
  <View style={styles.customTitleContainer}>
    <Text style={styles.customTitle}>
      {props.title}
    </Text>
  </View>
);

//Menu button
const renderLeftMenuButton = (props, navigate, dispatch) => {
  let handleNavigation = () => dispatch(navigate.toggleLeftDrawer());

  return (
    <TouchableOpacity style={styles.buttonContainer} onPress={handleNavigation}>
      <Text style={styles.button}>Menu</Text>
    </TouchableOpacity>
  );
};

const renderRightMenuButton = (props, navigate, dispatch) => {
  let handleNavigation = () => dispatch(navigate.toggleRightDrawer());

  return (
    <TouchableOpacity style={styles.buttonContainer} onPress={handleNavigation}>
      <Text style={styles.button}>Menu</Text>
    </TouchableOpacity>
  );
};

class Root extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { state, actions } = this.props;



    //defaultheaderStyle 默认navBar样式
    //headerStyle 单独定义页面navBar样式

    //hideNavBar 隐藏特定页面头部

    let headerStyle = {backgroundColor:"#F60"};

    //tabBarStyle 单独定义页面tabsBar样式
    //可通过样式隐藏tabs
    let hidetabBarStyle = {height:0,overflow:'hidden',borderTopWidth:0};

    //tabs 类型
    const scenes = (
        <RootScene type="tabs">
          <Schema key="default" defaultheaderStyle={headerStyle} titleStyle={{ fontSize: 17, fontFamily: 'avenir', color: '#333', fontWeight: '400' }} icon={tabIcon} renderBackButton={renderBackButton} />
          <TabScene key="homeTab"  schema="default" title="Home" iconName={<Text>HomeIcon</Text>} component={Page} renderLeftButton={renderLeftButton} renderRightButton={renderRightButton} renderTitle={renderTitle}  />
          <TabScene key="profileTab" schema="default" title="Profile" iconName="listIcon" component={Counter}  />
          <TabScene key="settingsTab" schema="default" title="Settings" iconName="meIcon" component={Profile} />
          <Scene key="login" schema="default" component={Counter} title="Login" hideNavBar tabBarStyle={hidetabBarStyle} />
          <Scene key="page" schema="default" component={Page}  />
          <Scene key="nested" schema="default" component={Nested}  headerStyle={{backgroundColor:"#green"}} />
        </RootScene>
      );

    //menu 类型
    const scenesMenu = (
      <RootScene type="drawer" leftMenuComponent={DrawerMenu} rightMenuComponent={DrawerMenu} renderBackButton={renderBackButton}>
        <Schema key="drawer" renderLeftButton={renderLeftMenuButton} renderRightButton={renderRightMenuButton} />
        <Schema key="default" titleStyle={{ fontSize: 17, fontFamily: 'avenir', color: '#4A4A4A', fontWeight: '400' }} renderBackButton={renderBackButton} />
        <DrawerScene key="home" schema="drawer" position="left" title="Drawer One" component={Counter} />
        <DrawerScene key="profile" schema="drawer" position="left" title="Drawer Two" component={Counter} />
        <DrawerScene key="settings" schema="drawer" position="right" title="Drawer Three" component={Counter} />
        <Scene key="login" schema="default" component={Counter} title="Login" />
        <Scene key="page" schema="default" component={Counter} />
        <Scene key="nested" schema="default" component={Counter} />
      </RootScene>
    )

    return (
        <RouterEx {...this.props}  scenes={scenes} />
    )
  }
}
```


### in your reducers import { navState } 在reducers.js中把组件内部的reducer 导入你的项目
```
import counter from './counter';
import { navState } from 'react-native-ex-route-redux';

export {
  counter,
  navState
};

```
### in redux page 在页面中重新connect 此页面需要的state和 action
```
...
export default connect(state => ({
    state: state.counter, //connect again
  }),
  (dispatch) => ({
    actions: bindActionCreators(counterActions, dispatch)
  })
)(Counter);
```
