import React, { useId } from "react";
export default function Flashcard({ question, answer, _id }) {
    const id = useId();
    return React.createElement("div", { className: "flashcard" },
        React.createElement("h3", null, question),
        React.createElement("button", { popoverTarget: id }, "Show Answer"),
        React.createElement("div", { id: id, popover: "auto" },
            React.createElement("p", null, answer),
            React.createElement("div", null,
                React.createElement("form", { action: `/flashcards/${_id}?redirectTo=/%3Flimit%3D10%26offset%3D0`, method: "POST" },
                    React.createElement("input", { type: "hidden", name: "correct", value: "true" }),
                    React.createElement("button", null, "Got it right")),
                React.createElement("form", { action: `/flashcards/${_id}?redirectTo=/%3Flimit%3D10%26offset%3D0`, method: "POST" },
                    React.createElement("button", null, "Got it wrong")))),
        React.createElement("form", { action: `/flashcards/${_id}?redirectTo=/%3Flimit%3D10%26offset%3D0`, method: "POST" },
            React.createElement("input", { type: "hidden", name: "correct", value: "true" }),
            React.createElement("button", null, "Got it right")),
        React.createElement("form", { action: `/flashcards/${_id}?redirectTo=/%3Flimit%3D10%26offset%3D0`, method: "POST" },
            React.createElement("button", null, "Got it wrong")));
}
