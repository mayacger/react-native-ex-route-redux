import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
  Animated,
  NavigationExperimental
} from 'react-native';

const {
	Transitioner: NavigationTransitioner,
	Card: NavigationCard,
	Header: NavigationHeader
} = NavigationExperimental

import navBar from './navBar';
import navigationHelper from './navigationHelper';


class Renderer extends Component {
  static propTypes = {
    navState: PropTypes.object,
    dispatch: PropTypes.func,
  };
  constructor(props) {
    super(props)
  }


  shouldComponentUpdate(nextProps) {
    return (nextProps.navState.key && nextProps.navState.index) !== (this.props.navState.key && this.props.navState.index);
  }

  render () {

    let duration = 300;
    let animation = (pos, navState) => {
      Animated.timing(pos, { toValue: navState.index, duration }).start();
    };

    return (

      <NavigationTransitioner
        {...this.props}
				navigationState={this.props.navState}
				style={{ flex: 1 }}
				render={this._render.bind(this)}
			/>
    )
  }

  _render (props) {
    let backAction = () => {
      this.props.dispatch(navigationHelper().pop())
    }
    let hasHead = {
      paddingTop:64
    }
    if(props.scene.route.props.hideNavBar) {
      hasHead.paddingTop = 0;
    }
    if(props.scene.route.props.hasHead) {
      hasHead= props.scene.route.props.hasHead;
    }
    return (
      <View style={{ flex: 1 }}>

        <NavigationCard
          style={hasHead}
          {...this.props}
          panHandlers={null}
          {...props}
          onNavigateBack={backAction}
          key={`card_${props.scene.key}`}
          renderScene={(props) => {

            let { component, ...otherProps } = props.scene.route.props;
            let SceneComponent = component;
            return (
              <SceneComponent {...this.props} {...otherProps} navigate={navigationHelper()} />
            );
          }}
        />
      {navBar(navigationHelper(), this.props.dispatch, props, backAction)}
      </View>
    )
  }

}


export default Renderer;
