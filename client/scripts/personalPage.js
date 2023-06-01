document.addEventListener("DOMContentLoaded", function () {
    if(typeof decodedToken === "object"){
        fetch(`http://localhost:3000/person/${decodedToken?.id}`)
            .then((response) => response.json())
            .then((response) => loadUser(response.data))

        fetch(`http://localhost:3000/getFavorite/${decodedToken?.id}`)
            .then((response) => response.json())
            .then((response) => console.log(response))
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
                        <input type="text" id="email" value="${e_mail}">
                    </div>

                    <button type="submit">Зберегти зміни</button>
                </form>

                <h4>Аккаунт створений - ${reg_date.slice(0, 10)}</h4>
        `

    });

    profile.innerHTML = profileHtmll;
}
