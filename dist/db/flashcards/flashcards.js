import mongoose, { Schema } from "mongoose";
import { day } from "../../utils/date.js";
import zod from "zod";
import "../db.js";
export const FlashcardSchema = new Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
    reviewLevel: { type: Number, required: true },
    reviewTimestamp: { type: Number, required: true }
}, { timestamps: true });
export const FlashcardCreateSchema = zod.object({
    question: zod.string(),
    answer: zod.string()
});
export const FlashcardGetManySchema = zod.object({
    offset: zod.coerce.number(),
    limit: zod.coerce.number(),
});
export const FlashcardIdSchema = zod.object({
    id: zod.string()
});
export const FlashcardUpdateSchema = zod.object({
    correct: zod.coerce.boolean().optional()
});
export const FlashcardModel = mongoose.model("Flashcard", FlashcardSchema, "flashcards");
export async function createFlashcard(flashcardOptions) {
    const flashcard = new FlashcardModel(Object.assign(Object.assign({}, flashcardOptions), { reviewLevel: 1, reviewTimestamp: Date.now() + day }));
    console.log(flashcard);
    await flashcard.save();
    return flashcard;
}
export async function updateFlashcard(id, flashcardOptions) {
    return await FlashcardModel.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, flashcardOptions, { new: true });
}
export async function reviewFlashcard(id, correct) {
    console.log(id);
    const objId = new mongoose.Types.ObjectId(id);
    const flashcard = await FlashcardModel.findById(objId);
    if (flashcard == null) {
        return null;
    }
    if (correct) {
        flashcard.reviewLevel += 1;
        flashcard.reviewTimestamp = Date.now() + day * flashcard.reviewLevel;
    }
    else {
        flashcard.reviewLevel = 1;
        flashcard.reviewTimestamp = Date.now() + day;
    }
    await flashcard.save();
    return flashcard;
}
export async function getFlashcards(offset, limit) {
    return await FlashcardModel.find().skip(offset).limit(limit).lean();
}
export async function getDueFlashcards(offset, limit) {
    return await FlashcardModel.find({ reviewTimestamp: { $lte: Date.now() } }) /*.sort({reviewTimestamp: 1, createdAt: -1})*/.skip(offset).limit(limit).lean();
}
export async function getNumberDueFlashcards() {
    return await FlashcardModel.countDocuments({ reviewTimestamp: { $lte: Date.now() } }).countDocuments();
}
export async function getFlashcard(id) {
    return await FlashcardModel.findById(id);
}
export async function deleteFlashcard(id) {
    return await FlashcardModel.findByIdAndDelete(id);
}
