"use strict";
exports.__esModule = true;
var statusCodes = require("../status-code").statusCodes;
var ResponseHandler = /** @class */ (function () {
    function ResponseHandler() {
    }
    /**
     *
     * @param param0
     * @returns {*}
     */
    ResponseHandler.sendSuccess = function (_a) {
        var res = _a.res, _b = _a.success, success = _b === void 0 ? true : _b, _c = _a.statusCode, statusCode = _c === void 0 ? statusCodes.OK : _c, _d = _a.message, message = _d === void 0 ? "Successful Operation" : _d, _e = _a.body, body = _e === void 0 ? {} : _e;
        return res.status(statusCode).send({ success: success, message: message, body: body });
    };
    /**
     *
     * @param param0
     * @returns {*}
     */
    ResponseHandler.sendError = function (_a) {
        var res = _a.res, _b = _a.success, success = _b === void 0 ? false : _b, _c = _a.statusCode, statusCode = _c === void 0 ? statusCodes.BAD_REQUEST : _c, _d = _a.error, error = _d === void 0 ? "Failed Operation" : _d, _e = _a.body, body = _e === void 0 ? {} : _e;
        return res.status(statusCode).send({ success: success, error: error, body: body });
    };
    /**
     *
     * @param param0
     * @returns {*}
     */
    ResponseHandler.sendFatalError = function (_a) {
        var res = _a.res, _b = _a.success, success = _b === void 0 ? false : _b, _c = _a.statusCode, statusCode = _c === void 0 ? statusCodes.INTERNAL_SERVER_ERROR : _c, _d = _a.message, message = _d === void 0 ? "Internal server error" : _d, _e = _a.body, body = _e === void 0 ? {} : _e, error = _a.error, stack = _a.stack;
        return res.status(statusCode).send({ success: success, message: message, body: body, error: error, stack: stack });
    };
    return ResponseHandler;
}());
exports["default"] = ResponseHandler;
