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