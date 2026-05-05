export const id = 657;
export const ids = [657];
export const modules = {

/***/ 2662:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ isUnicodeSupported)
/* harmony export */ });
/* harmony import */ var node_process__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1708);


function isUnicodeSupported() {
	const {env} = node_process__WEBPACK_IMPORTED_MODULE_0__;
	const {TERM, TERM_PROGRAM} = env;

	if (node_process__WEBPACK_IMPORTED_MODULE_0__.platform !== 'win32') {
		return TERM !== 'linux'; // Linux console (kernel)
	}

	return Boolean(env.WT_SESSION) // Windows Terminal
		|| Boolean(env.TERMINUS_SUBLIME) // Terminus (<0.2.27)
		|| env.ConEmuTask === '{cmd::Cmder}' // ConEmu and cmder
		|| TERM_PROGRAM === 'Terminus-Sublime'
		|| TERM_PROGRAM === 'vscode'
		|| TERM === 'xterm-256color'
		|| TERM === 'alacritty'
		|| TERM === 'rxvt-unicode'
		|| TERM === 'rxvt-unicode-256color'
		|| env.TERMINAL_EMULATOR === 'JetBrains-JediTerm';
}


/***/ }),

/***/ 657:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ ora)
});

// UNUSED EXPORTS: oraPromise, spinners

// EXTERNAL MODULE: external "node:process"
var external_node_process_ = __webpack_require__(1708);
// EXTERNAL MODULE: external "node:util"
var external_node_util_ = __webpack_require__(7975);
;// CONCATENATED MODULE: ./node_modules/chalk/source/vendor/ansi-styles/index.js
const ANSI_BACKGROUND_OFFSET = 10;

const wrapAnsi16 = (offset = 0) => code => `\u001B[${code + offset}m`;

const wrapAnsi256 = (offset = 0) => code => `\u001B[${38 + offset};5;${code}m`;

const wrapAnsi16m = (offset = 0) => (red, green, blue) => `\u001B[${38 + offset};2;${red};${green};${blue}m`;

const styles = {
	modifier: {
		reset: [0, 0],
		// 21 isn't widely supported and 22 does the same thing
		bold: [1, 22],
		dim: [2, 22],
		italic: [3, 23],
		underline: [4, 24],
		overline: [53, 55],
		inverse: [7, 27],
		hidden: [8, 28],
		strikethrough: [9, 29],
	},
	color: {
		black: [30, 39],
		red: [31, 39],
		green: [32, 39],
		yellow: [33, 39],
		blue: [34, 39],
		magenta: [35, 39],
		cyan: [36, 39],
		white: [37, 39],

		// Bright color
		blackBright: [90, 39],
		gray: [90, 39], // Alias of `blackBright`
		grey: [90, 39], // Alias of `blackBright`
		redBright: [91, 39],
		greenBright: [92, 39],
		yellowBright: [93, 39],
		blueBright: [94, 39],
		magentaBright: [95, 39],
		cyanBright: [96, 39],
		whiteBright: [97, 39],
	},
	bgColor: {
		bgBlack: [40, 49],
		bgRed: [41, 49],
		bgGreen: [42, 49],
		bgYellow: [43, 49],
		bgBlue: [44, 49],
		bgMagenta: [45, 49],
		bgCyan: [46, 49],
		bgWhite: [47, 49],

		// Bright color
		bgBlackBright: [100, 49],
		bgGray: [100, 49], // Alias of `bgBlackBright`
		bgGrey: [100, 49], // Alias of `bgBlackBright`
		bgRedBright: [101, 49],
		bgGreenBright: [102, 49],
		bgYellowBright: [103, 49],
		bgBlueBright: [104, 49],
		bgMagentaBright: [105, 49],
		bgCyanBright: [106, 49],
		bgWhiteBright: [107, 49],
	},
};

const modifierNames = Object.keys(styles.modifier);
const foregroundColorNames = Object.keys(styles.color);
const backgroundColorNames = Object.keys(styles.bgColor);
const colorNames = [...foregroundColorNames, ...backgroundColorNames];

function assembleStyles() {
	const codes = new Map();

	for (const [groupName, group] of Object.entries(styles)) {
		for (const [styleName, style] of Object.entries(group)) {
			styles[styleName] = {
				open: `\u001B[${style[0]}m`,
				close: `\u001B[${style[1]}m`,
			};

			group[styleName] = styles[styleName];

			codes.set(style[0], style[1]);
		}

		Object.defineProperty(styles, groupName, {
			value: group,
			enumerable: false,
		});
	}

	Object.defineProperty(styles, 'codes', {
		value: codes,
		enumerable: false,
	});

	styles.color.close = '\u001B[39m';
	styles.bgColor.close = '\u001B[49m';

	styles.color.ansi = wrapAnsi16();
	styles.color.ansi256 = wrapAnsi256();
	styles.color.ansi16m = wrapAnsi16m();
	styles.bgColor.ansi = wrapAnsi16(ANSI_BACKGROUND_OFFSET);
	styles.bgColor.ansi256 = wrapAnsi256(ANSI_BACKGROUND_OFFSET);
	styles.bgColor.ansi16m = wrapAnsi16m(ANSI_BACKGROUND_OFFSET);

	// From https://github.com/Qix-/color-convert/blob/3f0e0d4e92e235796ccb17f6e85c72094a651f49/conversions.js
	Object.defineProperties(styles, {
		rgbToAnsi256: {
			value(red, green, blue) {
				// We use the extended greyscale palette here, with the exception of
				// black and white. normal palette only has 4 greyscale shades.
				if (red === green && green === blue) {
					if (red < 8) {
						return 16;
					}

					if (red > 248) {
						return 231;
					}

					return Math.round(((red - 8) / 247) * 24) + 232;
				}

				return 16
					+ (36 * Math.round(red / 255 * 5))
					+ (6 * Math.round(green / 255 * 5))
					+ Math.round(blue / 255 * 5);
			},
			enumerable: false,
		},
		hexToRgb: {
			value(hex) {
				const matches = /[a-f\d]{6}|[a-f\d]{3}/i.exec(hex.toString(16));
				if (!matches) {
					return [0, 0, 0];
				}

				let [colorString] = matches;

				if (colorString.length === 3) {
					colorString = [...colorString].map(character => character + character).join('');
				}

				const integer = Number.parseInt(colorString, 16);

				return [
					/* eslint-disable no-bitwise */
					(integer >> 16) & 0xFF,
					(integer >> 8) & 0xFF,
					integer & 0xFF,
					/* eslint-enable no-bitwise */
				];
			},
			enumerable: false,
		},
		hexToAnsi256: {
			value: hex => styles.rgbToAnsi256(...styles.hexToRgb(hex)),
			enumerable: false,
		},
		ansi256ToAnsi: {
			value(code) {
				if (code < 8) {
					return 30 + code;
				}

				if (code < 16) {
					return 90 + (code - 8);
				}

				let red;
				let green;
				let blue;

				if (code >= 232) {
					red = (((code - 232) * 10) + 8) / 255;
					green = red;
					blue = red;
				} else {
					code -= 16;

					const remainder = code % 36;

					red = Math.floor(code / 36) / 5;
					green = Math.floor(remainder / 6) / 5;
					blue = (remainder % 6) / 5;
				}

				const value = Math.max(red, green, blue) * 2;

				if (value === 0) {
					return 30;
				}

				// eslint-disable-next-line no-bitwise
				let result = 30 + ((Math.round(blue) << 2) | (Math.round(green) << 1) | Math.round(red));

				if (value === 2) {
					result += 60;
				}

				return result;
			},
			enumerable: false,
		},
		rgbToAnsi: {
			value: (red, green, blue) => styles.ansi256ToAnsi(styles.rgbToAnsi256(red, green, blue)),
			enumerable: false,
		},
		hexToAnsi: {
			value: hex => styles.ansi256ToAnsi(styles.hexToAnsi256(hex)),
			enumerable: false,
		},
	});

	return styles;
}

const ansiStyles = assembleStyles();

/* harmony default export */ const ansi_styles = (ansiStyles);

// EXTERNAL MODULE: external "node:os"
var external_node_os_ = __webpack_require__(8161);
// EXTERNAL MODULE: external "node:tty"
var external_node_tty_ = __webpack_require__(7066);
;// CONCATENATED MODULE: ./node_modules/chalk/source/vendor/supports-color/index.js




// From: https://github.com/sindresorhus/has-flag/blob/main/index.js
/// function hasFlag(flag, argv = globalThis.Deno?.args ?? process.argv) {
function hasFlag(flag, argv = globalThis.Deno ? globalThis.Deno.args : external_node_process_.argv) {
	const prefix = flag.startsWith('-') ? '' : (flag.length === 1 ? '-' : '--');
	const position = argv.indexOf(prefix + flag);
	const terminatorPosition = argv.indexOf('--');
	return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
}

const {env} = external_node_process_;

let flagForceColor;
if (
	hasFlag('no-color')
	|| hasFlag('no-colors')
	|| hasFlag('color=false')
	|| hasFlag('color=never')
) {
	flagForceColor = 0;
} else if (
	hasFlag('color')
	|| hasFlag('colors')
	|| hasFlag('color=true')
	|| hasFlag('color=always')
) {
	flagForceColor = 1;
}

function envForceColor() {
	if ('FORCE_COLOR' in env) {
		if (env.FORCE_COLOR === 'true') {
			return 1;
		}

		if (env.FORCE_COLOR === 'false') {
			return 0;
		}

		return env.FORCE_COLOR.length === 0 ? 1 : Math.min(Number.parseInt(env.FORCE_COLOR, 10), 3);
	}
}

function translateLevel(level) {
	if (level === 0) {
		return false;
	}

	return {
		level,
		hasBasic: true,
		has256: level >= 2,
		has16m: level >= 3,
	};
}

function _supportsColor(haveStream, {streamIsTTY, sniffFlags = true} = {}) {
	const noFlagForceColor = envForceColor();
	if (noFlagForceColor !== undefined) {
		flagForceColor = noFlagForceColor;
	}

	const forceColor = sniffFlags ? flagForceColor : noFlagForceColor;

	if (forceColor === 0) {
		return 0;
	}

	if (sniffFlags) {
		if (hasFlag('color=16m')
			|| hasFlag('color=full')
			|| hasFlag('color=truecolor')) {
			return 3;
		}

		if (hasFlag('color=256')) {
			return 2;
		}
	}

	// Check for Azure DevOps pipelines.
	// Has to be above the `!streamIsTTY` check.
	if ('TF_BUILD' in env && 'AGENT_NAME' in env) {
		return 1;
	}

	if (haveStream && !streamIsTTY && forceColor === undefined) {
		return 0;
	}

	const min = forceColor || 0;

	if (env.TERM === 'dumb') {
		return min;
	}

	if (external_node_process_.platform === 'win32') {
		// Windows 10 build 10586 is the first Windows release that supports 256 colors.
		// Windows 10 build 14931 is the first release that supports 16m/TrueColor.
		const osRelease = external_node_os_.release().split('.');
		if (
			Number(osRelease[0]) >= 10
			&& Number(osRelease[2]) >= 10_586
		) {
			return Number(osRelease[2]) >= 14_931 ? 3 : 2;
		}

		return 1;
	}

	if ('CI' in env) {
		if (['GITHUB_ACTIONS', 'GITEA_ACTIONS', 'CIRCLECI'].some(key => key in env)) {
			return 3;
		}

		if (['TRAVIS', 'APPVEYOR', 'GITLAB_CI', 'BUILDKITE', 'DRONE'].some(sign => sign in env) || env.CI_NAME === 'codeship') {
			return 1;
		}

		return min;
	}

	if ('TEAMCITY_VERSION' in env) {
		return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
	}

	if (env.COLORTERM === 'truecolor') {
		return 3;
	}

	if (env.TERM === 'xterm-kitty') {
		return 3;
	}

	if (env.TERM === 'xterm-ghostty') {
		return 3;
	}

	if (env.TERM === 'wezterm') {
		return 3;
	}

	if ('TERM_PROGRAM' in env) {
		const version = Number.parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10);

		switch (env.TERM_PROGRAM) {
			case 'iTerm.app': {
				return version >= 3 ? 3 : 2;
			}

			case 'Apple_Terminal': {
				return 2;
			}
			// No default
		}
	}

	if (/-256(color)?$/i.test(env.TERM)) {
		return 2;
	}

	if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
		return 1;
	}

	if ('COLORTERM' in env) {
		return 1;
	}

	return min;
}

