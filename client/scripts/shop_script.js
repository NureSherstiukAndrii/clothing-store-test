document.addEventListener("DOMContentLoaded", function () {
    fetch("http://localhost:3000/getAllProducts")
        .then((response) => response.json())
        .then((response) => loadHTMLProducts(response.data))
});


const filter_block = document.getElementsByClassName('filter-category');
[...filter_block].forEach(block => {
    block.addEventListener('click', function(event) {
        console.log(event);
        if (this.tagName === 'DIV') {
            this.classList.toggle('active');
        }
    })
})


function loadHTMLProducts(data) {
    console.log(data);
    const allProducts = document.getElementById('products')

    if (data.length === 0) {
        allProducts.innerHTML = "<h1>Товарів немає</h1>";
        return;
    }

    let productHtml = "";

    data.forEach(({Id, Name, price}) => {
        productHtml += "<div class='product'>";
        productHtml += `<img src="" alt="product ${Id}"/>`;
        productHtml += `<h2 id='product_name-${Name}'>${Name}</h2>`;
        productHtml += `<span id='product_price-${price}'>$ ${price}</span>`
        productHtml += `<div>`
        productHtml += `<button class="delete-product-btn" data-id=${Id}>Видалити</button>`;
        productHtml += `<button class="edit-product-btn" data-id=${Id}>Змінити</button>`;
        productHtml += `</div>`
        productHtml += "</div>";
    });

    allProducts.innerHTML = productHtml;
}