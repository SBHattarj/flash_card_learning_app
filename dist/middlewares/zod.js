export function zodAuthBody(schema) {
    return (req, res, next) => {
        console.log(req.body);
        const body = schema.safeParse(req.body);
        if (!body.success) {
            res.status(400).send(body.error);
            return;
        }
        req.body = body.data;
        next();
    };
}
export function zodAuthQuery(schema) {
    return (req, res, next) => {
        const query = schema.safeParse(req.query);
        if (!query.success) {
            res.status(400).send(query.error);
            return;
        }
        req.body = query.data;
        next();
    };
}
export function zodAuthParams(schema) {
    return (req, res, next) => {
        const params = schema.safeParse(req.params);
        if (!params.success) {
            res.status(400).send(params.error);
            return;
        }
        req.body = params.data;
        next();
    };
}