function createSupportsColor(stream, options = {}) {
	const level = _supportsColor(stream, {
		streamIsTTY: stream && stream.isTTY,
		...options,
	});

	return translateLevel(level);
}

const supportsColor = {
	stdout: createSupportsColor({isTTY: external_node_tty_.isatty(1)}),
	stderr: createSupportsColor({isTTY: external_node_tty_.isatty(2)}),
};

/* harmony default export */ const supports_color = (supportsColor);

;// CONCATENATED MODULE: ./node_modules/chalk/source/utilities.js
// TODO: When targeting Node.js 16, use `String.prototype.replaceAll`.
function stringReplaceAll(string, substring, replacer) {
	let index = string.indexOf(substring);
	if (index === -1) {
		return string;
	}

	const substringLength = substring.length;
	let endIndex = 0;
	let returnValue = '';
	do {
		returnValue += string.slice(endIndex, index) + substring + replacer;
		endIndex = index + substringLength;
		index = string.indexOf(substring, endIndex);
	} while (index !== -1);

	returnValue += string.slice(endIndex);
	return returnValue;
}

function stringEncaseCRLFWithFirstIndex(string, prefix, postfix, index) {
	let endIndex = 0;
	let returnValue = '';
	do {
		const gotCR = string[index - 1] === '\r';
		returnValue += string.slice(endIndex, (gotCR ? index - 1 : index)) + prefix + (gotCR ? '\r\n' : '\n') + postfix;
		endIndex = index + 1;
		index = string.indexOf('\n', endIndex);
	} while (index !== -1);

	returnValue += string.slice(endIndex);
	return returnValue;
}

;// CONCATENATED MODULE: ./node_modules/chalk/source/index.js




const {stdout: stdoutColor, stderr: stderrColor} = supports_color;

const GENERATOR = Symbol('GENERATOR');
const STYLER = Symbol('STYLER');
const IS_EMPTY = Symbol('IS_EMPTY');

// `supportsColor.level` → `ansiStyles.color[name]` mapping
const levelMapping = [
	'ansi',
	'ansi',
	'ansi256',
	'ansi16m',
];

const source_styles = Object.create(null);

const applyOptions = (object, options = {}) => {
	if (options.level && !(Number.isInteger(options.level) && options.level >= 0 && options.level <= 3)) {
		throw new Error('The `level` option should be an integer from 0 to 3');
	}

	// Detect level if not set manually
	const colorLevel = stdoutColor ? stdoutColor.level : 0;
	object.level = options.level === undefined ? colorLevel : options.level;
};

class Chalk {
	constructor(options) {
		// eslint-disable-next-line no-constructor-return
		return chalkFactory(options);
	}
}

const chalkFactory = options => {
	const chalk = (...strings) => strings.join(' ');
	applyOptions(chalk, options);

	Object.setPrototypeOf(chalk, createChalk.prototype);

	return chalk;
};

function createChalk(options) {
	return chalkFactory(options);
}

Object.setPrototypeOf(createChalk.prototype, Function.prototype);

for (const [styleName, style] of Object.entries(ansi_styles)) {
	source_styles[styleName] = {
		get() {
			const builder = createBuilder(this, createStyler(style.open, style.close, this[STYLER]), this[IS_EMPTY]);
			Object.defineProperty(this, styleName, {value: builder});
			return builder;
		},
	};
}

source_styles.visible = {
	get() {
		const builder = createBuilder(this, this[STYLER], true);
		Object.defineProperty(this, 'visible', {value: builder});
		return builder;
	},
};

const getModelAnsi = (model, level, type, ...arguments_) => {
	if (model === 'rgb') {
		if (level === 'ansi16m') {
			return ansi_styles[type].ansi16m(...arguments_);
		}

		if (level === 'ansi256') {
			return ansi_styles[type].ansi256(ansi_styles.rgbToAnsi256(...arguments_));
		}

		return ansi_styles[type].ansi(ansi_styles.rgbToAnsi(...arguments_));
	}

	if (model === 'hex') {
		return getModelAnsi('rgb', level, type, ...ansi_styles.hexToRgb(...arguments_));
	}

	return ansi_styles[type][model](...arguments_);
};

const usedModels = ['rgb', 'hex', 'ansi256'];

for (const model of usedModels) {
	source_styles[model] = {
		get() {
			const {level} = this;
			return function (...arguments_) {
				const styler = createStyler(getModelAnsi(model, levelMapping[level], 'color', ...arguments_), ansi_styles.color.close, this[STYLER]);
				return createBuilder(this, styler, this[IS_EMPTY]);
			};
		},
	};

	const bgModel = 'bg' + model[0].toUpperCase() + model.slice(1);
	source_styles[bgModel] = {
		get() {
			const {level} = this;
			return function (...arguments_) {
				const styler = createStyler(getModelAnsi(model, levelMapping[level], 'bgColor', ...arguments_), ansi_styles.bgColor.close, this[STYLER]);
				return createBuilder(this, styler, this[IS_EMPTY]);
			};
		},
	};
}

const proto = Object.defineProperties(() => {}, {
	...source_styles,
	level: {
		enumerable: true,
		get() {
			return this[GENERATOR].level;
		},
		set(level) {
			this[GENERATOR].level = level;
		},
	},
});

const createStyler = (open, close, parent) => {
	let openAll;
	let closeAll;
	if (parent === undefined) {
		openAll = open;
		closeAll = close;
	} else {
		openAll = parent.openAll + open;
		closeAll = close + parent.closeAll;
	}

	return {
		open,
		close,
		openAll,
		closeAll,
		parent,
	};
};

const createBuilder = (self, _styler, _isEmpty) => {
	// Single argument is hot path, implicit coercion is faster than anything
	// eslint-disable-next-line no-implicit-coercion
	const builder = (...arguments_) => applyStyle(builder, (arguments_.length === 1) ? ('' + arguments_[0]) : arguments_.join(' '));

	// We alter the prototype because we must return a function, but there is
	// no way to create a function with a different prototype
	Object.setPrototypeOf(builder, proto);

	builder[GENERATOR] = self;
	builder[STYLER] = _styler;
	builder[IS_EMPTY] = _isEmpty;

	return builder;
};

const applyStyle = (self, string) => {
	if (self.level <= 0 || !string) {
		return self[IS_EMPTY] ? '' : string;
	}

	let styler = self[STYLER];

	if (styler === undefined) {
		return string;
	}

	const {openAll, closeAll} = styler;
	if (string.includes('\u001B')) {
		while (styler !== undefined) {
			// Replace any instances already present with a re-opening code
			// otherwise only the part of the string until said closing code
			// will be colored, and the rest will simply be 'plain'.
			string = stringReplaceAll(string, styler.close, styler.open);

			styler = styler.parent;
		}
	}

	// We can move both next actions out of loop, because remaining actions in loop won't have
	// any/visible effect on parts we add here. Close the styling before a linebreak and reopen
	// after next line to fix a bleed issue on macOS: https://github.com/chalk/chalk/pull/92
	const lfIndex = string.indexOf('\n');
	if (lfIndex !== -1) {
		string = stringEncaseCRLFWithFirstIndex(string, closeAll, openAll, lfIndex);
	}

	return openAll + string + closeAll;
};

Object.defineProperties(createChalk.prototype, source_styles);

const chalk = createChalk();
const chalkStderr = createChalk({level: stderrColor ? stderrColor.level : 0});





/* harmony default export */ const source = (chalk);

;// CONCATENATED MODULE: ./node_modules/mimic-function/index.js
const copyProperty = (to, from, property, ignoreNonConfigurable) => {
	// `Function#length` should reflect the parameters of `to` not `from` since we keep its body.
	// `Function#prototype` is non-writable and non-configurable so can never be modified.
	if (property === 'length' || property === 'prototype') {
		return;
	}

	// `Function#arguments` and `Function#caller` should not be copied. They were reported to be present in `Reflect.ownKeys` for some devices in React Native (#41), so we explicitly ignore them here.
	if (property === 'arguments' || property === 'caller') {
		return;
	}

	const toDescriptor = Object.getOwnPropertyDescriptor(to, property);
	const fromDescriptor = Object.getOwnPropertyDescriptor(from, property);

	if (!canCopyProperty(toDescriptor, fromDescriptor) && ignoreNonConfigurable) {
		return;
	}

	Object.defineProperty(to, property, fromDescriptor);
};

// `Object.defineProperty()` throws if the property exists, is not configurable and either:
// - one its descriptors is changed
// - it is non-writable and its value is changed
const canCopyProperty = function (toDescriptor, fromDescriptor) {
	return toDescriptor === undefined || toDescriptor.configurable || (
		toDescriptor.writable === fromDescriptor.writable
		&& toDescriptor.enumerable === fromDescriptor.enumerable
		&& toDescriptor.configurable === fromDescriptor.configurable
		&& (toDescriptor.writable || toDescriptor.value === fromDescriptor.value)
	);
};

const changePrototype = (to, from) => {
	const fromPrototype = Object.getPrototypeOf(from);
	if (fromPrototype === Object.getPrototypeOf(to)) {
		return;
	}

	Object.setPrototypeOf(to, fromPrototype);
};

const wrappedToString = (withName, fromBody) => `/* Wrapped ${withName}*/\n${fromBody}`;

const toStringDescriptor = Object.getOwnPropertyDescriptor(Function.prototype, 'toString');
const toStringName = Object.getOwnPropertyDescriptor(Function.prototype.toString, 'name');

// We call `from.toString()` early (not lazily) to ensure `from` can be garbage collected.
// We use `bind()` instead of a closure for the same reason.
// Calling `from.toString()` early also allows caching it in case `to.toString()` is called several times.
const changeToString = (to, from, name) => {
	const withName = name === '' ? '' : `with ${name.trim()}() `;
	const newToString = wrappedToString.bind(null, withName, from.toString());
	// Ensure `to.toString.toString` is non-enumerable and has the same `same`
	Object.defineProperty(newToString, 'name', toStringName);
	const {writable, enumerable, configurable} = toStringDescriptor; // We destructue to avoid a potential `get` descriptor.
	Object.defineProperty(to, 'toString', {value: newToString, writable, enumerable, configurable});
};

function mimicFunction(to, from, {ignoreNonConfigurable = false} = {}) {
	const {name} = to;

	for (const property of Reflect.ownKeys(from)) {
		copyProperty(to, from, property, ignoreNonConfigurable);
	}

	changePrototype(to, from);
	changeToString(to, from, name);

	return to;
}

;// CONCATENATED MODULE: ./node_modules/onetime/index.js


const calledFunctions = new WeakMap();

const onetime = (function_, options = {}) => {
	if (typeof function_ !== 'function') {
		throw new TypeError('Expected a function');
	}

	let returnValue;
	let callCount = 0;
	const functionName = function_.displayName || function_.name || '<anonymous>';

	const onetime = function (...arguments_) {
		calledFunctions.set(onetime, ++callCount);

		if (callCount === 1) {
			returnValue = function_.apply(this, arguments_);
			function_ = undefined;
		} else if (options.throw === true) {
			throw new Error(`Function \`${functionName}\` can only be called once`);
		}

		return returnValue;
	};

	mimicFunction(onetime, function_);
	calledFunctions.set(onetime, callCount);

	return onetime;
};

onetime.callCount = function_ => {
	if (!calledFunctions.has(function_)) {
		throw new Error(`The given function \`${function_.name}\` is not wrapped by the \`onetime\` package`);
	}

	return calledFunctions.get(function_);
};

/* harmony default export */ const node_modules_onetime = (onetime);

// EXTERNAL MODULE: ./node_modules/signal-exit/dist/mjs/index.js + 1 modules
var mjs = __webpack_require__(7081);
;// CONCATENATED MODULE: ./node_modules/restore-cursor/index.js




