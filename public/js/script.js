// show-alert
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
  const time = parseInt(showAlert.getAttribute("data-time"));

  // Sau time giây sẽ đóng thông báo
  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time);

  // Khi click vào nút close-alert sẽ đóng luôn
  const closeAlert = showAlert.querySelector("[close-alert]");
  closeAlert.addEventListener("click", () => {
    showAlert.classList.add("alert-hidden");
  });
}
// End show-alert

// Button go back
const btnGoBack = document.querySelectorAll("[button-go-back]");
if (btnGoBack && btnGoBack.length > 0) {
  btnGoBack.forEach((btn) => {
    btn.addEventListener("click", () => {
      console.log(history);

      // window.history.back();
    });
  });
}
// End button go back