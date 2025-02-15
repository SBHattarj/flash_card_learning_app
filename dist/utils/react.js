import { hydrateRoot } from "react-dom/client";
import React from "react";
export function hydrateReact(App) {
    var _a, _b;
    if (typeof window == "undefined")
        return;
    const { data } = JSON.parse((_b = (_a = document.getElementById("server_data")) === null || _a === void 0 ? void 0 : _a.textContent) !== null && _b !== void 0 ? _b : "{'data': {}}");
    hydrateRoot(document, React.createElement(App, Object.assign({}, data)));
}
export function BasicLayout({ children, data, head }) {
    return React.createElement("html", null,
        React.createElement("head", null,
            React.createElement("script", { id: "server_data", type: "json" }, JSON.stringify({ data })),
            head),
        React.createElement("body", null, children));
}