const terminal = external_node_process_.stderr.isTTY
	? external_node_process_.stderr
	: (external_node_process_.stdout.isTTY ? external_node_process_.stdout : undefined);

const restoreCursor = terminal ? node_modules_onetime(() => {
	(0,mjs/* onExit */.cf)(() => {
		terminal.write('\u001B[?25h');
	}, {alwaysLast: true});
}) : () => {};

/* harmony default export */ const restore_cursor = (restoreCursor);

;// CONCATENATED MODULE: ./node_modules/cli-cursor/index.js



let isHidden = false;

const cliCursor = {};

cliCursor.show = (writableStream = external_node_process_.stderr) => {
	if (!writableStream.isTTY) {
		return;
	}

	isHidden = false;
	writableStream.write('\u001B[?25h');
};

cliCursor.hide = (writableStream = external_node_process_.stderr) => {
	if (!writableStream.isTTY) {
		return;
	}

	restore_cursor();
	isHidden = true;
	writableStream.write('\u001B[?25l');
};

cliCursor.toggle = (force, writableStream) => {
	if (force !== undefined) {
		isHidden = force;
	}

	if (isHidden) {
		cliCursor.show(writableStream);
	} else {
		cliCursor.hide(writableStream);
	}
};

/* harmony default export */ const cli_cursor = (cliCursor);

