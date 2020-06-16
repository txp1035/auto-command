"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "translate", {
  enumerable: true,
  get: function get() {
    return _i18n().translate;
  }
});
exports.default = void 0;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _cronParser() {
  const data = _interopRequireDefault(require("cron-parser"));

  _cronParser = function _cronParser() {
    return data;
  };

  return data;
}

function _i18n() {
  const data = require("cronstrue/i18n");

  _i18n = function _i18n() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = _cronParser().default;

exports.default = _default;