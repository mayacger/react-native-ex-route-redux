'use strict'

import React, {PropTypes, Component} from 'react'
import {NavigationExperimental, StyleSheet, View, Text} from 'react-native'
import CardStack from "./NavigationCardStack"
import * as  actions from './actions'

import TabController from "./tabController";

class Router extends Component {
  constructor(props) {
    super(props);

    this._scenes = this._gatherScenes(props.scenes);
    this._sceneMap = this._createSceneMap(this._scenes);
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.navState.isUpgrade) {
      this._scenes = this._gatherScenes(nextProps.scenes);
    }
  }

  render () {
    let scenes = [...this._scenes];
    let rootScene = this._scenes[0];
    return <TabController defaultComponent={this.props.defaultComponent} navState={this.props.navState} dispatch={this.props.dispatch} initialScene={this.props.initialScene} scenes={scenes.splice(1, scenes.length)} navType={rootScene.type} { ...rootScene } />;
  }

  _gatherScenes = (scenes) => {
    let stateScenes = [];

    let { children, ...otherProps } = scenes.props;

    let rootScene = {
      key: 'root',
      ...otherProps,
    };

    stateScenes.push(rootScene);

    // Make sure that we can handle only have one tab.
    if (!children.length) {
      children = [children];
    }

    let schemas = children.filter(s => s.props.type === 'SCHEMA');

    let childScenes = children.map(c => {
      let child = {
        key: c.key,
        ...c.props,
      };

      if (c.props.schema) {
        let schema = schemas.find(s => s.key === c.props.schema);
        let { type, ...schemaProps } = schema.props; // eslint-disable-line no-unused-vars
        child = Object.assign({}, child, { ...schemaProps });
      }

      return child;
    });
    return stateScenes.concat(childScenes);
  };
  _createSceneMap = (scenes) => {
    let map = {};
    scenes.forEach((s, i) => {
      map[s.key] = i;
    });

    return map;
  }
}


Router.propTypes = {
	navigationState: PropTypes.object,
	// backAction: PropTypes.func.isRequired
}

export default Router;
