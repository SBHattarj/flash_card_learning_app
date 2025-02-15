import React from "react";
import { hydrateReact, BasicLayout } from "../utils/react.js";
import FlashcardC from "../components/Flashcards/Falshcards.js";
export default function Index({ flashcards, numberDueFlashcards }) {
    return React.createElement(BasicLayout, { data: { flashcards, numberDueFlashcards }, head: React.createElement("link", { rel: "stylesheet", href: "/static/views/index.css" }) },
        React.createElement("main", null, flashcards.map(flashcard => (React.createElement(FlashcardC, Object.assign({ key: flashcard._id }, flashcard))))),
        React.createElement("footer", null,
            React.createElement("h4", null,
                "You have ",
                numberDueFlashcards,
                " due today")));
}
hydrateReact(Index);
