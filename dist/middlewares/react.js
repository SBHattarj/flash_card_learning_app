import { renderToPipeableStream } from "react-dom/server";
import React from "react";
export function reactServer(req, res, next) {
    const prevRender = res.render;
    res.render = function (...args) {
        const path = args[0];
        let options = args[1];
        let callback = args[2];
        if (typeof args[1] == "function") {
            options = {};
            callback = args[1];
        }
        const that = this;
        prevRender.call(that, path, options, async (err, html) => {
            if (typeof html === "string") {
                if (callback)
                    callback(err, html);
                else
                    that.send(html);
                return;
            }
            if ("pipe" in html) {
                that.set("Content-Type", "text/html");
                html.pipe(that);
                return;
            }
            if (callback)
                callback(err, html);
        });
        return this;
    };
    next();
}
export async function reactServerRender(path, options, callback) {
    const Component = await import(path).then(m => m.default);
    const stream = renderToPipeableStream(React.createElement(Component, Object.assign({}, options)), {
        bootstrapScripts: ["static/views/" + path.replace(/^.*\//, "")],
        onShellReady() {
            callback(null, stream);
        }
    });
}
