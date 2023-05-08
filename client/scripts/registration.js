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
                password: password,
            }),

        })
            .then((response) => response.json())
            .catch(error => {
                console.error(error);
            });
})