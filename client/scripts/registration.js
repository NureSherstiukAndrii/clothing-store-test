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

    console.log(mail);
    fetch('/api/registration', {
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
        .then(() => {
                alert('Користувача зареєстровано!!!.');
        })
        .catch((error) => {
            alert('Користувач вже зареєстрований або пароль меньше 8 символів')

        });
})