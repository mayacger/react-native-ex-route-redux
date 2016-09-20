import { combineReducers } from 'redux'
import * as NavigationStateUtils from 'NavigationStateUtils'

import { TOGGLE_LEFT_DRAWER, TOGGLE_RIGHT_DRAWER, NAV_MODAL, MODAL_POP, NAV_INIT, NAV_PUSH, NAV_POP, NAV_POP_TO, NAV_POP_TO_KEY, NAV_JUMP_TO_KEY, NAV_JUMP_TO_INDEX, NAV_RESET, NAV_SWITCH } from './actions'
const initialNavState = {
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
		if(action.index){
			state.routes[action.index] = Object.assign({},state.routes[action.index],action.props);
			state.index = state.index - action.index;
			state.routes.length  = state.index + 1;
		} else if(action.key) {
			let index = state.routes.findIndex(s => s.key === action.key);
			state.index = index + 1;
			state.routes[index] = Object.assign({},state.routes[index],action.props);
			state.routes.length  = state.index + 1;
		}
		return state;
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


    return Object.assign({},state, action.state);
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

	case NAV_PUSH:

		if (state.routes[state.index].key === (action.state && action.state.key)) return state
		let scene = findScene(action.state.key, action.state);

		return NavigationStateUtils.push(state, scene);

	case NAV_POP:
		if (state.index === 0 || state.routes.length === 1) return state
		return NavigationStateUtils.pop(state)

	case NAV_POP_TO:
		if (state.index === 0 || state.routes.length === 1) return state

		state = resetState(action, state)
		return NavigationStateUtils.pop(state)

	case NAV_POP_TO_KEY:
		if (state.index === 0 || state.routes.length === 1) return state
		state = resetState(action, state)
		return NavigationStateUtils.pop(state)

	case NAV_JUMP_TO_KEY:
		return NavigationStateUtils.jumpTo(state, action.key)

	case NAV_JUMP_TO_INDEX:
		return NavigationStateUtils.jumpToIndex(state, action.index)

	case NAV_SWITCH:

		let containerState = state.containerState;
		containerState[state.selectedContainer].routes = state.routes;

		let toRoutes = containerState[action.index].routes;

		let toIndex = toRoutes.length -1;

		let currentState = {
			...state,
			containerState,
			activeKey:action.key,
			selectedContainer: action.index,
			index: toIndex,
			routes: toRoutes
		}


		return NavigationStateUtils.jumpToIndex(currentState, toIndex)

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

	default:
		return state
	}
}

// const appReducers = combineReducers({
// 	navigationState
// })

export default navigationState
