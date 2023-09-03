const tryAgainButton = document.getElementById('btn-tryAgain');

let pokemonGeneration;
let pokemonPokedexEntry;
let pokemonGenus;
let pokemonFlavorText;
let pokemonSprite;

async function getRandomPokemon() {
  try {
    const response = await fetch(
      'https://pokeapi.co/api/v2/pokemon?limit=1000'
    );
    const data = await response.json();
    const { results } = data;

    const filteredResults = results.filter(
      (pokemon) => !pokemon.name.includes('-')
    );

    const randomIndex = Math.floor(Math.random() * filteredResults.length);
    const randomPokemon = filteredResults[randomIndex];
    const pokemonResponse = await fetch(randomPokemon.url);
    const pokemonData = await pokemonResponse.json();

    const pokemonName = pokemonData.name;
    pokemonSprite = pokemonData.sprites.front_default;

    const pokemonImageHtml = document.getElementById('pokemonImage');
    pokemonImageHtml.innerHTML = `<img id="pokeSprite" class="sprite" src="${pokemonSprite}" draggable="false">`;

    const submitButton = document.getElementById('submit');
    let pokemonInput = document.getElementById('pokemonInput');

    // Remove previous event listener before adding a new one
    submitButton.addEventListener('click', handleClick);
  
    function handleClick() {
      const enteredPokemonName = pokemonInput.value.trim().toLowerCase();

      if (enteredPokemonName === '') {
        alert('Please enter a Pokémon name');
        return; // Don't proceed further
      }

      submitButton.removeEventListener('click', handleClick);

      if (enteredPokemonName === pokemonName) {
        displayResult(pokemonName, true);
      } else {
        displayResult(pokemonName, false);
      }
    }
  } catch (error) {
    console.log('Error:', error.message);
  }
}

function resetPokemonInformation() {
  let pokemonImageHtml = document.getElementById('pokemonImage');
  let result = document.getElementById('pokemonResult');
  let pokemonInput = document.getElementById('pokemonInput');

  pokemonImageHtml.innerHTML = ''; // Clear the Pokemon imag
  result.innerHTML = ''; // Clear the result message
  pokemonInput.value = '';
  tryAgainButton.style.display = 'none';
  pokemonImageHtml.classList.add('sprite-silhouette');
}

// Get the modal element and buttons
const modal = document.getElementById('myModal');
const modalResultMessage = document.getElementById('pokemonResult');
const tryAgainModalButton = document.getElementById('btn-tryAgain');

// Display the modal with the result message
function showModal(resultMessage) {
  modal.style.display = 'block';
  modalResultMessage.innerHTML = `
    <img class="modal-sprite" src="${pokemonSprite}">
    <h2 class="pokemon-name">${resultMessage}</h2>
  `;
  tryAgainModalButton.style.display = 'block';
  console.log('modal open');
}

async function displayResult(pokemonName, isCorrect) {
  let resultMessage = '';
  let pokemonImageHtml = document.getElementById('pokemonImage');

  if (isCorrect) {
    resultMessage = `You're right! It's <span>${pokemonName}</span>!`;
  } else {
    resultMessage = `Aww... It's <span>${pokemonName}</span>!`;
  }

  pokemonImageHtml.classList.remove('sprite-silhouette');

  // Show the modal with the result message
  showModal(resultMessage);
}

// Function to close the modal, reset the quiz, and get a new random Pokémon
function closeModalAndRestart() {
  modal.style.display = 'none'; // Close the modal
  resetPokemonInformation(); // Restart the quiz
  getRandomPokemon(); // Get a new random Pokémon
}

// Event listener for both the close button and "Try Again" button inside the modal
const closeButton = document.querySelector('.close');
closeButton.addEventListener('click', closeModalAndRestart);

// Event listener for the "Try Again" button inside the modal
tryAgainModalButton.addEventListener('click', closeModalAndRestart);

getRandomPokemon();

function absorbEvent_(event) {
  var e = event || window.event;
  e.preventDefault && e.preventDefault();
  e.stopPropagation && e.stopPropagation();
  e.cancelBubble = true;
  e.returnValue = false;
  return false;
}

function preventLongPressMenu(node) {
  node.ontouchstart = absorbEvent_;
  node.ontouchmove = absorbEvent_;
  node.ontouchend = absorbEvent_;
  node.ontouchcancel = absorbEvent_;
}

function init() {
  preventLongPressMenu(document.getElementById('pokeSprite'));
}
