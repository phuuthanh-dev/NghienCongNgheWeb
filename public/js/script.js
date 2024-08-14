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
      window.history.back();
    });
  });
}
// End button go back

// Upload Image
const uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {
  const uploadImageInput = uploadImage.querySelector("[upload-image-input]");
  const uploadImagePreview = uploadImage.querySelector("[upload-image-preview]");
  const deleteImagePreview = uploadImage.querySelector('#delete-image');
  const imageContainer = uploadImage.querySelector('.image-container');
  console.log(deleteImagePreview);
  

  uploadImageInput.addEventListener("change", () => {
    const file = uploadImageInput.files[0];
    if (file) {
      uploadImagePreview.src = URL.createObjectURL(file);
      if (deleteImagePreview) {
        imageContainer.style.display = 'inline-block';
        deleteImagePreview.style.display = 'block';
      }
    }
  });

  if (deleteImagePreview) {
    deleteImagePreview.addEventListener('click', () => {
      uploadImageInput.value = '';
      uploadImagePreview.src = '';
      imageContainer.style.display = 'none';
      deleteImagePreview.style.display = 'none';
    });
  }
}
// End Upload Image