;// CONCATENATED MODULE: ./node_modules/cli-spinners/spinners.json
const spinners_namespaceObject = /*#__PURE__*/JSON.parse('{"dots":{"interval":80,"frames":["⠋","⠙","⠹","⠸","⠼","⠴","⠦","⠧","⠇","⠏"]},"dots2":{"interval":80,"frames":["⣾","⣽","⣻","⢿","⡿","⣟","⣯","⣷"]},"dots3":{"interval":80,"frames":["⠋","⠙","⠚","⠞","⠖","⠦","⠴","⠲","⠳","⠓"]},"dots4":{"interval":80,"frames":["⠄","⠆","⠇","⠋","⠙","⠸","⠰","⠠","⠰","⠸","⠙","⠋","⠇","⠆"]},"dots5":{"interval":80,"frames":["⠋","⠙","⠚","⠒","⠂","⠂","⠒","⠲","⠴","⠦","⠖","⠒","⠐","⠐","⠒","⠓","⠋"]},"dots6":{"interval":80,"frames":["⠁","⠉","⠙","⠚","⠒","⠂","⠂","⠒","⠲","⠴","⠤","⠄","⠄","⠤","⠴","⠲","⠒","⠂","⠂","⠒","⠚","⠙","⠉","⠁"]},"dots7":{"interval":80,"frames":["⠈","⠉","⠋","⠓","⠒","⠐","⠐","⠒","⠖","⠦","⠤","⠠","⠠","⠤","⠦","⠖","⠒","⠐","⠐","⠒","⠓","⠋","⠉","⠈"]},"dots8":{"interval":80,"frames":["⠁","⠁","⠉","⠙","⠚","⠒","⠂","⠂","⠒","⠲","⠴","⠤","⠄","⠄","⠤","⠠","⠠","⠤","⠦","⠖","⠒","⠐","⠐","⠒","⠓","⠋","⠉","⠈","⠈"]},"dots9":{"interval":80,"frames":["⢹","⢺","⢼","⣸","⣇","⡧","⡗","⡏"]},"dots10":{"interval":80,"frames":["⢄","⢂","⢁","⡁","⡈","⡐","⡠"]},"dots11":{"interval":100,"frames":["⠁","⠂","⠄","⡀","⢀","⠠","⠐","⠈"]},"dots12":{"interval":80,"frames":["⢀⠀","⡀⠀","⠄⠀","⢂⠀","⡂⠀","⠅⠀","⢃⠀","⡃⠀","⠍⠀","⢋⠀","⡋⠀","⠍⠁","⢋⠁","⡋⠁","⠍⠉","⠋⠉","⠋⠉","⠉⠙","⠉⠙","⠉⠩","⠈⢙","⠈⡙","⢈⠩","⡀⢙","⠄⡙","⢂⠩","⡂⢘","⠅⡘","⢃⠨","⡃⢐","⠍⡐","⢋⠠","⡋⢀","⠍⡁","⢋⠁","⡋⠁","⠍⠉","⠋⠉","⠋⠉","⠉⠙","⠉⠙","⠉⠩","⠈⢙","⠈⡙","⠈⠩","⠀⢙","⠀⡙","⠀⠩","⠀⢘","⠀⡘","⠀⠨","⠀⢐","⠀⡐","⠀⠠","⠀⢀","⠀⡀"]},"dots13":{"interval":80,"frames":["⣼","⣹","⢻","⠿","⡟","⣏","⣧","⣶"]},"dots14":{"interval":80,"frames":["⠉⠉","⠈⠙","⠀⠹","⠀⢸","⠀⣰","⢀⣠","⣀⣀","⣄⡀","⣆⠀","⡇⠀","⠏⠀","⠋⠁"]},"dots8Bit":{"interval":80,"frames":["⠀","⠁","⠂","⠃","⠄","⠅","⠆","⠇","⡀","⡁","⡂","⡃","⡄","⡅","⡆","⡇","⠈","⠉","⠊","⠋","⠌","⠍","⠎","⠏","⡈","⡉","⡊","⡋","⡌","⡍","⡎","⡏","⠐","⠑","⠒","⠓","⠔","⠕","⠖","⠗","⡐","⡑","⡒","⡓","⡔","⡕","⡖","⡗","⠘","⠙","⠚","⠛","⠜","⠝","⠞","⠟","⡘","⡙","⡚","⡛","⡜","⡝","⡞","⡟","⠠","⠡","⠢","⠣","⠤","⠥","⠦","⠧","⡠","⡡","⡢","⡣","⡤","⡥","⡦","⡧","⠨","⠩","⠪","⠫","⠬","⠭","⠮","⠯","⡨","⡩","⡪","⡫","⡬","⡭","⡮","⡯","⠰","⠱","⠲","⠳","⠴","⠵","⠶","⠷","⡰","⡱","⡲","⡳","⡴","⡵","⡶","⡷","⠸","⠹","⠺","⠻","⠼","⠽","⠾","⠿","⡸","⡹","⡺","⡻","⡼","⡽","⡾","⡿","⢀","⢁","⢂","⢃","⢄","⢅","⢆","⢇","⣀","⣁","⣂","⣃","⣄","⣅","⣆","⣇","⢈","⢉","⢊","⢋","⢌","⢍","⢎","⢏","⣈","⣉","⣊","⣋","⣌","⣍","⣎","⣏","⢐","⢑","⢒","⢓","⢔","⢕","⢖","⢗","⣐","⣑","⣒","⣓","⣔","⣕","⣖","⣗","⢘","⢙","⢚","⢛","⢜","⢝","⢞","⢟","⣘","⣙","⣚","⣛","⣜","⣝","⣞","⣟","⢠","⢡","⢢","⢣","⢤","⢥","⢦","⢧","⣠","⣡","⣢","⣣","⣤","⣥","⣦","⣧","⢨","⢩","⢪","⢫","⢬","⢭","⢮","⢯","⣨","⣩","⣪","⣫","⣬","⣭","⣮","⣯","⢰","⢱","⢲","⢳","⢴","⢵","⢶","⢷","⣰","⣱","⣲","⣳","⣴","⣵","⣶","⣷","⢸","⢹","⢺","⢻","⢼","⢽","⢾","⢿","⣸","⣹","⣺","⣻","⣼","⣽","⣾","⣿"]},"dotsCircle":{"interval":80,"frames":["⢎ ","⠎⠁","⠊⠑","⠈⠱"," ⡱","⢀⡰","⢄⡠","⢆⡀"]},"sand":{"interval":80,"frames":["⠁","⠂","⠄","⡀","⡈","⡐","⡠","⣀","⣁","⣂","⣄","⣌","⣔","⣤","⣥","⣦","⣮","⣶","⣷","⣿","⡿","⠿","⢟","⠟","⡛","⠛","⠫","⢋","⠋","⠍","⡉","⠉","⠑","⠡","⢁"]},"line":{"interval":130,"frames":["-","\\\\","|","/"]},"line2":{"interval":100,"frames":["⠂","-","–","—","–","-"]},"rollingLine":{"interval":80,"frames":["/  "," - "," \\\\ ","  |","  |"," \\\\ "," - ","/  "]},"pipe":{"interval":100,"frames":["┤","┘","┴","└","├","┌","┬","┐"]},"simpleDots":{"interval":400,"frames":[".  ",".. ","...","   "]},"simpleDotsScrolling":{"interval":200,"frames":[".  ",".. ","..."," ..","  .","   "]},"star":{"interval":70,"frames":["✶","✸","✹","✺","✹","✷"]},"star2":{"interval":80,"frames":["+","x","*"]},"flip":{"interval":70,"frames":["_","_","_","-","`","`","\'","´","-","_","_","_"]},"hamburger":{"interval":100,"frames":["☱","☲","☴"]},"growVertical":{"interval":120,"frames":["▁","▃","▄","▅","▆","▇","▆","▅","▄","▃"]},"growHorizontal":{"interval":120,"frames":["▏","▎","▍","▌","▋","▊","▉","▊","▋","▌","▍","▎"]},"balloon":{"interval":140,"frames":[" ",".","o","O","@","*"," "]},"balloon2":{"interval":120,"frames":[".","o","O","°","O","o","."]},"noise":{"interval":100,"frames":["▓","▒","░"]},"bounce":{"interval":120,"frames":["⠁","⠂","⠄","⠂"]},"boxBounce":{"interval":120,"frames":["▖","▘","▝","▗"]},"boxBounce2":{"interval":100,"frames":["▌","▀","▐","▄"]},"triangle":{"interval":50,"frames":["◢","◣","◤","◥"]},"binary":{"interval":80,"frames":["010010","001100","100101","111010","111101","010111","101011","111000","110011","110101"]},"arc":{"interval":100,"frames":["◜","◠","◝","◞","◡","◟"]},"circle":{"interval":120,"frames":["◡","⊙","◠"]},"squareCorners":{"interval":180,"frames":["◰","◳","◲","◱"]},"circleQuarters":{"interval":120,"frames":["◴","◷","◶","◵"]},"circleHalves":{"interval":50,"frames":["◐","◓","◑","◒"]},"squish":{"interval":100,"frames":["╫","╪"]},"toggle":{"interval":250,"frames":["⊶","⊷"]},"toggle2":{"interval":80,"frames":["▫","▪"]},"toggle3":{"interval":120,"frames":["□","■"]},"toggle4":{"interval":100,"frames":["■","□","▪","▫"]},"toggle5":{"interval":100,"frames":["▮","▯"]},"toggle6":{"interval":300,"frames":["ဝ","၀"]},"toggle7":{"interval":80,"frames":["⦾","⦿"]},"toggle8":{"interval":100,"frames":["◍","◌"]},"toggle9":{"interval":100,"frames":["◉","◎"]},"toggle10":{"interval":100,"frames":["㊂","㊀","㊁"]},"toggle11":{"interval":50,"frames":["⧇","⧆"]},"toggle12":{"interval":120,"frames":["☗","☖"]},"toggle13":{"interval":80,"frames":["=","*","-"]},"arrow":{"interval":100,"frames":["←","↖","↑","↗","→","↘","↓","↙"]},"arrow2":{"interval":80,"frames":["⬆️ ","↗️ ","➡️ ","↘️ ","⬇️ ","↙️ ","⬅️ ","↖️ "]},"arrow3":{"interval":120,"frames":["▹▹▹▹▹","▸▹▹▹▹","▹▸▹▹▹","▹▹▸▹▹","▹▹▹▸▹","▹▹▹▹▸"]},"bouncingBar":{"interval":80,"frames":["[    ]","[=   ]","[==  ]","[=== ]","[====]","[ ===]","[  ==]","[   =]","[    ]","[   =]","[  ==]","[ ===]","[====]","[=== ]","[==  ]","[=   ]"]},"bouncingBall":{"interval":80,"frames":["( ●    )","(  ●   )","(   ●  )","(    ● )","(     ●)","(    ● )","(   ●  )","(  ●   )","( ●    )","(●     )"]},"smiley":{"interval":200,"frames":["😄 ","😝 "]},"monkey":{"interval":300,"frames":["🙈 ","🙈 ","🙉 ","🙊 "]},"hearts":{"interval":100,"frames":["💛 ","💙 ","💜 ","💚 ","💗 "]},"clock":{"interval":100,"frames":["🕛 ","🕐 ","🕑 ","🕒 ","🕓 ","🕔 ","🕕 ","🕖 ","🕗 ","🕘 ","🕙 ","🕚 "]},"earth":{"interval":180,"frames":["🌍 ","🌎 ","🌏 "]},"material":{"interval":17,"frames":["█▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁","██▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁","███▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁","████▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁","██████▁▁▁▁▁▁▁▁▁▁▁▁▁▁","██████▁▁▁▁▁▁▁▁▁▁▁▁▁▁","███████▁▁▁▁▁▁▁▁▁▁▁▁▁","████████▁▁▁▁▁▁▁▁▁▁▁▁","█████████▁▁▁▁▁▁▁▁▁▁▁","█████████▁▁▁▁▁▁▁▁▁▁▁","██████████▁▁▁▁▁▁▁▁▁▁","███████████▁▁▁▁▁▁▁▁▁","█████████████▁▁▁▁▁▁▁","██████████████▁▁▁▁▁▁","██████████████▁▁▁▁▁▁","▁██████████████▁▁▁▁▁","▁██████████████▁▁▁▁▁","▁██████████████▁▁▁▁▁","▁▁██████████████▁▁▁▁","▁▁▁██████████████▁▁▁","▁▁▁▁█████████████▁▁▁","▁▁▁▁██████████████▁▁","▁▁▁▁██████████████▁▁","▁▁▁▁▁██████████████▁","▁▁▁▁▁██████████████▁","▁▁▁▁▁██████████████▁","▁▁▁▁▁▁██████████████","▁▁▁▁▁▁██████████████","▁▁▁▁▁▁▁█████████████","▁▁▁▁▁▁▁█████████████","▁▁▁▁▁▁▁▁████████████","▁▁▁▁▁▁▁▁████████████","▁▁▁▁▁▁▁▁▁███████████","▁▁▁▁▁▁▁▁▁███████████","▁▁▁▁▁▁▁▁▁▁██████████","▁▁▁▁▁▁▁▁▁▁██████████","▁▁▁▁▁▁▁▁▁▁▁▁████████","▁▁▁▁▁▁▁▁▁▁▁▁▁███████","▁▁▁▁▁▁▁▁▁▁▁▁▁▁██████","▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁█████","▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁█████","█▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁████","██▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁███","██▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁███","███▁▁▁▁▁▁▁▁▁▁▁▁▁▁███","████▁▁▁▁▁▁▁▁▁▁▁▁▁▁██","█████▁▁▁▁▁▁▁▁▁▁▁▁▁▁█","█████▁▁▁▁▁▁▁▁▁▁▁▁▁▁█","██████▁▁▁▁▁▁▁▁▁▁▁▁▁█","████████▁▁▁▁▁▁▁▁▁▁▁▁","█████████▁▁▁▁▁▁▁▁▁▁▁","█████████▁▁▁▁▁▁▁▁▁▁▁","█████████▁▁▁▁▁▁▁▁▁▁▁","█████████▁▁▁▁▁▁▁▁▁▁▁","███████████▁▁▁▁▁▁▁▁▁","████████████▁▁▁▁▁▁▁▁","████████████▁▁▁▁▁▁▁▁","██████████████▁▁▁▁▁▁","██████████████▁▁▁▁▁▁","▁██████████████▁▁▁▁▁","▁██████████████▁▁▁▁▁","▁▁▁█████████████▁▁▁▁","▁▁▁▁▁████████████▁▁▁","▁▁▁▁▁████████████▁▁▁","▁▁▁▁▁▁███████████▁▁▁","▁▁▁▁▁▁▁▁█████████▁▁▁","▁▁▁▁▁▁▁▁█████████▁▁▁","▁▁▁▁▁▁▁▁▁█████████▁▁","▁▁▁▁▁▁▁▁▁█████████▁▁","▁▁▁▁▁▁▁▁▁▁█████████▁","▁▁▁▁▁▁▁▁▁▁▁████████▁","▁▁▁▁▁▁▁▁▁▁▁████████▁","▁▁▁▁▁▁▁▁▁▁▁▁███████▁","▁▁▁▁▁▁▁▁▁▁▁▁███████▁","▁▁▁▁▁▁▁▁▁▁▁▁▁███████","▁▁▁▁▁▁▁▁▁▁▁▁▁███████","▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁█████","▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁████","▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁████","▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁████","▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁███","▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁███","▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁██","▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁██","▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁██","▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁█","▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁█","▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁█","▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁","▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁","▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁","▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁"]},"moon":{"interval":80,"frames":["🌑 ","🌒 ","🌓 ","🌔 ","🌕 ","🌖 ","🌗 ","🌘 "]},"runner":{"interval":140,"frames":["🚶 ","🏃 "]},"pong":{"interval":80,"frames":["▐⠂       ▌","▐⠈       ▌","▐ ⠂      ▌","▐ ⠠      ▌","▐  ⡀     ▌","▐  ⠠     ▌","▐   ⠂    ▌","▐   ⠈    ▌","▐    ⠂   ▌","▐    ⠠   ▌","▐     ⡀  ▌","▐     ⠠  ▌","▐      ⠂ ▌","▐      ⠈ ▌","▐       ⠂▌","▐       ⠠▌","▐       ⡀▌","▐      ⠠ ▌","▐      ⠂ ▌","▐     ⠈  ▌","▐     ⠂  ▌","▐    ⠠   ▌","▐    ⡀   ▌","▐   ⠠    ▌","▐   ⠂    ▌","▐  ⠈     ▌","▐  ⠂     ▌","▐ ⠠      ▌","▐ ⡀      ▌","▐⠠       ▌"]},"shark":{"interval":120,"frames":["▐|\\\\____________▌","▐_|\\\\___________▌","▐__|\\\\__________▌","▐___|\\\\_________▌","▐____|\\\\________▌","▐_____|\\\\_______▌","▐______|\\\\______▌","▐_______|\\\\_____▌","▐________|\\\\____▌","▐_________|\\\\___▌","▐__________|\\\\__▌","▐___________|\\\\_▌","▐____________|\\\\▌","▐____________/|▌","▐___________/|_▌","▐__________/|__▌","▐_________/|___▌","▐________/|____▌","▐_______/|_____▌","▐______/|______▌","▐_____/|_______▌","▐____/|________▌","▐___/|_________▌","▐__/|__________▌","▐_/|___________▌","▐/|____________▌"]},"dqpb":{"interval":100,"frames":["d","q","p","b"]},"weather":{"interval":100,"frames":["☀️ ","☀️ ","☀️ ","🌤 ","⛅️ ","🌥 ","☁️ ","🌧 ","🌨 ","🌧 ","🌨 ","🌧 ","🌨 ","⛈ ","🌨 ","🌧 ","🌨 ","☁️ ","🌥 ","⛅️ ","🌤 ","☀️ ","☀️ "]},"christmas":{"interval":400,"frames":["🌲","🎄"]},"grenade":{"interval":80,"frames":["،  ","′  "," ´ "," ‾ ","  ⸌","  ⸊","  |","  ⁎","  ⁕"," ෴ ","  ⁓","   ","   ","   "]},"point":{"interval":125,"frames":["∙∙∙","●∙∙","∙●∙","∙∙●","∙∙∙"]},"layer":{"interval":150,"frames":["-","=","≡"]},"betaWave":{"interval":80,"frames":["ρββββββ","βρβββββ","ββρββββ","βββρβββ","ββββρββ","βββββρβ","ββββββρ"]},"fingerDance":{"interval":160,"frames":["🤘 ","🤟 ","🖖 ","✋ ","🤚 ","👆 "]},"fistBump":{"interval":80,"frames":["🤜　　　　🤛 ","🤜　　　　🤛 ","🤜　　　　🤛 ","　🤜　　🤛　 ","　　🤜🤛　　 ","　🤜✨🤛　　 ","🤜　✨　🤛　 "]},"soccerHeader":{"interval":80,"frames":[" 🧑⚽️       🧑 ","🧑  ⚽️      🧑 ","🧑   ⚽️     🧑 ","🧑    ⚽️    🧑 ","🧑     ⚽️   🧑 ","🧑      ⚽️  🧑 ","🧑       ⚽️🧑  ","🧑      ⚽️  🧑 ","🧑     ⚽️   🧑 ","🧑    ⚽️    🧑 ","🧑   ⚽️     🧑 ","🧑  ⚽️      🧑 "]},"mindblown":{"interval":160,"frames":["😐 ","😐 ","😮 ","😮 ","😦 ","😦 ","😧 ","😧 ","🤯 ","💥 ","✨ ","　 ","　 ","　 "]},"speaker":{"interval":160,"frames":["🔈 ","🔉 ","🔊 ","🔉 "]},"orangePulse":{"interval":100,"frames":["🔸 ","🔶 ","🟠 ","🟠 ","🔶 "]},"bluePulse":{"interval":100,"frames":["🔹 ","🔷 ","🔵 ","🔵 ","🔷 "]},"orangeBluePulse":{"interval":100,"frames":["🔸 ","🔶 ","🟠 ","🟠 ","🔶 ","🔹 ","🔷 ","🔵 ","🔵 ","🔷 "]},"timeTravel":{"interval":100,"frames":["🕛 ","🕚 ","🕙 ","🕘 ","🕗 ","🕖 ","🕕 ","🕔 ","🕓 ","🕒 ","🕑 ","🕐 "]},"aesthetic":{"interval":80,"frames":["▰▱▱▱▱▱▱","▰▰▱▱▱▱▱","▰▰▰▱▱▱▱","▰▰▰▰▱▱▱","▰▰▰▰▰▱▱","▰▰▰▰▰▰▱","▰▰▰▰▰▰▰","▰▱▱▱▱▱▱"]},"dwarfFortress":{"interval":80,"frames":[" ██████£££  ","☺██████£££  ","☺██████£££  ","☺▓█████£££  ","☺▓█████£££  ","☺▒█████£££  ","☺▒█████£££  ","☺░█████£££  ","☺░█████£££  ","☺ █████£££  "," ☺█████£££  "," ☺█████£££  "," ☺▓████£££  "," ☺▓████£££  "," ☺▒████£££  "," ☺▒████£££  "," ☺░████£££  "," ☺░████£££  "," ☺ ████£££  ","  ☺████£££  ","  ☺████£££  ","  ☺▓███£££  ","  ☺▓███£££  ","  ☺▒███£££  ","  ☺▒███£££  ","  ☺░███£££  ","  ☺░███£££  ","  ☺ ███£££  ","   ☺███£££  ","   ☺███£££  ","   ☺▓██£££  ","   ☺▓██£££  ","   ☺▒██£££  ","   ☺▒██£££  ","   ☺░██£££  ","   ☺░██£££  ","   ☺ ██£££  ","    ☺██£££  ","    ☺██£££  ","    ☺▓█£££  ","    ☺▓█£££  ","    ☺▒█£££  ","    ☺▒█£££  ","    ☺░█£££  ","    ☺░█£££  ","    ☺ █£££  ","     ☺█£££  ","     ☺█£££  ","     ☺▓£££  ","     ☺▓£££  ","     ☺▒£££  ","     ☺▒£££  ","     ☺░£££  ","     ☺░£££  ","     ☺ £££  ","      ☺£££  ","      ☺£££  ","      ☺▓££  ","      ☺▓££  ","      ☺▒££  ","      ☺▒££  ","      ☺░££  ","      ☺░££  ","      ☺ ££  ","       ☺££  ","       ☺££  ","       ☺▓£  ","       ☺▓£  ","       ☺▒£  ","       ☺▒£  ","       ☺░£  ","       ☺░£  ","       ☺ £  ","        ☺£  ","        ☺£  ","        ☺▓  ","        ☺▓  ","        ☺▒  ","        ☺▒  ","        ☺░  ","        ☺░  ","        ☺   ","        ☺  &","        ☺ ☼&","       ☺ ☼ &","       ☺☼  &","      ☺☼  & ","      ‼   & ","     ☺   &  ","    ‼    &  ","   ☺    &   ","  ‼     &   "," ☺     &    ","‼      &    ","      &     ","      &     ","     &   ░  ","     &   ▒  ","    &    ▓  ","    &    £  ","   &    ░£  ","   &    ▒£  ","  &     ▓£  ","  &     ££  "," &     ░££  "," &     ▒££  ","&      ▓££  ","&      £££  ","      ░£££  ","      ▒£££  ","      ▓£££  ","      █£££  ","     ░█£££  ","     ▒█£££  ","     ▓█£££  ","     ██£££  ","    ░██£££  ","    ▒██£££  ","    ▓██£££  ","    ███£££  ","   ░███£££  ","   ▒███£££  ","   ▓███£££  ","   ████£££  ","  ░████£££  ","  ▒████£££  ","  ▓████£££  ","  █████£££  "," ░█████£££  "," ▒█████£££  "," ▓█████£££  "," ██████£££  "," ██████£££  "]},"fish":{"interval":80,"frames":["~~~~~~~~~~~~~~~~~~~~","> ~~~~~~~~~~~~~~~~~~","º> ~~~~~~~~~~~~~~~~~","(º> ~~~~~~~~~~~~~~~~","((º> ~~~~~~~~~~~~~~~","<((º> ~~~~~~~~~~~~~~","><((º> ~~~~~~~~~~~~~"," ><((º> ~~~~~~~~~~~~","~ ><((º> ~~~~~~~~~~~","~~ <>((º> ~~~~~~~~~~","~~~ ><((º> ~~~~~~~~~","~~~~ <>((º> ~~~~~~~~","~~~~~ ><((º> ~~~~~~~","~~~~~~ <>((º> ~~~~~~","~~~~~~~ ><((º> ~~~~~","~~~~~~~~ <>((º> ~~~~","~~~~~~~~~ ><((º> ~~~","~~~~~~~~~~ <>((º> ~~","~~~~~~~~~~~ ><((º> ~","~~~~~~~~~~~~ <>((º> ","~~~~~~~~~~~~~ ><((º>","~~~~~~~~~~~~~~ <>((º","~~~~~~~~~~~~~~~ ><((","~~~~~~~~~~~~~~~~ <>(","~~~~~~~~~~~~~~~~~ ><","~~~~~~~~~~~~~~~~~~ <","~~~~~~~~~~~~~~~~~~~~"]}}');
;// CONCATENATED MODULE: ./node_modules/cli-spinners/index.js


