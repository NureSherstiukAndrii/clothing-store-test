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

    data1.forEach(({Id, Name, price, description,type, img}) => {


        productHtmll += `<!doctype html>`;
        productHtmll += `<head>`;
        productHtmll += `<meta charset="UTF-8">`;
        productHtmll += `<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">`;
        productHtmll += `<meta http-equiv="X-UA-Compatible" content="ie=edge">`;
        productHtmll += `<link rel="stylesheet" type='text/css'  href="../styles/style_productPage.css">`;
        productHtmll += `<link rel="preconnect" href="https://fonts.googleapis.com">`;
        productHtmll += `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`;
        productHtmll += `<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300&display=swap" rel="stylesheet">`;
        productHtmll += `<title>Product page</title>`;
        productHtmll += `</head>`;
        productHtmll += `<body>`;
        productHtmll += `<header>`;
        productHtmll += `<div class="header-content">`;
        productHtmll += `<div class="logo">`;
        productHtmll += `<a href="/"><img src="../img/logo.png" alt="logo"></a>`;
        productHtmll += `<span>Our logo</span>`;
        productHtmll += `</div>`;
        productHtmll += `<div class="navigation">`;
        productHtmll += `<div class="navigation-block">`;
        productHtmll += `<a href="/about" class="navigation-block-btn">Про нас</a>`;
        productHtmll += `<a href="/shop" class="navigation-block-btn">Магазин</a>`;
        productHtmll += `<a href="/size" class="navigation-block-btn">Розмірна сітка</a>`;
        productHtmll += `<a href="/contacts" class="navigation-block-btn">Зв'язок з нами</a>`;
        productHtmll += `</div>`;
        productHtmll += `<div class="navigation-account-links">`;
        productHtmll += `<div style="display: flex">`;
        productHtmll += `<img src="../img/account.png" alt="account"><a href="/login">Увійти</a>`;
        productHtmll += `</div>`;
        productHtmll += `<div>`;
        productHtmll += `<a href=""><img src="../img/basket.png" alt="basket"></a><span>0</span>`;
        productHtmll += `</div>`;
        productHtmll += `</div>`;
        productHtmll += `</div>`;
        productHtmll += `</div>`;
        productHtmll += `</header>`;
        productHtmll += `<div class = "main">`;
        productHtmll += `<div class="product-info">`;
        productHtmll += `<div class = "left">`;
        productHtmll += `<div class="title">`;
        productHtmll += `<a href="/" class = "title-link">Home </a>/ ${type}`;
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
        productHtmll += `<p>`;
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
        productHtmll += `</optgroup>`;
        productHtmll += `</select>`;
        productHtmll += `<br> <br>`;
        productHtmll += `Кількість <br>`;
        productHtmll += `<input type="number" id="quantity" name="quantity" min="1" max="10" value="1">`;
        productHtmll += `<br> <br>`;
        productHtmll += `<input type="submit" value="Додати до кошика">`;
        productHtmll += `</form>`;
        productHtmll += `</div>`;
        productHtmll += `<div class="description">`;
        productHtmll += `<h2>Опис товару</h2>`;
        productHtmll += `${description}`;
        productHtmll += `</div>`;
        productHtmll += `</div>`;
        productHtmll += `</div>`;
        productHtmll += `</div>`;
        productHtmll += `<footer>`;
        productHtmll += `<img src="../img/logo.png" alt="logo">`;
        productHtmll += `<div class="mail">`;
        productHtmll += `<span>Свої питання пишить нам на пошту: </span>`;
        productHtmll += `<a href="mailto:ourchop@gmail.com">ourchop@gmail.com</a>`;
        productHtmll += `</div>`;
        productHtmll += `<div class="social-media">`;
        productHtmll += `<img src="../img/instagram.png" alt="insta">`;
        productHtmll += `<img src="../img/telegram.png" alt="tg">`;
        productHtmll += `<img src="../img/tiktok.png" alt="tiktok">`;
        productHtmll += `</div>`;
        productHtmll += `</footer>`;
        productHtmll += `</body>`;
        productHtmll += `</html`;


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
