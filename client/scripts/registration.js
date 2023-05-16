const addUser = document.getElementById('addUser');

addUser.addEventListener('click', event => {
    event.preventDefault();

    const nameInput = document.querySelector("#name");
    const name = nameInput.value;
    nameInput.value = "";

    const mailInput = document.querySelector("#email");
    const mail = mailInput.value;
    mailInput.value = "";

    const passwordInput = document.querySelector("#password");
    const password = passwordInput.value;
    passwordInput.value = "";

    fetch('/insertNewUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            mail: mail,
            password: password
        })
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Ошибка при выполнении запроса.');
            }
            return response.json();
        })
        .then((data) => {
            if (data.success) {
                console.log('Пользователь успешно добавлен в базу данных.');
                // Дополнительные действия при успешном добавлении пользователя
            } else {
                console.log('Ошибка при добавлении пользователя:', data.message);
            }
        })
        .catch((error) => {
            alert("Пользователь уже зарегестрирован");
        });

        // fetch('/insertNewUser', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({
        //         name: name,
        //         mail: mail,
        //         password: password,
        //     }),
        //
        // })
        //     .then((response) => console.log(response))
        //     .then(data => console.log(data))
        //     .catch(error => {
        //         console.error(error);
        //     });
})