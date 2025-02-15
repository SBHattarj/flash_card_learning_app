import express from "express";
import { zodAuthBody, zodAuthQuery } from "../../middlewares/zod.js";
import { FlashcardCreateSchema, FlashcardGetManySchema, FlashcardUpdateSchema, createFlashcard, deleteFlashcard, getFlashcard, getFlashcards, reviewFlashcard } from "../../db/flashcards/flashcards.js";
const router = express.Router();
const createBodyAuth = zodAuthBody(FlashcardCreateSchema);
router.post("/", createBodyAuth, async (req, res) => {
    const flashcard = await createFlashcard(req.body);
    res.send(flashcard);
}).get("/", zodAuthQuery(FlashcardGetManySchema), async (req, res) => {
    const limit = req.body.limit;
    const offset = req.body.offset;
    const flashcards = await getFlashcards(offset, limit);
    res.send(flashcards);
}).put("/:id", zodAuthBody(FlashcardUpdateSchema), async (req, res) => {
    var _a;
    const id = req.params.id;
    console.log(id);
    const redirectTo = req.query.redirectTo;
    const flashcard = await reviewFlashcard(id, (_a = req.body.correct) !== null && _a !== void 0 ? _a : false);
    console.log("h");
    if (redirectTo) {
        res.redirect(302, redirectTo);
        return;
    }
    res.send(flashcard);
}).post("/:id", async (req, res) => {
    var _a;
    const id = req.params.id;
    console.log(id);
    const redirectTo = req.query.redirectTo;
    const flashcard = await reviewFlashcard(id, (_a = req.body.correct) !== null && _a !== void 0 ? _a : false);
    console.log("h");
    if (redirectTo) {
        res.redirect(302, redirectTo);
        console.log("hello");
        return;
    }
    res.send(flashcard);
}).delete("/:id", async (req, res) => {
    const id = req.params.id;
    const flashcard = await getFlashcard(id);
    if (flashcard == null) {
        res.status(404).send("Flashcard not found");
        return;
    }
    await deleteFlashcard(id);
    res.send(flashcard);
}).get("/:id", async (req, res) => {
    const id = req.params.id;
    console.log(id);
    const flashcard = await getFlashcard(id);
    if (flashcard == null) {
        res.status(404).send("Flashcard not found");
        return;
    }
    res.send(flashcard);
});
export default router;
