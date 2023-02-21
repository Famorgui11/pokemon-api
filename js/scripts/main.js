// scripts do slide principal
var slide_hero = new Swiper(".slide-hero", {
  effect: 'fade',
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".slide-hero .main-area .area-explore .swiper-pagination",
  },
});

const cardPokemon  = document.querySelectorAll('.js-open-details-pokemon');
const btnCloseModal = document.querySelector('.js-close-modal-details-pokemon');
const countPokemons = document.getElementById('js-count-pokemons');
const areaPokemons = document.getElementById('js-list-pokemons');
const btnDropdownSelect = document.querySelector('.js-open-select-custom');
const areaTypes = document.getElementById('js-type-area');
const areaTypesMobile = document.querySelector('.dropdown-select');
const btnLoadMore = document.getElementById('js-btn-load-more');
const typeFilter = document.querySelectorAll('.type-filter');

if(btnCloseModal) {
  btnCloseModal.addEventListener('click', closeDetailsPokemon);
}

btnDropdownSelect.addEventListener('click', () => {
  btnDropdownSelect.parentElement.classList.toggle('active');
})

function capitalFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function createCardPokemon(code, type, name, imagePoke) {
  let card = document.createElement('button');
  card.classList = `card-pokemon js-open-details-pokemon ${type}`;
  card.setAttribute('code-pokemon', code);
  areaPokemons.appendChild(card);

  let image = document.createElement('div');
  image.classList = 'image';
  card.appendChild(image);

  let imageSrc = document.createElement('img');
  imageSrc.className = 'thumb-img'
  imageSrc.setAttribute('src', imagePoke);
  image.appendChild(imageSrc);

  let infoCardPokemon = document.createElement('div');
  infoCardPokemon.classList = 'info';
  card.appendChild(infoCardPokemon);

  let infoTextPokemon = document.createElement('div');
  infoTextPokemon.classList = 'text';
  infoCardPokemon.appendChild(infoTextPokemon);

  let codePokemon = document.createElement('span');
  codePokemon.textContent = (code < 10) ? `#00${code}` : (code < 100) ? `#0${code}` : `#${code}`;
  infoTextPokemon.appendChild(codePokemon);

  let namePokemon = document.createElement('h3');
  namePokemon.textContent = capitalFirstLetter(name);
  infoTextPokemon.appendChild(namePokemon);

  let areaIcon = document.createElement('div');
  areaIcon.classList = 'icon';
  infoCardPokemon.appendChild(areaIcon);

  let imgType = document.createElement('img');
  imgType.setAttribute('src', `img/icon-types/${type}.svg`);
  areaIcon.appendChild(imgType);
}

function listingPokemons(urlApi) {
  axios({
    method: 'GET',
    url: urlApi
  })
  .then((response) => {
    const countPokemons = document.getElementById('js-count-pokemons');
    const { results, next, count } = response.data;
    countPokemons.innerText = count;

    results.forEach(pokemon => {
      let urlApiDetails = pokemon.url;

      axios({
        method: 'GET',
        url: `${urlApiDetails}`
      })
      .then((response) => {
        const { name, id, sprites, types } = response.data;
        const infoCard = {
          name: name,
          code: id,
          image: sprites.other.dream_world.front_default || sprites.other.official-artwork.front_default || sprites.front_default,
          type: types[0].type.name
        }

        createCardPokemon(infoCard.code, infoCard.type, infoCard.name, infoCard.image);

        const cardPokemon  = document.querySelectorAll('.js-open-details-pokemon');

        cardPokemon.forEach(card => {
          card.addEventListener('click', openDetailsPokemon);
        })
      })
    })
  })
}

listingPokemons('https://pokeapi.co/api/v2/pokemon?limit=9&offset=0');

