'use strict'

import React, {PropTypes,  Component} from 'react'
import {NavigationExperimental, StyleSheet, View, Text} from 'react-native'

import * as  actions from './actions'

const {
	CardStack: NavigationCardStack,
	Card: NavigationCard,
	Header: NavigationHeader
} = NavigationExperimental

// Known bug in v0.30: https://github.com/facebook/react-native/issues/7422#issuecomment-236280199
// console.ignoredYellowBox = ['Warning: Failed prop type: Required prop `scene` was not specified in `NavigationHeader`']


class CardStack extends Component {

  constructor (props) {
    super(props);
  }
	render() {

		let { navigationState, backAction } = this.props;
		if (!backAction){
			backAction = () => {
      this.props.dispatch(actions.pop())
			}
    }
		return (

			// Redux is handling the reduction of our state for us. We grab the navigationState
			// we have in our Redux store and pass it directly to the <NavigationCardStack />.
      <NavigationCardStack
				navigationState={navigationState}
				onNavigateBack={backAction}
				style={{flex:1}}
				direction={navigationState.routes[navigationState.index].key === 'Modal' ?
					'vertical' : 'horizontal'
				}
				renderHeader={this._renderHeader}
				renderScene={this.__renderScene}
			/>
		)
	}



  _renderHeader = (props) => {

    let { backAction, navigate, dispatch} = this.props
		if (!backAction){
			backAction = () => {
	      this.props.dispatch(actions.pop())
			}
    }
    let scene = props.scene.route;

    if (scene && scene.hideNavBar) {
      return null;
    }

    let renderTitle = (props) => {
      const title = props.scene.route.title || scene.title
      if (scene.renderTitle) {
        return scene.renderTitle(scene, actions, this.props.dispatch);
      }
      return <NavigationHeader.Title textStyle={scene.titleStyle}>{title}</NavigationHeader.Title>
    }

		let renderLeftButton = (navProps) => {
	    if (navProps.scene.index !== 0) {
	      return scene.renderBackButton && scene.renderBackButton(scene, actions, dispatch);
	    }

	    return scene.renderLeftButton && scene.renderLeftButton(scene, actions, dispatch);
	  };

	  let renderRightButton = () => scene.renderRightButton(scene, actions, dispatch);

		if (props.scene.index !== props.scenes.length - 1) {
	    return (
	      <NavigationHeader
	        { ...props }
	        style={[scene.defaultheaderStyle,scene.headerStyle]}
	        renderTitleComponent={renderTitle}
	        renderLeftComponent={() => true}
	        renderRightComponent={() => true}
	      />
	    );
	  }

    return (
      <NavigationHeader
        {...props}
				style={[scene.defaultheaderStyle, scene.headerStyle]}
        onNavigateBack={backAction}
        renderTitleComponent={renderTitle}
				renderLeftComponent={(scene.renderLeftButton || scene.renderBackButton) && renderLeftButton}
	      renderRightComponent={scene.renderRightButton && renderRightButton}
      />
    )
  };

  __renderScene = ({scene}) => {
    const { route } = scene
    if (route.component) {
      let { component, ...otherProps } = route;
      let SceneComponent = component;
      return (
        <SceneComponent {...this.props} {...otherProps} navigate={actions}/>
      );
    }else {
      // let { component, ...otherProps } = this.props.defaultComponent;
      // let SceneComponent = component
      return <View />
    }

  }

}

CardStack.propTypes = {
	navigationState: PropTypes.object,
	// backAction: PropTypes.func.isRequired
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
})

export default CardStack;
