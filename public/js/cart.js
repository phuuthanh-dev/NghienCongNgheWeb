// Update Cart
const tableCart = document.querySelector("[table-cart]");
if (tableCart) {
    const listInputQuantity = tableCart.querySelectorAll("input[name='quantity']");
    listInputQuantity.forEach(input => {
        input.addEventListener("change", () => {
            const quantity = input.value;
            const productId = input.getAttribute("item-id");
            if (quantity > 0) {
                window.location.href = `/cart/update/${productId}/${quantity}`;
            } else {
                input.value = 1;
            }
        });
    });
}
// End Update Cart