function openDetailsPokemon() {
  document.documentElement.classList.add('open-modal');

  let codePokemon = this.getAttribute('code-pokemon');
  let imagePokemon = this.querySelector('.thumb-img');
  let iconTypePokemon = this.querySelector('.info .icon img');
  let namePokemon = this.querySelector('.info h3');
  let codeTagPokemon = this.querySelector('.info span');

  const modalDetails = document.getElementById('js-modal-details');
  const imgPokemonModal = document.getElementById('js-image-pokemon-modal');
  const iconTypePokemonModal = document.getElementById('js-image-type-modal');
  const namePokemonModal = document.getElementById('js-name-pokemon-modal');
  const codePokemonModal = document.getElementById('js-code-pokemon-modal');
  const heightPokemonModal = document.getElementById('js-height-pokemon');
  const weightPokemonModal = document.getElementById('js-weight-pokemon');
  const mainAbilitiesModal = document.getElementById('js-main-abilities');

  imgPokemonModal.setAttribute('src', imagePokemon.getAttribute('src'));
  modalDetails.setAttribute('type-pokemon-modal', this.classList[2]);
  iconTypePokemonModal.setAttribute('src', iconTypePokemon.getAttribute('src'));

  namePokemonModal.textContent = namePokemon.textContent;
  codePokemonModal.textContent = codeTagPokemon.textContent;

  axios({
    method: 'GET',
    url: `https://pokeapi.co/api/v2/pokemon/${codePokemon}`
  })
  .then(response => {
    let data = response.data;

    let infoPokemon = {
      mainAbilities: capitalFirstLetter(data.abilities[0].ability.name),
      types: data.types,
      weight: data.weight,
      height: data.height,
      abilities: data.abilities,
      stats: data.stats,
      urlType: data.types[0].type.url
    }

    function listingTypesPokemons() {
      const areaTypesModal = document.getElementById('js-types-pokemon');

      areaTypesModal.innerHTML = "";

      let arrayTypes = infoPokemon.types;

      arrayTypes.forEach(itemType => {
        let itemList = document.createElement('li');
        areaTypesModal.appendChild(itemList);

        let spanList = document.createElement('span');
        spanList.classList = `tag-type ${itemType.type.name}`;
        spanList.textContent = capitalFirstLetter(itemType.type.name);
        itemList.appendChild(spanList);
      })
    }

    function listingWeaknesses() {
      const areaWeak = document.getElementById('js-area-weak');

      areaWeak.innerHTML = "";

      axios({
        method: 'GET',
        url: `${infoPokemon.urlType}`
      })
      .then(response => {
        let weaknesses = response.data.damage_relations.double_damage_from;

        weaknesses.forEach(itemType => {
        let itemListWek = document.createElement('li');
        areaWeak.appendChild(itemListWek);
        
        let spanList = document.createElement('span');
        spanList.classList = `tag-type ${itemType.name}`;
        spanList.textContent = capitalFirstLetter(itemType.name);
        itemListWek.appendChild(spanList);
        })
      })
    }

    heightPokemonModal.textContent = `${infoPokemon.height / 10}m`;
    weightPokemonModal.textContent = `${infoPokemon.weight / 10}kg`;
    mainAbilitiesModal.textContent = infoPokemon.mainAbilities;

    const statsHp = document.getElementById('js-stats-hp');
    const statsAttack = document.getElementById('js-stats-attack');
    const statsDefense = document.getElementById('js-stats-defense');
    const statsSpAttack = document.getElementById('js-stats-sp-attack');
    const statsSpDefense = document.getElementById('js-stats-sp-defense');
    const statsSpeed = document.getElementById('js-stats-speed');

    statsHp.style.width = `${infoPokemon.stats[0].base_stat}%`;
    statsAttack.style.width = `${infoPokemon.stats[1].base_stat}%`;
    statsDefense.style.width = `${infoPokemon.stats[2].base_stat}%`;
    statsSpAttack.style.width = `${infoPokemon.stats[3].base_stat}%`;
    statsSpDefense.style.width = `${infoPokemon.stats[4].base_stat}%`;
    statsSpeed.style.width = `${infoPokemon.stats[5].base_stat}%`;

    listingTypesPokemons();
    listingWeaknesses();
  })
}

function closeDetailsPokemon() {
  document.documentElement.classList.remove('open-modal');
}

// Aqui é o script para listar todos os tipos de pokemon

axios({
  method: 'GET',
  url: 'https://pokeapi.co/api/v2/type'
})
.then(response => {
  const { results } = response.data;
  
  results.forEach((type, index) => {

    if(index < 18) {
      let itemType = document.createElement('li');
      areaTypes.appendChild(itemType);
  
      let buttonType = document.createElement('button');
      buttonType.classList = `type-filter ${type.name}`;
      buttonType.setAttribute('code-type', index + 1);
      itemType.appendChild(buttonType);
  
      let iconType = document.createElement('div');
      iconType.classList = 'icon';
      buttonType.appendChild(iconType);
  
      let srcType = document.createElement('img');
      srcType.setAttribute('src', `img/icon-types/${type.name}.svg`);
      iconType.appendChild(srcType);

      let nameType = document.createElement('span');
      nameType.textContent = capitalFirstLetter(type.name);
      buttonType.appendChild(nameType);

      // Aqui é o preenchimento do select mobile dos tipos

      let itemTypeMobile = document.createElement('li');
      areaTypesMobile.appendChild(itemTypeMobile);
  
      let buttonTypeMobile = document.createElement('button');
      buttonTypeMobile.classList = `type-filter ${type.name}`;
      buttonTypeMobile.setAttribute('code-type', index + 1);
      itemTypeMobile.appendChild(buttonTypeMobile);
  
      let iconTypeMobile = document.createElement('div');
      iconTypeMobile.classList = 'icon';
      buttonTypeMobile.appendChild(iconTypeMobile);
  
      let srcTypeMobile = document.createElement('img');
      srcTypeMobile.setAttribute('src', `img/icon-types/${type.name}.svg`);
      iconTypeMobile.appendChild(srcTypeMobile);

      let nameTypeMobile = document.createElement('span');
      nameTypeMobile.textContent = capitalFirstLetter(type.name);
      buttonTypeMobile.appendChild(nameTypeMobile);

      const allTypes = document.querySelectorAll('.type-filter');

      allTypes.forEach(btn => {
        btn.addEventListener('click', filterByTypes);
      })
    }
  })
})

