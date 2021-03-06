import React, { Component, PropTypes } from 'react';
import { Text, View } from 'react-native';
import Tabs from './tabBar/tabBar';

import { NAV_INIT, NAV_SWITCH, TOGGLE_LEFT_DRAWER, TOGGLE_RIGHT_DRAWER } from './actions';
import * as  actions from './actions'
import Modal from './modal';
import CardStack from "./NavigationCardStack";
import Card from "./NavigationCard";
import DrawerContainer from './drawerContainer';


class TabController extends Component {
  static propTypes = {
    index: PropTypes.number,
    initialScene: PropTypes.string,
    scenes: PropTypes.array.isRequired,
    navState: PropTypes.object,
    dispatch: PropTypes.func,
  };

  static defaultProps = {
    index: 0,
  };

  constructor(props) {
    super(props);
    this._init(props);
  }

  _init (props) {
    this._tabs = props.scenes.filter(s => s.type === 'TAB').map(t => {
      let { key, ...otherProps } = t;
      return {
        key,
        ...otherProps
      };
    });


    let index = 0;
    let selectedContainer = 0;
    let routes = this._tabs;
    let initialScene = props.initialScene || this._tabs[0].key;
    let initialSceneIsModal = false;
    let modalStateRoutes = [];
    if (props.initialScene) {
      let scene = props.scenes.find(s => s.key === props.initialScene);
      modalStateRoutes.push(scene);
      if (scene.type.toUpperCase() === 'TAB') {
        selectedContainer = this._tabs.findIndex(t => t.key === scene.key);
      } else if (scene.type.toUpperCase() === 'SCENE') {
        let { key, schema, ...otherProps } = scene; // eslint-disable-line no-unused-vars
        routes = [...routes];
        routes.push({
          key,
          ...otherProps,
        });

        index = routes.length - 1;
        initialSceneIsModal = true;
      }
    }

    props.dispatch({
      type: NAV_INIT,
      state: {
        activeKey: initialScene,
        routes,
        index,
        isUpgrade: false,
        key: 'tabController',
        modal: initialSceneIsModal,
        modalState: {
          routes: modalStateRoutes,
          index: 0,
          key: 'modal',
        },
        scenes: props.scenes,
        selectedContainer,
        leftDrawerVisible: false,
        rightDrawerVisible: false,
        containerState: this._tabs.map(t => {
          let { key, ...otherProps } = t;
          return {
            index: 0,
            routes: [{
              key,
              ...otherProps,
            }],
            key,
          };
        }),
      },
    });
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.navState.isUpgrade) {
      this._init(nextProps);
    }
  }

  render() {
    if (!this.props.navState.containerState) {
      return <View />;
    }
    return this._renderNavigation(this.props.navState);
  }

  _renderNavigation = (navigationState) => {
    if (!navigationState) { return null; }
    let _tabSelect = (index, key) => {
      if (navigationState.activeKey === key) {
        return ;
      }
      return this.props.dispatch({ type: NAV_SWITCH, index, key });
    }

    let currentChild = navigationState.routes[navigationState.index];
    let scene;

    let navType = this.props.navType.toUpperCase();
    let NavCard = CardStack;
    if (navType === "CARD") {
      NavCard = Card;
    }

    if (navigationState.modal) {
      currentChild = navigationState.modalState.routes[0];
      scene = (
        <View style={{ flex: 1 }}>
            <NavCard  navigationState={navigationState.modalState} dispatch={this.props.dispatch} />
        </View>
      );
    }
    let  tabRoutes= navigationState.containerState[navigationState.selectedContainer].routes;
    let  currentTabRoute = tabRoutes[tabRoutes.length - 1];
    return (
        <View style={{ flex: 1 }}>
        {this._tabs.map((tab, index) => {
          let style = { flex: 1 };
          if (index !== navigationState.selectedContainer) {
            style = { height: 0, overflow: 'hidden' };
          }
          return (
            <View key={index} style={style}>
              <NavCard dispatch={this.props.dispatch} navigationState={this.props.navState.containerState[index]}/>
          </View>
          );
        })}
        <Tabs tabBarStyle={currentTabRoute.tabBarStyle} onSelectTab={_tabSelect}>
          {this._tabs.map((tab, index) => {
            let tabRenderer = tab.icon || this._renderDefaultTab;
            return tabRenderer(tab, index, tab.key, navigationState.selectedContainer);
          })}
        </Tabs>
        {this.props.leftMenuComponent && <DrawerContainer show={navigationState.leftDrawerVisible} navigate={actions} dispatch={this.props.dispatch} position="left" menuComponent={this.props.leftMenuComponent} />}
        {this.props.rightMenuComponent && <DrawerContainer show={navigationState.rightDrawerVisible} navigate={actions} dispatch={this.props.dispatch} position="right" menuComponent={this.props.rightMenuComponent} />}
        <Modal show={navigationState.modal} navState={navigationState.modalState} direction={currentChild.direction} scene={currentChild}>
          {scene}
        </Modal>
      </View>
    )
  };
  _renderDefaultTab = (tab, index, key, selectedIndex) => {
    let color = selectedIndex === index ? 'red' : 'black';
    return <Text style={{ color }} index={index} key={key}>{tab.title}</Text>;
  }
}

export default TabController;
