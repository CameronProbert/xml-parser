"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const input_1 = __importDefault(require("./input"));
const validate_1 = require("./validate");
console.log("Tag Checker starting...");
function run() {
    console.log("loaded input from 'src/input.ts");
    validate_1.validate(input_1.default);
    console.log("Thank you for using my xml/html checker");
}
run();
//# sourceMappingURL=index.js.map