import express from "express"
import {reactServer, reactServerRender} from "./middlewares/react.js"
import path, { dirname  } from "node:path"
import flashcardRouter from "./routes/flashcards/flashcard.js"
import { zodAuthQuery } from "./middlewares/zod.js"
import { FlashcardGetManySchema, getFlashcards, getDueFlashcards, getNumberDueFlashcards } from "./db/flashcards/flashcards.js"
import { fileURLToPath } from "node:url"
import bodyParser from "body-parser"

const jsonParser = bodyParser.json()

const app = express()

app.use(reactServer)
app.use(jsonParser)
app.use('/static', express.static(path.join(dirname(fileURLToPath(import.meta.url)), 'public')))
app.listen(3000, () => console.log("Server is running on port 3000"))
app.engine("js", reactServerRender)



app.set("views", "./views")
app.get("/", zodAuthQuery(FlashcardGetManySchema), async (req, res) => {
    const flashcards = await getDueFlashcards(req.body.offset, req.body.limit)
    const numberDueFlashcards = await getNumberDueFlashcards()
    res.render("index.js", {flashcards, numberDueFlashcards})
})
app.use("/flashcards", flashcardRouter)
