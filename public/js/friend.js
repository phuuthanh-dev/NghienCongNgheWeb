// Chức năng gửi yêu cầu
const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]");
if (listBtnAddFriend.length > 0) {
    listBtnAddFriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.add("add");

            const userIdB = button.getAttribute("btn-add-friend");

            socket.emit("CLIENT_ADD_FRIEND", userIdB);
        })
    })
}
// Hết Chức năng gửi yêu cầu

// Chức năng hủy gửi yêu cầu
const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]");
if (listBtnCancelFriend.length > 0) {
    listBtnCancelFriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.remove("add");

            const userIdB = button.getAttribute("btn-cancel-friend");

            socket.emit("CLIENT_CANCEL_FRIREND", userIdB);
        })
    })
}
// Hết Chức năng hủy gửi yêu cầu

// Chức năng từ chối kết bạn
const deleteUser = (button) => {
    button.addEventListener("click", () => {
        button.closest(".box-user").classList.add("refuse");

        const userIdB = button.getAttribute("btn-refuse-friend");

        socket.emit("CLIENT_REFUSE_FRIREND", userIdB);
    })
}

const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]");
if (listBtnRefuseFriend.length > 0) {
    listBtnRefuseFriend.forEach(button => {
        deleteUser(button);
    })
}
// Hết Chức năng từ chối kết bạn

// Chức năng chấp nhận kết bạn
const acceptUser = (button) => {
    button.addEventListener("click", () => {
        button.closest(".box-user").classList.add("accepted");

        const userIdB = button.getAttribute("btn-accept-friend");

        socket.emit("CLIENT_ACCEPT_FRIEND", userIdB);
    })
}

const listBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]");
if (listBtnAcceptFriend.length > 0) {
    listBtnAcceptFriend.forEach(button => {
        acceptUser(button);
    })
}
// Hết Chức năng chấp nhận kết bạn

// SERVER_RETURN_LENGTH_ACCEPT_FRIEND
socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", (data) => {
    const badgeUsersAccept = document.querySelector(`[badge-users-accept="${data.userId}"]`);
    if (badgeUsersAccept) {
        badgeUsersAccept.innerHTML = data.lengthAcceptFriends;
    }
});
// End SERVER_RETURN_LENGTH_ACCEPT_FRIEND

// SERVER_RETURN_INFO_ACCEPT_FRIEND
socket.on("SERVER_RETURN_INFO_ACCEPT_FRIEND", (data) => {
    // Lấy thông tin của A để in ra trang Lời mời đã nhận của B
    const dataUsersAccept = document.querySelector(`[data-users-accept="${data.userIdB}"]`);

    if (dataUsersAccept) {
        const newBoxUser = document.createElement("div");
        newBoxUser.classList.add("col-6");
        newBoxUser.setAttribute("user-id", data.userA._id);

        newBoxUser.innerHTML = `
            <div class="box-user">
                <div class="inner-avatar">
                    <img src="https://robohash.org/hicveldicta.png" alt="${data.userA.fullName}" />
                </div>
                <div class="inner-info">
                    <div class="inner-name">
                        ${data.userA.fullName}
                    </div>
                    <div class="inner-buttons">
                        <button 
                            class="btn btn-sm btn-primary mr-1"
                            btn-accept-friend="${data.userA._id}"
                        >
                            Chấp nhận
                        </button>
                        <button 
                            class="btn btn-sm btn-secondary mr-1"
                            btn-refuse-friend="${data.userA._id}"
                        >
                            Xóa
                        </button>
                        <button 
                            class="btn btn-sm btn-secondary mr-1" 
                            btn-deleted-friend="" 
                            disabled=""
                        >
                            Đã xóa
                        </button>
                        <button 
                            class="btn btn-sm btn-primary mr-1" 
                            btn-accepted-friend="" 
                            disabled=""
                        >
                            Đã chấp nhận
                        </button>
                    </div>
                </div>
            </div>
        `;
        const textNoUsers = dataUsersAccept.querySelector("[text-no-users]");
        if (textNoUsers) {
            dataUsersAccept.removeChild(textNoUsers);
        }

        dataUsersAccept.appendChild(newBoxUser);

        // Bắt sự kiện cho nút Xóa
        const btnRefuseFriend = newBoxUser.querySelector("[btn-refuse-friend]");
        deleteUser(btnRefuseFriend);

        // Bắt sự kiện cho nút Chấp nhận
        const btnAcceptFriend = document.querySelector("[btn-accept-friend]");
        acceptUser(btnAcceptFriend);
    }

    // Xóa A khỏi trang Danh sách người dùng gợi ý của B
    const dataUsersSuggestion = document.querySelector(`[data-users-suggestion="${data.userIdB}"]`);
    if (dataUsersSuggestion) {
        const boxUserA = dataUsersSuggestion.querySelector(`[user-id="${data.userA._id}"]`);
        if (boxUserA) {
            dataUsersSuggestion.removeChild(boxUserA);
        }
    }
});
// End SERVER_RETURN_INFO_ACCEPT_FRIEND

// SERVER_RETURN_CANCEL_REQUEST
socket.on("SERVER_RETURN_CANCEL_REQUEST", (data) => {
    const dataUsersAccept = document.querySelector(`[data-users-accept="${data.userIdB}"]`);
    if (dataUsersAccept) {
        const boxUserA = dataUsersAccept.querySelector(`[user-id="${data.userIdA}"]`);
        if (boxUserA) {
            dataUsersAccept.removeChild(boxUserA);
        }
    }
});
// End SERVER_RETURN_CANCEL_REQUEST

// SERVER_RETURN_STATUS_ONLINE
socket.on("SERVER_RETURN_STATUS_ONLINE", (data) => {
    const dataUsersFriend = document.querySelector("[data-users-friend]");
    
    if (dataUsersFriend) {
        const boxUser = dataUsersFriend.querySelector(`[user-id="${data.userId}"]`);
        if (boxUser) {
            const boxInnerStatus = boxUser.querySelector(".inner-status");
            boxInnerStatus.setAttribute("status", data.statusOnline);
            boxInnerStatus.innerHTML = `
                <i class="fa-solid fa-circle"></i> ${data.statusOnline == 'online' ? 'Online' : 'Offline'}
            `
        }
    }
});
// End SERVER_RETURN_STATUS_ONLINE