/* eslint-disable max-len */

import './styles.scss';
import React, { Component } from 'react';
import { render } from 'react-dom';
import PanResponder from 'index';
import { Github, Eye, EyeOff } from 'react-feather';
import Granim from 'granim';
import Animated from 'animated/lib/targets/react-dom';
import Easing from 'animated/lib/Easing';

const ls = (function () {
	const noop = () => {};
	const _key = 'showLogger';
	const _ls = localStorage || {
		getItem: noop,
		setItem: noop,
		removeItem: noop,
	};

	return {
		has: () => _ls.getItem(_key),
		check: () => _ls.setItem(_key, 'YES'),
		uncheck: () => _ls.removeItem(_key),
	};
})();

class Logger extends Component {
	gestureState = {
		stateID: Math.random(),
		x0: 0,
		y0: 0,
		moveX: 0,
		moveY: 0,
		dx: 0,
		dy: 0,
		vx: 0,
		vy: 0,
		numberActiveTouches: 0,
	};

	toFixed(state, key) {
		state[key] = state[key].toFixed(2) / 1;
	}

	update(gestureState) {
		this.gestureState = gestureState;
		this.toFixed(gestureState, 'vx');
		this.toFixed(gestureState, 'vy');
		this.forceUpdate();
	}

	render() {
		const { gestureState } = this;
		return (
			<Animated.div className="logger" {...this.props}>
				<ul>
					{Object.keys(gestureState).map((prop) => (
						<li key={prop}>
							{prop}: {gestureState[prop]}
						</li>
					))}
				</ul>
			</Animated.div>
		);
	}
}

class App extends Component {
	constructor(props) {
		super(props);

		const createPanHandlers = (name) => ({
			onGrant: (ev, gestureState) => {
				console.log(name, 'onGrant');

				// if (name !== 'parent') return;

				const { x0, y0 } = gestureState;
				const { layoutAnim, styleAnim, hintAmin, logger } = this;

				styleAnim.stopAnimation((value) => {
					styleAnim.setValue(value);
					Animated.timing(styleAnim, {
						toValue: 1,
						duration: 100,
						easing: Easing.in(Easing.ease),
					}).start();
				});

				logger.update(gestureState);

				layoutAnim.stopAnimation(() => {
					layoutAnim.setValue({ x: x0, y: y0 });
				});

				if (this.shouldShowHint) {
					this.shouldShowHint = false;
					Animated.timing(hintAmin, { toValue: 0 }).start();
				}
			},
			onStart: () => {
				console.log(name, 'onStart');
			},
			onMove: (ev, gestureState) => {
				console.log(name, 'onMove');

				// if (name !== 'parent') return;

				const { moveX, moveY } = gestureState;
				const { layoutAnim, logger } = this;
				layoutAnim.setValue({ x: moveX, y: moveY });
				logger.update(gestureState);
			},
			onRelease: (ev, gestureState) => {
				console.log(name, 'onRelease');

				// if (name !== 'parent') return;

				const { styleAnim, logger } = this;
				logger.update(gestureState);
				Animated.timing(styleAnim, {
					toValue: 0,
					duration: 600,
					easing: Easing.out(Easing.ease),
				}).start();
			},
			onEnd: () => {
				console.log(name, 'onEnd');
			},
			onStartShouldSetCapture: () => {
				console.log(name, 'onStartShouldSetCapture');
			},
			onStartShouldSet: () => {
				console.log(name, 'onStartShouldSet');
				// return true;
				// return name === 'middle';
			},
			onMoveShouldSetCapture: () => {
				console.log(name, 'onMoveShouldSetCapture');
			},
			onMoveShouldSet: () => {
				console.log(name, 'onMoveShouldSet');
				return true;
				// return name === 'parent';
			},
			onTerminationRequest: () => {
				console.log(name, 'onTerminationRequest');
			},
			onTerminate: () => {
				console.log(name, 'onTerminate');
			},
			onReject: () => {
				console.log(name, 'onReject');
			},
		});

		this.parentPanHandlers = createPanHandlers('parent');
		this.middlePanHandlers = createPanHandlers('middle');
		this.childPanHandlers = createPanHandlers('child');
	}

