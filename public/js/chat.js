// CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat .inner-form");
if (formSendData) {
    formSendData.addEventListener("submit", (event) => {
        event.preventDefault();
        const content = formSendData.content.value || "";

        if (content) {
            socket.emit("CLIENT_SEND_MESSAGE", content);
            formSendData.content.value = "";
        }
    })
}
// End CLIENT_SEND_MESSAGE

// SERVER_SEND_MESSAGE
socket.on("SERVER_SEND_MESSAGE", (data) => {
    const myId = document.querySelector("[my-id]").getAttribute("my-id");
    const body = document.querySelector(".chat .inner-body");
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

    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
})
// End SERVER_SEND_MESSAGE

// Scroll to bottom
const chatBody = document.querySelector(".chat .inner-body");
if (chatBody) {
    chatBody.scrollTop = chatBody.scrollHeight;
}
// End Scroll to bottom