/* harmony default export */ const cli_spinners = (spinners_namespaceObject);

const spinnersList = Object.keys(spinners_namespaceObject);

function randomSpinner() {
	const randomIndex = Math.floor(Math.random() * spinnersList.length);
	const spinnerName = spinnersList[randomIndex];
	return spinners[spinnerName];
}

// EXTERNAL MODULE: ./node_modules/yoctocolors/base.js
var base = __webpack_require__(4632);
// EXTERNAL MODULE: ./node_modules/is-unicode-supported/index.js
var is_unicode_supported = __webpack_require__(2662);
;// CONCATENATED MODULE: ./node_modules/log-symbols/symbols.js



const _isUnicodeSupported = (0,is_unicode_supported/* default */.A)();

const info = (0,base/* blue */.z1)(_isUnicodeSupported ? 'ℹ' : 'i');
const success = (0,base/* green */.wL)(_isUnicodeSupported ? '✔' : '√');
const warning = (0,base/* yellow */.D9)(_isUnicodeSupported ? '⚠' : '‼');
const error = (0,base/* red */.wv)(_isUnicodeSupported ? '✖' : '×');

;// CONCATENATED MODULE: ./node_modules/ansi-regex/index.js
function ansiRegex({onlyFirst = false} = {}) {
	// Valid string terminator sequences are BEL, ESC\, and 0x9c
	const ST = '(?:\\u0007|\\u001B\\u005C|\\u009C)';

	// OSC sequences only: ESC ] ... ST (non-greedy until the first ST)
	const osc = `(?:\\u001B\\][\\s\\S]*?${ST})`;

	// CSI and related: ESC/C1, optional intermediates, optional params (supports ; and :) then final byte
	const csi = '[\\u001B\\u009B][[\\]()#;?]*(?:\\d{1,4}(?:[;:]\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]';

	const pattern = `${osc}|${csi}`;

	return new RegExp(pattern, onlyFirst ? undefined : 'g');
}

;// CONCATENATED MODULE: ./node_modules/strip-ansi/index.js


const regex = ansiRegex();

function stripAnsi(string) {
	if (typeof string !== 'string') {
		throw new TypeError(`Expected a \`string\`, got \`${typeof string}\``);
	}

	// Fast path: ANSI codes require ESC (7-bit) or CSI (8-bit) introducer
	if (!string.includes('\u001B') && !string.includes('\u009B')) {
		return string;
	}

	// Even though the regex is global, we don't need to reset the `.lastIndex`
	// because unlike `.exec()` and `.test()`, `.replace()` does it automatically
	// and doing it manually has a performance penalty.
	return string.replace(regex, '');
}

;// CONCATENATED MODULE: ./node_modules/get-east-asian-width/lookup-data.js
// Generated by scripts/build.js

// prettier-ignore
const ambiguousRanges = [161, 161, 164, 164, 167, 168, 170, 170, 173, 174, 176, 180, 182, 186, 188, 191, 198, 198, 208, 208, 215, 216, 222, 225, 230, 230, 232, 234, 236, 237, 240, 240, 242, 243, 247, 250, 252, 252, 254, 254, 257, 257, 273, 273, 275, 275, 283, 283, 294, 295, 299, 299, 305, 307, 312, 312, 319, 322, 324, 324, 328, 331, 333, 333, 338, 339, 358, 359, 363, 363, 462, 462, 464, 464, 466, 466, 468, 468, 470, 470, 472, 472, 474, 474, 476, 476, 593, 593, 609, 609, 708, 708, 711, 711, 713, 715, 717, 717, 720, 720, 728, 731, 733, 733, 735, 735, 768, 879, 913, 929, 931, 937, 945, 961, 963, 969, 1025, 1025, 1040, 1103, 1105, 1105, 8208, 8208, 8211, 8214, 8216, 8217, 8220, 8221, 8224, 8226, 8228, 8231, 8240, 8240, 8242, 8243, 8245, 8245, 8251, 8251, 8254, 8254, 8308, 8308, 8319, 8319, 8321, 8324, 8364, 8364, 8451, 8451, 8453, 8453, 8457, 8457, 8467, 8467, 8470, 8470, 8481, 8482, 8486, 8486, 8491, 8491, 8531, 8532, 8539, 8542, 8544, 8555, 8560, 8569, 8585, 8585, 8592, 8601, 8632, 8633, 8658, 8658, 8660, 8660, 8679, 8679, 8704, 8704, 8706, 8707, 8711, 8712, 8715, 8715, 8719, 8719, 8721, 8721, 8725, 8725, 8730, 8730, 8733, 8736, 8739, 8739, 8741, 8741, 8743, 8748, 8750, 8750, 8756, 8759, 8764, 8765, 8776, 8776, 8780, 8780, 8786, 8786, 8800, 8801, 8804, 8807, 8810, 8811, 8814, 8815, 8834, 8835, 8838, 8839, 8853, 8853, 8857, 8857, 8869, 8869, 8895, 8895, 8978, 8978, 9312, 9449, 9451, 9547, 9552, 9587, 9600, 9615, 9618, 9621, 9632, 9633, 9635, 9641, 9650, 9651, 9654, 9655, 9660, 9661, 9664, 9665, 9670, 9672, 9675, 9675, 9678, 9681, 9698, 9701, 9711, 9711, 9733, 9734, 9737, 9737, 9742, 9743, 9756, 9756, 9758, 9758, 9792, 9792, 9794, 9794, 9824, 9825, 9827, 9829, 9831, 9834, 9836, 9837, 9839, 9839, 9886, 9887, 9919, 9919, 9926, 9933, 9935, 9939, 9941, 9953, 9955, 9955, 9960, 9961, 9963, 9969, 9972, 9972, 9974, 9977, 9979, 9980, 9982, 9983, 10045, 10045, 10102, 10111, 11094, 11097, 12872, 12879, 57344, 63743, 65024, 65039, 65533, 65533, 127232, 127242, 127248, 127277, 127280, 127337, 127344, 127373, 127375, 127376, 127387, 127404, 917760, 917999, 983040, 1048573, 1048576, 1114109];

// prettier-ignore
const fullwidthRanges = [12288, 12288, 65281, 65376, 65504, 65510];

// prettier-ignore
const lookup_data_halfwidthRanges = [8361, 8361, 65377, 65470, 65474, 65479, 65482, 65487, 65490, 65495, 65498, 65500, 65512, 65518];

// prettier-ignore
const lookup_data_narrowRanges = [32, 126, 162, 163, 165, 166, 172, 172, 175, 175, 10214, 10221, 10629, 10630];

// prettier-ignore
const wideRanges = [4352, 4447, 8986, 8987, 9001, 9002, 9193, 9196, 9200, 9200, 9203, 9203, 9725, 9726, 9748, 9749, 9776, 9783, 9800, 9811, 9855, 9855, 9866, 9871, 9875, 9875, 9889, 9889, 9898, 9899, 9917, 9918, 9924, 9925, 9934, 9934, 9940, 9940, 9962, 9962, 9970, 9971, 9973, 9973, 9978, 9978, 9981, 9981, 9989, 9989, 9994, 9995, 10024, 10024, 10060, 10060, 10062, 10062, 10067, 10069, 10071, 10071, 10133, 10135, 10160, 10160, 10175, 10175, 11035, 11036, 11088, 11088, 11093, 11093, 11904, 11929, 11931, 12019, 12032, 12245, 12272, 12287, 12289, 12350, 12353, 12438, 12441, 12543, 12549, 12591, 12593, 12686, 12688, 12773, 12783, 12830, 12832, 12871, 12880, 42124, 42128, 42182, 43360, 43388, 44032, 55203, 63744, 64255, 65040, 65049, 65072, 65106, 65108, 65126, 65128, 65131, 94176, 94180, 94192, 94198, 94208, 101589, 101631, 101662, 101760, 101874, 110576, 110579, 110581, 110587, 110589, 110590, 110592, 110882, 110898, 110898, 110928, 110930, 110933, 110933, 110948, 110951, 110960, 111355, 119552, 119638, 119648, 119670, 126980, 126980, 127183, 127183, 127374, 127374, 127377, 127386, 127488, 127490, 127504, 127547, 127552, 127560, 127568, 127569, 127584, 127589, 127744, 127776, 127789, 127797, 127799, 127868, 127870, 127891, 127904, 127946, 127951, 127955, 127968, 127984, 127988, 127988, 127992, 128062, 128064, 128064, 128066, 128252, 128255, 128317, 128331, 128334, 128336, 128359, 128378, 128378, 128405, 128406, 128420, 128420, 128507, 128591, 128640, 128709, 128716, 128716, 128720, 128722, 128725, 128728, 128732, 128735, 128747, 128748, 128756, 128764, 128992, 129003, 129008, 129008, 129292, 129338, 129340, 129349, 129351, 129535, 129648, 129660, 129664, 129674, 129678, 129734, 129736, 129736, 129741, 129756, 129759, 129770, 129775, 129784, 131072, 196605, 196608, 262141];



;// CONCATENATED MODULE: ./node_modules/get-east-asian-width/utilities.js
/**
Binary search on a sorted flat array of [start, end] pairs.

@param {number[]} ranges - Flat array of inclusive [start, end] range pairs, e.g. [0, 5, 10, 20].
@param {number} codePoint - The value to search for.
@returns {boolean} Whether the value falls within any of the ranges.
*/
const utilities_isInRange = (ranges, codePoint) => {
	let low = 0;
	let high = Math.floor(ranges.length / 2) - 1;
	while (low <= high) {
		const mid = Math.floor((low + high) / 2);
		const i = mid * 2;
		if (codePoint < ranges[i]) {
			high = mid - 1;
		} else if (codePoint > ranges[i + 1]) {
			low = mid + 1;
		} else {
			return true;
		}
	}

	return false;
};

