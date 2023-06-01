let tok = localStorage.getItem('accessToken');
let check;
if(tok) {
    check = jwt_decode(tok);
}

fetch(`http://localhost:3000/getCart/${check?.id}`)
    .then(response => response.json())
    .then(data => loadCartPage(data))
    .catch(error => {
        console.error('Произошла ошибка:', error);
    });

document
    .addEventListener("click", function (event) {
        if (event.target.className === "delete-from-cart-btn") {
            deleteFromCart(event.target.dataset.id);
        }
    });

function deleteFromCart(id){
    fetch(`/deleteFromCart_Fav?userId=${check.id}&product_id=${id}&is_cart=1`, {
        method: "DELETE",
    })
        .then((response) => response.json())
        .then(() => {
            fetch(`http://localhost:3000/getCart/${check?.id}`)
                .then(response => response.json())
                .then(data => loadCartPage(data))
                .catch(error => {
                    console.error('Произошла ошибка:', error);
                });
        })
        .catch((error) => console.error(error));
}

function loadCartPage(data){
    const total_price = document.getElementById('myCartProductsPrice');
    total_price.innerHTML = `$ ${data.total_price}`

    const cartBlock = document.getElementById('myCartProducts')
    if (data.result.length === 0) {
        cartBlock.innerHTML = "<h1>Корзина пуста</h1>";
        return;
    }

    let cartBlockHtml = "";

    data.result.forEach(({ Id, Name, price, size, images }) => {
        cartBlockHtml += `
        <div class='cart-product' id="cart-product-${Id}">
            <div class="cart-product-info">
                <img id="cart-product-image-${Id}" class="product-img" src="" alt="product ${Id}"/>
                <div>
                    <h2 class='product-cart-name'>${Name}</h2>
                    <h3 id='product_size-${size}' class="size">Розмір: ${size}</h3>   
                </div>
            </div>
            
            <div class="delete-from-cart-block">
                <h3 id='product_price-${price}' class="price">$ ${price}</h3>   
                <img src="../img/garbage.png" class="delete-from-cart-btn"  id="deleteFromCart" alt="garbage" data-id=${Id}>
            </div>

        </div>`;

        fetch(`/api/cloud-img?filename=${images[0]}`)
            .then(response => response.json())
            .then(data => {
                const img = document.getElementById(`cart-product-image-${Id}`);
                img.src = data.url;
            })
            .catch(error => console.error(error));
    });

    cartBlock.innerHTML = cartBlockHtml;

}