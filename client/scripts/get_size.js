var modal = document.getElementById("myModal");
var btn = document.getElementsByClassName("open-modal-btn")[0];
var span = document.getElementsByClassName("close")[0];
var calculateBtn = document.getElementById("calculate-btn");
var resultDiv = document.getElementById("result");

btn.onclick = function() {
  modal.style.display = "block";
};

span.onclick = function() {
  modal.style.display = "none";
};

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

function calculateSize() {
  var heightInput = document.getElementById("height");
  var weightInput = document.getElementById("weight");
  var height = parseInt(heightInput.value);
  var weight = parseInt(weightInput.value);
  var gender = document.querySelector('input[name="gender"]:checked');

  if (isNaN(height) || isNaN(weight) || !gender) {
    resultDiv.textContent = "Будь ласка, введіть коректні значення зрісту та ваги, а також оберіть стать.";
    return;
  }

  if (height < 150 || height > 200 || weight < 50 || weight > 90) {
    resultDiv.textContent = "Введено некоректні дані. Наша система підтримує розрахунок розміру для параметрів в таких діапазонах: Зріст (150-200 см), Вага (50-90 кг).";
    return;
  }

  var size = "";
  if (gender.value === "male") {
    if (height < 165 && weight < 60) {
      size = "S";
    } else if (height < 175 && weight < 70) {
      size = "M";
    } else if (height < 185 && weight < 75) {
      size = "L";
    } else {
      size = "XL";
    }
  } else {
    if (height < 160 && weight < 60) {
      size = "S";
    } else if (height < 170 && weight < 65) {
      size = "M";
    } else if (height < 180 && weight < 70) {
      size = "L";
    } else {
      size = "XL";
    }
  }

  resultDiv.textContent = "Рекомендовано розмір " + size;
}

document.getElementById("height").addEventListener("input", function() {
  var height = parseInt(this.value);
  if (isNaN(height) || height < 150 || height > 200) {
    this.setCustomValidity("Введено некоректні дані. Будь ласка, введіть значення в діапазоні: 150-200 см.");
  } else {
    this.setCustomValidity("");
  }
});

document.getElementById("weight").addEventListener("input", function() {
  var weight = parseInt(this.value);
  if (isNaN(weight) || weight < 50 || weight > 90) {
    this.setCustomValidity("Введено некоректні дані. Будь ласка, введіть значення в діапазоні: 50-90 кг.");
  } else {
    this.setCustomValidity("");
  }
});

calculateBtn.onclick = calculateSize;