;// CONCATENATED MODULE: ./node_modules/get-east-asian-width/lookup.js



const minimumAmbiguousCodePoint = ambiguousRanges[0];
const maximumAmbiguousCodePoint = ambiguousRanges.at(-1);
const minimumFullWidthCodePoint = fullwidthRanges[0];
const maximumFullWidthCodePoint = fullwidthRanges.at(-1);
const minimumHalfWidthCodePoint = lookup_data_halfwidthRanges[0];
const maximumHalfWidthCodePoint = lookup_data_halfwidthRanges.at(-1);
const minimumNarrowCodePoint = lookup_data_narrowRanges[0];
const maximumNarrowCodePoint = lookup_data_narrowRanges.at(-1);
const minimumWideCodePoint = wideRanges[0];
const maximumWideCodePoint = wideRanges.at(-1);

const commonCjkCodePoint = 0x4E_00;
const [wideFastPathStart, wideFastPathEnd] = findWideFastPathRange(wideRanges);

// Use a hot-path range so common `isWide` calls can skip binary search.
// The range containing U+4E00 covers common CJK ideographs;
// fallback to the largest range for resilience to Unicode table changes.
function findWideFastPathRange(ranges) {
	let fastPathStart = ranges[0];
	let fastPathEnd = ranges[1];

	for (let index = 0; index < ranges.length; index += 2) {
		const start = ranges[index];
		const end = ranges[index + 1];

		if (
			commonCjkCodePoint >= start
			&& commonCjkCodePoint <= end
		) {
			return [start, end];
		}

		if ((end - start) > (fastPathEnd - fastPathStart)) {
			fastPathStart = start;
			fastPathEnd = end;
		}
	}

	return [fastPathStart, fastPathEnd];
}

const isAmbiguous = codePoint => {
	if (
		codePoint < minimumAmbiguousCodePoint
		|| codePoint > maximumAmbiguousCodePoint
	) {
		return false;
	}

	return utilities_isInRange(ambiguousRanges, codePoint);
};

const isFullWidth = codePoint => {
	if (
		codePoint < minimumFullWidthCodePoint
		|| codePoint > maximumFullWidthCodePoint
	) {
		return false;
	}

	return utilities_isInRange(fullwidthRanges, codePoint);
};

const isHalfWidth = codePoint => {
	if (
		codePoint < minimumHalfWidthCodePoint
		|| codePoint > maximumHalfWidthCodePoint
	) {
		return false;
	}

	return isInRange(halfwidthRanges, codePoint);
};

const isNarrow = codePoint => {
	if (
		codePoint < minimumNarrowCodePoint
		|| codePoint > maximumNarrowCodePoint
	) {
		return false;
	}

	return isInRange(narrowRanges, codePoint);
};

const isWide = codePoint => {
	if (
		codePoint >= wideFastPathStart
		&& codePoint <= wideFastPathEnd
	) {
		return true;
	}

	if (
		codePoint < minimumWideCodePoint
		|| codePoint > maximumWideCodePoint
	) {
		return false;
	}

	return utilities_isInRange(wideRanges, codePoint);
};

function lookup_getCategory(codePoint) {
	if (isAmbiguous(codePoint)) {
		return 'ambiguous';
	}

	if (isFullWidth(codePoint)) {
		return 'fullwidth';
	}

	if (isHalfWidth(codePoint)) {
		return 'halfwidth';
	}

	if (isNarrow(codePoint)) {
		return 'narrow';
	}

	if (isWide(codePoint)) {
		return 'wide';
	}

	return 'neutral';
}

;// CONCATENATED MODULE: ./node_modules/get-east-asian-width/index.js


function validate(codePoint) {
	if (!Number.isSafeInteger(codePoint)) {
		throw new TypeError(`Expected a code point, got \`${typeof codePoint}\`.`);
	}
}

function eastAsianWidthType(codePoint) {
	validate(codePoint);

	return getCategory(codePoint);
}

function eastAsianWidth(codePoint, {ambiguousAsWide = false} = {}) {
	validate(codePoint);

	if (
		isFullWidth(codePoint)
		|| isWide(codePoint)
		|| (ambiguousAsWide && isAmbiguous(codePoint))
	) {
		return 2;
	}

	return 1;
}

// Private exports for https://github.com/sindresorhus/is-fullwidth-code-point


;// CONCATENATED MODULE: ./node_modules/string-width/index.js



/**
Logic:
- Segment graphemes to match how terminals render clusters.
- Width rules:
	1. Skip non-printing clusters (Default_Ignorable, Control, pure Mark, lone Surrogates). Tabs are ignored by design.
	2. RGI emoji clusters (\p{RGI_Emoji}) are double-width.
	3. Minimally-qualified/unqualified emoji clusters (ZWJ sequences with 2+ Extended_Pictographic, or keycap sequences) are double-width.
	4. Hangul jamo collapse each standard modern Hangul L+V or L+V+T syllable piece to width 2.
	   Unmatched repeated leading/vowel/trailing jamo stay additive because that matches how the terminals we target render them.
	5. Otherwise use East Asian Width of the cluster's first visible code point, and add widths for trailing Halfwidth/Fullwidth Forms within the same cluster (e.g., dakuten/handakuten/prolonged sound mark).
*/

const segmenter = new Intl.Segmenter();

// Whole-cluster zero-width
const zeroWidthClusterRegex = /^(?:\p{Default_Ignorable_Code_Point}|\p{Control}|\p{Format}|\p{Mark}|\p{Surrogate})+$/v;

// Pick the base scalar if the cluster starts with Prepend/Format/Marks
const leadingNonPrintingRegex = /^[\p{Default_Ignorable_Code_Point}\p{Control}\p{Format}\p{Mark}\p{Surrogate}]+/v;

// RGI emoji sequences
const rgiEmojiRegex = /^\p{RGI_Emoji}$/v;

