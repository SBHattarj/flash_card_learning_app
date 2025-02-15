import { NextFunction, Request, Response } from "express"
import zod from "zod"
import type core from "express-serve-static-core"

export function zodAuthBody<Body>(schema: zod.Schema<Body>) {
    return (req: Request<core.ParamsDictionary, any, Body>, res: Response, next: NextFunction) => {
        console.log(req.body)
        const body = schema.safeParse(req.body)
        if(!body.success) {
            res.status(400).send(body.error)
            return
        }
        req.body = body.data
        next()
    }
}

export function zodAuthQuery<Query>(schema: zod.Schema<Query>) {
    return (req: Request<core.ParamsDictionary, any, Query>, res: Response, next: NextFunction) => {
        const query = schema.safeParse(req.query)
        if(!query.success) {
            res.status(400).send(query.error)
            return
        }
        req.body = query.data
        next()
        
    }
}

export function zodAuthParams<Params>(schema: zod.Schema<Params>) {
    return (req: Request<core.ParamsDictionary, any, Params>, res: Response, next: NextFunction) => {
        const params = schema.safeParse(req.params)
        if(!params.success) {
            res.status(400).send(params.error)
            return
        }
        req.body = params.data
        next()
        
    }
}
