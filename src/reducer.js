import { NavigationExperimental } from 'react-native';

import * as actions from './constants';

const {
  StateUtils: NavigationStateUtils,
} = NavigationExperimental;
const initialNavState = {
	init: false
}
const createReducer = (currentState = initialNavState, action = {}) => {
  // Make sure that we don't have two modals on top of each other.
  if (action.type === actions.MODAL) {
    if (action.key === currentState.activeKey) {
      return currentState;
    }
  }
  let findScene = (key) => {
    let scene = currentState.scenes.find(s => s.key === key);
    if (!scene) {
      throw new Error(`Scene not found for key: ${key}`);
    }

    return scene;
  };

  let setActiveKey = (state, activeKey) => Object.assign({}, state, { activeKey });

  switch (action.type) {
    case actions.NAVINIT: {
      return Object.assign({}, action.state, {init:true});
    }
    case actions.SWITCH: {
      const childIndex = currentState.routes.findIndex(c => c.key === action.key);
      let state = Object.assign({}, currentState, {
        selectedContainer: childIndex,
        leftDrawerVisible: false,
        rightDrawerVisible: false,
      });
      return setActiveKey(NavigationStateUtils.jumpToIndex(state, childIndex), action.key);
    }
    case actions.PUSH: {
      let scene = findScene(action.key);
      let props = Object.assign({}, scene, { ...action.props });
      let key = action.key;

      if (currentState.modal) {
        let exists = currentState.modalState.routes.filter(c => c.key === key || c.key.includes(`${key}_`));
        if (exists.length) {
          key = `${key}_${exists.length}`;
        }
        let newModalState = NavigationStateUtils.push(currentState.modalState, { key, props });
        let navState = Object.assign({}, currentState, { modalState: newModalState });

        return setActiveKey(Object.assign({}, navState), action.key);
      }

      let selectedContainerState = currentState.containerState[currentState.selectedContainer];
      let exists = selectedContainerState.routes.filter(c => c.key === key || c.key.includes(`${key}_`));
      if (exists.length) {
        key = `${key}_${exists.length}`;
      }
      let newselectedContainerState = NavigationStateUtils.push(selectedContainerState, { key, props });
      let newcontainerState = [...currentState.containerState];
      newcontainerState[currentState.selectedContainer] = newselectedContainerState;

      return setActiveKey(Object.assign({}, currentState, { containerState: newcontainerState }), action.key);
    }
    case actions.MODAL: {
      let scene = findScene(action.key);
      let props = Object.assign({}, scene, { ...action.props });
      let modalState = NavigationStateUtils.push(currentState.modalState, { key: action.key, props });
      let navState = Object.assign({}, currentState, { modalState });
      return setActiveKey(Object.assign({}, navState, { modal: true }), action.key);
    }
    case actions.MODAL_POP: {
      let modalState = {
        routes: [],
        index: 0,
        key: 'modal',
      };

      let navState = Object.assign({}, currentState, { modalState, modal: false });

      let activeKey = navState.containerState[navState.selectedContainer].routes[navState.containerState[navState.selectedContainer].index].key;

      return setActiveKey(navState, activeKey);
    }
    case actions.BACK:
    case actions.BACK_ACTION:
    case actions.POP: {
      if (!currentState.modal) {
        let selectedContainerState = currentState.containerState[currentState.selectedContainer];
        let newselectedContainerState = NavigationStateUtils.pop(selectedContainerState, { key: action.key, props: action.props });
        let newcontainerState = [...currentState.containerState];
        newcontainerState[currentState.selectedContainer] = newselectedContainerState;
        let activeKey = newselectedContainerState.routes[newselectedContainerState.index].key;
        return setActiveKey(Object.assign({}, currentState, { containerState: newcontainerState }), activeKey);
      }

      let modalState = NavigationStateUtils.pop(currentState.modalState);
      let navState = Object.assign({}, currentState, { modalState });
      let selectedContainer = navState.containerState[navState.selectedContainer];
      let activeKey = selectedContainer.routes[selectedContainer.index].key;

      return setActiveKey(Object.assign({}, navState, { modal: navState.modalState.routes.length > 0 }), activeKey);
    }
    case actions.POP_TO: {
      if (!currentState.modal) {
        let selectedContainerState = currentState.containerState[currentState.selectedContainer];
        let index = selectedContainerState.routes.findIndex(c => c.key === action.key);
        if (index === -1) {
          throw new Error(`Could not find key for ${action.key} for navigate action popTo`);
        }
        let routes = selectedContainerState.routes.slice(0, index + 1);
        let newselectedContainerState = Object.assign({}, selectedContainerState, { routes, index });
        let newcontainerState = [...currentState.containerState];
        newcontainerState[currentState.selectedContainer] = newselectedContainerState;
        let activeKey = newselectedContainerState.routes[newselectedContainerState.index].key;
        return setActiveKey(Object.assign({}, currentState, { containerState: newcontainerState }), activeKey);
      }

      console.warn('You called popTo within a modal. This is not supported.');
      return currentState;
    }
    case actions.TOGGLE_LEFT_DRAWER: {
      let newState = Object.assign({}, currentState, {
        leftDrawerVisible: !currentState.leftDrawerVisible,
        rightDrawerVisible: false,
      });

      return newState;
    }
    case actions.TOGGLE_RIGHT_DRAWER: {
      let newState = Object.assign({}, currentState, {
        leftDrawerVisible: false,
        rightDrawerVisible: !currentState.rightDrawerVisible,
      });

      return newState;
    }
    default:
      return currentState;
  }
};

export default createReducer;
