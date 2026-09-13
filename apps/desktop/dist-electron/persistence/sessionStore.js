"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionStore = void 0;
const electron_store_1 = __importDefault(require("electron-store"));
const store = new electron_store_1.default({
    name: 'freedom-session',
    defaults: {
        activeItemState: null,
        currentDayPlan: null,
        widgetPosition: null,
        lastPersistedAt: new Date().toISOString(),
    },
});
exports.sessionStore = {
    getActiveItem() {
        return store.get('activeItemState');
    },
    setActiveItem(state) {
        store.set('activeItemState', state);
        store.set('lastPersistedAt', new Date().toISOString());
    },
    getCurrentDayPlan() {
        return store.get('currentDayPlan');
    },
    setCurrentDayPlan(plan) {
        store.set('currentDayPlan', plan);
        store.set('lastPersistedAt', new Date().toISOString());
    },
    getWidgetPosition() {
        return store.get('widgetPosition');
    },
    setWidgetPosition(pos) {
        store.set('widgetPosition', pos);
    },
    clearSession() {
        store.set('activeItemState', null);
        store.set('currentDayPlan', null);
        store.set('lastPersistedAt', new Date().toISOString());
    },
};
