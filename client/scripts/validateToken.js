const token = localStorage.getItem('accessToken');
const enterBtn = document.getElementById('enter-btn');
const exitBtn = document.getElementById('exit-btn');

window.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/validate-token', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.ok) {
            enterBtn.style.display = 'none'
        } else {
            exitBtn.style.display = 'none'
            localStorage.removeItem('accessToken')
        }
    } catch (error) {
        console.error('Ошибка при проверке токена:', error);
    }
});