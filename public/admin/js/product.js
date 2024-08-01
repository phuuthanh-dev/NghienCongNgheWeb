// Button-change-status
const listButtonChangeStatus = document.querySelectorAll("[button-change-status]");
if (listButtonChangeStatus.length > 0) {
  const formChangeStatus = document.querySelector("[form-change-status]");
  const path = formChangeStatus.getAttribute("data-path");

  listButtonChangeStatus.forEach(button => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-id");
      const statusCurrent = button.getAttribute("data-status");
      const statusChange = statusCurrent === "active" ? "inactive" : "active";

      const action = `${path}/${statusChange}/${id}?_method=PATCH`;

      formChangeStatus.action = action;
      formChangeStatus.submit();
    });
  });
}
// End button-change-status

// Delete Item
const buttonDelete = document.querySelectorAll("[button-delete]");
if (buttonDelete.length > 0) {
  const formDelete = document.querySelector("[form-delete-item]");
  const path = formDelete.getAttribute("data-path");
  
  buttonDelete.forEach(button => {
    button.addEventListener("click", () => {
      const isConfirm = confirm("Bạn có chắc chắn muốn xóa không?");
      if (!isConfirm) return;

      const id = button.getAttribute("data-id");
      const action = `${path}/${id}?_method=DELETE`;

      formDelete.action = action;
      formDelete.submit();
    });
  });
}
// End Delete Item