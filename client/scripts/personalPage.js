document.addEventListener("DOMContentLoaded", function () {
    if(typeof decodedToken === "object"){
        fetch(`http://localhost:3000/person/${decodedToken?.id}`)
            .then((response) => response.json())
            .then((response) => loadUser(response.data))

        fetch(`http://localhost:3000/getFavorite/${decodedToken?.id}`)
            .then((response) => response.json())
            .then((response) => loadFavorites(response))

        const userData = document.getElementById('userData');
        const favorites =  document.getElementById('userFavs');

        userData.style.display = 'flex';
        favorites.style.display = 'flex';
    }
    else{
        const log = document.getElementById('goToLog');
        log.style.display = 'block';
    }
});

function loadUser(data1) {
    const profile = document.getElementById('userData')

    if (data1.length === 0) {
        profile.innerHTML = "<a href='/login'>Авторизуйтесь</a>";
        return;
    }

    let profileHtmll = "";

    data1.forEach(({Name, e_mail, reg_date}) => {

        profileHtmll = `
            <img src="../img/profile.png" alt="user-img">

                <form>
                    <h2>Особисті дані:</h2>
                    <div class="user-data-details">
                        <label for="name">Ім'я</label>
                        <input type="text" id="name" value="${Name}">
                    </div>
                    <div class="user-data-details">
                        <label for="email">Пошта</label>
                        <input type="email" id="email" value="${e_mail}">
                    </div>

                    <button type="submit" id="changeUserBtn">Зберегти зміни</button>
                </form>

                <h4>Аккаунт створений - ${reg_date.slice(0, 10)}</h4>
        `

    });

    profile.innerHTML = profileHtmll;

    const changeUserBtn = document.getElementById('changeUserBtn');

    changeUserBtn.addEventListener('click', () => {

        const nameInput = document.querySelector("#name");
        const name = nameInput.value;
        nameInput.value = "";

        const emailInput = document.querySelector("#email");
        const email = emailInput.value;
        emailInput.value = "";


        fetch('/api/changeUserData', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: decodedToken.id,
                name: name,
                email: email,
            }),

        })
            .then((response) => response.json())
            .catch(error => {
                console.error(error);
            });
    })
}


function loadFavorites(data){
    const userFavs = document.getElementById('userFavs');

    let favoriteProduct = "";

    data.forEach(({Id, Name, price, size, images}) => {
            favoriteProduct += `
                <div class="favorite-block" onclick="showProduct(${Id})">
                  <h3 style="margin-left: 10px">Збережені</h3>
                    <div class="favorite-block-info">
                           <img id="my-image-${Id}" src="" alt="product-${Id}"> 
                           <div class="main-info">
                                    <h3>${Name}</h3>
                                    <div>
                                         <h3>$ ${price}</h3>
                                         <span>Розмір: ${size}</span>
                                    </div>
                           </div>
                    </div>

                </div>
            `

        fetch(`/api/cloud-img?filename=${images[0]}`)
            .then(response => response.json())
            .then(data => {
                const img = document.getElementById(`my-image-${Id}`);
                img.src = data.url;
            })
            .catch(error => console.error(error));
    })

    userFavs.innerHTML += favoriteProduct;


    $('#userFavs').slick({
        infinite: true,
        autoplay: true,
        speed: 500,
        fade: true,
        cssEase: 'linear',
    });


}

function showProduct(productId) {
    window.location.href = `/products/${productId}`;
}