const enter = document.getElementById('enter');
const accessToken = localStorage.getItem('accessToken')
enter.addEventListener('click', event => {
    event.preventDefault();

    const mailInput = document.querySelector("#email");
    const mail = mailInput.value;
    mailInput.value = "";

    const passwordInput = document.querySelector("#password");
    const password = passwordInput.value;
    passwordInput.value = "";

    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
            mail: mail,
            password: password
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data.user);
            if (data.accessToken) {
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('userId', data.user.id);

                window.location.href = '/';
            } else {
                alert('Токен не найден');
            }
        })
        .catch(error => {
            console.error(error);
        });

})