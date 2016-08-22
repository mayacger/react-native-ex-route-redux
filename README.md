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
### root
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
