const modal = document.getElementById('editPersonalData')
const edit = document.getElementById("edit");
const close = document.getElementsByClassName("close1");

function editData() {
    if (edit) {
        modal.style.display = "none";
    } else if (close) {
        modal.style.display = "none";
    }
}
