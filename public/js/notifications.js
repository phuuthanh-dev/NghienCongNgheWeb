// Listen for the SERVER_UNSEEN_CHATS event
const userId = document.querySelector("[my-id]").getAttribute("my-id");
socket.on("SERVER_UNSEEN_CHATS", (data) => {
    const roomChatId = data.roomChatId;
    const numberUnseenChats = data.numberUnseenChats;
    //User id of the user who has unseen chats
    const userId = data.userId;
    const numberUserUnseen = data.numberUserUnseen

    const currentPath = window.location.pathname;
    const isOnChatPage = currentPath.startsWith(`/chat/${roomChatId}`);

    //Current user is the user who has unseen chats and is on the chat page
    if (userId && isOnChatPage && data.userId == userId) {
        socket.emit("CLIENT_SEEN_CHATS", {
            roomChatId,
            userId
        });
        return;
    }

    const parentElement = document.querySelector(`[room-chat-id="${roomChatId}"]`);
    const parentBtnElement = document.querySelector(`[badge-unseen-chats="${userId}"]`);

    if (parentElement) {
        const badgeElement = parentElement.querySelector('.badge-users-accept');
        if (badgeElement) {
            badgeElement.textContent = numberUnseenChats;
        } else {
            const boxUser = parentElement.querySelector('.box-user');
            boxUser.innerHTML += `<span class="badge-users-accept">${numberUnseenChats}</span>`;
        }
    }

    if (parentBtnElement) {
        const badgeElement = parentBtnElement.querySelector('.badge-users-accept');
        if (badgeElement) {
            badgeElement.textContent = numberUserUnseen;
        } else {
            parentBtnElement.innerHTML += `<span class="badge-users-accept">${numberUserUnseen}</span>`;
        }
    }

});

socket.on("SERVER_UNSEEN_GROUP_CHATS", (data) => {
    const roomChatId = data.roomChatId;
    const userId = data.userId;
    const unseenChats = data.unseenChats;
    const parentRoomElement = document.querySelector(`[room-chat-id="${roomChatId}"][user-id="${userId}"]`);
    const parentBtnElement = document.querySelector(`[badge-unseen-groups="${userId}"]`);

    const currentPath = window.location.pathname;
    const isOnChatPage = currentPath.startsWith(`/chat/${roomChatId}`);

    if (userId && isOnChatPage && data.userId == userId) {
        socket.emit("CLIENT_SEEN_CHATS", {
            roomChatId,
            userId
        });
        return;
    }

    if (parentRoomElement) {
        const badgeElement = parentRoomElement.querySelector('.badge-users-accept');
        if (badgeElement) {
            badgeElement.textContent = unseenChats;
        } else {
            const boxUser = parentRoomElement.querySelector('.box-room');
            boxUser.innerHTML += `<span class="badge-users-accept">1</span>`;
        }
    }

    if (parentBtnElement) {
        const badgeElement = parentBtnElement.querySelector('.badge-users-accept');
        if (!badgeElement) {
            parentBtnElement.innerHTML += `<span class="badge-users-accept badge-noti-group"></span>`;
        }
    }
});