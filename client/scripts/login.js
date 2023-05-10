const enter = document.getElementById('enter');

enter.addEventListener('click', event => {
    event.preventDefault();

    const mailInput = document.querySelector("#email");
    const mail = mailInput.value;
    mailInput.value = "";

    const passwordInput = document.querySelector("#password");
    const password = passwordInput.value;
    passwordInput.value = "";

    fetch('/loginUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            mail: mail,
            password: password
        })
    })
        .then(response => response.json())
        .then(data => {
            const userData = data.data;
            console.log(userData);
            if (userData === null){
                alert('Невірний логін чи пароль');
            }
            else{
                alert(`Вітаємо ${userData.Name}`)
                location.href = '/'
            }
        })
    .catch(error => {
        console.error(error);
    });

    })
