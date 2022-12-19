"use strict";
exports.__esModule = true;
require("dotenv").config();
var response_1 = require("./response");
var ErrorHandler = /** @class */ (function () {
    function ErrorHandler() {
    }
    /**
     *
     * @param err
     * @param req
     * @param res
     * @returns {*}
     */
    ErrorHandler.handle = function (err, req, res) {
        var stack = process.env.NODE_ENV === "development" ? err.stack : null;
        return response_1["default"].sendFatalError({ res: res, error: err.errors, message: err.message, stack: stack });
    };
    return ErrorHandler;
}());
exports["default"] = ErrorHandler;
