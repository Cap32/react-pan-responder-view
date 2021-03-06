import passiveEvents from 'detect-passive-events';

export function isFunction(target) {
	return typeof target === 'function';
}

export function isObject(target) {
	return typeof target === 'object';
}

export function noop() {}

export function includes(arr, item) {
	return ~arr.indexOf(item);
}

export const supportPassive = passiveEvents.hasSupport;

export function createEventOptions(
	passive = false, // maybe, we should use `passive = true` sometimes
) {
	/* istanbul ignore else */
	if (!supportPassive) return true;
	/* istanbul ignore next */
	return { capture: true, passive };
}

export function getEventNodes(event) {
	if (event.path) return event.path;

	const pathArr = [];
	let el = event.target;
	while (el) {
		pathArr.push(el);
		el = el.parentNode;
	}
	return pathArr;
}
