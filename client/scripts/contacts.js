// const openModal = document.getElementById('test');
//
// const checkData = document.getElementById('checkData');
// checkData.addEventListener('click', (event) =>{
//     event.preventDefault();
//     openModal.style.display = 'block';
// })
//
// const sendBtn = document.querySelector('#sendMail');
//
// sendBtn.addEventListener('click', event => {
//     event.preventDefault();
//
//     const userNameInput = document.querySelector("#userName");
//     const userName = userNameInput.value;
//     userNameInput.value = "";
//
//     const userEmailInput = document.querySelector("#userEmail");
//     const userEmail = userEmailInput.value;
//     userEmailInput.value = "";
//
//     const userMailInput = document.querySelector("#userMail");
//     const userMail = userMailInput.value;
//     userMailInput.value = "";
//
//     const userPasswordInput = document.querySelector("#userPassword");
//     const userPassword = userPasswordInput.value;
//     userPasswordInput.value = "";
//
//     fetch('/sendEmail', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             userName: userName,
//             userEmail: userEmail,
//             userMail: userMail,
//             userPassword : userPassword
//         }),
//
//     })
//         .then((response) => response.json())
//         .catch(error => {
//             console.error(error);
//         });
//
// })