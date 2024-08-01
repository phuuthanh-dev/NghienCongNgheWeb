// Button Status
const listButtonStatus = document.querySelectorAll("[button-status]");

if (listButtonStatus.length > 0) {
  let url = new URL(window.location.href);

  listButtonStatus.forEach((button) => {
    button.addEventListener("click", () => {
      const status = button.getAttribute("button-status");
      if (status) {
        url.searchParams.set("status", status);
      } else {
        url.searchParams.delete("status");
      }
      window.location.href = url.href;
    });
  });
}
// End Button Status

// Form Search
const formSearch = document.querySelector("#form-search");

if (formSearch) {
  let url = new URL(window.location.href);

  formSearch.addEventListener("submit", (event) => {
    event.preventDefault();
    const keyword = event.target.elements.keyword.value;

    if (keyword) {
      url.searchParams.set("keyword", keyword);
    } else {
      url.searchParams.delete("keyword");
    }
    window.location.href = url.href;
  });
}
// End Form Search

// Button Pagination
const listButtonPagination = document.querySelectorAll("[button-pagination]");
if (listButtonPagination.length > 0) {
  let url = new URL(window.location.href);

  listButtonPagination.forEach(button => {
    button.addEventListener("click", () => {
      const page = button.getAttribute("button-pagination");
      url.searchParams.set("page", page);
      window.location.href = url.href;
    });
  });
}
// End Button Pagination

// show-alert
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
  let time = showAlert.getAttribute("data-time");
  time = parseInt(time);

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

// Button checkbox multi
const checkboxMulti = document.querySelector("[checkbox-multi]");
if (checkboxMulti) {
  const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
  const listInputCheckbox = checkboxMulti.querySelectorAll("input[name='id']");

  inputCheckAll.addEventListener("change", () => {
    listInputCheckbox.forEach(input => {
      input.checked = inputCheckAll.checked;
    });
  });

  listInputCheckbox.forEach(input => {
    input.addEventListener("change", () => {
      let isAllChecked = true;
      listInputCheckbox.forEach(input => {
        if (!input.checked) {
          isAllChecked = false;
        }
      });
      inputCheckAll.checked = isAllChecked;
    })
  });
}
// End checkbox multi

// Form change multi
const formChangeMulti = document.querySelector("[form-change-multi]");
if (formChangeMulti) {
  formChangeMulti.addEventListener("submit", (event) => {
    event.preventDefault();
    const checkboxMulti = document.querySelector("[checkbox-multi]");
    const listInputIdChecked = checkboxMulti.querySelectorAll("input[name='id']:checked");
    const typeChange = event.target.elements.type.value;

    if (listInputIdChecked.length > 0) {
      let ids = [];

      listInputIdChecked.forEach(input => {
        const id = input.value;
        ids.push(id);
      });
      const stringIds = ids.join(", ");
      formChangeMulti.querySelector("input[name='ids']").value = stringIds;

      if (typeChange == "delete-all") {
        const isConfirm = confirm("Bạn có chắc muốn xóa những sản phẩm này?");
        if (!isConfirm) return;
      }

      formChangeMulti.submit();
    } else {
      alert("Vui lòng chọn ít nhất 1 sản phẩm để thực hiện thao tác!");
    }
  });
}
// End Form change multi