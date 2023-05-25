const exit = document.getElementById('exit-btn');
exit.addEventListener('click', () => {
    localStorage.removeItem('accessToken')
    window.location = '/login'
})