"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.marginValidator = exports.layoutValidator = exports.keysValidator = exports.breakpointsValidator = void 0;
var payload_1 = require("./payload");
var keysValidatorPayload = payload_1["default"].keysValidatorPayload, layoutValidatorPayload = payload_1["default"].layoutValidatorPayload;
var breakpointsValidator = function (cols) {
    var propColsKeys = Object.keys(cols);
    var colsValues = propColsKeys.map(function (k) { return typeof cols[k] === 'number'; });
    return (0, exports.keysValidator)(keysValidatorPayload.validKeys, propColsKeys) && colsValues.indexOf(false) === -1;
};
exports.breakpointsValidator = breakpointsValidator;
var keysValidator = function (requiredKeys, propsKeys) {
    var coincidenceKeys = propsKeys.filter(function (k) { return requiredKeys.indexOf(k) >= 0; });
    return propsKeys.length >= requiredKeys.length && coincidenceKeys.length === requiredKeys.length;
};
exports.keysValidator = keysValidator;
var x = [{
        _listeners: [],
        x: 0,
        y: 0,
        w: 1,
        h: 1,
        i: 1,
        _records: -1,
        _timeSlug: null,
        _meta: {},
        _parameters: {},
        _options: {
            legend: {
                align: 'left',
                enabled: true,
                floating: false,
                useHtml: true,
                verticalAlign: 'bottom'
            },
            measure: 'bits',
            stacked: false,
            type: 'area'
        },
        _additional: {
            device: [],
            site: []
        },
        _tokens: {},
        _busy: false,
        _error: '',
        _placeholder: false,
        _original: {
            h: 1,
            id: 1,
            x: 0,
            y: 0,
            w: 1
        },
        moved: false
    }];
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
var layoutValidator = function (layout) {
    if (layout === void 0) { layout = x; }
    var validOptionalLayout = layoutValidatorPayload.validOptionalLayout, validRequiredLayout = layoutValidatorPayload.validRequiredLayout;
    var validLayout = __assign(__assign({}, validRequiredLayout), validOptionalLayout);
    var requiredKeys = Object.keys(validRequiredLayout);
    var requiredKeysValid = layout.map(function (l) { return (0, exports.keysValidator)(requiredKeys, Object.keys(l)); });
    if (requiredKeysValid.includes(false))
        return false;
    var validTypes = layout.map(function (l) {
        var layoutItemKeys = Object.keys(l);
        console.log(layoutItemKeys);
        return layoutItemKeys
            .map(function (k) { return k === 'i' ? !isNaN(parseInt(l.i)) : validLayout[k] ? typeof l[k] === typeof validLayout[k] : true; })
            .includes(false);
    });
    console.log(validTypes, validTypes.indexOf(false));
    return !validTypes.includes(true);
};
exports.layoutValidator = layoutValidator;
var marginValidator = function (value) {
    var values = value.map(function (v) { return typeof v === 'number'; });
    var isLength = value.length === 2;
    return values.indexOf(false) === -1 && isLength;
};
exports.marginValidator = marginValidator;
console.log((0, exports.layoutValidator)());
