# react-native-ex-route-redux
react native NavigationExperimental redux


uses NavigationExperimental && redux

#thanks
router by https://github.com/jarredwitt/react-native-router-ex

&&

redux by https://github.com/alinz/example-react-native-redux/tree/master/Counter

##example
https://github.com/mayacger/react-native-ex-route-redux-example


##Sample Configuration
```
npm install --save https://github.com/mayacger/react-native-ex-route-redux.git
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

class Root extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { state, actions } = this.props;

    let hideHeader = {height:0,overflow:'hidden'};

    const scenes = (
        <RootScene type="tabs">
          <Schema key="default" titleStyle={{ fontSize: 17, fontFamily: 'avenir', color: '#333', fontWeight: '400' }} icon={tabIcon}  />
          <TabScene key="home"  schema="default" title="Home" iconName={<Text>HomeIcon</Text>} component={Page} renderLeftButton={renderLeftButton} renderRightButton={renderRightButton} renderTitle={renderTitle}  />
          <TabScene key="list" schema="default" title="list" iconName="listIcon" component={Counter}  />
          <TabScene key="me" schema="default" title="me" iconName="meIcon" component={Counter} />
          <Scene key="login" schema="default" component={Counter} title="Login" tabBarStyle={{backgroundColor:"#eee",height:0,overflow:'hidden',borderTopWidth:0}} />
          <Scene key="page" schema="default" component={Counter} />
          <Scene key="nested" schema="default" component={Counter} />
        </RootScene>
      );

    return (
        <RouterEx {...this.props}  scenes={scenes} />
    )
  }
}
```


### in your reducers import { navState }
```
import counter from './counter';
import { navState } from 'react-native-ex-route-redux';

export {
  counter,
  navState
};

```
### in redux page
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