// Detect minimally-qualified/unqualified emoji sequences (missing VS16 but still render as double-width)
const unqualifiedKeycapRegex = /^[\d#*]\u20E3$/;
const extendedPictographicRegex = /\p{Extended_Pictographic}/gu;

function isDoubleWidthNonRgiEmojiSequence(segment) {
	// Real emoji clusters are < 30 chars; guard against pathological input
	if (segment.length > 50) {
		return false;
	}

	if (unqualifiedKeycapRegex.test(segment)) {
		return true;
	}

	// ZWJ sequences with 2+ Extended_Pictographic
	if (segment.includes('\u200D')) {
		const pictographics = segment.match(extendedPictographicRegex);
		return pictographics !== null && pictographics.length >= 2;
	}

	return false;
}

function baseVisible(segment) {
	return segment.replace(leadingNonPrintingRegex, '');
}

function isZeroWidthCluster(segment) {
	return zeroWidthClusterRegex.test(segment);
}

function isHangulLeadingJamo(codePoint) {
	return (codePoint >= 0x11_00 && codePoint <= 0x11_5F)
		|| (codePoint >= 0xA9_60 && codePoint <= 0xA9_7C);
}

function isHangulVowelJamo(codePoint) {
	return (codePoint >= 0x11_60 && codePoint <= 0x11_A7)
		|| (codePoint >= 0xD7_B0 && codePoint <= 0xD7_C6);
}

function isHangulTrailingJamo(codePoint) {
	return (codePoint >= 0x11_A8 && codePoint <= 0x11_FF)
		|| (codePoint >= 0xD7_CB && codePoint <= 0xD7_FB);
}

function isHangulJamo(codePoint) {
	return isHangulLeadingJamo(codePoint)
		|| isHangulVowelJamo(codePoint)
		|| isHangulTrailingJamo(codePoint);
}

function hangulClusterWidth(visibleSegment, eastAsianWidthOptions) {
	const codePoints = [];

	for (const character of visibleSegment) {
		if (zeroWidthClusterRegex.test(character)) {
			continue;
		}

		codePoints.push(character.codePointAt(0));
	}

	if (codePoints.length === 0) {
		return undefined;
	}

	let width = 0;

	for (let index = 0; index < codePoints.length; index++) {
		const codePoint = codePoints[index];
		if (!isHangulJamo(codePoint)) {
			if (width === 0) {
				return undefined;
			}

			// Mixed cluster (e.g., L + precomposed syllable): use EAW for non-jamo remainder
			for (let remaining = index; remaining < codePoints.length; remaining++) {
				width += eastAsianWidth(codePoints[remaining], eastAsianWidthOptions);
			}

			return width;
		}

		// Modern Hangul L+V(+T) shapes as one syllable block. Unmatched jamo stay additive:
		// U+1100 U+1100 U+1161 => U+1100 + (U+1100 U+1161) => 2 + 2.
		if (
			isHangulLeadingJamo(codePoint)
			&& isHangulVowelJamo(codePoints[index + 1])
		) {
			width += 2;
			index += isHangulTrailingJamo(codePoints[index + 2]) ? 2 : 1;
			continue;
		}

		width += eastAsianWidth(codePoint, eastAsianWidthOptions);
	}

	return width;
}

function trailingHalfwidthWidth(visibleSegment, eastAsianWidthOptions) {
	let extra = 0;
	let first = true;

	for (const character of visibleSegment) {
		if (first) {
			first = false;
			continue;
		}

		if (character >= '\uFF00' && character <= '\uFFEF') {
			extra += eastAsianWidth(character.codePointAt(0), eastAsianWidthOptions);
		}
	}

	return extra;
}

function stringWidth(input, options = {}) {
	if (typeof input !== 'string' || input.length === 0) {
		return 0;
	}

	const {
		ambiguousIsNarrow = true,
		countAnsiEscapeCodes = false,
	} = options;

	let string = input;

	// Avoid calling stripAnsi when there are no ANSI escape sequences (ESC = 0x1B, CSI = 0x9B)
	if (!countAnsiEscapeCodes && (string.includes('\u001B') || string.includes('\u009B'))) {
		string = stripAnsi(string);
	}

	if (string.length === 0) {
		return 0;
	}

	// Fast path: printable ASCII (0x20–0x7E) needs no segmenter, regex, or EAW lookup — width equals length.
	if (/^[\u0020-\u007E]*$/.test(string)) {
		return string.length;
	}

	let width = 0;
	const eastAsianWidthOptions = {ambiguousAsWide: !ambiguousIsNarrow};

	for (const {segment} of segmenter.segment(string)) {
		// Zero-width / non-printing clusters
		if (isZeroWidthCluster(segment)) {
			continue;
		}

		// Emoji width logic
		if (rgiEmojiRegex.test(segment) || isDoubleWidthNonRgiEmojiSequence(segment)) {
			width += 2;
			continue;
		}

		const visibleSegment = baseVisible(segment);
		const hangulWidth = hangulClusterWidth(visibleSegment, eastAsianWidthOptions);
		if (hangulWidth !== undefined) {
			width += hangulWidth;
			continue;
		}

		// Everything else: EAW of the cluster’s first visible scalar
		const codePoint = visibleSegment.codePointAt(0);
		width += eastAsianWidth(codePoint, eastAsianWidthOptions);

		// Add width for trailing Halfwidth and Fullwidth Forms (e.g., ﾞ, ﾟ, ｰ)
		width += trailingHalfwidthWidth(visibleSegment, eastAsianWidthOptions);
	}

	return width;
}

;// CONCATENATED MODULE: ./node_modules/is-interactive/index.js
function isInteractive({stream = process.stdout} = {}) {
	return Boolean(
		stream && stream.isTTY &&
		process.env.TERM !== 'dumb' &&
		!('CI' in process.env)
	);
}

;// CONCATENATED MODULE: ./node_modules/stdin-discarder/index.js


const ASCII_ETX_CODE = 0x03; // Ctrl+C

class StdinDiscarder {
	#activeCount = 0;
	#stdin;
	#stdinWasPaused = false;
	#stdinWasRaw = false;
	#handleInputBound = chunk => {
		if (!chunk?.length) {
			return;
		}

		const code = typeof chunk === 'string' ? chunk.codePointAt(0) : chunk[0];
		if (code === ASCII_ETX_CODE) {
			// Always re-signal the process. Emitting `SIGINT` directly breaks normal Ctrl+C termination when libraries install listeners for cleanup.
			external_node_process_.kill(external_node_process_.pid, 'SIGINT');
		}
	};

	start() {
		this.#activeCount++;
		if (this.#activeCount === 1) {
			this.#realStart();
		}
	}

	stop() {
		if (this.#activeCount === 0) {
			return;
		}

		if (--this.#activeCount === 0) {
			this.#realStop();
		}
	}

	#realStart() {
		const {stdin} = external_node_process_;

		if (external_node_process_.platform === 'win32' || !stdin?.isTTY || typeof stdin.setRawMode !== 'function') {
			this.#stdin = undefined;
			return;
		}

		this.#stdin = stdin;
		this.#stdinWasPaused = stdin.isPaused();
		this.#stdinWasRaw = Boolean(stdin.isRaw);

		stdin.setRawMode(true);
		stdin.prependListener('data', this.#handleInputBound);

		if (this.#stdinWasPaused) {
			stdin.resume();
		}
	}

	#realStop() {
		if (!this.#stdin) {
			return;
		}

		const stdin = this.#stdin;

		stdin.off('data', this.#handleInputBound);

		if (stdin.isTTY) {
			stdin.setRawMode?.(this.#stdinWasRaw);
		}

		if (this.#stdinWasPaused) {
			stdin.pause();
		}

		this.#stdin = undefined;
		this.#stdinWasPaused = false;
		this.#stdinWasRaw = false;
	}
}

const stdinDiscarder = new StdinDiscarder();

/* harmony default export */ const stdin_discarder = (Object.freeze(stdinDiscarder));

;// CONCATENATED MODULE: ./node_modules/ora/index.js











// Constants
const RENDER_DEFERRAL_TIMEOUT = 200; // Milliseconds to wait before re-rendering after partial chunk write
const SYNCHRONIZED_OUTPUT_ENABLE = '\u001B[?2026h';
const SYNCHRONIZED_OUTPUT_DISABLE = '\u001B[?2026l';

// Global state for concurrent spinner detection
const activeHooksPerStream = new Map(); // Stream → ora instance

const validColors = new Set(['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white', 'gray']);

class Ora {
	#linesToClear = 0;
	#frameIndex = -1;
	#lastFrameTime = 0;
	#options;
	#spinner;
	#stream;
	#id;
	#hookedStreams = new Map();
	#isInternalWrite = false;
	#drainHandler;
	#deferRenderTimer;
	#isDiscardingStdin = false;
	#color;

	// Helper to execute writes while preventing hook recursion
	#internalWrite(fn) {
		this.#isInternalWrite = true;
		try {
			return fn();
		} finally {
			this.#isInternalWrite = false;
		}
	}

	// Helper to render if still spinning
	#tryRender() {
		if (this.isSpinning) {
			this.render();
		}
	}

	#stringifyChunk(chunk, encoding) {
		if (chunk === undefined || chunk === null) {
			return '';
		}

		if (typeof chunk === 'string') {
			return chunk;
		}

		/* eslint-disable n/prefer-global/buffer */
		if (Buffer.isBuffer(chunk) || ArrayBuffer.isView(chunk)) {
			const normalizedEncoding = (typeof encoding === 'string' && encoding && encoding !== 'buffer') ? encoding : 'utf8';
			return Buffer.from(chunk).toString(normalizedEncoding);
		}
		/* eslint-enable n/prefer-global/buffer */

		return String(chunk);
	}

	#chunkTerminatesLine(chunkString) {
		if (!chunkString) {
			return false;
		}

		const lastCharacter = chunkString.at(-1);
		return lastCharacter === '\n' || lastCharacter === '\r';
	}

	#scheduleRenderDeferral() {
		// If already deferred, don't reset timer - let it complete
		if (this.#deferRenderTimer) {
			return;
		}

		this.#deferRenderTimer = setTimeout(() => {
			this.#deferRenderTimer = undefined;

			if (this.isSpinning) {
				this.#tryRender();
			}
		}, RENDER_DEFERRAL_TIMEOUT);

		if (typeof this.#deferRenderTimer?.unref === 'function') {
			this.#deferRenderTimer.unref();
		}
	}

	#clearRenderDeferral() {
		if (this.#deferRenderTimer) {
			clearTimeout(this.#deferRenderTimer);
			this.#deferRenderTimer = undefined;
		}
	}

	// Helper to build complete line with symbol, text, prefix, and suffix
	#buildOutputLine(symbol, text, prefixText, suffixText) {
		const fullPrefixText = this.#getFullPrefixText(prefixText, ' ');
		const separatorText = symbol ? ' ' : '';
		const fullText = (typeof text === 'string') ? separatorText + text : '';
		const fullSuffixText = this.#getFullSuffixText(suffixText, ' ');
		return fullPrefixText + symbol + fullText + fullSuffixText;
	}

	constructor(options) {
		if (typeof options === 'string') {
			options = {
				text: options,
			};
		}

		this.#options = {
			color: 'cyan',
			stream: external_node_process_.stderr,
			discardStdin: true,
			hideCursor: true,
			...options,
		};

		// Public
		this.color = this.#options.color;

		this.#stream = this.#options.stream;

		// Normalize isEnabled and isSilent into options
		if (typeof this.#options.isEnabled !== 'boolean') {
			this.#options.isEnabled = isInteractive({stream: this.#stream});
		}

		if (typeof this.#options.isSilent !== 'boolean') {
			this.#options.isSilent = false;
		}

		if (this.#options.interval !== undefined && !(Number.isInteger(this.#options.interval) && this.#options.interval > 0)) {
			throw new Error('The `interval` option must be a positive integer');
		}

		// Set *after* `this.#stream`.
		// Store original interval before spinner setter clears it
		const userInterval = this.#options.interval;
		// It's important that these use the public setters.
		this.spinner = this.#options.spinner;
		this.#options.interval = userInterval;
		this.text = this.#options.text;
		this.prefixText = this.#options.prefixText;
		this.suffixText = this.#options.suffixText;
		this.indent = this.#options.indent;

		if (external_node_process_.env.NODE_ENV === 'test') {
			this._stream = this.#stream;
			this._isEnabled = this.#options.isEnabled;

			Object.defineProperty(this, '_linesToClear', {
				get() {
					return this.#linesToClear;
				},
				set(newValue) {
					this.#linesToClear = newValue;
				},
			});

			Object.defineProperty(this, '_frameIndex', {
				get() {
					return this.#frameIndex;
				},
			});

			Object.defineProperty(this, '_lineCount', {
				get() {
					const columns = this.#stream.columns ?? 80;
					const prefixText = typeof this.#options.prefixText === 'function' ? '' : this.#options.prefixText;
					const suffixText = typeof this.#options.suffixText === 'function' ? '' : this.#options.suffixText;
					const fullPrefixText = (typeof prefixText === 'string' && prefixText !== '') ? prefixText + ' ' : '';
					const fullSuffixText = (typeof suffixText === 'string' && suffixText !== '') ? ' ' + suffixText : '';
					const spinnerChar = '-';
					const fullText = ' '.repeat(this.#options.indent) + fullPrefixText + spinnerChar + (typeof this.#options.text === 'string' ? ' ' + this.#options.text : '') + fullSuffixText;
					return this.#computeLineCountFrom(fullText, columns);
				},
			});
		}
	}

	get indent() {
		return this.#options.indent;
	}

	set indent(indent = 0) {
		if (!(indent >= 0 && Number.isInteger(indent))) {
			throw new Error('The `indent` option must be an integer from 0 and up');
		}

		this.#options.indent = indent;
	}

	get interval() {
		return this.#options.interval ?? this.#spinner.interval ?? 100;
	}

	get spinner() {
		return this.#spinner;
	}

	set spinner(spinner) {
		this.#frameIndex = -1;
		this.#options.interval = undefined;

		if (typeof spinner === 'object') {
			if (!Array.isArray(spinner.frames) || spinner.frames.length === 0 || spinner.frames.some(frame => typeof frame !== 'string')) {
				throw new Error('The given spinner must have a non-empty `frames` array of strings');
			}

			if (spinner.interval !== undefined && !(Number.isInteger(spinner.interval) && spinner.interval > 0)) {
				throw new Error('`spinner.interval` must be a positive integer if provided');
			}

			this.#spinner = spinner;
		} else if (!(0,is_unicode_supported/* default */.A)()) {
			this.#spinner = cli_spinners.line;
		} else if (spinner === undefined) {
			// Set default spinner
			this.#spinner = cli_spinners.dots;
		} else if (spinner !== 'default' && cli_spinners[spinner]) {
			this.#spinner = cli_spinners[spinner];
		} else {
			throw new Error(`There is no built-in spinner named '${spinner}'. See https://github.com/sindresorhus/cli-spinners/blob/main/spinners.json for a full list.`);
		}
	}

	get text() {
		return this.#options.text;
	}

	set text(value = '') {
		this.#options.text = value;
	}

	get prefixText() {
		return this.#options.prefixText;
	}

	set prefixText(value = '') {
		this.#options.prefixText = value;
	}

	get suffixText() {
		return this.#options.suffixText;
	}

	set suffixText(value = '') {
		this.#options.suffixText = value;
	}

	get isSpinning() {
		return this.#id !== undefined;
	}

	#formatAffix(value, separator, placeBefore = false) {
		const resolved = typeof value === 'function' ? value() : value;
		if (typeof resolved === 'string' && resolved !== '') {
			return placeBefore ? (separator + resolved) : (resolved + separator);
		}

		return '';
	}

	#getFullPrefixText(prefixText = this.#options.prefixText, postfix = ' ') {
		return this.#formatAffix(prefixText, postfix, false);
	}

	#getFullSuffixText(suffixText = this.#options.suffixText, prefix = ' ') {
		return this.#formatAffix(suffixText, prefix, true);
	}

	#computeLineCountFrom(text, columns) {
		let count = 0;
		for (const line of (0,external_node_util_.stripVTControlCharacters)(text).split('\n')) {
			count += Math.max(1, Math.ceil(stringWidth(line) / columns));
		}

		return count;
	}

	get color() {
		return this.#color;
	}

	set color(value) {
		if (value !== undefined && value !== false && !validColors.has(value)) {
			throw new Error('The `color` option must be a valid color or `false` to disable');
		}

		this.#color = value;
	}

	get isEnabled() {
		return this.#options.isEnabled && !this.#options.isSilent;
	}

	set isEnabled(value) {
		if (typeof value !== 'boolean') {
			throw new TypeError('The `isEnabled` option must be a boolean');
		}

		this.#options.isEnabled = value;
	}

	get isSilent() {
		return this.#options.isSilent;
	}

	set isSilent(value) {
		if (typeof value !== 'boolean') {
			throw new TypeError('The `isSilent` option must be a boolean');
		}

		this.#options.isSilent = value;
	}

	frame() {
		// Only advance frame if enough time has passed (throttle to interval)
		const now = Date.now();
		if (this.#frameIndex === -1 || now - this.#lastFrameTime >= this.interval) {
			this.#frameIndex = (this.#frameIndex + 1) % this.#spinner.frames.length;
			this.#lastFrameTime = now;
		}

		const {frames} = this.#spinner;
		let frame = frames[this.#frameIndex];

		if (this.#color) {
			frame = source[this.#color](frame);
		}

		const fullPrefixText = this.#getFullPrefixText(this.#options.prefixText, ' ');
		const fullText = typeof this.text === 'string' ? ' ' + this.text : '';
		const fullSuffixText = this.#getFullSuffixText(this.#options.suffixText, ' ');

		return fullPrefixText + frame + fullText + fullSuffixText;
	}

	clear() {
		if (!this.isEnabled || !this.#stream.isTTY) {
			return this;
		}

		// Protect cursor control methods (cursorTo, moveCursor, clearLine) which internally call stream.write
		this.#internalWrite(() => {
			this.#stream.cursorTo(0);

			for (let index = 0; index < this.#linesToClear; index++) {
				if (index > 0) {
					this.#stream.moveCursor(0, -1);
				}

				this.#stream.clearLine(1);
			}

			if (this.#options.indent) {
				this.#stream.cursorTo(this.#options.indent);
			}
		});

		this.#linesToClear = 0;

		return this;
	}

	// Helper to hook a single stream
	#hookStream(stream) {
		if (!stream || this.#hookedStreams.has(stream) || !stream.isTTY || typeof stream.write !== 'function') {
			return;
		}

		// Detect concurrent spinners
		if (activeHooksPerStream.has(stream)) {
			console.warn('[ora] Multiple concurrent spinners detected. This may cause visual corruption. Use one spinner at a time.');
		}

		const originalWrite = stream.write;
		this.#hookedStreams.set(stream, originalWrite);
		activeHooksPerStream.set(stream, this);
		stream.write = (chunk, encoding, callback) => this.#hookedWrite(stream, originalWrite, chunk, encoding, callback);
	}

	/**
	Intercept stream writes while spinner is active to handle external writes cleanly without visual corruption.
	Hooks process stdio streams and the active spinner stream so console.log(), console.error(), and direct writes stay tidy.
	*/
	#installHook() {
		if (!this.isEnabled || this.#hookedStreams.size > 0) {
			return;
		}

		const streamsToHook = new Set([this.#stream, external_node_process_.stdout, external_node_process_.stderr]);

		for (const stream of streamsToHook) {
			this.#hookStream(stream);
		}
	}

	#uninstallHook() {
		for (const [stream, originalWrite] of this.#hookedStreams) {
			stream.write = originalWrite;
			if (activeHooksPerStream.get(stream) === this) {
				activeHooksPerStream.delete(stream);
			}
		}

		this.#hookedStreams.clear();
	}

	// eslint-disable-next-line max-params -- Need stream and originalWrite for multi-stream support
	#hookedWrite(stream, originalWrite, chunk, encoding, callback) {
		// Handle both write(chunk, encoding, callback) and write(chunk, callback) signatures
		if (typeof encoding === 'function') {
			callback = encoding;
			encoding = undefined;
		}

		// Pass through our own internal writes (spinner rendering, cursor control)
		if (this.#isInternalWrite) {
			return originalWrite.call(stream, chunk, encoding, callback);
		}

		// External write detected - clear spinner, write content, re-render if appropriate
		this.clear();

		const chunkString = this.#stringifyChunk(chunk, encoding);
		const chunkTerminatesLine = this.#chunkTerminatesLine(chunkString);

		const writeResult = originalWrite.call(stream, chunk, encoding, callback);

		// Schedule or clear render deferral based on chunk content
		if (chunkTerminatesLine) {
			this.#clearRenderDeferral();
		} else if (chunkString.length > 0) {
			this.#scheduleRenderDeferral();
		}

		// Re-render spinner below the new output if still spinning and not deferred
		if (this.isSpinning && !this.#deferRenderTimer) {
			this.render();
		}

		return writeResult;
	}

	render() {
		if (!this.isEnabled || this.#drainHandler || this.#deferRenderTimer) {
			return this;
		}

		const useSynchronizedOutput = this.#stream.isTTY;
		let shouldDisableSynchronizedOutput = false;

		try {
			if (useSynchronizedOutput) {
				this.#internalWrite(() => this.#stream.write(SYNCHRONIZED_OUTPUT_ENABLE));
				shouldDisableSynchronizedOutput = true;
			}

			this.clear();

			let frameContent = this.frame();
			const columns = this.#stream.columns ?? 80;
			const actualLineCount = this.#computeLineCountFrom(frameContent, columns);

			// If content would exceed viewport height, truncate it to prevent garbage
			const consoleHeight = this.#stream.rows;
			if (consoleHeight && consoleHeight > 1 && actualLineCount > consoleHeight) {
				const lines = frameContent.split('\n');
				const maxLines = consoleHeight - 1; // Reserve one line for truncation message
				frameContent = [...lines.slice(0, maxLines), '... (content truncated to fit terminal)'].join('\n');
			}

			const canContinue = this.#internalWrite(() => this.#stream.write(frameContent));

			// Handle backpressure - pause rendering if stream buffer is full
			if (canContinue === false && this.#stream.isTTY) {
				this.#drainHandler = () => {
					this.#drainHandler = undefined;
					this.#tryRender();
				};

				this.#stream.once('drain', this.#drainHandler);
			}

			this.#linesToClear = this.#computeLineCountFrom(frameContent, columns);
		} finally {
			if (shouldDisableSynchronizedOutput) {
				this.#internalWrite(() => this.#stream.write(SYNCHRONIZED_OUTPUT_DISABLE));
			}
		}

		return this;
	}

	start(text) {
		if (text) {
			this.text = text;
		}

		if (this.isSilent) {
			return this;
		}

		if (!this.isEnabled) {
			const symbol = this.text ? '-' : '';
			const line = ' '.repeat(this.#options.indent) + this.#buildOutputLine(symbol, this.text, this.#options.prefixText, this.#options.suffixText);

			if (line.trim() !== '') {
				this.#internalWrite(() => this.#stream.write(line + '\n'));
			}

			return this;
		}

		if (this.isSpinning) {
			return this;
		}

		if (this.#options.hideCursor) {
			cli_cursor.hide(this.#stream);
		}

		if (this.#options.discardStdin && external_node_process_.stdin.isTTY) {
			stdin_discarder.start();
			this.#isDiscardingStdin = true;
		}

		this.#installHook();
		this.render();
		this.#id = setInterval(this.render.bind(this), this.interval);

		return this;
	}

	stop() {
		clearInterval(this.#id);
		this.#id = undefined;
		this.#frameIndex = -1;
		this.#lastFrameTime = 0;

		this.#clearRenderDeferral();
		this.#uninstallHook();

		// Clean up drain handler if it exists
		if (this.#drainHandler) {
			this.#stream.removeListener('drain', this.#drainHandler);
			this.#drainHandler = undefined;
		}

		if (this.isEnabled) {
			this.clear();
			if (this.#options.hideCursor) {
				cli_cursor.show(this.#stream);
			}
		}

		if (this.#isDiscardingStdin) {
			this.#isDiscardingStdin = false;
			stdin_discarder.stop();
		}

		return this;
	}

	succeed(text) {
		return this.stopAndPersist({symbol: success, text});
	}

	fail(text) {
		return this.stopAndPersist({symbol: error, text});
	}

	warn(text) {
		return this.stopAndPersist({symbol: warning, text});
	}

	info(text) {
		return this.stopAndPersist({symbol: info, text});
	}

	stopAndPersist(options = {}) {
		if (this.isSilent) {
			return this;
		}

		const symbol = options.symbol ?? ' ';
		const text = options.text ?? this.text;
		const prefixText = options.prefixText ?? this.#options.prefixText;
		const suffixText = options.suffixText ?? this.#options.suffixText;

		const textToWrite = this.#buildOutputLine(symbol, text, prefixText, suffixText) + '\n';

		this.stop();
		this.#internalWrite(() => this.#stream.write(textToWrite));

		return this;
	}
}

function ora(options) {
	return new Ora(options);
}

async function oraPromise(action, options) {
	const actionIsFunction = typeof action === 'function';
	const actionIsPromise = typeof action.then === 'function';

	if (!actionIsFunction && !actionIsPromise) {
		throw new TypeError('Parameter `action` must be a Function or a Promise');
	}

	const {
		successText,
		failText,
		successSymbol,
		failSymbol,
	} = typeof options === 'object'
		? options
		: {};

	const spinner = ora(options).start();

	try {
		const promise = actionIsFunction ? action(spinner) : action;
		const result = await promise;

		const text = successText === undefined
			? undefined
			: (typeof successText === 'string' ? successText : successText(result));

		if (successSymbol === undefined) {
			spinner.succeed(text);
		} else {
			spinner.stopAndPersist({symbol: successSymbol, text});
		}

		return result;
	} catch (error) {
		const text = failText === undefined
			? undefined
			: (typeof failText === 'string' ? failText : failText(error));

		if (failSymbol === undefined) {
			spinner.fail(text);
		} else {
			spinner.stopAndPersist({symbol: failSymbol, text});
		}

		throw error;
	}
}




/***/ }),

/***/ 4632:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   $z: () => (/* binding */ yellowBright),
/* harmony export */   Cr: () => (/* binding */ bold),
/* harmony export */   D9: () => (/* binding */ yellow),
/* harmony export */   GS: () => (/* binding */ redBright),
/* harmony export */   wL: () => (/* binding */ green),
/* harmony export */   wm: () => (/* binding */ gray),
/* harmony export */   wv: () => (/* binding */ red),
/* harmony export */   z1: () => (/* binding */ blue)
/* harmony export */ });
/* unused harmony exports reset, dim, italic, underline, overline, inverse, hidden, strikethrough, black, magenta, cyan, white, bgBlack, bgRed, bgGreen, bgYellow, bgBlue, bgMagenta, bgCyan, bgWhite, bgGray, greenBright, blueBright, magentaBright, cyanBright, whiteBright, bgRedBright, bgGreenBright, bgYellowBright, bgBlueBright, bgMagentaBright, bgCyanBright, bgWhiteBright */
/* harmony import */ var node_tty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7066);


