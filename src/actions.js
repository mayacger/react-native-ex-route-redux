// *** Action Types ***
export const NAVIGATE = 'NAVIGATE'
export const NAV_INIT = 'NAV_INIT'
export const NAV_PUSH = 'NAV_PUSH'
export const NAV_POP = 'NAV_POP'
export const NAV_JUMP_TO_KEY = 'NAV_JUMP_TO_KEY'
export const NAV_JUMP_TO_INDEX = 'NAV_JUMP_TO_INDEX'
export const NAV_RESET = 'NAV_RESET'
export const NAV_SWITCH = 'NAV_SWITCH'
export const NAV_MODAL = 'NAV_MODAL'
export const MODAL_POP = 'MODAL_POP'
export const NAV_POP_TO = 'NAV_POP_TO'
export const NAV_POP_TO_KEY = 'NAV_POP_TO_KEY'
export const TOGGLE_LEFT_DRAWER = 'TOGGLE_LEFT_DRAWER'
export const TOGGLE_RIGHT_DRAWER = 'TOGGLE_RIGHT_DRAWER'


// *** Action Creators ***
// The following action creators were derived from NavigationStackReducer

export function navigateInit(state) {
	return {
		type: NAV_INIT,
		state,
	}
}

export function navigateSwitch(index, key) {
	return {
		type: NAV_SWITCH,
		index,
		key,
	}
}


export function modal(key, props) {
	return {
		type: NAV_MODAL,
		key,
		props,
	}
}
export function modalPop(props) {
	return {
		type: MODAL_POP,
		...props,
	}
}
// export function navigatePush(key, props) {
// 	// state = typeof state === 'string' ? { key: state, title: state } : state
// 	let state = Object.assign({},{key},{title:props ? props.title : key},props)
// 	return {
// 		type: NAV_PUSH,
// 		state,
// 	}
// }
export function push(key, props) {
	// state = typeof state === 'string' ? { key: state, title: state } : state
	let state = Object.assign({},{key},props)
	return {
		type: NAV_PUSH,
		state,
	}
}

// export function navigatePop() {
// 	return {
// 		type: NAV_POP
// 	}
// }

export function pop(props) {
	return {
		type: NAV_POP,
		props,
	}
}

export function popTo(index, props) {
	return {
		type: NAV_POP_TO,
		index,
		props,
	}
}

export function popToKey(key, props) {
	return {
		type: NAV_POP_TO_KEY,
		key,
		props,
	}
}

export function navigateJumpToKey(key) {
	return {
		type: NAV_JUMP_TO_KEY,
		key
	}
}

export function navigateJumpToIndex(index) {
	return {
		type: NAV_JUMP_TO_INDEX,
		index
	}
}
export function toggleLeftDrawer(props) {
	return {
		type: TOGGLE_LEFT_DRAWER,
		props
	}
}
export function toggleRightDrawer(props) {
	return {
		type: TOGGLE_RIGHT_DRAWER,
		props
	}
}

export function navigateReset(routes, index) {
	return {
		type: NAV_RESET,
		index,
		routes
	}
}
