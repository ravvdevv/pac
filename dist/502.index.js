export const id = 502;
export const ids = [502];
export const modules = {

/***/ 1502:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _inquirer_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7540);
/* harmony import */ var _inquirer_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(504);
/* harmony import */ var _inquirer_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(3625);
/* harmony import */ var _inquirer_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(1348);
/* harmony import */ var _inquirer_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(9480);
/* harmony import */ var _inquirer_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(129);
/* harmony import */ var _inquirer_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(8975);
/* harmony import */ var _inquirer_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(2068);
/* harmony import */ var _inquirer_core__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(3767);
/* harmony import */ var _inquirer_core__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(348);
/* harmony import */ var _inquirer_core__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(3172);
/* harmony import */ var node_util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7975);
/* harmony import */ var _inquirer_figures__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7395);



const searchTheme = {
    icon: { cursor: _inquirer_figures__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Ay.pointer },
    style: {
        disabled: (text) => (0,node_util__WEBPACK_IMPORTED_MODULE_0__.styleText)('dim', `- ${text}`),
        searchTerm: (text) => (0,node_util__WEBPACK_IMPORTED_MODULE_0__.styleText)('cyan', text),
        description: (text) => (0,node_util__WEBPACK_IMPORTED_MODULE_0__.styleText)('cyan', text),
        keysHelpTip: (keys) => keys
            .map(([key, action]) => `${(0,node_util__WEBPACK_IMPORTED_MODULE_0__.styleText)('bold', key)} ${(0,node_util__WEBPACK_IMPORTED_MODULE_0__.styleText)('dim', action)}`)
            .join((0,node_util__WEBPACK_IMPORTED_MODULE_0__.styleText)('dim', ' • ')),
    },
};
function isSelectable(item) {
    return !_inquirer_core__WEBPACK_IMPORTED_MODULE_2__/* .Separator */ .w.isSeparator(item) && !item.disabled;
}
function normalizeChoices(choices) {
    return choices.map((choice) => {
        if (_inquirer_core__WEBPACK_IMPORTED_MODULE_2__/* .Separator */ .w.isSeparator(choice))
            return choice;
        if (typeof choice !== 'object' || choice === null || !('value' in choice)) {
            const name = String(choice);
            return {
                value: choice,
                name,
                short: name,
                disabled: false,
            };
        }
        const name = choice.name ?? String(choice.value);
        const normalizedChoice = {
            value: choice.value,
            name,
            short: choice.short ?? name,
            disabled: choice.disabled ?? false,
        };
        if (choice.description) {
            normalizedChoice.description = choice.description;
        }
        return normalizedChoice;
    });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_inquirer_core__WEBPACK_IMPORTED_MODULE_3__/* .createPrompt */ .H)((config, done) => {
    const { pageSize = 7, validate = () => true } = config;
    const theme = (0,_inquirer_core__WEBPACK_IMPORTED_MODULE_4__/* .makeTheme */ .k)(searchTheme, config.theme);
    const [status, setStatus] = (0,_inquirer_core__WEBPACK_IMPORTED_MODULE_5__/* .useState */ .J)('loading');
    const [searchTerm, setSearchTerm] = (0,_inquirer_core__WEBPACK_IMPORTED_MODULE_5__/* .useState */ .J)('');
    const [searchResults, setSearchResults] = (0,_inquirer_core__WEBPACK_IMPORTED_MODULE_5__/* .useState */ .J)([]);
    const [searchError, setSearchError] = (0,_inquirer_core__WEBPACK_IMPORTED_MODULE_5__/* .useState */ .J)();
    const defaultApplied = (0,_inquirer_core__WEBPACK_IMPORTED_MODULE_6__/* .useRef */ .l)(false);
    const prefix = (0,_inquirer_core__WEBPACK_IMPORTED_MODULE_7__/* .usePrefix */ .M)({ status, theme });
    const bounds = (0,_inquirer_core__WEBPACK_IMPORTED_MODULE_8__/* .useMemo */ .K)(() => {
        const first = searchResults.findIndex(isSelectable);
        const last = searchResults.findLastIndex(isSelectable);
        return { first, last };
    }, [searchResults]);
    const [active = bounds.first, setActive] = (0,_inquirer_core__WEBPACK_IMPORTED_MODULE_5__/* .useState */ .J)();
    (0,_inquirer_core__WEBPACK_IMPORTED_MODULE_9__/* .useEffect */ .v)(() => {
        const controller = new AbortController();
        setStatus('loading');
        setSearchError(undefined);
        const fetchResults = async () => {
            try {
                const results = await config.source(searchTerm || undefined, {
                    signal: controller.signal,
                });
                if (!controller.signal.aborted) {
                    const normalized = normalizeChoices(results);
                    let initialActive;
                    if (!defaultApplied.current && 'default' in config) {
                        const defaultIndex = normalized.findIndex((item) => isSelectable(item) && item.value === config.default);
                        initialActive = defaultIndex === -1 ? undefined : defaultIndex;
                        defaultApplied.current = true;
                    }
                    setActive(initialActive);
                    setSearchError(undefined);
                    setSearchResults(normalized);
                    setStatus('idle');
                }
            }
            catch (error) {
                if (!controller.signal.aborted && error instanceof Error) {
                    setSearchError(error.message);
                }
            }
        };
        void fetchResults();
        return () => {
            controller.abort();
        };
    }, [searchTerm]);
    // Safe to assume the cursor position never points to a Separator.
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    const selectedChoice = searchResults[active];
    (0,_inquirer_core__WEBPACK_IMPORTED_MODULE_10__/* .useKeypress */ .o)(async (key, rl) => {
        if ((0,_inquirer_core__WEBPACK_IMPORTED_MODULE_11__/* .isEnterKey */ .Ci)(key)) {
            if (selectedChoice) {
                setStatus('loading');
                const isValid = await validate(selectedChoice.value);
                setStatus('idle');
                if (isValid === true) {
                    setStatus('done');
                    done(selectedChoice.value);
                }
                else if (selectedChoice.name === searchTerm) {
                    setSearchError(isValid || 'You must provide a valid value');
                }
                else {
                    // Reset line with new search term
                    rl.write(selectedChoice.name);
                    setSearchTerm(selectedChoice.name);
                }
            }
            else {
                // Reset the readline line value to the previous value. On line event, the value
                // get cleared, forcing the user to re-enter the value instead of fixing it.
                rl.write(searchTerm);
            }
        }
        else if ((0,_inquirer_core__WEBPACK_IMPORTED_MODULE_11__/* .isTabKey */ .vY)(key) && selectedChoice) {
            rl.clearLine(0); // Remove the tab character.
            rl.write(selectedChoice.name);
            setSearchTerm(selectedChoice.name);
        }
        else if (status !== 'loading' && ((0,_inquirer_core__WEBPACK_IMPORTED_MODULE_11__/* .isUpKey */ .$u)(key) || (0,_inquirer_core__WEBPACK_IMPORTED_MODULE_11__/* .isDownKey */ .gf)(key))) {
            rl.clearLine(0);
            if (((0,_inquirer_core__WEBPACK_IMPORTED_MODULE_11__/* .isUpKey */ .$u)(key) && active !== bounds.first) ||
                ((0,_inquirer_core__WEBPACK_IMPORTED_MODULE_11__/* .isDownKey */ .gf)(key) && active !== bounds.last)) {
                const offset = (0,_inquirer_core__WEBPACK_IMPORTED_MODULE_11__/* .isUpKey */ .$u)(key) ? -1 : 1;
                let next = active;
                do {
                    next = (next + offset + searchResults.length) % searchResults.length;
                } while (!isSelectable(searchResults[next]));
                setActive(next);
            }
        }
        else {
            setSearchTerm(rl.line);
        }
    });
    const message = theme.style.message(config.message, status);
    const helpLine = theme.style.keysHelpTip([
        ['↑↓', 'navigate'],
        ['⏎', 'select'],
    ]);
    const page = (0,_inquirer_core__WEBPACK_IMPORTED_MODULE_12__/* .usePagination */ .W)({
        items: searchResults,
        active,
        renderItem({ item, isActive }) {
            if (_inquirer_core__WEBPACK_IMPORTED_MODULE_2__/* .Separator */ .w.isSeparator(item)) {
                return ` ${item.separator}`;
            }
            if (item.disabled) {
                const disabledLabel = typeof item.disabled === 'string' ? item.disabled : '(disabled)';
                return theme.style.disabled(`${item.name} ${disabledLabel}`);
            }
            const color = isActive ? theme.style.highlight : (x) => x;
            const cursor = isActive ? theme.icon.cursor : ` `;
            return color(`${cursor} ${item.name}`);
        },
        pageSize,
        loop: false,
    });
    let error;
    if (searchError) {
        error = theme.style.error(searchError);
    }
    else if (searchResults.length === 0 && searchTerm !== '' && status === 'idle') {
        error = theme.style.error('No results found');
    }
    let searchStr;
    if (status === 'done' && selectedChoice) {
        return [prefix, message, theme.style.answer(selectedChoice.short)]
            .filter(Boolean)
            .join(' ')
            .trimEnd();
    }
    else {
        searchStr = theme.style.searchTerm(searchTerm);
    }
    const description = selectedChoice?.description;
    const header = [prefix, message, searchStr].filter(Boolean).join(' ').trimEnd();
    const body = [
        error ?? page,
        ' ',
        description ? theme.style.description(description) : '',
        helpLine,
    ]
        .filter(Boolean)
        .join('\n')
        .trimEnd();
    return [header, body];
}));



/***/ })

};
