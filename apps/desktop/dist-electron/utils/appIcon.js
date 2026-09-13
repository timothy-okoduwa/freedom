"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAppIconPath = getAppIconPath;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
function getAppIconPath() {
    const candidatePaths = [
        path_1.default.join(__dirname, '../../assets/icon.png'),
        path_1.default.join(__dirname, '../assets/icon.png'),
        path_1.default.join(__dirname, '../../public/freedom.png'),
        path_1.default.join(__dirname, '../../public/icon.png'),
        path_1.default.join(process.cwd(), 'assets/icon.png'),
        path_1.default.join(process.cwd(), 'public/freedom.png'),
        path_1.default.join(process.cwd(), 'public/icon.png'),
        path_1.default.join(process.cwd(), 'apps/desktop/assets/icon.png'),
        path_1.default.join(process.cwd(), 'apps/desktop/public/freedom.png'),
    ];
    for (const p of candidatePaths) {
        if (fs_1.default.existsSync(p)) {
            return p;
        }
    }
    return undefined;
}
