import {hydrateRoot} from "react-dom/client"
import React from "react"
export function hydrateReact<T>(App: React.FC<T>) {
    if(typeof window == "undefined") return
    const {data} = JSON.parse(document.getElementById("server_data")?.textContent ?? "{'data': {}}")
    hydrateRoot(document, <App {...data} />)
}

export function BasicLayout({children, data, head}: {children: React.ReactNode, data: any, head?: React.ReactNode}) {
    return <html>
        <head>
            <script id="server_data" type="json">{JSON.stringify({data})}</script>
            {head}
        </head>
        <body>
            {children}
        </body>
    </html>
}
