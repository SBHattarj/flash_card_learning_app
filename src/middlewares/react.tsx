import { pipeline } from "node:stream/promises"
import { Writable } from "node:stream"
import { PipeableStream, renderToPipeableStream } from "react-dom/server"
import type { Request, Response, NextFunction } from "express"
import React from "react"

export function reactServer(req: Request, res: Response, next: NextFunction) {
    const prevRender = res.render
    res.render = (function (this: Response, ...args) {
        const path = args[0]
        let options = args[1]
        let callback: (err: any, html: string | PipeableStream) => void = args[2] as (err: any, html: string | PipeableStream) => void
        if(typeof args[1] == "function") {
            options = {} as typeof options;
            callback = args[1] as (err: any, html: any) => void
        }
        const that = this;
        (prevRender as any).call(that, path, options, async (err: any, html: any) => {

            if(typeof html === "string") {
                if(callback) callback(err, html)
                else that.send(html)
                return;
            }
            if("pipe" in html) {
                that.set("Content-Type", "text/html")
                html.pipe(that)
                return
            }
            if(callback) callback(err, html)
        })
        return this
    } as typeof res.render)
    next()

}


export async function reactServerRender(path: string, options: {}, callback: (err: unknown |null, html?: any) => void)  {
    const Component: React.FC = await import(path).then(m => m.default)
    const stream = renderToPipeableStream(<Component {...options}/>, {
        bootstrapScripts: ["static/views/"+path.replace(/^.*\//, "")],
        onShellReady() {
            callback(null, stream)
        }
    })
}
