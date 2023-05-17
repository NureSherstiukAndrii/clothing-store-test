const open_cart = document.getElementById("open")
const close_cart = document.getElementById("close")
const cart_container = document.getElementById("cart-container")
const body = document.querySelector('body');

close_cart.addEventListener('click', (event) => {
    cart_container.classList.toggle('active')
})

open_cart.addEventListener('click', (event) => {
    cart_container.classList.toggle('active')
});
