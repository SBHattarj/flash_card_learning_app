import React from "react";
import type {Flashcard} from "../db/flashcards/flashcards.js"
import {hydrateReact, BasicLayout} from "../utils/react.js"
import FlashcardC  from "../components/Flashcards/Falshcards.js"

export type Props = {
    flashcards: Flashcard[],
    numberDueFlashcards: number
}
export default function Index({flashcards, numberDueFlashcards}: Props) {

    return <BasicLayout
        data={{flashcards, numberDueFlashcards}}
        head={<link rel="stylesheet" href="/static/views/index.css" />}
    >
        <main>
        {flashcards.map(flashcard => (
            <FlashcardC key={flashcard._id} {...flashcard} />
        ))}
        </main>
        <footer><h4>You have {numberDueFlashcards} due today</h4></footer>
    </BasicLayout>
}

hydrateReact(Index)
