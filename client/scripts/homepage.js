const loadProducts = (data, documentId) =>{
    const isAdmin = decodedToken?.role === "A";

    const allProducts = document.getElementById(documentId);

    if (data.length === 0) {
        allProducts.innerHTML = "<h1>Товарів немає</h1>";
        return;
    }

    let productHtml = "";

    data.forEach(({Id, Name, price, images}) => {

        productHtml += `<div class='product' onclick="showProduct(${Id})">`;
        productHtml += `<img id="my-image-${Id}" src="" alt="product ${Id}"/>`;
        productHtml += `<h2 id='product_name-${Name}'>${Name}</h2>`;
        productHtml += `<span id='product_price-${price}'>$ ${price}</span>`
        productHtml += `<div>`
        productHtml += `${isAdmin ? `<button class="delete-product-btn" data-id=${Id}>Видалити</button>` : ''}`;
        productHtml += `${isAdmin ? `<button class="edit-product-btn" data-id=${Id}>Змінити</button>` : ''}`;
        productHtml += `</div>`
        productHtml += "</div>";

        fetch(`/api/cloud-img?filename=${images[0]}`)
            .then(response => response.json())
            .then(data => {
                const img = document.getElementById(`my-image-${Id}`);
                img.src = data.url;
            })
            .catch(error => console.error(error));

    })
allProducts.innerHTML = productHtml;
}

function showProduct(productId) {
    window.location.href = `/products/${productId}`;
}

document.addEventListener("DOMContentLoaded", function () {
    fetch("http://localhost:3000/getTopClothes")
        .then((response) => response.json())
        .then((response) => loadProducts(response.data, 'top_cloths'))

    fetch("http://localhost:3000/getRecentClothes")
        .then((response) => response.json())
        .then((response) => loadProducts(response.data, 'recent'))
});
