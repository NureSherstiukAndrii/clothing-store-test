const productId = window.location.pathname.split('/')[2];


document.addEventListener("DOMContentLoaded", function () {
    // Получение элемента с значком загрузки
    const loader = document.getElementById("loader");

    // Показ значка загрузки
    loader.style.display = "flex";

    fetch(`http://localhost:3000/product/${productId}`)
        .then((response) => response.json())
        .then((response) => {
            // Обработка полученных данных
            loadProduct(response.data);

            // Скрытие значка загрузки
            loader.style.display = "none";
        });
});

function loadProduct(data1) {

    const product = document.getElementById('product')

    if (data1.length === 0) {
        product.innerHTML = "<h1>Товару нема</h1>";
        return;
    }

    let productHtmll = "";

    data1.forEach(({Id, Name, price, description,type_of_product, img}) => {
        productHtmll += `<div class = "main">`;
        productHtmll += `<div class="product-info">`;
        productHtmll += `<div class = "left">`;
        productHtmll += `<div class="title">`;
        productHtmll += `<a href="/" class = "title-link">Home </a>/ ${type_of_product}`;
        productHtmll += `</div>`;
        productHtmll += `<div class="clothes-photo">`;
        productHtmll += `<img class = "photo" src="../img/product-photo.png" alt="">`;
        productHtmll += `</div>`;
        productHtmll += `</div>`;
        productHtmll += `<div class="right">`;
        productHtmll += `<div class="clothes-name">`;
        productHtmll += `<h2>`;
        productHtmll += `${Name}`;
        productHtmll += `</h2>`;
        productHtmll += `<p id="productId">`;
        productHtmll += `Код товару: ${Id}`;
        productHtmll += `</p>`;
        productHtmll += `</div>`;
        productHtmll += `<div class="form">`;
        productHtmll += `<p>`;
        productHtmll += `${price} грн`;
        productHtmll += `</p>`;
        productHtmll += `<form>`;
        productHtmll += `Розмір <br>`;
        productHtmll += `<select id="size" name="size">`;
        productHtmll += `<option value="s">S</option>`;
        productHtmll += `<option value="m">M</option>`;
        productHtmll += `<option value="l">L</option>`;
        productHtmll += `<option value="xl">XL</option>`;
        productHtmll += `</select>`;
        productHtmll += `<br> <br>`;
        productHtmll += `Кількість <br>`;
        productHtmll += `<input type="number" id="quantity" name="quantity" min="1" max="10" value="1">`;
        productHtmll += `<br> <br>`;
        productHtmll += `<input type="submit" value="Додати до кошика" id="addToCart">`;
        productHtmll += `<input id="heart" type="checkbox"/>`
        productHtmll += `</form>`;
        productHtmll += `</div>`;
        productHtmll += `<div class="description">`;
        productHtmll += `<h2>Опис товару</h2>`;
        productHtmll += `${description}`;
        productHtmll += `</div>`;
        productHtmll += `</div>`;
        productHtmll += `</div>`;
        productHtmll += `</div>`;


        // fetch(`/api/cloud-img?filename=${images[0]}`)
        //     .then(response => response.json())
        //     .then(data => {
        //         const img = document.getElementById(`my-image-${Id}`);
        //         img.src = data.url;
        //     })
        //     .catch(error => console.error(error));
    });
        product.innerHTML = productHtmll;

    const addToCart = document.getElementById('addToCart');

    addToCart.addEventListener('click', event => {
        event.preventDefault();

        const userId = localStorage.getItem('userId')
        const productId = localStorage.getItem('userId')

        fetch('/insertIntoCart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: userId,
                productId: productId,
            }),

        })
            .then((response) => response.json())
            // .then(() => location.reload())
            .catch(error => {
                console.error(error);
            });
    })
}

