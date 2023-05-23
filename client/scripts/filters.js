const filter_block = document.getElementsByClassName('filter-category');
[...filter_block].forEach(block => {
    block.addEventListener('click', function(event) {
        if (this.tagName === 'DIV') {
            this.classList.toggle('active');
        }
    })
})


const applyFilters = document.getElementById('applyFilters');

applyFilters.addEventListener('click', (event) => {
    event.preventDefault()

    const priceFrom = document.getElementById('price-from').value;
    const priceTo = document.getElementById('price-to').value;

    const genderCheckboxes = document.querySelectorAll('input[name="gender"]:checked');
    const gender = [];

    for (let i = 0; i < genderCheckboxes.length; i++) {
        gender.push(genderCheckboxes[i].value);
    }

    const sizeCheckboxes = document.querySelectorAll('input[name="size"]:checked');
    const sizes = [];

    for (let i = 0; i < sizeCheckboxes.length; i++) {
        sizes.push(sizeCheckboxes[i].value);
    }


    const typeCheckboxes = document.querySelectorAll('input[name="type"]:checked');
    const types = [];

    for (let i = 0; i < typeCheckboxes.length; i++) {
        types.push(typeCheckboxes[i].value);
    }


    const seasonCheckboxes = document.querySelectorAll('input[name="season"]:checked');
    const seasons = [];

    for (let i = 0; i < seasonCheckboxes.length; i++) {
        seasons.push(seasonCheckboxes[i].value);
    }

    const queryParams = '?priceFrom=' + encodeURIComponent(priceFrom) +
        '&priceTo=' + encodeURIComponent(priceTo) +
        '&gender=' + encodeURIComponent(gender.join(',')) +
        '&sizes=' + encodeURIComponent(sizes.join(','))+
        '&types=' + encodeURIComponent(types.join(','))+
        '&seasons=' + encodeURIComponent(seasons.join(','))+
        '&orderBy=' + '';

    fetch('/applyFilters' + queryParams)
        .then((response) => response.json())
        .then((response) => loadHTMLProducts2(response.data))
        .catch(error => {
            console.error('Ошибка при выполнении GET-запроса:', error);
        });
})

const sorting = document.querySelector('#sorting');

sorting.addEventListener('click', (event) => {
    event.preventDefault();

    const sortingValue = document.querySelector('#sorting option:checked').value;


    const priceFrom = document.getElementById('price-from').value;
    const priceTo = document.getElementById('price-to').value;

    const genderCheckboxes = document.querySelectorAll('input[name="gender"]:checked');
    const gender = [];

    for (let i = 0; i < genderCheckboxes.length; i++) {
        gender.push(genderCheckboxes[i].value);
    }

    const sizeCheckboxes = document.querySelectorAll('input[name="size"]:checked');
    const sizes = [];

    for (let i = 0; i < sizeCheckboxes.length; i++) {
        sizes.push(sizeCheckboxes[i].value);
    }


    const typeCheckboxes = document.querySelectorAll('input[name="type"]:checked');
    const types = [];

    for (let i = 0; i < typeCheckboxes.length; i++) {
        types.push(typeCheckboxes[i].value);
    }


    const seasonCheckboxes = document.querySelectorAll('input[name="season"]:checked');
    const seasons = [];

    for (let i = 0; i < seasonCheckboxes.length; i++) {
        seasons.push(seasonCheckboxes[i].value);
    }

    const queryParams = '?priceFrom=' + encodeURIComponent(priceFrom) +
        '&priceTo=' + encodeURIComponent(priceTo) +
        '&gender=' + encodeURIComponent(gender.join(',')) +
        '&sizes=' + encodeURIComponent(sizes.join(','))+
        '&types=' + encodeURIComponent(types.join(','))+
        '&seasons=' + encodeURIComponent(seasons.join(','))+
        '&orderBy=' + encodeURIComponent(sortingValue);

    fetch('/applyFilters' + queryParams)
        .then((response) => response.json())
        .then((response) => loadHTMLProducts2(response.data))
        .catch(error => {
            console.error('Ошибка при выполнении GET-запроса:', error);
        });
})

function loadHTMLProducts2(data) {
    const uniqueNamesArray = Array.from(new Set(data.map(item => item.Name)));
    const uniqueObjectsArray = uniqueNamesArray.map(name => data.find(item => item.Name === name));

    const allProducts = document.getElementById('products')

    if (uniqueObjectsArray.length === 0) {
        allProducts.innerHTML = "<h1>Товарів немає</h1>";
        return;
    }

    let productHtml = "";

    uniqueObjectsArray.forEach(({Id, Name, price, images}) => {

        productHtml += `<div class='product' onclick="showProduct(${Id})">`;
        productHtml += `<img id="my-image-${Id}" src="" alt="product ${Id}"/>`;
        productHtml += `<h2 id='product_name-${Name}'>${Name}</h2>`;
        productHtml += `<span id='product_price-${price}'>$ ${price}</span>`
        productHtml += `<div>`
        productHtml += isAdmin === 'true' ? `<button class="delete-product-btn" data-id=${Id}>Видалити</button>` : '';
        productHtml += isAdmin === 'true' ? `<button class="edit-product-btn" data-id=${Id}>Змінити</button>` : '';
        productHtml += `</div>`
        productHtml += "</div>";


        fetch(`/api/cloud-img?filename=${images[0]}`)
            .then(response => response.json())
            .then(data => {
                const img = document.getElementById(`my-image-${Id}`);
                img.src = data.url;
            })
            .catch(error => console.error(error));
    });

    allProducts.innerHTML = productHtml;
}

function showProduct(productId) {
    // Перенаправляем пользователя на новую страницу с выбранным продуктом
    window.location.href = `/products/${productId}`;
}

let resetButton = document.getElementById('reset-btn');

resetButton.addEventListener('click', function() {
    let filtersForm = document.getElementById('filters-form');
    filtersForm.reset();
    fetch("http://localhost:3000/getAllProducts")
        .then((response) => response.json())
        .then((response) => loadHTMLProducts(response.data))
});