// Aqui é o script que faz a funcionalidade load more

let countPaginations = 10;

function showMorePokemons() {
  listingPokemons(`https://pokeapi.co/api/v2/pokemon?limit=9&offset=${countPaginations}`);

  countPaginations = countPaginations + 9;
}

btnLoadMore.addEventListener('click', showMorePokemons);

// Aqui é o script que filtra os pokemons por tipo

function filterByTypes() {
  let idPokemons = this.getAttribute('code-type');

  const areaPokemons = document.getElementById('js-list-pokemons');
  const btnLoadMore = document.getElementById('js-btn-load-more');
  const countPokemonsType = document.getElementById('js-count-pokemons');
  const allTypes  = document.querySelectorAll('.type-filter');

  areaPokemons.innerText = "";
  btnLoadMore.style.display = "none";

  const sectionPokemons = document.querySelector('.s-all-info-pokemons');
  const topSection = sectionPokemons.offsetTop;

  window.scrollTo({
    top: topSection + 288,
    behavior: "smooth"
  })

  allTypes.forEach(type => {
    type.classList.remove('active');
  })

  this.classList.add('active');

  if(idPokemons) {
    axios({
      method: 'GET',
      url: `https://pokeapi.co/api/v2/type/${idPokemons}`
    })
    .then((response) => {
  
      const { pokemon } = response.data;
      countPokemonsType.textContent = pokemon.length;
  
      pokemon.forEach(pok => {
        const { url } = pok.pokemon;
  
        axios({
          method: 'GET',
          url: `${url}`
        })
        .then((response) => {
          const { name, id, sprites, types } = response.data;
  
          const infoCard = {
            name: name,
            code: id,
            image: sprites.other.dream_world.front_default || sprites.other.official-artwork.front_default || sprites.front_default,
            type: types[0].type.name
          }
  
          createCardPokemon(infoCard.code, infoCard.type, infoCard.name, infoCard.image);
  
          const cardPokemon  = document.querySelectorAll('.js-open-details-pokemon');
  
          cardPokemon.forEach(card => {
            card.addEventListener('click', openDetailsPokemon);
          })
        })
      })
    })
  } else {
    areaPokemons.innerText = "";

    listingPokemons('https://pokeapi.co/api/v2/pokemon?limit=9&offset=0');

    btnLoadMore.style.display = "block";
  }
}

// Função para buscar pokemons

const btnSearch = document.getElementById('js-btn-search');
const inputSearch = document.getElementById('js-input-search');

btnSearch.addEventListener('click', searchPokemon);

inputSearch.addEventListener('keyup', (e) => {
  if(e.code === 'Enter') {
    searchPokemon();
  }
})

function searchPokemon() {
  let valueInput = inputSearch.value.toLowerCase();

  typeFilter.forEach(type => {
    type.classList.remove('active');
  })
  
  axios({
    method: 'GET',
    url: `https://pokeapi.co/api/v2/pokemon/${valueInput}`
  })
  .then((response) => {

    areaPokemons.innerHTML = '';
    btnLoadMore.style.display = 'none';
    countPokemons.textContent = 1;

    const { name, id, sprites, types } = response.data;

    const infoCard = {
      name: name,
      code: id,
      image: sprites.other.dream_world.front_default || sprites.other.official-artwork.front_default || sprites.front_default,
      type: types[0].type.name
    }

    createCardPokemon(infoCard.code, infoCard.type, infoCard.name, infoCard.image);

    const cardPokemon  = document.querySelectorAll('.js-open-details-pokemon');

    cardPokemon.forEach(card => {
      card.addEventListener('click', openDetailsPokemon);
    })
  })
  .catch((error) => {
    if (error.response) {
      areaPokemons.innerHTML = '';
      btnLoadMore.style.display = 'none';
      countPokemons.textContent = 0;
      alert('Não foi encontrado nenhum pokemon com esse Nome/ID!');
    }
  })
}