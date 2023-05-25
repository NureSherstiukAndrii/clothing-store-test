const userId = localStorage.getItem('accessToken');

const enterBtn = document.getElementById('enter-btn')
const exitBtn = document.getElementById('exit-btn')

if(userId){
    enterBtn.style.display = 'none'
}
else{
    exitBtn.style.display = 'none'
}