document.addEventListener("DOMContentLoaded", function () {
    fetch("http://localhost:3000/getAllProducts")
        .then((response) => response.json())
        .then((response) => loadHTMLProducts(response.data))
});

const addProduct = document.getElementById('addProductBtn')

let tok = localStorage.getItem('accessToken');
let check;
if(tok){
    check = jwt_decode(tok);
}
if (check?.role === 'U' || check === undefined){
    addProduct.style.display = 'none'
}


const addProductInput = document.getElementById('addProductInput');

addProductInput.addEventListener('click', event => {
    event.preventDefault();

    const nameInput = document.querySelector("#name");
    const name = nameInput.value;
    nameInput.value = "";

    const sexInput = document.querySelector("#sex");
    const sex = sexInput.value;
    sexInput.value = "";

    const priceInput = document.querySelector("#price");
    const price = priceInput.value;
    priceInput.value = "";

    const descriptionInput = document.querySelector("#description");
    const description = descriptionInput.value;
    descriptionInput.value = "";

    const type_of_productInput = document.querySelector("#type_of_product");
    const type_of_product = type_of_productInput.value;
    type_of_productInput.value = "";

    const sizeInput = document.querySelector("#size");
    const size = sizeInput.value;
    sizeInput.value = "";

    const ratingInput = document.querySelector("#rating");
    const rating = ratingInput.value;
    ratingInput.value = "";

    const typeInput = document.querySelector("#type");
    const type = typeInput.value;
    typeInput.value = "";

    const seasonInput = document.querySelector("#season");
    const season = seasonInput.value;
    seasonInput.value = "";

    const collection_nameInput = document.querySelector("#collection_name");
    const collection_name = collection_nameInput.value;
    collection_nameInput.value = "";

    const img = document.querySelector('#images');

    const formData = new FormData();
    const images = [];
    for (let i = 0; i < img.files.length; i++) {
        images.push(img.files[i].name)
        formData.append('images', img.files[i]);
    }

    fetch('/insertProductJSON', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
        name: name,
        sex: sex,
        price: price,
        description: description,
        type_of_product: type_of_product,
        type: type,
        size: size,
        rating: rating,
        season: season,
        collection_name: collection_name,
        img: images.join()
        }),

    })
        .then((response) => response.json())
        .catch(error => {
            console.error(error);
        });

    fetch('/insertProductFiles', {
        method: 'POST',
        body: formData,
    })
        .then((response) => response.json())
        .catch(error => {
            console.error(error);
        });
});



function loadHTMLProducts(data) {
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
        productHtml += decodedToken?.role === 'A' ? `<button class="delete-product-btn" data-id=${Id}>Видалити</button>` : '';
        productHtml += decodedToken?.role === 'A' ? `<button class="edit-product-btn" data-id=${Id}>Змінити</button>` : '';
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
    window.location.href = `/products/${productId}`;
}