// eslint-disable-next-line no-warning-comments
// TODO: Use a better method when it's added to Node.js (https://github.com/nodejs/node/pull/40240)
// Lots of optionals here to support Deno.
const hasColors = node_tty__WEBPACK_IMPORTED_MODULE_0__?.WriteStream?.prototype?.hasColors?.() ?? false;

const format = (open, close) => {
	if (!hasColors) {
		return input => input;
	}

	const openCode = `\u001B[${open}m`;
	const closeCode = `\u001B[${close}m`;

	return input => {
		const string = input + ''; // eslint-disable-line no-implicit-coercion -- This is faster.
		let index = string.indexOf(closeCode);

		if (index === -1) {
			// Note: Intentionally not using string interpolation for performance reasons.
			return openCode + string + closeCode;
		}

		// Handle nested colors.

		// We could have done this, but it's too slow (as of Node.js 22).
		// return openCode + string.replaceAll(closeCode, (close === 22 ? closeCode : '') + openCode) + closeCode;

		let result = openCode;
		let lastIndex = 0;

		// SGR 22 resets both bold (1) and dim (2). When we encounter a nested
		// close for styles that use 22, we need to re-open the outer style.
		const reopenOnNestedClose = close === 22;
		const replaceCode = (reopenOnNestedClose ? closeCode : '') + openCode;

		while (index !== -1) {
			result += string.slice(lastIndex, index) + replaceCode;
			lastIndex = index + closeCode.length;
			index = string.indexOf(closeCode, lastIndex);
		}

		result += string.slice(lastIndex) + closeCode;

		return result;
	};
};

const reset = format(0, 0);
const bold = format(1, 22);
const dim = format(2, 22);
const italic = format(3, 23);
const underline = format(4, 24);
const overline = format(53, 55);
const inverse = format(7, 27);
const hidden = format(8, 28);
const strikethrough = format(9, 29);

const black = format(30, 39);
const red = format(31, 39);
const green = format(32, 39);
const yellow = format(33, 39);
const blue = format(34, 39);
const magenta = format(35, 39);
const cyan = format(36, 39);
const white = format(37, 39);
const gray = format(90, 39);

const bgBlack = format(40, 49);
const bgRed = format(41, 49);
const bgGreen = format(42, 49);
const bgYellow = format(43, 49);
const bgBlue = format(44, 49);
const bgMagenta = format(45, 49);
const bgCyan = format(46, 49);
const bgWhite = format(47, 49);
const bgGray = format(100, 49);

const redBright = format(91, 39);
const greenBright = format(92, 39);
const yellowBright = format(93, 39);
const blueBright = format(94, 39);
const magentaBright = format(95, 39);
const cyanBright = format(96, 39);
const whiteBright = format(97, 39);

const bgRedBright = format(101, 49);
const bgGreenBright = format(102, 49);
const bgYellowBright = format(103, 49);
const bgBlueBright = format(104, 49);
const bgMagentaBright = format(105, 49);
const bgCyanBright = format(106, 49);
const bgWhiteBright = format(107, 49);


/***/ })

};
