const filter_block = document.getElementsByClassName('filter-category');
[...filter_block].forEach(block => {
    block.addEventListener('click', function(event) {
        if (this.tagName === 'DIV') {
            this.classList.toggle('active');
        }
    })
})


const applyFilters = document.getElementById('applyFilters');

applyFilters.addEventListener('click', (event) => {
    event.preventDefault()
    
    const priceFrom = document.getElementById('price-from').value;
    const priceTo = document.getElementById('price-to').value;

    const genderCheckboxes = document.querySelectorAll('input[name="gender"]:checked');
    const gender = [];

    for (let i = 0; i < genderCheckboxes.length; i++) {
        gender.push(genderCheckboxes[i].value);
    }

    const sizeCheckboxes = document.querySelectorAll('input[name="size"]:checked');
    const sizes = [];

    for (let i = 0; i < sizeCheckboxes.length; i++) {
        sizes.push(sizeCheckboxes[i].value);
    }


    const typeCheckboxes = document.querySelectorAll('input[name="type"]:checked');
    const types = [];

    for (let i = 0; i < typeCheckboxes.length; i++) {
        types.push(typeCheckboxes[i].value);
    }


    const seasonCheckboxes = document.querySelectorAll('input[name="season"]:checked');
    const seasons = [];

    for (let i = 0; i < seasonCheckboxes.length; i++) {
        seasons.push(seasonCheckboxes[i].value);
    }


    const data = {
        gender: gender,
        priceFrom: priceFrom,
        priceTo: priceTo,
        sizes: sizes,
        types: types,
        seasons: seasons
    };

    const queryParams = '?priceFrom=' + encodeURIComponent(priceFrom) +
        '&priceTo=' + encodeURIComponent(priceTo) +
        '&gender=' + encodeURIComponent(gender.join(',')) +
        '&sizes=' + encodeURIComponent(sizes.join(','))+
        '&types=' + encodeURIComponent(types.join(','))+
        '&seasons=' + encodeURIComponent(seasons.join(','));

    fetch('/applyFilters' + queryParams)
        .then(response => {
            if (response.ok) {
                console.log('GET-запрос успешно выполнен.');
            } else {
                console.error('Ошибка при выполнении GET-запроса.');
            }
        })
        .catch(error => {
            console.error('Ошибка при выполнении GET-запроса:', error);
        });
})

