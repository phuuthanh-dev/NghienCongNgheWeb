import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js';

// FileUploadWithPreview
const chatBody = document.querySelector(".chat .inner-body");
var upload;
if (chatBody) {
    chatBody.scrollTop = chatBody.scrollHeight;
    upload = new FileUploadWithPreview.FileUploadWithPreview('upload-images', {
        multiple: true,
        maxFileCount: 6,
    });
}
// End FileUploadWithPreview

// CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat .inner-form");
if (formSendData) {
    formSendData.addEventListener("submit", (event) => {
        event.preventDefault();
        const content = formSendData.content.value || "";
        const images = upload.cachedFileArray || [];

        if (content || images.length > 0) {
            // Gửi content hoặc images lên server
            socket.emit("CLIENT_SEND_MESSAGE", {
                content: content,
                images: images
            });
            formSendData.content.value = "";
            upload.resetPreviewPanel();
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
        ${data.content ? `<div class="inner-content">${data.content}</div>` : ""}
        ${data.images.length > 0 ? `
            <div class="inner-images">
                ${data.images.map(image => `<img src="${image}" alt="Image">`).join("")}
            </div>
        ` : ""}
    `;

    body.insertBefore(div, boxTyping);
    body.scrollTop = body.scrollHeight;

    // Preview Image
    const boxImages = div.querySelector(".inner-images");
    if (boxImages) {
        const gallery = new Viewer(boxImages, {
            toolbar: false,
            navbar: false,
        });
    }
})
// End SERVER_SEND_MESSAGE

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

// Emoji picker | https://github.com/nolanlawson/emoji-picker-element
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
        if (data.status == "show" && data.userId != document.querySelector("[my-id]").getAttribute("my-id")) {
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

// Preview Image
if (chatBody) {
    const gallery = new Viewer(chatBody, {
        toolbar: false,
        navbar: false,
    });
}