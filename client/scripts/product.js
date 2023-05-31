const productId = window.location.pathname.split('/')[2];
document.addEventListener("DOMContentLoaded", function () {
    const loader = document.getElementById("loader");
    loader.style.display = "flex";

    fetch(`http://localhost:3000/product/${productId}`)
        .then((response) => response.json())
        .then((response) => {
            fetch(`http://localhost:3000/getAllProductsSizeForName?product=${response.data[0].Name}`)
                .then(response => response.json())
                .then(data => addOption(data))
                .catch(error => {
                    console.error('Произошла ошибка:', error);
                });
            loadProduct(response.data);
            loader.style.display = "none";
        });
});

function addOption(data) {
    const selectProductSize = document.getElementById('size');

    data.forEach((item, index) => {
        const option = document.createElement("option")
        option.innerHTML = data[index].size;
        selectProductSize.append(option);
    })
}

function loadProduct(data1) {
    const product = document.getElementById('product')

    if (data1.length === 0) {
        product.innerHTML = "<h1>Товару нема</h1>";
        return;
    }

    let productHtmll = "";

    data1.forEach(({Id, Name, price, description,type_of_product, images, season}) => {
        productHtmll += `<div class = "main">`;
        productHtmll += `<div class="product-info">`;
        productHtmll += `<div class = "left">`;
        productHtmll += `<div class="title">`;
        productHtmll += `<a href="/" class = "title-link">Home </a>/ ${type_of_product}`;
        productHtmll += `</div>`;
        productHtmll += `<div class="clothes-photo">`;
        productHtmll += `<img id="my-image-${Id}" class = "photo" src="" alt="">`;
        productHtmll += `</div>`;
        productHtmll += `</div>`;
        productHtmll += `<div class="right">`;
        productHtmll += `<div class="clothes-name">`;
        productHtmll += `<h2 id="product_name">`;
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
        productHtmll += `</select>`;
        productHtmll += `<br> <br>`;
        productHtmll += `<input type="submit" value="Додати до кошика" id="addToCart">`;
        productHtmll += `<div class="heart"><div/>`
        productHtmll += `</form>`;
        productHtmll += `</div>`;
        productHtmll += `<div class="description">`;
        productHtmll += `<h2>Опис товару</h2>`;
        productHtmll += `${description}`;
        productHtmll += `<br> <br>`;
        productHtmll += `<div id="season">`;
        productHtmll += `Рекомендована пора року: ${season}`;
        productHtmll += `</div>`;
        productHtmll += `</div>`;
        productHtmll += `</div>`;
        productHtmll += `</div>`;
        productHtmll += `</div>`;


        fetch(`/api/cloud-img?filename=${images[0]}`)
            .then(response => response.json())
            .then(data => {
                const img = document.getElementById(`my-image-${Id}`);
                img.src = data.url;
            })
            .catch(error => console.error(error));
    });
        product.innerHTML = productHtmll;

    const addToCart = document.getElementById('addToCart');


    addToCart.addEventListener('click', event => {
        event.preventDefault();

        const name = document.getElementById('product_name').textContent;
        const size = document.getElementById('size').value;

        fetch(`http://localhost:3000/productForNameAndSize?name=${name}&size=${size}`)
            .then((response) => response.json())
            .then((response) => {
                fetch('/insertIntoCart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userId: decodedToken.id,
                        productId: response,
                        is_cart:1
                    }),

                })
                    .then((response) => response.json())
                    .then(() =>     fetch(`http://localhost:3000/getCart/${decodedToken?.id}`)
                        .then(response => response.json())
                        .then(data => loadCart(data))
                        .catch(error => {
                            console.error('Произошла ошибка:', error);
                        }))
                    .catch(error => {
                        console.error(error);
                    });
            });



    })
}

