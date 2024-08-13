import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'

// CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat .inner-form");
if (formSendData) {
    formSendData.addEventListener("submit", (event) => {
        event.preventDefault();
        const content = formSendData.content.value || "";

        if (content) {
            socket.emit("CLIENT_SEND_MESSAGE", content);
            formSendData.content.value = "";
            socket.emit("CLIENT_TYPING", "hide");
        }
    })
}
// End CLIENT_SEND_MESSAGE

// SERVER_SEND_MESSAGE
socket.on("SERVER_SEND_MESSAGE", (data) => {
    const myId = document.querySelector("[my-id]").getAttribute("my-id");
    const body = document.querySelector(".chat .inner-body");
    const boxTyping = document.querySelector(".chat .inner-list-typing");
    const div = document.createElement("div");

    if (data.userId == myId) {
        div.classList.add("inner-outgoing");
    } else {
        div.classList.add("inner-incoming");
    }

    div.innerHTML = `
        ${data.userId == myId ? "" : `<div class="inner-name">${data.fullName}</div>`}
        <div class="inner-content">${data.content}</div>
    `;

    body.insertBefore(div, boxTyping);
    body.scrollTop = body.scrollHeight;
})
// End SERVER_SEND_MESSAGE

// Scroll to bottom
const chatBody = document.querySelector(".chat .inner-body");
if (chatBody) {
    chatBody.scrollTop = chatBody.scrollHeight;
}
// End Scroll to bottom

// Show typing
var timeout;
const showTyping = () => {
    socket.emit("CLIENT_TYPING", "show");

    clearTimeout(timeout);

    timeout = setTimeout(() => {
        socket.emit("CLIENT_TYPING", "hide");
    }, 3000)
}
// End Show typing

// Emoji picker
// Show popup
const buttonEmoji = document.querySelector('.chat .inner-form .button-icon');
if (buttonEmoji) {
    const tooltip = document.querySelector('.tooltip');
    Popper.createPopper(buttonEmoji, tooltip)

    buttonEmoji.addEventListener('click', () => {
        tooltip.classList.toggle('shown');
    })
}
// Insert emoji into input
const emojiPicker = document.querySelector('emoji-picker');
if (emojiPicker) {
    const input = document.querySelector('.chat .inner-form input[name="content"]');

    emojiPicker.addEventListener('emoji-click', (event) => {
        const icon = event.detail.unicode;
        input.value += icon;

        const length = input.value.length;
        input.setSelectionRange(length, length);
        input.focus();
        
        showTyping();
    })

    input.addEventListener('keyup', () => {
        showTyping();
    })
}
// End Emoji picker

// SERVER_TYPING
const elementListTyping = document.querySelector(".chat .inner-list-typing");
if (elementListTyping) {
    socket.on("SERVER_TYPING", (data) => {
        if (data.status == "show") {
            const existTyping = elementListTyping.querySelector(`.box-typing[user-id="${data.userId}"]`);
            if (existTyping) {
                return;
            }
            const boxTyping = document.createElement("div");
            boxTyping.classList.add("box-typing");
            boxTyping.setAttribute("user-id", data.userId);
            boxTyping.innerHTML = `
            <div class="inner-name">${data.fullName}</div>
            <div class="inner-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
            elementListTyping.appendChild(boxTyping);
            chatBody.scrollTop = chatBody.scrollHeight;
        } else {
            const boxTyping = elementListTyping.querySelector(`.box-typing[user-id="${data.userId}"]`);
            if (boxTyping) {
                elementListTyping.removeChild(boxTyping);
            }
        }
    })
}
// End SERVER_TYPING
