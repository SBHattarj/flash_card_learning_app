import React, { useId } from "react"
import { Flashcard as FlashcardT } from "../../db/flashcards/flashcards.js"

export default function Flashcard({question, answer, _id}: FlashcardT) {
    const id = useId();
    return <div className="flashcard">
        <h3>{question}</h3>
        <button  popoverTarget={id}>Show Answer</button>
        <div id={id} popover="auto">
            <p >{answer}</p>
            <div>
                <form action={`/flashcards/${_id}?redirectTo=/%3Flimit%3D10%26offset%3D0`} method="POST">
                    <input type="hidden" name="correct" value="true" />
                    <button>Got it right</button>
                </form>
                <form action={`/flashcards/${_id}?redirectTo=/%3Flimit%3D10%26offset%3D0`} method="POST">
                    <button>Got it wrong</button>
                </form>
            </div>
        </div>
        <form action={`/flashcards/${_id}?redirectTo=/%3Flimit%3D10%26offset%3D0`} method="POST">
            <input type="hidden" name="correct" value="true" />
            <button>Got it right</button>
        </form>
        <form action={`/flashcards/${_id}?redirectTo=/%3Flimit%3D10%26offset%3D0`} method="POST">
            <button>Got it wrong</button>
        </form>
    </div>
}