	componentDidMount() {
		// eslint-disable-next-line no-new
		new Granim({
			element: '.gradient',
			opacity: [1, 1],
			states: {
				'default-state': {
					gradients: [['#834D9B', '#D04ED6'], ['#2AFADF', '#4C83FF']],
					transitionSpeed: 20000,
				},
			},
		});
	}

	shouldComponentUpdate() {
		return false;
	}

	layoutAnim = new Animated.ValueXY();

	styleAnim = new Animated.Value(0);

	hintAmin = new Animated.Value(1);

	loggerAnim = new Animated.Value(ls.has() ? 1 : 0);

	shouldShowHint = true;

	_toggleLoggerSwitch = (ev) => {
		const { checked } = ev.currentTarget;
		const toValue = checked ? 1 : 0;
		ls[checked ? 'check' : 'uncheck']();
		Animated.timing(this.loggerAnim, { toValue }).start();
	};

	render() {
		const {
			styleAnim,
			layoutAnim,
			loggerAnim,
			hintAmin,
			parentPanHandlers,
			middlePanHandlers,
			childPanHandlers,
		} = this;

		return (
			<div className="container">
				<article className="doc">
					<h1>React Pan Responder View</h1>
					<h2>
						<a href="https://github.com/Cap32">Author: Cap32</a>
					</h2>
				</article>

				<canvas className="gradient" />

				<PanResponder {...parentPanHandlers}>
					{(parentRef) => (
						<div ref={parentRef} className="parent-pan-view">
							<PanResponder {...middlePanHandlers} touchAction="y">
								{(ref) => (
									<div ref={ref} className="pan-view">
										<p>list</p>
										<p>list</p>
										<p>list</p>
										<p>list</p>
										<p>list</p>
										<p>list</p>
										<p>list</p>
										<p>list</p>
										<p>list</p>
										<p>list</p>
										<p>list</p>
										<PanResponder {...childPanHandlers}>
											{(childRef) => (
												<div ref={childRef} className="child-pan-view" />
											)}
										</PanResponder>
										<p>list</p>
										<p>list</p>
										<p>list</p>
										<p>list</p>
										<p>list</p>
										<p>list</p>
										<p>list</p>
										<p>list</p>
										<p>list</p>
										<p>list</p>
										<p>list</p>
									</div>
								)}
							</PanResponder>
						</div>
					)}
				</PanResponder>

				<Animated.div className="touch-hint" style={{ opacity: hintAmin }}>
					Pan to Start
				</Animated.div>

				<Animated.div
					className="tracker"
					style={{
						opacity: styleAnim,
						transform: [
							...layoutAnim.getTranslateTransform(),
							{
								scale: styleAnim.interpolate({
									inputRange: [0, 1],
									outputRange: [2, 1],
								}),
							},
						],
					}}
				/>

				<Logger
					ref={(logger) => (this.logger = logger)}
					style={{ opacity: loggerAnim }}
				/>

				<footer className="footer">
					<div className="footer-left">
						<input
							type="checkbox"
							className="button checkbox"
							onChange={this._toggleLoggerSwitch}
							defaultChecked={ls.has()}
						/>
						<span className="button logger-switch eye">
							<Eye size={22} color="white" />
						</span>
						<span className="button logger-switch eye-off">
							<EyeOff size={22} color="white" />
						</span>
					</div>

					<div className="footer-right">
						<a
							className="button"
							href="https://github.com/Cap32/react-pan-responder"
						>
							<Github size={22} color="white" />
						</a>
					</div>
				</footer>
			</div>
		);
	}
}

render(<App />, document.getElementById('mount'));
