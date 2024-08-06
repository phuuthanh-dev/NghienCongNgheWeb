// Phân quyền
const tablePermissions = document.querySelector("[table-permissions]");
if (tablePermissions) {
    const buttonSubmit = document.querySelector("[button-submit]");
    buttonSubmit.addEventListener("click", () => {
        const roles = [];

        const listElementRoleId = tablePermissions.querySelectorAll("[role-id]");
        for (const element of listElementRoleId) {
            const roleId = element.getAttribute("role-id");
            const role = {
                id: roleId,
                permissions: []
            };

            const listInputChecked = tablePermissions.querySelectorAll(`input[data-id="${roleId}"]:checked`);

            listInputChecked.forEach(input => {
                const dataName = input.getAttribute("data-name");
                role.permissions.push(dataName);
            });

            roles.push(role);
        }

        if (roles.length > 0) {
            const formChangePermissions = document.querySelector("[form-change-permissions]");
            const inputRoles = formChangePermissions.querySelector("input[name='permissions']");
            inputRoles.value = JSON.stringify(roles);
            formChangePermissions.submit();
        }
    });
}
// Hết Phân quyền