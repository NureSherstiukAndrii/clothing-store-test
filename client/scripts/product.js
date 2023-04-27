const productId = window.location.pathname.split('/')[2];


document.addEventListener("DOMContentLoaded", function () {
    fetch(`http://localhost:3000/product/${productId}`)
        .then((response) => response.json())
        .then((response) => loadProduct(response.data))
});

function loadProduct(data1) {

    const product = document.getElementById('product')

    if (data1.length === 0) {
        product.innerHTML = "<h1>Товару нема</h1>";
        return;
    }

    let productHtmll = "";

    data1.forEach(({Id, Name, sex, price, description, type_of_product,type,size,rating, season,collection_name, img}) => {


        productHtmll += `<div class='product'">`;
        productHtmll += `<h2 id='product_name-${Name}'>${Name}</h2>`;
        productHtmll += `<span id='product_price-${price}'>$ ${price}</span>`
        productHtmll += `<div>`
        productHtmll += `<button class="delete-product-btn" data-id=${Id}>Видалити</button>`;
        productHtmll += `<button class="edit-product-btn" data-id=${Id}>Змінити</button>`;
        productHtmll += `</div>`
        productHtmll += "</div>";


        // fetch(`/api/cloud-img?filename=${images[0]}`)
        //     .then(response => response.json())
        //     .then(data => {
        //         const img = document.getElementById(`my-image-${Id}`);
        //         img.src = data.url;
        //     })
        //     .catch(error => console.error(error));
    });

    product.innerHTML = productHtmll;
}
