import { combineReducers } from 'redux'
import { NavigationExperimental } from 'react-native';

const {
  StateUtils: NavigationStateUtils,
} = NavigationExperimental;


import { NAV_UPGRADE, TOGGLE_LEFT_DRAWER, TOGGLE_RIGHT_DRAWER, NAV_MODAL, MODAL_POP, NAV_INIT, NAV_PUSH, NAV_POP, NAV_POP_TO, NAV_POP_TO_KEY, NAV_JUMP_TO_KEY, NAV_JUMP_TO_INDEX, NAV_RESET, NAV_SWITCH } from './actions'
const initialNavState = {
  isUpgrade: false,
	index: 0,
	routes: [
		{ key: 'First', title: 'First' }
	]
}

function navigationState(state = initialNavState, action) {

	let findScene = (key, props) => {

    let scene = state.scenes.find(s => s.key === key);
    if (!scene) {
			let scenes = Object.assign({},state.scenes[0],props);
			return scenes;

      // throw new Error(`Scene not found for key: ${key}`);
    }
		let sceneData = Object.assign({},scene,props)
    return sceneData;
  };

	let setActiveKey = (state, activeKey) => Object.assign({}, state, { activeKey });

	let resetState = (action, state) => {
    let selectedContainerState = state.containerState[state.selectedContainer];
		if(action.index){
			selectedContainerState.routes[action.index] = Object.assign({},selectedContainerState.routes[action.index],action.props);
			selectedContainerState.index = selectedContainerState.index - action.index;
			selectedContainerState.routes.length  = selectedContainerState.index + 1;
		} else if(action.key) {
			let index = selectedContainerState.routes.findIndex(s => s.key === action.key);
			selectedContainerState.index = index + 1;
			selectedContainerState.routes[index] = Object.assign({},selectedContainerState.routes[index],action.props);
			selectedContainerState.routes.length  = selectedContainerState.index + 1;
		}
		return selectedContainerState;
	}


	switch (action.type) {

	case NAV_INIT: {

    return Object.assign({},state, action.state);
  }
	case NAV_MODAL: {

		let scene = findScene(action.key);

		let props = Object.assign({}, scene, { ...action.props });
		let modalState = NavigationStateUtils.push(state.modalState, { key: action.key, ...props });
		let navState = Object.assign({}, state, { modalState });
		return setActiveKey(Object.assign({}, navState, { modal: true }), action.key);
  }

	case MODAL_POP: {
		let modalState = {
			routes: [],
			index: 0,
			key: 'modal',
		};

		let navState = Object.assign({}, state, { modalState, modal: false });

		let activeKey = navState.containerState[navState.selectedContainer].routes[navState.containerState[navState.selectedContainer].index].key;
		return setActiveKey(navState, activeKey);
	}

	case NAV_PUSH:{

    let scene = findScene(action.state.key, action.state);

    let key = action.state.key;

    if (state.modal) {
      let exists = state.modalState.routes.filter(c => c.key === key || c.key.includes(`${key}_`));
      if (exists.length) {
        key = `${key}_${exists.length}`;
      }
      let newModalState = NavigationStateUtils.push(state.modalState, scene);
      let navState = Object.assign({}, state, { modalState: newModalState });

      return setActiveKey(Object.assign({}, navState), action.state.key);
    }

		let selectedContainerState = state.containerState[state.selectedContainer];
		if (selectedContainerState.routes[selectedContainerState.index].key === (action.state && action.state.key)) return state;
		let exists = selectedContainerState.routes.filter(c => c.key === key || c.key.includes(`${key}_`));
      if (exists.length) {
        key = `${key}_${exists.length}`;
      }
		let newselectedContainerState = NavigationStateUtils.push(selectedContainerState, scene);
    let newcontainerState = [...state.containerState];
    newcontainerState[state.selectedContainer] = newselectedContainerState;
    return setActiveKey(Object.assign({}, state, { containerState: newcontainerState }), action.state.key);
  }

	case NAV_POP:{
		let scene;
		if (action.state && action.state.key) {
			scene = findScene(action.state.key, action.state);
		}
		let selectedContainerState = state.containerState[state.selectedContainer];

		let newselectedContainerState = NavigationStateUtils.pop(selectedContainerState, scene);
    let newcontainerState = [...state.containerState];
    newcontainerState[state.selectedContainer] = newselectedContainerState;
    let activeKey = newselectedContainerState.routes[newselectedContainerState.index].key;
    return setActiveKey(Object.assign({}, state, { containerState: newcontainerState }), activeKey);

	}

	case NAV_POP_TO: {
    let scene;
		if (action.state && action.state.key) {
			scene = findScene(action.state.key, action.state);
		}
    let selectedContainerState = resetState(action, state);
    let newselectedContainerState = NavigationStateUtils.pop(selectedContainerState, scene);
    let newcontainerState = [...state.containerState];
    newcontainerState[state.selectedContainer] = newselectedContainerState;
    let activeKey = newselectedContainerState.routes[newselectedContainerState.index].key;
    return setActiveKey(Object.assign({}, state, { containerState: newcontainerState }), activeKey);
  }

	case NAV_POP_TO_KEY: {
    let scene;
		if (action.state && action.state.key) {
			scene = findScene(action.state.key, action.state);
		}

    let selectedContainerState = resetState(action, state);
    let newselectedContainerState = NavigationStateUtils.pop(selectedContainerState, scene);
    let newcontainerState = [...state.containerState];
    newcontainerState[state.selectedContainer] = newselectedContainerState;
    let activeKey = newselectedContainerState.routes[newselectedContainerState.index].key;
    return setActiveKey(Object.assign({}, state, { containerState: newcontainerState }), activeKey);
  }

	case NAV_JUMP_TO_KEY:{
    const childIndex = state.routes.findIndex(c => c.key === action.key);
    let currentState = Object.assign({}, state, {
      selectedContainer: childIndex,
      leftDrawerVisible: false,
      rightDrawerVisible: false,
    });
    return setActiveKey(NavigationStateUtils.jumpToIndex(currentState, childIndex), action.key);
  }

	case NAV_JUMP_TO_INDEX:{
    let currentState = Object.assign({}, state, {
      selectedContainer: action.index,
      leftDrawerVisible: false,
      rightDrawerVisible: false,
    });
    return setActiveKey(NavigationStateUtils.jumpToIndex(currentState, childIndex), action.key);
  }

	case NAV_SWITCH: {
    const childIndex = state.routes.findIndex(c => c.key === action.key);
    let currentState = Object.assign({}, state, {
      selectedContainer: childIndex,
      leftDrawerVisible: false,
      rightDrawerVisible: false,
    });
    return setActiveKey(NavigationStateUtils.jumpToIndex(currentState, childIndex), action.key);
  }


	case NAV_RESET:

		let resrState = state.containerState;
		resrState[state.selectedContainer].routes = state.routes;

		let toResrState = resrState[action.index].routes;
		return {
			...state,
			index: action.index,
			routes: toResrState
		}
	case TOGGLE_LEFT_DRAWER: {
		let newState = Object.assign({}, state, {
			leftDrawerVisible: !state.leftDrawerVisible,
			rightDrawerVisible: false,
		});

		return newState;
	}
	case TOGGLE_RIGHT_DRAWER: {
		let newState = Object.assign({}, state, {
			leftDrawerVisible: false,
			rightDrawerVisible: !state.rightDrawerVisible,
		});

		return newState;
	}
	case NAV_UPGRADE: {
		let newState = Object.assign({}, state, {
			isUpgrade: true,
		});

		return newState;
	}

	default:
		return state
	}
}

// const appReducers = combineReducers({
// 	navigationState
// })

export default navigationState
