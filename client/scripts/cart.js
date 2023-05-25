const open_cart = document.getElementById("open");
const close_cart = document.getElementById("close");
const cart_container = document.getElementById("cart-container");


close_cart.addEventListener('click', () => {
    cart_container.classList.toggle('active');
});

open_cart.addEventListener('click', () => {
    cart_container.classList.toggle('active');
});
